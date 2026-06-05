import { useMemo, useState } from 'react'
import { Boxes, ShieldCheck, ArrowUpRight } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Section from '../components/ui/Section'
import ProjectCard from '../components/project/ProjectCard'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import Badge from '../components/ui/Badge'
import { projectCategories, projects } from '../data/projects'
import usePageTitle from '../hooks/usePageTitle'

function Portfolio() {
  usePageTitle('Portfolio | Alex Gómez')

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

        <Card className="mb-8 overflow-hidden border-cyan-200 bg-white p-0 dark:border-cyan-900/70 dark:bg-slate-900">
          <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="border-b border-cyan-200 bg-[radial-gradient(circle_at_top_left,#06b6d426,transparent_35%),#ecfeff] p-6 lg:border-b-0 lg:border-r dark:border-cyan-900/70 dark:bg-[radial-gradient(circle_at_top_left,#06b6d433,transparent_35%),#020617]">
              <div className="flex flex-wrap gap-2">
                <Badge tone="cyan">Flagship project</Badge>
                <Badge tone="green">Security</Badge>
              </div>
              <ShieldCheck className="mt-6 text-cyan-700 dark:text-cyan-300" size={34} />
              <h2 className="mt-4 text-2xl font-bold tracking-normal text-slate-950 dark:text-white">
                Security Operations Center Lite
              </h2>
            </div>
            <div className="p-6">
              <p className="max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
                A defensive security dashboard that simulates firewall traffic analysis, rule evaluation, suspicious request detection and incident review.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {['React', 'Recharts', 'Security Modeling', 'Risk Scoring', 'Firewall Rules', 'Incident Workflow'].map((tech) => (
                  <span key={tech} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
              <Button to="/security-lab" className="mt-6">
                Open Security Lab <ArrowUpRight size={16} />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="mb-8 overflow-hidden border-violet-200 bg-white p-0 dark:border-violet-900/70 dark:bg-slate-900">
          <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="border-b border-violet-200 bg-[radial-gradient(circle_at_top_left,#8b5cf626,transparent_35%),#f5f3ff] p-6 lg:border-b-0 lg:border-r dark:border-violet-900/70 dark:bg-[radial-gradient(circle_at_top_left,#8b5cf633,transparent_35%),#020617]">
              <div className="flex flex-wrap gap-2">
                <Badge tone="violet">Flagship Web3 project</Badge>
                <Badge tone="cyan">Blockchain</Badge>
              </div>
              <Boxes className="mt-6 text-violet-700 dark:text-violet-300" size={34} />
              <h2 className="mt-4 text-2xl font-bold tracking-normal text-slate-950 dark:text-white">
                Smart Escrow & Contract Security Dashboard
              </h2>
            </div>
            <div className="p-6">
              <p className="max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
                A complete smart contract simulation that models escrow states, role permissions, DAO-style disputes, milestone payments and contract security notes.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {['React', 'Recharts', 'Solidity Concepts', 'State Machines', 'Smart Contract Security', 'Role-based UI'].map((tech) => (
                  <span key={tech} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
              <Button to="/blockchain-lab" className="mt-6">
                Open Blockchain Lab <ArrowUpRight size={16} />
              </Button>
            </div>
          </div>
        </Card>

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
