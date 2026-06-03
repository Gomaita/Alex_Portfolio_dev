import { Link } from 'react-router-dom'

const styles = {
  primary:
    'border border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-600/15 hover:bg-blue-700 dark:border-sky-500 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400',
  secondary:
    'border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
  ghost:
    'border border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
  quiet:
    'border border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
}

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-sky-400 dark:focus:ring-offset-slate-950'

function Button({
  children,
  className = '',
  download,
  href,
  size = 'medium',
  to,
  variant = 'secondary',
  ...props
}) {
  const sizeClass = size === 'small' ? 'min-h-9 px-3 py-2 text-xs' : ''
  const classes = `${base} ${sizeClass} ${styles[variant] || styles.secondary} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    const external = href.startsWith('http')

    return (
      <a
        href={href}
        className={classes}
        download={download}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
