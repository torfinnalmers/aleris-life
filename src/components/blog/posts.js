// Blog posts registry - add new posts here
export const posts = [
  {
    slug: 'sprint-0-why-were-building-aleris-life',
    title: "Sprint 0: Why we're building aleris.life",
    date: '2026-01-30',
    authors: 'Torfinn & Mohan',
    preview: "People get lost navigating Aleris services across countries. Different referral processes, insurance types, booking systems. Result: confusion, missed appointments, unnecessary contacts. We're building a conversational assistant that helps people understand their options.",
  },
]

export function getPostBySlug(slug) {
  return posts.find(p => p.slug === slug)
}

export function getAllPosts() {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))
}
