import { useMemo, useState } from 'react'
import { ArrowUpRight, Boxes, Code2, Database, Layers3, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import InteractiveHomeBackground from '../components/home/InteractiveHomeBackground'
import TechStackCloud from '../components/home/TechStackCloud'
import SoftwareProjectCard from '../components/software/SoftwareProjectCard'
import { projectCategories, projects } from '../data/projects'
import usePageTitle from '../hooks/usePageTitle'

const stackGroups = [
  ['Frontend', Code2, ['React', 'JavaScript', 'Responsive UI']],
  ['APIs', Layers3, ['Cloudflare Functions', 'REST', 'Validation']],
  ['Data', Database, ['SQL', 'D1', 'Data modeling']],
]

const flagshipLabs = [
  {
    title: 'Security Operations Center Lite',
    text: 'Defensive security interface with traffic review, rules and risk scoring.',
    to: '/security-lab',
    icon: ShieldCheck,
    tags: ['Security Modeling', 'Risk Scoring', 'Recharts'],
  },
  {
    title: 'Smart Escrow & Contract Security Dashboard',
    text: 'Web3 learning app for escrow states, permissions and contract risk notes.',
    to: '/blockchain-lab',
    icon: Boxes,
    tags: ['State Machines', 'Solidity Concepts', 'Role UI'],
  },
]

function FilterButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 rounded-full border px-4 text-sm font-bold transition ${
        active
          ? 'border-white bg-white text-slate-950 shadow-lg shadow-white/10'
          : 'border-white/10 bg-white/[0.045] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

function FlagshipLabCard({ lab }) {
  const Icon = lab.icon

  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0f172a]/72 p-5 shadow-2xl shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:border-white/20 hover:bg-[#111827]/82">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-violet-400/8 to-transparent" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-cyan-100">
            <Icon size={25} />
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.055] px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-300">
            Flagship
          </span>
        </div>
        <h2 className="mt-5 text-2xl font-black tracking-tight text-white">{lab.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">{lab.text}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {lab.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/[0.055] px-2.5 py-1 text-xs font-bold text-slate-300">
              {tag}
            </span>
          ))}
        </div>
        <Link
          to={lab.to}
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
        >
          Open Lab <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  )
}

function StackGroupCard({ group }) {
  const [title, Icon, items] = group

  return (
    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/10">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.08] text-cyan-100">
          <Icon size={19} />
        </span>
        <h3 className="font-black text-white">{title}</h3>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full border border-white/10 bg-white/[0.055] px-2.5 py-1 text-xs font-bold text-slate-300">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function Portfolio() {
  usePageTitle('Alex G\u00f3mez | Software Portfolio')

  const [activeCategory, setActiveCategory] = useState('All')

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects
    return projects.filter((project) => project.category === activeCategory)
  }, [activeCategory])

  const featuredProjects = filteredProjects
    .filter((project) => project.featured)
    .slice(0, activeCategory === 'All' ? 6 : filteredProjects.length)
  const secondaryProjects = activeCategory === 'All'
    ? filteredProjects.filter((project) => !featuredProjects.some((featured) => featured.id === project.id))
    : []

  return (
    <main className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-[#05070d] text-white">
      <section className="relative px-5 py-14 sm:px-6 lg:px-8">
        <InteractiveHomeBackground />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
                Software Projects
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Interactive web applications presented as product-style demos: clean UI, data flows, roles, APIs and practical frontend decisions.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
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
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/25 backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100/70">Shared visual system</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white">Stack behind the demos</h2>
              <TechStackCloud className="mt-5" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-5 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/70">Product showcases</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Featured Projects</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">
              Working demos with compact previews, stack chips and short product-style summaries.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {featuredProjects.map((project, index) => (
              <SoftwareProjectCard key={project.id} project={project} index={index} featured />
            ))}
          </div>
        </div>
      </section>

      {activeCategory === 'All' && (
        <section className="px-5 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/70">Larger learning labs</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Flagship Interfaces</h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {flagshipLabs.map((lab) => (
                <FlagshipLabCard key={lab.title} lab={lab} />
              ))}
            </div>
          </div>
        </section>
      )}

      {secondaryProjects.length > 0 && (
        <section className="px-5 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/70">More experiments</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Technical Demos</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {secondaryProjects.map((project, index) => (
                <SoftwareProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-5 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {stackGroups.map((group) => (
            <StackGroupCard key={group[0]} group={group} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default Portfolio
