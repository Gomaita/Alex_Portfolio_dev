import { useEffect, useState } from 'react'

const STORAGE_KEY = 'alex-portfolio-theme'

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return {
    isDark: theme === 'dark',
    theme,
    toggleTheme,
  }
}
