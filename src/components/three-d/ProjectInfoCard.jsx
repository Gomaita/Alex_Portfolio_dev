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
    <section className="rounded-2xl border border-white/10 bg-[#12161c]/95 p-5 shadow-2xl shadow-black/20">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#13aff0]">Technical Summary</p>
      <h2 className="mt-1 text-lg font-black text-zinc-100">Project Info</h2>

      {!!rows.length && (
        <dl className="mt-5 grid gap-2">
          {rows.map(([label, value, Icon]) => (
            <div key={label} className="grid grid-cols-[1.6rem_0.85fr_1.15fr] items-start gap-2 rounded-xl border border-white/10 bg-black/20 p-3 text-sm transition hover:border-[#13aff0]/35 hover:bg-black/30">
              <Icon className="mt-0.5 text-[#13aff0]" size={16} />
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">{label}</dt>
              <dd className="font-semibold leading-5 text-zinc-100">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-5">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Software Used</h3>
        <ToolBadgeGrid tools={tools} />
      </div>
    </section>
  )
}

export default ProjectInfoCard
