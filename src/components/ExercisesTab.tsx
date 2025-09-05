import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { Beaker, Zap, Play } from "lucide-react";

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

interface Exercise {
  title: string;
  description: string;
  type: "exercise";
  difficulty: "beginner" | "intermediate" | "advanced";
  modelType: "competition" | "predator-prey";
  parameters: Record<string, number>;
  content: string[];
  question: ExerciseQuestion;
}

interface ExercisesTabProps {
  onLoadExercise: (
    params: Record<string, number>, 
    modelType: "competition" | "predator-prey", 
    title: string
  ) => void;
  onSetActiveExercise: (exercise: {
    title: string;
    description: string;
    difficulty: string;
    question: ExerciseQuestion;
  } | null) => void;
}

const competitionExercises: Exercise[] = [
  {
    title: "Coexistence vs Exclusion",
    description: "Predict whether two competing species can coexist or one will exclude the other",
    type: "exercise",
    difficulty: "beginner",
    modelType: "competition",
    parameters: {
      r1: 1.0,
      r2: 0.8,
      K1: 100,
      K2: 120,
      a12: 0.7,
      a21: 0.9,
      N1_0: 20,
      N2_0: 15
    },
    content: [
      "Run the simulation with the given parameters",
      "Observe how the populations change over time",
      "Determine the final outcome of competition"
    ],
    question: {
      id: "coexistence-q1",
      question: "Based on the simulation results, what happens to these two competing species over time?",
      options: [
        { id: "a", text: "Both species coexist at stable population levels" },
        { id: "b", text: "Species 1 excludes Species 2 completely" },
        { id: "c", text: "Species 2 excludes Species 1 completely" },
        { id: "d", text: "Both species go extinct" }
      ],
      correctAnswer: "a",
      explanation: "With α₁₂ = 0.7 < K₁/K₂ = 0.83 and α₂₁ = 0.9 < K₂/K₁ = 1.2, both species can coexist. The competition coefficients are weak enough that neither species can completely exclude the other.",
      hint: "Compare the competition coefficients (α₁₂ and α₂₁) with the ratios of carrying capacities (K₁/K₂ and K₂/K₁)"
    }
  },
  {
    title: "Strong Competition Analysis",
    description: "Examine what happens when competition is very intense between species",
    type: "exercise",
    difficulty: "intermediate",
    modelType: "competition",
    parameters: {
      r1: 1.2,
      r2: 0.9,
      K1: 80,
      K2: 100,
      a12: 1.8,
      a21: 1.5,
      N1_0: 25,
      N2_0: 30
    },
    content: [
      "This scenario models intense competition between species",
      "Watch how strong competitive effects influence population dynamics",
      "Note which species has the competitive advantage"
    ],
    question: {
      id: "strong-comp-q1",
      question: "In this high-competition scenario, which species survives and why?",
      options: [
        { id: "a", text: "Species 1 survives because it has a higher growth rate" },
        { id: "b", text: "Species 2 survives because it has a higher carrying capacity" },
        { id: "c", text: "Both species survive but at very low populations" },
        { id: "d", text: "The outcome depends on the initial population sizes" }
      ],
      correctAnswer: "b",
      explanation: "Species 2 wins because α₂₁ = 1.5 > K₂/K₁ = 1.25, but α₁₂ = 1.8 > K₁/K₂ = 0.8. When both species have strong competitive effects, the species with the higher carrying capacity (Species 2, K₂ = 100) typically wins.",
      hint: "In mutual exclusion scenarios, compare carrying capacities and competitive strengths"
    }
  },
  {
    title: "Invasion Success Prediction",
    description: "Determine if a new species can successfully invade an established population",
    type: "exercise",
    difficulty: "advanced",
    modelType: "competition",
    parameters: {
      r1: 0.8,
      r2: 1.1,
      K1: 150,
      K2: 90,
      a12: 0.8,
      a21: 0.5,
      N1_0: 140,
      N2_0: 5
    },
    content: [
      "Species 1 is well-established near its carrying capacity",
      "Species 2 starts with a very small population (invasion scenario)",
      "Determine if the invader can establish and grow"
    ],
    question: {
      id: "invasion-q1",
      question: "Can Species 2 successfully invade and establish a population when Species 1 is dominant?",
      options: [
        { id: "a", text: "No, Species 2 cannot invade because Species 1 is too well established" },
        { id: "b", text: "Yes, Species 2 can invade and will eventually exclude Species 1" },
        { id: "c", text: "Yes, Species 2 can invade and both species will coexist" },
        { id: "d", text: "The invasion depends on random environmental factors" }
      ],
      correctAnswer: "c",
      explanation: "Species 2 can successfully invade because α₂₁ = 0.5 < K₂/K₁ = 0.6, allowing growth when Species 1 is at carrying capacity: dN₂/dt = 1.1N₂(1 - 0.5×150/90) = 1.1N₂(0.17) > 0. However, since α₁₂ = 0.8 < K₁/K₂ = 1.67 AND α₂₁ = 0.5 < K₂/K₁ = 0.6, both inequality conditions for coexistence are met. Both species will reach a stable equilibrium together.",
      hint: "For invasion analysis, check if the invading species can grow when the resident is at equilibrium"
    }
  }
];

