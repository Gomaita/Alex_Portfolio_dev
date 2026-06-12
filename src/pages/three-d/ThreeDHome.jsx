import { ArrowRight, ExternalLink, Mail } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ThreeDLayout from '../../components/three-d/ThreeDLayout'
import ThreeDProjectCard from '../../components/three-d/ThreeDProjectCard'
import { contact } from '../../data/socialLinks'
import usePageTitle from '../../hooks/usePageTitle'
import { getPublished3DProjects } from '../../services/threeDProjectsService'

const skillGroups = [
  {
    title: 'Focus',
    items: ['Environment Art', 'Props', 'Real-time Assets', 'VR Assets'],
  },
  {
    title: 'Texturing',
    items: ['PBR Texturing', 'Procedural Materials', 'Substance 3D Painter', 'Substance 3D Designer'],
  },
  {
    title: 'Software',
    items: ['Blender', '3ds Max', 'Maya', 'ZBrush', 'Unreal Engine', 'Unity', 'Marmoset Toolbag'],
  },
]

function ThreeDHome() {
  usePageTitle('Alex Gómez | 3D Environment & Prop Artist')
  const [projects, setProjects] = useState([])

  useEffect(() => {
    getPublished3DProjects().then((items) => setProjects(items.slice(0, 8)))
  }, [])

  const featuredProjects = useMemo(() => {
    const featured = projects.filter((item) => item.featured)
    return (featured.length ? featured : projects).slice(0, 4)
  }, [projects])

  return (
    <ThreeDLayout>
      <section className="border-b border-white/[0.08] bg-[#101216]">
        <div className="mx-auto max-w-[92rem] px-4 py-16 text-center sm:px-5 sm:py-20">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-[#15181d] shadow-2xl shadow-black/40">
            <span className="text-3xl font-black text-white">AG</span>
          </div>

          <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.3em] text-[#13aff0]">3D Portfolio</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">Alex Gómez</h1>
          <p className="mt-3 text-lg font-semibold text-zinc-300">3D Environment & Prop Artist</p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-300">
            Real-time props, environments and PBR materials for games and VR.
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
            I focus on props, environments and PBR materials for real-time projects. I enjoy working on assets that not only look good, but are also clean, optimized and ready to be used in a game engine.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <Link to="/3d/projects" className="inline-flex min-h-10 items-center gap-2 rounded bg-[#13aff0] px-4 text-sm font-black text-[#061018] hover:bg-sky-300">
              View Projects <ArrowRight size={16} />
            </Link>
            <Link to="/3d/contact" className="inline-flex min-h-10 items-center gap-2 rounded border border-white/10 px-4 text-sm font-bold text-zinc-200 hover:border-white/25">
              Contact <Mail size={15} />
            </Link>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded border border-white/10 px-4 text-sm font-bold text-zinc-200 hover:border-white/25">
              LinkedIn <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </section>

      <div className="border-b border-white/[0.08] bg-[#0d0f12]">
        <div className="mx-auto flex max-w-[92rem] justify-center gap-6 overflow-x-auto px-4 sm:px-5">
          {[
            ['Portfolio', 'portfolio'],
            ['About', 'about'],
            ['Skills', 'skills'],
            ['Contact', 'contact-cta'],
          ].map(([tab, id], index) => (
            <a key={tab} href={`#${id}`} className={`whitespace-nowrap border-b-2 py-3 text-sm font-bold ${index === 0 ? 'border-[#13aff0] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
              {tab}
            </a>
          ))}
        </div>
      </div>

      <section id="portfolio" className="px-4 py-10 sm:px-5">
        <div className="mx-auto max-w-[92rem]">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white">Featured Projects</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              Selected environments, props and real-time material studies.
            </p>
          </div>

          {featuredProjects.length ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProjects.map((project) => (
                <ThreeDProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-6 max-w-xl rounded-xl border border-white/[0.08] bg-[#15181d] p-8 text-center">
              <p className="text-sm font-bold text-white">No 3D projects published yet.</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/3d/projects" className="text-sm font-bold text-[#13aff0] hover:text-sky-300">
              Explore all projects
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="px-4 py-10 sm:px-5">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-black text-white">About my 3D work</h2>
          <p className="mt-4 text-sm leading-7 text-zinc-400">
            I mainly work on environment art, props and PBR texturing. I like building assets from the early blockout stage to the final presentation, paying attention to clean topology, UVs, baking, material definition and real-time optimization.
          </p>
          <p className="mt-4 text-sm leading-7 text-zinc-400">
            Texturing is one of the parts I enjoy the most, especially combining Substance 3D Painter with procedural material work in Substance 3D Designer.
          </p>
        </div>
      </section>

      <section id="skills" className="px-4 py-10 sm:px-5">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white">Skills & Tools</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              A compact view of the areas and software I focus on for real-time 3D work.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {skillGroups.map((group) => (
              <article key={group.title} className="rounded-xl bg-[#15181d] p-4 text-center">
                <h3 className="text-sm font-black text-white">{group.title}</h3>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded bg-white/[0.06] px-2.5 py-1.5 text-xs font-semibold text-zinc-300">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact-cta" className="px-4 py-12 sm:px-5">
        <div className="mx-auto max-w-3xl rounded-xl border border-white/[0.08] bg-[#15181d] p-7 text-center">
          <h2 className="text-2xl font-black text-white">Interested in my 3D work?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            If you want to know more about my projects, ask about my 3D work or contact me for an opportunity, feel free to send me a message.
          </p>
          <Link to="/3d/contact" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded bg-[#13aff0] px-4 text-sm font-black text-[#061018] hover:bg-sky-300">
            Contact me <Mail size={15} />
          </Link>
        </div>
      </section>
    </ThreeDLayout>
  )
}

export default ThreeDHome
