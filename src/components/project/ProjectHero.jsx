import { ArrowLeft, ExternalLink } from 'lucide-react'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import TechList from './TechList'

const statusTone = {
  Completed: 'green',
  'In Progress': 'cyan',
  Planned: 'violet',
}

function ProjectHero({ project }) {
  return (
    <Card className="p-6 sm:p-8">
      <Button to="/portfolio" variant="quiet" className="-ml-2 mb-6">
        <ArrowLeft size={16} />
        Back to portfolio
      </Button>

      <div className="flex flex-wrap gap-2">
        <Badge tone="blue">{project.type}</Badge>
        <Badge tone={statusTone[project.status]}>{project.status}</Badge>
      </div>

      <h1 className="mt-5 text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl dark:text-white">
        {project.title}
      </h1>
      <p className="mt-4 max-w-3xl text-xl leading-8 text-blue-700 dark:text-sky-300">
        {project.subtitle}
      </p>
      <p className="mt-5 max-w-4xl leading-8 text-slate-600 dark:text-slate-300">
        {project.description}
      </p>

      <div className="mt-6">
        <TechList technologies={project.technologies} />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {project.demoComponentKey !== 'cheatsheets' && (
          <Button href="#demo" variant="primary">
            View demo section
          </Button>
        )}
        {project.demoComponentKey === 'cheatsheets' && (
          <Button to="/cheatsheets" variant="primary">
            Open cheatsheets
          </Button>
        )}
        {project.githubUrl && (
          <Button href={project.githubUrl}>
            GitHub <ExternalLink size={16} />
          </Button>
        )}
      </div>
    </Card>
  )
}

export default ProjectHero
