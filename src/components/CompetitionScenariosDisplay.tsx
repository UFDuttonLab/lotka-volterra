import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import IsoclineDiagram from "./IsoclineDiagram";

interface CompetitionParameters {
  r1: number;
  r2: number;
  K1: number;
  K2: number;
  a12: number;
  a21: number;
  N1_0: number;
  N2_0: number;
}

interface CompetitionScenario {
  label: string;
  description: string;
  parameters: CompetitionParameters & { a: number; b: number; };
  condition: string;
  outcome: string;
}

const competitionScenarios: CompetitionScenario[] = [
  {
    label: "Stable Coexistence",
    description: "α₁₂ < K₁/K₂ and α₂₁ < K₂/K₁",
    parameters: {
      r1: 1.0, r2: 0.8, K1: 100, K2: 80,
      a12: 0.5, a21: 0.6, N1_0: 50, N2_0: 40,
      a: 0.1, b: 0.075 // dummy predator-prey params
    },
    condition: "0.5 < 1.25 and 0.6 < 0.8",
    outcome: "Both species coexist at stable equilibrium. Interspecific competition is weaker than intraspecific competition for both species."
  },
  {
    label: "Species 1 Wins",
    description: "α₁₂ < K₁/K₂ and α₂₁ > K₂/K₁",
    parameters: {
      r1: 1.0, r2: 0.8, K1: 100, K2: 80,
      a12: 0.3, a21: 1.5, N1_0: 50, N2_0: 40,
      a: 0.1, b: 0.075 // dummy predator-prey params
    },
    condition: "0.3 < 1.25 and 1.5 > 0.8",
    outcome: "Species 1 excludes Species 2. Species 1 is the superior competitor and drives Species 2 to extinction."
  },
  {
    label: "Species 2 Wins", 
    description: "α₁₂ > K₁/K₂ and α₂₁ < K₂/K₁",
    parameters: {
      r1: 1.0, r2: 0.8, K1: 100, K2: 80,
      a12: 1.4, a21: 0.4, N1_0: 50, N2_0: 40,
      a: 0.1, b: 0.075 // dummy predator-prey params
    },
    condition: "1.4 > 1.25 and 0.4 < 0.8",
    outcome: "Species 2 excludes Species 1. Species 2 is the superior competitor despite having a lower carrying capacity."
  },
    {
      label: "Bistability",
      description: "α₁₂ > K₁/K₂ and α₂₁ > K₂/K₁",
      parameters: {
        r1: 1.0, r2: 0.8, K1: 100, K2: 80,
        a12: 1.3, a21: 1.3, N1_0: 50, N2_0: 40,
        a: 0.1, b: 0.075 // dummy predator-prey params
      },
      condition: "1.3 > 1.25 and 1.3 > 0.8",
      outcome: "Winner depends on initial conditions. Both species are strong interspecific competitors, creating alternative stable states."
    }
];

export default function CompetitionScenariosDisplay() {
  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            Four Competitive Outcomes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The Lotka-Volterra competition model produces four distinct outcomes based on the relative strength 
            of interspecific versus intraspecific competition. Each scenario below shows different parameter 
            combinations and their resulting phase plane dynamics.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {competitionScenarios.map((scenario, index) => (
              <div key={index} className="space-y-3">
                <IsoclineDiagram
                  type="competition"
                  parameters={scenario.parameters}
                  showEmbeddedLegend={false}
                  scenarioLabel={scenario.label}
                  scenarioDescription={scenario.description}
                />
                <Card className="border-l-4 border-l-primary/50">
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Mathematical Condition
                      </Badge>
                    </div>
                    <p className="text-xs font-mono bg-muted/50 p-2 rounded">
                      {scenario.condition}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Ecological Outcome
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {scenario.outcome}
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      <span className="font-semibold">Parameters:</span> α₁₂={scenario.parameters.a12}, α₂₁={scenario.parameters.a21}, K₁={scenario.parameters.K1}, K₂={scenario.parameters.K2}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border">
            <h4 className="font-semibold text-sm mb-2">Key Insight: Parameter Thresholds</h4>
            <p className="text-sm text-muted-foreground">
              The critical thresholds K₁/K₂ and K₂/K₁ determine competitive outcomes. When competition coefficients 
              exceed these ratios, the stronger competitor excludes the weaker one. When both coefficients are below 
              their thresholds, coexistence is possible. When both exceed thresholds, initial conditions determine 
              the winner (bistability).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}