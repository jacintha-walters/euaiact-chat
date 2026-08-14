import { Brain, MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const actionButtonClasses =
  "grid cursor-pointer grid-rows-[1fr_auto] gap-6 rounded-3xl border border-black/10 bg-linear-to-b from-white to-primary-50 p-6 text-left drop-shadow-2xl drop-shadow-black/2 duration-300 hover:bg-gray-50 hover:drop-shadow-black/10";

function AssessmentPreview() {
  const questions = [
    { width: "w-[70%]", answers: 2, selected: 0 },
    { width: "w-[80%]", answers: 4, selected: 2 },
    { width: "w-[70%]", extraWidth: "w-[40%]", answers: 4, selected: 3 },
    { width: "w-[70%]", extraWidth: "w-[40%]", answers: 4, selected: 3 },
  ];

  return (
    <div
      data-ui="quiz-ui"
      className="relative h-60 overflow-clip rounded-xl border border-black/10 bg-white p-2 lg:p-6"
    >
      <div className="flex flex-col gap-6">
        {questions.map((question, questionIndex) => (
          <div
            key={questionIndex}
            className="question-and-answer flex flex-col gap-2"
          >
            {question.extraWidth && (
              <div
                className={cn(
                  "question h-5 rounded-full bg-gray-100",
                  question.extraWidth,
                )}
              />
            )}
            <div
              className={cn(
                "question h-5 rounded-full bg-gray-100",
                question.width,
              )}
            />
            <div className="flex gap-2">
              {Array.from({ length: question.answers }, (_, answerIndex) => (
                <div
                  key={answerIndex}
                  className={cn(
                    "answer h-5 w-10 rounded-full",
                    answerIndex === question.selected
                      ? "bg-primary"
                      : "bg-primary/5",
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 h-10 w-full bg-linear-to-b from-transparent to-white" />
    </div>
  );
}

function ChatPreview() {
  return (
    <div
      data-ui="chat-ui"
      className="relative h-60 overflow-clip rounded-xl border border-black/10 bg-white p-2 lg:p-6"
    >
      <div className="flex flex-col gap-2">
        <div className="response h-5 w-[70%] rounded-full bg-gray-100" />
        <div className="response h-5 w-[30%] rounded-full bg-gray-100" />
        <div className="answer ml-auto h-5 w-[50%] rounded-full bg-primary" />
        <div className="answer ml-auto h-5 w-[20%] rounded-full bg-primary" />
        <div className="response h-5 w-[70%] rounded-full bg-gray-100" />
        <div className="response h-5 w-[30%] rounded-full bg-gray-100" />
        <div className="response h-5 w-[50%] rounded-full bg-gray-100" />
        <div className="answer ml-auto h-5 w-[70%] rounded-full bg-primary" />
      </div>
      <div className="absolute bottom-0 h-10 w-full bg-linear-to-b from-transparent to-white" />
    </div>
  );
}

function FullComplianceAssessmentButton({ className, ...props }) {
  return (
    <button
      type="button"
      className={cn(actionButtonClasses, className)}
      {...props}
    >
      <AssessmentPreview />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Brain className="size-[0.75lh]" />
          <h3 className="mt-0">Full compliance assessment</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Determine your risk tier, answer a 50-question scored assessment, and
          get a detailed, grounded breakdown of where to improve. Takes about 10
          minutes.
        </p>
      </div>
    </button>
  );
}

function AskQuestionButton({ className, ...props }) {
  return (
    <button
      type="button"
      className={cn(actionButtonClasses, className)}
      {...props}
    >
      <ChatPreview />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <MessageCircle className="size-[0.75lh]" />
          <h3 className="mt-0">Just have a question?</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Skip the assessment and ask the chatbot directly — grounded in the
          actual text of the Act, no setup required.
        </p>
      </div>
    </button>
  );
}

export { AskQuestionButton, FullComplianceAssessmentButton };
