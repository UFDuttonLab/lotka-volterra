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
      r1: 1.0, r2: 0.8, K1: 120, K2: 100,
      a12: 0.4, a21: 0.5, N1_0: 50, N2_0: 40,
      a: 0.1, b: 0.075 // dummy predator-prey params
    },
    condition: "0.4 < 1.2 and 0.5 < 0.83",
    outcome: "Both species coexist at stable equilibrium. Nullclines intersect in positive quadrant, creating a stable interior equilibrium."
  },
  {
    label: "Species 1 Wins",
    description: "α₁₂ < K₁/K₂ and α₂₁ > K₂/K₁",
    parameters: {
      r1: 1.0, r2: 0.8, K1: 150, K2: 80,
      a12: 0.3, a21: 2.0, N1_0: 50, N2_0: 40,
      a: 0.1, b: 0.075 // dummy predator-prey params
    },
    condition: "0.3 < 1.875 and 2.0 > 0.53",
    outcome: "Species 1 excludes Species 2. Species 1 nullcline is visually dominant, forming the outer boundary of feasible region."
  },
  {
    label: "Species 2 Wins", 
    description: "α₁₂ > K₁/K₂ and α₂₁ < K₂/K₁",
    parameters: {
      r1: 1.0, r2: 0.8, K1: 80, K2: 120,
      a12: 2.2, a21: 0.4, N1_0: 50, N2_0: 40,
      a: 0.1, b: 0.075 // dummy predator-prey params
    },
    condition: "2.2 > 0.67 and 0.4 < 1.5",
    outcome: "Species 2 excludes Species 1. Species 2 nullcline is visually dominant, forming the outer boundary of feasible region."
  },
  {
    label: "Bistability",
    description: "α₁₂ > K₁/K₂ and α₂₁ > K₂/K₁",
    parameters: {
      r1: 1.0, r2: 0.8, K1: 100, K2: 100,
      a12: 1.8, a21: 1.8, N1_0: 50, N2_0: 50,
      a: 0.1, b: 0.075 // dummy predator-prey params
    },
    condition: "1.8 > 1.0 and 1.8 > 1.0",
    outcome: "Winner depends on initial conditions. Both nullclines intersect, creating two alternative stable equilibria at the axes. Shaded regions show stability basins."
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
          
          <div className="mt-4 p-4 bg-gradient-to-r from-accent/5 to-primary/5 rounded-lg border">
            <h4 className="font-semibold text-sm mb-2">Stable Coexistence vs. Bistability: Key Differences</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p><strong>Stable Coexistence:</strong> Both species <em>always</em> coexist at a single stable interior equilibrium point, regardless of where they start. This occurs when competition coefficients are relatively weak (α₁₂ &lt; K₁/K₂ and α₂₁ &lt; K₂/K₁).</p>
              </div>
              <div>
                <p><strong>Bistability:</strong> Either Species 1 <em>or</em> Species 2 wins (mutual exclusion), but which one depends entirely on initial population sizes. This occurs when competition coefficients are strong (α₁₂ &gt; K₁/K₂ and α₂₁ &gt; K₂/K₁).</p>
              </div>
              <div className="pt-2 border-t border-muted/20">
                <p><strong>The Key Difference:</strong> Stable coexistence has <em>one predictable outcome</em> independent of initial conditions, while bistability has <em>two possible outcomes</em> that depend critically on where the populations start.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gradient-to-r from-secondary/5 to-accent/5 rounded-lg border">
            <h4 className="font-semibold text-sm mb-2">Understanding Stability Basins in Bistability</h4>
            <p className="text-sm text-muted-foreground mb-3">
              In the bistability scenario, the colored shaded regions represent <strong>stability basins</strong> - areas in the phase plane 
              where different initial population combinations lead to predictable outcomes.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Species 1 Basin (Blue):</strong> Initial conditions in this region lead to Species 1 excluding Species 2.</p>
              <p><strong>Species 2 Basin (Red):</strong> Initial conditions in this region lead to Species 2 excluding Species 1.</p>
              <p><strong>Separatrix:</strong> The boundary line between basins, representing the unstable interior equilibrium point where the system could tip either way.</p>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              This demonstrates that in bistable competition, <em>history matters</em> - the winner depends not on intrinsic competitive ability alone, 
              but on the starting population sizes of both species.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}