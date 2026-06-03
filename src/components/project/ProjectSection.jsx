import Card from '../ui/Card'

function ProjectSection({ children, title }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </Card>
  )
}

export default ProjectSection
