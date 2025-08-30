import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedSimulation from "@/components/EnhancedSimulation";
import MathematicalFoundations from "@/components/MathematicalFoundations";
import HistoricalTimeline from "@/components/HistoricalTimeline";
import LearningResources from "@/components/LearningResources";
import EquationDisplay from "@/components/EquationDisplay";
import { useLotkaVolterra } from "@/hooks/useLotkaVolterra";
import { Calculator, History, BookOpen, Activity } from "lucide-react";

export default function Index() {
  const { modelType, switchModel } = useLotkaVolterra();

  return (
    <div className="min-h-screen bg-gradient-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Lotka-Volterra Model Explorer
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the mathematical beauty of ecological dynamics through interactive simulations
            of both competition and predator-prey models, with historical insights and comprehensive educational resources.
          </p>
        </div>

        {/* Model Equation Display */}
        <EquationDisplay modelType={modelType} onModelChange={switchModel} />

        {/* Main Navigation */}
        <Tabs defaultValue="simulate" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="simulate" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Simulate</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Learn Math</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Resources</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simulate" className="mt-8">
            <EnhancedSimulation />
          </TabsContent>

          <TabsContent value="learn" className="mt-8">
            <MathematicalFoundations />
          </TabsContent>

          <TabsContent value="history" className="mt-8">
            <HistoricalTimeline />
          </TabsContent>

          <TabsContent value="resources" className="mt-8">
            <LearningResources />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Educational tool for exploring ecological dynamics through mathematical modeling
          </p>
        </footer>
      </div>
    </div>
  );
}