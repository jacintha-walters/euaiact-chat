/**
 * GateForm - the risk-tier classification flow (Step 1 of the assessment).
 *
 * Asks 4 yes/no questions and routes the user to one of 5 dedicated result
 * pages based on their answers: prohibited, gpai, high-risk, limited-risk,
 * or minimal-risk. The high-risk page is the only one that leads further --
 * it reveals the Questionnaire component (Step 2) once the user continues,
 * which in turn renders ChatInterface (Step 3) once a score exists.
 */

import { useState } from 'react'
import Questionnaire from './Questionnaire.jsx'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const QUESTIONS = [
   {
    key: 'prohibited_practice',
    text: "Does your AI system manipulate behavior subliminally, perform social scoring, use real-time facial recognition in public for law enforcement, detect emotions in workplaces/schools, or scrape images to build facial recognition databases?",
    info: (
      <>
        Answer yes if any of the following apply:
        <ul style={{ margin: '0.4rem 0 0 1rem', padding: 0 }}>
          <li>Uses fast flashes or similar techniques to unconsciously affect the user's behavior</li>
          <li>Targets people based on age, disability, or economic situation to influence their behavior</li>
          <li>Classifies individuals based on personality traits, leading to unfair treatment</li>
          <li>Predicts a person's risk of committing a crime</li>
          <li>Harvests faces from the internet or CCTV to build facial recognition databases</li>
          <li>Identifies people's emotions in a workplace or school environment</li>
          <li>Classifies individuals to deduce sensitive information like race or political views</li>
          <li>Performs live facial recognition in public spaces</li>
        </ul>
        Source: EU AI Act chapter II: Prohibited AI Practices
      </>
    ),
  },
  {
    key: 'is_gpai_model',
    text: "Is your AI system a general-purpose model (e.g. a foundation model or LLM) typically provided to other businesses to build on, rather than built for one specific use case?",
    info: "Under the EU AI Act a General-Purpose AI (GPAI) model is defined as an AI model that displays significant generality, is capable of performing a wide range of distinct tasks regardless of how it is placed on the market, and can be integrated into a variety of downstream systems or applications.",
  },
  {
    key: 'annex_iii_domain',
    text: "Is your AI system used in biometrics, critical infrastructure, education, employment, essential services (credit/insurance/benefits), law enforcement, migration/border control, or justice/democratic processes?",
    info: "These are the eight domains listed in Annex III of the Act. For example, AI used as a safety component in traffic, AI used to score tests of students, CV-scanning software, credit scoring. Answering yes will lead to the full compliance questionnaire and personalised chatbot to help determine your weaknesses and how to improve.",
  },
  {
    key: 'transparency_trigger',
    text: "Does your AI system talk directly with people (chatbot), generate/manipulate audio-video-image-text content, or use emotion/biometric recognition outside the areas above?",
    info: (
        <>
        Answer yes if any of the following apply:
        <ul style={{ margin: '0.4rem 0 0 1rem', padding: 0 }}>
          <li>Interactive AI: simulates human communication, whether through text, audio or video</li>
          <li>Generative AI: generate synthetic text or high-resolution images or video based on user prompts</li>
          <li>Deepfake AI: manipulate existing media to make things look or sound real when they are not</li>
          <li>Recognition AI: used for biometric identification or emotion detection</li>
        </ul>
        Source: Article 50 of the EU AI Act
      </>
    ),
  },
]

