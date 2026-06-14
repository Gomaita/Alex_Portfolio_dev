import { ArrowLeft, ArrowUpRight, ExternalLink, Play } from 'lucide-react'
import Button from '../ui/Button'
import FeaturePill from '../software/FeaturePill'
import ProjectPreviewFrame from '../software/ProjectPreviewFrame'
import StackBadge from '../software/StackBadge'
import { getProjectAccent } from '../software/softwareTheme'

function getDemoTarget(project) {
  if (project.demoComponentKey === 'nutricore') return '/nutricore'
  if (project.demoComponentKey === 'nova-ai-chat') return '/ai-chat'
  if (project.demoComponentKey === 'cheatsheets') return '/cheatsheets'
  return '#demo'
}

function ProjectHero({ project }) {
  const accent = getProjectAccent(project)
  const highlights = (project.highlights || project.skillsDemonstrated || []).slice(0, 3)

  return (
    <section className={`relative overflow-hidden rounded-[2rem] border bg-white/85 p-5 shadow-2xl shadow-slate-200/70 dark:bg-slate-950/75 dark:shadow-black/30 sm:p-7 ${accent.border}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${accent.glow}`} />
      <div className="relative">
        <Button to="/portfolio" variant="quiet" className="-ml-2 mb-6">
          <ArrowLeft size={16} />
          Back to portfolio
        </Button>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${accent.chip}`}>
                {project.type}
              </span>
              <span className="rounded-full border border-slate-200 bg-white/75 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:border-white/10 dark:bg-white/[0.055] dark:text-slate-300">
                {project.status}
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl dark:text-white">
              {project.title}
            </h1>
            <p className={`mt-4 max-w-3xl text-xl font-semibold leading-8 ${accent.text}`}>
              {project.subtitle}
            </p>
            <p className="mt-5 max-w-4xl leading-8 text-slate-600 dark:text-slate-300">
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <StackBadge key={technology} project={project}>{technology}</StackBadge>
              ))}
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {highlights.map((highlight) => (
                <FeaturePill key={highlight} project={project}>{highlight}</FeaturePill>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button to={getDemoTarget(project)} variant="primary">
                <Play size={16} /> Open Demo
              </Button>
              <Button href="#overview">
                View Case Study <ArrowUpRight size={16} />
              </Button>
              {project.githubUrl && (
                <Button href={project.githubUrl}>
                  GitHub <ExternalLink size={16} />
                </Button>
              )}
            </div>
          </div>

          <ProjectPreviewFrame project={project} />
        </div>
      </div>
    </section>
  )
}

export default ProjectHero
