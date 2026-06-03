export const sqlTables = {
  users: [
    { id: 1, name: 'Alex', role: 'Junior Developer', location: 'Spain' },
    { id: 2, name: 'Marta', role: 'Frontend Mentor', location: 'Remote' },
  ],
  projects: [
    { id: 1, user_id: 1, title: 'Market API Dashboard', category: 'API', status: 'Completed' },
    { id: 2, user_id: 1, title: 'Project Manager CRUD', category: 'CRUD', status: 'In Progress' },
    { id: 3, user_id: 1, title: 'SQL Query Playground', category: 'Database', status: 'Completed' },
    { id: 4, user_id: 2, title: 'Code Review Notes', category: 'Learning', status: 'Planned' },
  ],
  applications: [
    { id: 1, company: 'Studio Labs', position: 'Frontend Intern', status: 'Sent', date: '2026-05-28' },
    { id: 2, company: 'DataWorks', position: 'Junior Developer', status: 'Preparing', date: '2026-06-02' },
    { id: 3, company: 'Pixel Systems', position: 'Web Developer', status: 'Interview', date: '2026-05-18' },
  ],
  skills: [
    { id: 1, name: 'React', category: 'Frontend', level: 'Practicing' },
    { id: 2, name: 'SQL', category: 'Database', level: 'Practicing' },
    { id: 3, name: 'Java', category: 'Backend basics', level: 'Learning' },
    { id: 4, name: 'Git', category: 'Tools', level: 'Practicing' },
    { id: 5, name: 'Tailwind', category: 'Frontend', level: 'Practicing' },
  ],
}

export const sqlQueries = [
  {
    id: 'all-projects',
    title: 'Select all projects',
    concept: 'SELECT',
    sql: 'SELECT * FROM projects;',
    explanation: 'Shows every project stored in the projects table.',
    result: sqlTables.projects,
  },
  {
    id: 'completed-projects',
    title: 'Filter completed projects',
    concept: 'WHERE',
    sql: "SELECT title, category, status\nFROM projects\nWHERE status = 'Completed';",
    explanation: 'Filters rows using a WHERE condition.',
    result: sqlTables.projects
      .filter((project) => project.status === 'Completed')
      .map(({ title, category, status }) => ({ title, category, status })),
  },
  {
    id: 'applications-by-date',
    title: 'Sort applications by date',
    concept: 'ORDER BY',
    sql: 'SELECT company, position, status, date\nFROM applications\nORDER BY date DESC;',
    explanation: 'Sorts job applications by most recent date.',
    result: [...sqlTables.applications]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(({ company, position, status, date }) => ({ company, position, status, date })),
  },
  {
    id: 'skills-by-category',
    title: 'Group skills by category',
    concept: 'GROUP BY',
    sql: 'SELECT category, COUNT(*) AS total\nFROM skills\nGROUP BY category;',
    explanation: 'Groups skills by category and counts how many are in each group.',
    result: Object.entries(
      sqlTables.skills.reduce((groups, skill) => {
        groups[skill.category] = (groups[skill.category] || 0) + 1
        return groups
      }, {}),
    ).map(([category, total]) => ({ category, total })),
  },
  {
    id: 'users-and-projects',
    title: 'Join users and projects',
    concept: 'JOIN',
    sql: 'SELECT users.name, projects.title, projects.status\nFROM users\nJOIN projects ON users.id = projects.user_id;',
    explanation: 'Combines users and projects using a shared id.',
    result: sqlTables.projects.map((project) => {
      const user = sqlTables.users.find((item) => item.id === project.user_id)
      return {
        name: user?.name || 'Unknown',
        title: project.title,
        status: project.status,
      }
    }),
  },
]
