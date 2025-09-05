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
              <marker id="arrowhead" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
                <polygon points="0 0, 10 4, 0 8" fill="#374151" />
              </marker>
              <marker id="arrow-red" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
              </marker>
              <marker id="arrow-green" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
              </marker>
              <marker id="arrow-blue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
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
                
                <text x="195" y="72" fontSize="5" fill="#6b7280">Flow:</text>
                <line x1="193" y1="77" x2="203" y2="77" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)"/>
                <text x="205" y="80" fontSize="5" fill="#ef4444">Exclusion</text>
                <line x1="193" y1="84" x2="203" y2="84" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrow-green)"/>
                <text x="205" y="87" fontSize="5" fill="#22c55e">Coexistence</text>
                
                {/* Competition flow arrows with labels */}
                {/* Upper left region - Species 1 wins */}
                <rect x="35" y="35" width="40" height="25" fill="rgba(239, 68, 68, 0.1)" rx="3"/>
                <path d="M 45 50 L 60 65" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)"/>
                <text x="55" y="45" fontSize="6" fill="#ef4444" className="font-semibold" textAnchor="middle">
                  Species 1 wins
                </text>
                
                {/* Upper right region - Species 2 wins */}
                <rect x="125" y="35" width="40" height="25" fill="rgba(239, 68, 68, 0.1)" rx="3"/>
                <path d="M 155 50 L 140 65" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)"/>
                <text x="145" y="45" fontSize="6" fill="#ef4444" className="font-semibold" textAnchor="middle">
                  Species 2 wins
                </text>
                
                {/* Lower left region - Species 1 wins */}
                <rect x="35" y="135" width="40" height="25" fill="rgba(239, 68, 68, 0.1)" rx="3"/>
                <path d="M 45 150 L 60 135" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)"/>
                <text x="55" y="155" fontSize="6" fill="#ef4444" className="font-semibold" textAnchor="middle">
                  Species 1 wins
                </text>
                
                {/* Lower right region - Coexistence */}
                <rect x="125" y="135" width="40" height="25" fill="rgba(34, 197, 94, 0.1)" rx="3"/>
                <path d="M 145 150 L 130 135" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrow-green)"/>
                <text x="145" y="155" fontSize="6" fill="#22c55e" className="font-semibold" textAnchor="middle">
                  Coexistence
                </text>
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
                
                <text x="195" y="72" fontSize="5" fill="#6b7280">Flow:</text>
                <circle cx="198" cy="78" r="2" fill="#3b82f6"/>
                <path d="M 200 78 Q 205 76 208 78" fill="none" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-blue)"/>
                <text x="210" y="81" fontSize="5" fill="#3b82f6">Cycles</text>
                
                <text x="195" y="90" fontSize="5" fill="hsl(var(--muted-foreground))">Regions:</text>
                <text x="195" y="98" fontSize="4" fill="hsl(var(--muted-foreground))">Both ↑</text>
                <text x="195" y="105" fontSize="4" fill="hsl(var(--muted-foreground))">Both ↓</text>
                
                {/* Predator-prey flow arrows - simplified orbital flow */}
                {/* Subtle background regions */}
                <rect x="105" y="25" width="70" height="70" fill="rgba(59, 130, 246, 0.05)" rx="3"/>
                <rect x="25" y="25" width="70" height="70" fill="rgba(59, 130, 246, 0.05)" rx="3"/>
                <rect x="25" y="105" width="70" height="70" fill="rgba(59, 130, 246, 0.05)" rx="3"/>
                <rect x="105" y="105" width="70" height="70" fill="rgba(59, 130, 246, 0.05)" rx="3"/>
                
                {/* Regional labels in corners */}
                <text x="140" y="35" fontSize="7" fill="#3b82f6" className="font-semibold" textAnchor="middle">
                  ↑↑
                </text>
                <text x="60" y="35" fontSize="7" fill="#3b82f6" className="font-semibold" textAnchor="middle">
                  ↓↑
                </text>
                <text x="60" y="170" fontSize="7" fill="#3b82f6" className="font-semibold" textAnchor="middle">
                  ↓↓
                </text>
                <text x="140" y="170" fontSize="7" fill="#3b82f6" className="font-semibold" textAnchor="middle">
                  ↑↓
                </text>
                
                {/* Improved orbital flow indicators - better positioned and sized */}
                <path d="M 125 75 Q 135 65 145 75" fill="none" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#arrow-blue)"/>
                <path d="M 75 75 Q 65 65 55 75" fill="none" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#arrow-blue)"/>
                <path d="M 75 125 Q 65 135 55 125" fill="none" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#arrow-blue)"/>
                <path d="M 125 125 Q 135 135 145 125" fill="none" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#arrow-blue)"/>
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