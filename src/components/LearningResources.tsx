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
  // No props needed anymore - exercises moved to separate tab
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

export default function LearningResources({}: LearningResourcesProps) {
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
        <TabsList className="grid w-full grid-cols-3">
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
                      
                      <div className="text-xs text-muted-foreground">
                        {resource.type === "study" ? "Case Study" : 
                         resource.type === "example" ? "Real-World Example" : "Recommended Reading"}
                      </div>
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