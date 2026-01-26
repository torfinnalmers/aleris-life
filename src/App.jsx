import { useState } from 'react'
import Landing from './components/Landing'
import Chat from './components/Chat'

function App() {
  const [showChat, setShowChat] = useState(false)
  const [initialQuery, setInitialQuery] = useState('')

  const handleStartChat = (query = '') => {
    setInitialQuery(query)
    setShowChat(true)
  }

  const handleBackToLanding = () => {
    setShowChat(false)
    setInitialQuery('')
  }

  if (showChat) {
    return <Chat initialQuery={initialQuery} onBack={handleBackToLanding} />
  }

  return <Landing onStartChat={handleStartChat} />
}

export default App
