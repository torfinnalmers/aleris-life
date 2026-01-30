import { useParams, Link } from 'react-router-dom'
import BlogLayout from './BlogLayout'
import { getPostBySlug } from './posts'

// Import MDX content
import Sprint0 from '../../../content/blog/sprint-0-why-were-building-aleris-life.mdx'

const postComponents = {
  'sprint-0-why-were-building-aleris-life': Sprint0,
}

function BlogPost() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)
  const Content = postComponents[slug]

  if (!post || !Content) {
    return (
      <BlogLayout>
        <div className="blog-post">
          <h1>Post not found</h1>
          <Link to="/blog" className="back-link">Back to all updates</Link>
        </div>
      </BlogLayout>
    )
  }

  return (
    <BlogLayout>
      <article className="blog-post">
        <h1>{post.title}</h1>
        <div className="post-meta">
          {new Date(post.date).toLocaleDateString('sv-SE')} · {post.authors}
        </div>
        <div className="post-content">
          <Content />
        </div>
        <Link to="/blog" className="back-link">← Back to all updates</Link>
      </article>
    </BlogLayout>
  )
}

export default BlogPost
