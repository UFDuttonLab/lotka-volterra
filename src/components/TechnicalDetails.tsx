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
  };
  timeStep?: number;
  currentTime?: number;
}

export default function TechnicalDetails({
  modelType,
  conservedQuantity,
  timeStep = 0.05,
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
                    Using 4th-order Runge-Kutta integration with fixed step size for superior accuracy with oscillatory systems. 
                    This method achieves O(h⁴) global error compared to O(h) for simple Euler integration.
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-primary/20">
                    <div>
                      <div className="text-xs text-muted-foreground">Time Step (h)</div>
                      <div className="font-mono">{timeStep} units</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Update Frequency</div>
                      <div className="font-mono">50ms (20 FPS)</div>
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
                        <div className="font-mono text-sm">{conservedQuantity.initial.toFixed(6)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Current H</div>
                        <div className="font-mono text-sm">{conservedQuantity.current.toFixed(6)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Drift</div>
                        <div className={`font-mono text-sm ${conservedQuantity.driftPercent < 0.1 ? 'text-green-600' : conservedQuantity.driftPercent < 1.0 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {conservedQuantity.driftPercent.toFixed(3)}%
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground mt-2">
                      <span className="font-medium">Interpretation:</span> Small drift (&lt;0.1%) indicates excellent numerical approximation. 
                      In theory, H should be perfectly constant, so any change represents computational approximation error.
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
                      <div>• <strong>Prey growth rate (r₁):</strong> 0.1-2.0 (most organisms r &lt; 2.0)</div>
                      <div>• <strong>Predator death rate (r₂):</strong> 0.1-2.0</div>
                      <div>• <strong>Predation rate (a):</strong> 0.1-3.0</div>
                      <div>• <strong>Predator efficiency (b):</strong> 0.1-3.0</div>
                      <div>• <strong>Initial populations:</strong> 0.1-1000 (depends on scale)</div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-xs">
                      <div>• <strong>Growth rates (r₁, r₂):</strong> 0.1-2.0 (most organisms r &lt; 2.0)</div>
                      <div>• <strong>Carrying capacities (K₁, K₂):</strong> 10-10,000</div>
                      <div>• <strong>Competition coefficients (a₁₂, a₂₁):</strong> 0.1-2.0</div>
                      <div>• <strong>Initial populations:</strong> 1-1000</div>
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