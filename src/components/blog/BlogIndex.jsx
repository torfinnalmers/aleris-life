import { Link } from 'react-router-dom'
import BlogLayout from './BlogLayout'
import { getAllPosts } from './posts'

function BlogIndex() {
  const posts = getAllPosts()

  return (
    <BlogLayout>
      <div className="blog-index">
        <h1>aleris.life blog</h1>
        <p className="blog-intro">
          Following our 12-week journey building conversational care navigation.
        </p>

        <Link to="/blog/faq" className="faq-link">
          FAQ: About this project
        </Link>

        <div className="post-list">
          {posts.map(post => (
            <article key={post.slug} className="post-card">
              <h2>
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <div className="post-meta">
                {new Date(post.date).toLocaleDateString('sv-SE')} · {post.authors}
              </div>
              <p className="post-preview">{post.preview}</p>
              <Link to={`/blog/${post.slug}`} className="read-more">
                Read more
              </Link>
            </article>
          ))}
        </div>
      </div>
    </BlogLayout>
  )
}

export default BlogIndex
