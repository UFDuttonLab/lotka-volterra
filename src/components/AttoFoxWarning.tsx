import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface AttoFoxWarningProps {
  currentPopulations: { N1: number; N2: number };
  modelType: 'predator-prey' | 'competition';
}

export default function AttoFoxWarning({ currentPopulations, modelType }: AttoFoxWarningProps) {
  const FRACTIONAL_THRESHOLD = 1.0;
  const hasFractionalPopulations = currentPopulations.N1 < FRACTIONAL_THRESHOLD || currentPopulations.N2 < FRACTIONAL_THRESHOLD;

  if (!hasFractionalPopulations || modelType !== 'predator-prey') {
    return null;
  }

  return (
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
            Current populations: {modelType === 'predator-prey' ? 'Prey' : 'Species 1'}: {currentPopulations.N1.toFixed(3)}, 
            {modelType === 'predator-prey' ? 'Predator' : 'Species 2'}: {currentPopulations.N2.toFixed(3)}
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
}