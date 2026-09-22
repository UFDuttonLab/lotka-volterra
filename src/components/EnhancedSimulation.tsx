import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-media-query";
import SimulationChart from "./SimulationChart";
import SimulationControls from "./SimulationControls";
import ExerciseBanner from "./ExerciseBanner";
import PhasePlaneChart from "./PhasePlaneChart";
import ParameterValidation from "./ParameterValidation";
import ModelLimitations from "./ModelLimitations";
import TechnicalDetails from "./TechnicalDetails";
import { Play, RotateCcw, Lightbulb, Target, TrendingUp, Activity } from "lucide-react";

import EquationDisplay from "./EquationDisplay";

type ModelType = 'competition' | 'predator-prey';

interface DataPoint {
  time: number;
  species1: number;
  species2: number;
}

interface Parameters {
  r1: number;
  r2: number;
  K1: number;
  K2: number;
  a12: number;
  a21: number;
  a: number;
  b: number;
  N1_0: number;
  N2_0: number;
}

interface ExerciseQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

interface EnhancedSimulationProps {
  modelType: ModelType;
  parameters: Parameters;
  data: DataPoint[];
  isRunning: boolean;
  currentPopulations: { N1: number; N2: number };
  currentTime: number;
  conservedQuantity?: {
    current: number;
    initial: number;
    isConserved: boolean;
    driftPercent: number;
    absoluteDrift: number;
  };
  populationWarnings?: {
    nearExtinction: boolean;
    attoFoxProblem?: boolean;
  };
  timeStep: number;
  speed: number;
  minSpeed: number;
  maxSpeed: number;
  updateParameter: (param: string, value: number) => void;
  updateSpeed: (value: number) => void;
  setAllParameters: (newParams: Partial<Parameters>) => void;
  switchModel: (newModel: ModelType) => void;
  toggleSimulation: () => void;
  resetSimulation: () => void;
  activeExercise?: {
    title: string;
    description: string;
    difficulty: string;
    question: ExerciseQuestion;
  } | null;
  onDismissExercise?: () => void;
  onModelChange: (model: ModelType) => void;
}

interface PresetScenario {
  name: string;
  description: string;
  outcome: string;
  parameters: Record<string, number>;
  explanation: string;
  biologicalExample: string;
}

