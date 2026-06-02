import { motion } from 'framer-motion'
import { Code2, Download, Eye, Layers, Sparkles } from 'lucide-react'
import LearningRoadmap from '../components/LearningRoadmap'
import SectionTitle from '../components/SectionTitle'

const workCards = [
  {
    icon: Code2,
    title: 'I learn by building',
    text: 'I prefer practical projects where I can connect the pieces: UI, state, data, errors and structure.',
  },
  {
    icon: Layers,
    title: 'I care about clean structure',
    text: 'I try to keep components readable, data separated and features easy to explain in an interview.',
  },
  {
    icon: Eye,
    title: 'I like usable interfaces',
    text: 'My visual background helps me notice spacing, hierarchy and whether a screen feels understandable.',
  },
  {
    icon: Sparkles,
    title: 'I mix technical and creative work',
    text: 'I am comfortable moving between code, interaction, visuals and real-time tools.',
  },
]

function About() {
  return (
    <section className="min-h-[calc(100svh-5rem)] bg-slate-950 px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          eyebrow="About"
          title="A junior developer with a multimedia and 3D background"
          description="I am focused on becoming a reliable software developer by building practical projects and understanding how real interfaces behave."
        />

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.article
            className="rounded-md border border-white/10 bg-white/[0.04] p-6 sm:p-8"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg leading-8 text-slate-300">
              I'm a Junior Software Developer with a background in Multimedia
              Engineering. I enjoy building clean, responsive and practical web
              applications, especially projects involving APIs, data
              visualization, databases and interactive user interfaces.
            </p>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Before focusing more deeply on software development, I worked with
              3D environments, real-time tools and interactive experiences. That
              background shaped the way I think about interfaces: structure
              matters, but so do clarity, rhythm, presentation and usability.
            </p>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Right now I am strengthening my frontend and backend foundations:
              React, JavaScript, TypeScript, REST APIs, SQL, Java and practical
              project architecture. I am looking for junior roles, internships
              or teams where I can learn from experienced developers and
              contribute with clean, reliable work.
            </p>
          </motion.article>

          <motion.article
            className="rounded-md border border-cyan-300/15 bg-slate-950/70 p-6 sm:p-8"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
              <Layers size={22} />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-white">
              From 3D environments to software development
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              My experience with 3D, VR, Unity, Unreal Engine, shaders,
              procedural textures and real-time environments gives me a useful
              bridge between visual work and technical systems.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Unity', 'Unreal Engine', 'VR', 'Shaders', 'Real-time environments'].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-md border border-violet-300/20 bg-violet-300/10 px-2.5 py-1 text-xs font-semibold text-violet-100"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </motion.article>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {workCards.map((card, index) => {
            const Icon = card.icon

            return (
              <motion.article
                key={card.title}
                className="rounded-md border border-white/10 bg-white/[0.04] p-5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-cyan-300/10 text-cyan-200">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{card.text}</p>
              </motion.article>
            )
          })}
        </div>

        <LearningRoadmap />

        <div className="mt-8 rounded-md border border-cyan-300/15 bg-white/[0.04] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                CV
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Want the classic CV version?
              </h2>
              <p className="mt-2 leading-7 text-slate-300">
                Download the PDF if you want the traditional overview of my
                education, tools and experience.
              </p>
            </div>
            <a
              href="/Alex_Gomez_CV.pdf"
              download
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Download CV <Download size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
