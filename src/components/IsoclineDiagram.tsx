import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface CompetitionParameters {
  r1: number;
  r2: number;
  K1: number;
  K2: number;
  a12: number;
  a21: number;
  N1_0: number;
  N2_0: number;
}

interface PredatorPreyParameters {
  r1: number;
  r2: number;
  a: number;
  b: number;
  N1_0: number;
  N2_0: number;
}

interface IsoclineDiagramProps {
  type: "competition" | "predator-prey";
  parameters?: CompetitionParameters & PredatorPreyParameters;
  className?: string;
}

export default function IsoclineDiagram({ type, parameters, className }: IsoclineDiagramProps) {
  // Default parameters for display when none provided
  const defaultParams = {
    r1: 1.0, r2: 0.8, K1: 100, K2: 100, a12: 0.8, a21: 1.2,
    a: 0.012, b: 0.008, N1_0: 80, N2_0: 20,
  };
  
  const p = parameters || defaultParams;
  
  // Calculate mathematically accurate isocline positions
  const viewBoxWidth = 240;
  const viewBoxHeight = 220;
  const chartWidth = 160;
  const chartHeight = 160;
  const originX = 20;
  const originY = 180;
  
  // Scale parameters to fit chart dimensions
  const scaleX = chartWidth / (type === 'competition' ? Math.max(p.K1, p.K2) * 1.2 : Math.max(p.N1_0 * 3, p.r2/p.b * 2));
  const scaleY = chartHeight / (type === 'competition' ? Math.max(p.K1, p.K2) * 1.2 : Math.max(p.N2_0 * 3, p.r1/p.a * 2));
  
  // Competition model calculations
  const competitionCalcs = type === 'competition' ? {
    // N1-nullcline: N1 = K1 - a12*N2, rearranged: N2 = (K1 - N1)/a12
    n1NullclineStart: { x: originX, y: originY - (p.K1/p.a12) * scaleY },
    n1NullclineEnd: { x: originX + p.K1 * scaleX, y: originY },
    
    // N2-nullcline: N2 = K2 - a21*N1, rearranged: N2 = K2 - a21*N1
    n2NullclineStart: { x: originX, y: originY - p.K2 * scaleY },
    n2NullclineEnd: { x: originX + (p.K2/p.a21) * scaleX, y: originY },
    
    // Equilibrium point: intersection of nullclines
    equilibrium: {
      x: originX + ((p.K1 - p.a12 * p.K2) / (1 - p.a12 * p.a21)) * scaleX,
      y: originY - ((p.K2 - p.a21 * p.K1) / (1 - p.a12 * p.a21)) * scaleY
    }
  } : null;
  
  // Predator-prey model calculations  
  const predatorPreyCalcs = type === 'predator-prey' ? {
    // Prey nullcline: horizontal line at N2 = r1/a
    preyNullclineY: originY - (p.r1/p.a) * scaleY,
    
    // Predator nullcline: vertical line at N1 = r2/b
    predatorNullclineX: originX + (p.r2/p.b) * scaleX,
    
    // Equilibrium point
    equilibrium: {
      x: originX + (p.r2/p.b) * scaleX,
      y: originY - (p.r1/p.a) * scaleY
    }
  } : null;
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
              <marker id="arrow-blue" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                <polygon points="0 0, 6 2, 0 4" fill="#3b82f6" />
              </marker>
            </defs>
            <rect width="240" height="220" fill="url(#grid)" />
            
            {/* Axes */}
            <line x1="0" y1="180" x2="180" y2="180" stroke="hsl(var(--foreground))" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="20" y1="200" x2="20" y2="20" stroke="hsl(var(--foreground))" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            
            {/* Legend Box */}
            <rect x="190" y="30" width="45" height={type === 'competition' ? '60' : '80'} fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" rx="4"/>
            <text x="195" y="42" fontSize="7" fill="hsl(var(--foreground))" className="font-semibold">Legend</text>
            
            {type === 'competition' && competitionCalcs ? (
              <>
                {/* Competition isoclines - mathematically accurate */}
                {/* N₁-nullcline: N1 = K1 - a12*N2 */}
                <line 
                  x1={competitionCalcs.n1NullclineStart.x} 
                  y1={Math.max(20, Math.min(180, competitionCalcs.n1NullclineStart.y))}
                  x2={competitionCalcs.n1NullclineEnd.x} 
                  y2={competitionCalcs.n1NullclineEnd.y}
                  stroke="hsl(var(--accent))" 
                  strokeWidth="3" 
                  strokeDasharray="8,4"
                />
                <text x="70" y="55" fontSize="7" fill="hsl(var(--accent))" className="font-medium">
                  N₁ = {p.K1.toFixed(0)} - {p.a12.toFixed(1)}N₂
                </text>
                
                {/* N₂-nullcline: N2 = K2 - a21*N1 */}
                <line 
                  x1={competitionCalcs.n2NullclineStart.x}
                  y1={Math.max(20, Math.min(180, competitionCalcs.n2NullclineStart.y))}
                  x2={competitionCalcs.n2NullclineEnd.x}
                  y2={competitionCalcs.n2NullclineEnd.y}
                  stroke="hsl(var(--secondary))" 
                  strokeWidth="3" 
                  strokeDasharray="8,4"
                />
                <text x="130" y="35" fontSize="7" fill="hsl(var(--secondary))" className="font-medium">
                  N₂ = {p.K2.toFixed(0)} - {p.a21.toFixed(1)}N₁
                </text>
                
                {/* Mathematically calculated intersection point */}
                <circle 
                  cx={Math.max(20, Math.min(180, competitionCalcs.equilibrium.x))} 
                  cy={Math.max(20, Math.min(180, competitionCalcs.equilibrium.y))} 
                  r="3" 
                  fill="hsl(var(--destructive))" 
                  stroke="hsl(var(--background))" 
                  strokeWidth="1"
                />
                <text 
                  x={Math.max(25, Math.min(175, competitionCalcs.equilibrium.x + 5))} 
                  y={Math.max(25, Math.min(175, competitionCalcs.equilibrium.y - 4))} 
                  fontSize="6" 
                  fill="hsl(var(--foreground))" 
                  className="font-medium"
                >
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
                
                {/* Competition flow arrows - mathematically determined */}
                {(() => {
                  const coexistenceCondition = (1 - p.a12 * p.a21) > 0 && 
                    ((p.K1 - p.a12 * p.K2) / (1 - p.a12 * p.a21)) > 0 && 
                    ((p.K2 - p.a21 * p.K1) / (1 - p.a12 * p.a21)) > 0;
                  
                  return coexistenceCondition ? (
                    <>
                      {/* All regions flow toward coexistence equilibrium */}
                      <rect x="35" y="35" width="40" height="25" fill="rgba(34, 197, 94, 0.1)" rx="3"/>
                      <path d="M 45 50 L 60 65" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrow-green)"/>
                      <text x="55" y="45" fontSize="6" fill="#22c55e" className="font-semibold" textAnchor="middle">
                        → Coexistence
                      </text>
                      
                      <rect x="125" y="35" width="40" height="25" fill="rgba(34, 197, 94, 0.1)" rx="3"/>
                      <path d="M 155 50 L 140 65" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrow-green)"/>
                      <text x="145" y="45" fontSize="6" fill="#22c55e" className="font-semibold" textAnchor="middle">
                        → Coexistence
                      </text>
                      
                      <rect x="35" y="135" width="40" height="25" fill="rgba(34, 197, 94, 0.1)" rx="3"/>
                      <path d="M 45 150 L 60 135" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrow-green)"/>
                      <text x="55" y="155" fontSize="6" fill="#22c55e" className="font-semibold" textAnchor="middle">
                        → Coexistence
                      </text>
                      
                      <rect x="125" y="135" width="40" height="25" fill="rgba(34, 197, 94, 0.1)" rx="3"/>
                      <path d="M 145 150 L 130 135" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrow-green)"/>
                      <text x="145" y="155" fontSize="6" fill="#22c55e" className="font-semibold" textAnchor="middle">
                        → Coexistence
                      </text>
                    </>
                  ) : (
                    <>
                      {/* Competitive exclusion scenario */}
                      <rect x="35" y="35" width="40" height="25" fill="rgba(239, 68, 68, 0.1)" rx="3"/>
                      <path d="M 45 50 L 30 35" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)"/>
                      <text x="55" y="45" fontSize="6" fill="#ef4444" className="font-semibold" textAnchor="middle">
                        Species {p.a12 > p.a21 ? '2' : '1'} wins
                      </text>
                      
                      <rect x="125" y="35" width="40" height="25" fill="rgba(239, 68, 68, 0.1)" rx="3"/>
                      <path d="M 155 50 L 170 35" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)"/>
                      <text x="145" y="45" fontSize="6" fill="#ef4444" className="font-semibold" textAnchor="middle">
                        Species {p.a12 > p.a21 ? '2' : '1'} wins
                      </text>
                      
                      <rect x="35" y="135" width="40" height="25" fill="rgba(239, 68, 68, 0.1)" rx="3"/>
                      <path d="M 45 150 L 30 165" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)"/>
                      <text x="55" y="155" fontSize="6" fill="#ef4444" className="font-semibold" textAnchor="middle">
                        Species {p.a12 > p.a21 ? '2' : '1'} wins
                      </text>
                      
                      <rect x="125" y="135" width="40" height="25" fill="rgba(239, 68, 68, 0.1)" rx="3"/>
                      <path d="M 145 150 L 170 165" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)"/>
                      <text x="145" y="155" fontSize="6" fill="#ef4444" className="font-semibold" textAnchor="middle">
                        Species {p.a12 > p.a21 ? '2' : '1'} wins
                      </text>
                    </>
                  );
                })()}
              </>
            ) : predatorPreyCalcs ? (
              <>
                {/* Predator-prey isoclines - mathematically accurate */}
                {/* Prey nullcline: horizontal line at N2 = r1/a */}
                <line 
                  x1="20" 
                  y1={Math.max(20, Math.min(180, predatorPreyCalcs.preyNullclineY))}
                  x2="180" 
                  y2={Math.max(20, Math.min(180, predatorPreyCalcs.preyNullclineY))}
                  stroke="hsl(var(--accent))" 
                  strokeWidth="3" 
                  strokeDasharray="8,4"
                />
                <text 
                  x="90" 
                  y={Math.max(25, Math.min(175, predatorPreyCalcs.preyNullclineY - 8))} 
                  fontSize="6" 
                  fill="hsl(var(--accent))" 
                  className="font-medium" 
                  textAnchor="middle"
                >
                  Prey nullcline: N₂ = {(p.r1/p.a).toFixed(1)}
                </text>
                
                {/* Predator nullcline: vertical line at N1 = r2/b */}
                <line 
                  x1={Math.max(20, Math.min(180, predatorPreyCalcs.predatorNullclineX))}
                  y1="20" 
                  x2={Math.max(20, Math.min(180, predatorPreyCalcs.predatorNullclineX))}
                  y2="180" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth="3" 
                  strokeDasharray="8,4"
                />
                <text 
                  x={Math.max(25, Math.min(175, predatorPreyCalcs.predatorNullclineX + 8))} 
                  y="50" 
                  fontSize="6" 
                  fill="hsl(var(--secondary))" 
                  className="font-medium"
                  transform={`rotate(-90, ${Math.max(25, Math.min(175, predatorPreyCalcs.predatorNullclineX + 8))}, 50)`}
                >
                  Predator nullcline: N₁ = {(p.r2/p.b).toFixed(1)}
                </text>
                
                {/* Mathematically calculated intersection point */}
                <circle 
                  cx={Math.max(20, Math.min(180, predatorPreyCalcs.equilibrium.x))} 
                  cy={Math.max(20, Math.min(180, predatorPreyCalcs.equilibrium.y))} 
                  r="3" 
                  fill="hsl(var(--destructive))" 
                  stroke="hsl(var(--background))" 
                  strokeWidth="1"
                />
                <text 
                  x={Math.max(25, Math.min(175, predatorPreyCalcs.equilibrium.x + 5))} 
                  y={Math.max(25, Math.min(175, predatorPreyCalcs.equilibrium.y - 4))} 
                  fontSize="6" 
                  fill="hsl(var(--foreground))" 
                  className="font-medium"
                >
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
                
                {/* Mathematically correct regional flow labels */}
                {(() => {
                  const eqX = predatorPreyCalcs.equilibrium.x;
                  const eqY = predatorPreyCalcs.equilibrium.y;
                  
                  return (
                    <>
                      {/* Upper right quadrant: Both populations increasing */}
                      <text x={Math.min(160, eqX + 30)} y={Math.max(35, eqY - 30)} fontSize="6" fill="#3b82f6" className="font-semibold" textAnchor="middle">
                        Prey ↑, Predator ↑
                      </text>
                      {/* Upper left quadrant: Prey decreasing, Predator increasing */}
                      <text x={Math.max(40, eqX - 30)} y={Math.max(35, eqY - 30)} fontSize="6" fill="#3b82f6" className="font-semibold" textAnchor="middle">
                        Prey ↓, Predator ↑
                      </text>
                      {/* Lower left quadrant: Both populations decreasing */}
                      <text x={Math.max(40, eqX - 30)} y={Math.min(170, eqY + 30)} fontSize="6" fill="#3b82f6" className="font-semibold" textAnchor="middle">
                        Prey ↓, Predator ↓
                      </text>
                      {/* Lower right quadrant: Prey increasing, Predator decreasing */}
                      <text x={Math.min(160, eqX + 30)} y={Math.min(170, eqY + 30)} fontSize="6" fill="#3b82f6" className="font-semibold" textAnchor="middle">
                        Prey ↑, Predator ↓
                      </text>
                      
                      {/* Clockwise orbital flow indicators around equilibrium */}
                      <path d={`M ${eqX + 25} ${eqY - 25} Q ${eqX + 35} ${eqY - 35} ${eqX + 45} ${eqY - 25}`} fill="none" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrow-blue)"/>
                      <path d={`M ${eqX - 25} ${eqY - 25} Q ${eqX - 35} ${eqY - 35} ${eqX - 45} ${eqY - 25}`} fill="none" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrow-blue)"/>
                      <path d={`M ${eqX - 25} ${eqY + 25} Q ${eqX - 35} ${eqY + 35} ${eqX - 45} ${eqY + 25}`} fill="none" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrow-blue)"/>
                      <path d={`M ${eqX + 25} ${eqY + 25} Q ${eqX + 35} ${eqY + 35} ${eqX + 45} ${eqY + 25}`} fill="none" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrow-blue)"/>
                    </>
                  );
                })()}
              </>
            ) : null}
            
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