import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { BookOpen, Globe, Users, Beaker, TreePine, Fish, Bird, Zap, Waves, FileText } from "lucide-react";

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
  citations?: string[];
  recommendedReading?: string[];
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
        ],
        citations: [
          "Grant, P.R. & Grant, B.R. (2006). Evolution of character displacement in Darwin's finches. Science, 313(5784), 224-226.",
          "Schluter, D. (2000). Ecological character displacement in adaptive radiation. American Naturalist, 156(4), S4-S16.",
          "Boag, P.T. & Grant, P.R. (1981). Intense natural selection in a population of Darwin's finches in the Galápagos. Science, 214(4516), 82-85.",
          "Abzhanov, A. et al. (2004). Bmp4 and morphological variation of beaks in Darwin's finches. Science, 305(5689), 1462-1465."
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
        ],
        citations: [
          "Pacala, S.W. et al. (1996). Forest models defined by field measurements: Estimation, error analysis and dynamics. Ecological Monographs, 66(1), 1-43.",
          "Kobe, R.K. & Coates, K.D. (1997). Models of sapling mortality as a function of growth to characterize interspecific variation in shade tolerance. Ecological Applications, 7(1), 171-186.",
          "Canham, C.D. (1988). Growth and canopy architecture of shade-tolerant trees: response to canopy gaps. Ecology, 69(3), 786-795.",
          "Oliver, C.D. & Larson, B.C. (1996). Forest Stand Dynamics. John Wiley & Sons, New York."
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
        ],
        citations: [
          "MacLulich, D.A. (1937). Fluctuations in the numbers of the varying hare (Lepus americanus). University of Toronto Studies, Biological Series No. 43.",
          "Krebs, C.J. et al. (2001). What drives the 10-year cycle of snowshoe hares? BioScience, 51(1), 25-35.",
          "Murray, D.L. (2002). Differential body condition and vulnerability to predation in snowshoe hares. Journal of Animal Ecology, 71(4), 614-625.",
          "Gilg, O. et al. (2003). Cyclic dynamics in a simple vertebrate predator-prey community. Science, 302(5646), 866-868."
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
        ],
        citations: [
          "Gause, G.F. (1934). The Struggle for Existence. Williams & Wilkins, Baltimore.",
          "Gause, G.F. (1935). Experimental demonstration of Volterra's periodic oscillations in the numbers of animals. Journal of Experimental Biology, 12(1), 44-48.",
          "Hardin, G. (1960). The competitive exclusion principle. Science, 131(3409), 1292-1297.",
          "Vandermeer, J.H. (1969). The competitive structure of communities: An experimental approach with protozoa. Ecology, 50(3), 362-371."
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
        ],
        citations: [
          "Blossey, B. et al. (2001). Purple loosestrife (Lythrum salicaria) expansion and basis for biological control in North America. Weed Technology, 15(2), 254-267.",
          "Keddy, P.A. (2000). Wetland Ecology: Principles and Conservation. Cambridge University Press.",
          "Davis, M.A. (2009). Invasion Biology. Oxford University Press, New York.",
          "Malecki, R.A. et al. (1993). Biological control of purple loosestrife. BioScience, 43(10), 680-686."
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
        ],
        recommendedReading: [
          "Cantrell, R.S. & Cosner, C. (2003). Spatial Ecology via Reaction-Diffusion Equations. John Wiley & Sons.",
          "Tilman, D. (1982). Resource Competition and Community Structure. Princeton University Press.",
          "Holyoak, M. et al. (2005). Metacommunities: Spatial Dynamics and Ecological Communities. University of Chicago Press.",
          "Okubo, A. & Levin, S.A. (2001). Diffusion and Ecological Problems: Modern Perspectives. Springer-Verlag."
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
        ],
        recommendedReading: [
          "Hofbauer, J. & Sigmund, K. (1998). Evolutionary Games and Population Dynamics. Cambridge University Press.",
          "Vincent, T.L. & Brown, J.S. (2005). Evolutionary Game Theory, Natural Selection, and Darwinian Dynamics. Cambridge University Press.",
          "Dieckmann, U. & Law, R. (1996). The dynamical theory of coevolution: a derivation from stochastic ecological processes. Journal of Mathematical Biology, 34(5-6), 579-612.",
          "Geritz, S.A. et al. (1998). Evolutionarily singular strategies and the adaptive growth and branching of the evolutionary tree. Evolutionary Ecology, 12(1), 35-57."
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

                      {resource.citations && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            Citations
                          </h4>
                          <ul className="space-y-1">
                            {resource.citations.map((citation, citationIdx) => (
                              <li key={citationIdx} className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-primary/20">
                                {citation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {resource.recommendedReading && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            Recommended Reading
                          </h4>
                          <ul className="space-y-1">
                            {resource.recommendedReading.map((book, bookIdx) => (
                              <li key={bookIdx} className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-secondary/40">
                                {book}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
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