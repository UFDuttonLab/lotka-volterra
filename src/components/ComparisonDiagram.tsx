import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IsoclineDiagram from "./IsoclineDiagram";

interface CompetitionParameters {
  r1: number;
  r2: number;
  K1: number;
  K2: number;
  a12: number;
  a21: number;
  N1_0: number;
  N2_0: number;
}

interface PredatorPreyParameters {
  r1: number;
  r2: number;
  a: number;
  b: number;
  N1_0: number;
  N2_0: number;
}

interface ComparisonDiagramProps {
  parameters?: CompetitionParameters & PredatorPreyParameters;
}

export default function ComparisonDiagram({ parameters }: ComparisonDiagramProps) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Visual Comparison: Isocline Geometry</span>
          <Badge variant="outline" className="text-xs">Interactive</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="side-by-side" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
            <TabsTrigger value="overlay">Key Differences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="side-by-side" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <IsoclineDiagram type="competition" parameters={parameters} />
              <IsoclineDiagram type="predator-prey" parameters={parameters} />
            </div>
          </TabsContent>
          
          <TabsContent value="overlay" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-primary">Competition Model</h3>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-accent">Geometry:</h4>
                    <p className="text-muted-foreground">Two diagonal lines with negative slopes</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-secondary">Flow Pattern:</h4>
                    <p className="text-muted-foreground">Converging flows → equilibrium or exclusion</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-destructive">Outcome:</h4>
                    <p className="text-muted-foreground">Stable coexistence OR competitive exclusion</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-foreground">Equations:</h4>
                    <p className="text-muted-foreground font-mono text-xs">
                      N₁ = {parameters ? `${parameters.K1.toFixed(0)} - ${parameters.a12.toFixed(1)}N₂` : 'K₁ - α₁₂N₂'}<br/>
                      N₂ = {parameters ? `${parameters.K2.toFixed(0)} - ${parameters.a21.toFixed(1)}N₁` : 'K₂ - α₂₁N₁'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-primary">Predator-Prey Model</h3>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-accent">Geometry:</h4>
                    <p className="text-muted-foreground">Perpendicular lines (horizontal + vertical)</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-secondary">Flow Pattern:</h4>
                    <p className="text-muted-foreground">Circular flows → closed orbits (cycles)</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-destructive">Outcome:</h4>
                    <p className="text-muted-foreground">Persistent oscillations around equilibrium</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-foreground">Equations:</h4>
                    <p className="text-muted-foreground font-mono text-xs">
                      N₂ = {parameters ? `${(parameters.r1/parameters.a).toFixed(1)}` : 'r₁/a'} (horizontal)<br/>
                      N₁ = {parameters ? `${(parameters.r2/parameters.b).toFixed(1)}` : 'r₂/b'} (vertical)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border">
              <h4 className="font-semibold text-foreground mb-2">Why This Difference Matters:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Competition:</strong> Species fight for the same resources → one wins or they share</li>
                <li>• <strong>Predator-Prey:</strong> Species depend on each other → creates natural cycles</li>
                <li>• <strong>Stability:</strong> Competition reaches fixed points; predator-prey maintains dynamic equilibrium</li>
                <li>• <strong>Real World:</strong> Both patterns common in nature, understanding helps predict outcomes</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}