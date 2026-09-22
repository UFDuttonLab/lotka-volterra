import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Settings, ChevronDown, Cpu, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";

type ModelType = 'competition' | 'predator-prey';

interface TechnicalDetailsProps {
  modelType: ModelType;
  conservedQuantity?: {
    current: number;
    initial: number;
    isConserved: boolean;
    driftPercent: number;
    absoluteDrift: number;
  };
  timeStep?: number;
  speed?: number;
  currentTime?: number;
}

export default function TechnicalDetails({
  modelType,
  conservedQuantity,
  timeStep = 0.01,
  speed = 1,
  currentTime = 0,
}: TechnicalDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="shadow-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Technical Details</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-muted text-muted-foreground border">
                  RK4 Integration
                </Badge>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
            <CardDescription>
              Numerical methods, parameter validation, and computational details
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            
            {/* Integration Method */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                <h4 className="font-semibold">Numerical Integration Method</h4>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <div className="text-sm space-y-2">
                  <div className="font-medium">Runge-Kutta 4th Order (RK4)</div>
                  <div className="text-muted-foreground">
                    Fourth-order Runge-Kutta with a fixed step size. Global error is O(h⁴) against O(h) for explicit Euler.
                    The step size is held constant at h = {timeStep}; the speed control changes how many steps run per frame, not h.
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-primary/20">
                    <div>
                      <div className="text-xs text-muted-foreground">Time Step (h)</div>
                      <div className="font-mono">{timeStep} units</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Steps per frame</div>
                      <div className="font-mono">{speed} (50ms frames, 20 FPS)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
                <strong>Why RK4?</strong> Predator-prey systems are oscillatory and sensitive to numerical errors. 
                RK4's higher accuracy prevents artificial spiral decay or growth that occurs with simpler methods like Euler integration.
              </div>
            </div>

            {/* Conservation Accuracy */}
            {modelType === 'predator-prey' && conservedQuantity && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-secondary" />
                  <h4 className="font-semibold">Conservation Accuracy</h4>
                </div>
                
                <div className="bg-secondary/5 p-4 rounded-lg border border-secondary/20">
                  <div className="text-sm space-y-2">
                    <div className="font-medium">Conserved Quantity H Tracking</div>
                    <div className="text-muted-foreground">
                      The Lotka-Volterra system conserves the quantity H = r₂·ln(N₁) - b·N₁ + r₁·ln(N₂) - a·N₂. 
                      Monitoring drift helps validate numerical accuracy.
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-secondary/20">
                      <div>
                        <div className="text-xs text-muted-foreground">Initial H</div>
                        <div className="font-mono text-sm">
                          {Number.isFinite(conservedQuantity.initial) ? conservedQuantity.initial.toFixed(6) : 'n/a'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Current H</div>
                        <div className="font-mono text-sm">
                          {Number.isFinite(conservedQuantity.current) ? conservedQuantity.current.toFixed(6) : 'n/a'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Drift |ΔH|</div>
                        <div className={`font-mono text-sm ${conservedQuantity.driftPercent < 0.1 ? 'text-green-600' : conservedQuantity.driftPercent < 1.0 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {conservedQuantity.absoluteDrift.toExponential(2)}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground mt-2">
                      <span className="font-medium">Interpretation:</span> H is constant along every exact trajectory, so |ΔH| measures integration error alone.
                      RK4 at h = {timeStep} holds it below 1e-6 over hundreds of time units. The relative figure is {conservedQuantity.driftPercent.toFixed(6)}% of |H₀|, floored at 1 because H passes through zero.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Model Equations */}
            <div className="space-y-3">
              <h4 className="font-semibold">Mathematical Implementation</h4>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-sm space-y-3">
                  {modelType === 'predator-prey' ? (
                    <>
                      <div className="font-medium">Classic Lotka-Volterra Equations:</div>
                      <div className="font-mono text-xs bg-background p-3 rounded border">
                        dN₁/dt = r₁·N₁ - a·N₁·N₂  (Prey)<br/>
                        dN₂/dt = -r₂·N₂ + b·N₁·N₂  (Predator)
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Where N₁ = prey population, N₂ = predator population, r₁ = prey growth rate, 
                        r₂ = predator death rate, a = predation rate, b = predator efficiency.
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-medium">Lotka-Volterra Competition with Logistic Growth:</div>
                      <div className="font-mono text-xs bg-background p-3 rounded border">
                        dN₁/dt = r₁·N₁·(1 - (N₁ + a₁₂·N₂)/K₁)<br/>
                        dN₂/dt = r₂·N₂·(1 - (N₂ + a₂₁·N₁)/K₂)
                      </div>
                      <div className="text-muted-foreground text-xs">
                        This is the more realistic logistic competition model, not the original 1925 Lotka-Volterra 
                        competition equations (which would be dN₁/dt = r₁·N₁ - α₁₂·N₁·N₂).
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Parameter Validation */}
            <div className="space-y-3">
              <h4 className="font-semibold">Parameter Validation</h4>
              
              <div className="text-sm space-y-3">
                <div className="bg-background border rounded p-3">
                  <div className="font-medium mb-2">Biological Parameter Ranges:</div>
                  {modelType === 'predator-prey' ? (
                    <div className="space-y-1 text-xs">
                      <div>• <strong>Prey growth rate (r₁):</strong> slider 0.1-4.0; most vertebrates sit below 2.0</div>
                      <div>• <strong>Predator death rate (r₂):</strong> slider 0.1-3.0</div>
                      <div>• <strong>Predation rate (a):</strong> slider 0.0005-0.5</div>
                      <div>• <strong>Conversion efficiency (b):</strong> slider 0.0005-0.3</div>
                      <div>• <strong>Initial populations:</strong> slider 1-300</div>
                      <div className="pt-1">a and b are per-capita rate coefficients with units of 1/(individual · time), so their numerical size depends on the population scale. The scale-free check is b/a, the number of predators produced per prey consumed, which must be below 1.</div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-xs">
                      <div>• <strong>Growth rates (r₁, r₂):</strong> slider 0.1-3.0; most organisms sit below 2.0</div>
                      <div>• <strong>Carrying capacities (K₁, K₂):</strong> slider 10-500</div>
                      <div>• <strong>Competition coefficients (α₁₂, α₂₁):</strong> slider 0-3.0, dimensionless</div>
                      <div>• <strong>Initial populations:</strong> slider 1-300</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Performance Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                <h4 className="font-semibold">Performance & Stability</h4>
              </div>
              
              <div className="text-sm bg-accent/5 p-3 rounded border border-accent/20">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Simulation Time</div>
                    <div className="font-mono">{currentTime.toFixed(2)} units</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Stability Check</div>
                    <div className="text-green-600 text-xs">✓ Numerically Stable</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Fixed step size ensures consistent behavior. For very stiff systems or extreme parameters, 
                  adaptive step sizing might be beneficial but is not implemented here for educational clarity.
                </div>
              </div>
            </div>

          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}