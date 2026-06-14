import { CheckCircle2 } from 'lucide-react'

function buildHighlights(project) {
  const highlights = [
    ...(project.technicalHighlights || []),
    ...(project.techniques || []).slice(0, 6),
  ]

  if (project.assetType && /prop|asset|environment|scene/i.test(project.assetType)) highlights.push('Game-ready production mindset')
  if (project.textureWorkflow) highlights.push(`${project.textureWorkflow} texture workflow`)
  if (project.textureResolution) highlights.push(`${project.textureResolution} texture setup`)
  if (project.polycount) highlights.push(`${project.polycount} geometry target`)
  if (project.optimizationNotes) highlights.push('Optimization notes included')
  if (project.substanceDesignerNotes) highlights.push('Procedural material notes')
  if (project.substancePainterNotes) highlights.push('Substance Painter layer workflow')

  return [...new Set(highlights.filter(Boolean))].slice(0, 8)
}

function TechnicalHighlights({ project }) {
  const highlights = buildHighlights(project)
  if (!highlights.length) return null

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(19,175,240,0.12),transparent_35%),#15181d] p-5 shadow-2xl shadow-black/15 sm:p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#13aff0]">Technical</p>
      <h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-100">Technical Highlights</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {highlights.map((highlight) => (
          <div key={highlight} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:-translate-y-0.5 hover:border-emerald-300/30 hover:bg-black/30">
            <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={17} />
            <p className="text-sm font-semibold leading-6 text-zinc-300">{highlight}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TechnicalHighlights