const predatorPreyExercises: Exercise[] = [
  {
    title: "Oscillation Period Prediction",
    description: "Predict how parameter changes affect the period of predator-prey cycles",
    type: "exercise",
    difficulty: "beginner",
    modelType: "predator-prey",
    parameters: {
      r1: 1.0,
      a: 0.1,
      b: 0.075,
      r2: 0.8,
      N1_0: 40,
      N2_0: 9
    },
    content: [
      "This system shows classic predator-prey oscillations",
      "Observe the population cycles of prey (Species 1) and predator (Species 2)",
      "Count how long one complete cycle takes"
    ],
    question: {
      id: "oscillation-q1",
      question: "What happens to the oscillation period if we increase the predator attack rate (parameter 'a')?",
      options: [
        { id: "a", text: "The oscillation period becomes longer" },
        { id: "b", text: "The oscillation period becomes shorter" },
        { id: "c", text: "The oscillation period stays the same" },
        { id: "d", text: "The oscillations stop completely" }
      ],
      correctAnswer: "b",
      explanation: "Increasing the attack rate 'a' makes predators more efficient at catching prey, which intensifies the predator-prey interaction. This leads to faster population changes and shorter oscillation periods. The system becomes more 'tightly coupled'.",
      hint: "Think about how more efficient predation affects the speed of population changes"
    }
  },
  {
    title: "Stability Analysis Challenge",
    description: "Determine what parameters lead to stable vs unstable predator-prey dynamics",
    type: "exercise", 
    difficulty: "intermediate",
    modelType: "predator-prey",
    parameters: {
      r1: 2.0,
      a: 0.05,
      b: 0.02,
      r2: 1.5,
      N1_0: 60,
      N2_0: 30
    },
    content: [
      "High growth rates can lead to unstable dynamics",
      "Watch what happens to the populations over time",
      "Consider whether this system is realistic"
    ],
    question: {
      id: "stability-q1",
      question: "What characterizes the long-term behavior of this predator-prey system?",
      options: [
        { id: "a", text: "Stable oscillations that continue indefinitely" },
        { id: "b", text: "Populations spiral outward to extinction or unrealistic levels" },
        { id: "c", text: "Both populations reach a steady equilibrium" },
        { id: "d", text: "Only the predator population survives" }
      ],
      correctAnswer: "b",
      explanation: "With high growth rates (r₁ = 2.0, r₂ = 1.5) relative to interaction strengths, the system becomes unstable. The Lotka-Volterra model lacks density-dependent regulation, so high growth rates cause populations to spiral to unrealistic extremes.",
      hint: "Consider whether the population sizes remain realistic over time"
    }
  },
  {
    title: "Population Peak Timing",
    description: "Analyze the phase relationship between predator and prey population peaks",
    type: "exercise",
    difficulty: "advanced", 
    modelType: "predator-prey",
    parameters: {
      r1: 1.2,
      a: 0.08,
      b: 0.04,
      r2: 0.6,
      N1_0: 35,
      N2_0: 15
    },
    content: [
      "Classic predator-prey cycles with clear phase relationships",
      "Track when each population reaches its maximum",
      "Observe the timing between prey and predator peaks"
    ],
    question: {
      id: "timing-q1",
      question: "In predator-prey cycles, when does the predator population typically reach its peak relative to the prey peak?",
      options: [
        { id: "a", text: "At exactly the same time as the prey peak" },
        { id: "b", text: "About 1/4 cycle before the prey peak" },
        { id: "c", text: "About 1/4 cycle after the prey peak" },
        { id: "d", text: "The timing is completely random" }
      ],
      correctAnswer: "c",
      explanation: "Predator populations lag behind prey populations by about 1/4 of a cycle. This happens because: (1) prey populations peak first, (2) abundant prey allows predator populations to grow, (3) predators peak after prey have started declining, (4) then predator decline follows prey decline. This phase lag is fundamental to predator-prey dynamics.",
      hint: "Think about the cause-and-effect relationship: predators respond to prey abundance"
    }
  }
];

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  advanced: "bg-red-100 text-red-800 border-red-200"
};

