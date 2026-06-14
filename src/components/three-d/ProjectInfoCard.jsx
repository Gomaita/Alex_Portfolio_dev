import { Calendar, Cpu, Layers3, Target, UserRound } from 'lucide-react'
import { ToolBadgeGrid } from './ToolBadges'

function ProjectInfoCard({ project, tools = [] }) {
  const rows = [
    ['Project Type', project.assetType || project.category, Layers3],
    ['Role', project.role, UserRound],
    ['Main Focus', project.focus || project.textureWorkflow || project.targetPlatform, Target],
    ['Engine', project.engine, Cpu],
    ['Status', project.published ? 'Published' : '', Target],
    ['Year', project.publishedAt ? new Date(project.publishedAt).getFullYear() : project.year || project.date, Calendar],
  ].filter(([, value]) => value)

  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111214]/95 shadow-2xl shadow-black/20">
      <div className="border-b border-white/[0.07] bg-white/[0.025] px-5 py-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-teal-200/80">Technical Summary</p>
        <h2 className="mt-1 text-lg font-black text-zinc-100">Project Info</h2>
      </div>

      {!!rows.length && (
        <dl className="grid divide-y divide-white/[0.07] px-5">
          {rows.map(([label, value, Icon]) => (
            <div key={label} className="grid grid-cols-[1.6rem_0.85fr_1.15fr] items-start gap-2 py-3 text-sm">
              <Icon className="mt-0.5 text-teal-200/80" size={16} />
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">{label}</dt>
              <dd className="font-semibold leading-5 text-zinc-100">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="border-t border-white/[0.07] px-5 py-5">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Software Used</h3>
        <ToolBadgeGrid tools={tools} />
      </div>
    </section>
  )
}

export default ProjectInfoCard
