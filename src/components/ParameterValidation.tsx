import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

type ModelType = 'competition' | 'predator-prey';

interface Parameters {
  r1: number;
  r2: number;
  K1?: number;
  K2?: number;
  a12?: number;
  a21?: number;
  a?: number;
  b?: number;
  N1_0: number;
  N2_0: number;
}

interface ParameterValidationProps {
  modelType: ModelType;
  parameters: Parameters;
  populationWarnings?: {
    nearExtinction: boolean;
    unrealisticParameters: string[];
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
      // Predator-prey specific validation
      if (parameters.r1 > 2.0) warnings.push(`High prey growth rate (${parameters.r1.toFixed(2)}) - most organisms have r < 2.0`);
      if (parameters.r2 > 2.0) warnings.push(`High predator death rate (${parameters.r2.toFixed(2)})`);
      if (parameters.a! > 3.0) warnings.push(`Very high predation rate (${parameters.a!.toFixed(2)}) - may be unrealistic`);
      if (parameters.b! > 3.0) warnings.push(`Very high predator efficiency (${parameters.b!.toFixed(2)})`);
      
      if (parameters.r1 > 10) errors.push('Extremely unrealistic prey growth rate');
      if (parameters.a! > 10) errors.push('Impossible predation efficiency');
    } else {
      // Competition specific validation
      if (parameters.r1 > 2.0 || parameters.r2 > 2.0) {
        warnings.push('High growth rates - most organisms have r < 2.0');
      }
      if (parameters.K1! < 10 || parameters.K2! < 10) {
        warnings.push('Very low carrying capacities may lead to unrealistic dynamics');
      }
      if (parameters.a12! > 2.0 || parameters.a21! > 2.0) {
        warnings.push('Very strong competition - may lead to rapid exclusion');
      }
      
      if (parameters.r1 > 10 || parameters.r2 > 10) errors.push('Extremely unrealistic growth rates');
    }

    // Population-specific warnings
    if (currentPopulations?.N1 || currentPopulations?.N2) {
      const EXTINCTION_THRESHOLD = 0.001;
      if (currentPopulations.N1 <= EXTINCTION_THRESHOLD * 2 || currentPopulations.N2 <= EXTINCTION_THRESHOLD * 2) {
        errors.push('Population near extinction threshold - biologically unrealistic recovery');
      }
    }

    return { warnings, errors };
  };

  const validation = validateParameters();
  const hasWarnings = validation.warnings.length > 0 || (populationWarnings?.unrealisticParameters.length || 0) > 0;
  const hasErrors = validation.errors.length > 0 || populationWarnings?.nearExtinction;

  // Determine overall status
  const getValidationStatus = () => {
    if (hasErrors) return { type: 'error', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle };
    if (hasWarnings) return { type: 'warning', color: 'bg-warning-light text-warning border-warning/20', icon: AlertTriangle };
    return { type: 'good', color: 'bg-success-light text-success border-success/20', icon: CheckCircle };
  };

  const status = getValidationStatus();
  const Icon = status.icon;

  const allWarnings = [
    ...validation.warnings,
    ...(populationWarnings?.unrealisticParameters || [])
  ];

  const allErrors = [
    ...validation.errors,
    ...(populationWarnings?.nearExtinction ? ['⚠️ Population approaching extinction threshold - this is biologically unrealistic'] : [])
  ];

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
                <div key={index} className="text-destructive/80">• {error}</div>
              ))}
              {populationWarnings?.nearExtinction && (
                <div className="text-xs text-muted-foreground mt-2">
                  Real populations cannot recover from zero individuals due to genetic bottlenecks and stochastic effects.
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
                <div key={index} className="text-warning/80">• {warning}</div>
              ))}
              <div className="text-xs text-warning/70 mt-2">
                These parameters may lead to unrealistic dynamics but are mathematically valid.
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
            Parameters are within realistic biological ranges. The model predictions should be trustworthy for educational purposes.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}