export default function ExercisesTab({ onLoadExercise, onSetActiveExercise }: ExercisesTabProps) {
  const handleLoadExercise = (exercise: Exercise) => {
    // First load the exercise parameters in simulation
    onLoadExercise(exercise.parameters, exercise.modelType, exercise.title);
    
    // Set as active exercise (for banner display)
    onSetActiveExercise({
      title: exercise.title,
      description: exercise.description,
      difficulty: exercise.difficulty,
      question: exercise.question
    });
  };

  const renderExercise = (exercise: Exercise) => (
    <Card key={exercise.title} className="border-l-4 border-l-primary">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-base sm:text-lg leading-tight">{exercise.title}</CardTitle>
            <p className="text-sm text-muted-foreground leading-relaxed">{exercise.description}</p>
          </div>
          <Badge 
            variant="outline" 
            className={`${difficultyColors[exercise.difficulty]} shrink-0 text-xs`}
          >
            {exercise.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Learning Objectives:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {exercise.content.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button 
            onClick={() => handleLoadExercise(exercise)}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Load Exercise in Simulation
          </Button>
          <Badge variant="secondary" className="text-xs">
            {exercise.modelType === "competition" ? "Competition Model" : "Predator-Prey Model"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Interactive Exercises</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Practice analyzing ecological dynamics through hands-on exercises. Load parameters, observe simulations, then test your understanding.
        </p>
      </div>

      {/* Exercise Tabs */}
      <Tabs defaultValue="competition" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="competition" className="flex items-center gap-2">
            <Beaker className="h-4 w-4" />
            Competition Exercises
          </TabsTrigger>
          <TabsTrigger value="predator-prey" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Predator-Prey Exercises
          </TabsTrigger>
        </TabsList>

        <TabsContent value="competition" className="space-y-6">
          <div className="text-center space-y-2 mb-6">
            <h3 className="text-xl font-semibold">Species Competition Dynamics</h3>
            <p className="text-muted-foreground">
              Explore competitive interactions between species and predict outcomes
            </p>
          </div>
          
          <div className="grid gap-6">
            {competitionExercises.map(renderExercise)}
          </div>
        </TabsContent>

        <TabsContent value="predator-prey" className="space-y-6">
          <div className="text-center space-y-2 mb-6">
            <h3 className="text-xl font-semibold">Predator-Prey Oscillations</h3>
            <p className="text-muted-foreground">
              Analyze population cycles and parameter effects in predator-prey systems
            </p>
          </div>
          
          <div className="grid gap-6">
            {predatorPreyExercises.map(renderExercise)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Instructions */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-3">How to Use Exercises:</h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <div className="font-medium text-primary">1. Load Exercise</div>
              <p className="text-muted-foreground">Click "Load Exercise" to transfer parameters to the simulation tab</p>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-primary">2. Observe & Experiment</div>
              <p className="text-muted-foreground">Run the simulation, try different parameters, and observe the dynamics</p>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-primary">3. Answer Questions</div>
              <p className="text-muted-foreground">Click "Answer Question" in the simulation when you're ready to test your understanding</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}