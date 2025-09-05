import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, ReferenceLine } from 'recharts';
import { Badge } from "@/components/ui/badge";

interface DataPoint {
  time: number;
  species1: number;
  species2: number;
}

interface PhasePlaneChartProps {
  data: DataPoint[];
  modelType: "competition" | "predator-prey";
  parameters: {
    r1: number;
    r2: number;
    a: number;
    b: number;
    a12: number;
    a21: number;
    K1?: number;
    K2?: number;
  };
  isRunning: boolean;
}

export default function PhasePlaneChart({ data, modelType, parameters, isRunning }: PhasePlaneChartProps) {
  // Calculate equilibrium point
  const equilibrium = modelType === "predator-prey" 
    ? { x: parameters.r2 / parameters.b, y: parameters.r1 / parameters.a }
    : null;

  // Calculate isoclines
  const isoclines = modelType === "predator-prey" 
    ? {
        // Prey nullcline: horizontal line at N₂ = r₁/a
        preyNullcline: parameters.r1 / parameters.a,
        // Predator nullcline: vertical line at N₁ = r₂/b  
        predatorNullcline: parameters.r2 / parameters.b
      }
    : parameters.K1 && parameters.K2 
    ? {
        // Competition N₁-nullcline: N₁ = K₁ - α₁₂*N₂
        // Competition N₂-nullcline: N₂ = K₂ - α₂₁*N₁
        K1: parameters.K1,
        K2: parameters.K2,
        alpha12: parameters.a12, // effect of species 2 on species 1
        alpha21: parameters.a21   // effect of species 1 on species 2
      }
    : null;

  // Transform data for phase plane (species1 vs species2)
  const phaseData = data.map((point, index) => ({
    prey: point.species1,
    predator: point.species2,
    time: point.time,
    index: index
  }));

  const chartTitle = modelType === 'predator-prey' 
    ? 'Phase Plane: Predator vs Prey' 
    : 'Phase Plane: Species 2 vs Species 1';

  const xLabel = modelType === 'predator-prey' ? 'Prey Population (N₁)' : 'Species 1 Population (N₁)';
  const yLabel = modelType === 'predator-prey' ? 'Predator Population (N₂)' : 'Species 2 Population (N₂)';

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{chartTitle}</CardTitle>
          <div className="flex items-center gap-2">
            {isRunning && (
              <Badge variant="outline" className="animate-pulse">
                Drawing trajectory...
              </Badge>
            )}
            {modelType === 'predator-prey' && equilibrium && (
              <Badge variant="secondary" className="text-xs">
                Equilibrium: ({equilibrium.x.toFixed(2)}, {equilibrium.y.toFixed(2)})
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              data={phaseData}
              margin={{ top: 30, right: 50, left: 60, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                dataKey="prey" 
                name={xLabel}
                stroke="hsl(var(--foreground))"
                fontSize={13}
                fontWeight={500}
                label={{ 
                  value: xLabel, 
                  position: 'insideBottom', 
                  offset: -10,
                  style: { textAnchor: 'middle', fill: 'hsl(var(--foreground))', fontSize: '14px', fontWeight: '600' }
                }}
              />
              <YAxis 
                type="number" 
                dataKey="predator" 
                name={yLabel}
                stroke="hsl(var(--foreground))"
                fontSize={13}
                fontWeight={500}
                label={{ 
                  value: yLabel, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'hsl(var(--foreground))', fontSize: '14px', fontWeight: '600' }
                }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card p-3 rounded-lg border shadow-lg">
                        <p className="text-sm font-medium">Time: {data.time?.toFixed(2)}</p>
                        <p className="text-sm text-primary">
                          {modelType === 'predator-prey' ? 'Prey' : 'Species 1'}: {data.prey?.toFixed(2)}
                        </p>
                        <p className="text-sm text-secondary">
                          {modelType === 'predator-prey' ? 'Predator' : 'Species 2'}: {data.predator?.toFixed(2)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              {/* Trajectory line */}
              <Scatter 
                dataKey="predator" 
                fill="hsl(var(--primary))" 
                fillOpacity={0.6}
                stroke="hsl(var(--primary))"
                strokeWidth={1}
              />
              
              {/* Enhanced Isoclines with flow indicators */}
              {modelType === 'predator-prey' && isoclines && (
                <>
                  {/* Prey nullcline: horizontal line with enhanced styling */}
                  <ReferenceLine 
                    y={isoclines.preyNullcline}
                    stroke="hsl(var(--accent))"
                    strokeDasharray="12 6"
                    strokeWidth={3}
                    label={{
                      value: `Prey nullcline: N₂ = ${isoclines.preyNullcline.toFixed(2)} (dN₁/dt = 0)`,
                      position: 'top',
                      style: { 
                        fontSize: '12px', 
                        fill: 'hsl(var(--accent))', 
                        fontWeight: '600',
                        textShadow: '1px 1px 2px hsl(var(--background))'
                      }
                    }}
                  />
                  {/* Predator nullcline: vertical line with enhanced styling */}
                  <ReferenceLine 
                    x={isoclines.predatorNullcline}
                    stroke="hsl(var(--secondary))"
                    strokeDasharray="12 6" 
                    strokeWidth={3}
                    label={{
                      value: `Predator nullcline: N₁ = ${isoclines.predatorNullcline.toFixed(2)} (dN₂/dt = 0)`,
                      position: 'top',
                      angle: -90,
                      style: { 
                        fontSize: '12px', 
                        fill: 'hsl(var(--secondary))',
                        fontWeight: '600',
                        textShadow: '1px 1px 2px hsl(var(--background))'
                      }
                    }}
                  />
                  
                </>
              )}

              {modelType === 'competition' && isoclines && (
                <>
                  {/* N₁-nullcline: N₁ = K₁ - α₁₂*N₂ with enhanced styling */}
                  <ReferenceLine 
                    segment={[
                      { x: 0, y: isoclines.K1 }, 
                      { x: isoclines.K1 / isoclines.alpha12, y: 0 }
                    ]}
                    stroke="hsl(var(--accent))"
                    strokeDasharray="12 6"
                    strokeWidth={3}
                    label={{
                      value: `N₁-nullcline (dN₁/dt = 0)`,
                      position: 'top',
                      style: { 
                        fontSize: '12px', 
                        fill: 'hsl(var(--accent))',
                        fontWeight: '600',
                        textShadow: '1px 1px 2px hsl(var(--background))'
                      }
                    }}
                  />
                  {/* N₂-nullcline: N₂ = K₂ - α₂₁*N₁ with enhanced styling */}
                  <ReferenceLine 
                    segment={[
                      { x: 0, y: isoclines.K2 }, 
                      { x: isoclines.K2 / isoclines.alpha21, y: 0 }
                    ]}
                    stroke="hsl(var(--secondary))"
                    strokeDasharray="12 6"
                    strokeWidth={3}
                    label={{
                      value: `N₂-nullcline (dN₂/dt = 0)`,
                      position: 'bottom',
                      style: { 
                        fontSize: '12px', 
                        fill: 'hsl(var(--secondary))',
                        fontWeight: '600',
                        textShadow: '1px 1px 2px hsl(var(--background))'
                      }
                    }}
                  />
                  
                  {/* Competition equilibrium point */}
                  {(() => {
                    const denominator = 1 - isoclines.alpha12 * isoclines.alpha21;
                    if (Math.abs(denominator) > 0.001) {
                      const eqN1 = (isoclines.K1 - isoclines.alpha12 * isoclines.K2) / denominator;
                      const eqN2 = (isoclines.K2 - isoclines.alpha21 * isoclines.K1) / denominator;
                      if (eqN1 > 0 && eqN2 > 0) {
                        return (
                          <ReferenceDot 
                            x={eqN1} 
                            y={eqN2} 
                            r={6} 
                            fill="hsl(var(--destructive))" 
                            stroke="hsl(var(--background))"
                            strokeWidth={2}
                          />
                        );
                      }
                    }
                    return null;
                  })()}
                  
                </>
              )}
              
              {/* Equilibrium point for predator-prey */}
              {modelType === 'predator-prey' && equilibrium && (
                <ReferenceDot 
                  x={equilibrium.x} 
                  y={equilibrium.y} 
                  r={8} 
                  fill="hsl(var(--destructive))" 
                  stroke="hsl(var(--background))"
                  strokeWidth={3}
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-3 text-sm">
          <div className="space-y-1">
            <h4 className="font-semibold text-foreground">Phase Plane with Isoclines</h4>
            <p className="text-muted-foreground text-xs">
              Each point shows system state (N₁, N₂) at a time. Dashed lines are isoclines where growth rates equal zero.
            </p>
          </div>
          
          {modelType === 'predator-prey' ? (
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-muted/50 rounded-lg border">
                <h5 className="font-medium text-foreground mb-2">Isoclines & Flow Pattern:</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <span className="font-medium text-accent">Horizontal line (N₂ = r₁/a):</span> Prey nullcline - predator population where prey growth = 0</li>
                  <li>• <span className="font-medium text-secondary">Vertical line (N₁ = r₂/b):</span> Predator nullcline - prey population where predator growth = 0</li>
                  <li>• <span className="font-medium">Clockwise flow:</span> Trajectories circulate around equilibrium intersection point</li>
                  <li>• <span className="font-medium">Conserved orbits:</span> Each starting point creates a unique closed loop</li>
                </ul>
              </div>
              <p className="text-muted-foreground">
                <span className="inline-block w-2 h-2 bg-destructive rounded-full mr-1"></span>
                Red dot: Equilibrium (r₂/b, r₁/a) where isoclines intersect
              </p>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-muted/50 rounded-lg border">
                <h5 className="font-medium text-foreground mb-2">Isoclines & Competitive Outcome:</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <span className="font-medium text-accent">N₁-nullcline (N₁ = K₁ - α₁₂N₂):</span> Species 1 stops growing on this line</li>
                  <li>• <span className="font-medium text-secondary">N₂-nullcline (N₂ = K₂ - α₂₁N₁):</span> Species 2 stops growing on this line</li>
                  <li>• <span className="font-medium">Flow direction:</span> Populations move toward lower-right (competitive exclusion) or intersection (coexistence)</li>
                  <li>• <span className="font-medium">Intersection slopes:</span> Determine if coexistence is stable or unstable</li>
                </ul>
              </div>
              <p className="text-muted-foreground">
                Trajectory endpoint shows competitive outcome: exclusion of one species or stable coexistence
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}