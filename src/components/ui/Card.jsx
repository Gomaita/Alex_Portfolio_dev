const variants = {
  default:
    'border-slate-200 bg-white shadow-sm shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none',
  soft:
    'border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-900/70',
  interactive:
    'border-slate-200 bg-white shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:hover:shadow-none',
}

function Card({
  as: Component = 'article',
  children,
  className = '',
  variant = 'default',
  ...props
}) {
  return (
    <Component
      className={`rounded-2xl border ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card
