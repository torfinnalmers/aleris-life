import { useState, useRef, useEffect } from 'react'

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hej! Jag kan svara på frågor om Aleris vårdtjänster. Vad vill du veta?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      // TODO: Replace with actual AI API call
      const response = await mockResponse(userMessage)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Något gick fel. Försök igen.' }])
    } finally {
      setLoading(false)
    }
  }

  // Placeholder until AI backend is connected
  async function mockResponse(question) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return `Detta är ett platshållarsvar. AI-backend behöver konfigureras för att svara på: "${question}"`
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Aleris Life</h1>
        <p>Din hälsoassistent</p>
      </header>

      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="message assistant loading">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ställ en fråga om Aleris..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Skicka
        </button>
      </form>
    </div>
  )
}

export default App
