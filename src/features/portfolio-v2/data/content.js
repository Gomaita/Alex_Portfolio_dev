export const selectedWork = [
  {
    id: 'inbox', number: '01', title: 'InboxFlow AI', category: 'AI & automation',
    description: 'From a messy message to a little more clarity. Extract priorities, tasks and suggested replies in a single workflow.',
    note: 'Portfolio demo · Groq integration with a rule-based fallback.',
    technologies: ['React', 'Groq API', 'Pages Functions'], href: '/ai-message-processor',
  },
  {
    id: 'nutrition', number: '02', title: 'NutriCore', category: 'Web application',
    description: 'Meal plans, training routines and progress tracking, brought together in an editable application.',
    note: 'Local demo · Data stays in your browser.',
    technologies: ['React', 'Recharts', 'localStorage'], href: '/nutricore',
  },
  {
    id: 'sql', number: '03', title: 'SQL Query Playground', category: 'Data & interactive learning',
    description: 'A hands-on look at how queries shape data, from simple filters to joins and grouped results.',
    note: 'Learning demo · Prepared results, without a database connection.',
    technologies: ['React', 'SQL concepts', 'Data modeling'], href: '/portfolio/sql-query-playground',
  },
]

export const toolGroups = [
  { title: 'Programming', items: ['JavaScript / TypeScript', 'Python', 'Java', 'C#', 'C++'] },
  { title: 'Web development', items: ['React', 'HTML & CSS', 'REST APIs'] },
  { title: 'Backend & data', items: ['SQL', 'Oracle', 'PostgreSQL', 'Cloudflare Functions', 'D1'] },
  { title: 'Development tools', items: ['Git', 'GitHub', 'Vite', 'Tailwind CSS'] },
]
