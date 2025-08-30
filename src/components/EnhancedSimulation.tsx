import { useLotkaVolterra } from "@/hooks/useLotkaVolterra";
import SimulationControls from "@/components/SimulationControls";
import SimulationChart from "@/components/SimulationChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { Play, RotateCcw, Lightbulb, Target, TrendingUp } from "lucide-react";

interface PresetScenario {
  name: string;
  description: string;
  outcome: string;
  parameters: Record<string, number>;
  explanation: string;
  biologicalExample: string;
}

// Competition scenarios
const competitionScenarios: PresetScenario[] = [
  {
    name: "Competitive Exclusion",
    description: "Strong competitor excludes weaker species",
    outcome: "Species 2 Wins",
    parameters: {
      r1: 1.0, r2: 0.9, K1: 200, K2: 180,
      a12: 1.2, a21: 0.4, N1_0: 50, N2_0: 40
    },
    explanation: "Species 2 has a strong competitive advantage (α₁₂ > K₁/K₂ while α₂₁ < K₂/K₁). Species 1 cannot persist when Species 2 is present at equilibrium.",
    biologicalExample: "Large ground finches excluding medium ground finches during drought years when large seeds are abundant."
  },
  {
    name: "Stable Coexistence",
    description: "Both species coexist at equilibrium",
    outcome: "Coexistence",
    parameters: {
      r1: 1.0, r2: 0.8, K1: 200, K2: 180,
      a12: 0.4, a21: 0.3, N1_0: 50, N2_0: 40
    },
    explanation: "Interspecific competition is weaker than intraspecific competition for both species (α₁₂ < K₁/K₂ and α₂₁ < K₂/K₁). Both species reach a stable equilibrium.",
    biologicalExample: "Tree species in a forest with different shade tolerances and resource requirements can stably coexist."
  },
];

// Predator-prey scenarios
const predatorPreyScenarios: PresetScenario[] = [
  {
    name: "Classic Oscillations",
    description: "Standard predator-prey cycles showing clear population oscillations",
    outcome: "Stable Cycles",
    parameters: {
      r1: 1.0, r2: 1.0, a: 1.0, b: 1.0,
      N1_0: 10, N2_0: 10
    },
    explanation: "Classic Lotka-Volterra parameters (all = 1.0) create perfect neutral oscillations that maintain constant amplitude and period.",
    biologicalExample: "Idealized predator-prey relationship showing the fundamental cyclic dynamics described by Lotka and Volterra."
  },
  {
    name: "Fast Prey Growth",
    description: "Rapidly reproducing prey with moderate predation",
    outcome: "Large Oscillations",
    parameters: {
      r1: 2.0, r2: 1.0, a: 1.5, b: 1.0,
      N1_0: 8, N2_0: 12
    },
    explanation: "High prey growth rate (r₁ = 2.0) with strong predation (α = 1.5) creates rapid oscillations with higher prey peaks.",
    biologicalExample: "Small mammals like voles or lemmings that reproduce quickly and support predator populations through boom-bust cycles."
  },
  {
    name: "Efficient Predators",
    description: "Highly efficient predators with strong conversion rates",
    outcome: "Tight Cycles",
    parameters: {
      r1: 1.0, r2: 0.8, a: 0.8, b: 1.5,
      N1_0: 12, N2_0: 8
    },
    explanation: "High predator efficiency (β = 1.5) means predators convert prey very effectively, leading to lower prey minima and higher predator peaks.",
    biologicalExample: "Specialist predators like Arctic foxes feeding on lemmings, where high conversion efficiency drives tight population coupling."
  },
  {
    name: "Slow Dynamics",
    description: "Large organisms with slower population dynamics",
    outcome: "Wide Oscillations",
    parameters: {
      r1: 0.5, r2: 0.4, a: 0.6, b: 0.7,
      N1_0: 15, N2_0: 6
    },
    explanation: "Reduced rates across all parameters create slower, wider oscillations typical of larger organisms with longer generation times.",
    biologicalExample: "Large herbivore-carnivore systems like caribou and wolves, where population changes occur over multiple years."
  }
];

