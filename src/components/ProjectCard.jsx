import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const statusStyles = {
  Completed: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200',
  'In Progress': 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100',
  Planned: 'border-violet-300/25 bg-violet-300/10 text-violet-100',
}

const typeStyles = {
  'API Demo': 'border-blue-300/25 bg-blue-300/10 text-blue-100',
  'CRUD Demo': 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100',
  'Frontend Demo': 'border-violet-300/25 bg-violet-300/10 text-violet-100',
  Frontend: 'border-violet-300/25 bg-violet-300/10 text-violet-100',
  Planned: 'border-slate-300/20 bg-slate-300/10 text-slate-200',
}

function ProjectCard({ project, index }) {
  return (
    <motion.article
      className="flex h-full flex-col rounded-md border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20 transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[0.07]"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
    >
      <div className="flex flex-wrap gap-2">
        <span
          className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${
            typeStyles[project.type] || typeStyles.Frontend
          }`}
        >
          {project.type}
        </span>
        <span
          className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${
            statusStyles[project.status] || statusStyles.Planned
          }`}
        >
          {project.status}
        </span>
      </div>

      <h3 className="mt-5 text-xl font-bold text-white">{project.title}</h3>
      <p className="mt-3 flex-1 leading-7 text-slate-300">{project.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-xs font-medium text-cyan-100"
          >
            {tech}
          </span>
        ))}
      </div>

      <Link
        to={`/portfolio/${project.slug}`}
        aria-label={`View details for ${project.title}`}
        className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        View Details <ArrowUpRight size={16} />
      </Link>
    </motion.article>
  )
}

export default ProjectCard
