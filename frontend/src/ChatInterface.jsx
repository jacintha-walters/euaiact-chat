/**
 * ChatInterface - RAG-grounded chat UI, supporting two modes:
 *
 * 1. Scored mode (scoreResult prop provided): shown after a user completes
 *    the high-risk questionnaire. Opens with a score-based intro, sends the
 *    full score + every answered question with each request so the LLM can
 *    ground advice in the user's actual results, and auto-triggers a
 *    per-section weakness summary before the user types anything.
 *
 * 2. General Q&A mode (no scoreResult): used for the "I just have a
 *    question" path with no completed assessment. Opens with a plain
 *    welcome message, no auto-triggered summary, and score_result is
 *    omitted from requests entirely.
 */

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const SUMMARY_DISPLAY_TEXT = "Can you summarize my biggest weaknesses per section?"
const SUMMARY_PROMPT = `Summarize my biggest weaknesses per section based on my questionnaire answers. Use the actual answers provided to identify specific, real issues -- 
not generic topic-level statements. Answer ONLY in this exact format, nothing else -- no introduction, no conclusion, no extra explanation:

**[Section name]**
- [specific weakness, a few words]
- [specific weakness, a few words]
- [specific weakness, a few words]

Repeat that block for all three sections. Keep every bullet short -- a phrase, not a sentence.`

const GENERAL_INTRO_MESSAGE = "Hi! I can answer questions about the EU AI Act — ask me anything, like \"is my chatbot considered high-risk?\" or \"what does Article 10 require?\""

function getScoredIntroMessage(overallPercent) {
  if (overallPercent >= 80) {
    return `You scored **${overallPercent}%** compliance — that's really good! Let's look at a few final improvements.`
  }
  if (overallPercent >= 50) {
    return `You scored **${overallPercent}%** compliance — a solid start, but there's real room to improve. Let's work through it together.`
  }
  return `You scored **${overallPercent}%** compliance — that's not great yet, but let's improve it together.`
}

function ChatInterface({ scoreResult }) {
  const hasScore = scoreResult != null

  const [messages, setMessages] = useState(() => [
    {
      role: 'assistant',
      content: hasScore ? getScoredIntroMessage(scoreResult.overall_percent) : GENERAL_INTRO_MESSAGE,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const hasAutoSent = useRef(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Only auto-trigger the weakness summary in scored mode -- general Q&A
  // mode just waits for the user's own first question.
  useEffect(() => {
    if (hasScore && !hasAutoSent.current) {
      hasAutoSent.current = true
      sendMessage(SUMMARY_PROMPT, SUMMARY_DISPLAY_TEXT)
    }
  }, [])

  const sendMessage = async (question, displayText = question) => {
    if (loading) return

    const userMessage = { role: 'user', content: displayText }
    const historyBeforeThis = messages
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    const requestBody = {
      question,
      conversation_history: historyBeforeThis,
    }
    if (hasScore) {
      requestBody.score_result = scoreResult
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer, sources: data.sources }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Sorry, something went wrong sending that message. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSend = () => {
    const question = input.trim()
    if (!question) return
    sendMessage(question)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{ marginTop: '1.5rem', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', height: '500px' }}>
      <div style={{ padding: '0.75rem', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
        {hasScore ? 'Ask about your results' : 'Ask about the EU AI Act'}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '1rem', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <div
              style={{
                display: 'inline-block',
                maxWidth: '80%',
                padding: '0.6rem 0.9rem',
                borderRadius: '10px',
                backgroundColor: msg.role === 'user' ? 'var(--navy, #1976d2)' : '#f0f0f0',
                color: msg.role === 'user' ? 'white' : 'black',
                textAlign: 'left',
              }}
            >
              {msg.role === 'assistant' ? (
                <div className="markdown-answer">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
              )}
            </div>
            {msg.sources && msg.sources.length > 0 && (
              <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.3rem' }}>
                Sources: {msg.sources.map((s) => `Article ${s.article_number}`).join(', ')}
              </div>
            )}
          </div>
        ))}
        {loading && <p style={{ color: '#888' }}>Thinking... this can take a few seconds.</p>}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: 'flex', padding: '0.75rem', borderTop: '1px solid #eee' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          rows={1}
          maxLength={2000}
          style={{ flex: 1, padding: '0.5rem', resize: 'none', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <span style={{ fontSize: '0.75rem', color: input.length > 1800 ? '#c62828' : '#999', marginLeft: '0.5rem', alignSelf: 'flex-end' }}>
          {input.length}/2000
        </span>
        <button onClick={handleSend} disabled={loading} style={{ marginLeft: '0.5rem' }}>
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatInterface