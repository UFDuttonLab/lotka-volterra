import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface SimulationControlsProps {
  parameters: {
    r1: number; // Growth rate species 1
    r2: number; // Growth rate species 2
    K1: number; // Carrying capacity species 1
    K2: number; // Carrying capacity species 2
    a12: number; // Competition coefficient (effect of species 2 on species 1)
    a21: number; // Competition coefficient (effect of species 1 on species 2)
    N1_0: number; // Initial population species 1
    N2_0: number; // Initial population species 2
  };
  onParameterChange: (param: string, value: number) => void;
  isRunning: boolean;
  onPlayPause: () => void;
  onReset: () => void;
}

export default function SimulationControls({
  parameters,
  onParameterChange,
  isRunning,
  onPlayPause,
  onReset,
}: SimulationControlsProps) {
  const controlSections = [
    {
      title: "Growth Rates",
      parameters: [
        { key: "r1", label: "Species 1 Growth Rate (r₁)", min: 0.1, max: 2, step: 0.1, value: parameters.r1 },
        { key: "r2", label: "Species 2 Growth Rate (r₂)", min: 0.1, max: 2, step: 0.1, value: parameters.r2 },
      ],
    },
    {
      title: "Carrying Capacities",
      parameters: [
        { key: "K1", label: "Species 1 Capacity (K₁)", min: 50, max: 500, step: 10, value: parameters.K1 },
        { key: "K2", label: "Species 2 Capacity (K₂)", min: 50, max: 500, step: 10, value: parameters.K2 },
      ],
    },
    {
      title: "Competition Coefficients",
      parameters: [
        { key: "a12", label: "α₁₂ (Species 2 → Species 1)", min: 0, max: 2, step: 0.1, value: parameters.a12 },
        { key: "a21", label: "α₂₁ (Species 1 → Species 2)", min: 0, max: 2, step: 0.1, value: parameters.a21 },
      ],
    },
    {
      title: "Initial Populations",
      parameters: [
        { key: "N1_0", label: "Species 1 Initial (N₁₀)", min: 1, max: 200, step: 1, value: parameters.N1_0 },
        { key: "N2_0", label: "Species 2 Initial (N₂₀)", min: 1, max: 200, step: 1, value: parameters.N2_0 },
      ],
    },
  ];

  return (
    <Card className="w-full max-w-md mx-auto shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-center">Simulation Controls</CardTitle>
        <div className="flex gap-2 justify-center pt-2">
          <Button
            onClick={onPlayPause}
            variant={isRunning ? "destructive" : "default"}
            size="sm"
            className="flex items-center gap-2"
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {controlSections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {section.title}
            </h3>
            {section.parameters.map((param) => (
              <div key={param.key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor={param.key} className="text-sm font-medium">
                    {param.label}
                  </Label>
                  <span className="text-sm text-muted-foreground font-mono">
                    {param.value.toFixed(param.step < 1 ? 1 : 0)}
                  </span>
                </div>
                <Slider
                  id={param.key}
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={[param.value]}
                  onValueChange={(values) => onParameterChange(param.key, values[0])}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}