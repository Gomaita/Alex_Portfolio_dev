import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import TechList from './TechList'

const statusTone = {
  Completed: 'green',
  'In Progress': 'cyan',
  Planned: 'violet',
}

function ProjectCard({ project, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Card className="flex h-full flex-col p-6" variant="interactive">
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">{project.type}</Badge>
          <Badge tone={statusTone[project.status]}>{project.status}</Badge>
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">{project.title}</h2>
        <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {project.summary}
        </p>

        <div className="mt-5">
          <TechList limit={5} technologies={project.technologies} />
        </div>

        <Button to={`/portfolio/${project.slug}`} className="mt-6 w-full">
          View project <ArrowUpRight size={16} />
        </Button>
      </Card>
    </motion.div>
  )
}

export default ProjectCard
