import { Link } from 'react-router-dom'
import BlogLayout from './BlogLayout'

function BlogFaq() {
  return (
    <BlogLayout>
      <article className="blog-post">
        <h1>FAQ</h1>
        <div className="post-content faq-content">

          <h2>About the project</h2>

          <h3>What is aleris.life?</h3>
          <p>A 12-week learning initiative exploring how AI can help people navigate Aleris services across Sweden, Norway, and Denmark.</p>

          <h3>Why are we building this?</h3>
          <p>People struggle to understand which specialist they need, how referrals work, what their insurance covers, and who to contact. Processes vary by country, insurance type, and care pathway. We're exploring if conversational AI can make this easier.</p>

          <h3>Who's working on it?</h3>
          <p>Torfinn (Design) and Mohan (Tech), with support from Aleris Group leadership.</p>

          <h3>How long will this take?</h3>
          <p>12 weeks of focused learning (Jan-Mar 2026), then we'll decide next steps based on what we learned.</p>

          <h2>Getting involved</h2>

          <h3>Can I test it?</h3>
          <p>The working demo is at <a href="https://aleris-life.vercel.app">aleris-life.vercel.app</a> - anyone can try it. We're especially interested in feedback from people who work directly with patients.</p>

          <h3>How can I contribute?</h3>
          <p>Right now we need insights about where navigation breaks down for patients. If that's something you see regularly in your work, reach out to Torfinn or Mohan.</p>

          <h3>Who should I contact?</h3>
          <p>Torfinn (Design) or Mohan (Tech). Contact details available through normal Aleris channels.</p>

          <h2>Timeline and scope</h2>

          <h3>When will this launch?</h3>
          <p>This is a learning phase, not a production launch. After 12 weeks we'll have clear answers about what scaling would require and whether to continue.</p>

          <h3>Will this replace [existing thing]?</h3>
          <p>No. This is a parallel learning initiative that doesn't disrupt existing systems. If it proves valuable, future integration would be planned carefully.</p>

          <h3>What happens after 12 weeks?</h3>
          <p>We'll have: a working prototype, clear technical requirements, identified content gaps, and concrete answers about next steps. Then we decide: continue, pivot, or stop.</p>

          <h2>Technical</h2>

          <h3>How does it work?</h3>
          <p>The assistant connects to live content from aleris.se, aleris.no, and aleris.dk via Optimizely's ContentGraph API. When someone asks a question, it searches relevant content and uses Claude AI to generate helpful responses.</p>

          <h3>What data does it use?</h3>
          <p>Only publicly available content from Aleris websites. No patient data, no internal systems, no personal information.</p>

          <h3>Is it secure?</h3>
          <p>We follow standard security practices for web applications. This is a prototype using public data only - no sensitive information is involved.</p>

        </div>
        <Link to="/blog" className="back-link">← Back to all updates</Link>
      </article>
    </BlogLayout>
  )
}

export default BlogFaq
