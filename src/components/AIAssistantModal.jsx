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

  const quickPrompts = [
    "Why is my subsidy delayed?",
    "Subsidy for 3kW in Maharashtra",
    "What is NPCI bank seeding?",
    "What changed in Policy V2?"
  ]

  const handleSend = (textToSend) => {
    const query = textToSend || input
    if (!query.trim()) return

    const newMsgs = [...messages, { sender: 'user', text: query }]
    setMessages(newMsgs)
    if (!textToSend) setInput('')

    // Generate smart response based on keywords
    setTimeout(() => {
      let reply = ""
      const q = query.toLowerCase()

      if (q.includes('delay') || q.includes('missed') || q.includes('not received') || q.includes('pending')) {
        reply = "Subsidies are primarily delayed for 3 reasons: 1) Your bank account is not mapped on the NPCI Aadhaar mapper (68% of cases), 2) Your vendor has not uploaded the Project Commissioning Report (PCR) on the National Portal, or 3) DISCOM net-meter inspection is pending. You can use our 'Claim Pending Subsidy' section to lodge a direct escalation claim!"
      } else if (q.includes('3kw') || q.includes('3 kw') || q.includes('cost') || q.includes('subsidy')) {
        reply = "Under the PM-Surya Ghar scheme, a 3 kW rooftop solar system qualifies for a ₹78,000 central subsidy. In states like Maharashtra, an additional state top-up may apply. Total installation cost is around ₹1,95,000, bringing your net payable cost to ~₹1,17,000 to ₹1,40,000 depending on module selection."
      } else if (q.includes('npci') || q.includes('aadhaar') || q.includes('bank')) {
        reply = "NPCI Aadhaar seeding is mandatory because government solar subsidies are credited via Direct Benefit Transfer (DBT). Regular KYC is not enough; you must submit an 'Aadhaar Seeding / Mandate Form' at your bank branch or enable DBT in your mobile banking app."
      } else if (q.includes('v2') || q.includes('policy') || q.includes('version') || q.includes('change')) {
        reply = "Policy Version 2 (effective April 2026) standardized subsidies nationwide under PM-Surya Ghar with ₹30k for 1kW, ₹60k for 2kW, and ₹78k for 3kW+. It also mandates smart net-metering and reduces the DBT processing SLA to 15 days."
      } else {
        reply = "I understand your query regarding '" + query + "'. Under the current national solar guidelines, residential consumers are entitled to central subsidies up to ₹78,000 with net-metering facilities provided by your local DISCOM. You can check exact state numbers in the Subsidy Calculator above!"
      }

      setMessages([...newMsgs, { sender: 'ai', text: reply }])
    }, 600)
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
                <p>{m.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="quick-prompts-row">
          {quickPrompts.map((p, idx) => (
            <button key={idx} className="prompt-chip" onClick={() => handleSend(p)}>
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
          />
          <button type="submit" className="chat-send-btn" aria-label="Send">
            ➤
          </button>
        </form>

      </div>
    </div>
  )
}
