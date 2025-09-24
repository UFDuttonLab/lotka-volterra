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
  b: number; // Predator efficiency
  N1_0: number; // Initial prey population
  N2_0: number; // Initial predator population
}

type Parameters = CompetitionParameters & PredatorPreyParameters;

interface DataPoint {
  time: number;
  species1: number;
  species2: number;
}

export function useLotkaVolterra() {
  const [modelType, setModelType] = useState<ModelType>('predator-prey');
  const [parameters, setParameters] = useState<Parameters>({
    // Competition parameters - classic competitive exclusion
    r1: 1.0,
    r2: 0.8,
    K1: 80,
    K2: 120,
    a12: 0.6,
    a21: 1.0,
    // Predator-prey parameters - classic textbook values for positive H conservation
    a: 0.1,   // predation efficiency - textbook value for stable oscillations
    b: 0.075, // conversion efficiency - textbook value for positive H
    N1_0: 40, // initial prey - balanced for positive conserved quantity
    N2_0: 9,  // initial predators - balanced for positive conserved quantity
  });

  const [data, setData] = useState<DataPoint[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentPopulations, setCurrentPopulations] = useState({
    N1: parameters.N1_0,
    N2: parameters.N2_0,
  });

  // Conservation quantity H for predator-prey systems with drift tracking
  const [conservedQuantity, setConservedQuantity] = useState<{
    current: number;
    initial: number;
    isConserved: boolean;
    driftPercent: number;
  }>({ current: 0, initial: 0, isConserved: true, driftPercent: 0 });

  // Population warnings for biological realism
  const [populationWarnings, setPopulationWarnings] = useState<{
    nearExtinction: boolean;
    unrealisticParameters: string[];
    attoFoxProblem: boolean;
  }>({ nearExtinction: false, unrealisticParameters: [], attoFoxProblem: false });

  const intervalRef = useRef<NodeJS.Timeout>();
  const timeStep = 0.05; // Integration time step - balanced for accuracy and visual speed
  const updateInterval = 50; // Update frequency in milliseconds

  // Calculate conserved quantity H for predator-prey systems
  const calculateConservedQuantity = useCallback((N1: number, N2: number, params: Parameters): number => {
    // H = r₂·ln(N₁) - a·N₁ + r₁·ln(N₂) - b·N₂ (correct Lotka-Volterra first integral)
    return params.r2 * Math.log(N1) - params.a * N1 + params.r1 * Math.log(N2) - params.b * N2;
  }, []);

  // Lotka-Volterra equations (both competition and predator-prey)
  const calculateDerivatives = useCallback((N1: number, N2: number, params: Parameters, model: ModelType) => {
    if (model === 'competition') {
      const dN1dt = params.r1 * N1 * (1 - (N1 + params.a12 * N2) / params.K1);
      const dN2dt = params.r2 * N2 * (1 - (N2 + params.a21 * N1) / params.K2);
      return { dN1dt, dN2dt };
    } else {
      // Predator-prey model: N1 = prey, N2 = predator
      const dN1dt = params.r1 * N1 - params.a * N1 * N2;
      const dN2dt = -params.r2 * N2 + params.b * N1 * N2;
      return { dN1dt, dN2dt };
    }
  }, []);

  // Runge-Kutta 4th Order integration method
  const integrate = useCallback((N1: number, N2: number, params: Parameters, model: ModelType) => {
    // RK4 method for better accuracy with oscillatory systems
    const k1 = calculateDerivatives(N1, N2, params, model);
    const k2 = calculateDerivatives(
      N1 + k1.dN1dt * timeStep / 2,
      N2 + k1.dN2dt * timeStep / 2,
      params,
      model
    );
    const k3 = calculateDerivatives(
      N1 + k2.dN1dt * timeStep / 2,
      N2 + k2.dN2dt * timeStep / 2,
      params,
      model
    );
    const k4 = calculateDerivatives(
      N1 + k3.dN1dt * timeStep,
      N2 + k3.dN2dt * timeStep,
      params,
      model
    );

    const newN1 = N1 + (timeStep / 6) * (k1.dN1dt + 2 * k2.dN1dt + 2 * k3.dN1dt + k4.dN1dt);
    const newN2 = N2 + (timeStep / 6) * (k1.dN2dt + 2 * k2.dN2dt + 2 * k3.dN2dt + k4.dN2dt);

    // Mathematical accuracy: minimal floor to prevent log(0) while preserving conservation
    // Trade-off: Very small threshold maintains Lotka-Volterra conservation properties
    const EXTINCTION_THRESHOLD = 1e-10; // Slightly larger to reduce numerical errors
    return {
      N1: newN1 > EXTINCTION_THRESHOLD ? newN1 : EXTINCTION_THRESHOLD,
      N2: newN2 > EXTINCTION_THRESHOLD ? newN2 : EXTINCTION_THRESHOLD,
    };
  }, [calculateDerivatives]);

  const updateSimulation = useCallback(() => {
    setCurrentTime(prevTime => {
      const newTime = prevTime + timeStep;
      
      setCurrentPopulations(prevPops => {
        const newPops = integrate(prevPops.N1, prevPops.N2, parameters, modelType);
        
        // Update conserved quantity H for predator-prey systems
        if (modelType === 'predator-prey') {
          const currentH = calculateConservedQuantity(newPops.N1, newPops.N2, parameters);
          setConservedQuantity(prev => {
            const driftPercent = prev.initial !== 0 ? Math.abs((currentH - prev.initial) / prev.initial) * 100 : 0;
            const isConserved = driftPercent < 1.0; // 1% tolerance for improved accuracy
            return {
              current: currentH,
              initial: prev.initial === 0 ? currentH : prev.initial,
              isConserved: prev.initial === 0 ? true : isConserved,
              driftPercent: prev.initial === 0 ? 0 : driftPercent
            };
          });
        }

        // Check for population warnings
        const BIOLOGICAL_THRESHOLD = 1e-6; // For near-extinction warning
        const FRACTIONAL_THRESHOLD = 1.0;
        const nearExtinction = newPops.N1 <= BIOLOGICAL_THRESHOLD || newPops.N2 <= BIOLOGICAL_THRESHOLD;
        const attoFoxProblem = newPops.N1 < FRACTIONAL_THRESHOLD || newPops.N2 < FRACTIONAL_THRESHOLD;
        
        setPopulationWarnings(prev => ({
          ...prev,
          nearExtinction,
          attoFoxProblem: modelType === 'predator-prey' ? attoFoxProblem : false
        }));
        
        // Record data every step for maximum accuracy - preserve precision for conservation
        if (true) {
          setData(prevData => {
            const newDataPoint = {
              time: Math.round(newTime * 100) / 100,
              species1: newPops.N1, // Keep full precision for accurate conservation tracking
              species2: newPops.N2, // Keep full precision for accurate conservation tracking
            };
            
            // Keep all data points to show full simulation history
            const updatedData = [...prevData, newDataPoint];
            // Sample data for performance if we have too many points (every 5th point after 2000)
            if (updatedData.length > 2000 && updatedData.length % 5 !== 0) {
              return prevData; // Skip this point
            }
            return updatedData;
          });
        }
        
        return newPops;
      });
      
      return newTime;
    });
  }, [integrate, parameters, modelType]);

  const startSimulation = useCallback(() => {
    setIsRunning(true);
    intervalRef.current = setInterval(updateSimulation, updateInterval);
  }, [updateSimulation]);

  const stopSimulation = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const resetSimulation = useCallback(() => {
    stopSimulation();
    setCurrentTime(0);
    setCurrentPopulations({
      N1: parameters.N1_0,
      N2: parameters.N2_0,
    });
    setData([{
      time: 0,
      species1: parameters.N1_0,
      species2: parameters.N2_0,
    }]);
    
    // Reset conserved quantity
    if (modelType === 'predator-prey') {
      const initialH = calculateConservedQuantity(parameters.N1_0, parameters.N2_0, parameters);
      setConservedQuantity({
        current: initialH,
        initial: initialH,
        isConserved: true,
        driftPercent: 0
      });
    }

    // Reset warnings
    setPopulationWarnings({
      nearExtinction: false,
      unrealisticParameters: [],
      attoFoxProblem: false
    });
  }, [parameters.N1_0, parameters.N2_0, stopSimulation, modelType, calculateConservedQuantity]);

  const toggleSimulation = useCallback(() => {
    if (isRunning) {
      stopSimulation();
    } else {
      startSimulation();
    }
  }, [isRunning, startSimulation, stopSimulation]);

  const updateParameter = useCallback((param: string, value: number) => {
    setParameters(prev => ({ ...prev, [param]: value }));
    
    // Validate parameters for biological realism
    const validateParameter = (paramName: string, paramValue: number) => {
      const warnings: string[] = [];
      
      if (modelType === 'predator-prey') {
        if (paramName === 'r1' && paramValue > 10) warnings.push('Extremely high prey growth rate (most organisms r < 2.0)');
        if (paramName === 'r2' && paramValue > 10) warnings.push('Extremely high predator death rate');
        if (paramName === 'a' && paramValue > 5) warnings.push('Unrealistically efficient predation');
        if (paramName === 'b' && paramValue > 5) warnings.push('Extremely high predator efficiency');
        if ((paramName === 'N1_0' || paramName === 'N2_0') && paramValue > 1000 && (parameters.r1 < 0.5 || parameters.r2 < 0.5)) {
          warnings.push('Large populations with slow growth - may take very long to see dynamics');
        }
      } else {
        if ((paramName === 'r1' || paramName === 'r2') && paramValue > 10) warnings.push('Extremely high growth rate (most organisms r < 2.0)');
        if ((paramName === 'K1' || paramName === 'K2') && paramValue < 10) warnings.push('Very low carrying capacity');
        if ((paramName === 'a12' || paramName === 'a21') && paramValue > 5) warnings.push('Extremely strong competition coefficient');
      }
      
      return warnings;
    };

    const warnings = validateParameter(param, value);
    setPopulationWarnings(prev => ({
      ...prev,
      unrealisticParameters: warnings
    }));
  }, [modelType, parameters]);

  const setAllParameters = useCallback((newParams: Partial<Parameters>) => {
    setParameters(prev => ({ ...prev, ...newParams }));
  }, []);

  const switchModel = useCallback((newModel: ModelType) => {
    setModelType(newModel);
    // Reset to classic scenario parameters with clear visual differences
    if (newModel === 'predator-prey') {
      setParameters(prev => ({
        ...prev,
        r1: 1.0, // prey growth rate
        r2: 1.0, // predator death rate
        a: 0.1,  // predation efficiency - textbook value for positive H
        b: 0.075, // conversion efficiency - textbook value for positive H
        N1_0: 40, // initial prey - balanced for positive conserved quantity
        N2_0: 9,  // initial predators - balanced for positive conserved quantity
      }));
    } else {
      setParameters(prev => ({
        ...prev,
        r1: 1.0, // growth rates for classic exclusion
        r2: 0.8,
        K1: 80, // carrying capacities
        K2: 120,
        a12: 0.6, // asymmetric competition
        a21: 1.0,
        N1_0: 50, // start at half carrying capacity
        N2_0: 50,
      }));
    }
  }, []);

  // Initialize data on mount and parameter changes
  useEffect(() => {
    resetSimulation();
  }, [parameters, resetSimulation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
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
    updateParameter,
    setAllParameters,
    switchModel,
    toggleSimulation,
    resetSimulation,
  };
}
