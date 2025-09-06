import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, BookOpen, Microscope } from "lucide-react";

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  detailedContext?: string;
  figure: string;
  category: "theory" | "application" | "collaboration" | "modern";
  details: string[];
}

const timelineEvents: TimelineEvent[] = [
    {
      year: 1925,
      title: "Alfred Lotka's Foundational Work",
      description: "Published 'Elements of Physical Biology' introducing mathematical models for population dynamics",
      detailedContext: "In the 1920s, biology was largely descriptive - scientists observed and categorized life, but rarely used mathematics to predict biological phenomena. Lotka, a chemist turned mathematician, had a revolutionary idea: what if we could use equations (like those in physics) to understand how populations of animals and plants change over time? His work was groundbreaking because it showed that the natural world follows mathematical patterns. Think of it like discovering that the chaos of a forest or ocean actually follows hidden rules that we can write down and use to make predictions.",
      figure: "Alfred J. Lotka",
      category: "theory",
      details: [
        "Developed the first systematic approach to mathematical biology",
        "Introduced the concept of population oscillations", 
        "Applied thermodynamic principles to biological systems",
        "Laid groundwork for predator-prey dynamics",
        "Citation: Lotka, A.J. (1925). Elements of Physical Biology. Baltimore: Williams & Wilkins Company. 460 pages.",
        "Archive: https://archive.org/details/elementsofphysic017171mbp"
      ]
    },
    {
      year: 1926,
      title: "Volterra's Independent Discovery",
      description: "Vito Volterra independently derived similar equations while studying fish populations in the Adriatic Sea",
      detailedContext: "During World War I, fishing in the Adriatic Sea was heavily restricted due to naval warfare. When the war ended and fishing resumed, something unexpected happened: there were more predatory fish (like sharks) than usual, and fewer of the smaller fish they eat. A fisherman's son, who happened to be dating Volterra's daughter, brought this puzzle to the famous mathematician. Volterra realized he could use mathematics to explain why this happened - fewer fishermen meant more small fish survived, which then supported larger populations of predators. This was a 'eureka moment' showing how math could explain real-world ecological mysteries.",
      figure: "Vito Volterra",
      category: "application",
      details: [
        "Motivated by real fisheries data from WWI period",
        "Noticed predator fish populations increased during wartime fishing restrictions",
        "Developed mathematical framework to explain the phenomenon",
        "Connected mathematics directly to ecological observations",
        "Citation: Volterra, V. (1926). 'Fluctuations in the abundance of a species considered mathematically.' Nature, 118, 558-560.",
        "Original Italian: Volterra, V. (1926). 'Variazioni e fluttuazioni del numero d'individui in specie animali conviventi.' Memorie della R. Accademia Nazionale dei Lincei, 2, 31-113."
      ]
    },
  {
    year: 1928,
    title: "The Lotka-Volterra Collaboration",
    description: "Recognition of parallel work led to joint naming and further development of competition equations",
    detailedContext: "In an era before instant global communication, it was remarkable when two scientists on different continents independently discovered the same mathematical truth. When Lotka and Volterra learned about each other's work, they did something wonderful for science: instead of fighting over who was first, they celebrated their shared discovery. This collaboration was significant because it showed that their mathematical approach was robust - if two people could independently arrive at the same equations, those equations probably captured something fundamental about nature. Their joint work extended beyond predator-prey relationships to explore how species compete for the same resources.",
    figure: "Lotka & Volterra",
    category: "collaboration",
    details: [
      "Both scientists acknowledged each other's contributions",
      "Extended basic predator-prey model to interspecific competition",
      "Developed mathematical framework for competitive exclusion",
      "Established foundation for modern population ecology"
    ]
  },
    {
      year: 1934,
      title: "G.F. Gause's Experimental Validation",
      description: "First experimental tests of competitive exclusion principle using laboratory populations",
      detailedContext: "Having mathematical equations is one thing, but proving they work in real life is another. Russian biologist Georgii Gause decided to test Lotka-Volterra predictions by creating miniature ecosystems in laboratory flasks. He used microscopic creatures called Paramecium - think of them as tiny, single-celled animals that you can only see under a microscope. By carefully controlling their environment and food supply, Gause could watch what happened when two similar species competed for the same resources. His experiments were revolutionary because they proved that mathematical predictions could actually match biological reality. The term 'competitive exclusion' means that two very similar species usually can't coexist in the same place - one will always outcompete the other unless they find ways to use different resources.",
      figure: "Georgii F. Gause",
      category: "application",
      details: [
        "Used Paramecium species in controlled laboratory conditions",
        "Demonstrated competitive exclusion in practice",
        "Showed coexistence required niche differentiation",
        "Coined the term 'competitive exclusion principle'",
        "Citation: Gause, G.F. (1934). The Struggle for Existence. Baltimore: Williams & Wilkins.",
        "Key experiment: Laboratory competition between Paramecium aurelia and P. caudatum"
      ]
    },
  {
    year: 1950,
    title: "MacArthur's Resource Competition Theory",
    description: "Robert MacArthur extended competition models to include resource partitioning",
    detailedContext: "Robert MacArthur wondered why the natural world was so diverse - if competitive exclusion was true, why didn't one 'best' species take over everything? His breakthrough insight was about resource partitioning, which is essentially nature's way of sharing. Imagine a forest where different bird species all eat insects, but some specialize in insects on tree bark, others prefer insects in leaves, and still others hunt flying insects. By dividing up resources this way, multiple species can coexist in the same habitat. MacArthur's mathematical framework showed exactly how this worked and predicted how many species could coexist based on how finely they could divide up available resources. This was a major breakthrough that explained the incredible diversity we see in nature.",
    figure: "Robert MacArthur",
    category: "theory",
    details: [
      "Connected competition to resource utilization",
      "Developed mathematical framework for niche theory",
      "Showed how species can coexist through resource partitioning",
      "Influenced modern community ecology theory"
    ]
  },
    {
      year: 1970,
      title: "Modern Applications in Conservation",
      description: "Application to endangered species management and habitat conservation",
      detailedContext: "By the 1970s, the world was waking up to an environmental crisis - species were going extinct at alarming rates, and natural habitats were disappearing. Conservation biologists realized they needed more than good intentions; they needed mathematical tools to make smart decisions about how to save species. Lotka-Volterra models became practical tools for real-world problems: Should we reintroduce wolves to Yellowstone? How much habitat does a tiger population need to survive? What happens if we remove an invasive species? These equations, born from abstract mathematical thinking, suddenly became essential for wildlife management. Conservation biologists could now predict outcomes and avoid costly mistakes in species recovery programs.",
      figure: "Conservation Biologists",
      category: "modern",
      details: [
        "Used to model species reintroduction programs",
        "Applied to invasive species management",
        "Integrated with habitat fragmentation models",
        "Became standard tool in conservation planning",
        "Key citations: MacArthur, R.H. & Wilson, E.O. (1967). The Theory of Island Biogeography. Princeton University Press.",
        "Lynx-hare data: Elton, C. & Nicholson, M. (1942). 'The ten-year cycle in numbers of the lynx in Canada.' Journal of Animal Ecology, 11(2), 215-244."
      ]
    },
    {
      year: 2000,
      title: "Computational Ecology Era",
      description: "Integration with modern computational methods and big data approaches",
      detailedContext: "The digital revolution transformed ecology just like every other field. With powerful computers and vast databases, scientists could now track millions of animals using GPS collars, satellite imagery, and genetic analysis. Instead of simple two-species models, researchers could simulate entire ecosystems with hundreds of interacting species. Climate change added new urgency - scientists needed to predict how global warming would affect biodiversity. Modern Lotka-Volterra models became part of massive computer simulations that help us understand everything from coral reef collapse to forest responses to changing rainfall patterns. What started as elegant mathematical equations now helps us tackle some of the biggest environmental challenges facing our planet.",
      figure: "Modern Ecologists",
      category: "modern",
      details: [
        "Enhanced with agent-based modeling approaches",
        "Integrated with climate change predictions",
        "Applied to ecosystem-scale dynamics",
        "Used in biodiversity conservation strategies",
        "Modern reviews: Berryman, A.A. (1992). 'The origins and evolution of predator-prey theory.' Ecology, 73(5), 1530-1535.",
        "Current applications: Turchin, P. (2003). Complex Population Dynamics: A Theoretical/Empirical Synthesis. Princeton University Press."
      ]
    }
];

