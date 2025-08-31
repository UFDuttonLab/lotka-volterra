import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Reference {
  id: string;
  authors: string;
  year: number;
  title: string;
  journal?: string;
  publisher?: string;
  pages?: string;
  doi?: string;
  url?: string;
  category: "foundational" | "experimental" | "modern" | "review";
}

const references: Reference[] = [
  {
    id: "lotka1925",
    authors: "Lotka, A.J.",
    year: 1925,
    title: "Elements of Physical Biology",
    publisher: "Baltimore: Williams & Wilkins Company",
    pages: "460 pages",
    url: "https://archive.org/details/elementsofphysic017171mbp",
    category: "foundational"
  },
  {
    id: "volterra1926a",
    authors: "Volterra, V.",
    year: 1926,
    title: "Fluctuations in the abundance of a species considered mathematically",
    journal: "Nature",
    pages: "118, 558-560",
    category: "foundational"
  },
  {
    id: "volterra1926b",
    authors: "Volterra, V.",
    year: 1926,
    title: "Variazioni e fluttuazioni del numero d'individui in specie animali conviventi",
    journal: "Memorie della R. Accademia Nazionale dei Lincei",
    pages: "2, 31-113",
    category: "foundational"
  },
  {
    id: "gause1934",
    authors: "Gause, G.F.",
    year: 1934,
    title: "The Struggle for Existence",
    publisher: "Baltimore: Williams & Wilkins",
    category: "experimental"
  },
  {
    id: "elton1942",
    authors: "Elton, C. & Nicholson, M.",
    year: 1942,
    title: "The ten-year cycle in numbers of the lynx in Canada",
    journal: "Journal of Animal Ecology",
    pages: "11(2), 215-244",
    category: "experimental"
  },
  {
    id: "macarthur1967",
    authors: "MacArthur, R.H. & Wilson, E.O.",
    year: 1967,
    title: "The Theory of Island Biogeography",
    publisher: "Princeton University Press",
    category: "modern"
  },
  {
    id: "berryman1992",
    authors: "Berryman, A.A.",
    year: 1992,
    title: "The origins and evolution of predator-prey theory",
    journal: "Ecology",
    pages: "73(5), 1530-1535",
    category: "review"
  },
  {
    id: "turchin2003",
    authors: "Turchin, P.",
    year: 2003,
    title: "Complex Population Dynamics: A Theoretical/Empirical Synthesis",
    publisher: "Princeton University Press",
    category: "modern"
  }
];

const categoryStyles = {
  foundational: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
  experimental: { bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/20" },
  modern: { bg: "bg-accent/10", text: "text-accent-foreground", border: "border-accent/20" },
  review: { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" }
};

export default function Bibliography() {
  const formatReference = (ref: Reference): string => {
    let formatted = `${ref.authors} (${ref.year}). "${ref.title}."`;
    
    if (ref.journal) {
      formatted += ` ${ref.journal}`;
      if (ref.pages) {
        formatted += `, ${ref.pages}`;
      }
    } else if (ref.publisher) {
      formatted += ` ${ref.publisher}`;
      if (ref.pages) {
        formatted += `, ${ref.pages}`;
      }
    }
    
    formatted += ".";
    return formatted;
  };

  const groupedReferences = references.reduce((acc, ref) => {
    if (!acc[ref.category]) {
      acc[ref.category] = [];
    }
    acc[ref.category].push(ref);
    return acc;
  }, {} as Record<string, Reference[]>);

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Complete Bibliography
          </CardTitle>
          <p className="text-muted-foreground">
            Primary sources and key references for Lotka-Volterra models and population ecology.
            Click external links to access original sources where available.
          </p>
        </CardHeader>
      </Card>

      {Object.entries(groupedReferences).map(([category, refs]) => (
        <Card key={category} className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg capitalize flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${categoryStyles[category as keyof typeof categoryStyles].bg}`}></div>
              {category} Literature
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {refs.map((ref) => (
              <div key={ref.id} className={`p-4 rounded-lg border ${categoryStyles[ref.category].border} ${categoryStyles[ref.category].bg}`}>
                <div className="space-y-2">
                  <p className="text-sm font-mono leading-relaxed">
                    {formatReference(ref)}
                  </p>
                  
                  {(ref.doi || ref.url) && (
                    <div className="flex gap-2">
                      {ref.doi && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => window.open(`https://doi.org/${ref.doi}`, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          DOI
                        </Button>
                      )}
                      {ref.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => window.open(ref.url, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Access Source
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Card className="shadow-card bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">Citation Guidelines</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              When citing Lotka-Volterra models in academic work, always reference both Lotka (1925) and Volterra (1926) 
              for the foundational equations. Include specific experimental validations like Gause (1934) for competition 
              or Elton & Nicholson (1942) for predator-prey cycles to support your applications.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}