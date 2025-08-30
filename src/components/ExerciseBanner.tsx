import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, X } from "lucide-react";

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

interface ExerciseBannerProps {
  exercise: {
    title: string;
    description: string;
    difficulty: string;
    question: ExerciseQuestion;
  };
  onAnswerQuestion: () => void;
  onDismiss: () => void;
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  advanced: "bg-red-100 text-red-800 border-red-200"
};

export default function ExerciseBanner({ exercise, onAnswerQuestion, onDismiss }: ExerciseBannerProps) {
  return (
    <Card className="border-l-4 border-l-primary bg-primary/5 mb-6">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">Exercise Active:</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{exercise.title}</span>
                <Badge 
                  variant="outline" 
                  className={difficultyColors[exercise.difficulty as keyof typeof difficultyColors]}
                >
                  {exercise.difficulty}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {exercise.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={onAnswerQuestion} size="sm">
              Answer Question
            </Button>
            <Button 
              onClick={onDismiss} 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground">
          💡 Run the simulation and observe the dynamics, then click "Answer Question" when you're ready to test your understanding.
        </div>
      </CardContent>
    </Card>
  );
}