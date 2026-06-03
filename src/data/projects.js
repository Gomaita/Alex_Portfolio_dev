export const projectCategories = [
  'All',
  'API',
  'CRUD',
  'Frontend',
  'Tools',
  'Learning',
  'Database',
  'Security',
]

export const projects = [
  {
    id: 'market-api-dashboard',
    slug: 'market-api-dashboard',
    title: 'Market API Dashboard',
    subtitle: 'API data, loading states and chart rendering in one compact dashboard.',
    summary:
      'A crypto market dashboard built to practice external API calls, value formatting and readable chart UI.',
    description:
      'This project fetches market-style data, formats prices and percentage changes, and displays the result in cards and charts. The goal is to show a complete data flow without hiding the loading and error states that real interfaces need.',
    type: 'API',
    status: 'Completed',
    technologies: ['React', 'REST API', 'Recharts', 'async/await', 'Error states'],
    featured: true,
    category: 'API',
    skillsDemonstrated: [
      'Fetching remote data through a service layer',
      'Rendering loading, error and success states',
      'Formatting numbers for a financial interface',
      'Keeping charts responsive on small screens',
    ],
    technicalNotes:
      'The API logic lives outside the visual component. The UI focuses on derived display state, chart data and fallback messaging when the request is not available.',
    improvements: [
      'Add real historical market data',
      'Allow users to choose currencies',
      'Add watchlist persistence',
      'Improve chart tooltips for mobile',
    ],
    demoComponentKey: 'market',
    githubUrl: '',
  },
  {
    id: 'project-manager-crud',
    slug: 'project-manager-crud',
    title: 'Project Manager CRUD',
    subtitle: 'Client and admin project board with approval workflow and localStorage persistence.',
    summary:
      'A project management demo where clients submit project proposals and an admin reviews, approves and manages them.',
    description:
      'This demo simulates a client/admin project board. Clients can submit project proposals, while the admin can approve, reject, update status, control visibility and manage internal notes.',
    type: 'CRUD Demo',
    status: 'Completed',
    technologies: ['React', 'Forms', 'localStorage', 'Role-based UI', 'CRUD'],
    featured: true,
    category: 'CRUD',
    skillsDemonstrated: [
      'CRUD operations',
      'Role-based UI',
      'Client/admin views',
      'Approval workflow',
      'Form validation',
      'localStorage persistence',
      'Filtering and search',
      'Conditional rendering',
      'Data normalization',
    ],
    technicalNotes:
      'This demo uses localStorage to simulate a small project database. The client view only displays public approved projects, while the admin view can manage approval, visibility, status and internal notes.',
    improvements: [
      'Add real authentication',
      'Add backend API',
      'Add database persistence',
      'Add user accounts',
      'Add email notifications',
      'Add audit history',
    ],
    demoComponentKey: 'crud',
    githubUrl: '',
  },
  {
    id: 'weather-search-app',
    slug: 'weather-search-app',
    title: 'Weather Search App',
    subtitle: 'Search, validation and API-ready state handling.',
    summary:
      'A weather lookup interface prepared for API integration while still working with safe fallback data.',
    description:
      'The weather demo is built around user input, validation and request states. It can work without a private API key, which makes it useful for a public portfolio while keeping the service layer ready for OpenWeatherMap.',
    type: 'API',
    status: 'Completed',
    technologies: ['React', 'Forms', 'REST API', 'Validation', 'Fallback data'],
    featured: true,
    category: 'API',
    skillsDemonstrated: [
      'Validating a user search before making a request',
      'Handling empty, loading, error and success states',
      'Keeping API access inside a service module',
      'Using fallback data without showing fake unknown cities',
    ],
    technicalNotes:
      'The service checks for environment configuration and falls back to local demo data. The component stays focused on form interaction and rendering states.',
    improvements: [
      'Add a forecast view',
      'Add geolocation when the user allows it',
      'Add a Celsius/Fahrenheit switch',
      'Cache recent searches locally',
    ],
    demoComponentKey: 'weather',
    githubUrl: '',
  },
  {
    id: 'sql-query-playground',
    slug: 'sql-query-playground',
    title: 'SQL Query Playground',
    subtitle: 'A small SQL practice interface with static tables and prepared results.',
    summary:
      'A database-focused demo that simulates tables, queries and result sets without needing a backend.',
    description:
      'I built this demo to practice how SQL queries work with structured data: selecting columns, filtering rows, sorting results and understanding simple joins.',
    type: 'Database',
    status: 'Completed',
    technologies: ['React', 'SQL', 'Data Modeling', 'Tables', 'Filtering', 'Joins'],
    featured: true,
    category: 'Database',
    skillsDemonstrated: [
      'SQL query structure',
      'Filtering data',
      'Sorting data',
      'Grouping results',
      'Understanding joins',
      'Presenting tabular data in UI',
    ],
    technicalNotes:
      'This demo uses static data to simulate common database tables and predefined SQL queries. The goal is to explain database concepts visually before connecting to a real backend.',
    improvements: [
      'Connect to SQLite or PostgreSQL',
      'Add a real SQL editor',
      'Validate custom queries',
      'Add database schema diagrams',
      'Add backend API',
    ],
    demoComponentKey: 'sql',
    githubUrl: '',
  },
  {
    id: 'secure-users-roles-demo',
    slug: 'secure-users-roles-demo',
    title: 'Secure Users & Roles Demo',
    subtitle: 'User management demo with public/moderator views and password hashing concepts.',
    summary:
      'A frontend simulation of user registration, role-based views, local data storage and protected password records.',
    description:
      'I built this demo to practice how user data could be organized in an application: creating users, separating public and moderator views, storing data locally and showing why passwords should never be stored as plain text.',
    type: 'Security + Database Demo',
    status: 'Completed',
    technologies: [
      'React',
      'Web Crypto API',
      'localStorage',
      'Role-based UI',
      'Data Modeling',
      'Forms',
      'Validation',
    ],
    featured: true,
    category: 'Security',
    skillsDemonstrated: [
      'User data modeling',
      'Form validation',
      'Role-based rendering',
      'Password hashing concepts',
      'localStorage persistence',
      'Table filtering',
      'Conditional UI',
    ],
    technicalNotes:
      'This demo uses static/local data and browser-native crypto APIs to simulate how user records can be created and displayed through different permission views. It is not a production authentication system.',
    improvements: [
      'Move authentication to a backend',
      'Use a real database',
      'Add session handling',
      'Add audit logs',
      'Add server-side Argon2id or bcrypt password hashing',
      'Add real moderator permissions',
    ],
    demoComponentKey: 'secure-users',
    githubUrl: '',
  },
  {
    id: 'github-projects-explorer',
    slug: 'github-projects-explorer',
    title: 'GitHub Projects Explorer',
    subtitle: 'Public API data with search, sorting and fallback behavior.',
    summary:
      'A repository explorer used to practice public API consumption, filtering and list rendering.',
    description:
      'This project searches public GitHub repositories, normalizes the response and lets the user filter or sort the results. It also handles rate limits and unavailable data with a local fallback.',
    type: 'API',
    status: 'Completed',
    technologies: ['React', 'GitHub API', 'Search', 'Sorting', 'Dynamic lists'],
    featured: false,
    category: 'Tools',
    skillsDemonstrated: [
      'Consuming a public API',
      'Normalizing external data before rendering',
      'Filtering and sorting a dynamic list',
      'Handling empty users, API errors and rate limits',
    ],
    technicalNotes:
      'The service layer maps GitHub responses to the shape the UI expects. That keeps the component from depending on every detail of the API response.',
    improvements: [
      'Add repository detail panels',
      'Show language distribution',
      'Save favorite repositories',
      'Add pagination for larger profiles',
    ],
    demoComponentKey: 'github',
    githubUrl: '',
  },
  {
    id: 'programming-cheatsheets',
    slug: 'programming-cheatsheets',
    title: 'Programming Cheatsheets',
    subtitle: 'A data-driven reference area with searchable technical notes.',
    summary:
      'A quick-reference section for languages and tools, built with dynamic routes and reusable snippet cards.',
    description:
      'The cheatsheets are a practical learning tool. They keep syntax examples close to the portfolio and show how structured data can drive routes, cards, filters and detail pages.',
    type: 'Frontend',
    status: 'Completed',
    technologies: ['React', 'React Router', 'Search', 'Data mapping', 'Clipboard API'],
    featured: false,
    category: 'Learning',
    skillsDemonstrated: [
      'Rendering pages from structured data',
      'Using dynamic routes for detail views',
      'Filtering by category and search text',
      'Providing copyable code snippets',
    ],
    technicalNotes:
      'The content lives in a single data file. The index and detail pages reuse that structure instead of duplicating reference blocks in JSX.',
    improvements: [
      'Add more concise examples',
      'Add difficulty labels',
      'Add small practice prompts',
      'Add syntax highlighting if the project grows',
    ],
    demoComponentKey: 'cheatsheets',
    githubUrl: '',
  },
]

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug)
}
