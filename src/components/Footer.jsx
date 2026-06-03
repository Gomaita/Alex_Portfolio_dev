import { Link } from 'react-router-dom'
import { contact } from '../data/socialLinks'
import { cvOptions } from './ui/CVDownloads'

const footerLinks = [
  { label: 'Portfolio', href: '/portfolio', internal: true },
  { label: 'Cheatsheets', href: '/cheatsheets', internal: true },
  { label: 'Contact', href: '/contact', internal: true },
  ...cvOptions.map((option) => ({ label: option.label, href: option.href, download: true })),
  { label: 'GitHub', href: contact.github },
]

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 text-sm text-slate-600 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8 dark:text-slate-300">
        <div>
          <p className="font-semibold text-slate-950 dark:text-white">Alex Gomez</p>
          <p className="mt-2 max-w-xl leading-6">
            Junior Software Developer building practical web projects with
            React, APIs, state and clean UI.
          </p>
        </div>
        <nav className="flex flex-wrap gap-3 lg:justify-end" aria-label="Footer links">
          {footerLinks.map((link) =>
            link.internal ? (
              <Link
                key={link.label}
                to={link.href}
                className="rounded-md px-2 py-1 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-sky-400 dark:focus:ring-offset-slate-950"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                download={link.download}
                target={link.label === 'GitHub' ? '_blank' : undefined}
                rel={link.label === 'GitHub' ? 'noreferrer' : undefined}
                className="rounded-md px-2 py-1 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-sky-400 dark:focus:ring-offset-slate-950"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
      </div>
    </footer>
  )
}

export default Footer
