import { Download } from 'lucide-react'
import { appConfig } from '../../config/appConfig'
import Button from './Button'

export const cvOptions = [
  {
    label: 'ATS CV',
    href: appConfig.cvLinks.ats,
    description: 'Clean ATS-friendly version for recruiters and automated screening systems.',
    shortDescription: 'recruiter-friendly version',
  },
  {
    label: 'Visual CV',
    href: appConfig.cvLinks.visual,
    description: 'A more visual version with photo and personal presentation.',
    shortDescription: 'personal layout version',
  },
]

const inlineLinkClass =
  'font-semibold text-blue-700 transition hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:text-sky-300 dark:hover:text-sky-200 dark:focus:ring-sky-400 dark:focus:ring-offset-slate-950'

const cvCardLinkClass =
  'rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-sky-400 dark:focus:ring-offset-slate-950'

function CVDownloads({ layout = 'buttons', className = '' }) {
  if (layout === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm ${className}`}>
        <span className="font-semibold text-slate-700 dark:text-slate-200">CV:</span>
        {cvOptions.map((option, index) => (
          <span key={option.href} className="flex items-center gap-2">
            <a
              href={option.href}
              download
              className={inlineLinkClass}
            >
              {option.label === 'ATS CV' ? 'ATS version' : 'Visual version'}
            </a>
            {index < cvOptions.length - 1 && (
              <span className="text-slate-300 dark:text-slate-600">·</span>
            )}
          </span>
        ))}
      </div>
    )
  }

  if (layout === 'cards') {
    return (
      <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
        {cvOptions.map((option) => (
          <a
            key={option.href}
            href={option.href}
            download
            className={cvCardLinkClass}
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-sky-950 dark:text-sky-300">
                <Download size={18} />
              </span>
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">{option.label}</p>
                <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
                  {option.shortDescription}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {cvOptions.map((option, index) => (
        <Button
          key={option.href}
          href={option.href}
          download
          variant={index === 0 ? 'primary' : 'secondary'}
        >
          {option.label} <Download size={17} />
        </Button>
      ))}
    </div>
  )
}

export default CVDownloads
