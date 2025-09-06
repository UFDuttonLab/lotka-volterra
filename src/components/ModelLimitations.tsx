import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ChevronDown, BookOpen, Bug, TrendingDown } from "lucide-react";
import { useState } from "react";

type ModelType = 'competition' | 'predator-prey';

interface ModelLimitationsProps {
  modelType: ModelType;
  currentPopulations?: { N1: number; N2: number };
}

export default function ModelLimitations({ modelType, currentPopulations }: ModelLimitationsProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Check for Atto-Fox Problem (predator-prey only)
  const FRACTIONAL_THRESHOLD = 1.0;
  const hasAttoFoxProblem = modelType === 'predator-prey' && currentPopulations && 
    (currentPopulations.N1 < FRACTIONAL_THRESHOLD || currentPopulations.N2 < FRACTIONAL_THRESHOLD);

  const checkBiologicalRealism = () => {
    const issues: string[] = [];
    
    if (currentPopulations) {
      // Check for fractional individuals
      const hasFractionalN1 = currentPopulations.N1 % 1 !== 0 && currentPopulations.N1 > 0.001;
      const hasFractionalN2 = currentPopulations.N2 % 1 !== 0 && currentPopulations.N2 > 0.001;
      
      if (hasFractionalN1 || hasFractionalN2) {
        issues.push(`Model predicts ${currentPopulations.N1.toFixed(2)} and ${currentPopulations.N2.toFixed(2)} individuals - fractional organisms don't exist`);
      }

      // Check for very small populations
      if (currentPopulations.N1 < 50 && currentPopulations.N1 > 0.001) {
        issues.push('Population 1 below minimum viable size (~50-100 individuals)');
      }
      if (currentPopulations.N2 < 50 && currentPopulations.N2 > 0.001) {
        issues.push('Population 2 below minimum viable size (~50-100 individuals)');
      }
    }

    return issues;
  };

  const realismIssues = checkBiologicalRealism();

  return (
    <div className="space-y-4">
      {/* Atto-Fox Problem Alert (always visible when active) */}
      {hasAttoFoxProblem && (
        <Alert className="border-destructive bg-destructive/10 shadow-lg">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertDescription className="text-sm">
            <div className="space-y-2">
              <div className="font-semibold text-destructive text-base">
                ⚠️ "Atto-Fox Problem" Detected
              </div>
              <p className="text-destructive/90 leading-relaxed">
                <strong>Warning:</strong> This continuous model can predict fractional organisms (e.g., 0.001 foxes), which is biologically impossible. 
                In reality, populations below 1-10 individuals face extinction from demographic stochasticity.
              </p>
              <div className="text-xs text-destructive/80 bg-destructive/5 p-3 rounded border">
                <p className="mb-1"><strong>Why this matters:</strong></p>
                <p>• The model assumes infinite population divisibility, which breaks down at low densities</p>
                <p>• Real populations need minimum viable sizes (50-500 individuals) to avoid genetic bottlenecks</p>
                <p>• Demographic randomness can cause extinction even when the model predicts recovery</p>
              </div>
              <p className="text-xs text-destructive/70 italic">
                Current populations: Prey: {currentPopulations?.N1.toFixed(3)}, 
                Predator: {currentPopulations?.N2.toFixed(3)}
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card className="shadow-card">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-lg">⚠️ Model Limitations & Reality Check</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {realismIssues.length > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    {realismIssues.length} Issue{realismIssues.length > 1 ? 's' : ''}
                  </Badge>
                )}
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
            <CardDescription>
              Understanding when and why the {modelType === 'predator-prey' ? 'Lotka-Volterra' : 'logistic competition'} model breaks down
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            
            {/* Current Realism Issues */}
            {realismIssues.length > 0 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <Bug className="h-4 w-4 text-yellow-600" />
                <AlertDescription>
                  <div className="font-medium text-yellow-800 mb-2">Current Biological Realism Issues:</div>
                  {realismIssues.map((issue, index) => (
                    <div key={index} className="text-yellow-700 text-sm">• {issue}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            {/* Core Mathematical Limitations */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-primary" />
                <h4 className="font-semibold">Fundamental Mathematical Assumptions</h4>
              </div>

              <div className="grid gap-4">
                <Alert className="border-muted">
                  <AlertDescription className="text-sm space-y-2">
                    <div className="font-medium">🔢 Continuous Population Model</div>
                    <div>This model assumes populations can be fractional (e.g., 0.23 rabbits), which is mathematically convenient but biologically impossible. Real populations are discrete individuals.</div>
                    <div className="text-muted-foreground text-xs">
                      <strong>Reality:</strong> Population changes happen through birth/death events of whole individuals, not smooth continuous changes.
                    </div>
                  </AlertDescription>
                </Alert>

                <Alert className="border-muted">
                  <AlertDescription className="text-sm space-y-2">
                    <div className="font-medium">♾️ Infinite Population Divisibility</div>
                    <div>The model assumes populations can be infinitely subdivided and that reproduction is continuous rather than discrete generational events.</div>
                    <div className="text-muted-foreground text-xs">
                      <strong>Reality:</strong> Most species have seasonal reproduction, discrete generations, and minimum reproductive units.
                    </div>
                  </AlertDescription>
                </Alert>

                <Alert className="border-muted">
                  <AlertDescription className="text-sm space-y-2">
                    <div className="font-medium">🎯 No Environmental Stochasticity</div>
                    <div>The model is completely deterministic - no random environmental variations, disease outbreaks, or chance events that affect real populations.</div>
                    <div className="text-muted-foreground text-xs">
                      <strong>Reality:</strong> Weather, disease, random mortality, and environmental changes create unpredictable population fluctuations.
                    </div>
                  </AlertDescription>
                </Alert>

                {modelType === 'predator-prey' && (
                  <Alert className="border-muted">
                    <AlertDescription className="text-sm space-y-2">
                      <div className="font-medium">🔄 Perfect Neutral Stability</div>
                      <div>Lotka-Volterra predator-prey creates perfect neutral cycles - any disturbance creates a new permanent cycle. Real systems are rarely this perfectly balanced.</div>
                      <div className="text-muted-foreground text-xs">
                        <strong>Reality:</strong> Most predator-prey systems have some form of damping or driving that makes cycles either decay to equilibrium or grow unstable.
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {modelType === 'competition' && (
                  <Alert className="border-muted">
                    <AlertDescription className="text-sm space-y-2">
                      <div className="font-medium">📈 Logistic Growth Assumption</div>
                      <div>This competition model uses logistic growth, which assumes carrying capacity is fixed and competition is symmetric. Real competition is often more complex.</div>
                      <div className="text-muted-foreground text-xs">
                        <strong>Note:</strong> This is actually the more realistic "logistic competition model," not the original 1925 Lotka-Volterra competition equations.
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            {/* Extinction and Small Population Effects */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="h-4 w-4 text-destructive" />
                <h4 className="font-semibold">Small Population & Extinction Reality</h4>
              </div>

              <Alert className="border-destructive/50 bg-destructive/5">
                <AlertDescription className="text-sm space-y-2">
                  <div className="font-medium text-destructive">Critical Population Thresholds</div>
                  <div>Populations below ~50-100 individuals face extinction risk from:</div>
                  <ul className="list-disc list-inside space-y-1 text-destructive/80 ml-2">
                    <li><strong>Genetic bottlenecks:</strong> Inbreeding reduces fitness</li>
                    <li><strong>Demographic stochasticity:</strong> Random birth/death events can eliminate small populations</li>
                    <li><strong>Environmental stochasticity:</strong> Bad weather years can wipe out small populations</li>
                    <li><strong>Allee effects:</strong> Reduced reproduction at low densities (mate finding, cooperative behaviors)</li>
                  </ul>
                  <div className="text-destructive/90 font-medium mt-2">
                    ⚠️ <strong>Model Limitation:</strong> This model assumes populations can recover from ANY positive number, even 0.001 individuals. In reality, populations below minimum viable size go extinct permanently.
                  </div>
                </AlertDescription>
              </Alert>
            </div>

            {/* When to Trust the Model */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <span className="text-green-600">✓</span> When Model Predictions Are Trustworthy
              </h4>
              
              <div className="text-sm space-y-2 bg-green-50 p-3 rounded-lg border border-green-200">
                <div>• <strong>Large populations</strong> (&gt;1000 individuals) where stochastic effects are minimal</div>
                <div>• <strong>Short-term dynamics</strong> before environmental changes accumulate</div>
                <div>• <strong>Qualitative trends</strong> rather than exact quantitative predictions</div>
                <div>• <strong>Educational purposes</strong> to understand basic ecological principles</div>
                <div>• <strong>System comparison</strong> - understanding relative effects of different parameters</div>
              </div>

              <h4 className="font-semibold flex items-center gap-2">
                <span className="text-red-600">✗</span> When Model Predictions Are Questionable
              </h4>
              
              <div className="text-sm space-y-2 bg-red-50 p-3 rounded-lg border border-red-200">
                <div>• <strong>Very small populations</strong> (&lt;100 individuals)</div>
                <div>• <strong>Long-term predictions</strong> where environmental changes matter</div>
                <div>• <strong>Exact quantitative forecasts</strong> - use for patterns, not precise numbers</div>
                <div>• <strong>Systems with strong stochasticity</strong> (variable environments, disease outbreaks)</div>
                <div>• <strong>Species with complex life cycles</strong> (metamorphosis, dormancy, migration)</div>
              </div>
            </div>

            {/* Real World Examples */}
            <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded">
              <div className="font-medium mb-2">🌍 Real World Comparison:</div>
              {modelType === 'predator-prey' ? (
                <div>The famous lynx-hare cycles in Canada show Lotka-Volterra-like oscillations, but with much more variability due to weather, disease, and other predators. The 10-year cycles are real, but amplitude and timing vary significantly from model predictions.</div>
              ) : (
                <div>Competitive exclusion is commonly observed (like Paramecium species in lab cultures), but coexistence is also common in nature due to spatial heterogeneity, temporal variation, and niche differentiation not captured in this simple model.</div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
    </div>
  );
}