// Competition scenarios with dramatic visual differences
const competitionScenarios: PresetScenario[] = [
  {
    name: "Realistic Parameters",
    description: "Based on actual ecological data - balanced competition",
    outcome: "Coexistence",
    parameters: {
      r1: 0.8, r2: 0.6, K1: 150, K2: 180,
      a12: 0.4, a21: 0.3, N1_0: 75, N2_0: 90
    },
    explanation: "α₁₂ = 0.4 < K₁/K₂ = 0.83 and α₂₁ = 0.3 < K₂/K₁ = 1.2, so interspecific competition is weaker than intraspecific competition for both species and they coexist at (102.3, 149.3).",
    biologicalExample: "Two bird species feeding at different tree levels with overlapping but not identical niches."
  },
  {
    name: "Rapid Exclusion",
    description: "Lightning-fast competitive dominance",
    outcome: "Species 2 Wins",
    parameters: {
      r1: 0.5, r2: 2.5, K1: 100, K2: 300,
      a12: 2.0, a21: 0.2, N1_0: 80, N2_0: 20
    },
    explanation: "α₁₂ = 2.0 > K₁/K₂ = 0.33 and α₂₁ = 0.2 < K₂/K₁ = 3.0, the condition for species 2 to exclude species 1. A growth rate 5x higher (2.5 against 0.5) makes the exclusion fast.",
    biologicalExample: "Invasive kudzu vines rapidly outcompeting native plants with explosive growth rates and aggressive competition."
  },
  {
    name: "Perfect Coexistence",
    description: "Stable, balanced equilibrium dynamics",
    outcome: "Coexistence",
    parameters: {
      r1: 1.0, r2: 1.0, K1: 200, K2: 200,
      a12: 0.3, a21: 0.3, N1_0: 50, N2_0: 50
    },
    explanation: "Symmetric parameters with weak interspecific competition give stable coexistence. Each species settles at (K₁ - α₁₂K₂)/(1 - α₁₂α₂₁) = 140/0.91 = 153.8 individuals.",
    biologicalExample: "Two similar bird species feeding at different heights in the same tree, minimizing direct competition."
  },
  {
    name: "Lopsided Coexistence",
    description: "Coexistence with one species far outnumbering the other",
    outcome: "Coexistence",
    parameters: {
      r1: 2.0, r2: 1.5, K1: 150, K2: 180,
      a12: 0.8, a21: 0.6, N1_0: 200, N2_0: 150
    },
    explanation: "Both coefficients sit just below their thresholds (α₁₂ = 0.8 < K₁/K₂ = 0.83, α₂₁ = 0.6 < K₂/K₁ = 1.2), so the outcome is a strongly asymmetric coexistence at (11.5, 173.1). The approach is monotonic: this model's Jacobian has real eigenvalues for any positive competition coefficients, so it cannot overshoot.",
    biologicalExample: "Boom-bust cycles in competing rodent populations that overshoot their environment's capacity."
  },
  {
    name: "Slow Giants",
    description: "Large organisms with gradual dynamics",
    outcome: "Species 1 Wins",
    parameters: {
      r1: 0.2, r2: 0.1, K1: 400, K2: 200,
      a12: 0.1, a21: 0.8, N1_0: 50, N2_0: 100
    },
    explanation: "α₁₂ = 0.1 < K₁/K₂ = 2.0 and α₂₁ = 0.8 > K₂/K₁ = 0.5, so species 1 excludes species 2. Growth rates of 0.2 and 0.1 make the approach slow; raise the playback speed to reach the outcome.",
    biologicalExample: "Competition between large tree species in old-growth forests, where changes occur over decades."
  },
];

