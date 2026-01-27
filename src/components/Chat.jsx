import { useEffect, useRef, useState } from 'react'

// Check if we're in local dev (no API available)
const isLocalDev = window.location.hostname === 'localhost'

function Chat({ initialQuery, onBack }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hej! Jag hjälper dig att hitta rätt vård hos Aleris. Berätta vad du behöver hjälp med så guidar jag dig vidare.'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => setInput(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const text = input.trim()
    setInput('')
    sendMessage(text)
  }

  const messagesEndRef = useRef(null)
  const initialQuerySent = useRef(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send initial query if provided
  useEffect(() => {
    if (initialQuery && !initialQuerySent.current) {
      initialQuerySent.current = true
      // Directly trigger the send with initial query
      sendMessage(initialQuery)
    }
  }, [initialQuery])

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return

    const userMessage = { id: Date.now().toString(), role: 'user', content: text.trim() }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    if (isLocalDev) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Tack för din fråga! I produktionsmiljön skulle jag hjälpa dig med: "${userMessage.content}"\n\nFör att testa med riktig AI, deploya till Vercel med din Anthropic API-nyckel.\n\n📞 Sverige: 010-350 00 00\n📞 Norge: 22 45 45 45\n📞 Danmark: 38 17 00 00`
      }
      setMessages(prev => [...prev, mockResponse])
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
        }),
      })

      if (!response.ok) throw new Error('API error')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: '' }
      setMessages(prev => [...prev, assistantMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('0:')) {
            const text = JSON.parse(line.slice(2))
            assistantMessage.content += text
            setMessages(prev => prev.map(m =>
              m.id === assistantMessage.id ? { ...m, content: assistantMessage.content } : m
            ))
          }
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Något gick fel. Försök igen eller kontakta oss direkt på telefon.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <button className="back-btn" onClick={onBack}>
          ← Tillbaka
        </button>
        <div className="chat-header-title">
          <img src="/aleris-icon.svg" alt="Aleris" className="chat-logo" />
          <span>Aleris Life</span>
        </div>
        <div className="header-spacer"></div>
      </header>

      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="message-avatar">
                <img src="/aleris-icon.svg" alt="" />
              </div>
            )}
            <div className="message-content">
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="message assistant">
            <div className="message-avatar">
              <img src="/aleris-icon.svg" alt="" />
            </div>
            <div className="message-content loading">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Skriv ditt meddelande..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Skicka
        </button>
      </form>

      <p className="chat-disclaimer">
        Detta är vägledning, inte medicinsk rådgivning. Kontakta alltid vården vid akuta besvär.
      </p>
    </div>
  )
}

export default Chat
