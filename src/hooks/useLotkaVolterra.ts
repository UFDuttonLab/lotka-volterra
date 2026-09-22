import { useState, useEffect, useCallback, useRef } from 'react';

type ModelType = 'competition' | 'predator-prey';

interface CompetitionParameters {
  r1: number; // Growth rate species 1
  r2: number; // Growth rate species 2
  K1: number; // Carrying capacity species 1
  K2: number; // Carrying capacity species 2
  a12: number; // Competition coefficient (effect of species 2 on species 1)
  a21: number; // Competition coefficient (effect of species 1 on species 2)
  N1_0: number; // Initial population species 1
  N2_0: number; // Initial population species 2
}

interface PredatorPreyParameters {
  r1: number; // Prey intrinsic growth rate
  r2: number; // Predator death rate
  a: number; // Predation rate
  b: number; // Predator conversion efficiency
  N1_0: number; // Initial prey population
  N2_0: number; // Initial predator population
}

type Parameters = CompetitionParameters & PredatorPreyParameters;

interface DataPoint {
  time: number;
  species1: number;
  species2: number;
}

// Integration step h, held fixed. Playback speed is a separate control
// (steps per frame) so that changing speed never changes numerical
// accuracy or the meaning of the time axis.
const TIME_STEP = 0.01;
const UPDATE_INTERVAL = 50; // ms per animation frame
const MIN_SPEED = 1;
const MAX_SPEED = 20;
// Samples retained at full resolution. 8000 steps of h = 0.01 is 80 time
// units, roughly ten predator-prey cycles. Older samples scroll off the left
// rather than being thinned: thinning progressively, as an overflow-and-halve
// scheme does, strips the peaks out of a sharp population spike and draws the
// early part of a run as a smooth glide that never happened.
const RAW_WINDOW = 8000;
// Samples handed to the chart. The window is decimated by one constant stride,
// so spacing on the time axis stays uniform across the whole plot. 800 is about
// one sample per pixel of chart width.
const MAX_POINTS = 800;
// The charts are the expensive part of a frame: a full redraw costs roughly
// 65 ms, against a 50 ms frame. Publishing the series at most every
// CHART_PUBLISH_MS leaves the integrator enough of the main thread to hold its
// nominal step rate. The numeric readouts still update every frame.
const CHART_PUBLISH_MS = 200;
const EXTINCTION_THRESHOLD = 1e-9;
const FRACTIONAL_THRESHOLD = 1.0;

interface ConservedQuantityState {
  current: number;
  initial: number;
  isConserved: boolean;
  driftPercent: number;
  absoluteDrift: number;
}

interface SimulationState {
  steps: number;
  time: number;
  N1: number;
  N2: number;
  raw: DataPoint[];
  initialH: number;
}

// Both models are autonomous, so t never enters the derivatives and is only an
// axis coordinate. Deriving it from an integer step count instead of summing h
// keeps the error from accumulating, and rounding gives axis labels that read
// as 0.06 rather than 0.060000000000000005.
function stepTime(steps: number): number {
  return Math.round(steps * TIME_STEP * 1e6) / 1e6;
}

// Decimates by one constant stride, counting back from the end so the newest
// sample is always kept and the chart head tracks the simulation.
function decimate(series: DataPoint[], maxPoints: number): DataPoint[] {
  if (series.length <= maxPoints) return series;
  const stride = Math.ceil(series.length / maxPoints);
  const last = series.length - 1;
  return series.filter((_, i) => (last - i) % stride === 0);
}

