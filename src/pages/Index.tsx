import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import HistoricalTimeline from "@/components/HistoricalTimeline";
import MathematicalFoundations from "@/components/MathematicalFoundations";
import EnhancedSimulation from "@/components/EnhancedSimulation";
import LearningResources from "@/components/LearningResources";
import EquationDisplay from "@/components/EquationDisplay";
import { BookOpen, Calculator, TrendingUp, GraduationCap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="bg-gradient-hero text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Lotka-Volterra Competition Explorer
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Comprehensive educational platform for learning species competition dynamics through 
            interactive simulations, historical context, and mathematical foundations
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="simulate" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="simulate" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Simulate</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Learn Math</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Resources</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simulate" className="space-y-8">
            <EnhancedSimulation />
            <EquationDisplay />
          </TabsContent>

          <TabsContent value="learn" className="space-y-8">
            <MathematicalFoundations />
          </TabsContent>

          <TabsContent value="history" className="space-y-8">
            <HistoricalTimeline />
          </TabsContent>

          <TabsContent value="resources" className="space-y-8">
            <LearningResources />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">
            Educational tool for exploring species competition dynamics through mathematical modeling
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
