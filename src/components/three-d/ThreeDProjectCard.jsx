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
      <article className="overflow-hidden rounded-2xl border border-white/[0.065] bg-[#111214] shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-white/14 hover:bg-[#17181b]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#17181b]">
          <ThreeDImageFrame
            src={project.thumbnailUrl || project.thumbnail_url}
            alt={`${project.title} thumbnail`}
            className="transition duration-700 group-hover:scale-[1.055]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.18)_45%,rgba(0,0,0,0.86))]" />
          <div className="absolute inset-0 bg-black/30 opacity-0 transition duration-300 group-hover:opacity-100" />

          {project.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#070809] shadow-lg shadow-white/10">
              Featured
            </span>
          )}

          <div className="absolute inset-0 flex translate-y-2 items-center justify-center opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="rounded-full border border-white/15 bg-black/70 px-3 py-1.5 text-xs font-bold text-white shadow-xl backdrop-blur">
              View Project
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-teal-100/85">{category || '3D Artwork'}</p>
            <h2 className="mt-1 line-clamp-2 text-base font-black leading-tight text-white">{project.title}</h2>
          </div>
        </div>

        <div className="px-3 py-3 text-center">
          <p className="text-[11px] font-semibold text-zinc-500">
            {project.year || project.date || project.assetType || 'Portfolio piece'}
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