const categoryColors = {
  theory: "bg-primary/10 text-primary border-primary/20",
  application: "bg-secondary/10 text-secondary border-secondary/20",
  collaboration: "bg-accent/10 text-accent-foreground border-accent/20",
  modern: "bg-muted text-muted-foreground border-border"
};

const categoryIcons = {
  theory: BookOpen,
  application: Microscope,
  collaboration: User,
  modern: Calendar
};

export default function HistoricalTimeline() {
  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Historical Development of Lotka-Volterra Models
          </CardTitle>
          <p className="text-muted-foreground">
            Explore the fascinating history of mathematical ecology and the key figures who shaped our understanding of species competition.
          </p>
        </CardHeader>
      </Card>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block"></div>
        
        <div className="space-y-8">
          {timelineEvents.map((event, index) => {
            const Icon = categoryIcons[event.category];
            return (
              <div key={event.year} className="relative">
                {/* Timeline dot */}
                <div className="absolute left-6 w-4 h-4 bg-primary rounded-full border-2 border-background shadow-md hidden md:block"></div>
                
                <Card className={`ml-0 md:ml-16 shadow-card hover:shadow-lg transition-all duration-300 ${
                  index % 2 === 0 ? 'animate-fade-in' : 'animate-fade-in'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <Badge variant="outline" className="w-fit text-lg font-mono font-bold">
                        {event.year}
                      </Badge>
                      <Badge className={`w-fit ${categoryColors[event.category]}`}>
                        <Icon className="h-3 w-3 mr-1" />
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <p className="text-sm text-muted-foreground italic">
                      Key Figure: {event.figure}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed">{event.description}</p>
                    {event.detailedContext && (
                      <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-primary/30">
                        <p className="text-sm leading-relaxed text-foreground/90">
                          {event.detailedContext}
                        </p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Key Contributions:
                      </h4>
                      <ul className="space-y-1">
                        {event.details.map((detail, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      <Card className="shadow-card bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">Legacy and Impact</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              The Lotka-Volterra equations remain fundamental to modern ecology, evolution, and conservation biology. 
              Their mathematical elegance and biological relevance continue to inspire new research in population dynamics, 
              community ecology, and ecosystem management.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}