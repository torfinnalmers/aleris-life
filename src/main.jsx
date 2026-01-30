import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import BlogIndex from './components/blog/BlogIndex.jsx'
import BlogPost from './components/blog/BlogPost.jsx'
import BlogFaq from './components/blog/BlogFaq.jsx'
import './App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/faq" element={<BlogFaq />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
