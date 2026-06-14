import { motion } from 'framer-motion'
import { ArrowUpRight, Play } from 'lucide-react'
import Button from '../ui/Button'
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

function SoftwareProjectCard({ featured = false, index = 0, project }) {
  const accent = getProjectAccent(project)
  const highlights = (project.highlights || project.skillsDemonstrated || []).slice(0, 3)
  const stack = (project.stack || project.technologies || []).slice(0, featured ? 7 : 5)

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.38, delay: index * 0.04 }}
      className={`group relative h-full overflow-hidden rounded-[1.75rem] border bg-white/85 p-4 shadow-xl shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-300/60 dark:bg-slate-950/70 dark:shadow-black/20 ${accent.border}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accent.glow}`} />
      <div className="relative grid h-full gap-5">
        <ProjectPreviewFrame project={project} />

        <div className="flex h-full flex-col">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${accent.chip}`}>
              {project.type}
            </span>
            <span className="rounded-full border border-slate-200 bg-white/70 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:border-white/10 dark:bg-white/[0.055] dark:text-slate-300">
              {project.status}
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            {project.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {project.summary}
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
            <Button to={`/portfolio/${project.slug}`} className="flex-1">
              View Case Study <ArrowUpRight size={16} />
            </Button>
            <Button to={getDemoTarget(project)} variant="secondary" className="flex-1">
              <Play size={15} /> Open Demo
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default SoftwareProjectCard
