function LandingPage({ onStart }) {
  return (
    <div>
      <h1>EU AI Act Compliance Checker</h1>

      <p style={{ fontStyle: 'italic', color: '#555' }}>
        This is a self-assessment tool, not legal advice.
      </p>

      <p style={{ fontSize: '0.9rem', color: '#555', backgroundColor: '#f5f5f5', padding: '0.8rem', borderRadius: '4px' }}>
        <strong>Note:</strong> we don't store your answers or conversations — 
        they're processed in memory only and passed to the AI provider under their 
        standard API terms. Please refrain from sharing confidential information.
      </p>

      <p>
        The EU AI Act is the world's first comprehensive legal framework 
        for artificial intelligence. Its primary goal is to ensure that AI systems used in the 
        European Union are safe, transparent, traceable and non-discriminatory. 
        It entered into force in August 2024, and the majority of its obligations became applicable from August 2026. 
        It applies to any organization that develops, deploys, or uses AI systems affecting people in the EU,
        regardless of where the organization itself is based.
      </p>

      <p>
        This tool is built for organizations trying to understand where their AI systems
        stand under the Act — whether you're a small business unsure if the rules apply to
        you, or a compliance team looking to identify concrete gaps in an existing high-risk
        system.
      </p>

      <p>Here's how it works:</p>

      <ol style={{ lineHeight: '1.8' }}>
        <li><strong>Determine your risk level</strong> — a few quick questions identify which category your AI system falls into under the Act.</li>
        <li><strong>Answer questions based on your risk level</strong> — to identify weaknesses and calculate a compliance score.</li>
        <li><strong>Talk with an EU AI Act-focused assistant</strong> — grounded in the actual text of the Act, to answer your specific questions and discuss how to close the gaps.</li>
      </ol>

      <button
        onClick={onStart}
        style={{
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '0.7rem 1.4rem',
          fontSize: '1rem',
          cursor: 'pointer',
          marginTop: '1rem',
        }}
      >
        Go to Step 1
      </button>
    </div>
  )
}

export default LandingPage