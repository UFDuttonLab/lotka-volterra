import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { HelpCircle, X, Lightbulb, CheckCircle, XCircle } from "lucide-react";

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
  onDismiss: () => void;
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  advanced: "bg-red-100 text-red-800 border-red-200"
};

export default function ExerciseBanner({ exercise, onDismiss }: ExerciseBannerProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const handleSubmit = () => {
    if (selectedAnswer) {
      setHasSubmitted(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer("");
    setHasSubmitted(false);
    setShowHint(false);
  };

  const isCorrect = selectedAnswer === exercise.question.correctAnswer;

  return (
    <Card className="border-l-4 border-l-primary bg-primary/5 mb-6">
      <CardContent className="pt-4 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">Exercise Active:</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-medium">{exercise.title}</span>
              <Badge 
                variant="outline" 
                className={difficultyColors[exercise.difficulty as keyof typeof difficultyColors]}
              >
                {exercise.difficulty}
              </Badge>
            </div>
          </div>
          
          <Button 
            onClick={onDismiss} 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-foreground self-end sm:self-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground">
          {exercise.description}
        </p>

        {/* Question */}
        <div className="space-y-3">
          <div className="p-4 bg-muted/30 rounded-lg">
            <h3 className="font-medium text-foreground mb-2">Question:</h3>
            <p className="text-sm leading-relaxed">{exercise.question.question}</p>
          </div>

          {/* Hint */}
          {exercise.question.hint && (
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="text-xs"
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                {showHint ? "Hide Hint" : "Show Hint"}
              </Button>
              
              {showHint && (
                <div className="p-3 bg-yellow-50/50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">{exercise.question.hint}</p>
                </div>
              )}
            </div>
          )}

          {/* Answer Options */}
          <div className="space-y-3">
            <RadioGroup 
              value={selectedAnswer} 
              onValueChange={setSelectedAnswer}
              disabled={hasSubmitted}
              className="space-y-2"
            >
              {exercise.question.options.map((option) => (
                <div key={option.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/30">
                  <RadioGroupItem 
                    value={option.id} 
                    id={option.id}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor={option.id} 
                    className="flex-1 text-sm leading-relaxed cursor-pointer"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Submit Button */}
            {!hasSubmitted ? (
              <Button 
                onClick={handleSubmit} 
                disabled={!selectedAnswer}
                size="sm"
                className="w-full sm:w-auto"
              >
                Submit Answer
              </Button>
            ) : (
              /* Results */
              <div className="space-y-3">
                <div className={`p-4 rounded-lg border ${isCorrect 
                  ? 'bg-green-50/50 border-green-200' 
                  : 'bg-red-50/50 border-red-200'
                }`}>
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm font-medium text-green-800">Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                        <span className="text-sm font-medium text-red-800">Incorrect</span>
                      </>
                    )}
                  </div>
                  
                  <p className="text-xs leading-relaxed text-muted-foreground mb-2">
                    <strong>Explanation:</strong> {exercise.question.explanation}
                  </p>

                  {!isCorrect && (
                    <p className="text-xs text-muted-foreground">
                      The correct answer was: <strong>
                        {exercise.question.options.find(opt => opt.id === exercise.question.correctAnswer)?.text}
                      </strong>
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleTryAgain} variant="outline" size="sm">
                    Try Again
                  </Button>
                  <Button onClick={onDismiss} size="sm">
                    Continue Learning
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Helper Text */}
        <div className="text-xs text-muted-foreground border-t border-border pt-3">
          💡 Run the simulation and observe the dynamics while answering this question.
        </div>
      </CardContent>
    </Card>
  );
}