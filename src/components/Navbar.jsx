import { Download, Menu, Moon, Sun, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { cvOptions } from './ui/CVDownloads'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Security Lab', path: '/security-lab', featured: true },
  { label: 'Cheatsheets', path: '/cheatsheets' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  const linkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-sky-400 dark:focus:ring-offset-slate-950 ${
      isActive
        ? 'bg-blue-50 text-blue-700 dark:bg-sky-950/60 dark:text-sky-200'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
    }`

  const getLinkClass = (item) => (state) => {
    const baseClass = linkClass(state)
    if (!item.featured || state.isActive) return baseClass
    return `${baseClass} border border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-200`
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="rounded-md text-base font-bold tracking-normal text-slate-950 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:text-white dark:focus:ring-sky-400 dark:focus:ring-offset-slate-950"
          onClick={() => setIsOpen(false)}
        >
          Alex Gómez
        </NavLink>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={getLinkClass(item)}>
              {item.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-sky-400 dark:focus:ring-offset-slate-950"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <div className="ml-2 flex items-center gap-1" aria-label="CV downloads">
            {cvOptions.map((option) => (
              <a
                key={option.href}
                href={option.href}
                download
                className="inline-flex min-h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus:ring-sky-400 dark:focus:ring-offset-slate-950"
              >
                <Download size={15} />
                {option.label}
              </a>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white md:hidden dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-sky-400 dark:focus:ring-offset-slate-950"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-4 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto flex max-w-6xl flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={getLinkClass(item)}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="mt-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              {isDark ? 'Light mode' : 'Dark mode'}
            </button>
            <div className="mt-2 grid gap-2 sm:grid-cols-2" aria-label="CV downloads">
              {cvOptions.map((option) => (
                <a
                  key={option.href}
                  href={option.href}
                  download
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <Download size={15} />
                  {option.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
