import { ArrowRight, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import ApiStatePlayground from '../components/ApiStatePlayground'
import CodeSnippetLibrary from '../components/CodeSnippetLibrary'
import Hero from '../components/Hero'
import InterviewPrepTool from '../components/InterviewPrepTool'
import ProjectCard from '../components/ProjectCard'
import SectionTitle from '../components/SectionTitle'
import SkillCard from '../components/SkillCard'
import TechStackExplorer from '../components/TechStackExplorer'
import { projects } from '../data/projects'
import { skills } from '../data/skills'

const buildingCards = [
  {
    title: 'API-driven interfaces',
    text: 'Small tools that fetch data, handle errors and present information clearly.',
  },
  {
    title: 'CRUD & state management',
    text: 'Interfaces with forms, filters, editable data and local persistence.',
  },
  {
    title: 'Developer learning tools',
    text: 'Cheatsheets, interview practice and references that help me learn by building.',
  },
]

function Home() {
  const featuredProjects = projects.slice(0, 4)

  return (
    <>
      <Hero />

      <section className="border-t border-white/10 bg-slate-950 px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            eyebrow="What I'm Building"
            title="Small projects with real application patterns"
            description="I like building compact but complete features: request data, organize components, store state, validate forms and make the UI feel clear."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {buildingCards.map((card) => (
              <article
                key={card.title}
                className="rounded-md border border-white/10 bg-white/[0.04] p-6 transition hover:border-cyan-300/40 hover:bg-white/[0.07]"
              >
                <h3 className="text-xl font-bold text-white">{card.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-950 px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            eyebrow="Skills"
            title="A practical toolkit for web and interactive software"
            description="Core technologies for building frontends, connecting APIs, structuring data and creating interactive experiences."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((skill, index) => (
              <SkillCard key={skill} name={skill} index={index} />
            ))}
          </div>
        </div>
      </section>

      <TechStackExplorer />

      <section className="border-t border-white/10 bg-[linear-gradient(180deg,#020617_0%,#07111f_100%)] px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            eyebrow="Featured Projects"
            title="Technical demos for interviews and practice"
            description="A few focused projects that demonstrate APIs, forms, state, routing and data-driven UI."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      <InterviewPrepTool />
      <ApiStatePlayground />
      <CodeSnippetLibrary />

      <section className="border-t border-white/10 bg-[linear-gradient(180deg,#020617_0%,#07111f_100%)] px-5 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-md border border-cyan-300/15 bg-white/[0.04] p-6 shadow-2xl shadow-slate-950/30 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Pocket Reference
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-normal text-white">
                Developer Cheatsheets
              </h2>
              <p className="mt-3 leading-7 text-slate-300">
                Quick syntax references for programming languages, web
                technologies and developer tools.
              </p>
              <Link
                to="/cheatsheets"
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Explore Cheatsheets <ArrowRight size={18} />
              </Link>
            </div>

            <div className="rounded-md border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-slate-950/30 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                CV
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-normal text-white">
                Want the classic CV version?
              </h2>
              <p className="mt-3 leading-7 text-slate-300">
                Download the PDF version for a more traditional overview of my
                education, tools and experience.
              </p>
              <a
                href="/Alex_Gomez_CV.pdf"
                download
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-cyan-300/25 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Download CV <Download size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
