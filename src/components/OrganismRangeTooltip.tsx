import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

interface OrganismRange {
  name: string;
  min: number;
  max: number;
  color: string;
}

interface OrganismRangeTooltipProps {
  parameter: 'r' | 'a' | 'b';
  currentValue: number;
  children: React.ReactNode;
}

const getParameterRanges = (parameter: string): OrganismRange[] => {
  if (parameter === 'r') {
    return [
      { name: "Large mammals", min: 0.1, max: 1.0, color: "bg-green-100 text-green-800 border-green-300" },
      { name: "Small mammals", min: 1.0, max: 5.0, color: "bg-green-100 text-green-800 border-green-300" },
      { name: "Insects", min: 5.0, max: 20.0, color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
      { name: "Bacteria", min: 20.0, max: 50.0, color: "bg-red-100 text-red-800 border-red-300" },
    ];
  } else if (parameter === 'b') {
    return [
      { name: "Typical efficiency", min: 0.01, max: 0.2, color: "bg-green-100 text-green-800 border-green-300" },
      { name: "High efficiency", min: 0.2, max: 0.5, color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
      { name: "Unrealistic", min: 0.5, max: 1.0, color: "bg-red-100 text-red-800 border-red-300" },
    ];
  } else if (parameter === 'a') {
    return [
      { name: "Low predation", min: 0.001, max: 0.01, color: "bg-green-100 text-green-800 border-green-300" },
      { name: "Moderate predation", min: 0.01, max: 0.1, color: "bg-green-100 text-green-800 border-green-300" },
      { name: "High predation", min: 0.1, max: 0.5, color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
      { name: "Extreme predation", min: 0.5, max: 2.0, color: "bg-red-100 text-red-800 border-red-300" },
    ];
  }
  return [];
};

const getRangeColor = (value: number, ranges: OrganismRange[]): string => {
  for (const range of ranges) {
    if (value >= range.min && value <= range.max) {
      return range.color;
    }
  }
  return "bg-red-100 text-red-800 border-red-300"; // Default to unrealistic
};

export default function OrganismRangeTooltip({ parameter, currentValue, children }: OrganismRangeTooltipProps) {
  const ranges = getParameterRanges(parameter);
  const currentRangeColor = getRangeColor(currentValue, ranges);

  const getParameterDescription = (param: string) => {
    switch (param) {
      case 'r':
        return {
          title: "Growth Rate (r) - Biological Ranges",
          unit: "/year",
          description: "Intrinsic rate of population increase when resources are unlimited"
        };
      case 'a':
        return {
          title: "Predation Rate (a) - Hunting Efficiency", 
          unit: "prey consumed/predator/time",
          description: "Rate at which predators encounter and successfully capture prey"
        };
      case 'b':
        return {
          title: "Predation Efficiency (b) - Conversion Rate",
          unit: "predators/prey consumed", 
          description: "Efficiency of converting consumed prey into new predators (usually <20% due to 10% rule)"
        };
      default:
        return { title: "Parameter", unit: "", description: "" };
    }
  };

  const paramInfo = getParameterDescription(parameter);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 cursor-help">
            {children}
            <Info className="h-3 w-3 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-80 p-4" side="right">
          <div className="space-y-3">
            <div className="border-b pb-2">
              <h4 className="font-semibold text-sm">{paramInfo.title}</h4>
              <p className="text-xs text-muted-foreground">{paramInfo.description}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Current value:</span>
                <Badge className={`${currentRangeColor} border text-xs`}>
                  {currentValue.toFixed(3)}{paramInfo.unit}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-medium">Biological ranges:</p>
                {ranges.map((range, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{range.name}:</span>
                    <Badge className={`${range.color} border text-xs`}>
                      {range.min}-{range.max}{paramInfo.unit}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground pt-2 border-t">
              <span className="text-green-600">●</span> Typical range
              <span className="text-yellow-600 ml-3">●</span> Extreme but possible
              <span className="text-red-600 ml-3">●</span> Biologically unrealistic
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}