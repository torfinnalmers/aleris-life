import { useState, useEffect } from 'react'

const PLACEHOLDER_QUERIES = [
  "Jag behöver en second opinion...",
  "I need to see a dermatologist...",
  "Jeg har vondt i kneet...",
  "Vad kostar en MR-undersökning?",
  "Hvor kan jeg få fertilitetshjelp?",
  "I want to book a health check...",
  "Jeg vil gerne tale med en psykolog...",
  "Hur lång är väntetiden för...",
]

function Landing({ onStartChat }) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_QUERIES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onStartChat(inputValue)
  }

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="logo">
          <img src="/aleris-logo.svg" alt="Aleris" className="logo-img" />
        </div>
        <button className="login-btn">Logga in</button>
      </header>

      <main className="landing-main">
        <div className="specialists-row">
          <div className="specialist-avatar aleris-icon">
            <img src="/aleris-icon.svg" alt="" />
          </div>
          <div className="specialist-avatar">
            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face" alt="Specialist" />
          </div>
          <div className="specialist-avatar">
            <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face" alt="Specialist" />
          </div>
          <div className="specialist-avatar">
            <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop&crop=face" alt="Specialist" />
          </div>
        </div>

        <h1 className="landing-headline">
          Vi guidar dig till rätt vård – <span className="highlight">snabbt, tryggt och personligt</span>
        </h1>

        <p className="landing-subtext">
          Här får du vägledning direkt. Vi lyssnar på vad du behöver och sätter dig i kontakt med rätt specialist hos oss.
        </p>

        <p className="landing-price">
          Att träffa en av våra specialister kostar 800 kr per tillfälle.
        </p>

        <form onSubmit={handleSubmit} className="landing-form">
          <div className="input-wrapper">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="landing-input"
            />
            {!inputValue && (
              <span className="animated-placeholder" key={placeholderIndex}>
                {PLACEHOLDER_QUERIES[placeholderIndex]}
              </span>
            )}
          </div>
          <button type="submit" className="cta-btn">
            Kom igång <span className="arrow">→</span>
          </button>
        </form>

        <p className="gdpr-note">🔒 GDPR-säker</p>
      </main>

      <section className="landing-bottom">
        <h2>
          <span className="highlight-dark">Smart teknik</span> – för att du ska få <span className="highlight">trygg hjälp.</span>
        </h2>
        <p>
          Vi kombinerar AI med medicinsk expertis för att ge dig snabb och pålitlig vägledning till rätt vård.
        </p>
      </section>
    </div>
  )
}

export default Landing
