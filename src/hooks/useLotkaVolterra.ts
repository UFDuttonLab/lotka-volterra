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
    // Competition parameters
    r1: 1.0,
    r2: 0.8,
    K1: 200,
    K2: 180,
    a12: 0.5,
    a21: 0.6,
    // Predator-prey parameters (default)
    a: 0.1,
    b: 0.075,
    N1_0: 100,
    N2_0: 20,
  });

  const [data, setData] = useState<DataPoint[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentPopulations, setCurrentPopulations] = useState({
    N1: parameters.N1_0,
    N2: parameters.N2_0,
  });

  const intervalRef = useRef<NodeJS.Timeout>();
  const timeStep = 0.1; // Integration time step
  const updateInterval = 50; // Update frequency in milliseconds

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

  // Euler integration method
  const integrate = useCallback((N1: number, N2: number, params: Parameters, model: ModelType) => {
    const { dN1dt, dN2dt } = calculateDerivatives(N1, N2, params, model);
    return {
      N1: Math.max(0, N1 + dN1dt * timeStep),
      N2: Math.max(0, N2 + dN2dt * timeStep),
    };
  }, [calculateDerivatives]);

  const updateSimulation = useCallback(() => {
    setCurrentTime(prevTime => {
      const newTime = prevTime + timeStep;
      
      setCurrentPopulations(prevPops => {
        const newPops = integrate(prevPops.N1, prevPops.N2, parameters, modelType);
        
        // Add data point every few steps to avoid too many points
        if (Math.round(newTime * 10) % 2 === 0) {
          setData(prevData => {
            const newDataPoint = {
              time: Math.round(newTime * 10) / 10,
              species1: Math.round(newPops.N1 * 10) / 10,
              species2: Math.round(newPops.N2 * 10) / 10,
            };
            
            // Keep only last 200 points for performance
            const updatedData = [...prevData, newDataPoint];
            return updatedData.length > 200 ? updatedData.slice(-200) : updatedData;
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
  }, [parameters.N1_0, parameters.N2_0, stopSimulation]);

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

  const switchModel = useCallback((newModel: ModelType) => {
    setModelType(newModel);
    // Reset to appropriate default parameters
    if (newModel === 'predator-prey') {
      setParameters(prev => ({
        ...prev,
        r1: 1.0, // prey growth rate
        r2: 0.5, // predator death rate
        a: 0.1,  // predation rate
        b: 0.075, // predator efficiency
        N1_0: 100, // initial prey
        N2_0: 20,  // initial predators
      }));
    } else {
      setParameters(prev => ({
        ...prev,
        r1: 1.0,
        r2: 0.8,
        K1: 200,
        K2: 180,
        a12: 0.5,
        a21: 0.6,
        N1_0: 50,
        N2_0: 40,
      }));
    }
  }, []);

  // Initialize data on mount and parameter changes
  useEffect(() => {
    resetSimulation();
  }, [parameters.N1_0, parameters.N2_0]);

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
    updateParameter,
    switchModel,
    toggleSimulation,
    resetSimulation,
  };
}
