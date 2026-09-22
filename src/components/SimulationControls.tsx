import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import OrganismRangeTooltip from "./OrganismRangeTooltip";

interface SimulationControlsProps {
  modelType: "competition" | "predator-prey";
  parameters: {
    r1: number;
    r2: number;
    K1: number;
    K2: number;
    a12: number;
    a21: number;
    a: number;
    b: number;
    N1_0: number;
    N2_0: number;
  };
  speed: number;
  minSpeed: number;
  maxSpeed: number;
  timeStep: number;
  onParameterChange: (param: string, value: number) => void;
  onSpeedChange: (value: number) => void;
  isRunning: boolean;
  onPlayPause: () => void;
  onReset: () => void;
}

// Ranges cover every preset and exercise value, and the step sizes can
// represent them exactly, so loading a scenario never leaves a slider pinned
// at an endpoint it cannot return to.
const RANGES = {
  competition: {
    r1: { min: 0.1, max: 3.0, step: 0.05 },
    r2: { min: 0.1, max: 3.0, step: 0.05 },
    K1: { min: 10, max: 500, step: 5 },
    K2: { min: 10, max: 500, step: 5 },
    a12: { min: 0, max: 3.0, step: 0.05 },
    a21: { min: 0, max: 3.0, step: 0.05 },
  },
  predatorPrey: {
    r1: { min: 0.1, max: 4.0, step: 0.05 },
    r2: { min: 0.1, max: 3.0, step: 0.05 },
    a: { min: 0.0005, max: 0.5, step: 0.0005 },
    b: { min: 0.0005, max: 0.3, step: 0.0005 },
  },
  initial: { min: 1, max: 300, step: 1 },
};

