import { ArrowRight, ExternalLink, Mail } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ThreeDLayout from '../../components/three-d/ThreeDLayout'
import ThreeDProjectCard from '../../components/three-d/ThreeDProjectCard'
import { ToolBadge } from '../../components/three-d/ToolBadges'
import usePageTitle from '../../hooks/usePageTitle'
import { getPublished3DProjects } from '../../services/threeDProjectsService'

const heroBadges = ['Props', 'Environments', 'PBR Texturing', 'Unreal Engine', 'Unity', 'Substance Tools']
const artStationUrl = 'https://www.artstation.com/gomaita'

const profileBlocks = [
  {
    title: 'What I do',
    text: 'I create 3D props, environments and real-time scenes with a focus on clean assets, believable materials and optimized workflows for games.',
  },
  {
    title: 'My workflow',
    text: 'I enjoy working through the full pipeline: modeling, retopology, UVs, baking, texturing, lighting, rendering and engine integration.',
  },
  {
    title: 'Technical side',
    text: 'Thanks to my background in Multimedia Engineering, I feel comfortable working with technical constraints, optimization, real-time engines and procedural tools.',
  },
  {
    title: 'Procedural materials',
    text: 'I am especially interested in Substance 3D Designer and procedural texturing, using it to create flexible materials that add depth and personality to my environments.',
  },
  {
    title: 'How I work',
    text: 'I am communicative, organized and comfortable working in a team. I like improving every project step by step and learning from other professionals.',
  },
  {
    title: 'Tools',
    text: 'Blender / 3ds Max / Maya / ZBrush / Marmoset Toolbag / Substance 3D Painter / Substance 3D Designer / Unreal Engine',
  },
]

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

export default function ThreeDHome() {
  usePageTitle('Alex G\u00f3mez | 3D Environment & Prop Artist')

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    getPublished3DProjects()
      .then((items) => {
        if (active) {
          setProjects(items)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const featuredProjects = useMemo(() => {
    const featured = projects.filter((project) => project.featured)
    const source = featured.length > 0 ? featured : projects
    return source.slice(0, 4)
  }, [projects])

  return (
    <ThreeDLayout>
      <section className="relative overflow-hidden border-b border-white/5 bg-[#090a0d]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-96 w-[44rem] -translate-x-1/2 rounded-full bg-white/[0.055] blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-72 w-[34rem] -translate-x-1/2 rounded-full bg-[#13aff0]/[0.07] blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_42%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[520px] max-w-6xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
              Hi, I&apos;m Alex G&oacute;mez.
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-xl font-medium leading-relaxed text-zinc-100 sm:text-2xl">
              I create 3D environments and props for games, combining artistic detail with a technical mindset.
            </p>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
              My background in Multimedia Engineering helps me understand both the creative and technical sides of digital projects. After specializing in AAA environment and prop creation, I now focus on modeling, texturing, optimization and real-time scenes.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              {heroBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/10 bg-white/[0.055] px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-zinc-300"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/3d/projects"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-50 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:bg-white"
              >
                View Projects
                <ArrowRight size={16} />
              </Link>
              <a
                href={artStationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#13aff0]/35 bg-[#13aff0]/10 px-5 py-3 text-sm font-semibold text-[#8bdcff] transition hover:-translate-y-0.5 hover:border-[#13aff0]/60 hover:bg-[#13aff0]/15"
              >
                View ArtStation
                <ExternalLink size={15} />
              </a>
              <Link
                to="/3d/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:-translate-y-0.5 hover:bg-white/[0.075]"
              >
                Contact Me
                <Mail size={15} />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.025] px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:-translate-y-0.5 hover:bg-white/[0.065] hover:text-zinc-50"
              >
                Software Portfolio
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Featured work</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-50 sm:text-3xl">Selected 3D projects</h2>
          </div>
          <Link
            to="/3d/projects"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#8bdcff] transition hover:text-zinc-50"
          >
            View all projects
            <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-8 text-center text-sm text-zinc-400">
            Loading published projects...
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProjects.map((project) => (
              <ThreeDProjectCard key={project.id || project.slug} project={project} compact />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-8 text-center">
            <h3 className="text-lg font-semibold text-zinc-100">No 3D projects published yet.</h3>
            <p className="mt-2 text-sm text-zinc-400">New work is being prepared.</p>
          </div>
        )}
      </section>

      <section id="about" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">About</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-50 sm:text-3xl">About my 3D work</h2>
          <p className="mt-5 text-base leading-8 text-zinc-400">
            I studied Multimedia Engineering at the University of Alicante, where I built a strong foundation in app development, programming and videogames. After finishing my degree, I moved to Madrid to study the Advanced Master in 3D Modeling and Texturing of Environments & Props for AAA Games at Voxel School.
          </p>
          <p className="mt-4 text-base leading-8 text-zinc-400">
            There, I learned the full production pipeline used in game studios: high and low poly modeling, retopology, baking, UVs, PBR texturing, lighting, set dressing, rendering and real-time scene creation in Unreal Engine.
          </p>
          <p className="mt-4 text-base leading-8 text-zinc-400">
            During this process, I became especially interested in procedural workflows. Substance 3D Designer opened a new way for me to create materials, build richer surfaces and push my scenes further with more control and flexibility.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {profileBlocks.map((block) => (
            <article
              key={block.title}
              className="rounded-3xl border border-white/8 bg-[#14161b]/80 p-6 shadow-[0_22px_70px_rgba(0,0,0,0.28)]"
            >
              <h3 className="text-base font-semibold text-zinc-50">{block.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{block.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/8 bg-[#111318] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] sm:p-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Skills & Tools</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-50">Focused on real-time asset creation</h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {skillGroups.map((group) => (
              <div key={group.title} className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">{group.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.title === 'Software'
                    ? group.items.map((item) => <ToolBadge key={item} tool={item} />)
                    : group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/8 bg-white/[0.055] px-3 py-1.5 text-xs font-medium text-zinc-300"
                        >
                          {item}
                        </span>
                      ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/8 bg-gradient-to-br from-[#161920] to-[#0d0f12] p-8 text-center shadow-[0_28px_90px_rgba(0,0,0,0.34)] sm:p-10">
          <h2 className="text-2xl font-semibold text-zinc-50">Interested in my 3D work?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            If you want to know more about my projects, ask about my 3D work or contact me for an opportunity, feel free to send me a message.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/3d/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-50 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:bg-white"
            >
              Contact Me
              <Mail size={15} />
            </Link>
            <a
              href={artStationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:-translate-y-0.5 hover:bg-white/[0.075]"
            >
              ArtStation Portfolio
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </section>
    </ThreeDLayout>
  )
}
