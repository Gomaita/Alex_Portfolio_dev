import { Link } from 'react-router-dom'
import ThreeDImageFrame from './ThreeDImageFrame'

function ThreeDProjectCard({ project }) {
  return (
    <Link
      to={`/3d/projects/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-[#12161c] shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-sky-300/40"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <ThreeDImageFrame
          src={project.thumbnailUrl || project.thumbnail_url}
          alt={`${project.title} thumbnail`}
          className="transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-white">{project.title}</h2>
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-semibold text-zinc-400">
            {project.year || project.date}
          </span>
        </div>
        <p className="mt-2 text-sm text-zinc-400">{project.category}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(project.tools || []).slice(0, 3).map((tool) => (
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
