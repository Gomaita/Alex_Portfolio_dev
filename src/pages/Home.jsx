import { ArrowRight, Code2, Contact, Database, Download, ExternalLink, Layers3, LockKeyhole, MonitorSmartphone, Palette, Sparkles } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import InteractiveHomeBackground from '../components/home/InteractiveHomeBackground'
import ProjectPreviewFrame from '../components/software/ProjectPreviewFrame'
import StackBadge from '../components/software/StackBadge'
import { cvOptions } from '../components/ui/CVDownloads'
import { projects } from '../data/projects'
import usePageTitle from '../hooks/usePageTitle'

const techStack = [
  ['React', 'React_PNG.png'],
  ['JavaScript', 'JavaScript_PNG.png'],
  ['TypeScript', 'TypeScript_PNG.png'],
  ['HTML5', 'HTML5_PNG.png'],
  ['CSS3', 'CSS3_PNG.png'],
  ['Node.js', 'Node_PNG.png'],
  ['SQL', 'SQL_PNG.png'],
  ['Oracle', 'Oracle_PNG.png'],
  ['Java', 'Java_PNG.png'],
  ['C#', 'CSharp_PNG.png'],
  ['Git', 'Git_PNG.png'],
  ['GitHub', 'GitHub_PNG.png'],
  ['Cloudflare', 'Cloudflare_PNG.png'],
  ['APIs', 'API_PNG.png'],
  ['Vite', 'Vite_PNG.png'],
]

