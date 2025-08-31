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
      <DialogContent className="max-w-[95vw] md:max-w-3xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3 flex-1">
              <Target className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg md:text-xl leading-tight">{exercise.title}</DialogTitle>
                <DialogDescription className="mt-1 text-sm leading-relaxed">
                  {exercise.description}
                </DialogDescription>
              </div>
            </div>
            <Badge variant="outline" className={`text-xs self-start sm:self-center flex-shrink-0 ${difficultyColors[exercise.difficulty as keyof typeof difficultyColors]}`}>
              {exercise.difficulty}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6">
          {/* Instructions */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="pt-3 md:pt-4">
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                📊 <strong>Instructions:</strong> Run the simulation and observe the population dynamics. 
                Then answer the question based on what you see in the simulation results.
              </p>
            </CardContent>
          </Card>

          {/* Question */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-start gap-2 md:gap-3">
              <HelpCircle className="h-4 w-4 md:h-5 md:w-5 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base md:text-lg mb-2">Question:</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
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
                    className="text-xs md:text-sm h-8 md:h-9 px-3 md:px-4"
                  >
                    💡 Show Hint
                  </Button>
                ) : (
                  <Card className="bg-accent/10 border-accent/30">
                    <CardContent className="pt-3 md:pt-4">
                      <div className="flex items-start gap-2">
                        <span className="text-sm flex-shrink-0">💡</span>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
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
          <div className="space-y-3 md:space-y-4">
            <h4 className="font-medium text-sm md:text-base">Choose your answer:</h4>
            <RadioGroup 
              value={selectedAnswer} 
              onValueChange={setSelectedAnswer}
              disabled={hasSubmitted}
            >
              <div className="space-y-2 md:space-y-3">
                {exercise.question.options.map((option) => (
                  <div key={option.id} className="flex items-start space-x-2 md:space-x-3 p-2 md:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem 
                      value={option.id} 
                      id={option.id}
                      disabled={hasSubmitted}
                      className="mt-1 h-4 w-4 md:h-5 md:w-5 flex-shrink-0"
                    />
                    <Label 
                      htmlFor={option.id} 
                      className={`flex-1 cursor-pointer leading-relaxed text-sm md:text-base min-h-[44px] flex items-center ${
                        hasSubmitted 
                          ? option.id === exercise.question.correctAnswer
                            ? "text-green-700 font-medium"
                            : option.id === selectedAnswer && option.id !== exercise.question.correctAnswer
                            ? "text-red-700"
                            : "text-muted-foreground"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-2 w-full">
                        <span className="font-mono text-xs md:text-sm mt-0.5 flex-shrink-0">
                          {String.fromCharCode(65 + exercise.question.options.findIndex(o => o.id === option.id))}.
                        </span>
                        <span className="math-formula unicode-math flex-1">{option.text}</span>
                        {hasSubmitted && option.id === exercise.question.correctAnswer && (
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        )}
                        {hasSubmitted && option.id === selectedAnswer && option.id !== exercise.question.correctAnswer && (
                          <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
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
              className="w-full h-10 md:h-11 text-sm md:text-base"
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
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            {hasSubmitted && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedAnswer("");
                  setHasSubmitted(false);
                  setShowHint(false);
                }}
                className="flex-1 h-10 md:h-11 text-sm md:text-base"
              >
                Try Again
              </Button>
            )}
            <Button 
              variant={hasSubmitted ? "default" : "outline"} 
              onClick={handleClose}
              className="flex-1 h-10 md:h-11 text-sm md:text-base"
            >
              {hasSubmitted ? "Continue Learning" : "Close"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}