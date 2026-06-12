import { Link } from 'react-router-dom'
import ThreeDImageFrame from './ThreeDImageFrame'

function ThreeDProjectCard({ project }) {
  const tools = (project.softwareUsed?.length ? project.softwareUsed : project.tools || []).slice(0, 3)
  const category = project.categories?.[0] || project.category

  return (
    <Link
      to={`/3d/projects/${project.slug}`}
      className="group block focus:outline-none focus:ring-2 focus:ring-sky-300/60"
    >
      <article className="overflow-hidden rounded-xl bg-[#15181d] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1b1f26]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#1b1f26]">
          <ThreeDImageFrame
            src={project.thumbnailUrl || project.thumbnail_url}
            alt={`${project.title} thumbnail`}
            className="transition duration-500 group-hover:scale-[1.035]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="rounded-full bg-black/65 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
              View project
            </span>
          </div>
          {project.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-[#13aff0] px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#061018]">
              Featured
            </span>
          )}
        </div>
        <div className="px-1.5 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-bold text-zinc-100">{project.title}</h2>
              <p className="mt-1 text-xs text-zinc-500">{category || '3D Artwork'}{project.year || project.date ? ` · ${project.year || project.date}` : ''}</p>
            </div>
          </div>
          {tools.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tools.map((tool) => (
                <span key={tool} className="rounded bg-white/[0.06] px-2 py-1 text-[11px] font-semibold text-zinc-400">
                  {tool}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

export default ThreeDProjectCard
