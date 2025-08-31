import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedSimulation from "@/components/EnhancedSimulation";
import MathematicalFoundations from "@/components/MathematicalFoundations";
import HistoricalTimeline from "@/components/HistoricalTimeline";
import LearningResources from "@/components/LearningResources";
import ExercisesTab from "@/components/ExercisesTab";
import EquationDisplay from "@/components/EquationDisplay";
import ExerciseQuestionModal from "@/components/ExerciseQuestionModal";
import { useLotkaVolterra } from "@/hooks/useLotkaVolterra";
import { Calculator, History, BookOpen, Activity, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface ExerciseQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

export default function Index() {
  const hookValues = useLotkaVolterra();
  const { modelType, switchModel, setAllParameters } = hookValues;
  const [activeTab, setActiveTab] = useState("simulate");
  const [selectedExercise, setSelectedExercise] = useState<{
    title: string;
    description: string;
    difficulty: string;
    question: ExerciseQuestion;
  } | null>(null);
  const [activeExercise, setActiveExercise] = useState<{
    title: string;
    description: string;
    difficulty: string;
    question: ExerciseQuestion;
  } | null>(null);
  const { toast } = useToast();

  const handleLoadExercise = (
    exerciseParams: Partial<Parameters>,
    exerciseModel: ModelType,
    exerciseTitle: string
  ) => {
    // Switch to the correct model first
    if (modelType !== exerciseModel) {
      switchModel(exerciseModel);
    }
    
    // Load the exercise parameters
    setAllParameters(exerciseParams);
    
    // Switch to simulation tab
    setActiveTab("simulate");
    
    // Show toast notification
    toast({
      title: "Exercise Loaded",
      description: `"${exerciseTitle}" parameters loaded in simulation`,
    });
  };

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1">
            <TabsTrigger value="simulate" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1.5 px-2 text-xs sm:text-sm">
              <Activity className="h-4 w-4" />
              <span className="text-xs sm:hidden">Sim</span>
              <span className="hidden sm:inline">Simulate</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1.5 px-2 text-xs sm:text-sm">
              <Calculator className="h-4 w-4" />
              <span className="text-xs sm:hidden">Math</span>
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1.5 px-2 text-xs sm:text-sm">
              <History className="h-4 w-4" />
              <span className="text-xs sm:hidden">Hist</span>
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1.5 px-2 text-xs sm:text-sm">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs sm:hidden">Docs</span>
              <span className="hidden sm:inline">Resources</span>
            </TabsTrigger>
            <TabsTrigger value="exercises" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1.5 px-2 text-xs sm:text-sm">
              <Zap className="h-4 w-4" />
              <span className="text-xs sm:hidden">Quiz</span>
              <span className="hidden sm:inline">Exercises</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simulate" className="mt-8">
            <EnhancedSimulation 
              {...hookValues} 
              activeExercise={activeExercise}
              onShowExerciseQuestion={() => setSelectedExercise(activeExercise)}
              onDismissExercise={() => setActiveExercise(null)}
            />
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

          <TabsContent value="exercises" className="mt-8">
            <ExercisesTab 
              onLoadExercise={handleLoadExercise}
              onSetActiveExercise={setActiveExercise}
            />
          </TabsContent>
        </Tabs>

        {/* Global Exercise Question Modal */}
        <ExerciseQuestionModal
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          exercise={selectedExercise}
        />

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">
            Educational tool for exploring ecological dynamics through mathematical modeling
          </p>
          <p className="text-xs text-muted-foreground">
            Developed by <a 
              href="https://ufduttonlab.github.io/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline font-medium"
            >
              Dutton Lab @ UF
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}