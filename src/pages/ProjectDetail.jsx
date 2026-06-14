import { useParams } from 'react-router-dom'
import { ArrowUpRight, CheckCircle2, Lightbulb, Rocket, Wrench } from 'lucide-react'
import ProjectDemo from '../components/demos/ProjectDemo'
import Section from '../components/ui/Section'
import ProjectHero from '../components/project/ProjectHero'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ArchitecturePanel from '../components/software/ArchitecturePanel'
import CaseStudySection from '../components/software/CaseStudySection'
import FeaturePill from '../components/software/FeaturePill'
import StackBadge from '../components/software/StackBadge'
import { getProjectBySlug } from '../data/projects'
import usePageTitle from '../hooks/usePageTitle'

function List({ items, project }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:border-white/10 dark:bg-white/[0.045] dark:text-slate-300">
          <CheckCircle2 className="mb-3 text-emerald-500" size={18} />
          {item}
        </li>
      ))}
    </ul>
  )
}

function ProjectDetail() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)
  usePageTitle(project ? `${project.title} | Alex Gómez` : 'Project not found | Alex Gómez')

  if (!project) {
    return (
      <Section className="min-h-[calc(100svh-4rem)] pt-16">
        <Card className="mx-auto max-w-3xl p-8 text-center">
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Project not found</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            The requested portfolio project does not exist.
          </p>
          <Button to="/portfolio" variant="primary" className="mt-6">
            Back to portfolio
          </Button>
        </Card>
      </Section>
    )
  }

  const featureItems = (project.features || project.skillsDemonstrated || []).slice(0, 6)
  const technicalHighlights = (project.technicalHighlights || project.skillsDemonstrated || []).slice(0, 6)

  return (
    <main className="min-h-[calc(100svh-4rem)] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_34%),#F6F8FB] dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_34%),#020617]">
      <Section className="pt-16">
        <ProjectHero project={project} />
      </Section>

      <Section id="overview" className="pt-0">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <CaseStudySection eyebrow="Overview" title="What this app demonstrates">
            <p className="leading-8 text-slate-600 dark:text-slate-300">{project.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <StackBadge key={technology} project={project}>{technology}</StackBadge>
              ))}
            </div>
          </CaseStudySection>

          <CaseStudySection eyebrow="Product shape" title="Main workflow">
            <div className="space-y-3">
              {(project.skillsDemonstrated || []).slice(0, 4).map((item) => (
                <FeaturePill key={item} project={project}>{item}</FeaturePill>
              ))}
            </div>
          </CaseStudySection>
        </div>
      </Section>

      <Section className="pt-0">
        <CaseStudySection eyebrow="Features" title="Key features">
          <List items={featureItems} project={project} />
        </CaseStudySection>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-6 lg:grid-cols-2">
          <CaseStudySection eyebrow="Technical" title="Technical highlights">
            <List items={technicalHighlights} project={project} />
          </CaseStudySection>

          <CaseStudySection eyebrow="Notes" title="Implementation decisions">
            <div className="space-y-5">
              <div className="flex gap-3">
                <Wrench className="mt-1 shrink-0 text-blue-500" size={20} />
                <p className="leading-8 text-slate-600 dark:text-slate-300">{project.technicalNotes}</p>
              </div>
              <div className="flex gap-3">
                <Lightbulb className="mt-1 shrink-0 text-amber-500" size={20} />
                <p className="leading-8 text-slate-600 dark:text-slate-300">
                  The scope stays demo-friendly while still showing realistic product states, data handling and UI feedback.
                </p>
              </div>
            </div>
          </CaseStudySection>
        </div>
      </Section>

      <Section className="pt-0">
        <CaseStudySection eyebrow="Architecture" title="Data flow and structure">
          <ArchitecturePanel project={project} />
        </CaseStudySection>
      </Section>

      <Section id="demo" className="bg-white/75 dark:bg-slate-950/55">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600 dark:text-sky-300">
              Demo access
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              {project.title} in context
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
              The working demo stays available here, separate from the case study presentation.
            </p>
          </div>
        </div>
        <ProjectDemo project={project} />
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <CaseStudySection eyebrow="Future" title="Possible improvements">
            <List items={project.improvements} project={project} />
          </CaseStudySection>

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/40 dark:border-white/10 dark:shadow-black/30">
            <Rocket className="text-sky-300" size={28} />
            <h2 className="mt-4 text-2xl font-black tracking-tight">Explore more projects</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Go back to the software portfolio to compare the other product demos and technical experiments.
            </p>
            <Button to="/portfolio" className="mt-6 bg-white text-slate-950 hover:bg-slate-100">
              View all projects <ArrowUpRight size={16} />
            </Button>
          </div>
        </div>
      </Section>
    </main>
  )
}

export default ProjectDetail
