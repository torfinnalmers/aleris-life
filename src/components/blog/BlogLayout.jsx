import BlogHeader from './BlogHeader'

function BlogLayout({ children }) {
  return (
    <div className="blog-container">
      <BlogHeader />
      <main className="blog-main">
        {children}
      </main>
    </div>
  )
}

export default BlogLayout
