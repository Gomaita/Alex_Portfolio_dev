import { Link } from 'react-router-dom'
import ThreeDImageFrame from './ThreeDImageFrame'

function ThreeDProjectCard({ project }) {
  return (
    <Link
      to={`/3d/projects/${project.slug}`}
      className="group block overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#12161c] shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-sky-300/40 hover:shadow-sky-950/20 focus:outline-none focus:ring-2 focus:ring-sky-300/60"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ThreeDImageFrame
          src={project.thumbnailUrl || project.thumbnail_url}
          alt={`${project.title} thumbnail`}
          className="transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-80 transition group-hover:opacity-95" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-bold text-zinc-100 backdrop-blur">
            {project.category}
          </span>
          {project.featured && (
            <span className="rounded-full bg-sky-300 px-3 py-1 text-xs font-black text-slate-950">
              Featured
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-white">{project.title}</h2>
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-semibold text-zinc-400">
            {project.year || project.date}
          </span>
        </div>
        {project.subtitle && <p className="mt-2 text-sm text-zinc-400">{project.subtitle}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          {(project.tools || project.softwareUsed || []).slice(0, 3).map((tool) => (
            <span key={tool} className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-zinc-300">
              {tool}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default ThreeDProjectCard
