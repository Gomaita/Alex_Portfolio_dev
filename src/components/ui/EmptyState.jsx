function EmptyState({ title = 'Nothing found', text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-lg font-semibold text-slate-950 dark:text-white">{title}</p>
      {text && <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</p>}
    </div>
  )
}

export default EmptyState