export function useLotkaVolterra() {
  const [modelType, setModelType] = useState<ModelType>('predator-prey');
  const [parameters, setParameters] = useState<Parameters>({
    // Competition parameters - weak mutual competition, gives coexistence
    r1: 1.0,
    r2: 0.8,
    K1: 80,
    K2: 120,
    a12: 0.6,
    a21: 1.0,
    // Predator-prey parameters - equilibrium at (r2/b, r1/a) = (10.7, 10)
    a: 0.1,
    b: 0.075,
    N1_0: 40,
    N2_0: 9,
  });

  const [data, setData] = useState<DataPoint[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentPopulations, setCurrentPopulations] = useState({
    N1: parameters.N1_0,
    N2: parameters.N2_0,
  });
  const [speed, setSpeed] = useState(1); // integration steps per frame

  const [conservedQuantity, setConservedQuantity] = useState<ConservedQuantityState>({
    current: NaN,
    initial: NaN,
    isConserved: true,
    driftPercent: 0,
    absoluteDrift: 0,
  });

  const [populationWarnings, setPopulationWarnings] = useState<{
    nearExtinction: boolean;
    attoFoxProblem: boolean;
  }>({ nearExtinction: false, attoFoxProblem: false });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPublishRef = useRef(0);
  const simRef = useRef<SimulationState>({
    steps: 0,
    time: 0,
    N1: parameters.N1_0,
    N2: parameters.N2_0,
    raw: [],
    initialH: NaN,
  });

  // First integral of the predator-prey system.
  // For dN1/dt = r1*N1 - a*N1*N2 and dN2/dt = -r2*N2 + b*N1*N2,
  // H = r2*ln(N1) + r1*ln(N2) - b*N1 - a*N2 satisfies dH/dt = 0.
  // Note the pairing: b multiplies N1 and a multiplies N2.
  const calculateConservedQuantity = useCallback(
    (N1: number, N2: number, params: Parameters): number => {
      if (N1 <= 0 || N2 <= 0) return NaN;
      return params.r2 * Math.log(N1) + params.r1 * Math.log(N2) - params.b * N1 - params.a * N2;
    },
    []
  );

  const calculateDerivatives = useCallback(
    (N1: number, N2: number, params: Parameters, model: ModelType) => {
      if (model === 'competition') {
        const dN1dt = params.r1 * N1 * (1 - (N1 + params.a12 * N2) / params.K1);
        const dN2dt = params.r2 * N2 * (1 - (N2 + params.a21 * N1) / params.K2);
        return { dN1dt, dN2dt };
      }
      // Predator-prey: N1 = prey, N2 = predator
      const dN1dt = params.r1 * N1 - params.a * N1 * N2;
      const dN2dt = -params.r2 * N2 + params.b * N1 * N2;
      return { dN1dt, dN2dt };
    },
    []
  );

  // One classical Runge-Kutta 4th order step of size TIME_STEP.
  const rk4Step = useCallback(
    (N1: number, N2: number, params: Parameters, model: ModelType) => {
      const h = TIME_STEP;
      const k1 = calculateDerivatives(N1, N2, params, model);
      const k2 = calculateDerivatives(N1 + (k1.dN1dt * h) / 2, N2 + (k1.dN2dt * h) / 2, params, model);
      const k3 = calculateDerivatives(N1 + (k2.dN1dt * h) / 2, N2 + (k2.dN2dt * h) / 2, params, model);
      const k4 = calculateDerivatives(N1 + k3.dN1dt * h, N2 + k3.dN2dt * h, params, model);

      const newN1 = N1 + (h / 6) * (k1.dN1dt + 2 * k2.dN1dt + 2 * k3.dN1dt + k4.dN1dt);
      const newN2 = N2 + (h / 6) * (k1.dN2dt + 2 * k2.dN2dt + 2 * k3.dN2dt + k4.dN2dt);

      // A population that falls below the threshold is set to zero, which is an
      // absorbing state for both models.
      return {
        N1: newN1 < EXTINCTION_THRESHOLD ? 0 : newN1,
        N2: newN2 < EXTINCTION_THRESHOLD ? 0 : newN2,
      };
    },
    [calculateDerivatives]
  );

  // Advances the simulation by `speed` steps and publishes one state update.
  const tick = useCallback(() => {
    const sim = simRef.current;
    let { steps, N1, N2 } = sim;
    const appended: DataPoint[] = [];

    for (let i = 0; i < speed; i++) {
      const next = rk4Step(N1, N2, parameters, modelType);
      N1 = next.N1;
      N2 = next.N2;
      steps += 1;
      appended.push({ time: stepTime(steps), species1: N1, species2: N2 });
    }
    const time = stepTime(steps);

    let raw = sim.raw.concat(appended);
    if (raw.length > RAW_WINDOW) {
      raw = raw.slice(raw.length - RAW_WINDOW);
    }

    sim.steps = steps;
    sim.time = time;
    sim.N1 = N1;
    sim.N2 = N2;
    sim.raw = raw;

    setCurrentTime(time);
    setCurrentPopulations({ N1, N2 });

    // Throttle only the chart series; the numeric readouts stay on every frame.
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const publish = now - lastPublishRef.current >= CHART_PUBLISH_MS;
    if (publish) {
      lastPublishRef.current = now;
      setData(decimate(raw, MAX_POINTS));
    }

    if (modelType === 'predator-prey' && publish) {
      const H = calculateConservedQuantity(N1, N2, parameters);
      if (Number.isFinite(H)) {
        const H0 = sim.initialH;
        const absoluteDrift = Math.abs(H - H0);
        // Relative to |H0| with a floor of 1, since H passes through zero.
        const driftPercent = (absoluteDrift / Math.max(Math.abs(H0), 1)) * 100;
        setConservedQuantity({
          current: H,
          initial: H0,
          isConserved: driftPercent < 0.1,
          driftPercent,
          absoluteDrift,
        });
      }
    }

    const nearExtinction = N1 <= 0 || N2 <= 0;
    const attoFoxProblem =
      modelType === 'predator-prey' && (N1 < FRACTIONAL_THRESHOLD || N2 < FRACTIONAL_THRESHOLD);
    setPopulationWarnings(prev =>
      prev.nearExtinction === nearExtinction && prev.attoFoxProblem === attoFoxProblem
        ? prev
        : { nearExtinction, attoFoxProblem }
    );
  }, [parameters, modelType, speed, rk4Step, calculateConservedQuantity]);

  // The interval calls through a ref, so parameter and speed changes take
  // effect on the next frame instead of being frozen into the closure.
  const savedTick = useRef(tick);
  useEffect(() => {
    savedTick.current = tick;
  }, [tick]);

  const stopSimulation = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startSimulation = useCallback(() => {
    if (intervalRef.current !== null) return; // guard against duplicate intervals
    setIsRunning(true);
    intervalRef.current = setInterval(() => savedTick.current(), UPDATE_INTERVAL);
  }, []);

  const resetSimulation = useCallback(() => {
    stopSimulation();

    const initialH =
      modelType === 'predator-prey'
        ? calculateConservedQuantity(parameters.N1_0, parameters.N2_0, parameters)
        : NaN;

    const firstPoint: DataPoint = {
      time: 0,
      species1: parameters.N1_0,
      species2: parameters.N2_0,
    };

    simRef.current = {
      steps: 0,
      time: 0,
      N1: parameters.N1_0,
      N2: parameters.N2_0,
      raw: [firstPoint],
      initialH,
    };

    lastPublishRef.current = 0;
    setCurrentTime(0);
    setCurrentPopulations({ N1: parameters.N1_0, N2: parameters.N2_0 });
    setData([firstPoint]);
    setConservedQuantity({
      current: initialH,
      initial: initialH,
      isConserved: true,
      driftPercent: 0,
      absoluteDrift: 0,
    });
    setPopulationWarnings({ nearExtinction: false, attoFoxProblem: false });
  }, [parameters, modelType, stopSimulation, calculateConservedQuantity]);

  const toggleSimulation = useCallback(() => {
    if (isRunning) {
      stopSimulation();
    } else {
      startSimulation();
    }
  }, [isRunning, startSimulation, stopSimulation]);

  const updateParameter = useCallback((param: string, value: number) => {
    setParameters(prev => ({ ...prev, [param]: value }));
  }, []);

  const setAllParameters = useCallback((newParams: Partial<Parameters>) => {
    setParameters(prev => ({ ...prev, ...newParams }));
  }, []);

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeed(Math.min(MAX_SPEED, Math.max(MIN_SPEED, Math.round(newSpeed))));
  }, []);

  const switchModel = useCallback((newModel: ModelType) => {
    setModelType(newModel);
    if (newModel === 'predator-prey') {
      setParameters(prev => ({
        ...prev,
        r1: 1.0, // prey growth rate
        r2: 1.0, // predator death rate
        a: 0.1, // predation rate
        b: 0.075, // conversion efficiency
        N1_0: 40, // equilibrium is (r2/b, r1/a) = (13.3, 10)
        N2_0: 9,
      }));
    } else {
      setParameters(prev => ({
        ...prev,
        r1: 1.0,
        r2: 0.8,
        K1: 80,
        K2: 120,
        // a12 = 0.6 < K1/K2 = 0.67 and a21 = 1.0 < K2/K1 = 1.5, so these
        // defaults give stable coexistence.
        a12: 0.6,
        a21: 1.0,
        N1_0: 50,
        N2_0: 50,
      }));
    }
  }, []);

  // Reset whenever the parameters or the model change. resetSimulation carries
  // `parameters` in its dependency list, so the baseline H is never computed
  // from a previous parameter set.
  useEffect(() => {
    resetSimulation();
  }, [resetSimulation]);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    modelType,
    parameters,
    data,
    isRunning,
    currentPopulations,
    currentTime,
    conservedQuantity,
    populationWarnings,
    timeStep: TIME_STEP,
    speed,
    minSpeed: MIN_SPEED,
    maxSpeed: MAX_SPEED,
    updateParameter,
    updateSpeed,
    setAllParameters,
    switchModel,
    toggleSimulation,
    resetSimulation,
  };
}