const softwareIconModules = import.meta.glob('../assets/icons/software/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

const softwareIcons = Object.fromEntries(
  Object.entries(softwareIconModules).map(([path, url]) => [path.split('/').pop(), url]),
)

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
  },
  {
    slug: 'project-manager-crud',
    line: 'CRUD-based project workflow with approval states.',
    accent: 'from-orange-400/18 to-amber-300/6',
  },
  {
    slug: 'secure-users-roles-demo',
    line: 'Role-based interface for users, permissions and access control.',
    accent: 'from-violet-400/18 to-fuchsia-300/6',
  },
  {
    slug: 'sql-query-playground',
    line: 'Interactive SQL query interface with structured result previews.',
    accent: 'from-cyan-400/18 to-blue-300/6',
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

function TechIconChip({ label, file }) {
  const icon = softwareIcons[file]

  return (
    <span className="group inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 text-xs font-semibold text-slate-200 shadow-sm shadow-black/10 backdrop-blur transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.085]">
      {icon && <img src={icon} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />}
      {label}
    </span>
  )
}

function MiniChart() {
  const bars = ['h-8', 'h-14', 'h-10', 'h-16', 'h-12', 'h-20']
  return (
    <div className="flex h-24 items-end gap-2 rounded-2xl border border-white/10 bg-black/20 p-4">
      {bars.map((height, index) => (
        <span
          key={height + index}
          className={`${height} flex-1 rounded-t-lg bg-gradient-to-t from-cyan-400/70 to-white/80`}
        />
      ))}
    </div>
  )
}

function FloatingInterfaceShowcase() {
  const shouldReduceMotion = useReducedMotion()
  const motionProps = shouldReduceMotion
    ? { initial: false, animate: false, transition: { duration: 0 } }
    : null

  return (
    <div className="relative mx-auto h-[28rem] max-w-xl lg:mx-0">
      <motion.div
        initial={motionProps ? false : { opacity: 0, y: 20, rotate: -2 }}
        animate={motionProps ? false : { opacity: 1, y: 0, rotate: -2 }}
        transition={motionProps ? { duration: 0 } : { duration: 0.7 }}
        className="absolute left-2 top-6 w-72 rounded-[1.5rem] border border-white/12 bg-white/[0.075] p-4 shadow-2xl shadow-black/35 backdrop-blur-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Dashboard</span>
          <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] font-bold text-emerald-200">Live</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/[0.07] p-3">
            <p className="text-xs text-slate-400">API Status</p>
            <p className="mt-1 text-lg font-black text-white">Connected</p>
          </div>
          <div className="rounded-2xl bg-white/[0.07] p-3">
            <p className="text-xs text-slate-400">Latency</p>
            <p className="mt-1 text-lg font-black text-white">82ms</p>
          </div>
        </div>
        <div className="mt-3">
          <MiniChart />
        </div>
      </motion.div>

      <motion.div
        initial={motionProps ? false : { opacity: 0, y: 18, rotate: 3 }}
        animate={motionProps ? false : { opacity: 1, y: 0, rotate: 3 }}
        transition={motionProps ? { duration: 0 } : { duration: 0.7, delay: 0.12 }}
        className="absolute right-0 top-28 w-72 rounded-[1.5rem] border border-white/12 bg-[#111827]/90 p-4 shadow-2xl shadow-cyan-950/35 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          <span className="h-3 w-3 rounded-full bg-amber-300" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <pre className="mt-4 overflow-hidden rounded-2xl bg-black/35 p-4 text-xs leading-6 text-slate-300">
          <code>{`const app = buildUI({
  stack: "React",
  data: "SQL + APIs",
  deploy: "Cloudflare"
})`}</code>
        </pre>
      </motion.div>

      <motion.div
        initial={motionProps ? false : { opacity: 0, y: 18 }}
        animate={motionProps ? false : { opacity: 1, y: 0 }}
        transition={motionProps ? { duration: 0 } : { duration: 0.7, delay: 0.24 }}
        className="absolute bottom-6 left-10 w-80 rounded-[1.35rem] border border-white/12 bg-white/[0.07] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-white">Users & Roles</p>
          <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-2 py-1 text-[10px] font-bold text-violet-100">Admin</span>
        </div>
        {['Alex / Developer', 'Client / Viewer', 'Coach / Editor'].map((row) => (
          <div key={row} className="flex items-center justify-between border-t border-white/8 py-2 text-xs">
            <span className="text-slate-300">{row}</span>
            <span className="text-slate-500">Active</span>
          </div>
        ))}
      </motion.div>

      <div className="absolute right-8 top-4 rounded-full border border-white/12 bg-white/[0.07] px-4 py-2 text-xs font-bold text-slate-200 shadow-xl backdrop-blur">
        Cloudflare Deploy
      </div>
      <div className="absolute bottom-0 right-16 rounded-full border border-white/12 bg-white/[0.07] px-4 py-2 text-xs font-bold text-slate-200 shadow-xl backdrop-blur">
        SQL Query
      </div>
    </div>
  )
}

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

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.36, delay: index * 0.04 }}
      className="group overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0f172a]/70 p-3 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-white/20"
    >
      <div className={`rounded-[1.25rem] bg-gradient-to-br ${item.accent} p-3`}>
        <ProjectPreviewFrame project={project} />
      </div>
      <div className="p-3">
        <h3 className="text-lg font-black text-white">{project.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{item.line}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {stack.map((tech) => (
            <StackBadge key={tech} project={project}>{tech}</StackBadge>
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
    <div className="bg-[#05070d] text-white">
      <section className="relative overflow-hidden px-5 py-12 sm:px-6 lg:px-8">
        <InteractiveHomeBackground />
        <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-10 py-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-slate-300 backdrop-blur">
              <Sparkles size={14} className="text-cyan-200" />
              Creative Frontend Developer
            </div>
            <h1 className="mt-7 text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl">
              Alex G&oacute;mez
              <span className="mt-2 block bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-3xl text-transparent sm:text-5xl lg:text-6xl">
                Junior Software Developer
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Building clean, interactive and visual web experiences with React, databases and product-focused interfaces.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/portfolio"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-slate-950 shadow-xl shadow-white/10 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                View Projects <ArrowRight size={16} />
              </Link>
              <Link
                to="/3d"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-5 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/[0.1]"
              >
                View 3D Portfolio <Layers3 size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.035] px-5 text-sm font-bold text-slate-200 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
              >
                Contact <ExternalLink size={15} />
              </Link>
              {cvOptions[0] && (
                <a
                  href={cvOptions[0].href}
                  download
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.035] px-5 text-sm font-bold text-slate-200 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
                >
                  Download CV <Download size={15} />
                </a>
              )}
            </div>
          </div>

          <FloatingInterfaceShowcase />
        </div>
      </section>

      <section className="relative border-y border-white/8 bg-[#070a12] px-5 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2.5">
          {techStack.map(([label, file]) => (
            <TechIconChip key={label} label={label} file={file} />
          ))}
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
