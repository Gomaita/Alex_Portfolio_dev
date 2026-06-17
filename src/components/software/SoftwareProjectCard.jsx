import { motion } from 'framer-motion'
import { ArrowUpRight, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import FeaturePill from './FeaturePill'
import ProjectPreviewFrame from './ProjectPreviewFrame'
import StackBadge from './StackBadge'
import { getProjectAccent } from './softwareTheme'

function getDemoTarget(project) {
  if (project.demoComponentKey === 'nutricore') return '/nutricore'
  if (project.demoComponentKey === 'nova-ai-chat') return '/ai-chat'
  if (project.demoComponentKey === 'cheatsheets') return '/cheatsheets'
  return `/portfolio/${project.slug}#demo`
}

const shortDescriptions = {
  nutricore: 'Nutrition and workout platform with user/admin roles.',
  'project-manager-crud': 'Project workflow with approval states and admin management.',
  'secure-users-roles-demo': 'Role-based interface with permissions and access control.',
  'sql-query-playground': 'Interactive SQL interface with structured result previews.',
}

function SoftwareProjectCard({ featured = false, index = 0, project }) {
  const accent = getProjectAccent(project)
  const highlights = (project.highlights || project.skillsDemonstrated || []).slice(0, 3)
  const stack = (project.stack || project.technologies || []).slice(0, featured ? 5 : 4)
  const description = shortDescriptions[project.slug] || project.subtitle || project.summary

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.38, delay: index * 0.04 }}
      className="group relative h-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0f172a]/72 p-3 shadow-2xl shadow-black/20 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#111827]/82 hover:shadow-black/35"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accent.glow}`} />
      <div className="relative grid h-full gap-5">
        <ProjectPreviewFrame project={project} />

        <div className="flex h-full flex-col">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${accent.chip}`}>
              {project.type}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.055] px-2.5 py-1 text-[11px] font-bold text-slate-300">
              {project.status}
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-black tracking-tight text-white">
            {project.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {stack.map((technology) => (
              <StackBadge key={technology} project={project}>{technology}</StackBadge>
            ))}
          </div>

          <div className="mt-5 grid gap-2">
            {highlights.map((highlight) => (
              <FeaturePill key={highlight} project={project}>{highlight}</FeaturePill>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row">
            <Link
              to={`/portfolio/${project.slug}`}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              View Case Study <ArrowUpRight size={16} />
            </Link>
            <Link
              to={getDemoTarget(project)}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 text-sm font-bold text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/[0.09]"
            >
              <Play size={15} /> Open Demo
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default SoftwareProjectCard
