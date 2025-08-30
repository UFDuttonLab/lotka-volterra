import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { BookOpen, Globe, Users, Beaker, TreePine, Fish, Bird } from "lucide-react";

interface ResourceSection {
  id: string;
  title: string;
  icon: any;
  resources: Resource[];
}

interface Resource {
  title: string;
  description: string;
  type: "study" | "example" | "exercise" | "reading";
  difficulty: "beginner" | "intermediate" | "advanced";
  content: string[];
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
        title: "Marine Fish Competition",
        description: "Competitive dynamics in coral reef fish communities",
        type: "study",
        difficulty: "advanced",
        content: [
          "Damselfish species compete for territorial space on coral reefs",
          "Aggressive interactions determine access to feeding and breeding sites",
          "Body size and aggression level influence competitive ability",
          "Habitat complexity affects coexistence potential",
          "Climate change alters competitive relationships through coral bleaching"
        ]
      }
    ]
  },
  {
    id: "exercises",
    title: "Interactive Exercises",
    icon: Beaker,
    resources: [
      {
        title: "Parameter Prediction Challenge",
        description: "Guess the competition outcome based on given parameters",
        type: "exercise",
        difficulty: "beginner",
        content: [
          "Given: r₁ = 1.2, r₂ = 0.8, K₁ = 100, K₂ = 150, α₁₂ = 0.6, α₂₁ = 1.2",
          "Question: Which species will win in competition?",
          "Hint: Compare α₁₂ with K₁/K₂ and α₂₁ with K₂/K₁",
          "Answer: Species 2 wins (α₁₂ < K₁/K₂ but α₂₁ > K₂/K₁)",
          "Explanation: Species 2 has a competitive advantage and will exclude Species 1"
        ]
      },
      {
        title: "Equilibrium Calculation",
        description: "Calculate coexistence equilibrium for given parameters",
        type: "exercise",
        difficulty: "intermediate",
        content: [
          "Given: K₁ = 200, K₂ = 180, α₁₂ = 0.4, α₂₁ = 0.3",
          "Calculate: N₁* and N₂* for stable coexistence",
          "Formula: N₁* = (K₁ - α₁₂K₂)/(1 - α₁₂α₂₁)",
          "Solution: N₁* = 128, N₂* = 141.6",
          "Verify: Both values are positive, so stable coexistence is possible"
        ]
      },
      {
        title: "Invasion Analysis",
        description: "Determine if a species can invade an established population",
        type: "exercise",
        difficulty: "advanced",
        content: [
          "Scenario: Species 1 is at carrying capacity K₁ = 100",
          "Question: Can Species 2 invade with parameters r₂ = 0.5, K₂ = 80, α₂₁ = 0.6?",
          "Method: Check if dN₂/dt > 0 when N₁ = K₁ and N₂ is small",
          "Calculation: dN₂/dt = r₂N₂(1 - α₂₁K₁/K₂) = 0.5N₂(1 - 0.75) = 0.125N₂",
          "Answer: Yes, Species 2 can invade since growth rate is positive"
        ]
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

export default function LearningResources() {
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
        <TabsList className="grid w-full grid-cols-4">
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
                          <Button variant="outline" size="sm" className="w-full">
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