function GateForm() {
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hoveredKey, setHoveredKey] = useState(null)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)

  const handleAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const allAnswered = QUESTIONS.every((q) => answers[q.key] !== undefined)

  const handleSubmit = async () => {
    setLoading(true)
    const response = await fetch(`${API_BASE_URL}/api/gate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
    })
    const data = await response.json()
    setResult(data)
    setLoading(false)
  }

  const handleDemoFill = () => {
    const demoAnswers = {
      prohibited_practice: false,
      is_gpai_model: false,
      annex_iii_domain: true,
      transparency_trigger: true,
    }
    setAnswers(demoAnswers)
  }

  if (result && result.tier === 'prohibited') {
    return (
      <div>
        <h2>This system is prohibited under the EU AI Act</h2>

        <p>
          Based on your answer, your AI system falls under one of the practices banned
          outright by <strong>Article 5</strong> of the Act. Unlike the other risk
          categories, there is no compliance pathway here — prohibited practices cannot
          legally be placed on the market or put into service in the EU, regardless of
          any other safeguards.
        </p>

        <p>
          These include subliminal manipulation, exploiting vulnerabilities based on age,
          disability, or economic situation, social scoring, real-time public facial
          recognition for law enforcement, emotion recognition in workplaces or schools,
          predictive policing based solely on profiling, untargeted scraping of facial
          images to build recognition databases, and biometric categorization to infer
          sensitive attributes like race or political opinion.
        </p>

        <p style={{ fontStyle: 'italic', color: '#555' }}>
          Perhaps you made a mistake answering the previous question? You can go back and
          double check.
        </p>

        <button className="btn-secondary" onClick={() => setResult(null)}>
          Go back to the risk questions
        </button>
      </div>
    )
  }

  if (result && result.tier === 'gpai') {
    return (
      <div>
        <h2>This is a general-purpose AI model</h2>

        <p>
          Based on your answer, your system is a general-purpose AI (GPAI) model — one
          designed to perform a wide range of tasks and typically provided to other
          businesses to build on, rather than built for one specific use case. GPAI models
          fall under a separate track of the Act, not the high-risk system requirements
          this tool currently covers.
        </p>

        <p>
          <strong>Article 53</strong> sets out the core obligations for GPAI providers —
          maintaining technical documentation, providing information to downstream
          providers who integrate the model, and complying with EU copyright law,
          including via a publicly available summary of training content. Models
          classified as carrying <strong>systemic risk</strong> (Article 51) face
          additional obligations under Article 55, including model evaluation, adversarial
          testing, and incident reporting. These obligations have applied since August 2025.
        </p>

        <p style={{ fontStyle: 'italic', color: '#555' }}>
          Perhaps your system isn't actually a general-purpose model? If it's built for one
          specific use case rather than a broad range of tasks, you can go back and
          reconsider that question.
        </p>

        <button className="btn-secondary" onClick={() => { setResult(null); setAnswers({}) }}>
          Go back to the risk questions
        </button>
      </div>
    )
  }

  if (result && result.tier === 'high-risk') {
    return (
      <div>
        {!showQuestionnaire && (
          <>
            <h2>Your system is marked as high-risk</h2>

            <p>
              It's important to know that it's not the AI model itself that makes it
              high-risk — it depends on where and how it's applied. A model used in an
              Annex III domain (like employment, credit scoring, or education) is
              high-risk; the exact same model used elsewhere might not be.
            </p>

            <p>
              Right now, the EU AI Act's high-risk obligations aren't fully in effect yet
              for existing systems — but now is the time to take action. Per{' '}
              <strong>December 2027</strong>, you'll need to be compliant.
            </p>

            <p>
              The following questionnaire contains <strong>50 questions</strong> spread
              across three sections — Data, Documentation & Communication; Model Risk; and
              Development Lifecycle. It's based on the paper{' '}
              <em>"Complying with the EU AI Act"</em> by Jacintha Walters, Diptish Dey,
              Debarati Bhaumik, and Sophie Horsman, published in 2023 and currently cited
              over 50 times. It should take around 10 minutes to complete.
            </p>

            <p>
              Afterward, you'll get an overview of your current compliance score, and the
              option to talk with a specialized chatbot about your score and how your
              organization could improve.
            </p>

            <button className="btn-primary" onClick={() => setShowQuestionnaire(true)}>
              Continue to the full compliance questionnaire
            </button>
          </>
        )}
        {showQuestionnaire && <Questionnaire />}
      </div>
    )
  }

  if (result && result.tier === 'limited-risk') {
    return (
      <div>
        <h2>Your system is marked as low-risk</h2>

        <p>
          Good news — under the EU AI Act, this means there's only one main rule your
          organization needs to follow: <strong>transparency</strong> (Article 50).
        </p>

        <p>
          Unlike the high-risk track, this obligation is already in effect — it applies
          since <strong>August 2, 2026</strong>. Depending on what your system does, it
          means:
        </p>

        <ul>
          <li>
            If your system talks directly with people (a chatbot, voice assistant, etc.),
            you must make it clear they're interacting with an AI — unless that's already
            obvious from context.
          </li>
          <li>
            If your system generates images, audio, video, or text, the output must be
            marked in a machine-readable way so it's detectable as AI-generated.
          </li>
          <li>
            If your system does emotion recognition or biometric categorization, you must
            inform the people it's used on.
          </li>
          <li>
            If your system creates deepfakes, or generates text published for informing
            the public, you must disclose that the content is AI-generated or manipulated.
          </li>
        </ul>

        <p>
          This information needs to be given clearly, distinguishably, and no later than
          someone's first interaction with — or exposure to — the system.
        </p>

        <button className="btn-secondary" onClick={() => { setResult(null); setAnswers({}) }}>
          Go back to the risk questions
        </button>
      </div>
    )
  }

  if (result && result.tier === 'minimal-risk') {
    return (
      <div>
        <h2>Your system is marked as minimal-risk</h2>

        <p>
          Based on your answers, your AI system doesn't currently fall under any of the
          Act's specific obligation tiers — it's not prohibited, not a general-purpose
          model, not used in a high-risk domain, and doesn't trigger the transparency
          rules that apply to things like chatbots or synthetic content.
        </p>

        <p>
          This covers the majority of everyday AI use cases — things like spam filters,
          recommendation systems, or internal tooling that doesn't interact directly with
          the public or make high-stakes decisions about people. For systems in this
          category, the EU AI Act doesn't currently impose specific legal obligations.
        </p>

        <p style={{ fontStyle: 'italic', color: '#555' }}>
          Worth keeping in mind: if your system's use case changes over time — say, it
          starts being used in an Annex III domain, or begins interacting directly with
          users — its risk classification could change too. It's worth revisiting this
          assessment if your system's role evolves.
        </p>

        <button className="btn-secondary" onClick={() => { setResult(null); setAnswers({}) }}>
          Go back to the risk questions
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1>EU AI Act Compliance Checker</h1>
      <p style={{ fontStyle: 'italic', color: '#555' }}>
        This is a self-assessment tool, not legal advice.
      </p>

      <p> 
        The EU AI Act works on a risk-based approach. This means that, instead of regulating
        the technology itself, the regulations focus on the impact the AI has on the user.
        Take a recommender system for example, if used in an online webshop, this is considered low-risk. 
        However, if we apply the same recommender technology in a recruitment system, it becomes high-risk. 
        Answer the questions below to determine your risk level. 
      </p>
            <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
        <button className="btn-secondary" onClick={handleDemoFill}>
          I want a demo
        </button>
      </div>
     {QUESTIONS.map((q) => (
        <div key={q.key} style={{ marginBottom: '1.5rem' }}>
          <p style={{ display: 'inline' }}>{q.text}</p>
          <span
            onMouseEnter={() => setHoveredKey(q.key)}
            onMouseLeave={() => setHoveredKey(null)}
            style={{
              marginLeft: '0.4rem',
              display: 'inline-block',
              position: 'relative',
              cursor: 'help',
              width: '1.2rem',
              height: '1.2rem',
              borderRadius: '50%',
              backgroundColor: '#1976d2',
              color: 'white',
              textAlign: 'center',
              fontSize: '0.8rem',
              lineHeight: '1.2rem',
            }}
          >
            i
            {hoveredKey === q.key && (
              <div
                style={{
                  position: 'absolute',
                  top: '1.6rem',
                  right: 0,
                  width: '320px',
                  backgroundColor: '#333',
                  color: 'white',
                  padding: '0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  zIndex: 10,
                  lineHeight: '1.3',
                  textAlign: 'left',
                }}
              >
                {q.info}
              </div>
            )}
          </span>
          <div style={{ marginTop: '0.5rem' }}>
            <button
              onClick={() => handleAnswer(q.key, true)}
              style={{
                backgroundColor: answers[q.key] === true ? '#2e7d32' : '#eee',
                color: answers[q.key] === true ? 'white' : 'black',
                border: '1px solid #ccc',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
              }}
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswer(q.key, false)}
              style={{
                marginLeft: '0.5rem',
                backgroundColor: answers[q.key] === false ? '#c62828' : '#eee',
                color: answers[q.key] === false ? 'white' : 'black',
                border: '1px solid #ccc',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
              }}
            >
              No
            </button>
          </div>
        </div>
      ))}
      <button className="btn-primary" onClick={handleSubmit} disabled={!allAnswered || loading}>
        {loading ? 'Checking...' : 'See my result'}
      </button>
    </div>
  )
}

export default GateForm