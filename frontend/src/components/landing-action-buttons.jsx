import { Brain, MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const actionButtonClasses =
  "grid cursor-pointer grid-rows-[1fr_auto] gap-6 rounded-3xl border border-black/10 bg-linear-to-b from-primary-50 to-primary-500 p-6 text-left drop-shadow-2xl drop-shadow-black/2 duration-300 hover:bg-gray-50 hover:drop-shadow-black/10";

function AssessmentPreview() {
  const sections = [
    { heightClass: "h-14" },
    { heightClass: "h-24" },
    { heightClass: "h-20" },
  ];

  return (
    <div
      data-ui="score-ui"
      className="relative h-45 overflow-clip rounded-xl border border-black/10 bg-white p-2 flex items-center justify-center gap-8"
    >
      <div className="text-5xl font-bold text-gray-900 shrink-0">
        72<span className="text-2xl font-semibold text-primary">%</span>
      </div>
      <div className="flex items-end gap-3 h-28">
        {sections.map((section, i) => (
          <div
            key={i}
            className={`w-8 rounded-full bg-primary ${section.heightClass}`}
          />
        ))}
      </div>
    </div>
  );
}

function ChatPreview() {
  return (
    <div
      data-ui="chat-ui"
      className="relative h-45 overflow-clip rounded-xl border border-black/10 bg-white p-2 lg:p-6"
    >
      <div className="flex flex-col gap-2">
        <div className="response h-5 w-[70%] rounded-full bg-gray-300" />
        <div className="response h-5 w-[30%] rounded-full bg-gray-300" />
        <div className="answer ml-auto h-5 w-[50%] rounded-full bg-primary" />
        <div className="answer ml-auto h-5 w-[20%] rounded-full bg-primary" />
        <div className="response h-5 w-[70%] rounded-full bg-gray-300" />
        <div className="response h-5 w-[30%] rounded-full bg-gray-300" />
        <div className="response h-5 w-[50%] rounded-full bg-gray-300" />
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
          <Brain className="size-[0.75lh] text-white" />
          <h3 className="mt-0 text-white">Full compliance assessment</h3>
        </div>
        <p className="text-sm text-white">
          Determine your risk tier under the EU AI Act, with a full scored assessment for high-risk systems.
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
          <MessageCircle className="size-[0.75lh] text-white" />
          <h3 className="mt-0 text-white" >Just have a question?</h3>
        </div>
        <p className="text-sm text-white">
          Skip the assessment and ask the chatbot directly — grounded in the
          actual text of the Act, no setup required.
        </p>
      </div>
    </button>
  );
}

export { AskQuestionButton, FullComplianceAssessmentButton };
