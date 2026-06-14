import { useMemo, useState } from 'react'
import { ArrowUpRight, Boxes, Code2, Database, Layers3, ShieldCheck, Sparkles } from 'lucide-react'
import Button from '../components/ui/Button'
import Section from '../components/ui/Section'
import SoftwareProjectCard from '../components/software/SoftwareProjectCard'
import StackBadge from '../components/software/StackBadge'
import { projectCategories, projects } from '../data/projects'
import usePageTitle from '../hooks/usePageTitle'

const stackGroups = [
  ['Frontend', ['React', 'JavaScript', 'HTML', 'CSS', 'Responsive UI']],
  ['Backend & APIs', ['Cloudflare Functions', 'REST APIs', 'Validation', 'Error handling']],
  ['Databases', ['SQL', 'D1', 'Data modeling', 'Aggregation']],
  ['Tools', ['Git', 'Vite', 'LocalStorage', 'Recharts']],
]

const flagshipLabs = [
  {
    title: 'Security Operations Center Lite',
    text: 'A defensive security interface for firewall-style rules, suspicious request review, incident workflow and risk scoring.',
    to: '/security-lab',
    icon: ShieldCheck,
    accent: 'cyan',
    tags: ['React', 'Recharts', 'Security Modeling', 'Risk Scoring'],
  },
  {
    title: 'Smart Escrow & Contract Security Dashboard',
    text: 'A Web3 learning app for escrow states, role permissions, dispute voting, vesting and contract risk notes.',
    to: '/blockchain-lab',
    icon: Boxes,
    accent: 'violet',
    tags: ['React', 'State Machines', 'Solidity Concepts', 'Role-based UI'],
  },
]

function FilterButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 rounded-full border px-4 text-sm font-bold transition ${
        active
          ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20 dark:border-sky-400 dark:bg-sky-400 dark:text-slate-950'
          : 'border-slate-200 bg-white/75 text-slate-700 hover:border-blue-200 hover:text-blue-700 dark:border-white/10 dark:bg-white/[0.045] dark:text-slate-300 dark:hover:border-sky-400/40 dark:hover:text-sky-200'
      }`}
    >
      {children}
    </button>
  )
}

function FlagshipLabCard({ lab }) {
  const Icon = lab.icon
  const isViolet = lab.accent === 'violet'

  return (
    <article className={`relative overflow-hidden rounded-[1.75rem] border bg-white/85 p-5 shadow-xl shadow-slate-200/60 dark:bg-slate-950/70 dark:shadow-black/20 ${isViolet ? 'border-violet-200/80 dark:border-violet-500/25' : 'border-cyan-200/80 dark:border-cyan-500/25'}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${isViolet ? 'from-violet-500/16 via-fuchsia-400/10' : 'from-cyan-500/16 via-sky-400/10'} to-transparent`} />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className={`rounded-2xl border p-3 ${isViolet ? 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-200' : 'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-500/25 dark:bg-cyan-500/10 dark:text-cyan-200'}`}>
            <Icon size={26} />
          </div>
          <span className="rounded-full border border-slate-200 bg-white/70 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-500 dark:border-white/10 dark:bg-white/[0.055] dark:text-slate-300">
            Flagship
          </span>
        </div>
        <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950 dark:text-white">{lab.title}</h2>
        <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{lab.text}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {lab.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-slate-200 bg-white/75 px-2.5 py-1 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
              {tag}
            </span>
          ))}
        </div>
        <Button to={lab.to} className="mt-6">
          Open Lab <ArrowUpRight size={16} />
        </Button>
      </div>
    </article>
  )
}

function Portfolio() {
  usePageTitle('Alex Gómez | Software Portfolio')

  const [activeCategory, setActiveCategory] = useState('All')

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects
    return projects.filter((project) => project.category === activeCategory)
  }, [activeCategory])

  const featuredProjects = filteredProjects.filter((project) => project.featured).slice(0, activeCategory === 'All' ? 6 : filteredProjects.length)
  const secondaryProjects = activeCategory === 'All'
    ? filteredProjects.filter((project) => !featuredProjects.some((featured) => featured.id === project.id))
    : []

  return (
    <main className="min-h-[calc(100svh-4rem)] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.14),transparent_32%),#F6F8FB] dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_32%),#020617]">
      <Section className="pt-16">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-200">
            <Sparkles size={14} /> Software Portfolio
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl dark:text-white">
            Selected Software Projects
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            A collection of interactive web applications focused on clean UI, data management, role-based experiences and real-world product workflows.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {['React', 'JavaScript', 'SQL', 'Cloudflare', 'D1', 'APIs'].map((technology) => (
              <StackBadge key={technology}>{technology}</StackBadge>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {projectCategories.map((category) => (
            <FilterButton
              key={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </FilterButton>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600 dark:text-sky-300">Product showcases</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Featured Projects</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Each project keeps its working demo, but is presented as a product-style case study with stack, workflow and technical decisions.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <SoftwareProjectCard key={project.id} project={project} index={index} featured />
          ))}
        </div>
      </Section>

      {activeCategory === 'All' && (
        <Section className="pt-0">
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600 dark:text-sky-300">Larger learning labs</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Flagship Interfaces</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {flagshipLabs.map((lab) => (
              <FlagshipLabCard key={lab.title} lab={lab} />
            ))}
          </div>
        </Section>
      )}

      {secondaryProjects.length > 0 && (
        <Section className="pt-0">
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600 dark:text-sky-300">More experiments</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Technical Demos</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {secondaryProjects.map((project, index) => (
              <SoftwareProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </Section>
      )}

      <Section className="bg-white/75 dark:bg-slate-950/55">
        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600 dark:text-sky-300">Technical stack</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Built around practical product workflows</h2>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
              The projects are intentionally scoped, but each one practices a useful slice of real application work: UI states, data flows, validation, persistence and readable component structure.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {stackGroups.map(([title, items]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
                <div className="flex items-center gap-2">
                  {title === 'Frontend' && <Code2 className="text-blue-500" size={20} />}
                  {title === 'Backend & APIs' && <Layers3 className="text-cyan-500" size={20} />}
                  {title === 'Databases' && <Database className="text-emerald-500" size={20} />}
                  {title === 'Tools' && <Sparkles className="text-violet-500" size={20} />}
                  <h3 className="font-black text-slate-950 dark:text-white">{title}</h3>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-white/[0.055] dark:text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/40 dark:border-white/10 dark:shadow-black/30 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-300">Next step</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Interested in the build process?</h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                Each case study includes a working demo section and the technical decisions behind it.
              </p>
            </div>
            <Button to="/contact" className="bg-white text-slate-950 hover:bg-slate-100">
              Contact me <ArrowUpRight size={16} />
            </Button>
          </div>
        </div>
      </Section>
    </main>
  )
}

export default Portfolio
