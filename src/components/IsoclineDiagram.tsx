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
  showEmbeddedLegend?: boolean;
}

export default function IsoclineDiagram({ type, parameters, className, showEmbeddedLegend = true }: IsoclineDiagramProps) {
  // Default parameters that ensure meaningful diagrams
  const defaultParams = {
    r1: 1.0, r2: 0.8, K1: 100, K2: 80, a12: 0.8, a21: 0.6,
    a: 0.012, b: 0.008, N1_0: 50, N2_0: 20,
  };
  
  const p = parameters || defaultParams;
  
  // Compact chart dimensions for proper grid layout
  const width = 400;
  const height = 280;
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
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
          <CardTitle className="text-base font-semibold">
            {type === 'competition' ? 'Competition Phase Plane Analysis' : 'Predator-Prey Phase Plane Analysis'}
          </CardTitle>
          <Badge variant={type === 'competition' ? 'secondary' : 'default'} className="text-xs">
            {type === 'competition' ? 'Linear Nullclines' : 'Perpendicular Nullclines'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center">
        <svg width={width} height={height} className="border rounded-lg bg-background shadow-sm">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
              <polygon points="0 0, 10 4, 0 8" fill="hsl(var(--foreground))" />
            </marker>
            <marker id="arrow-flow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--primary))" />
            </marker>
            <marker id="arrow-red" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--destructive))" />
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
                x2={margin.left + chartWidth + 20} 
                y2={margin.top + chartHeight}
                stroke="hsl(var(--foreground))" 
                strokeWidth="2" 
                markerEnd="url(#arrowhead)"
              />
              <line 
                x1={margin.left} 
                y1={margin.top + chartHeight} 
                x2={margin.left} 
                y2={margin.top - 20}
                stroke="hsl(var(--foreground))" 
                strokeWidth="2" 
                markerEnd="url(#arrowhead)"
              />
              
              {/* Axis labels - Centered and prominent */}
              <text 
                x={margin.left + chartWidth / 2} 
                y={margin.top + chartHeight + 35} 
                fontSize="16" 
                fill="hsl(var(--foreground))"
                fontWeight="700"
                textAnchor="middle"
              >
                N₁ {type === 'competition' ? '(Species 1)' : '(Prey)'}
              </text>
              <text 
                x={margin.left - 35} 
                y={margin.top + chartHeight / 2} 
                fontSize="16" 
                fill="hsl(var(--foreground))"
                fontWeight="700"
                textAnchor="middle"
                transform={`rotate(-90, ${margin.left - 35}, ${margin.top + chartHeight / 2})`}
              >
                N₂ {type === 'competition' ? '(Species 2)' : '(Predator)'}
              </text>
              
              {/* Axis tick labels */}
              {xTicks.map((tick, i) => (
                <text 
                  key={`xlabel-${i}`}
                  x={scaleX(tick)} 
                  y={margin.top + chartHeight + 20} 
                  fontSize="11" 
                  fill="hsl(var(--muted-foreground))"
                  textAnchor="middle"
                >
                  {tick}
                </text>
              ))}
              {yTicks.map((tick, i) => (
                <text 
                  key={`ylabel-${i}`}
                  x={margin.left - 15} 
                  y={scaleY(tick) + 4} 
                  fontSize="11" 
                  fill="hsl(var(--muted-foreground))"
                  textAnchor="end"
                >
                  {tick}
                </text>
              ))}
              
              {/* Competition model visualization */}
              {type === 'competition' && competition && (
                <>
                  {/* Carrying capacity indicators */}
                  <circle cx={scaleX(p.K1)} cy={scaleY(0)} r="3" fill="hsl(var(--primary))" opacity="0.7"/>
                  <text x={scaleX(p.K1)} y={scaleY(0) + 20} fontSize="10" fill="hsl(var(--primary))" textAnchor="middle" fontWeight="600">
                    K₁
                  </text>
                  <circle cx={scaleX(0)} cy={scaleY(p.K2)} r="3" fill="hsl(var(--secondary))" opacity="0.7"/>
                  <text x={scaleX(0) - 15} y={scaleY(p.K2) + 4} fontSize="10" fill="hsl(var(--secondary))" textAnchor="middle" fontWeight="600">
                    K₂
                  </text>
                  
                  {/* Species 1 nullcline */}
                  <line 
                    x1={competition.n1Nullcline.start.x}
                    y1={competition.n1Nullcline.start.y}
                    x2={competition.n1Nullcline.end.x}
                    y2={competition.n1Nullcline.end.y}
                    stroke="hsl(var(--primary))" 
                    strokeWidth="4"
                  />
                  <text 
                    x={(competition.n1Nullcline.start.x + competition.n1Nullcline.end.x) / 2}
                    y={(competition.n1Nullcline.start.y + competition.n1Nullcline.end.y) / 2 - 15}
                    fontSize="12"
                    fill="hsl(var(--primary))"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    N₁ = K₁ - α₁₂N₂
                  </text>
                  <text 
                    x={(competition.n1Nullcline.start.x + competition.n1Nullcline.end.x) / 2}
                    y={(competition.n1Nullcline.start.y + competition.n1Nullcline.end.y) / 2 - 2}
                    fontSize="10"
                    fill="hsl(var(--primary))"
                    textAnchor="middle"
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
                    strokeWidth="4"
                  />
                  <text 
                    x={(competition.n2Nullcline.start.x + competition.n2Nullcline.end.x) / 2}
                    y={(competition.n2Nullcline.start.y + competition.n2Nullcline.end.y) / 2 + 25}
                    fontSize="12"
                    fill="hsl(var(--secondary))"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    N₂ = K₂ - α₂₁N₁
                  </text>
                  <text 
                    x={(competition.n2Nullcline.start.x + competition.n2Nullcline.end.x) / 2}
                    y={(competition.n2Nullcline.start.y + competition.n2Nullcline.end.y) / 2 + 40}
                    fontSize="10"
                    fill="hsl(var(--secondary))"
                    textAnchor="middle"
                  >
                    dN₂/dt = 0
                  </text>
                  
                  {/* Regional flow indicators */}
                  {competition.coexistencePossible ? (
                    <>
                      {/* Equilibrium point */}
                      <circle 
                        cx={competition.equilibrium!.x}
                        cy={competition.equilibrium!.y}
                        r="5"
                        fill="hsl(var(--destructive))"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text 
                        x={competition.equilibrium!.x + 12}
                        y={competition.equilibrium!.y - 12}
                        fontSize="11"
                        fill="hsl(var(--foreground))"
                        fontWeight="600"
                      >
                        Stable Equilibrium
                      </text>
                      <text 
                        x={competition.equilibrium!.x + 12}
                        y={competition.equilibrium!.y + 2}
                        fontSize="9"
                        fill="hsl(var(--muted-foreground))"
                      >
                        ({competition.equilibrium!.n1.toFixed(1)}, {competition.equilibrium!.n2.toFixed(1)})
                      </text>
                      
                      {/* Dynamic flow arrows toward equilibrium */}
                      <g opacity="0.8">
                        {(() => {
                          const eqX = competition.equilibrium!.x;
                          const eqY = competition.equilibrium!.y;
                          const offset = 60;
                          
                          return (
                            <>
                              <path d={`M ${eqX - offset} ${eqY - offset} L ${eqX - 20} ${eqY - 20}`} stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrow-flow)"/>
                              <text x={eqX - offset - 5} y={eqY - offset - 5} fontSize="10" fill="hsl(var(--primary))" fontWeight="600" textAnchor="end">N₁↑, N₂↑</text>
                              
                              <path d={`M ${eqX + offset} ${eqY - offset} L ${eqX + 20} ${eqY - 20}`} stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrow-flow)"/>
                              <text x={eqX + offset + 5} y={eqY - offset - 5} fontSize="10" fill="hsl(var(--primary))" fontWeight="600">N₁↓, N₂↑</text>
                              
                              <path d={`M ${eqX - offset} ${eqY + offset} L ${eqX - 20} ${eqY + 20}`} stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrow-flow)"/>
                              <text x={eqX - offset - 5} y={eqY + offset + 15} fontSize="10" fill="hsl(var(--primary))" fontWeight="600" textAnchor="end">N₁↑, N₂↓</text>
                              
                              <path d={`M ${eqX + offset} ${eqY + offset} L ${eqX + 20} ${eqY + 20}`} stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrow-flow)"/>
                              <text x={eqX + offset + 5} y={eqY + offset + 15} fontSize="10" fill="hsl(var(--primary))" fontWeight="600">N₁↓, N₂↓</text>
                            </>
                          );
                        })()}
                      </g>
                    </>
                   ) : (
                    <>
                      {/* Regional background colors for exclusion */}
                      {(() => {
                        const n1Int = scaleX(p.K1 / p.a12);
                        const n2Int = scaleX(p.K2 / p.a21);
                        const k1Y = scaleY(p.K1);
                        const k2Y = scaleY(p.K2);
                        
                        // Determine which species wins based on nullcline positions
                        const species1Wins = p.K1 / p.a12 > p.K2 / p.a21;
                        
                        return (
                          <>
                            {/* Background regions */}
                            <rect x={margin.left} y={margin.top} 
                                  width={chartWidth} height={chartHeight}
                                  fill={species1Wins ? "hsl(var(--primary) / 0.08)" : "hsl(var(--secondary) / 0.08)"}/>
                            
                            {/* Regional labels */}
                            <text x={margin.left + chartWidth * 0.3} y={margin.top + chartHeight * 0.2} 
                                  fontSize="12" fill="hsl(var(--primary))" fontWeight="600" textAnchor="middle">
                              Both species grow
                            </text>
                            <text x={margin.left + chartWidth * 0.3} y={margin.top + chartHeight * 0.3} 
                                  fontSize="10" fill="hsl(var(--muted-foreground))" textAnchor="middle">
                              toward carrying capacity
                            </text>
                            
                            <text x={margin.left + chartWidth * 0.7} y={margin.top + chartHeight * 0.4} 
                                  fontSize="12" fill="hsl(var(--destructive))" fontWeight="600" textAnchor="middle">
                              {species1Wins ? "Species 1 Wins" : "Species 2 Wins"}
                            </text>
                            <text x={margin.left + chartWidth * 0.7} y={margin.top + chartHeight * 0.5} 
                                  fontSize="10" fill="hsl(var(--muted-foreground))" textAnchor="middle">
                              Competitive exclusion
                            </text>
                            
                            <text x={margin.left + chartWidth * 0.2} y={margin.top + chartHeight * 0.7} 
                                  fontSize="12" fill="hsl(var(--destructive))" fontWeight="600" textAnchor="middle">
                              {species1Wins ? "Species 1 Wins" : "Species 2 Wins"}
                            </text>
                            <text x={margin.left + chartWidth * 0.2} y={margin.top + chartHeight * 0.8} 
                                  fontSize="10" fill="hsl(var(--muted-foreground))" textAnchor="middle">
                              Competitive exclusion
                            </text>
                          </>
                        );
                      })()}
                    </>
                  )}
                </>
              )}
              
              {/* Predator-prey model visualization */}
              {type === 'predator-prey' && predatorPrey && (
                <>
                  {/* Regional background colors */}
                  <rect x={margin.left} y={margin.top} 
                        width={(predatorPrey.predatorNullcline.x - margin.left)} 
                        height={(predatorPrey.preyNullcline.y - margin.top)}
                        fill="hsl(var(--primary) / 0.05)"/>
                  <rect x={predatorPrey.predatorNullcline.x} y={margin.top} 
                        width={(margin.left + chartWidth - predatorPrey.predatorNullcline.x)} 
                        height={(predatorPrey.preyNullcline.y - margin.top)}
                        fill="hsl(var(--secondary) / 0.05)"/>
                  <rect x={margin.left} y={predatorPrey.preyNullcline.y} 
                        width={(predatorPrey.predatorNullcline.x - margin.left)} 
                        height={(margin.top + chartHeight - predatorPrey.preyNullcline.y)}
                        fill="hsl(var(--accent) / 0.05)"/>
                  <rect x={predatorPrey.predatorNullcline.x} y={predatorPrey.preyNullcline.y} 
                        width={(margin.left + chartWidth - predatorPrey.predatorNullcline.x)} 
                        height={(margin.top + chartHeight - predatorPrey.preyNullcline.y)}
                        fill="hsl(var(--muted) / 0.1)"/>
                  
                   {/* Prey nullcline (horizontal) - Better spaced labels */}
                   <line 
                     x1={margin.left}
                     y1={predatorPrey.preyNullcline.y}
                     x2={margin.left + chartWidth}
                     y2={predatorPrey.preyNullcline.y}
                     stroke="hsl(var(--primary))" 
                     strokeWidth="4"
                   />
                   <text 
                     x={margin.left + chartWidth * 0.3}
                     y={predatorPrey.preyNullcline.y - 12}
                     fontSize="12"
                     fill="hsl(var(--primary))"
                     fontWeight="700"
                     textAnchor="middle"
                   >
                     N₂ = {predatorPrey.preyNullcline.value.toFixed(1)}
                   </text>
                   <text 
                     x={margin.left + chartWidth * 0.7}
                     y={predatorPrey.preyNullcline.y + 18}
                     fontSize="10"
                     fill="hsl(var(--primary))"
                     textAnchor="middle"
                   >
                     dN₁/dt = 0
                   </text>
                   
                   {/* Predator nullcline (vertical) - Better spaced labels */}
                   <line 
                     x1={predatorPrey.predatorNullcline.x}
                     y1={margin.top}
                     x2={predatorPrey.predatorNullcline.x}
                     y2={margin.top + chartHeight}
                     stroke="hsl(var(--secondary))" 
                     strokeWidth="4"
                   />
                   <text 
                     x={predatorPrey.predatorNullcline.x + 20}
                     y={margin.top + chartHeight * 0.3}
                     fontSize="12"
                     fill="hsl(var(--secondary))"
                     fontWeight="700"
                     transform={`rotate(-90, ${predatorPrey.predatorNullcline.x + 20}, ${margin.top + chartHeight * 0.3})`}
                   >
                     N₁ = {predatorPrey.predatorNullcline.value.toFixed(1)}
                   </text>
                   <text 
                     x={predatorPrey.predatorNullcline.x - 20}
                     y={margin.top + chartHeight * 0.7}
                     fontSize="10"
                     fill="hsl(var(--secondary))"
                     transform={`rotate(-90, ${predatorPrey.predatorNullcline.x - 20}, ${margin.top + chartHeight * 0.7})`}
                   >
                     dN₂/dt = 0
                   </text>
                   
                   
                   {/* Equilibrium point - Repositioned to avoid overlap */}
                   <circle 
                     cx={predatorPrey.equilibrium.x}
                     cy={predatorPrey.equilibrium.y}
                     r="5"
                     fill="hsl(var(--destructive))"
                     stroke="white"
                     strokeWidth="2"
                   />
                   <text 
                     x={predatorPrey.equilibrium.x - 45}
                     y={predatorPrey.equilibrium.y - 25}
                     fontSize="11"
                     fill="hsl(var(--foreground))"
                     fontWeight="600"
                     textAnchor="middle"
                   >
                     Equilibrium
                   </text>
                   <text 
                     x={predatorPrey.equilibrium.x - 45}
                     y={predatorPrey.equilibrium.y - 10}
                     fontSize="9"
                     fill="hsl(var(--muted-foreground))"
                     textAnchor="middle"
                   >
                     ({predatorPrey.equilibrium.n1.toFixed(1)}, {predatorPrey.equilibrium.n2.toFixed(1)})
                   </text>
                  
                  {/* Clockwise orbital flow arrows */}
                  <g opacity="0.9">
                    <path 
                      d={`M ${predatorPrey.equilibrium.x + 50} ${predatorPrey.equilibrium.y} 
                          Q ${predatorPrey.equilibrium.x + 50} ${predatorPrey.equilibrium.y - 50} 
                            ${predatorPrey.equilibrium.x} ${predatorPrey.equilibrium.y - 50}`}
                      fill="none" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth="3" 
                      markerEnd="url(#arrow-flow)"
                    />
                    <path 
                      d={`M ${predatorPrey.equilibrium.x} ${predatorPrey.equilibrium.y - 50} 
                          Q ${predatorPrey.equilibrium.x - 50} ${predatorPrey.equilibrium.y - 50} 
                            ${predatorPrey.equilibrium.x - 50} ${predatorPrey.equilibrium.y}`}
                      fill="none" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth="3" 
                      markerEnd="url(#arrow-flow)"
                    />
                    <path 
                      d={`M ${predatorPrey.equilibrium.x - 50} ${predatorPrey.equilibrium.y} 
                          Q ${predatorPrey.equilibrium.x - 50} ${predatorPrey.equilibrium.y + 50} 
                            ${predatorPrey.equilibrium.x} ${predatorPrey.equilibrium.y + 50}`}
                      fill="none" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth="3" 
                      markerEnd="url(#arrow-flow)"
                    />
                    <path 
                      d={`M ${predatorPrey.equilibrium.x} ${predatorPrey.equilibrium.y + 50} 
                          Q ${predatorPrey.equilibrium.x + 50} ${predatorPrey.equilibrium.y + 50} 
                            ${predatorPrey.equilibrium.x + 50} ${predatorPrey.equilibrium.y}`}
                      fill="none" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth="3" 
                      markerEnd="url(#arrow-flow)"
                    />
                  </g>
                 </>
               )}
               
                {/* Embedded legend inside SVG - conditionally shown */}
                {showEmbeddedLegend && (
                  <g transform={`translate(${width - 150}, 15)`}>
                    <rect x="0" y="0" width="140" height="120" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" rx="4" opacity="0.95"/>
                    <text x="8" y="15" fontSize="11" fill="hsl(var(--foreground))" fontWeight="600">Legend</text>
                    
                    <line x1="8" y1="28" x2="20" y2="28" stroke="hsl(var(--primary))" strokeWidth="3"/>
                    <text x="24" y="31" fontSize="9" fill="hsl(var(--foreground))">
                      {type === 'competition' ? 'Species 1' : 'Prey'} nullcline
                    </text>
                    
                    <line x1="8" y1="40" x2="20" y2="40" stroke="hsl(var(--secondary))" strokeWidth="3"/>
                    <text x="24" y="43" fontSize="9" fill="hsl(var(--foreground))">
                      {type === 'competition' ? 'Species 2' : 'Predator'} nullcline
                    </text>
                    
                    <circle cx="14" cy="52" r="2.5" fill="hsl(var(--destructive))"/>
                    <text x="24" y="55" fontSize="9" fill="hsl(var(--foreground))">Equilibrium point</text>
                    
                    <path d="M 8 64 L 20 64" stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrow-flow)"/>
                    <text x="24" y="67" fontSize="9" fill="hsl(var(--foreground))">Flow direction</text>
                    
                    {type === 'competition' && (
                      <>
                        <circle cx="14" cy="76" r="2" fill="hsl(var(--primary))" opacity="0.7"/>
                        <text x="24" y="79" fontSize="9" fill="hsl(var(--foreground))">Carrying capacity</text>
                        
                        <text x="8" y="95" fontSize="8" fill="hsl(var(--muted-foreground))">
                          {competition?.coexistencePossible ? '✓ Coexistence' : '⚠ Exclusion'}
                        </text>
                      </>
                    )}
                    
                    {type === 'predator-prey' && (
                      <text x="8" y="90" fontSize="8" fill="hsl(var(--muted-foreground))">
                        ✓ Oscillatory dynamics
                      </text>
                    )}
                  </g>
                )}
        </svg>
      </CardContent>
    </Card>
  );
}