// Predator-prey scenarios with extreme visual differences
const predatorPreyScenarios: PresetScenario[] = [
  {
    name: "Realistic Parameters", 
    description: "Based on lynx-hare data with realistic population sizes",
    outcome: "Stable Cycles",
    parameters: {
      r1: 1.2, r2: 0.8, a: 0.008, b: 0.005,
      N1_0: 120, N2_0: 30
    },
    explanation: "Parameters approximating real lynx-hare dynamics. Equilibrium is N₁* = r₂/b = 160 prey and N₂* = r₁/a = 150 predators. Starting at (120, 30) puts the system on a wide orbit, giving the large-amplitude cycles seen in the fur trade records.",
    biologicalExample: "The famous lynx-hare cycles documented by Hudson Bay Company fur traders from 1845-1935, showing remarkably consistent 9-10 year population cycles."
  },
  {
    name: "Minimum Viable Population",
    description: "Shows why populations below 50-100 individuals are vulnerable",
    outcome: "Conservation Warning", 
    parameters: {
      r1: 1.5, r2: 0.6, a: 0.015, b: 0.012,
      N1_0: 60, N2_0: 15
    },
    explanation: "Equilibrium is N₁* = r₂/b = 50, N₂* = r₁/a = 100. Starting at (60, 15) is far below N₂*, so prey fall to about 1.4 individuals at the trough. Populations below 50-100 face extinction from genetic bottlenecks and environmental stochasticity.",
    biologicalExample: "California condors dropped to 27 individuals in 1987, requiring intensive conservation efforts. Most viable populations need 50-100+ breeding individuals."
  },
  {
    name: "Classic Lotka-Volterra",
    description: "Perfect neutral oscillations with realistic populations",
    outcome: "Perfect Cycles",
    parameters: {
      r1: 1.0, r2: 1.0, a: 0.012, b: 0.008,
      N1_0: 80, N2_0: 20
    },
    explanation: "The original 1925 equations scaled for realistic populations. Equilibrium is N₁* = r₂/b = 125 prey and N₂* = r₁/a = 83.3 predators, a prey-to-predator ratio of 1.5:1. The linearised cycle period is 2π/√(r₁r₂) = 6.28 time units.",
    biologicalExample: "The theoretical foundation for all predator-prey models - represents idealized conditions with perfect balance between growth, predation, and efficiency."
  },
  {
    name: "Gentle Waves",
    description: "Smooth, sustained population oscillations",
    outcome: "Stable Cycles",
    parameters: {
      r1: 1.2, r2: 0.5, a: 0.005, b: 0.007,
      N1_0: 100, N2_0: 40
    },
    explanation: "A low predation rate (a = 0.005) sets a high predator equilibrium: N₁* = r₂/b = 71.4 prey and N₂* = r₁/a = 240 predators. Starting at (100, 40) is far below N₂*, so the predator population climbs through a wide first cycle before settling onto a repeating orbit.",
    biologicalExample: "Stable predator-prey relationships in mature ecosystems like wolves and deer in protected areas with clear but gentle population cycles."
  },
  {
    name: "Lightning Fast",
    description: "Rapid, frequent micro-oscillations",
    outcome: "Rapid Cycles",
    parameters: {
      r1: 4.0, r2: 1.5, a: 0.015, b: 0.010,
      N1_0: 80, N2_0: 80
    },
    explanation: "A high prey growth rate (r₁ = 4.0) shortens the linearised period to 2π/√(r₁r₂) = 2.57 time units. Equilibrium is N₁* = 150, N₂* = 266.7, and (80, 80) is well outside it, so the cycles are fast and wide.",
    biologicalExample: "Bacteria and bacteriophage viruses - ultra-rapid reproduction creating multiple generations within hours."
  },
  {
    name: "Slow Giants",
    description: "Wide, slow oscillations over long timescales",
    outcome: "Slow Oscillations",
    parameters: {
      r1: 0.15, r2: 0.1, a: 0.001, b: 0.0015,
      N1_0: 150, N2_0: 30
    },
    explanation: "Small rate constants stretch the linearised period to 2π/√(r₁r₂) = 51.3 time units. Equilibrium is N₁* = r₂/b = 66.7, N₂* = r₁/a = 150. Raise the playback speed to reach a full cycle.",
    biologicalExample: "Moose and wolf populations in Yellowstone - large mammals with multi-year population cycles."
  },
  {
    name: "High-Risk Cycles",
    description: "Large oscillations with conservation concerns",
    outcome: "Extreme Cycles", 
    parameters: {
      r1: 1.8, r2: 1.0, a: 0.025, b: 0.028,
      N1_0: 80, N2_0: 160
    },
    explanation: "Equilibrium is N₁* = r₂/b = 35.7, N₂* = r₁/a = 72. Starting at (80, 160) is more than twice the equilibrium on both axes, so the orbit is wide and prey fall to about 4.5 individuals at the trough. The model never reaches zero, but a real population at that density would be at risk of extinction.",
    biologicalExample: "Specialist predators like lynx and snowshoe hares in harsh environments - cycles crash to near-extinction levels where just a few individuals survive to restart the cycle."
  }
];

