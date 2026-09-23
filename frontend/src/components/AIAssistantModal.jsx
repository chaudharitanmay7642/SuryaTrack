import { useState, useRef, useEffect } from 'react'

export function AIAssistantModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your SolarTrack AI policy assistant. How can I help you with solar subsidies, net metering, or delayed payments today?'
    }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const [loading, setLoading] = useState(false)
  const [quickPrompts, setQuickPrompts] = useState([
    "Why is my subsidy delayed?",
    "Subsidy for 3kW in Maharashtra",
    "What is NPCI bank seeding?",
    "What changed in Policy V2?"
  ])

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim()
    if (!query || loading) return

    const newMsgs = [...messages, { sender: 'user', text: query }]
    setMessages(newMsgs)
    if (!textToSend) setInput('')
    setLoading(true)

    fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query })
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (data.success && data.reply) {
          setMessages([...newMsgs, { sender: 'ai', text: data.reply }])
          if (Array.isArray(data.suggestedQuestions) && data.suggestedQuestions.length > 0) {
            setQuickPrompts(data.suggestedQuestions)
          }
        } else {
          setMessages([...newMsgs, { sender: 'ai', text: data.error || 'Unable to process query.' }])
        }
      })
      .catch(() => {
        setMessages([
          ...newMsgs,
          { 
            sender: 'ai', 
            text: 'I am currently unable to reach the AI policy server. Please ensure the SuryaTrack backend is running at http://localhost:5000.' 
          }
        ])
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (!isOpen) return null

  return (
    <div className="ai-chat-modal" role="dialog" aria-label="SolarTrack AI Assistant">
      <div className="chat-container">
        
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-title">
            <span className="bot-icon">🤖</span>
            <div>
              <h4>SolarTrack AI Assistant</h4>
              <span className="bot-status">Online • Instant Policy Guidance</span>
            </div>
          </div>
          <button className="chat-close-btn" onClick={onClose} aria-label="Close Chat">
            ✕
          </button>
        </div>

        {/* Chat Messages */}
        <div className="chat-body">
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-bubble-row ${m.sender}`}>
              {m.sender === 'ai' && <div className="chat-avatar">🌱</div>}
              <div className="chat-bubble">
                <p style={{ whiteSpace: 'pre-line' }}>{m.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble-row ai">
              <div className="chat-avatar">🌱</div>
              <div className="chat-bubble" style={{ opacity: 0.8 }}>
                <p style={{ fontStyle: 'italic', color: '#64748b' }}>Consulting policy knowledgebase...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="quick-prompts-row">
          {quickPrompts.map((p, idx) => (
            <button 
              key={idx} 
              className="prompt-chip" 
              onClick={() => handleSend(p)}
              disabled={loading}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form className="chat-input-bar" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
          <input
            type="text"
            placeholder="Ask about subsidies, delays, net-metering..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="chat-send-btn" aria-label="Send" disabled={loading || !input.trim()}>
            ➤
          </button>
        </form>

      </div>
    </div>
  )
}
