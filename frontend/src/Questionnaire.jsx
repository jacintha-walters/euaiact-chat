/**
 * Questionnaire - Step 2 of the assessment: the 50-question scored survey,
 * shown after a user is classified as high-risk in GateForm.
 *
 * Fetches question definitions from the backend (GET /api/questionnaire/
 * questions), gives a page per section, and posts
 * answers to /api/questionnaire/submit for scoring. On success, shows the
 * score with a bar chart and hands the full result to ChatInterface (Step
 * 3) so the RAG chat can ground its answers in the user's actual answers.
 * Includes a demo autofill button for quick end-to-end testing.
 */

import { useState, useEffect } from 'react'
import ChatInterface from './ChatInterface.jsx'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

function generateDemoAnswers(questions) {
  const demoAnswers = {}
  for (const q of questions) {
    if (q.type === 'multi_select') {
      // pick roughly half the options, at least 1
      const shuffled = [...q.options].sort(() => Math.random() - 0.5)
      const count = Math.max(1, Math.floor(q.options.length / 2))
      demoAnswers[q.id] = shuffled.slice(0, count).map((o) => o.label)
    } else {
      // weighted random: favor higher-scoring options, but not exclusively --
      // creates a realistic "decent but imperfect" demo profile
      const sorted = [...q.options].sort((a, b) => b.points - a.points)
      const roll = Math.random()
      let index
      if (roll < 0.45) index = 0
      else if (roll < 0.75) index = Math.min(1, sorted.length - 1)
      else index = Math.floor(Math.random() * sorted.length)
      demoAnswers[q.id] = sorted[index].label
    }
  }
  return demoAnswers
}

function shortenSection(name) {
  if (name.startsWith('Data')) return 'Data & Docs'
  if (name.startsWith('Model Risk')) return 'Model Risk'
  if (name.startsWith('Development')) return 'Dev Lifecycle'
  return name
}


function Questionnaire() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/questionnaire/questions`)
      .then((res) => res.json())
      .then((data) => setQuestions(data))
  }, [])

    useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pageIndex])

  // Group the flat question list into one array per section, in the order
  // sections first appear. This turns 50 questions into 3 pages automatically
  // -- if you ever add a 4th section in the backend, a 4th page appears here
  // with no frontend changes needed.
  const sections = []
  for (const q of questions) {
    let section = sections.find((s) => s.name === q.section)
    if (!section) {
      section = { name: q.section, questions: [] }
      sections.push(section)
    }
    section.questions.push(q)
  }

  const currentSection = sections[pageIndex]
  const isLastPage = pageIndex === sections.length - 1

  const handleSingleAnswer = (questionId, label) => {
    setAnswers((prev) => ({ ...prev, [questionId]: label }))
  }

  const handleMultiSelectToggle = (questionId, label) => {
    setAnswers((prev) => {
      const current = prev[questionId] || []
      const alreadySelected = current.includes(label)
      const updated = alreadySelected
        ? current.filter((l) => l !== label)
        : [...current, label]
      return { ...prev, [questionId]: updated }
    })
  }

  const isAnswered = (q) => {
    const a = answers[q.id]
    if (q.type === 'multi_select') return Array.isArray(a) && a.length > 0
    return a !== undefined
  }

  const handleDemoFill = () => {
    const demoAnswers = generateDemoAnswers(questions)
    setAnswers(demoAnswers)
    handleSubmit(demoAnswers)
  }

  const currentSectionAnswered = currentSection && currentSection.questions.every(isAnswered)
  const allAnswered = questions.length > 0 && questions.every(isAnswered)

  const handleSubmit = async (answersOverride) => {
    const answersToSubmit = answersOverride || answers
    setLoading(true)
    const response = await fetch(`${API_BASE_URL}/api/questionnaire/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answersToSubmit }),
    })
    const data = await response.json()
    setResult(data)
    setLoading(false)
  }

  if (result) {
    return (
      <div className="grid md:grid-cols-[1fr_1.5fr] gap-15 xl:gap-30">
        <div className="flex flex-col gap-8">
          <h2 className="text-xl font-bold">Your Compliance Score</h2>

          <div className="h-[220px] w-full">
            <ResponsiveContainer>
              <BarChart data={result.sections.map((s) => ({ ...s, shortName: shortenSection(s.section) }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shortName" fontSize={12} />
                <YAxis domain={[0, 100]} unit="%" fontSize={12} />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Score']}
                  labelFormatter={(label, payload) => payload[0]?.payload.section || label}
                />
                <Bar dataKey="score_percent" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-muted-foreground">
            You scored <strong className="text-foreground">{result.overall_percent}%</strong> overall.
            This chatbot is grounded in the actual text of the EU AI Act, and it already
            knows how you answered every question — so you can ask it about specific gaps
            and it'll point you to exactly what needs to improve, with the right articles
            cited.
          </p>
        </div>

        <ChatInterface scoreResult={result} />
      </div>
    )
  }

  if (questions.length === 0) {
    return <p>Loading questions...</p>
  }

  return (
    <div>
      <div className="mb-6 text-right">
        <Button variant="outline" size="sm" onClick={handleDemoFill}>
          Fill it in for me — I just want a demo
        </Button>
      </div>

      {/* Page indicator */}
      <div className="mb-4 text-muted-foreground">
        Section {pageIndex + 1} of {sections.length}: <strong>{currentSection.name}</strong>
      </div>

      {currentSection.questions.map((q) => (
        <div key={q.id} className="mb-6 flex flex-col gap-4 p-4 md:p-6 rounded-2xl bg-gray-100">
          <p>{q.text}</p>

          {q.type === 'multi_select' ? (
            q.options.map((opt) => {
              const selected = (answers[q.id] || []).includes(opt.label)
              return (
                <label key={opt.label} className="mb-1 block cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => handleMultiSelectToggle(q.id, opt.label)}
                    className="mr-2"
                  />
                  {opt.label}
                </label>
              )
            })
        ) : q.type === 'likert' ? (
            <div className="mt-2 flex items-center gap-2">
              <span className="w-[90px] text-xs text-muted-foreground">Strongly disagree</span>
              <div className="flex flex-1 overflow-hidden rounded-full border border-border">
                {[...q.options].reverse().map((opt, i, arr) => (
                  <button
                    key={opt.label}
                    onClick={() => handleSingleAnswer(q.id, opt.label)}
                    title={opt.label}
                    className={cn(
                      'h-10 min-w-0 flex-1 cursor-pointer border-r border-border p-0 leading-10 last:border-r-0',
                      answers[q.id] === opt.label
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-muted/70'
                    )}
                  >
                    {opt.label === 'Neutral' ? '—' : ''}
                  </button>
                ))}
              </div>
              <span className="w-[90px] text-right text-xs text-muted-foreground">
                Strongly agree
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt) => (
                 <button
                  key={opt.label}
                  onClick={() => handleSingleAnswer(q.id, opt.label)}
                  className={cn(
                    'cursor-pointer rounded-full border border-border px-5 py-1.5 text-sm',
                    answers[q.id] === opt.label
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white/50 text-foreground'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="mt-8">
        {pageIndex > 0 && (
          <Button variant="outline" className="mr-2" onClick={() => setPageIndex((p) => p - 1)}>
            Back
          </Button>
        )}
        {!isLastPage && (
          <Button onClick={() => setPageIndex((p) => p + 1)} disabled={!currentSectionAnswered}>
            Next
          </Button>
        )}
        {isLastPage && (
          <Button onClick={() => handleSubmit()} disabled={!allAnswered || loading}>
            {loading ? 'Scoring...' : 'See my score'}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Questionnaire