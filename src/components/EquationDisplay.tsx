import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function EquationDisplay() {
  return (
    <Card className="w-full shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Lotka-Volterra Competition Equations
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Mathematical model for species competition dynamics</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Equations */}
        <div className="bg-muted/30 p-4 rounded-lg border">
          <div className="text-center space-y-3">
            <div className="text-base font-mono">
              dN₁/dt = r₁N₁(1 - (N₁ + α₁₂N₂)/K₁)
            </div>
            <div className="text-base font-mono">
              dN₂/dt = r₂N₂(1 - (N₂ + α₂₁N₁)/K₂)
            </div>
          </div>
        </div>

        {/* Parameter Definitions */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Parameter Definitions
          </h3>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="font-mono">N₁, N₂</span>
              <span className="text-muted-foreground">Population sizes of species 1 and 2</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">r₁, r₂</span>
              <span className="text-muted-foreground">Intrinsic growth rates</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">K₁, K₂</span>
              <span className="text-muted-foreground">Carrying capacities</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">α₁₂</span>
              <span className="text-muted-foreground">Effect of species 2 on species 1</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">α₂₁</span>
              <span className="text-muted-foreground">Effect of species 1 on species 2</span>
            </div>
          </div>
        </div>

        {/* Competition Outcomes */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Possible Outcomes
          </h3>
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-primary/10 rounded border-l-4 border-primary">
              <strong>Coexistence:</strong> Both species survive when competition is weak
            </div>
            <div className="p-2 bg-secondary/10 rounded border-l-4 border-secondary">
              <strong>Competitive Exclusion:</strong> One species outcompetes the other
            </div>
            <div className="p-2 bg-accent/10 rounded border-l-4 border-accent">
              <strong>Bistability:</strong> Outcome depends on initial conditions
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}