export default function EnhancedSimulation({
  modelType,
  parameters,
  data,
  isRunning,
  currentPopulations,
  currentTime,
  conservedQuantity,
  populationWarnings,
  timeStep,
  speed,
  minSpeed,
  maxSpeed,
  updateParameter,
  updateSpeed,
  setAllParameters,
  switchModel,
  toggleSimulation,
  resetSimulation,
  activeExercise,
  onDismissExercise,
  onModelChange,
}: EnhancedSimulationProps) {
  
  const { toast } = useToast();
  const [loadedScenario, setLoadedScenario] = useState<string | null>(null);
  // Tailwind's lg breakpoint. Only the matching layout is mounted, so the
  // charts are not built twice on every frame.
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Clear loaded scenario when model type changes
  useEffect(() => {
    setLoadedScenario(null);
  }, [modelType]);

  const loadPreset = (preset: PresetScenario) => {
    // Stop current simulation
    if (isRunning) {
      toggleSimulation();
    }
    
    // Load all preset parameters at once to avoid race conditions
    setAllParameters(preset.parameters);
    
    // Set loaded scenario
    setLoadedScenario(preset.name);
    
    // Show feedback
    toast({
      title: "Preset Loaded",
      description: `${preset.name}: ${preset.description}`,
    });
    
    // Reset simulation will happen automatically via useEffect in the hook
  };

  const getCurrentOutcome = () => {
    if (modelType === 'predator-prey') {
      // Classify over one full cycle of model time rather than a fixed number
      // of samples. The linearised period of the Lotka-Volterra system is
      // 2*pi/sqrt(r1*r2), independent of a and b.
      const period = (2 * Math.PI) / Math.sqrt(Math.max(parameters.r1 * parameters.r2, 1e-9));
      const tEnd = data.length > 0 ? data[data.length - 1].time : 0;

      if (data.length > 10 && tEnd >= period) {
        const window = data.filter(d => d.time >= tEnd - period);
        const preyValues = window.map(d => d.species1);
        const avgPrey = preyValues.reduce((a, b) => a + b, 0) / preyValues.length;
        const maxPrey = preyValues.reduce((a, b) => Math.max(a, b), -Infinity);
        const minPrey = preyValues.reduce((a, b) => Math.min(a, b), Infinity);
        const amplitude = maxPrey - minPrey;

        if (avgPrey <= 0) {
          return { type: "Extinct", color: "bg-red-100 text-red-800 border-red-200" };
        }
        if (amplitude < avgPrey * 0.1) {
          return { type: "Near Equilibrium", color: "bg-green-100 text-green-800 border-green-200" };
        } else if (amplitude > avgPrey * 0.8) {
          return { type: "Large Oscillations", color: "bg-orange-100 text-orange-800 border-orange-200" };
        } else {
          return { type: "Stable Cycles", color: "bg-blue-100 text-blue-800 border-blue-200" };
        }
      }
      return { type: "Analyzing...", color: "bg-gray-100 text-gray-800 border-gray-200" };
    } else {
      // Competition model logic
      // Species 1 excludes species 2 when a12 < K1/K2 and a21 > K2/K1;
      // species 2 excludes species 1 under the reverse pair; both below the
      // thresholds gives stable coexistence, both above gives founder control.
      const { K1, K2, a12, a21 } = parameters;
      const alpha12_threshold = K1 / K2;
      const alpha21_threshold = K2 / K1;

      if (a12 < alpha12_threshold && a21 < alpha21_threshold) {
        return { type: "Coexistence", color: "bg-green-100 text-green-800 border-green-200" };
      } else if (a12 > alpha12_threshold && a21 < alpha21_threshold) {
        return { type: "Species 2 Wins", color: "bg-blue-100 text-blue-800 border-blue-200" };
      } else if (a12 < alpha12_threshold && a21 > alpha21_threshold) {
        return { type: "Species 1 Wins", color: "bg-purple-100 text-purple-800 border-purple-200" };
      } else {
        return { type: "Bistable", color: "bg-orange-100 text-orange-800 border-orange-200" };
      }
    }
  };

  const outcome = getCurrentOutcome();
  const currentScenarios = modelType === 'predator-prey' ? predatorPreyScenarios : competitionScenarios;

  return (
    <div className="space-y-6">
      {/* Laboratory Title */}
      <Card className="shadow-card">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Interactive {modelType === 'predator-prey' ? 'Lotka-Volterra Predator-Prey' : 'Lotka-Volterra Competition (Logistic Growth)'} Laboratory
            </CardTitle>
          <p className="text-muted-foreground">
            Explore {modelType === 'predator-prey' ? 'predator-prey dynamics with oscillating cycles' : 'competition dynamics with equilibrium states'} through real-time simulation and preset scenarios.
          </p>
        </CardHeader>
      </Card>

      {/* Model Equation Display */}
      <EquationDisplay modelType={modelType} onModelChange={onModelChange} />

      {/* Exercise Banner */}
      {activeExercise && onDismissExercise && (
        <ExerciseBanner
          exercise={activeExercise}
          onDismiss={onDismissExercise}
        />
      )}


      {/* Current Status */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex flex-wrap justify-center items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-mono font-medium">{currentTime.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{modelType === 'predator-prey' ? 'Prey' : 'Species 1'}:</span>
                <span className="font-mono font-medium text-primary">
                  {currentPopulations.N1.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{modelType === 'predator-prey' ? 'Predator' : 'Species 2'}:</span>
                <span className="font-mono font-medium text-secondary">
                  {currentPopulations.N2.toFixed(1)}
                </span>
              </div>
              {loadedScenario && (
                <Badge className={`${outcome.color} border`}>
                  Scenario: {loadedScenario}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="simulation" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simulation" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Live Simulation
          </TabsTrigger>
          <TabsTrigger value="presets" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Preset Scenarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simulation" className="space-y-6">
          {/* Desktop Layout */}
          {isDesktop && (
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-6">
              <SimulationControls
                modelType={modelType}
                parameters={parameters}
                speed={speed}
                minSpeed={minSpeed}
                maxSpeed={maxSpeed}
                timeStep={timeStep}
                onParameterChange={updateParameter}
                onSpeedChange={updateSpeed}
                isRunning={isRunning}
                onPlayPause={toggleSimulation}
                onReset={resetSimulation}
              />
              <ParameterValidation
                modelType={modelType}
                parameters={parameters}
                populationWarnings={populationWarnings}
                currentPopulations={currentPopulations}
              />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <SimulationChart 
                data={data} 
                isRunning={isRunning} 
                modelType={modelType} 
                conservedQuantity={conservedQuantity}
              />
              <PhasePlaneChart 
                data={data}
                modelType={modelType}
                parameters={parameters}
                isRunning={isRunning}
              />
              {/* Interpretation Panel */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-secondary" />
                    Interpretation Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {modelType === 'predator-prey' ? (
                    <div className="text-sm space-y-2">
                      <p><strong>{loadedScenario ? 'Active Scenario:' : 'Current Pattern:'}</strong> {loadedScenario || outcome.type}</p>
                      <p className="text-muted-foreground leading-relaxed">
                        {outcome.type === "Stable Cycles" && "The system shows stable oscillations where predator peaks follow prey peaks with a natural delay."}
                        {outcome.type === "Large Oscillations" && "High amplitude cycles suggest strong predator-prey interactions that could risk population crashes."}
                        {outcome.type === "Near Equilibrium" && "Populations are approaching steady states, suggesting weak predator-prey interactions."}
                        {outcome.type === "Analyzing..." && "Run the simulation for at least one full cycle to analyse the pattern."}
                        {outcome.type === "Extinct" && "The prey population has reached zero, so the predator population decays to zero as well."}
                      </p>
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div className="text-center">
                          <div className="text-lg math-formula unicode-math font-bold text-primary">
                            {parameters.a.toFixed(3)}
                          </div>
                          <div className="text-xs text-muted-foreground">Predation Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg math-formula unicode-math font-bold text-secondary">
                            {parameters.b.toFixed(3)}
                          </div>
                          <div className="text-xs text-muted-foreground">Pred. Efficiency</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm space-y-2">
                      <p><strong>{loadedScenario ? 'Active Scenario:' : 'Current Parameters Predict:'}</strong> {loadedScenario || outcome.type}</p>
                      <p className="text-muted-foreground leading-relaxed">
                        {outcome.type === "Coexistence" && "Both species can persist because interspecific competition is weaker than intraspecific competition for both species."}
                        {outcome.type === "Species 1 Wins" && "Species 1 will exclude Species 2 because it has a competitive advantage."}
                        {outcome.type === "Species 2 Wins" && "Species 2 will exclude Species 1 because it has a competitive advantage."}
                        {outcome.type === "Bistable" && "The outcome depends on initial conditions - whichever species gets established first will exclude the other."}
                      </p>
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div className="text-center">
                          <div className="text-lg font-mono font-bold text-primary">
                            {(parameters.a12 / (parameters.K1 / parameters.K2)).toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground math-formula unicode-math">α₁₂ / (K₁/K₂)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-mono font-bold text-secondary">
                            {(parameters.a21 / (parameters.K2 / parameters.K1)).toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground math-formula unicode-math">α₂₁ / (K₂/K₁)</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Model Limitations */}
              <ModelLimitations 
                modelType={modelType}
                currentPopulations={currentPopulations}
              />
              
              {/* Technical Details */}
              <TechnicalDetails 
                modelType={modelType}
                conservedQuantity={conservedQuantity}
                timeStep={timeStep}
                speed={speed}
                currentTime={currentTime}
              />
            </div>
          </div>

          )}

          {/* Mobile Layout */}
          {!isDesktop && (
          <div className="space-y-6">
            <SimulationChart 
              data={data} 
              isRunning={isRunning} 
              modelType={modelType} 
              conservedQuantity={conservedQuantity}
            />
            <PhasePlaneChart 
              data={data}
              modelType={modelType}
              parameters={parameters}
              isRunning={isRunning}
            />
            <SimulationControls
              modelType={modelType}
              parameters={parameters}
              speed={speed}
              minSpeed={minSpeed}
              maxSpeed={maxSpeed}
              timeStep={timeStep}
              onParameterChange={updateParameter}
              onSpeedChange={updateSpeed}
              isRunning={isRunning}
              onPlayPause={toggleSimulation}
              onReset={resetSimulation}
            />
            <ParameterValidation
              modelType={modelType}
              parameters={parameters}
              populationWarnings={populationWarnings}
              currentPopulations={currentPopulations}
            />
            <ModelLimitations 
              modelType={modelType}
              currentPopulations={currentPopulations}
            />
          </div>
          )}
        </TabsContent>

        <TabsContent value="presets" className="space-y-4">
          <div className="grid gap-4">
            {currentScenarios.map((scenario, idx) => (
              <Card key={idx} className="shadow-card hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{scenario.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="whitespace-nowrap">
                        {scenario.outcome}
                      </Badge>
                      <Button 
                        onClick={() => loadPreset(scenario)}
                        size="sm"
                        className="whitespace-nowrap"
                      >
                        Load Scenario
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Mathematical Explanation:</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {scenario.explanation}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Biological Example:</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {scenario.biologicalExample}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t text-xs">
                    {modelType === 'predator-prey' ? (
                      <>
                         <div className="text-center">
                           <div className="font-mono font-semibold">{scenario.parameters.r1}</div>
                           <div className="text-muted-foreground math-formula unicode-math">r₁ (prey)</div>
                         </div>
                         <div className="text-center">
                           <div className="font-mono font-semibold">{scenario.parameters.r2}</div>
                           <div className="text-muted-foreground math-formula unicode-math">r₂ (pred)</div>
                         </div>
                        <div className="text-center">
                          <div className="font-mono font-semibold">{scenario.parameters.a}</div>
                          <div className="text-muted-foreground">a (attack)</div>
                        </div>
                        <div className="text-center">
                          <div className="font-mono font-semibold">{scenario.parameters.b}</div>
                          <div className="text-muted-foreground">b (efficiency)</div>
                        </div>
                      </>
                    ) : (
                      <>
                         <div className="text-center">
                           <div className="font-mono font-semibold">{scenario.parameters.r1}</div>
                           <div className="text-muted-foreground math-formula unicode-math">r₁</div>
                         </div>
                         <div className="text-center">
                           <div className="font-mono font-semibold">{scenario.parameters.r2}</div>
                           <div className="text-muted-foreground math-formula unicode-math">r₂</div>
                         </div>
                         <div className="text-center">
                           <div className="font-mono font-semibold">{scenario.parameters.a12}</div>
                           <div className="text-muted-foreground math-formula unicode-math">α₁₂</div>
                         </div>
                         <div className="text-center">
                           <div className="font-mono font-semibold">{scenario.parameters.a21}</div>
                           <div className="text-muted-foreground math-formula unicode-math">α₂₁</div>
                         </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}