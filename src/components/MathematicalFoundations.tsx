import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Calculator, TreePine, Waves, TrendingUp, Target, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import ComparisonDiagram from "./ComparisonDiagram";
import IsoclineDiagram from "./IsoclineDiagram";

interface MathSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  content: {
    introduction: string;
    equations: string[];
    explanations: string[];
    biologicalMeaning: string;
    examples: string;
  };
}

const mathSections: MathSection[] = [
  {
    id: "parameter-definitions",
    title: "Parameter Definitions & Biological Context",
    icon: Calculator,
    badge: "Essential",
    content: {
      introduction: "Understanding what each mathematical parameter represents biologically is crucial for interpreting model behavior and connecting theory to real-world ecology.",
      equations: [
        "Competition Parameters: r₁, r₂ (growth rates), K₁, K₂ (carrying capacities), α₁₂, α₂₁ (competition coefficients)",
        "Predator-Prey Parameters: r₁ (prey growth), r₂ (predator death), a (predation rate), b (conversion efficiency)"
      ],
      explanations: [
        "r₁, r₂ (Intrinsic Growth Rates): Maximum per capita growth rate when resources unlimited. Units: per time. Range: 0.1-2.0/year for vertebrates, higher for microorganisms. Reflects reproductive potential and generation time.",
        "K₁, K₂ (Carrying Capacities): Maximum sustainable population given resource constraints. Units: individuals. Determined by food availability, habitat quality, territory requirements. Example: Deer carrying capacity depends on forage, cover, predation pressure.",
        "α₁₂, α₂₁ (Competition Coefficients): Per capita effect of species j on species i's growth. Units: dimensionless (equivalent individuals). Range: 0 (no competition) to >1 (strong interspecific effects). Measures resource overlap and competitive impact.",
        "a (Predation Rate/Capture Efficiency): Rate predators encounter and successfully capture prey. Units: prey consumed per predator per time. Combines search efficiency, encounter rate, capture success. Affected by hunting ability, prey escape behavior, habitat structure.",
        "b (Predator Efficiency/Conversion Rate): Efficiency converting consumed prey to new predators. Units: predators per prey consumed. Range: 0.01-0.5 (typically <20% due to metabolic losses). Reflects energetic efficiency, reproduction success, offspring survival."
      ],
      biologicalMeaning: "These parameters connect mathematical symbols to measurable biological quantities. Field ecologists determine parameter values through observation studies, removal experiments, and energetic analyses. Understanding parameter ranges helps assess model realism and predictions.",
      examples: "Measuring parameters: Lions hunt success ~20% (predation rate a), 10% ecological efficiency rule (conversion b), territory size studies (carrying capacity K), resource overlap experiments (competition coefficients α)."
    }
  },
  {
    id: "model-distinction",
    title: "Two Different Lotka-Volterra Systems",
    icon: TrendingUp,
    badge: "Fundamental",
    content: {
      introduction: "The Lotka-Volterra equations describe two different ecological scenarios: competition between species for resources, and predator-prey interactions. Understanding this distinction is crucial.",
      equations: [
        "Competition Model: dN₁/dt = r₁N₁(1 - (N₁ + α₁₂N₂)/K₁)",
        "Competition Model: dN₂/dt = r₂N₂(1 - (N₂ + α₂₁N₁)/K₂)",
        "Predator-Prey Model: dN₁/dt = r₁N₁ - aN₁N₂ (prey equation)",
        "Predator-Prey Model: dN₂/dt = -r₂N₂ + bN₁N₂ (predator equation)"
      ],
      explanations: [
        "Competition model: Species compete for limited resources, with carrying capacities K₁ and K₂",
        "Predator-prey model: One species (N₁) is consumed by another (N₂), with no carrying capacity",
        "Competition leads to equilibrium states, while predator-prey creates oscillatory dynamics",
        "Competition coefficients (α) measure resource overlap; predation coefficients (a,b) measure hunting efficiency"
      ],
      biologicalMeaning: "These models represent fundamentally different ecological interactions. Competition occurs when species use similar resources (birds competing for nesting sites), while predation involves one species consuming another (wolves hunting deer).",
      examples: "Competition: Finches competing for seeds on Galápagos Islands. Predator-Prey: Lynx and snowshoe hare population cycles in Canada, observed over decades of trapping records."
    }
  },
  {
    id: "basic-growth",
    title: "From Basic Growth to Interactions",
    icon: Lightbulb,
    badge: "Foundation",
    content: {
      introduction: "Both Lotka-Volterra models build upon the concept of exponential growth by adding species interactions.",
      equations: [
        "Basic exponential growth: dN/dt = rN",
        "Logistic growth: dN/dt = rN(1 - N/K)",
        "With competition: dN/dt = rN(1 - (N + αN₂)/K)",
        "With predation: dN/dt = rN - aN₁N₂"
      ],
      explanations: [
        "Exponential growth assumes unlimited resources and no species interactions",
        "Logistic growth adds intraspecific competition through carrying capacity K",
        "Competition models add interspecific competition through α coefficients",
        "Predator-prey models add consumption interactions through predation terms"
      ],
      biologicalMeaning: "This progression shows how mathematical models evolve from simple to complex by incorporating realistic biological processes. Each term represents a specific ecological mechanism.",
      examples: "Bacteria in culture (exponential) → Single species in environment (logistic) → Multiple competing species (competition) → Consumer-resource systems (predator-prey)."
    }
  },
  {
    id: "isoclines-flow-fields",
    title: "Isoclines & Flow Fields",
    icon: Target,
    badge: "Critical",
    content: {
      introduction: "Isoclines are fundamental tools for understanding population dynamics. They show where population growth rates equal zero and reveal the directional flow of population changes throughout phase space. The geometric differences between models create dramatically different ecological outcomes.",
      equations: [
        "Competition N₁-nullcline: dN₁/dt = 0 → N₁ = K₁ - α₁₂N₂ (diagonal line, slope = -1/α₁₂)",
        "Competition N₂-nullcline: dN₂/dt = 0 → N₂ = K₂ - α₂₁N₁ (diagonal line, slope = -α₂₁)",
        "Predator-prey N₁-nullcline: dN₁/dt = 0 → N₂ = r₁/a (horizontal line)",
        "Predator-prey N₂-nullcline: dN₂/dt = 0 → N₁ = r₂/b (vertical line)"
      ],
      explanations: [
        "GEOMETRIC DIFFERENCE: Competition creates intersecting diagonal lines; predator-prey creates perpendicular lines",
        "Competition nullclines: Both have negative slopes determined by competition coefficients α₁₂ and α₂₁",
        "Predator-prey nullclines: Always perpendicular (90°) regardless of parameter values",
        "Flow directions: Competition flows converge to equilibria; predator-prey flows circulate in closed orbits",
        "Equilibrium stability: Competition can have stable points; predator-prey has neutral stability with persistent cycles",
        "Parameter dependence: Competition isocline positions depend on K₁, K₂, α₁₂, α₂₁; predator-prey positions depend only on r₁/a and r₂/b"
      ],
      biologicalMeaning: "The contrasting isocline geometries reflect fundamentally different ecological mechanisms. Competition's diagonal lines represent resource limitation—as one species increases, the other's carrying capacity decreases proportionally. Predator-prey's perpendicular lines represent consumer-resource dynamics—prey density affects predator growth independently of predator effects on prey mortality. This geometric distinction explains why competition leads to competitive exclusion or coexistence, while predator-prey systems maintain population cycles.",
      examples: "Visualization key: In competition diagrams, watch how diagonal isoclines create 'wedge' regions leading to exclusion or coexistence. In predator-prey diagrams, observe how perpendicular isoclines create 'quadrants' with circular flow patterns. Darwin's finches (competition) show convergent flows to stable densities, while lynx-hare (predator-prey) show rotational flows creating the famous 10-year cycles."
    }
  },
  {
    id: "competition-system",
    title: "Competition Model Analysis", 
    icon: TreePine,
    badge: "Competition",
    content: {
      introduction: "The competition system describes how two species with overlapping resource requirements interact.",
      equations: [
        "Species 1: dN₁/dt = r₁N₁(1 - (N₁ + α₁₂N₂)/K₁)",
        "Species 2: dN₂/dt = r₂N₂(1 - (N₂ + α₂₁N₁)/K₂)",
        "Coexistence condition: α₁₂ < K₁/K₂ and α₂₁ < K₂/K₁"
      ],
      explanations: [
        "α₁₂ and α₂₁ are competition coefficients measuring interspecific effects",
        "K₁ and K₂ are carrying capacities for each species in isolation",
        "Equilibrium outcomes depend on the relative strength of inter- vs intraspecific competition",
        "Four possible outcomes: coexistence, exclusion of species 1, exclusion of species 2, or bistability"
      ],
      biologicalMeaning: "Competition models predict when species can coexist versus when one will exclude the other. This depends on how similarly the species use resources and their competitive abilities.",
      examples: "Darwin's finches with different beak sizes can coexist by using different seed sizes. Two plant species competing for the same nutrients may show competitive exclusion."
    }
  },
  {
    id: "predator-prey-system",
    title: "Predator-Prey Model Analysis",
    icon: Waves,
    badge: "Predator-Prey",
    content: {
      introduction: "The predator-prey system describes oscillatory dynamics between consumers and their food sources.",
      equations: [
        "Prey: dN₁/dt = r₁N₁ - aN₁N₂",
        "Predator: dN₂/dt = -r₂N₂ + bN₁N₂",
        "Conserved quantity: H = r₂·ln(N₁) - b·N₁ + r₁·ln(N₂) - a·N₂"
      ],
      explanations: [
        "Prey grow exponentially (r₁N₁) but are consumed by predators (aN₁N₂)",
        "Predators die at rate r₂ but gain from consuming prey (bN₁N₂)",
        "The system produces closed orbits - populations oscillate indefinitely",
        "The conserved quantity H determines the amplitude of oscillations"
      ],
      biologicalMeaning: "Predator-prey dynamics create the famous population cycles observed in nature. When prey are abundant, predators increase; when predators are numerous, prey decline, leading to predator decline and prey recovery.",
      examples: "Lynx and snowshoe hare cycles in Canada (10-year cycles), plankton-fish dynamics in lakes, and pest-natural enemy cycles in agriculture."
    }
  },
  {
    id: "conserved-quantity",
    title: "The Conserved Quantity H: System's Memory",
    icon: Target,
    badge: "Advanced",
    content: {
      introduction: "The conserved quantity H is one of the most important but least understood aspects of predator-prey dynamics. It acts like 'energy' in the ecological system.",
      equations: [
        "H = r₂·ln(N₁) - b·N₁ + r₁·ln(N₂) - a·N₂",
        "dH/dt = 0 (H remains constant along any trajectory)",
        "Equilibrium point: N₁* = r₂/b, N₂* = r₁/a"
      ],
      explanations: [
        "H is analogous to total energy in physical systems - it's conserved throughout population cycles",
        "Each closed orbit in phase space has a unique H value that identifies that specific orbit",
        "Initial conditions determine H value, which then constrains all future population dynamics",
        "Higher H values correspond to larger amplitude oscillations between abundance and scarcity",
        "H conservation explains why predator-prey orbits are closed (don't spiral inward like competition models)"
      ],
      biologicalMeaning: "H represents the 'total ecological energy' of the predator-prey system. It shows why these systems maintain persistent cycles rather than reaching stable equilibrium. The conservation of H means the system has perfect memory - it remembers its initial state forever, leading to predictable cyclical behavior.",
      examples: "In lynx-hare cycles, H determines whether populations swing between (500-5000 hares) or (50-50000 hares). Higher H means more extreme population crashes and booms. This explains why some regions show mild cycles while others show dramatic population swings."
    }
  },
  {
    id: "phase-plane-dynamics",
    title: "Phase Plane Analysis & Orbit Structure",
    icon: TrendingUp,
    badge: "Mathematical",
    content: {
      introduction: "Phase plane analysis reveals the geometric structure of population dynamics and helps visualize long-term system behavior.",
      equations: [
        "Competition nullclines: N₁ = K₁ - α₁₂N₂, N₂ = K₂ - α₂₁N₁",
        "Predator-prey nullclines: N₁ = r₂/b (vertical), N₂ = r₁/a (horizontal)",
        "Flow direction: ∇H points perpendicular to orbits in predator-prey systems"
      ],
      explanations: [
        "Nullclines show where dN₁/dt = 0 or dN₂/dt = 0 (zero growth lines)",
        "Competition: Four equilibrium outcomes based on α₁₂α₂₁ vs K₁/K₂ and K₂/K₁ relationships",
        "Predator-prey: Single equilibrium surrounded by nested closed orbits",
        "Orbit direction: Clockwise in predator-prey (prey peaks before predators)",
        "Stability: Competition equilibria can be stable; predator-prey equilibria are neutrally stable"
      ],
      biologicalMeaning: "Phase planes show the 'landscape' of possible population dynamics. In competition, populations flow toward stable points. In predator-prey, populations flow in circles around the equilibrium, with the size of circles determined by initial conditions and conserved quantity H.",
      examples: "Visualizing outcomes: Two competing plant species may converge to coexistence point. Lynx-hare populations trace elliptical orbits with hare peaks preceding lynx peaks by ~2 years, creating the characteristic phase lag observed in nature."
    }
  },
  {
    id: "equilibrium-analysis",
    title: "Equilibrium Points and Stability",
    icon: Target,
    badge: "Analysis",
    content: {
      introduction: "Equilibrium analysis reveals the long-term behavior of both model types and their stability properties.",
      equations: [
        "Competition equilibrium: N₁* = (K₁ - α₁₂K₂)/(1 - α₁₂α₂₁)",
        "Predator-prey equilibrium: N₁* = r₂/b, N₂* = r₁/a",
        "Stability: Competition can have stable points, predator-prey has neutral stability"
      ],
      explanations: [
        "Competition models can reach stable equilibrium where populations remain constant",
        "Predator-prey models have neutrally stable equilibria with constant oscillations",
        "Small perturbations in competition return to equilibrium; in predator-prey they create new orbits",
        "Real ecosystems show more complex stability due to environmental variation"
      ],
      biologicalMeaning: "Equilibrium analysis helps predict long-term outcomes. Competition can lead to stable coexistence or exclusion, while predator-prey relationships maintain dynamic equilibria through oscillations.",
      examples: "Competing tree species may reach stable densities in mature forests. Predator-prey systems like wolves and deer show persistent population fluctuations around average levels."
    }
  }
];

