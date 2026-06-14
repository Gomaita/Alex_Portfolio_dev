import { ArrowRight, ExternalLink, Mail } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ThreeDLayout from '../../components/three-d/ThreeDLayout'
import ThreeDProjectCard from '../../components/three-d/ThreeDProjectCard'
import { ToolBadge } from '../../components/three-d/ToolBadges'
import { contact } from '../../data/socialLinks'
import usePageTitle from '../../hooks/usePageTitle'
import { getPublished3DProjects } from '../../services/threeDProjectsService'

const heroBadges = ['Props', 'Environments', 'PBR Texturing', 'Unreal Engine', 'Unity', 'Substance Tools']

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
      <section className="relative overflow-hidden border-b border-white/[0.07] bg-[#070809]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,184,166,0.09),transparent_34%),radial-gradient(circle_at_18%_70%,rgba(249,115,22,0.04),transparent_30%),radial-gradient(circle_at_82%_65%,rgba(255,255,255,0.035),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_48%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="mx-auto max-w-[92rem] px-4 py-16 text-center sm:px-5 sm:py-24 lg:py-28">
          <div className="relative mx-auto max-w-5xl">
            <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight text-white sm:text-7xl">
              3D Environment & Prop Artist
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg font-semibold leading-8 text-zinc-200">
              Game-ready props, environments and real-time assets focused on PBR texturing, clean topology, optimized workflows and cinematic presentation.
            </p>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-zinc-400">
              I enjoy creating assets that look polished on screen while staying clean, organized and ready for real-time engines.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-2">
              {heroBadges.map((badge) => (
                <span key={badge} className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-zinc-300">
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/3d/projects" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-zinc-100 px-5 text-sm font-black text-[#070809] shadow-lg shadow-white/10 transition hover:-translate-y-0.5 hover:bg-white">
                View Projects <ArrowRight size={16} />
              </Link>
              <Link to="/3d/contact" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-5 text-sm font-bold text-zinc-200 transition hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.065]">
                Contact <Mail size={15} />
              </Link>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-5 text-sm font-bold text-zinc-200 transition hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.065]">
                LinkedIn <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-white/[0.07] bg-[#090a0c]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[92rem] justify-center gap-6 overflow-x-auto px-4 sm:px-5">
          {[
            ['Portfolio', 'portfolio'],
            ['About', 'about'],
            ['Skills', 'skills'],
            ['Contact', 'contact-cta'],
          ].map(([tab, id], index) => (
            <a key={tab} href={`#${id}`} className={`whitespace-nowrap border-b-2 py-3 text-sm font-bold ${index === 0 ? 'border-zinc-300 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
              {tab}
            </a>
          ))}
        </div>
      </div>

      <section id="portfolio" className="px-4 py-14 sm:px-5">
        <div className="mx-auto max-w-[92rem]">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-teal-200/80">Selected work</p>
            <h2 className="text-3xl font-black text-white">Featured Projects</h2>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-zinc-500">
              Selected environments, props and real-time material studies with visual presentation and technical breakdowns.
            </p>
          </div>

          {featuredProjects.length ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {featuredProjects.map((project) => (
                <ThreeDProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-white/[0.08] bg-[#15181d] p-8 text-center">
              <p className="text-sm font-bold text-white">No 3D projects published yet.</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/3d/projects" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-200 hover:text-white">
              Explore all projects <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="px-4 py-14 sm:px-5">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/[0.07] bg-[#111214]/90 p-6 text-center shadow-2xl shadow-black/20 sm:p-9">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-teal-200/80">Artist profile</p>
          <h2 className="mt-2 text-3xl font-black text-white">About my 3D work</h2>
          <p className="mt-5 text-sm leading-7 text-zinc-400">
            I mainly work on environment art, props and PBR texturing. I like building assets from the early blockout stage to the final presentation, paying attention to clean topology, UVs, baking, material definition and real-time optimization.
          </p>
          <p className="mt-4 text-sm leading-7 text-zinc-400">
            Texturing is one of the parts I enjoy the most, especially combining Substance 3D Painter with procedural material work in Substance 3D Designer.
          </p>
        </div>
      </section>

      <section id="skills" className="px-4 py-14 sm:px-5">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-teal-200/80">Pipeline mindset</p>
            <h2 className="mt-2 text-3xl font-black text-white">Skills & Tools</h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {skillGroups.map((group) => (
              <article key={group.title} className="rounded-2xl border border-white/[0.07] bg-[#111214] p-5 text-center shadow-xl shadow-black/10">
                <h3 className="text-sm font-black text-white">{group.title}</h3>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {group.title === 'Software'
                    ? group.items.map((item) => <ToolBadge key={item} tool={item} />)
                    : group.items.map((item) => (
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

      <section id="contact-cta" className="px-4 py-16 sm:px-5">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/[0.07] bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.08),transparent_36%),#111214] p-8 text-center shadow-2xl shadow-black/25">
          <h2 className="text-3xl font-black text-white">Interested in my 3D work?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            If you want to know more about my projects, ask about my 3D work or contact me for an opportunity, feel free to send me a message.
          </p>
          <Link to="/3d/contact" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-zinc-100 px-5 text-sm font-black text-[#070809] shadow-lg shadow-white/10 transition hover:-translate-y-0.5 hover:bg-white">
            Contact me <Mail size={15} />
          </Link>
        </div>
      </section>
    </ThreeDLayout>
  )
}

export default ThreeDHome
