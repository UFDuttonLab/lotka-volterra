import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
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
            <h4 className="font-semibold text-foreground">Phase Plane Interpretation</h4>
            <p className="text-muted-foreground text-xs">
              Each point represents the system state (N₁, N₂) at a given time. The trajectory shows how populations evolve.
            </p>
          </div>
          
          {modelType === 'predator-prey' ? (
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-muted/50 rounded-lg border">
                <h5 className="font-medium text-foreground mb-2">Why Trajectories Form Closed Loops:</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <span className="font-medium">Conserved Quantity H:</span> H = r₁ln(N₂) - aN₂ + r₂ln(N₁) - bN₁ remains constant</li>
                  <li>• <span className="font-medium">Neutral Stability:</span> Equilibrium point is a center, not an attractor</li>
                  <li>• <span className="font-medium">Phase Lag:</span> Predator population changes follow prey changes with delay</li>
                  <li>• <span className="font-medium">Periodic Oscillations:</span> System returns to starting state, creating closed orbits</li>
                </ul>
              </div>
              <p className="text-muted-foreground">
                <span className="inline-block w-2 h-2 bg-destructive rounded-full mr-1"></span>
                Red dot marks the equilibrium point (r₂/b, r₁/a) - a center point around which orbits circulate
              </p>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-muted/50 rounded-lg border">
                <h5 className="font-medium text-foreground mb-2">Why Trajectories Converge (Don't Loop):</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <span className="font-medium">No Conservation Law:</span> Unlike predator-prey, competition has no conserved quantity</li>
                  <li>• <span className="font-medium">Dissipative System:</span> Competition reduces total carrying capacity over time</li>
                  <li>• <span className="font-medium">Stable Equilibria:</span> System has attracting fixed points or exclusion states</li>
                  <li>• <span className="font-medium">Competitive Exclusion:</span> Stronger competitor eventually dominates</li>
                </ul>
              </div>
              <p className="text-muted-foreground">
                Trajectory endpoint represents the long-term competitive outcome: coexistence or species exclusion
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}