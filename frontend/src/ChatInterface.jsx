/**
 * ChatInterface - RAG-grounded chat UI, supporting two modes:
 * scored (after questionnaire) and general Q&A (standalone).
 * Rebuilt using shadcn/ui components.
 */

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, MessageCircle } from "lucide-react"

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

    const requestBody = { question, conversation_history: historyBeforeThis }
    if (hasScore) requestBody.score_result = scoreResult

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`)

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
    <Card className="mt-6 flex flex-col h-[500px] overflow-hidden p-0 rounded-3xl shadow-lg">
      <div className="px-4 py-3 border-b font-semibold text-sm">
        {hasScore ? 'Ask about your results' : 'Ask about the EU AI Act'}
      </div>

      <ScrollArea className="flex-1 min-h-0 px-4">
        <div className="py-4 space-y-4">
          {messages.length === 1 && (
            <div className="flex flex-col items-center justify-center text-center py-12 gap-2">
              <div className="rounded-full bg-muted p-3">
                <MessageCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="font-semibold">Ask about the EU AI Act</p>
              <p className="text-sm text-muted-foreground max-w-[240px]">
                {hasScore ? "Ask about your results, or anything else." : "Ask anything about the Act — press send to start."}
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[80%]">
                <div
                  className={`rounded-2xl px-4 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  )}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {msg.sources.map((s, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs font-normal rounded-full">
                        Article {s.article_number}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <p className="text-sm text-muted-foreground animate-pulse">
              Thinking... this can take a few seconds.
            </p>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

<div className="p-3 border-t">
        <div className="flex items-end gap-2 rounded-3xl border bg-muted/50 p-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            rows={1}
            maxLength={2000}
            className="min-h-0 resize-none border-none shadow-none bg-transparent focus-visible:ring-0"
          />
          <Button
            onClick={handleSend}
            disabled={loading}
            size="icon"
            className="rounded-full shrink-0"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ChatInterface