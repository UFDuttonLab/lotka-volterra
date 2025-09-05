import { Card } from "@/components/ui/card";

interface CompetitionLegendData {
  coexistencePossible: boolean;
}

interface DiagramLegendProps {
  type: 'competition' | 'predator-prey';
  competition?: CompetitionLegendData;
}

export default function DiagramLegend({ type, competition }: DiagramLegendProps) {
  return (
    <Card className="w-full p-3 mt-3 bg-background/50 border border-border/50">
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-semibold text-foreground mb-1">Legend</h4>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-primary"></div>
            <span className="text-foreground">
              {type === 'competition' ? 'Species 1' : 'Prey'} nullcline
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-secondary"></div>
            <span className="text-foreground">
              {type === 'competition' ? 'Species 2' : 'Predator'} nullcline
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-destructive rounded-full"></div>
            <span className="text-foreground">Equilibrium point</span>
          </div>
          
          {/* Show flow direction only for predator-prey or competition with coexistence */}
          {(type === 'predator-prey' || (type === 'competition' && competition?.coexistencePossible)) && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <div className="w-3 h-0.5 bg-primary"></div>
                <div className="w-0 h-0 border-l-2 border-l-primary border-t border-t-transparent border-b border-b-transparent ml-0.5"></div>
              </div>
              <span className="text-foreground">Flow direction</span>
            </div>
          )}
        </div>
        
        {type === 'competition' && (
          <div className="flex items-center justify-between mt-1 pt-2 border-t border-border/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary/70 rounded-full"></div>
              <span className="text-foreground text-xs">Carrying capacity</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {competition?.coexistencePossible ? '✓ Coexistence' : '⚠ Exclusion'}
            </span>
          </div>
        )}
        
        {type === 'predator-prey' && (
          <div className="mt-1 pt-2 border-t border-border/30">
            <span className="text-xs text-muted-foreground">
              ✓ Oscillatory dynamics
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}