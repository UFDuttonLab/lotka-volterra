import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, BookOpen, Microscope } from "lucide-react";

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  figure: string;
  category: "theory" | "application" | "collaboration" | "modern";
  details: string[];
}

const timelineEvents: TimelineEvent[] = [
  {
    year: 1925,
    title: "Alfred Lotka's Foundational Work",
    description: "Published 'Elements of Physical Biology' introducing mathematical models for population dynamics",
    figure: "Alfred J. Lotka",
    category: "theory",
    details: [
      "Developed the first systematic approach to mathematical biology",
      "Introduced the concept of population oscillations",
      "Applied thermodynamic principles to biological systems",
      "Laid groundwork for predator-prey dynamics"
    ]
  },
  {
    year: 1926,
    title: "Volterra's Independent Discovery",
    description: "Vito Volterra independently derived similar equations while studying fish populations in the Adriatic Sea",
    figure: "Vito Volterra",
    category: "application",
    details: [
      "Motivated by real fisheries data from WWI period",
      "Noticed predator fish populations increased during wartime fishing restrictions",
      "Developed mathematical framework to explain the phenomenon",
      "Connected mathematics directly to ecological observations"
    ]
  },
  {
    year: 1928,
    title: "The Lotka-Volterra Collaboration",
    description: "Recognition of parallel work led to joint naming and further development of competition equations",
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
    figure: "Georgii F. Gause",
    category: "application",
    details: [
      "Used Paramecium species in controlled laboratory conditions",
      "Demonstrated competitive exclusion in practice",
      "Showed coexistence required niche differentiation",
      "Coined the term 'competitive exclusion principle'"
    ]
  },
  {
    year: 1950,
    title: "MacArthur's Resource Competition Theory",
    description: "Robert MacArthur extended competition models to include resource partitioning",
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
    figure: "Conservation Biologists",
    category: "modern",
    details: [
      "Used to model species reintroduction programs",
      "Applied to invasive species management",
      "Integrated with habitat fragmentation models",
      "Became standard tool in conservation planning"
    ]
  },
  {
    year: 2000,
    title: "Computational Ecology Era",
    description: "Integration with modern computational methods and big data approaches",
    figure: "Modern Ecologists",
    category: "modern",
    details: [
      "Enhanced with agent-based modeling approaches",
      "Integrated with climate change predictions",
      "Applied to ecosystem-scale dynamics",
      "Used in biodiversity conservation strategies"
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