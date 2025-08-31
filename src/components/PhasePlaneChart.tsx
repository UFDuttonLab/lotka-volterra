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
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                dataKey="prey" 
                name={xLabel}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                type="number" 
                dataKey="predator" 
                name={yLabel}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
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
                  r={6} 
                  fill="hsl(var(--destructive))" 
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          {modelType === 'predator-prey' ? (
            <>
              <p>• Trajectory shows the relationship between predator and prey populations over time</p>
              <p>• Red dot marks the equilibrium point (r₂/b, r₁/a)</p>
              <p>• Closed orbits indicate periodic oscillations (conservation of energy H)</p>
            </>
          ) : (
            <>
              <p>• Shows the interaction between competing species in phase space</p>
              <p>• Trajectory converges to equilibrium or exclusion depending on parameters</p>
              <p>• Final point represents long-term outcome of competition</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}