import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, BookOpen, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Citation {
  authors: string;
  year: number;
  title: string;
  journal?: string;
  publisher?: string;
  pages?: string;
  doi?: string;
  url?: string;
  note?: string;
}

interface CitationBoxProps {
  citations: Citation[];
  title: string;
  description?: string;
  variant?: "primary" | "secondary" | "accent";
}

export default function CitationBox({ citations, title, description, variant = "primary" }: CitationBoxProps) {
  const [isOpen, setIsOpen] = useState(false);

  const variantStyles = {
    primary: "border-primary/20 bg-primary/5",
    secondary: "border-secondary/20 bg-secondary/5", 
    accent: "border-accent/20 bg-accent/5"
  };

  const badgeStyles = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    accent: "bg-accent/10 text-accent-foreground border-accent/20"
  };

  const formatCitation = (citation: Citation): string => {
    let formatted = `${citation.authors} (${citation.year}). "${citation.title}."`;
    
    if (citation.journal) {
      formatted += ` ${citation.journal}`;
      if (citation.pages) {
        formatted += `, ${citation.pages}`;
      }
    } else if (citation.publisher) {
      formatted += ` ${citation.publisher}`;
      if (citation.pages) {
        formatted += `, ${citation.pages} pages`;
      }
    }
    
    formatted += ".";
    
    if (citation.note) {
      formatted += ` ${citation.note}`;
    }
    
    return formatted;
  };

  return (
    <Card className={`shadow-card ${variantStyles[variant]}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="p-4 cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold text-sm">{title}</h4>
                  {description && (
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${badgeStyles[variant]}`}>
                  {citations.length} {citations.length === 1 ? 'Citation' : 'Citations'}
                </Badge>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {citations.map((citation, index) => (
              <div key={index} className="bg-card/60 p-3 rounded border space-y-2">
                <p className="text-sm leading-relaxed font-mono">
                  {formatCitation(citation)}
                </p>
                
                {(citation.doi || citation.url) && (
                  <div className="flex gap-2">
                    {citation.doi && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => window.open(`https://doi.org/${citation.doi}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        DOI
                      </Button>
                    )}
                    {citation.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => window.open(citation.url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Source
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            <div className="text-xs text-muted-foreground pt-2 border-t">
              <p>Citations formatted in scientific style. Click external links to access sources.</p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}