function SimulationControls({
  modelType,
  parameters,
  speed,
  minSpeed,
  maxSpeed,
  timeStep,
  onParameterChange,
  onSpeedChange,
  isRunning,
  onPlayPause,
  onReset,
}: SimulationControlsProps) {
  // Apply model-specific theming - teal/emerald for competition, indigo for predator-prey
  const isCompetition = modelType === 'competition';
  const cardBg = isCompetition ? 'bg-emerald-50/70 border-emerald-300' : 'bg-indigo-50/70 border-indigo-300';
  const sectionBg = isCompetition ? 'bg-emerald-100/30' : 'bg-indigo-100/30';
  const iconColor = isCompetition ? 'text-emerald-600' : 'text-indigo-600';
  const comp = RANGES.competition;
  const pp = RANGES.predatorPrey;

  return (
    <Card className={`shadow-card ${cardBg}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className={`h-5 w-5 ${iconColor}`} />
          Simulation Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Control Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={onPlayPause}
            className="flex-1 shadow-button"
            variant={isRunning ? "secondary" : "default"}
          >
            {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRunning ? "Pause" : "Play"}
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="px-3"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Playback speed. This sets how many integration steps are taken per
            frame. The step size h is fixed, so speed changes what you watch,
            not what is computed. */}
        <div className={`space-y-4 p-4 rounded-lg ${sectionBg}`}>
          <h3 className={`text-sm font-medium ${iconColor} uppercase tracking-wide`}>
            Playback Speed
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slow</span>
              <span className="font-mono">{speed}x</span>
              <span>Fast</span>
            </div>
            <Slider
              value={[speed]}
              onValueChange={(value) => onSpeedChange(value[0])}
              min={minSpeed}
              max={maxSpeed}
              step={1}
              className="w-full"
            />
            <p className="text-[11px] text-muted-foreground">
              {speed} RK4 step{speed > 1 ? 's' : ''} of h = {timeStep} per frame,
              up to {(speed * timeStep * 20).toFixed(1)} time units per second.
              Integration accuracy is unaffected.
            </p>
          </div>
        </div>

        {modelType === 'competition' ? (
          <>
            {/* Growth Rates */}
            <div className={`space-y-4 p-4 rounded-lg ${sectionBg}`}>
              <h3 className={`text-sm font-medium ${iconColor} uppercase tracking-wide`}>
                Growth Rates
              </h3>
              <div className="space-y-3">
                <div>
                  <OrganismRangeTooltip parameter="r" currentValue={parameters.r1}>
                    <label className="flex justify-between text-sm mb-2">
                      <span>r₁ (Species 1)</span>
                      <span className="font-mono">{parameters.r1.toFixed(2)}</span>
                    </label>
                  </OrganismRangeTooltip>
                  <Slider
                    value={[parameters.r1]}
                    onValueChange={(value) => onParameterChange('r1', value[0])}
                    min={comp.r1.min}
                    max={comp.r1.max}
                    step={comp.r1.step}
                    className="w-full"
                  />
                </div>
                <div>
                  <OrganismRangeTooltip parameter="r" currentValue={parameters.r2}>
                    <label className="flex justify-between text-sm mb-2">
                      <span>r₂ (Species 2)</span>
                      <span className="font-mono">{parameters.r2.toFixed(2)}</span>
                    </label>
                  </OrganismRangeTooltip>
                  <Slider
                    value={[parameters.r2]}
                    onValueChange={(value) => onParameterChange('r2', value[0])}
                    min={comp.r2.min}
                    max={comp.r2.max}
                    step={comp.r2.step}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Carrying Capacities */}
            <div className={`space-y-4 p-4 rounded-lg ${sectionBg}`}>
              <h3 className={`text-sm font-medium ${iconColor} uppercase tracking-wide`}>
                Carrying Capacities
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="flex justify-between text-sm mb-2">
                    <span>K₁ (Species 1)</span>
                    <span className="font-mono">{parameters.K1}</span>
                  </label>
                  <Slider
                    value={[parameters.K1]}
                    onValueChange={(value) => onParameterChange('K1', value[0])}
                    min={comp.K1.min}
                    max={comp.K1.max}
                    step={comp.K1.step}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="flex justify-between text-sm mb-2">
                    <span>K₂ (Species 2)</span>
                    <span className="font-mono">{parameters.K2}</span>
                  </label>
                  <Slider
                    value={[parameters.K2]}
                    onValueChange={(value) => onParameterChange('K2', value[0])}
                    min={comp.K2.min}
                    max={comp.K2.max}
                    step={comp.K2.step}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Competition Coefficients */}
            <div className={`space-y-4 p-4 rounded-lg ${sectionBg}`}>
              <h3 className={`text-sm font-medium ${iconColor} uppercase tracking-wide`}>
                Competition Coefficients
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="flex justify-between text-sm mb-2">
                    <span>α₁₂ (Effect of 2 on 1)</span>
                    <span className="font-mono">{parameters.a12.toFixed(2)}</span>
                  </label>
                  <Slider
                    value={[parameters.a12]}
                    onValueChange={(value) => onParameterChange('a12', value[0])}
                    min={comp.a12.min}
                    max={comp.a12.max}
                    step={comp.a12.step}
                    className="w-full"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Threshold K₁/K₂ = {(parameters.K1 / parameters.K2).toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="flex justify-between text-sm mb-2">
                    <span>α₂₁ (Effect of 1 on 2)</span>
                    <span className="font-mono">{parameters.a21.toFixed(2)}</span>
                  </label>
                  <Slider
                    value={[parameters.a21]}
                    onValueChange={(value) => onParameterChange('a21', value[0])}
                    min={comp.a21.min}
                    max={comp.a21.max}
                    step={comp.a21.step}
                    className="w-full"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Threshold K₂/K₁ = {(parameters.K2 / parameters.K1).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Prey Parameters */}
            <div className={`space-y-4 p-4 rounded-lg ${sectionBg}`}>
              <h3 className={`text-sm font-medium ${iconColor} uppercase tracking-wide`}>
                Prey Parameters
              </h3>
              <div className="space-y-3">
                <div>
                  <OrganismRangeTooltip parameter="r" currentValue={parameters.r1}>
                    <label className="flex justify-between text-sm mb-2">
                      <span>r₁ (Growth Rate)</span>
                      <span className="font-mono">{parameters.r1.toFixed(2)}</span>
                    </label>
                  </OrganismRangeTooltip>
                  <Slider
                    value={[parameters.r1]}
                    onValueChange={(value) => onParameterChange('r1', value[0])}
                    min={pp.r1.min}
                    max={pp.r1.max}
                    step={pp.r1.step}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Predator Parameters */}
            <div className={`space-y-4 p-4 rounded-lg ${sectionBg}`}>
              <h3 className={`text-sm font-medium ${iconColor} uppercase tracking-wide`}>
                Predator Parameters
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="flex justify-between text-sm mb-2">
                    <span>r₂ (Death Rate)</span>
                    <span className="font-mono">{parameters.r2.toFixed(2)}</span>
                  </label>
                  <Slider
                    value={[parameters.r2]}
                    onValueChange={(value) => onParameterChange('r2', value[0])}
                    min={pp.r2.min}
                    max={pp.r2.max}
                    step={pp.r2.step}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Interaction Parameters */}
            <div className={`space-y-4 p-4 rounded-lg ${sectionBg}`}>
              <h3 className={`text-sm font-medium ${iconColor} uppercase tracking-wide`}>
                Interaction Parameters
              </h3>
              <div className="space-y-3">
                <div>
                  <OrganismRangeTooltip parameter="a" currentValue={parameters.a}>
                    <label className="flex justify-between text-sm mb-2">
                      <span>a (Predation Rate)</span>
                      <span className="font-mono">{parameters.a.toFixed(4)}</span>
                    </label>
                  </OrganismRangeTooltip>
                  <Slider
                    value={[parameters.a]}
                    onValueChange={(value) => onParameterChange('a', value[0])}
                    min={pp.a.min}
                    max={pp.a.max}
                    step={pp.a.step}
                    className="w-full"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Predator equilibrium N₂* = r₁/a = {(parameters.r1 / parameters.a).toFixed(1)}
                  </p>
                </div>
                <div>
                  <OrganismRangeTooltip parameter="b" currentValue={parameters.b}>
                    <label className="flex justify-between text-sm mb-2">
                      <span>b (Conversion Efficiency)</span>
                      <span className="font-mono">{parameters.b.toFixed(4)}</span>
                    </label>
                  </OrganismRangeTooltip>
                  <Slider
                    value={[parameters.b]}
                    onValueChange={(value) => onParameterChange('b', value[0])}
                    min={pp.b.min}
                    max={pp.b.max}
                    step={pp.b.step}
                    className="w-full"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Prey equilibrium N₁* = r₂/b = {(parameters.r2 / parameters.b).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Initial Populations */}
        <div className={`space-y-4 p-4 rounded-lg ${sectionBg}`}>
          <h3 className={`text-sm font-medium ${iconColor} uppercase tracking-wide`}>
            Initial Populations
          </h3>
          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-sm mb-2">
                <span>N₁₀ ({modelType === 'predator-prey' ? 'Prey' : 'Species 1'})</span>
                <span className="font-mono">{parameters.N1_0}</span>
              </label>
              <Slider
                value={[parameters.N1_0]}
                onValueChange={(value) => onParameterChange('N1_0', value[0])}
                min={RANGES.initial.min}
                max={RANGES.initial.max}
                step={RANGES.initial.step}
                className="w-full"
              />
            </div>
            <div>
              <label className="flex justify-between text-sm mb-2">
                <span>N₂₀ ({modelType === 'predator-prey' ? 'Predator' : 'Species 2'})</span>
                <span className="font-mono">{parameters.N2_0}</span>
              </label>
              <Slider
                value={[parameters.N2_0]}
                onValueChange={(value) => onParameterChange('N2_0', value[0])}
                min={RANGES.initial.min}
                max={RANGES.initial.max}
                step={RANGES.initial.step}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(SimulationControls);
