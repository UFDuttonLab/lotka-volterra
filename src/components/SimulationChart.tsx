import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DataPoint {
  time: number;
  species1: number;
  species2: number;
}

interface SimulationChartProps {
  data: DataPoint[];
  isRunning: boolean;
  modelType?: "competition" | "predator-prey";
  conservedQuantity?: {
    current: number;
    initial: number;
    isConserved: boolean;
  };
}

export default function SimulationChart({ data, isRunning, modelType = "competition", conservedQuantity }: SimulationChartProps) {
  // Apply model-specific theming - teal/emerald for competition, indigo for predator-prey
  const isCompetition = modelType === 'competition';
  const cardBg = isCompetition ? 'bg-emerald-50/70 border-emerald-300' : 'bg-indigo-50/70 border-indigo-300';
  const runningColor = isCompetition ? 'bg-emerald-500' : 'bg-indigo-500';
  
  return (
    <Card className={`w-full shadow-card ${cardBg}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Population Dynamics</CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time visualization of population dynamics over time
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: 'Population Size', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="species1"
                stroke="hsl(var(--chart-species1))"
                strokeWidth={2}
                dot={false}
                name={modelType === 'predator-prey' ? 'Prey' : 'Species 1'}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="species2"
                stroke="hsl(var(--chart-species2))"
                strokeWidth={2}
                dot={false}
                name={modelType === 'predator-prey' ? 'Predator' : 'Species 2'}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {isRunning && (
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 ${runningColor} rounded-full animate-pulse`}></div>
              Simulation running...
            </div>
          </div>
        )}
        
        {/* Conservation Quantity Display for Predator-Prey */}
        {modelType === 'predator-prey' && conservedQuantity && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg border">
            <div className="text-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Conservation Quantity (H):</span>
                <span className="font-mono">{conservedQuantity.current.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Initial H:</span>
                <span className="font-mono text-muted-foreground">{conservedQuantity.initial.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Conservation Status:</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${conservedQuantity.isConserved ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-xs font-medium ${conservedQuantity.isConserved ? 'text-green-700' : 'text-red-700'}`}>
                    {conservedQuantity.isConserved ? '✓ Conserved' : '⚠ Numerical Error'}
                  </span>
                </div>
              </div>
              {!conservedQuantity.isConserved && (
                <p className="text-xs text-red-600 mt-1">
                  H should remain constant. Large changes indicate numerical integration errors.
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}