export default function MathematicalFoundations() {
  const [openSections, setOpenSections] = useState<string[]>(["parameter-definitions"]);

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
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Explore the mathematical foundations underlying both Lotka-Volterra systems.
            Each section builds upon the previous concepts, from basic population growth
            to complex multi-species interactions and their dynamic behaviors.
          </p>
        </CardContent>
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
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-6">
                    <p className="text-sm leading-relaxed">{section.content.introduction}</p>
                    
                    {/* Add interactive visual diagrams for isoclines section */}
                    {section.id === "isoclines-flow-fields" && (
                      <div className="space-y-4">
                        <ComparisonDiagram />
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Mathematical Equations:
                      </h4>
                      <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                        {section.content.equations.map((equation, idx) => (
                          <div key={idx} className="math-formula unicode-math text-sm bg-card p-3 rounded border">
                            {equation}
                          </div>
                        ))}
                      </div>
                    </div>
                    
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
                    
                    <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
                      <h4 className="text-sm font-semibold mb-2 text-accent-foreground">
                        Real-World Examples:
                      </h4>
                      <p className="text-sm leading-relaxed">{section.content.examples}</p>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Mathematical Significance</h3>
            <p className="text-muted-foreground leading-relaxed">
              The Lotka-Volterra equations represent fundamental mathematical descriptions of ecological dynamics.
              The competition model reveals how species interactions affect equilibrium states, while the predator-prey
              model demonstrates how consumer-resource relationships create cyclical population dynamics.
              These models have applications beyond ecology, including economics, chemistry, and epidemiology.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              <Badge variant="outline">Differential Equations</Badge>
              <Badge variant="outline">Dynamic Systems</Badge>
              <Badge variant="outline">Equilibrium Analysis</Badge>
              <Badge variant="outline">Phase Plane Dynamics</Badge>
              <Badge variant="outline">Conservation Laws</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}