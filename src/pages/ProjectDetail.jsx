import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getProjectBySlug, projects } from '../data/projects'

const statusStyles = {
  Completed: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200',
  'In Progress': 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100',
  Planned: 'border-violet-300/25 bg-violet-300/10 text-violet-100',
}

function DetailList({ title, items }) {
  return (
    <section className="rounded-md border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 leading-7 text-slate-300">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

function ProjectDetail() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)

  if (!project) {
    return (
      <section className="min-h-[calc(100svh-5rem)] bg-slate-950 px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-md border border-white/10 bg-white/[0.04] p-8 text-center">
          <h1 className="text-3xl font-bold text-white">Project not found</h1>
          <p className="mt-3 text-slate-300">
            The requested portfolio project does not exist.
          </p>
          <Link
            to="/portfolio"
            className="mt-6 inline-flex min-h-10 items-center justify-center rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Back to Portfolio
          </Link>
        </div>
      </section>
    )
  }

  const actionLinks = [
    project.demoRoute && { label: 'View Demo Section', href: project.demoRoute },
    project.githubUrl && { label: 'GitHub', href: project.githubUrl },
    project.liveUrl && { label: 'Live Site', href: project.liveUrl },
  ].filter(Boolean)
  const relatedProjects = projects
    .filter((item) => item.slug !== project.slug)
    .filter((item) => item.type === project.type || item.status === project.status)
    .slice(0, 3)

  return (
    <section className="min-h-[calc(100svh-5rem)] bg-[linear-gradient(180deg,#020617_0%,#07111f_100%)] px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/portfolio"
          className="mb-8 inline-flex min-h-10 items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <ArrowLeft size={16} />
          Back to Portfolio
        </Link>

        <motion.header
          className="rounded-md border border-cyan-300/15 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/40 sm:p-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md border border-blue-300/25 bg-blue-300/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
              {project.type}
            </span>
            <span
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${
                statusStyles[project.status] || statusStyles.Planned
              }`}
            >
              {project.status}
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-normal text-white sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-3xl text-xl font-semibold leading-8 text-cyan-200">
            {project.subtitle}
          </p>
          <p className="mt-5 max-w-4xl leading-8 text-slate-300">
            {project.longDescription}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-xs font-semibold text-cyan-100"
              >
                {technology}
              </span>
            ))}
          </div>

          {actionLinks.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {actionLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  {link.label}
                  <ExternalLink size={16} />
                </a>
              ))}
            </div>
          )}
        </motion.header>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Type
            </p>
            <p className="mt-2 text-xl font-bold text-white">{project.type}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Status
            </p>
            <p className="mt-2 text-xl font-bold text-white">{project.status}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Stack size
            </p>
            <p className="mt-2 text-xl font-bold text-white">
              {project.technologies.length} technologies
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <DetailList title="Features" items={project.features} />
          <DetailList title="Technical Highlights" items={project.technicalHighlights} />
          <DetailList title="Challenges" items={project.challenges} />
          <DetailList title="Future Improvements" items={project.improvements} />
          {project.qualityNotes && (
            <DetailList title="Quality Notes" items={project.qualityNotes} />
          )}
        </div>

        {relatedProjects.length > 0 && (
          <section className="mt-8 rounded-md border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-lg font-bold text-white">Related Projects</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {relatedProjects.map((item) => (
                <Link
                  key={item.id}
                  to={`/portfolio/${item.slug}`}
                  className="rounded-md border border-white/10 bg-slate-950/60 p-4 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  <p className="text-sm font-semibold text-cyan-200">
                    {item.type}
                  </p>
                  <p className="mt-1 font-bold text-white">{item.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  )
}

export default ProjectDetail
