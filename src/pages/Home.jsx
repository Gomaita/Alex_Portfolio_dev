import { ArrowRight, Code2, Contact, Database, Download, ExternalLink, Layers3, LockKeyhole, MonitorSmartphone, Palette } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import InteractiveHomeBackground from '../components/home/InteractiveHomeBackground'
import TechStackCloud from '../components/home/TechStackCloud'
import { cvOptions } from '../components/ui/CVDownloads'
import { projects } from '../data/projects'
import usePageTitle from '../hooks/usePageTitle'

const capabilities = [
  {
    title: 'Interfaces',
    text: 'Clean React layouts with polished responsive interactions.',
    icon: MonitorSmartphone,
  },
  {
    title: 'Data Apps',
    text: 'CRUD flows, dashboards, SQL logic and structured UX.',
    icon: Database,
  },
  {
    title: 'Secure Flows',
    text: 'Roles, permissions, validation and admin/user views.',
    icon: LockKeyhole,
  },
  {
    title: 'Creative Frontend',
    text: 'Software development with a visual and 3D design eye.',
    icon: Palette,
  },
]

const featuredProjectData = [
  {
    slug: 'nutricore',
    line: 'Nutrition and workout platform with user/admin roles.',
    accent: 'from-emerald-400/18 to-lime-300/6',
    icon: MonitorSmartphone,
  },
  {
    slug: 'project-manager-crud',
    line: 'CRUD-based project workflow with approval states.',
    accent: 'from-orange-400/18 to-amber-300/6',
    icon: Layers3,
  },
  {
    slug: 'secure-users-roles-demo',
    line: 'Role-based interface for users, permissions and access control.',
    accent: 'from-violet-400/18 to-fuchsia-300/6',
    icon: LockKeyhole,
  },
  {
    slug: 'sql-query-playground',
    line: 'Interactive SQL query interface with structured result previews.',
    accent: 'from-cyan-400/18 to-blue-300/6',
    icon: Database,
  },
]

const hubCards = [
  {
    title: 'Software Projects',
    text: 'Interactive apps and technical demos.',
    href: '/portfolio',
    icon: Code2,
  },
  {
    title: '3D Portfolio',
    text: 'Props, environments and real-time assets.',
    href: '/3d',
    icon: Layers3,
  },
  {
    title: 'Contact',
    text: 'Open to junior developer opportunities.',
    href: '/contact',
    icon: Contact,
  },
]

function CapabilityCard({ capability }) {
  const Icon = capability.icon
  return (
    <article className="group rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-xl shadow-black/10 backdrop-blur transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08]">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-cyan-100">
        <Icon size={21} />
      </span>
      <h3 className="mt-4 text-lg font-bold text-white">{capability.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{capability.text}</p>
    </article>
  )
}

function FeaturedProjectPreview({ item, index }) {
  const project = projects.find((entry) => entry.slug === item.slug)
  if (!project) return null
  const stack = (project.technologies || []).slice(0, 3)
  const Icon = item.icon

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.36, delay: index * 0.04 }}
      className="group overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0f172a]/70 p-3 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-white/20"
    >
      <div className={`relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-gradient-to-br ${item.accent} p-5`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="relative flex h-full flex-col justify-between">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.09] text-white shadow-xl shadow-black/10">
            <Icon size={24} />
          </span>
          <div className="space-y-2">
            <div className="h-2 w-3/4 rounded-full bg-white/25" />
            <div className="h-2 w-1/2 rounded-full bg-white/15" />
            <div className="flex gap-2 pt-2">
              <span className="h-7 w-16 rounded-full bg-white/12" />
              <span className="h-7 w-20 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-lg font-black text-white">{project.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{item.line}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {stack.map((tech) => (
            <span key={tech} className="rounded-full border border-white/10 bg-white/[0.055] px-2.5 py-1 text-[11px] font-bold text-slate-300">
              {tech}
            </span>
          ))}
        </div>
        <Link
          to={`/portfolio/${project.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-100 transition hover:text-white"
        >
          View Project <ArrowRight size={15} />
        </Link>
      </div>
    </motion.article>
  )
}

function HubCard({ card }) {
  const Icon = card.icon
  return (
    <Link
      to={card.href}
      className="group rounded-[1.4rem] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.075]"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.08] text-slate-100">
          <Icon size={21} />
        </span>
        <ArrowRight className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-slate-200" size={18} />
      </div>
      <h3 className="mt-5 text-lg font-bold text-white">{card.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{card.text}</p>
    </Link>
  )
}

function Home() {
  usePageTitle('Alex G\u00f3mez | Junior Software Developer')

  return (
    <div className="bg-[#030409] text-white">
      <section className="relative overflow-hidden px-5 py-10 sm:px-6 lg:px-8">
        <InteractiveHomeBackground />
        <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-10 py-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl">
              Alex G&oacute;mez
              <span className="mt-3 block bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-3xl text-transparent sm:text-5xl lg:text-6xl">
                Junior Software Developer
              </span>
            </h1>
            <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
              <Link
                to="/portfolio"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-slate-950 shadow-xl shadow-white/10 transition hover:-translate-y-0.5 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              >
                View Projects <ArrowRight size={16} />
              </Link>
              <Link
                to="/3d"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.055] px-5 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.095] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              >
                View 3D Portfolio <Layers3 size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.032] px-5 text-sm font-bold text-slate-200 backdrop-blur transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.075] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              >
                Contact <ExternalLink size={15} />
              </Link>
              {cvOptions[0] && (
                <a
                  href={cvOptions[0].href}
                  download
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.032] px-5 text-sm font-bold text-slate-200 backdrop-blur transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.075] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                >
                  Download CV <Download size={15} />
                </a>
              )}
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl rounded-[2.2rem] border border-white/[0.08] bg-[#0a0d13]/70 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100/65">Core stack</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white">Tools I build with</h2>
              </div>
            </div>
            <TechStackCloud />
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-4">
            {capabilities.map((capability) => (
              <CapabilityCard key={capability.title} capability={capability} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-100/70">Featured Projects</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Product-style demos</h2>
            </div>
            <Link to="/portfolio" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-cyan-100 transition hover:text-white">
              Browse all projects <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredProjectData.map((item, index) => (
              <FeaturedProjectPreview key={item.slug} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
          <div className="grid gap-4 md:grid-cols-4">
            {hubCards.map((card) => (
              <HubCard key={card.title} card={card} />
            ))}
            {cvOptions[0] && (
              <a
                href={cvOptions[0].href}
                download
                className="group rounded-[1.4rem] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.075]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.08] text-slate-100">
                    <Download size={21} />
                  </span>
                  <ArrowRight className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-slate-200" size={18} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">CV</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">Download my software developer CV.</p>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
