/**
 * LandingPage - the app's entry screen.
 *
 * Explains what the tool is, links to the original 2023 research paper,
 * and offers two paths: a full 10-minute risk classification + scored
 * assessment (onStartAssessment), or a quick, no-commitment question
 * answered by the general-purpose chatbot (onStartChat).
 */

import {
  AskQuestionButton,
  FullComplianceAssessmentButton,
} from "@/components/landing-action-buttons";

function LandingPage({ onStartAssessment, onStartChat }) {
  return (
    <div className="flex flex-col gap-8">
      {" "}
      <p className="text-xl mx-auto text-center font-bold">
        Built to aid businesses in understanding their role with the EU AI Act
      </p>
      <div className="flex bg-white mx-auto p-8 lg:p-12 flex-col gap-8 rounded-xl border border-black/10">
        <div className="flex flex-col gap-4">
          <p className="">
            The EU AI Act (Regulation (EU) 2024/1689) is currently in force. It
            entered into force in August 2024, and the majority of its
            obligations became applicable from August 2026. It applies to any
            organization that develops, deploys, or uses AI systems affecting
            people in the EU, regardless of where the organization is based.
          </p>

          <p className="">
            This tool is built for organizations trying to understand where
            their AI systems stand under the Act — whether you're a small
            business unsure if the rules apply to you, or a compliance team
            looking to identify concrete gaps in an existing high-risk system.
          </p>
        </div>
        <p className="italic opacity-60">
          This is a self-assessment tool, not legal advice.
        </p>

        <p className="opacity-60">
          <strong>Note:</strong> information you enter is not saved anywhere.
          Chats with the chatbot remain within the API environment and are not
          used to train the AI, but please refrain from sharing confidential
          information.
        </p>
      </div>
      <div className="max-lg:-order-1 flex flex-col gap-4">
        <div className="grid md:grid-cols-2 gap-2">
          <FullComplianceAssessmentButton onClick={onStartAssessment} />
          <AskQuestionButton onClick={onStartChat} />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
