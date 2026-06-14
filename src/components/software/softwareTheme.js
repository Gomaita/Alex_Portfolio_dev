export const accentStyles = {
  green: {
    glow: 'from-emerald-500/18 via-lime-400/10 to-transparent',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200/80 dark:border-emerald-500/25',
    chip: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200',
    button: 'from-emerald-500 to-lime-500',
  },
  cyan: {
    glow: 'from-cyan-500/18 via-sky-400/10 to-transparent',
    text: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-200/80 dark:border-cyan-500/25',
    chip: 'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-500/25 dark:bg-cyan-500/10 dark:text-cyan-200',
    button: 'from-cyan-500 to-sky-500',
  },
  violet: {
    glow: 'from-violet-500/18 via-fuchsia-400/10 to-transparent',
    text: 'text-violet-700 dark:text-violet-300',
    border: 'border-violet-200/80 dark:border-violet-500/25',
    chip: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-200',
    button: 'from-violet-500 to-fuchsia-500',
  },
  orange: {
    glow: 'from-orange-500/18 via-amber-400/10 to-transparent',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200/80 dark:border-orange-500/25',
    chip: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/25 dark:bg-orange-500/10 dark:text-orange-200',
    button: 'from-orange-500 to-amber-500',
  },
  blue: {
    glow: 'from-blue-500/18 via-indigo-400/10 to-transparent',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200/80 dark:border-blue-500/25',
    chip: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-200',
    button: 'from-blue-500 to-indigo-500',
  },
}

const projectAccentByKey = {
  nutricore: 'green',
  'ai-chatbot': 'violet',
  'sql-query-playground': 'cyan',
  'secure-users-roles-demo': 'violet',
  'project-manager-crud': 'orange',
  'api-health-monitor': 'blue',
  'd1-database-metrics': 'blue',
  'market-api-dashboard': 'cyan',
  'weather-search-app': 'cyan',
  'auth-flow-simulator': 'violet',
  'checkout-flow-simulator': 'orange',
}

export function getProjectAccent(project) {
  const key = project?.accent || projectAccentByKey[project?.slug] || 'blue'
  return accentStyles[key] || accentStyles.blue
}
