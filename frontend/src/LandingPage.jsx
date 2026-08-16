/**
 * LandingPage - the app's entry screen.
 *
 * Explains what the tool is, links to the original 2023 research paper,
 * and offers two paths: a full 10-minute risk classification + scored
 * assessment (onStartAssessment), or a quick, question
 * answered by the EU AI Act chatbot (onStartChat).
 */

import {
  AskQuestionButton,
  FullComplianceAssessmentButton,
} from "@/components/landing-action-buttons";

function LandingPage({ onStartAssessment, onStartChat }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 text-center">
        <p className="text-xl font-bold">
          Know where you stand under the EU AI Act.
        </p>
        <p className="italic opacity-60">
          This is a self-assessment tool, not legal advice.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-2">
        <FullComplianceAssessmentButton onClick={onStartAssessment} />
        <AskQuestionButton onClick={onStartChat} />
      </div>

      <div className="flex bg-white mx-auto p-8 lg:p-12 flex-col gap-8 rounded-xl border border-black/10">
        <div className="flex flex-col gap-4">
          <p className="">
            Regulation like this can feel overwhelming, especially when you're not sure if it even applies to you. 
            The EU AI Act (Regulation (EU) 2024/1689) has been in force since August 2024, with most of its obligations now 
            active since August 2026, and it reaches any organization whose AI systems affect people in the EU, 
            no matter where you're based.
          </p>

          <p className="">
            That's exactly why this tool exists. Whether you're a small business wondering 
            if the rules apply to you at all, or a compliance team hunting for concrete gaps in 
            an existing high-risk system, this tool will help you find a clear answer!
          </p>
        </div>

        <p className="opacity-60">
          <strong>Note:</strong> information you enter is not saved anywhere.
          Chats with the chatbot remain within the API environment and are not
          used to train the AI, but please refrain from sharing confidential
          information.
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