export default function EnhancedSimulation() {
  const {
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
  } = useLotkaVolterra();

  const loadPreset = (preset: PresetScenario) => {
    Object.entries(preset.parameters).forEach(([param, value]) => {
      updateParameter(param, value);
    });
  };

  const getCurrentOutcome = () => {
    if (modelType === 'predator-prey') {
      // For predator-prey, we can analyze cycle characteristics
      if (data.length > 50) {
        const recentData = data.slice(-30);
        const preyValues = recentData.map(d => d.species1);
        const avgPrey = preyValues.reduce((a, b) => a + b, 0) / preyValues.length;
        const maxPrey = Math.max(...preyValues);
        const minPrey = Math.min(...preyValues);
        const amplitude = maxPrey - minPrey;
        
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
      const { K1, K2, a12, a21 } = parameters;
      const alpha12_threshold = K1! / K2!;
      const alpha21_threshold = K2! / K1!;
      
      if (a12! < alpha12_threshold && a21! < alpha21_threshold) {
        return { type: "Coexistence", color: "bg-green-100 text-green-800 border-green-200" };
      } else if (a12! > alpha12_threshold && a21! < alpha21_threshold) {
        return { type: "Species 2 Wins", color: "bg-blue-100 text-blue-800 border-blue-200" };
      } else if (a12! < alpha12_threshold && a21! > alpha21_threshold) {
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
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Interactive {modelType === 'predator-prey' ? 'Predator-Prey' : 'Competition'} Laboratory
          </CardTitle>
          <p className="text-muted-foreground">
            Explore {modelType === 'predator-prey' ? 'predator-prey dynamics with oscillating cycles' : 'competition dynamics with equilibrium states'} through real-time simulation and preset scenarios.
          </p>
        </CardHeader>
      </Card>

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
              <Badge className={`${outcome.color} border`}>
                {modelType === 'predator-prey' ? 'Pattern' : 'Predicted'}: {outcome.type}
              </Badge>
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
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <SimulationControls
                modelType={modelType}
                parameters={parameters}
                onParameterChange={updateParameter}
                isRunning={isRunning}
                onPlayPause={toggleSimulation}
                onReset={resetSimulation}
              />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <SimulationChart data={data} isRunning={isRunning} modelType={modelType} />
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
                      <p><strong>Current Pattern:</strong> {outcome.type}</p>
                      <p className="text-muted-foreground leading-relaxed">
                        {outcome.type === "Stable Cycles" && "The system shows stable oscillations where predator peaks follow prey peaks with a natural delay."}
                        {outcome.type === "Large Oscillations" && "High amplitude cycles suggest strong predator-prey interactions that could risk population crashes."}
                        {outcome.type === "Near Equilibrium" && "Populations are approaching steady states, suggesting weak predator-prey interactions."}
                        {outcome.type === "Analyzing..." && "Run the simulation longer to analyze the cyclical patterns and stability."}
                      </p>
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div className="text-center">
                          <div className="text-lg font-mono font-bold text-primary">
                            {parameters.a!.toFixed(3)}
                          </div>
                          <div className="text-xs text-muted-foreground">Predation Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-mono font-bold text-secondary">
                            {parameters.b!.toFixed(3)}
                          </div>
                          <div className="text-xs text-muted-foreground">Pred. Efficiency</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm space-y-2">
                      <p><strong>Current Parameters Predict:</strong> {outcome.type}</p>
                      <p className="text-muted-foreground leading-relaxed">
                        {outcome.type === "Coexistence" && "Both species can persist because interspecific competition is weaker than intraspecific competition for both species."}
                        {outcome.type === "Species 1 Wins" && "Species 1 will exclude Species 2 because it has a competitive advantage."}
                        {outcome.type === "Species 2 Wins" && "Species 2 will exclude Species 1 because it has a competitive advantage."}
                        {outcome.type === "Bistable" && "The outcome depends on initial conditions - whichever species gets established first will exclude the other."}
                      </p>
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div className="text-center">
                          <div className="text-lg font-mono font-bold text-primary">
                            {(parameters.a12! / (parameters.K1! / parameters.K2!)).toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">α₁₂ / (K₁/K₂)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-mono font-bold text-secondary">
                            {(parameters.a21! / (parameters.K2! / parameters.K1!)).toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">α₂₁ / (K₂/K₁)</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            <SimulationChart data={data} isRunning={isRunning} modelType={modelType} />
            <SimulationControls
              modelType={modelType}
              parameters={parameters}
              onParameterChange={updateParameter}
              isRunning={isRunning}
              onPlayPause={toggleSimulation}
              onReset={resetSimulation}
            />
          </div>
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
                          <div className="text-muted-foreground">r₁ (prey)</div>
                        </div>
                        <div className="text-center">
                          <div className="font-mono font-semibold">{scenario.parameters.r2}</div>
                          <div className="text-muted-foreground">r₂ (pred)</div>
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
                          <div className="text-muted-foreground">r₁</div>
                        </div>
                        <div className="text-center">
                          <div className="font-mono font-semibold">{scenario.parameters.r2}</div>
                          <div className="text-muted-foreground">r₂</div>
                        </div>
                        <div className="text-center">
                          <div className="font-mono font-semibold">{scenario.parameters.a12}</div>
                          <div className="text-muted-foreground">α₁₂</div>
                        </div>
                        <div className="text-center">
                          <div className="font-mono font-semibold">{scenario.parameters.a21}</div>
                          <div className="text-muted-foreground">α₂₁</div>
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