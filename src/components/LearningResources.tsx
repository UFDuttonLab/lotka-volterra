import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { BookOpen, Globe, Users, Beaker, TreePine, Fish, Bird, Zap, Waves } from "lucide-react";

interface ResourceSection {
  id: string;
  title: string;
  icon: any;
  resources: Resource[];
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

interface ExerciseParameters {
  r1?: number;
  r2?: number;
  K1?: number;
  K2?: number;
  a12?: number;
  a21?: number;
  a?: number;
  b?: number;
  N1_0?: number;
  N2_0?: number;
}

interface Resource {
  title: string;
  description: string;
  type: "study" | "example" | "exercise" | "reading";
  difficulty: "beginner" | "intermediate" | "advanced";
  content: string[];
  modelType?: "competition" | "predator-prey";
  parameters?: ExerciseParameters;
  question?: ExerciseQuestion;
}

interface LearningResourcesProps {
  onLoadExercise: (
    parameters: ExerciseParameters, 
    modelType: "competition" | "predator-prey", 
    title: string
  ) => void;
  onSetSelectedExercise: (exercise: {
    title: string;
    description: string;
    difficulty: string;
    question: ExerciseQuestion;
  } | null) => void;
}

const learningResources: ResourceSection[] = [
  {
    id: "real-examples",
    title: "Real-World Examples",
    icon: Globe,
    resources: [
      {
        title: "Darwin's Finches Competition",
        description: "Classic example of character displacement and competitive exclusion in the Galápagos",
        type: "study",
        difficulty: "beginner",
        content: [
          "Medium and large ground finches (Geospiza fortis and G. magnirostris) compete for seeds",
          "During drought years, large seeds become more common, favoring G. magnirostris",
          "G. fortis populations decline when G. magnirostris is present",
          "Beak size evolution demonstrates character displacement to reduce competition",
          "Mathematical models predict competitive outcomes based on seed availability"
        ]
      },
      {
        title: "Forest Canopy Competition",
        description: "How tree species compete for light in temperate forests",
        type: "example",
        difficulty: "intermediate",
        content: [
          "Oak and maple species compete for canopy space and light access",
          "Shade tolerance determines competitive ability in different forest layers",
          "Growth rates vary with light availability and competitor density",
          "Competition coefficients change with forest succession stage",
          "Management practices can alter competitive outcomes"
        ]
      },
      {
        title: "Lynx-Snowshoe Hare Cycles",
        description: "Famous predator-prey oscillations in the Canadian wilderness",
        type: "study",
        difficulty: "intermediate",
        content: [
          "Hudson Bay Company fur records show ~10-year population cycles",
          "Hare populations crash when lynx numbers are highest",
          "Lynx populations follow hare cycles with a slight delay",
          "Environmental factors like weather also influence the cycles",
          "Mathematical models capture the essential predator-prey dynamics"
        ]
      }
    ]
  },
  {
    id: "competition-exercises",
    title: "Competition Exercises",
    icon: Beaker,
    resources: [
      {
        title: "Coexistence vs Exclusion",
        description: "Predict whether two competing species can coexist or one will exclude the other",
        type: "exercise",
        difficulty: "beginner",
        modelType: "competition",
        parameters: {
          r1: 1.0,
          r2: 0.8,
          K1: 100,
          K2: 120,
          a12: 0.7,
          a21: 0.9,
          N1_0: 20,
          N2_0: 15
        },
        content: [
          "Run the simulation with the given parameters",
          "Observe how the populations change over time",
          "Determine the final outcome of competition"
        ],
        question: {
          id: "coexistence-q1",
          question: "Based on the simulation results, what happens to these two competing species over time?",
          options: [
            { id: "a", text: "Both species coexist at stable population levels" },
            { id: "b", text: "Species 1 excludes Species 2 completely" },
            { id: "c", text: "Species 2 excludes Species 1 completely" },
            { id: "d", text: "Both species go extinct" }
          ],
          correctAnswer: "a",
          explanation: "With α₁₂ = 0.7 < K₁/K₂ = 0.83 and α₂₁ = 0.9 < K₂/K₁ = 1.2, both species can coexist. The competition coefficients are weak enough that neither species can completely exclude the other.",
          hint: "Compare the competition coefficients (α₁₂ and α₂₁) with the ratios of carrying capacities (K₁/K₂ and K₂/K₁)"
        }
      },
      {
        title: "Strong Competition Analysis",
        description: "Examine what happens when competition is very intense between species",
        type: "exercise",
        difficulty: "intermediate",
        modelType: "competition",
        parameters: {
          r1: 1.2,
          r2: 0.9,
          K1: 80,
          K2: 100,
          a12: 1.8,
          a21: 1.5,
          N1_0: 25,
          N2_0: 30
        },
        content: [
          "This scenario models intense competition between species",
          "Watch how strong competitive effects influence population dynamics",
          "Note which species has the competitive advantage"
        ],
        question: {
          id: "strong-comp-q1",
          question: "In this high-competition scenario, which species survives and why?",
          options: [
            { id: "a", text: "Species 1 survives because it has a higher growth rate" },
            { id: "b", text: "Species 2 survives because it has a higher carrying capacity" },
            { id: "c", text: "Both species survive but at very low populations" },
            { id: "d", text: "The outcome depends on the initial population sizes" }
          ],
          correctAnswer: "b",
          explanation: "Species 2 wins because α₂₁ = 1.5 > K₂/K₁ = 1.25, but α₁₂ = 1.8 > K₁/K₂ = 0.8. When both species have strong competitive effects, the species with the higher carrying capacity (Species 2, K₂ = 100) typically wins.",
          hint: "In mutual exclusion scenarios, compare carrying capacities and competitive strengths"
        }
      },
      {
        title: "Invasion Success Prediction",
        description: "Determine if a new species can successfully invade an established population",
        type: "exercise",
        difficulty: "advanced",
        modelType: "competition",
        parameters: {
          r1: 0.8,
          r2: 1.1,
          K1: 150,
          K2: 90,
          a12: 0.4,
          a21: 1.3,
          N1_0: 140,
          N2_0: 5
        },
        content: [
          "Species 1 is well-established near its carrying capacity",
          "Species 2 starts with a very small population (invasion scenario)",
          "Determine if the invader can establish and grow"
        ],
        question: {
          id: "invasion-q1",
          question: "Can Species 2 successfully invade and establish a population when Species 1 is dominant?",
          options: [
            { id: "a", text: "No, Species 2 cannot invade because Species 1 is too well established" },
            { id: "b", text: "Yes, Species 2 can invade and will eventually exclude Species 1" },
            { id: "c", text: "Yes, Species 2 can invade and both species will coexist" },
            { id: "d", text: "The invasion depends on random environmental factors" }
          ],
          correctAnswer: "b",
          explanation: "Species 2 can invade because α₂₁ = 1.3 > K₂/K₁ = 0.6, meaning Species 2 can grow even when Species 1 is at carrying capacity. Despite starting small, Species 2's competitive advantage allows it to eventually exclude Species 1.",
          hint: "For invasion analysis, check if the invading species can grow when the resident is at equilibrium"
        }
      }
    ]
  },
  {
    id: "predator-prey-exercises", 
    title: "Predator-Prey Exercises",
    icon: Zap,
    resources: [
      {
        title: "Oscillation Period Prediction",
        description: "Predict how parameter changes affect the period of predator-prey cycles",
        type: "exercise",
        difficulty: "beginner",
        modelType: "predator-prey",
        parameters: {
          r1: 1.0,
          a: 0.1,
          b: 0.075,
          r2: 0.8,
          N1_0: 40,
          N2_0: 9
        },
        content: [
          "This system shows classic predator-prey oscillations",
          "Observe the population cycles of prey (Species 1) and predator (Species 2)",
          "Count how long one complete cycle takes"
        ],
        question: {
          id: "oscillation-q1",
          question: "What happens to the oscillation period if we increase the predator attack rate (parameter 'a')?",
          options: [
            { id: "a", text: "The oscillation period becomes longer" },
            { id: "b", text: "The oscillation period becomes shorter" },
            { id: "c", text: "The oscillation period stays the same" },
            { id: "d", text: "The oscillations stop completely" }
          ],
          correctAnswer: "b",
          explanation: "Increasing the attack rate 'a' makes predators more efficient at catching prey, which intensifies the predator-prey interaction. This leads to faster population changes and shorter oscillation periods. The system becomes more 'tightly coupled'.",
          hint: "Think about how more efficient predation affects the speed of population changes"
        }
      },
      {
        title: "Stability Analysis Challenge",
        description: "Determine what parameters lead to stable vs unstable predator-prey dynamics",
        type: "exercise", 
        difficulty: "intermediate",
        modelType: "predator-prey",
        parameters: {
          r1: 2.0,
          a: 0.05,
          b: 0.02,
          r2: 1.5,
          N1_0: 60,
          N2_0: 30
        },
        content: [
          "High growth rates can lead to unstable dynamics",
          "Watch what happens to the populations over time",
          "Consider whether this system is realistic"
        ],
        question: {
          id: "stability-q1",
          question: "What characterizes the long-term behavior of this predator-prey system?",
          options: [
            { id: "a", text: "Stable oscillations that continue indefinitely" },
            { id: "b", text: "Populations spiral outward to extinction or unrealistic levels" },
            { id: "c", text: "Both populations reach a steady equilibrium" },
            { id: "d", text: "Only the predator population survives" }
          ],
          correctAnswer: "b",
          explanation: "With high growth rates (r₁ = 2.0, r₂ = 1.5) relative to interaction strengths, the system becomes unstable. The Lotka-Volterra model lacks density-dependent regulation, so high growth rates cause populations to spiral to unrealistic extremes.",
          hint: "Consider whether the population sizes remain realistic over time"
        }
      },
      {
        title: "Population Peak Timing",
        description: "Analyze the phase relationship between predator and prey population peaks",
        type: "exercise",
        difficulty: "advanced", 
        modelType: "predator-prey",
        parameters: {
          r1: 1.2,
          a: 0.08,
          b: 0.04,
          r2: 0.6,
          N1_0: 35,
          N2_0: 15
        },
        content: [
          "Classic predator-prey cycles with clear phase relationships",
          "Track when each population reaches its maximum",
          "Observe the timing between prey and predator peaks"
        ],
        question: {
          id: "timing-q1",
          question: "In predator-prey cycles, when does the predator population typically reach its peak relative to the prey peak?",
          options: [
            { id: "a", text: "At exactly the same time as the prey peak" },
            { id: "b", text: "About 1/4 cycle before the prey peak" },
            { id: "c", text: "About 1/4 cycle after the prey peak" },
            { id: "d", text: "The timing is completely random" }
          ],
          correctAnswer: "c",
          explanation: "Predator populations lag behind prey populations by about 1/4 of a cycle. This happens because: (1) prey populations peak first, (2) abundant prey allows predator populations to grow, (3) predators peak after prey have started declining, (4) then predator decline follows prey decline. This phase lag is fundamental to predator-prey dynamics.",
          hint: "Think about the cause-and-effect relationship: predators respond to prey abundance"
        }
      }
    ]  
  },
  {
    id: "case-studies",
    title: "Detailed Case Studies",
    icon: Users,
    resources: [
      {
        title: "Gause's Paramecium Experiments",
        description: "The foundational laboratory studies that validated competitive exclusion",
        type: "study",
        difficulty: "intermediate",
        content: [
          "G.F. Gause (1934) used Paramecium aurelia and P. caudatum in controlled conditions",
          "Both species grew well alone but P. aurelia excluded P. caudatum in competition",
          "Competition coefficients were estimated from population growth data",
          "Results matched Lotka-Volterra predictions for competitive exclusion",
          "Established the competitive exclusion principle in ecology"
        ]
      },
      {
        title: "Invasive Species Management",
        description: "Using competition models to predict and manage biological invasions",
        type: "example",
        difficulty: "advanced",
        content: [
          "Purple loosestrife invasion of North American wetlands",
          "Native cattails compete with invasive loosestrife for space and nutrients",
          "Competition models help predict invasion success in different habitats",
          "Management strategies target competitive advantages of invasive species",
          "Mathematical models guide restoration efforts and control programs"
        ]
      }
    ]
  },
  {
    id: "further-reading",
    title: "Advanced Topics",
    icon: BookOpen,
    resources: [
      {
        title: "Spatial Competition Models",
        description: "How space and dispersal affect competitive outcomes",
        type: "reading",
        difficulty: "advanced",
        content: [
          "Reaction-diffusion equations incorporate spatial movement",
          "Habitat fragmentation affects competitive coexistence",
          "Source-sink dynamics modify competition outcomes",
          "Spatial refugia can promote species coexistence",
          "Metacommunity theory extends competition models across landscapes"
        ]
      },
      {
        title: "Evolutionary Game Theory",
        description: "When competition drives evolutionary change",
        type: "reading",
        difficulty: "advanced",
        content: [
          "Adaptive dynamics combine ecology and evolution",
          "Evolutionary stable strategies (ESS) in competitive systems",
          "Character displacement and niche evolution",
          "Trade-offs between competitive ability and other traits",
          "Coevolutionary dynamics in competing species"
        ]
      }
    ]
  }
];

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  advanced: "bg-red-100 text-red-800 border-red-200"
};

