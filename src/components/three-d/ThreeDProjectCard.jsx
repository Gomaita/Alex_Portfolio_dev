import { Link } from 'react-router-dom'
import ThreeDImageFrame from './ThreeDImageFrame'
import { ToolBadge } from './ToolBadges'

function ThreeDProjectCard({ project }) {
  const tools = (project.softwareUsed?.length ? project.softwareUsed : project.tools || []).slice(0, 3)
  const category = project.categories?.[0] || project.category

  return (
    <Link
      to={`/3d/projects/${project.slug}`}
      className="group block focus:outline-none focus:ring-2 focus:ring-sky-300/60"
    >
      <article className="overflow-hidden rounded-lg bg-[#15181d] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1b1f26]">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#1b1f26]">
          <ThreeDImageFrame
            src={project.thumbnailUrl || project.thumbnail_url}
            alt={`${project.title} thumbnail`}
            className="transition duration-500 group-hover:scale-[1.035]"
          />
          <div className="absolute inset-0 bg-black/55 opacity-0 transition duration-300 group-hover:opacity-100" />
          <div className="absolute inset-0 flex translate-y-2 items-center justify-center opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
              View project
            </span>
          </div>
          {project.featured && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-[#13aff0] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#061018]">
              Featured
            </span>
          )}
        </div>

        <div className="px-2 py-2.5 text-center">
          <h2 className="truncate text-sm font-bold text-zinc-100">{project.title}</h2>
          <p className="mt-0.5 text-[11px] text-zinc-500">
            {category || '3D Artwork'}{project.year || project.date ? ` · ${project.year || project.date}` : ''}
          </p>

          {tools.length > 0 && (
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
              {tools.map((tool) => (
                <ToolBadge key={tool} tool={tool} />
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

export default ThreeDProjectCard
