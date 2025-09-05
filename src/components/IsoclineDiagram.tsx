import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  // Default parameters that ensure meaningful diagrams
  const defaultParams = {
    r1: 1.0, r2: 0.8, K1: 100, K2: 80, a12: 0.8, a21: 0.6,
    a: 0.012, b: 0.008, N1_0: 50, N2_0: 20,
  };
  
  const p = parameters || defaultParams;
  
  // Chart dimensions and scaling
  const width = 300;
  const height = 300;
  const margin = { top: 40, right: 60, bottom: 60, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  
  // Calculate appropriate axis ranges based on model type and parameters
  let xMax, yMax, xTicks, yTicks;
  
  if (type === 'competition') {
    xMax = Math.max(p.K1, p.K2 / p.a21) * 1.2;
    yMax = Math.max(p.K2, p.K1 / p.a12) * 1.2;
    xTicks = [0, Math.round(xMax * 0.25), Math.round(xMax * 0.5), Math.round(xMax * 0.75), Math.round(xMax)];
    yTicks = [0, Math.round(yMax * 0.25), Math.round(yMax * 0.5), Math.round(yMax * 0.75), Math.round(yMax)];
  } else {
    xMax = (p.r2 / p.b) * 2;
    yMax = (p.r1 / p.a) * 2;
    xTicks = [0, Math.round(xMax * 0.25), Math.round(xMax * 0.5), Math.round(xMax * 0.75), Math.round(xMax)];
    yTicks = [0, Math.round(yMax * 0.25), Math.round(yMax * 0.5), Math.round(yMax * 0.75), Math.round(yMax)];
  }
  
  // Scale functions
  const scaleX = (x: number) => margin.left + (x / xMax) * chartWidth;
  const scaleY = (y: number) => margin.top + chartHeight - (y / yMax) * chartHeight;
  
  // Competition model calculations
  const competition = type === 'competition' ? {
    // Species 1 nullcline: dN1/dt = 0 → N1 = K1 - a12*N2
    n1Nullcline: {
      start: { x: scaleX(0), y: scaleY(p.K1) },
      end: { x: scaleX(p.K1 / p.a12), y: scaleY(0) }
    },
    // Species 2 nullcline: dN2/dt = 0 → N2 = K2 - a21*N1  
    n2Nullcline: {
      start: { x: scaleX(0), y: scaleY(p.K2) },
      end: { x: scaleX(p.K2 / p.a21), y: scaleY(0) }
    },
    // Equilibrium point (if it exists and is positive)
    equilibrium: (() => {
      const denom = 1 - p.a12 * p.a21;
      if (denom === 0) return null;
      const n1_eq = (p.K1 - p.a12 * p.K2) / denom;
      const n2_eq = (p.K2 - p.a21 * p.K1) / denom;
      return (n1_eq > 0 && n2_eq > 0) ? 
        { x: scaleX(n1_eq), y: scaleY(n2_eq), n1: n1_eq, n2: n2_eq } : null;
    })(),
    coexistencePossible: (() => {
      const denom = 1 - p.a12 * p.a21;
      if (denom <= 0) return false;
      const n1_eq = (p.K1 - p.a12 * p.K2) / denom;
      const n2_eq = (p.K2 - p.a21 * p.K1) / denom;
      return n1_eq > 0 && n2_eq > 0;
    })()
  } : null;
  
  // Predator-prey model calculations
  const predatorPrey = type === 'predator-prey' ? {
    // Prey nullcline: dN1/dt = 0 → N2 = r1/a (horizontal line)
    preyNullcline: {
      y: scaleY(p.r1 / p.a),
      value: p.r1 / p.a
    },
    // Predator nullcline: dN2/dt = 0 → N1 = r2/b (vertical line)  
    predatorNullcline: {
      x: scaleX(p.r2 / p.b),
      value: p.r2 / p.b
    },
    // Equilibrium point
    equilibrium: {
      x: scaleX(p.r2 / p.b),
      y: scaleY(p.r1 / p.a),
      n1: p.r2 / p.b,
      n2: p.r1 / p.a
    }
  } : null;

  return (
    <Card className={`shadow-card ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            {type === 'competition' ? 'Competition Phase Plane' : 'Predator-Prey Phase Plane'}
          </CardTitle>
          <Badge variant={type === 'competition' ? 'secondary' : 'default'} className="text-xs">
            {type === 'competition' ? 'Linear Nullclines' : 'Perpendicular Nullclines'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg width={width} height={height} className="border rounded-lg bg-background">
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--foreground))" />
              </marker>
              <marker id="arrow-flow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                <polygon points="0 0, 6 2, 0 4" fill="hsl(var(--primary))" />
              </marker>
            </defs>
            
            {/* Grid lines */}
            {xTicks.map((tick, i) => (
              <line 
                key={`vgrid-${i}`}
                x1={scaleX(tick)} 
                y1={margin.top} 
                x2={scaleX(tick)} 
                y2={margin.top + chartHeight}
                stroke="hsl(var(--border))" 
                strokeWidth="0.5" 
                opacity="0.3"
              />
            ))}
            {yTicks.map((tick, i) => (
              <line 
                key={`hgrid-${i}`}
                x1={margin.left} 
                y1={scaleY(tick)} 
                x2={margin.left + chartWidth} 
                y2={scaleY(tick)}
                stroke="hsl(var(--border))" 
                strokeWidth="0.5" 
                opacity="0.3"
              />
            ))}
            
            {/* Main axes */}
            <line 
              x1={margin.left} 
              y1={margin.top + chartHeight} 
              x2={margin.left + chartWidth + 15} 
              y2={margin.top + chartHeight}
              stroke="hsl(var(--foreground))" 
              strokeWidth="2" 
              markerEnd="url(#arrowhead)"
            />
            <line 
              x1={margin.left} 
              y1={margin.top + chartHeight} 
              x2={margin.left} 
              y2={margin.top - 15}
              stroke="hsl(var(--foreground))" 
              strokeWidth="2" 
              markerEnd="url(#arrowhead)"
            />
            
            {/* Axis labels */}
            <text 
              x={margin.left + chartWidth + 25} 
              y={margin.top + chartHeight + 5} 
              fontSize="12" 
              fill="hsl(var(--foreground))"
              fontWeight="600"
            >
              N₁ {type === 'competition' ? '(Species 1)' : '(Prey)'}
            </text>
            <text 
              x={margin.left - 10} 
              y={margin.top - 20} 
              fontSize="12" 
              fill="hsl(var(--foreground))"
              fontWeight="600"
              textAnchor="middle"
            >
              N₂ {type === 'competition' ? '(Species 2)' : '(Predator)'}
            </text>
            
            {/* Axis tick labels */}
            {xTicks.map((tick, i) => (
              <text 
                key={`xlabel-${i}`}
                x={scaleX(tick)} 
                y={margin.top + chartHeight + 15} 
                fontSize="10" 
                fill="hsl(var(--muted-foreground))"
                textAnchor="middle"
              >
                {tick}
              </text>
            ))}
            {yTicks.map((tick, i) => (
              <text 
                key={`ylabel-${i}`}
                x={margin.left - 10} 
                y={scaleY(tick) + 3} 
                fontSize="10" 
                fill="hsl(var(--muted-foreground))"
                textAnchor="end"
              >
                {tick}
              </text>
            ))}
            
            {/* Competition model visualization */}
            {type === 'competition' && competition && (
              <>
                {/* Species 1 nullcline */}
                <line 
                  x1={competition.n1Nullcline.start.x}
                  y1={competition.n1Nullcline.start.y}
                  x2={competition.n1Nullcline.end.x}
                  y2={competition.n1Nullcline.end.y}
                  stroke="hsl(var(--primary))" 
                  strokeWidth="3"
                />
                <text 
                  x={competition.n1Nullcline.start.x + 10}
                  y={competition.n1Nullcline.start.y - 10}
                  fontSize="11"
                  fill="hsl(var(--primary))"
                  fontWeight="600"
                >
                  dN₁/dt = 0
                </text>
                
                {/* Species 2 nullcline */}
                <line 
                  x1={competition.n2Nullcline.start.x}
                  y1={competition.n2Nullcline.start.y}
                  x2={competition.n2Nullcline.end.x}
                  y2={competition.n2Nullcline.end.y}
                  stroke="hsl(var(--secondary))" 
                  strokeWidth="3"
                />
                <text 
                  x={competition.n2Nullcline.end.x - 10}
                  y={competition.n2Nullcline.end.y + 20}
                  fontSize="11"
                  fill="hsl(var(--secondary))"
                  fontWeight="600"
                >
                  dN₂/dt = 0
                </text>
                
                {/* Equilibrium point */}
                {competition.equilibrium && (
                  <>
                    <circle 
                      cx={competition.equilibrium.x}
                      cy={competition.equilibrium.y}
                      r="4"
                      fill="hsl(var(--destructive))"
                      stroke="hsl(var(--background))"
                      strokeWidth="2"
                    />
                    <text 
                      x={competition.equilibrium.x + 8}
                      y={competition.equilibrium.y - 8}
                      fontSize="10"
                      fill="hsl(var(--foreground))"
                      fontWeight="600"
                    >
                      Equilibrium ({competition.equilibrium.n1.toFixed(1)}, {competition.equilibrium.n2.toFixed(1)})
                    </text>
                  </>
                )}
                
                {/* Flow arrows showing dynamics */}
                {competition.coexistencePossible ? (
                  <>
                    {/* Arrows pointing toward equilibrium */}
                    <path d="M 80 80 L 120 120" stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrow-flow)" opacity="0.7"/>
                    <path d="M 200 80 L 160 120" stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrow-flow)" opacity="0.7"/>
                    <path d="M 80 200 L 120 160" stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrow-flow)" opacity="0.7"/>
                    <path d="M 200 200 L 160 160" stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrow-flow)" opacity="0.7"/>
                    
                    <text x={width - 80} y={height - 20} fontSize="11" fill="hsl(var(--primary))" fontWeight="600">
                      Stable Coexistence
                    </text>
                  </>
                ) : (
                  <>
                    {/* Arrows showing competitive exclusion */}
                    <path d="M 80 80 L 60 60" stroke="hsl(var(--destructive))" strokeWidth="2" markerEnd="url(#arrow-flow)" opacity="0.7"/>
                    <path d="M 200 200 L 220 220" stroke="hsl(var(--destructive))" strokeWidth="2" markerEnd="url(#arrow-flow)" opacity="0.7"/>
                    
                    <text x={width - 100} y={height - 20} fontSize="11" fill="hsl(var(--destructive))" fontWeight="600">
                      Competitive Exclusion
                    </text>
                  </>
                )}
              </>
            )}
            
            {/* Predator-prey model visualization */}
            {type === 'predator-prey' && predatorPrey && (
              <>
                {/* Prey nullcline (horizontal) */}
                <line 
                  x1={margin.left}
                  y1={predatorPrey.preyNullcline.y}
                  x2={margin.left + chartWidth}
                  y2={predatorPrey.preyNullcline.y}
                  stroke="hsl(var(--primary))" 
                  strokeWidth="3"
                />
                <text 
                  x={margin.left + 10}
                  y={predatorPrey.preyNullcline.y - 8}
                  fontSize="11"
                  fill="hsl(var(--primary))"
                  fontWeight="600"
                >
                  dN₁/dt = 0 (Prey nullcline)
                </text>
                
                {/* Predator nullcline (vertical) */}
                <line 
                  x1={predatorPrey.predatorNullcline.x}
                  y1={margin.top}
                  x2={predatorPrey.predatorNullcline.x}
                  y2={margin.top + chartHeight}
                  stroke="hsl(var(--secondary))" 
                  strokeWidth="3"
                />
                <text 
                  x={predatorPrey.predatorNullcline.x + 8}
                  y={margin.top + 20}
                  fontSize="11"
                  fill="hsl(var(--secondary))"
                  fontWeight="600"
                  transform={`rotate(90, ${predatorPrey.predatorNullcline.x + 8}, ${margin.top + 20})`}
                >
                  dN₂/dt = 0 (Predator nullcline)
                </text>
                
                {/* Equilibrium point */}
                <circle 
                  cx={predatorPrey.equilibrium.x}
                  cy={predatorPrey.equilibrium.y}
                  r="4"
                  fill="hsl(var(--destructive))"
                  stroke="hsl(var(--background))"
                  strokeWidth="2"
                />
                <text 
                  x={predatorPrey.equilibrium.x + 8}
                  y={predatorPrey.equilibrium.y - 8}
                  fontSize="10"
                  fill="hsl(var(--foreground))"
                  fontWeight="600"
                >
                  Equilibrium ({predatorPrey.equilibrium.n1.toFixed(1)}, {predatorPrey.equilibrium.n2.toFixed(1)})
                </text>
                
                {/* Orbital flow arrows (clockwise) */}
                <path 
                  d={`M ${predatorPrey.equilibrium.x + 30} ${predatorPrey.equilibrium.y} 
                      Q ${predatorPrey.equilibrium.x + 30} ${predatorPrey.equilibrium.y - 30} 
                        ${predatorPrey.equilibrium.x} ${predatorPrey.equilibrium.y - 30}`}
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="2" 
                  markerEnd="url(#arrow-flow)"
                  opacity="0.8"
                />
                <path 
                  d={`M ${predatorPrey.equilibrium.x} ${predatorPrey.equilibrium.y - 30} 
                      Q ${predatorPrey.equilibrium.x - 30} ${predatorPrey.equilibrium.y - 30} 
                        ${predatorPrey.equilibrium.x - 30} ${predatorPrey.equilibrium.y}`}
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="2" 
                  markerEnd="url(#arrow-flow)"
                  opacity="0.8"
                />
                <path 
                  d={`M ${predatorPrey.equilibrium.x - 30} ${predatorPrey.equilibrium.y} 
                      Q ${predatorPrey.equilibrium.x - 30} ${predatorPrey.equilibrium.y + 30} 
                        ${predatorPrey.equilibrium.x} ${predatorPrey.equilibrium.y + 30}`}
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="2" 
                  markerEnd="url(#arrow-flow)"
                  opacity="0.8"
                />
                <path 
                  d={`M ${predatorPrey.equilibrium.x} ${predatorPrey.equilibrium.y + 30} 
                      Q ${predatorPrey.equilibrium.x + 30} ${predatorPrey.equilibrium.y + 30} 
                        ${predatorPrey.equilibrium.x + 30} ${predatorPrey.equilibrium.y}`}
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="2" 
                  markerEnd="url(#arrow-flow)"
                  opacity="0.8"
                />
                
                <text x={width - 80} y={height - 20} fontSize="11" fill="hsl(var(--primary))" fontWeight="600">
                  Oscillatory Cycles
                </text>
              </>
            )}
          </svg>
          
          {/* Parameter display */}
          <div className="mt-3 p-3 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Current Parameters:</h4>
            <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
              {type === 'competition' ? (
                <>
                  <span>K₁ = {p.K1.toFixed(1)}, K₂ = {p.K2.toFixed(1)}</span>
                  <span>α₁₂ = {p.a12.toFixed(2)}, α₂₁ = {p.a21.toFixed(2)}</span>
                  <span>r₁ = {p.r1.toFixed(2)}, r₂ = {p.r2.toFixed(2)}</span>
                  <span className="col-span-2">
                    {competition?.coexistencePossible ? 
                      '✓ Stable coexistence possible' : 
                      '⚠ Competitive exclusion predicted'
                    }
                  </span>
                </>
              ) : (
                <>
                  <span>r₁ = {p.r1.toFixed(3)}, r₂ = {p.r2.toFixed(3)}</span>
                  <span>a = {p.a.toFixed(3)}, b = {p.b.toFixed(3)}</span>
                  <span className="col-span-2">N₁* = {(p.r2/p.b).toFixed(1)}, N₂* = {(p.r1/p.a).toFixed(1)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}