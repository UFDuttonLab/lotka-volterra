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
        <div className="relative w-full aspect-square bg-muted/20 rounded-lg border p-4">
          <svg width="100%" height="100%" viewBox="0 0 200 200" className="overflow-visible">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#grid)" />
            
            {/* Axes */}
            <line x1="0" y1="180" x2="180" y2="180" stroke="hsl(var(--foreground))" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="20" y1="200" x2="20" y2="20" stroke="hsl(var(--foreground))" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            
            {/* Arrow markers */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--foreground))" />
              </marker>
            </defs>
            
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
                <text x="80" y="50" fontSize="11" fill="hsl(var(--accent))" className="font-medium">
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
                <text x="140" y="35" fontSize="11" fill="hsl(var(--secondary))" className="font-medium">
                  N₂-nullcline
                </text>
                
                {/* Intersection point */}
                <circle cx="100" cy="100" r="4" fill="hsl(var(--destructive))" stroke="hsl(var(--background))" strokeWidth="2"/>
                <text x="105" y="95" fontSize="10" fill="hsl(var(--foreground))" className="font-medium">
                  Equilibrium
                </text>
                
                {/* Flow arrows showing competitive outcomes */}
                {/* Region 1: Both species decline */}
                <g transform="translate(50,60)" className="opacity-70">
                  <ArrowDownRight size={16} className="text-muted-foreground" />
                </g>
                
                {/* Region 2: Species 1 wins */}
                <g transform="translate(130,60)" className="opacity-70">
                  <ArrowRight size={16} className="text-primary" />
                </g>
                
                {/* Region 3: Species 2 wins */}
                <g transform="translate(50,140)" className="opacity-70">
                  <ArrowUp size={16} className="text-secondary" />
                </g>
                
                {/* Region 4: Convergence to equilibrium */}
                <g transform="translate(130,140)" className="opacity-70">
                  <ArrowUpRight size={16} className="text-accent" />
                </g>
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
                <text x="100" y="90" fontSize="11" fill="hsl(var(--accent))" className="font-medium" textAnchor="middle">
                  Prey nullcline (N₂ = r₁/a)
                </text>
                
                {/* Predator nullcline: vertical line */}
                <line 
                  x1="100" y1="20" 
                  x2="100" y2="180" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth="3" 
                  strokeDasharray="8,4"
                />
                <text x="110" y="50" fontSize="11" fill="hsl(var(--secondary))" className="font-medium" transform="rotate(90, 110, 50)">
                  Predator nullcline
                </text>
                <text x="110" y="30" fontSize="11" fill="hsl(var(--secondary))" className="font-medium">
                  (N₁ = r₂/b)
                </text>
                
                {/* Intersection point */}
                <circle cx="100" cy="100" r="4" fill="hsl(var(--destructive))" stroke="hsl(var(--background))" strokeWidth="2"/>
                
                {/* Circular flow arrows showing oscillatory dynamics */}
                {/* Quadrant 1: Prey ↑, Predator ↑ */}
                <path 
                  d="M 130 70 Q 140 60 150 70" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="2" 
                  markerEnd="url(#arrowhead-small)"
                />
                
                {/* Quadrant 2: Prey ↓, Predator ↑ */}
                <path 
                  d="M 70 70 Q 60 60 70 50" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="2" 
                  markerEnd="url(#arrowhead-small)"
                />
                
                {/* Quadrant 3: Prey ↓, Predator ↓ */}
                <path 
                  d="M 70 130 Q 60 140 50 130" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="2" 
                  markerEnd="url(#arrowhead-small)"
                />
                
                {/* Quadrant 4: Prey ↑, Predator ↓ */}
                <path 
                  d="M 130 130 Q 140 140 130 150" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="2" 
                  markerEnd="url(#arrowhead-small)"
                />
                
                {/* Small arrow marker for flow */}
                <defs>
                  <marker id="arrowhead-small" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                    <polygon points="0 0, 6 2.5, 0 5" fill="hsl(var(--primary))" />
                  </marker>
                </defs>
                
                {/* Flow direction labels */}
                <text x="140" y="45" fontSize="9" fill="hsl(var(--muted-foreground))" className="font-medium">
                  Both ↑
                </text>
                <text x="45" y="45" fontSize="9" fill="hsl(var(--muted-foreground))" className="font-medium">
                  Prey ↓, Pred ↑
                </text>
                <text x="35" y="165" fontSize="9" fill="hsl(var(--muted-foreground))" className="font-medium">
                  Both ↓
                </text>
                <text x="140" y="165" fontSize="9" fill="hsl(var(--muted-foreground))" className="font-medium">
                  Prey ↑, Pred ↓
                </text>
              </>
            )}
            
            {/* Axis labels */}
            <text x="190" y="185" fontSize="12" fill="hsl(var(--foreground))" className="font-medium">
              N₁ {type === 'predator-prey' ? '(Prey)' : '(Species 1)'}
            </text>
            <text x="25" y="15" fontSize="12" fill="hsl(var(--foreground))" className="font-medium">
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