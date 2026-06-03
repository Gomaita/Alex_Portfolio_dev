import { useMemo, useState } from 'react'
import PageHeader from '../components/ui/PageHeader'
import Section from '../components/ui/Section'
import ProjectCard from '../components/project/ProjectCard'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import { projectCategories, projects } from '../data/projects'

function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects
    return projects.filter((project) => project.category === activeCategory)
  }, [activeCategory])

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-[#F6F8FB] dark:bg-slate-950">
      <Section className="pt-16">
        <PageHeader
          eyebrow="Portfolio"
          title="Technical Projects"
          description="A focused collection of small projects built to practice real application patterns: APIs, forms, routing, filtering, localStorage and data visualization."
        />

        <div className="mb-8 flex flex-wrap gap-2">
          {projectCategories.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveCategory(category)}
              size="small"
              variant={activeCategory === category ? 'primary' : 'secondary'}
            >
              {category}
            </Button>
          ))}
        </div>

        {filteredProjects.length === 0 ? (
          <EmptyState
            title="No projects in this category"
            text="Try another filter to see the current project index."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </Section>

      <Section className="bg-white dark:bg-slate-900">
        <Card className="p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-sky-300">
                How to read these projects
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                Small, readable and complete
              </h2>
            </div>
            <p className="leading-8 text-slate-600 dark:text-slate-300">
              Each project is intentionally small but complete. The goal is to
              show how I structure components, handle states, connect services
              and build usable interfaces.
            </p>
          </div>
        </Card>
      </Section>
    </main>
  )
}

export default Portfolio
