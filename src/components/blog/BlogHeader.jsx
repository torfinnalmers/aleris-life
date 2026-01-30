import { Link } from 'react-router-dom'

function BlogHeader() {
  return (
    <header className="blog-header">
      <Link to="/blog" className="blog-logo">
        <img src="/aleris-logo.svg" alt="Aleris" />
      </Link>
      <Link to="/" className="blog-nav-btn">Chat</Link>
    </header>
  )
}

export default BlogHeader
