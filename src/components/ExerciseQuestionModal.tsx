import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, HelpCircle, Target } from "lucide-react";

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

interface ExerciseQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: {
    title: string;
    description: string;
    difficulty: string;
    question: ExerciseQuestion;
  } | null;
}

export default function ExerciseQuestionModal({
  isOpen,
  onClose,
  exercise
}: ExerciseQuestionModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer && !hasSubmitted) {
      setHasSubmitted(true);
    }
  };

  const handleClose = () => {
    setSelectedAnswer("");
    setHasSubmitted(false);
    setShowHint(false);
    onClose();
  };

  const isCorrect = selectedAnswer === exercise?.question.correctAnswer;

  if (!exercise) return null;

  const difficultyColors = {
    beginner: "bg-green-100 text-green-800 border-green-200",
    intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
    advanced: "bg-red-100 text-red-800 border-red-200"
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <DialogTitle className="text-xl">{exercise.title}</DialogTitle>
              <DialogDescription className="mt-1">
                {exercise.description}
              </DialogDescription>
            </div>
            <Badge variant="outline" className={`text-xs ${difficultyColors[exercise.difficulty as keyof typeof difficultyColors]}`}>
              {exercise.difficulty}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instructions */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">
                📊 <strong>Instructions:</strong> Run the simulation and observe the population dynamics. 
                Then answer the question based on what you see in the simulation results.
              </p>
            </CardContent>
          </Card>

          {/* Question */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Question:</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {exercise.question.question}
                </p>
              </div>
            </div>

            {/* Hint */}
            {exercise.question.hint && (
              <div className="space-y-2">
                {!showHint ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowHint(true)}
                    className="text-xs"
                  >
                    💡 Show Hint
                  </Button>
                ) : (
                  <Card className="bg-accent/10 border-accent/30">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-2">
                        <span className="text-sm">💡</span>
                        <p className="text-sm text-muted-foreground">
                          <strong>Hint:</strong> {exercise.question.hint}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            <h4 className="font-medium">Choose your answer:</h4>
            <RadioGroup 
              value={selectedAnswer} 
              onValueChange={setSelectedAnswer}
              disabled={hasSubmitted}
            >
              <div className="space-y-3">
                {exercise.question.options.map((option) => (
                  <div key={option.id} className="flex items-start space-x-3">
                    <RadioGroupItem 
                      value={option.id} 
                      id={option.id}
                      disabled={hasSubmitted}
                    />
                    <Label 
                      htmlFor={option.id} 
                      className={`flex-1 cursor-pointer leading-relaxed ${
                        hasSubmitted 
                          ? option.id === exercise.question.correctAnswer
                            ? "text-green-700 font-medium"
                            : option.id === selectedAnswer && option.id !== exercise.question.correctAnswer
                            ? "text-red-700"
                            : "text-muted-foreground"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-sm mt-0.5">
                          {String.fromCharCode(65 + exercise.question.options.findIndex(o => o.id === option.id))}.
                        </span>
                        <span>{option.text}</span>
                        {hasSubmitted && option.id === exercise.question.correctAnswer && (
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        )}
                        {hasSubmitted && option.id === selectedAnswer && option.id !== exercise.question.correctAnswer && (
                          <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Submit Button */}
          {!hasSubmitted && (
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedAnswer}
              className="w-full"
            >
              Submit Answer
            </Button>
          )}

          {/* Results */}
          {hasSubmitted && (
            <Card className={`${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {isCorrect ? 'Correct!' : 'Incorrect'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Explanation:</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {exercise.question.explanation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {hasSubmitted && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedAnswer("");
                  setHasSubmitted(false);
                  setShowHint(false);
                }}
                className="flex-1"
              >
                Try Again
              </Button>
            )}
            <Button 
              variant={hasSubmitted ? "default" : "outline"} 
              onClick={handleClose}
              className="flex-1"
            >
              {hasSubmitted ? "Continue Learning" : "Close"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}