export const secureUsersStorageKey = 'alex-portfolio-secure-users-demo'

export const availableRoles = ['Developer', 'Designer', 'Analyst', 'Moderator']

export const availableStatuses = ['Active', 'Pending', 'Suspended']

export const suggestedSkills = [
  'React',
  'SQL',
  'APIs',
  'UI',
  'CSS',
  'Figma',
  'Reports',
  'Data',
  'Security',
  'Admin',
  'QA',
  'Learning',
]

export const securityDemoNote =
  'This is a frontend educational demo. Real applications should hash passwords on the server using algorithms such as Argon2id, bcrypt or PBKDF2 with proper parameters.'

export const initialSecureUsers = [
  {
    id: 'usr-alex-demo',
    name: 'Alex Gomez',
    email: 'alex.demo@example.com',
    role: 'Developer',
    status: 'Active',
    location: 'Alicante, Spain',
    skills: ['React', 'SQL', 'APIs'],
    publicProfile: true,
    createdAt: '2026-01-12T10:30:00.000Z',
    lastLogin: '2026-06-01T16:20:00.000Z',
    internalNote: 'Demo developer profile used to test public portfolio cards.',
  },
  {
    id: 'usr-marina-demo',
    name: 'Marina Ruiz',
    email: 'marina.demo@example.com',
    role: 'Designer',
    status: 'Active',
    location: 'Valencia, Spain',
    skills: ['UI', 'CSS', 'Figma'],
    publicProfile: true,
    createdAt: '2026-02-04T09:15:00.000Z',
    lastLogin: '2026-05-28T11:10:00.000Z',
    internalNote: 'Public design profile for checking role filters.',
  },
  {
    id: 'usr-daniel-demo',
    name: 'Daniel Ortega',
    email: 'daniel.demo@example.com',
    role: 'Analyst',
    status: 'Pending',
    location: 'Madrid, Spain',
    skills: ['SQL', 'Reports', 'Data'],
    publicProfile: true,
    createdAt: '2026-03-18T14:45:00.000Z',
    lastLogin: 'Never',
    internalNote: 'Pending account used to review moderation states.',
  },
  {
    id: 'usr-laura-demo',
    name: 'Laura Chen',
    email: 'laura.demo@example.com',
    role: 'Moderator',
    status: 'Active',
    location: 'Barcelona, Spain',
    skills: ['Security', 'Admin', 'QA'],
    publicProfile: false,
    createdAt: '2026-04-02T12:05:00.000Z',
    lastLogin: '2026-06-02T08:40:00.000Z',
    internalNote: 'Private moderator profile for checking hidden client data.',
  },
]
