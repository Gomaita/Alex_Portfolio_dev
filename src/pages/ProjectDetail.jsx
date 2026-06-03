import { useParams } from 'react-router-dom'
import ProjectDemo from '../components/demos/ProjectDemo'
import Section from '../components/ui/Section'
import ProjectHero from '../components/project/ProjectHero'
import ProjectSection from '../components/project/ProjectSection'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { getProjectBySlug } from '../data/projects'

function List({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-7 text-slate-600 dark:text-slate-300">
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function ProjectDetail() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)

  if (!project) {
    return (
      <Section className="min-h-[calc(100svh-4rem)] pt-16">
        <Card className="mx-auto max-w-3xl p-8 text-center">
          <h1 className="text-3xl font-bold text-slate-950">Project not found</h1>
          <p className="mt-3 text-slate-600">
            The requested portfolio project does not exist.
          </p>
          <Button to="/portfolio" variant="primary" className="mt-6">
            Back to portfolio
          </Button>
        </Card>
      </Section>
    )
  }

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-[#F6F8FB] dark:bg-slate-950">
      <Section className="pt-16">
        <ProjectHero project={project} />
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          <ProjectSection title="What it does">
            <p className="leading-8 text-slate-600 dark:text-slate-300">{project.description}</p>
          </ProjectSection>
          <ProjectSection title="What I practiced">
            <List items={project.skillsDemonstrated.slice(0, 3)} />
          </ProjectSection>
          <ProjectSection title="Main technical points">
            <p className="leading-8 text-slate-600 dark:text-slate-300">{project.technicalNotes}</p>
          </ProjectSection>
        </div>
      </Section>

      <Section id="demo" className="bg-white dark:bg-slate-900">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-sky-300">
            Demo
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            {project.title} in context
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
            The complete demo lives here so the main portfolio page stays easy
            to scan.
          </p>
        </div>
        <ProjectDemo project={project} />
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <ProjectSection title="Technical notes">
            <p className="leading-8 text-slate-600 dark:text-slate-300">{project.technicalNotes}</p>
          </ProjectSection>
          <ProjectSection title="Future improvements">
            <List items={project.improvements} />
          </ProjectSection>
        </div>
      </Section>

      <Section className="bg-white dark:bg-slate-900">
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-sky-300">
                Next
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                Back to the project index
              </h2>
            </div>
            <Button to="/portfolio">
              View all projects
            </Button>
          </div>
        </Card>
      </Section>
    </main>
  )
}

export default ProjectDetail
