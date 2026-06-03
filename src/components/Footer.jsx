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

const footerLinkClass =
  'inline-flex min-h-9 items-center justify-center rounded-lg px-3 py-2 text-center text-sm font-medium leading-none transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-sky-400 dark:focus:ring-offset-slate-950'

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-7 px-5 py-8 text-sm text-slate-600 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8 dark:text-slate-300">
        <div className="text-center lg:text-left">
          <p className="font-semibold text-slate-950 dark:text-white">Alex Gomez</p>
          <p className="mx-auto mt-2 max-w-xl leading-6 lg:mx-0">
            Junior Software Developer building practical web projects with
            React, APIs, state and clean UI.
          </p>
        </div>
        <nav
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:justify-end"
          aria-label="Footer links"
        >
          {footerLinks.map((link) =>
            link.internal ? (
              <Link
                key={link.label}
                to={link.href}
                className={footerLinkClass}
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
                className={footerLinkClass}
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
