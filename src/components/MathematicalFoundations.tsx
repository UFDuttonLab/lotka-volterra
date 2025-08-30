import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, Calculator, Info, Lightbulb, Target } from "lucide-react";
import { useState } from "react";

interface MathSection {
  id: string;
  title: string;
  icon: any;
  badge: string;
  content: {
    introduction: string;
    equations?: string[];
    explanations: string[];
    biologicalMeaning: string;
    examples?: string[];
  };
}

const mathSections: MathSection[] = [
  {
    id: "basic-growth",
    title: "From Basic Growth to Competition",
    icon: Lightbulb,
    badge: "Foundation",
    content: {
      introduction: "Competition models build upon the basic logistic growth equation by incorporating interspecific effects.",
      equations: [
        "Basic exponential growth: dN/dt = rN",
        "Logistic growth: dN/dt = rN(1 - N/K)",
        "With competition: dN/dt = rN(1 - (N + αN₂)/K)"
      ],
      explanations: [
        "The exponential model assumes unlimited resources and no competition",
        "Logistic growth adds intraspecific competition through carrying capacity K",
        "Competition models add interspecific effects through competition coefficients α",
        "The α coefficient represents how much one individual of species 2 affects species 1"
      ],
      biologicalMeaning: "This progression shows how mathematical models become more realistic by adding biological complexity. Competition coefficients quantify how strongly species interact."
    }
  },
  {
    id: "full-equations",
    title: "Complete Lotka-Volterra Competition System",
    icon: Calculator,
    badge: "Core Model",
    content: {
      introduction: "The full system describes how two species populations change over time under mutual competition.",
      equations: [
        "Species 1: dN₁/dt = r₁N₁(1 - (N₁ + α₁₂N₂)/K₁)",
        "Species 2: dN₂/dt = r₂N₂(1 - (N₂ + α₂₁N₁)/K₂)"
      ],
      explanations: [
        "r₁, r₂: Intrinsic growth rates when resources are unlimited",
        "K₁, K₂: Carrying capacities in the absence of the other species",
        "α₁₂: Effect of species 2 on species 1 (per capita competition)",
        "α₂₁: Effect of species 1 on species 2 (per capita competition)",
        "N₁, N₂: Population sizes at time t"
      ],
      biologicalMeaning: "These coupled differential equations capture how each species' growth depends on both its own density and the density of its competitor."
    }
  },
  {
    id: "equilibrium",
    title: "Equilibrium Points and Stability",
    icon: Target,
    badge: "Analysis",
    content: {
      introduction: "Equilibrium points occur where both populations stop changing (dN₁/dt = dN₂/dt = 0).",
      equations: [
        "Trivial equilibrium: (0, 0) - both species extinct",
        "Single-species equilibria: (K₁, 0) and (0, K₂)",
        "Coexistence equilibrium: N₁* = (K₁ - α₁₂K₂)/(1 - α₁₂α₂₁), N₂* = (K₂ - α₂₁K₁)/(1 - α₁₂α₂₁)"
      ],
      explanations: [
        "The trivial equilibrium is always unstable if growth rates are positive",
        "Single-species equilibria exist when one species excludes the other",
        "Coexistence equilibrium exists only when both N₁* > 0 and N₂* > 0",
        "Stability depends on the relative strength of inter- vs intraspecific competition"
      ],
      biologicalMeaning: "Equilibrium analysis predicts the long-term outcome of competition: extinction, competitive exclusion, or coexistence.",
      examples: [
        "If α₁₂ > K₁/K₂ and α₂₁ < K₂/K₁: Species 2 wins",
        "If α₁₂ < K₁/K₂ and α₂₁ > K₂/K₁: Species 1 wins",
        "If α₁₂ < K₁/K₂ and α₂₁ < K₂/K₁: Stable coexistence",
        "If α₁₂ > K₁/K₂ and α₂₁ > K₂/K₁: Bistable - initial conditions matter"
      ]
    }
  },
  {
    id: "competition-outcomes",
    title: "Competitive Outcomes and Conditions",
    icon: Info,
    badge: "Predictions",
    content: {
      introduction: "The model predicts four possible outcomes based on the competition coefficients and carrying capacities.",
      explanations: [
        "Competitive Exclusion: One species always wins regardless of initial conditions",
        "Stable Coexistence: Both species persist at a stable equilibrium",
        "Founder Control: The outcome depends on which species starts with more individuals",
        "Bistability: Two stable states exist - one or both species can persist"
      ],
      biologicalMeaning: "These outcomes help predict real ecological scenarios and guide conservation decisions.",
      examples: [
        "Two bird species competing for nesting sites might show competitive exclusion",
        "Plant species with different resource needs might stably coexist",
        "Invasive species often show founder control - early establishment is crucial",
        "Some systems show bistability with alternative stable states"
      ]
    }
  }
];

export default function MathematicalFoundations() {
  const [openSections, setOpenSections] = useState<string[]>(["basic-growth"]);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Mathematical Foundations
          </CardTitle>
          <p className="text-muted-foreground">
            Understand the mathematical principles behind the Lotka-Volterra competition equations, 
            from basic concepts to advanced analysis.
          </p>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {mathSections.map((section) => {
          const Icon = section.icon;
          const isOpen = openSections.includes(section.id);
          
          return (
            <Card key={section.id} className="shadow-card">
              <Collapsible open={isOpen} onOpenChange={() => toggleSection(section.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {section.badge}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-6">
                    <p className="text-sm leading-relaxed">{section.content.introduction}</p>
                    
                    {section.content.equations && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                          Mathematical Equations:
                        </h4>
                        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                          {section.content.equations.map((equation, idx) => (
                            <div key={idx} className="font-mono text-sm bg-card p-2 rounded border">
                              {equation}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Key Concepts:
                      </h4>
                      <ul className="space-y-2">
                        {section.content.explanations.map((explanation, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span>{explanation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-4 border border-secondary/20">
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-secondary" />
                        Biological Interpretation:
                      </h4>
                      <p className="text-sm leading-relaxed">{section.content.biologicalMeaning}</p>
                    </div>
                    
                    {section.content.examples && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                          Examples:
                        </h4>
                        <div className="grid gap-2">
                          {section.content.examples.map((example, idx) => (
                            <div key={idx} className="text-sm bg-accent/5 p-3 rounded border border-accent/20">
                              {example}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      <Card className="shadow-card bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="font-semibold text-lg">Mathematical Significance</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              The Lotka-Volterra competition equations represent one of the most elegant examples of how mathematics 
              can capture complex biological phenomena. They demonstrate how simple assumptions about growth and 
              competition lead to rich, predictive models that guide our understanding of ecological communities.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="outline" className="text-xs">Differential Equations</Badge>
              <Badge variant="outline" className="text-xs">Stability Analysis</Badge>
              <Badge variant="outline" className="text-xs">Phase Plane</Badge>
              <Badge variant="outline" className="text-xs">Equilibrium Theory</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}