const typeIcons = {
  study: TreePine,
  example: Fish,
  exercise: Beaker,
  reading: BookOpen
};

export default function LearningResources({ onLoadExercise, onSetSelectedExercise }: LearningResourcesProps) {
  const handleExerciseClick = (resource: Resource) => {
    if (resource.type === "exercise" && resource.parameters && resource.modelType && resource.question) {
      // Load the exercise in simulation first
      onLoadExercise(resource.parameters, resource.modelType, resource.title);
      
      // Then show the question modal globally
      onSetSelectedExercise({
        title: resource.title,
        description: resource.description,
        difficulty: resource.difficulty,
        question: resource.question
      });
    }
  };
  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Learning Resources & Case Studies
          </CardTitle>
          <p className="text-muted-foreground">
            Explore real-world applications, work through exercises, and deepen your understanding 
            with detailed case studies and examples from nature.
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="real-examples" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {learningResources.map((section) => {
            const Icon = section.icon;
            return (
              <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{section.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {learningResources.map((section) => (
          <TabsContent key={section.id} value={section.id} className="space-y-4">
            <div className="grid gap-4">
              {section.resources.map((resource, idx) => {
                const TypeIcon = typeIcons[resource.type];
                return (
                  <Card key={idx} className="shadow-card hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className={`text-xs ${difficultyColors[resource.difficulty]}`}>
                            {resource.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {resource.type}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {resource.content.map((item, contentIdx) => (
                          <li key={contentIdx} className="text-sm flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {resource.type === "exercise" && (
                        <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-4 border border-accent/20">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleExerciseClick(resource)}
                          >
                            Try This Exercise in Simulation
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="shadow-card bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="font-semibold text-lg">Continue Learning</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              These resources provide a foundation for understanding species competition. 
              For deeper exploration, consider examining primary literature in ecology journals 
              and exploring advanced mathematical biology textbooks.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="text-xs">Theoretical Ecology</Badge>
              <Badge variant="outline" className="text-xs">Population Biology</Badge>
              <Badge variant="outline" className="text-xs">Mathematical Biology</Badge>
              <Badge variant="outline" className="text-xs">Conservation Science</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}