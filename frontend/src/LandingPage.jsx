/**
 * LandingPage - the app's entry screen.
 *
 * Explains what the tool is, links to the original 2023 research paper,
 * and offers two paths: a full 10-minute risk classification + scored
 * assessment (onStartAssessment), or a quick, no-commitment question
 * answered by the general-purpose chatbot (onStartChat).
 */

function LandingPage({ onStartAssessment, onStartChat }) {
  return (
    <div>
      <h1>EU AI Act Compliance Checker</h1>

      <p style={{ fontStyle: 'italic', color: '#555' }}>
        This is a self-assessment tool, not legal advice.
      </p>

      <p style={{ fontSize: '0.9rem', color: '#555', backgroundColor: '#f5f5f5', padding: '0.8rem', borderRadius: '4px' }}>
        <strong>Note:</strong> information you enter is not saved anywhere. Chats with the
        chatbot remain within the API environment and are not used to train the AI, but
        please refrain from sharing confidential information.
      </p>

      <p>
        The EU AI Act (Regulation (EU) 2024/1689) is currently in force. It entered into
        force in August 2024, and the majority of its obligations became applicable from
        August 2026. It applies to any organization that develops, deploys, or uses AI
        systems affecting people in the EU, regardless of where the organization is based.
      </p>

      <p>
        This tool is built for organizations trying to understand where their AI systems
        stand under the Act — whether you're a small business unsure if the rules apply to
        you, or a compliance team looking to identify concrete gaps in an existing
        high-risk system.
      </p>

      <p style={{ fontWeight: 600, marginTop: '1.5rem' }}>What would you like to do?</p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 260px', border: '1px solid #ddd', borderRadius: '8px', padding: '1.2rem' }}>
          <h3 style={{ marginTop: 0 }}>Full compliance assessment</h3>
          <p style={{ fontSize: '0.9rem', color: '#555' }}>
            Determine your risk tier, answer a 50-question scored assessment, and get a
            detailed, grounded breakdown of where to improve. Takes about 10 minutes.
          </p>
          <button className="btn-primary" onClick={onStartAssessment}>
            Start the assessment
          </button>
        </div>

        <div style={{ flex: '1 1 260px', border: '1px solid #ddd', borderRadius: '8px', padding: '1.2rem' }}>
          <h3 style={{ marginTop: 0 }}>Just have a question?</h3>
          <p style={{ fontSize: '0.9rem', color: '#555' }}>
            Skip the assessment and ask the chatbot directly — grounded in the actual text
            of the Act, no setup required.
          </p>
          <button className="btn-secondary" onClick={onStartChat}>
            Ask a question
          </button>
        </div>
      </div>
    </div>
  )
}

export default LandingPage