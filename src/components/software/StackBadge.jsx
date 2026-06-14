import { getProjectAccent } from './softwareTheme'

function StackBadge({ project, children }) {
  const accent = getProjectAccent(project)

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${accent.chip}`}>
      {children}
    </span>
  )
}

export default StackBadge
