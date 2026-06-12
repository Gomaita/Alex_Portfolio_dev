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

const focusCards = [
  ['Environment Art', 'Mood, composition, set dressing and engine presentation.'],
  ['Props', 'Clean shapes, readable materials and game-ready presentation.'],
  ['PBR Texturing', 'Substance Painter workflow with believable surface breakup.'],
  ['Procedural Materials', 'Substance Designer graphs for reusable texture work.'],
  ['Real-time Optimization', 'UVs, texel density, topology and engine-ready constraints.'],
  ['VR-friendly Assets', 'Readable assets built with performance and scale in mind.'],
]

function ThreeDHome() {
  usePageTitle('Alex Gómez | 3D Environment & Prop Artist')
  const [projects, setProjects] = useState([])

  useEffect(() => {
    getPublished3DProjects().then((items) => setProjects(items.filter((item) => item.featured).slice(0, 3)))
  }, [])

  return (
    <ThreeDLayout>
      <section className="px-5 py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-sky-300">3D Environment & Prop Artist</p>
            <h1 className="mt-5 text-5xl font-black tracking-normal text-white sm:text-7xl">
              Alex Gómez
            </h1>
            <p className="mt-4 max-w-2xl text-2xl font-semibold leading-9 text-zinc-200">
              Real-time props, environments and procedural textures for games and VR experiences.
            </p>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
              I focus on environment art, props and PBR materials, working through the full game art pipeline from blockout and high poly details to optimized low poly assets, UVs, baking, texturing and engine-ready presentation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/3d/projects" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sky-400 px-5 py-3 text-sm font-black text-slate-950 hover:bg-sky-300">
                View Projects <ArrowRight size={17} />
              </Link>
              <a href="mailto:alexgl.dvp@gmail.com" className="inline-flex min-h-11 items-center rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-zinc-200 hover:border-sky-300/50">
                Contact
              </a>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-zinc-200 hover:border-sky-300/50">
                LinkedIn <ExternalLink size={16} />
              </a>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#181d24] shadow-2xl shadow-black/40">
            <div className="absolute left-5 top-5 z-10 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-zinc-200 backdrop-blur">
              Technical mindset
            </div>
            <div className="aspect-[4/3]">
              <ThreeDImageFrame alt="Cinematic 3D portfolio hero render placeholder" priority />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-teal-300">My 3D Pipeline</p>
          <h2 className="mt-3 text-3xl font-black text-white">From blockout to engine-ready presentation</h2>
          <div className="mt-6">
            <PipelineTimeline />
          </div>
        </div>
      </section>

      <section className="px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-teal-300">Featured Projects</p>
              <h2 className="mt-3 text-3xl font-black text-white">Selected 3D work</h2>
            </div>
            <Link to="/3d/projects" className="text-sm font-bold text-sky-300 hover:text-sky-200">
              Open full gallery
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {projects.map((project) => (
              <ThreeDProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-300">What I focus on</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {focusCards.map(([title, text]) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-[#12161c]/90 p-5">
                <h2 className="font-black text-white">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-300">Tools</p>
            <h2 className="mt-3 text-3xl font-black text-white">Art pipeline and engine presentation</h2>
            <p className="mt-4 leading-7 text-zinc-400">
              I enjoy creating assets that not only look good, but are also clean, optimized and ready to be used in real-time engines.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {threeDTools.map((tool) => (
              <span key={tool} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-zinc-300">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>
    </ThreeDLayout>
  )
}

export default ThreeDHome
