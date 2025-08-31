import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ArrowRightLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EquationDisplayProps {
  modelType: "competition" | "predator-prey";
  onModelChange: (model: "competition" | "predator-prey") => void;
}

export default function EquationDisplay({ modelType, onModelChange }: EquationDisplayProps) {
  // Define color themes based on model type
  const isCompetition = modelType === 'competition';
  const cardBg = isCompetition ? 'bg-green-50/50' : 'bg-blue-50/50';
  const equationBg = isCompetition ? 'bg-green-100/30' : 'bg-blue-100/30';
  const badgeColor = isCompetition ? 'bg-green-100 text-green-800 border-green-200' : 'bg-blue-100 text-blue-800 border-blue-200';
  const switchButtonColor = isCompetition ? 'hover:bg-blue-50 hover:border-blue-200' : 'hover:bg-green-50 hover:border-green-200';
  
  return (
    <Card className={`w-full shadow-card ${cardBg}`}>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Lotka-Volterra {modelType === 'competition' ? 'Competition' : 'Predator-Prey'} Equations
            <Badge className={`text-xs ${badgeColor}`}>
              {modelType === 'competition' ? 'Competition Model' : 'Predator-Prey Model'}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={16} className="text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mathematical model for {modelType === 'competition' ? 'species competition' : 'predator-prey'} dynamics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onModelChange(modelType === 'competition' ? 'predator-prey' : 'competition')}
            className={`flex items-center gap-2 ${switchButtonColor}`}
          >
            <ArrowRightLeft size={14} />
            Switch to {modelType === 'competition' ? 'Predator-Prey' : 'Competition'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Equations */}
        <div className={`${equationBg} p-4 rounded-lg border`}>
          <div className="text-center space-y-3">
            {modelType === 'competition' ? (
              <>
                <div className="math-formula unicode-math text-base">
                  dN₁/dt = r₁N₁(1 - (N₁ + α₁₂N₂)/K₁)
                </div>
                <div className="math-formula unicode-math text-base">
                  dN₂/dt = r₂N₂(1 - (N₂ + α₂₁N₁)/K₂)
                </div>
              </>
            ) : (
              <>
                <div className="math-formula unicode-math text-base">
                  dN₁/dt = r₁N₁ - aN₁N₂
                </div>
                <div className="math-formula unicode-math text-base">
                  dN₂/dt = -r₂N₂ + bN₁N₂
                </div>
              </>
            )}
          </div>
        </div>

        {/* Parameter Definitions */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Parameter Definitions
          </h3>
          <div className="grid gap-2 text-sm">
            {modelType === 'competition' ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="math-formula unicode-math">N₁, N₂</span>
                  <span className="text-muted-foreground">Population sizes of competing species</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="math-formula unicode-math">r₁, r₂</span>
                  <span className="text-muted-foreground">Intrinsic growth rates</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="math-formula unicode-math">K₁, K₂</span>
                  <span className="text-muted-foreground">Carrying capacities</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="math-formula unicode-math">α₁₂</span>
                  <span className="text-muted-foreground">Effect of species 2 on species 1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="math-formula unicode-math">α₂₁</span>
                  <span className="text-muted-foreground">Effect of species 1 on species 2</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="math-formula unicode-math">N₁</span>
                  <span className="text-muted-foreground">Prey population size</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="math-formula unicode-math">N₂</span>
                  <span className="text-muted-foreground">Predator population size</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="math-formula unicode-math">r₁</span>
                  <span className="text-muted-foreground">Prey intrinsic growth rate</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="math-formula unicode-math">r₂</span>
                  <span className="text-muted-foreground">Predator death rate</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="math-formula unicode-math">a</span>
                  <span className="text-muted-foreground">Predation rate (capture efficiency)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="math-formula unicode-math">b</span>
                  <span className="text-muted-foreground">Predator efficiency (conversion rate)</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Model Outcomes */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {modelType === 'competition' ? 'Possible Outcomes' : 'Expected Behavior'}
          </h3>
          <div className="space-y-2 text-sm">
            {modelType === 'competition' ? (
              <>
                <div className="p-2 bg-green-100/40 rounded border-l-4 border-green-500">
                  <strong>Coexistence:</strong> Both species survive when competition is weak
                </div>
                <div className="p-2 bg-green-100/40 rounded border-l-4 border-green-600">
                  <strong>Competitive Exclusion:</strong> One species outcompetes the other
                </div>
                <div className="p-2 bg-green-100/40 rounded border-l-4 border-green-700">
                  <strong>Bistability:</strong> Outcome depends on initial conditions
                </div>
              </>
            ) : (
              <>
                <div className="p-2 bg-blue-100/40 rounded border-l-4 border-blue-500">
                  <strong>Cyclical Oscillations:</strong> Populations cycle in periodic orbits
                </div>
                <div className="p-2 bg-blue-100/40 rounded border-l-4 border-blue-600">
                  <strong>Phase Relationships:</strong> Predator peaks follow prey peaks
                </div>
                <div className="p-2 bg-blue-100/40 rounded border-l-4 border-blue-700">
                  <strong>Conservation:</strong> <span className="math-formula unicode-math">Total energy H = b·N₁ - r₂·ln(N₁) + a·N₂ - r₁·ln(N₂) is conserved</span>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}