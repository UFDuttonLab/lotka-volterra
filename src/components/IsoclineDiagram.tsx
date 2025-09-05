import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface IsoclineDiagramProps {
  type: "competition" | "predator-prey";
  className?: string;
}

export default function IsoclineDiagram({ type, className }: IsoclineDiagramProps) {
  return (
    <Card className={`shadow-card ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            {type === 'competition' ? 'Competition Isoclines' : 'Predator-Prey Isoclines'}
          </CardTitle>
          <Badge variant={type === 'competition' ? 'secondary' : 'default'} className="text-xs">
            {type === 'competition' ? 'Diagonal Lines' : 'Perpendicular Lines'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-square bg-muted/20 rounded-lg border p-3">
          <svg width="100%" height="100%" viewBox="0 0 240 220" className="overflow-visible">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5"/>
              </pattern>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--foreground))" />
              </marker>
              <marker id="arrowhead-small" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0 0, 6 2.5, 0 5" fill="hsl(var(--primary))" />
              </marker>
            </defs>
            <rect width="240" height="220" fill="url(#grid)" />
            
            {/* Axes */}
            <line x1="0" y1="180" x2="180" y2="180" stroke="hsl(var(--foreground))" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="20" y1="200" x2="20" y2="20" stroke="hsl(var(--foreground))" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            
            {/* Legend Box */}
            <rect x="190" y="30" width="45" height={type === 'competition' ? '60' : '80'} fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" rx="4"/>
            <text x="195" y="42" fontSize="7" fill="hsl(var(--foreground))" className="font-semibold">Legend</text>
            
            {type === 'competition' ? (
              <>
                {/* Competition isoclines - diagonal lines */}
                {/* N₁-nullcline: negative slope */}
                <line 
                  x1="20" y1="60" 
                  x2="140" y2="180" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth="3" 
                  strokeDasharray="8,4"
                />
                <text x="70" y="55" fontSize="7" fill="hsl(var(--accent))" className="font-medium">
                  N₁-nullcline
                </text>
                
                {/* N₂-nullcline: negative slope */}
                <line 
                  x1="60" y1="20" 
                  x2="180" y2="140" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth="3" 
                  strokeDasharray="8,4"
                />
                <text x="130" y="35" fontSize="7" fill="hsl(var(--secondary))" className="font-medium">
                  N₂-nullcline
                </text>
                
                {/* Intersection point */}
                <circle cx="100" cy="100" r="3" fill="hsl(var(--destructive))" stroke="hsl(var(--background))" strokeWidth="1"/>
                <text x="105" y="96" fontSize="6" fill="hsl(var(--foreground))" className="font-medium">
                  Equilibrium
                </text>
                
                {/* Legend items for competition */}
                <line x1="193" y1="48" x2="205" y2="48" stroke="hsl(var(--accent))" strokeWidth="2" strokeDasharray="4,2"/>
                <text x="208" y="51" fontSize="5" fill="hsl(var(--accent))">Nullclines</text>
                
                <circle cx="198" cy="58" r="2" fill="hsl(var(--destructive))"/>
                <text x="203" y="61" fontSize="5" fill="hsl(var(--foreground))">Equilibrium</text>
                
                <text x="195" y="72" fontSize="5" fill="hsl(var(--muted-foreground))">Flow:</text>
                <text x="195" y="80" fontSize="5" fill="hsl(var(--destructive))">→ Exclusion</text>
                <text x="195" y="87" fontSize="5" fill="hsl(var(--primary))">→ Coexistence</text>
                
                {/* Simplified flow arrows */}
                <path d="M 50 70 L 55 75" stroke="hsl(var(--destructive))" strokeWidth="2" markerEnd="url(#arrowhead-small)"/>
                <path d="M 130 70 L 135 75" stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrowhead-small)"/>
                <path d="M 50 130 L 55 125" stroke="hsl(var(--secondary))" strokeWidth="2" markerEnd="url(#arrowhead-small)"/>
                <path d="M 130 130 L 125 125" stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrowhead-small)"/>
              </>
            ) : (
              <>
                {/* Predator-prey isoclines - perpendicular lines */}
                {/* Prey nullcline: horizontal line */}
                <line 
                  x1="20" y1="100" 
                  x2="180" y2="100" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth="3" 
                  strokeDasharray="8,4"
                />
                <text x="90" y="92" fontSize="6" fill="hsl(var(--accent))" className="font-medium" textAnchor="middle">
                  Prey nullcline
                </text>
                
                {/* Predator nullcline: vertical line */}
                <line 
                  x1="100" y1="20" 
                  x2="100" y2="180" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth="3" 
                  strokeDasharray="8,4"
                />
                <text x="110" y="50" fontSize="6" fill="hsl(var(--secondary))" className="font-medium">
                  Predator nullcline
                </text>
                
                {/* Intersection point */}
                <circle cx="100" cy="100" r="3" fill="hsl(var(--destructive))" stroke="hsl(var(--background))" strokeWidth="1"/>
                <text x="105" y="96" fontSize="6" fill="hsl(var(--foreground))" className="font-medium">
                  Equilibrium
                </text>
                
                {/* Legend items for predator-prey */}
                <line x1="193" y1="48" x2="205" y2="48" stroke="hsl(var(--accent))" strokeWidth="2" strokeDasharray="4,2"/>
                <text x="208" y="51" fontSize="5" fill="hsl(var(--accent))">Nullclines</text>
                
                <circle cx="198" cy="58" r="2" fill="hsl(var(--destructive))"/>
                <text x="203" y="61" fontSize="5" fill="hsl(var(--foreground))">Equilibrium</text>
                
                <text x="195" y="72" fontSize="5" fill="hsl(var(--muted-foreground))">Flow:</text>
                <circle cx="198" cy="78" r="1" fill="hsl(var(--primary))"/>
                <path d="M 200 78 Q 202 76 204 78" fill="none" stroke="hsl(var(--primary))" strokeWidth="1"/>
                <text x="206" y="81" fontSize="5" fill="hsl(var(--primary))">Cycles</text>
                
                <text x="195" y="90" fontSize="5" fill="hsl(var(--muted-foreground))">Regions:</text>
                <text x="195" y="98" fontSize="4" fill="hsl(var(--muted-foreground))">Both ↑</text>
                <text x="195" y="105" fontSize="4" fill="hsl(var(--muted-foreground))">Both ↓</text>
                
                {/* Circular flow arrows showing oscillatory dynamics */}
                <path 
                  d="M 130 70 Q 140 60 150 70" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="2" 
                  markerEnd="url(#arrowhead-small)"
                />
                
                <path 
                  d="M 70 70 Q 60 60 70 50" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="2" 
                  markerEnd="url(#arrowhead-small)"
                />
                
                <path 
                  d="M 70 130 Q 60 140 50 130" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="2" 
                  markerEnd="url(#arrowhead-small)"
                />
                
                <path 
                  d="M 130 130 Q 140 140 130 150" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="2" 
                  markerEnd="url(#arrowhead-small)"
                />
                
                {/* Simplified flow direction labels */}
                <text x="140" y="50" fontSize="5" fill="hsl(var(--muted-foreground))" className="font-medium">
                  Both ↑
                </text>
                <text x="50" y="50" fontSize="5" fill="hsl(var(--muted-foreground))" className="font-medium">
                  Prey ↓, Pred ↑
                </text>
                <text x="40" y="160" fontSize="5" fill="hsl(var(--muted-foreground))" className="font-medium">
                  Both ↓
                </text>
                <text x="135" y="160" fontSize="5" fill="hsl(var(--muted-foreground))" className="font-medium">
                  Prey ↑, Pred ↓
                </text>
              </>
            )}
            
            {/* Axis labels */}
            <text x="190" y="185" fontSize="8" fill="hsl(var(--foreground))" className="font-medium">
              N₁ {type === 'predator-prey' ? '(Prey)' : '(Species 1)'}
            </text>
            <text x="25" y="15" fontSize="8" fill="hsl(var(--foreground))" className="font-medium">
              N₂ {type === 'predator-prey' ? '(Predator)' : '(Species 2)'}
            </text>
          </svg>
        </div>
        
        <div className="mt-4 space-y-2 text-xs">
          <h4 className="font-semibold text-foreground">Key Differences:</h4>
          {type === 'competition' ? (
            <ul className="space-y-1 text-muted-foreground">
              <li>• <span className="text-accent font-medium">Diagonal isoclines</span> create 4 distinct regions</li>
              <li>• Flow converges to <span className="text-destructive font-medium">stable equilibrium</span> or exclusion</li>
              <li>• Slopes depend on competition coefficients α₁₂, α₂₁</li>
              <li>• Intersection determines coexistence vs. competitive exclusion</li>
            </ul>
          ) : (
            <ul className="space-y-1 text-muted-foreground">
              <li>• <span className="text-accent font-medium">Perpendicular isoclines</span> create 4 flow quadrants</li>
              <li>• <span className="text-primary font-medium">Circular flow</span> creates closed orbits (cycles)</li>
              <li>• Horizontal line at predator density that stops prey growth</li>
              <li>• Vertical line at prey density that stops predator decline</li>
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}