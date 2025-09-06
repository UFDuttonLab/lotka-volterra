import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ParadoxCallout() {
  return (
    <Card className="border-amber-200 bg-amber-50/50 shadow-md">
      <CardContent className="pt-6">
        <Alert className="border-amber-300 bg-amber-100/50">
          <Lightbulb className="h-5 w-5 text-amber-600" />
          <AlertDescription>
            <div className="space-y-3">
              <div className="font-semibold text-amber-800 text-base flex items-center gap-2">
                🔄 Counter-intuitive Result: The Paradox of Enrichment
              </div>
              
              <div className="text-amber-900/90 space-y-2">
                <p className="leading-relaxed">
                  At equilibrium, <strong>prey density (N₁* = r₂/b) depends ONLY on predator parameters</strong>, 
                  while <strong>predator density (N₂* = r₁/a) depends ONLY on prey parameters</strong>.
                </p>
                
                <div className="bg-amber-100/70 p-3 rounded border border-amber-300/50">
                  <p className="text-sm font-medium text-amber-800 mb-1">This means:</p>
                  <p className="text-sm text-amber-800/90">
                    • Improving conditions for prey (increasing r₁) increases <em>predator</em> density but NOT prey density<br/>
                    • Making predators more efficient (increasing b) <em>decreases</em> prey density at equilibrium<br/>
                    • The "beneficiary" is often not who you'd expect!
                  </p>
                </div>
              </div>
              
              <div className="text-xs text-amber-700/80 italic">
                <strong>Biological example:</strong> Adding fertilizer to increase plant growth may actually decrease plant biomass at equilibrium 
                because it primarily supports more herbivores, which then consume the extra plant growth.
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}