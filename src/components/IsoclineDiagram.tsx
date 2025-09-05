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
  
  // Larger chart dimensions for better visibility and label management
  const width = 800;
  const height = 600;
  const margin = { top: 80, right: 140, bottom: 100, left: 100 };
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
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main diagram - takes priority space */}
          <div className="flex-1 min-h-[600px] flex justify-center">
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
              
              {/* Axis labels - Made more prominent */}
              <text 
                x={margin.left + chartWidth + 35} 
                y={margin.top + chartHeight + 8} 
                fontSize="16" 
                fill="hsl(var(--foreground))"
                fontWeight="700"
              >
                N₁ {type === 'competition' ? '(Species 1)' : '(Prey)'}
              </text>
              <text 
                x={margin.left - 25} 
                y={margin.top - 35} 
                fontSize="16" 
                fill="hsl(var(--foreground))"
                fontWeight="700"
                textAnchor="middle"
                transform={`rotate(-90, ${margin.left - 25}, ${margin.top - 35})`}
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
                    x={competition.n1Nullcline.start.x + 15}
                    y={competition.n1Nullcline.start.y - 15}
                    fontSize="12"
                    fill="hsl(var(--primary))"
                    fontWeight="700"
                  >
                    dN₁/dt = 0
                  </text>
                  <text 
                    x={competition.n1Nullcline.start.x + 15}
                    y={competition.n1Nullcline.start.y - 2}
                    fontSize="10"
                    fill="hsl(var(--primary))"
                  >
                    N₁ = K₁ - α₁₂N₂
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
                    x={competition.n2Nullcline.end.x - 15}
                    y={competition.n2Nullcline.end.y + 30}
                    fontSize="12"
                    fill="hsl(var(--secondary))"
                    fontWeight="700"
                    textAnchor="end"
                  >
                    dN₂/dt = 0
                  </text>
                  <text 
                    x={competition.n2Nullcline.end.x - 15}
                    y={competition.n2Nullcline.end.y + 45}
                    fontSize="10"
                    fill="hsl(var(--secondary))"
                    textAnchor="end"
                  >
                    N₂ = K₂ - α₂₁N₁
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
                      {/* Competitive exclusion indicators with aligned arrows */}
                      {(() => {
                        const sp1WinX = scaleX(p.K1 * 0.7);
                        const sp1WinY = scaleY(10);
                        const sp2WinX = scaleX(10);
                        const sp2WinY = scaleY(p.K2 * 0.7);
                        
                        return (
                          <>
                            {/* Species 1 wins region */}
                            <path d={`M ${sp1WinX - 30} ${sp1WinY + 20} L ${sp1WinX - 10} ${sp1WinY + 5}`} 
                                  stroke="hsl(var(--destructive))" strokeWidth="3" markerEnd="url(#arrow-red)"/>
                            <text x={sp1WinX - 35} y={sp1WinY + 25} fontSize="12" fill="hsl(var(--destructive))" 
                                  fontWeight="700" textAnchor="end">
                              Species 1 Wins
                            </text>
                            
                            {/* Species 2 wins region */}
                            <path d={`M ${sp2WinX + 20} ${sp2WinY - 30} L ${sp2WinX + 5} ${sp2WinY - 10}`} 
                                  stroke="hsl(var(--destructive))" strokeWidth="3" markerEnd="url(#arrow-red)"/>
                            <text x={sp2WinX + 25} y={sp2WinY - 35} fontSize="12" fill="hsl(var(--destructive))" 
                                  fontWeight="700">
                              Species 2 Wins
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
                  
                  {/* Prey nullcline (horizontal) - Consolidated labels */}
                  <line 
                    x1={margin.left}
                    y1={predatorPrey.preyNullcline.y}
                    x2={margin.left + chartWidth}
                    y2={predatorPrey.preyNullcline.y}
                    stroke="hsl(var(--primary))" 
                    strokeWidth="4"
                  />
                  <text 
                    x={margin.left + 20}
                    y={predatorPrey.preyNullcline.y - 8}
                    fontSize="11"
                    fill="hsl(var(--primary))"
                    fontWeight="700"
                  >
                    dN₁/dt = 0: N₂ = {predatorPrey.preyNullcline.value.toFixed(1)}
                  </text>
                  
                  {/* Predator nullcline (vertical) - Consolidated labels */}
                  <line 
                    x1={predatorPrey.predatorNullcline.x}
                    y1={margin.top}
                    x2={predatorPrey.predatorNullcline.x}
                    y2={margin.top + chartHeight}
                    stroke="hsl(var(--secondary))" 
                    strokeWidth="4"
                  />
                  <text 
                    x={predatorPrey.predatorNullcline.x + 8}
                    y={margin.top + 20}
                    fontSize="11"
                    fill="hsl(var(--secondary))"
                    fontWeight="700"
                  >
                    dN₂/dt = 0
                  </text>
                  <text 
                    x={predatorPrey.predatorNullcline.x + 8}
                    y={margin.top + 35}
                    fontSize="10"
                    fill="hsl(var(--secondary))"
                  >
                    N₁ = {predatorPrey.predatorNullcline.value.toFixed(1)}
                  </text>
                  
                  {/* Optimized quadrant labels with better spacing to avoid overlap */}
                  {(() => {
                    const eq = predatorPrey.equilibrium;
                    const quadrantOffset = 70; // Increased distance from equilibrium
                    const labelSpacing = 18;    // Space between label lines
                    
                    return (
                      <>
                        {/* Quadrant II (top-left): Prey increases, Predator decreases */}
                        <text x={eq.x - quadrantOffset} y={eq.y - quadrantOffset} 
                              fontSize="12" fill="hsl(var(--primary))" fontWeight="700" textAnchor="middle">
                          Prey Growth
                        </text>
                        <text x={eq.x - quadrantOffset} y={eq.y - quadrantOffset + labelSpacing} 
                              fontSize="10" fill="hsl(var(--primary))" textAnchor="middle">
                          N₁↑, N₂↓
                        </text>
                        
                        {/* Quadrant I (top-right): Both decrease initially */}
                        <text x={eq.x + quadrantOffset} y={eq.y - quadrantOffset} 
                              fontSize="12" fill="hsl(var(--secondary))" fontWeight="700" textAnchor="middle">
                          Predator Growth
                        </text>
                        <text x={eq.x + quadrantOffset} y={eq.y - quadrantOffset + labelSpacing} 
                              fontSize="10" fill="hsl(var(--secondary))" textAnchor="middle">
                          N₁↓, N₂↑
                        </text>
                        
                        {/* Quadrant III (bottom-left): Both decline */}
                        <text x={eq.x - quadrantOffset} y={eq.y + quadrantOffset} 
                              fontSize="12" fill="hsl(var(--accent))" fontWeight="700" textAnchor="middle">
                          Both Decline
                        </text>
                        <text x={eq.x - quadrantOffset} y={eq.y + quadrantOffset + labelSpacing} 
                              fontSize="10" fill="hsl(var(--accent))" textAnchor="middle">
                          N₁↓, N₂↓
                        </text>
                        
                        {/* Quadrant IV (bottom-right): Both grow */}
                        <text x={eq.x + quadrantOffset} y={eq.y + quadrantOffset} 
                              fontSize="12" fill="hsl(var(--muted-foreground))" fontWeight="700" textAnchor="middle">
                          Both Grow
                        </text>
                        <text x={eq.x + quadrantOffset} y={eq.y + quadrantOffset + labelSpacing} 
                              fontSize="10" fill="hsl(var(--muted-foreground))" textAnchor="middle">
                          N₁↑, N₂↑
                        </text>
                      </>
                    );
                  })()}
                  
                  {/* Equilibrium point - Repositioned label */}
                  <circle 
                    cx={predatorPrey.equilibrium.x}
                    cy={predatorPrey.equilibrium.y}
                    r="5"
                    fill="hsl(var(--destructive))"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text 
                    x={predatorPrey.equilibrium.x - 15}
                    y={predatorPrey.equilibrium.y - 15}
                    fontSize="10"
                    fill="hsl(var(--foreground))"
                    fontWeight="600"
                    textAnchor="end"
                  >
                    Equilibrium
                  </text>
                  <text 
                    x={predatorPrey.equilibrium.x - 15}
                    y={predatorPrey.equilibrium.y - 2}
                    fontSize="9"
                    fill="hsl(var(--muted-foreground))"
                    textAnchor="end"
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
            </svg>
          </div>
          
          {/* Legend and interpretation panel - optimized width */}
          <div className="w-64 lg:w-72 space-y-4">
            {/* Legend */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-semibold mb-3">Legend</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-primary rounded"></div>
                  <span>Species 1/{type === 'predator-prey' ? 'Prey' : 'Species 1'} nullcline (dN₁/dt = 0)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-secondary rounded"></div>
                  <span>Species 2/{type === 'predator-prey' ? 'Predator' : 'Species 2'} nullcline (dN₂/dt = 0)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-destructive rounded-full"></div>
                  <span>Equilibrium point</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-primary">→</div>
                  <span>Population flow direction</span>
                </div>
                {type === 'competition' && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full opacity-70"></div>
                    <span>Carrying capacities (K₁, K₂)</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Model interpretation */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-semibold mb-3">Biological Interpretation</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                {type === 'competition' ? (
                  <>
                    <p><strong>Nullclines:</strong> Lines where one species' growth rate is zero</p>
                    <p><strong>Equilibrium:</strong> {competition?.coexistencePossible ? 
                      'Stable coexistence - both species persist' : 
                      'Competitive exclusion - one species dominates'}</p>
                    <p><strong>Flow arrows:</strong> Show how populations change over time</p>
                    <p><strong>K₁, K₂:</strong> Carrying capacities when species grow alone</p>
                  </>
                ) : (
                  <>
                    <p><strong>Horizontal nullcline:</strong> Prey growth stops when predator density = r₁/a</p>
                    <p><strong>Vertical nullcline:</strong> Predator growth stops when prey density = r₂/b</p>
                    <p><strong>Equilibrium:</strong> Center point with neutral stability</p>
                    <p><strong>Clockwise cycles:</strong> Populations oscillate in closed orbits</p>
                    <p><strong>Regional dynamics:</strong> Different growth patterns in each quadrant</p>
                  </>
                )}
              </div>
            </div>
            
            {/* Parameter display */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-semibold mb-3">Current Parameters</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                {type === 'competition' ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <span>K₁ = {p.K1.toFixed(1)}</span>
                      <span>K₂ = {p.K2.toFixed(1)}</span>
                      <span>α₁₂ = {p.a12.toFixed(3)}</span>
                      <span>α₂₁ = {p.a21.toFixed(3)}</span>
                      <span>r₁ = {p.r1.toFixed(2)}</span>
                      <span>r₂ = {p.r2.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-border">
                      <span className={competition?.coexistencePossible ? 'text-green-600' : 'text-orange-600'}>
                        {competition?.coexistencePossible ? 
                          '✓ Coexistence possible' : 
                          '⚠ Competitive exclusion'
                        }
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <span>r₁ = {p.r1.toFixed(2)}</span>
                      <span>r₂ = {p.r2.toFixed(2)}</span>
                      <span>a = {p.a.toFixed(4)}</span>
                      <span>b = {p.b.toFixed(4)}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-border">
                      <span className="text-blue-600">✓ Oscillatory dynamics</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}