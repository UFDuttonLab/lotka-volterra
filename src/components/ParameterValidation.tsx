import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

type ModelType = 'competition' | 'predator-prey';

interface Parameters {
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
}

interface ParameterValidationProps {
  modelType: ModelType;
  parameters: Parameters;
  populationWarnings?: {
    nearExtinction: boolean;
    attoFoxProblem?: boolean;
  };
  currentPopulations?: { N1: number; N2: number };
}

export default function ParameterValidation({
  modelType,
  parameters,
  populationWarnings,
  currentPopulations,
}: ParameterValidationProps) {

  const validateParameters = () => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (modelType === 'predator-prey') {
      if (parameters.r1 > 2.0) {
        warnings.push(`Prey growth rate r₁ = ${parameters.r1.toFixed(2)} per time unit; most vertebrates fall below 2.0`);
      }
      if (parameters.r2 > 2.0) {
        warnings.push(`Predator death rate r₂ = ${parameters.r2.toFixed(2)} per time unit; this is unusually high mortality`);
      }
      if (parameters.r1 < 0.05) {
        warnings.push('Prey growth rate below 0.05; the cycle period will exceed 100 time units');
      }
      // a and b carry units of 1/(individual*time), so their absolute size is
      // set by the population scale and cannot be judged on its own. The ratio
      // b/a is dimensionless: it is the number of predators produced per prey
      // consumed, and trophic transfer keeps it well below 1.
      if (parameters.a > 0 && parameters.b / parameters.a > 1) {
        errors.push(`Conversion ratio b/a = ${(parameters.b / parameters.a).toFixed(2)} implies more than one predator produced per prey consumed`);
      } else if (parameters.a > 0 && parameters.b / parameters.a > 0.5) {
        warnings.push(`Conversion ratio b/a = ${(parameters.b / parameters.a).toFixed(2)}; measured trophic transfer is usually near 0.1`);
      }
      if (parameters.r1 > 20) {
        errors.push('Prey growth rate exceeds bacterial rates');
      }
    } else {
      if (parameters.r1 > 2.0 || parameters.r2 > 2.0) {
        warnings.push('Growth rate above 2.0 per time unit; most organisms fall below this');
      }
      if (parameters.K1 < 10 || parameters.K2 < 10) {
        warnings.push('Carrying capacity below 10 individuals');
      }
      if (parameters.a12 > 2.0 || parameters.a21 > 2.0) {
        warnings.push('Competition coefficient above 2.0; interspecific competition is more than twice intraspecific');
      }
      if (parameters.r1 > 10 || parameters.r2 > 10) {
        errors.push('Growth rate above 10 per time unit');
      }
    }

    if (currentPopulations) {
      const FRACTIONAL_THRESHOLD = 1.0;

      if (currentPopulations.N1 > 0 && currentPopulations.N1 < FRACTIONAL_THRESHOLD) {
        warnings.push('Prey population below 1 individual, the atto-fox problem');
      }
      if (currentPopulations.N2 > 0 && currentPopulations.N2 < FRACTIONAL_THRESHOLD) {
        warnings.push('Predator population below 1 individual, the atto-fox problem');
      }
      if (currentPopulations.N1 <= 0 || currentPopulations.N2 <= 0) {
        errors.push('A population has reached zero, which is absorbing in this model');
      }
    }

    return { warnings, errors };
  };

  const validation = validateParameters();
  const hasWarnings = validation.warnings.length > 0;
  const hasErrors = validation.errors.length > 0 || Boolean(populationWarnings?.nearExtinction);

  const getValidationStatus = () => {
    if (hasErrors) return { type: 'error', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle };
    if (hasWarnings) return { type: 'warning', color: 'bg-warning-light text-warning border-warning/20', icon: AlertTriangle };
    return { type: 'good', color: 'bg-success-light text-success border-success/20', icon: CheckCircle };
  };

  const status = getValidationStatus();
  const Icon = status.icon;

  const allWarnings = validation.warnings;
  const allErrors = validation.errors;

  return (
    <div className="space-y-3">
      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <Badge className={`${status.color} border flex items-center gap-1 text-xs`}>
          <Icon className="h-3 w-3" />
          {status.type === 'good' && 'Biologically Realistic'}
          {status.type === 'warning' && 'Borderline Realistic'}
          {status.type === 'error' && 'Unrealistic Parameters'}
        </Badge>
      </div>

      {/* Error Messages */}
      {allErrors.length > 0 && (
        <Alert className="border-destructive/50 bg-destructive/5">
          <XCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-sm">
            <div className="space-y-1">
              <div className="font-medium text-destructive">Critical Issues:</div>
              {allErrors.map((error, index) => (
                <div key={index} className="text-destructive/80">&bull; {error}</div>
              ))}
              {populationWarnings?.nearExtinction && (
                <div className="text-xs text-muted-foreground mt-2">
                  A population at zero cannot recover in this model, and a real one at that density would face genetic bottlenecks and demographic stochasticity.
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Warning Messages */}
      {allWarnings.length > 0 && !hasErrors && (
        <Alert className="border-warning/50 bg-warning-light">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-sm">
            <div className="space-y-1">
              <div className="font-medium text-warning">Parameter Warnings:</div>
              {allWarnings.map((warning, index) => (
                <div key={index} className="text-warning/80">&bull; {warning}</div>
              ))}
              <div className="text-xs text-warning/70 mt-2">
                These parameters are mathematically valid and will run; they sit outside commonly measured ranges.
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Biological Context */}
      {status.type === 'good' && (
        <Alert className="border-success/50 bg-success-light">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertDescription className="text-sm text-success">
            Parameters sit within commonly measured ranges for these quantities.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
