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
    K1: 100,
    K2: 100,
    a12: 0.8,
    a21: 1.2,
    // Predator-prey parameters - realistic populations with biological dynamics
    a: 0.1,   // predation efficiency - realistic for biological systems
    b: 0.075, // conversion efficiency - realistic predator growth efficiency
    N1_0: 80,
    N2_0: 20,
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
  }>({ nearExtinction: false, unrealisticParameters: [] });

  const intervalRef = useRef<NodeJS.Timeout>();
  const timeStep = 0.05; // Integration time step - balanced for accuracy and visual speed
  const updateInterval = 50; // Update frequency in milliseconds

  // Calculate conserved quantity H for predator-prey systems
  const calculateConservedQuantity = useCallback((N1: number, N2: number, params: Parameters): number => {
    // H = r₂·ln(N₁) - b·N₁ + r₁·ln(N₂) - a·N₂
    return params.r2 * Math.log(N1) - params.b * N1 + params.r1 * Math.log(N2) - params.a * N2;
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

  // Biologically meaningful population floor - populations can't recover from true zero
  const EXTINCTION_THRESHOLD = 0.001;
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
            const tolerance = 0.001; // 0.1% tolerance
            const driftPercent = prev.initial !== 0 ? Math.abs((currentH - prev.initial) / prev.initial) * 100 : 0;
            const isConserved = driftPercent < 0.1;
            return {
              current: currentH,
              initial: prev.initial === 0 ? currentH : prev.initial,
              isConserved: prev.initial === 0 ? true : isConserved,
              driftPercent: prev.initial === 0 ? 0 : driftPercent
            };
          });
        }

        // Check for population warnings
        const EXTINCTION_THRESHOLD = 0.001;
        const nearExtinction = newPops.N1 <= EXTINCTION_THRESHOLD * 1.1 || newPops.N2 <= EXTINCTION_THRESHOLD * 1.1;
        
        setPopulationWarnings(prev => ({
          ...prev,
          nearExtinction
        }));
        
        // Record data every step for maximum accuracy
        if (true) {
          setData(prevData => {
            const newDataPoint = {
              time: Math.round(newTime * 100) / 100,
              species1: Math.round(newPops.N1),
              species2: Math.round(newPops.N2),
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
      unrealisticParameters: []
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
        a: 0.1,    // predation efficiency - realistic for biological systems  
        b: 0.075,  // conversion efficiency - realistic predator growth efficiency
        N1_0: 80, // initial prey - biologically meaningful population
        N2_0: 20,  // initial predators - biologically meaningful population
      }));
    } else {
      setParameters(prev => ({
        ...prev,
        r1: 1.0, // growth rates for classic exclusion
        r2: 0.8,
        K1: 100, // carrying capacities
        K2: 100,
        a12: 0.8, // asymmetric competition
        a21: 1.2,
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
