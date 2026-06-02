import { Link } from 'react-router-dom'
import { contact } from '../data/socialLinks'

const footerLinks = [
  { label: 'Portfolio', href: '/portfolio', internal: true },
  { label: 'Cheatsheets', href: '/cheatsheets', internal: true },
  { label: 'Contact', href: '/contact', internal: true },
  { label: 'Download CV', href: '/Alex_Gomez_CV.pdf' },
  { label: 'GitHub', href: contact.github },
]

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 text-sm text-slate-400 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <p className="font-semibold text-white">Alex Gómez</p>
          <p className="mt-2 max-w-xl leading-6">
            Junior Software Developer building API-driven tools, interactive
            interfaces and practical learning projects.
          </p>
        </div>
        <nav className="flex flex-wrap gap-3 lg:justify-end" aria-label="Footer links">
          {footerLinks.map((link) =>
            link.internal ? (
              <Link
                key={link.label}
                to={link.href}
                className="rounded-md px-2 py-1 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                download={link.label === 'Download CV'}
                target={link.label === 'GitHub' ? '_blank' : undefined}
                rel={link.label === 'GitHub' ? 'noreferrer' : undefined}
                className="rounded-md px-2 py-1 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
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
