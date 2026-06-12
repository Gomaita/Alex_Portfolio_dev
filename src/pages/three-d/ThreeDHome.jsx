import { ArrowRight, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PipelineTimeline from '../../components/three-d/PipelineTimeline'
import ThreeDImageFrame from '../../components/three-d/ThreeDImageFrame'
import ThreeDLayout from '../../components/three-d/ThreeDLayout'
import ThreeDProjectCard from '../../components/three-d/ThreeDProjectCard'
import { threeDTools } from '../../data/threeDProjectsFallback'
import { contact } from '../../data/socialLinks'
import usePageTitle from '../../hooks/usePageTitle'
import { getPublished3DProjects } from '../../services/threeDProjectsService'

const focusTags = ['Environment Art', 'Props', 'PBR Texturing', 'Procedural Materials', 'Real-time Assets', 'VR']

function ThreeDHome() {
  usePageTitle('Alex Gómez | 3D Environment & Prop Artist')
  const [projects, setProjects] = useState([])

  useEffect(() => {
    getPublished3DProjects().then((items) => setProjects(items.filter((item) => item.featured).slice(0, 6)))
  }, [])

  return (
    <ThreeDLayout>
      <section className="border-b border-white/[0.08] bg-[#101216]">
        <div className="h-44 overflow-hidden sm:h-56">
          <div className="h-full bg-[radial-gradient(circle_at_20%_20%,rgba(19,175,240,0.22),transparent_30%),radial-gradient(circle_at_75%_25%,rgba(20,184,166,0.14),transparent_28%),linear-gradient(135deg,#1b1f26,#0d0f12_62%,#07080a)]" />
        </div>
        <div className="mx-auto max-w-[92rem] px-4 pb-6 sm:px-5">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-[#0d0f12] bg-[#15181d] shadow-2xl shadow-black/40">
                <span className="text-3xl font-black text-white">AG</span>
              </div>
              <div className="pb-1">
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Alex Gómez</h1>
                <p className="mt-1 text-base font-semibold text-zinc-300">3D Environment & Prop Artist</p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                  Real-time props, environments and procedural textures for games and VR.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/3d/projects" className="inline-flex min-h-10 items-center gap-2 rounded bg-[#13aff0] px-4 text-sm font-black text-[#061018] hover:bg-sky-300">
                View Projects <ArrowRight size={16} />
              </Link>
              <a href="mailto:alexgl.dvp@gmail.com" className="inline-flex min-h-10 items-center rounded border border-white/10 px-4 text-sm font-bold text-zinc-200 hover:border-white/25">
                Contact
              </a>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded border border-white/10 px-4 text-sm font-bold text-zinc-200 hover:border-white/25">
                LinkedIn <ExternalLink size={15} />
              </a>
            </div>
          </div>
          <p className="mt-5 max-w-4xl text-sm leading-7 text-zinc-400">
            I focus on environment art, props and PBR materials, working through the full real-time asset pipeline from blockout and high-poly details to optimized low-poly assets, UVs, baking, texturing and engine-ready presentation.
          </p>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {focusTags.map((tag) => (
              <span key={tag} className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-zinc-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="border-b border-white/[0.08] bg-[#0d0f12]">
        <div className="mx-auto flex max-w-[92rem] gap-5 overflow-x-auto px-4 sm:px-5">
          {['Portfolio', 'About', 'Skills', 'Pipeline'].map((tab, index) => (
            <a key={tab} href={`#${tab.toLowerCase()}`} className={`whitespace-nowrap border-b-2 py-3 text-sm font-bold ${index === 0 ? 'border-[#13aff0] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
              {tab}
            </a>
          ))}
        </div>
      </div>

      <section id="portfolio" className="px-4 py-8 sm:px-5">
        <div className="mx-auto max-w-[92rem]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">Featured artworks</h2>
              <p className="mt-1 text-sm text-zinc-500">Selected environments, props and real-time studies.</p>
            </div>
            <Link to="/3d/projects" className="text-sm font-bold text-[#13aff0] hover:text-sky-300">
              Explore all
            </Link>
          </div>
          {projects.length ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((project) => (
                <ThreeDProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-white/[0.08] bg-[#15181d] p-8 text-center">
              <p className="text-sm font-bold text-white">No artworks published yet.</p>
            </div>
          )}
        </div>
      </section>

      <section id="about" className="px-4 py-8 sm:px-5">
        <div className="mx-auto grid max-w-[92rem] gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-xl font-black text-white">About my 3D work</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
              I enjoy creating assets that not only look good, but are also clean, optimized and ready to be used in real-time engines.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {focusTags.map((tag) => (
              <article key={tag} className="rounded-xl bg-[#15181d] p-4">
                <h3 className="text-sm font-black text-white">{tag}</h3>
                <p className="mt-2 text-xs leading-5 text-zinc-500">Pipeline-aware work with visual presentation and technical cleanup in mind.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="px-4 py-8 sm:px-5">
        <div className="mx-auto max-w-[92rem]">
          <h2 className="text-xl font-black text-white">Skills & tools</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {threeDTools.map((tool) => (
              <span key={tool} className="rounded bg-[#15181d] px-3 py-2 text-xs font-semibold text-zinc-300">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="pipeline" className="px-4 py-8 sm:px-5">
        <div className="mx-auto max-w-[92rem]">
          <h2 className="text-xl font-black text-white">Pipeline</h2>
          <div className="mt-4">
            <PipelineTimeline />
          </div>
        </div>
      </section>
    </ThreeDLayout>
  )
}

export default ThreeDHome
