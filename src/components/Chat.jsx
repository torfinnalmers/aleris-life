import { useChat } from 'ai/react'
import { useEffect, useRef } from 'react'

function Chat({ initialQuery, onBack }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hej! Jag hjälper dig att hitta rätt vård hos Aleris. Berätta vad du behöver hjälp med så guidar jag dig vidare.'
      }
    ],
  })

  const messagesEndRef = useRef(null)
  const initialQuerySent = useRef(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send initial query if provided
  useEffect(() => {
    if (initialQuery && !initialQuerySent.current) {
      initialQuerySent.current = true
      setInput(initialQuery)
      // Small delay to ensure the input is set before submitting
      setTimeout(() => {
        const form = document.querySelector('.chat-input-form')
        if (form) form.requestSubmit()
      }, 100)
    }
  }, [initialQuery, setInput])

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
