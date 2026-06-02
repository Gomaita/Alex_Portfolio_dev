import { motion } from 'framer-motion'
import { ArrowRight, Download, ExternalLink, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { contact } from '../data/socialLinks'

const buttonBase =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950'

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(139,92,246,0.16),transparent_26%),linear-gradient(135deg,#020617_0%,#07111f_50%,#050816_100%)]" />
      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-6xl items-center gap-12 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <p className="mb-5 inline-flex rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-sm font-medium text-cyan-200">
            Open to junior software developer opportunities
          </p>
          <h1 className="max-w-3xl text-5xl font-bold tracking-normal text-white sm:text-6xl lg:text-7xl">
            Alex Gómez
          </h1>
          <p className="mt-4 text-xl font-semibold text-cyan-200 sm:text-2xl">
            Junior Software Developer
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            I build small but complete web projects that help me improve as a
            developer: API-driven tools, interactive interfaces, local data
            management and clean frontend experiences.
          </p>
          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            My background in Multimedia Engineering, 3D environments and VR gives
            me a visual and technical perspective when building software. I care
            about structure, usability and creating things that feel clear,
            useful and well presented.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/portfolio"
              className={`${buttonBase} bg-cyan-300 text-slate-950 hover:bg-cyan-200`}
            >
              View Technical Projects <ArrowRight size={18} />
            </Link>
            <Link
              to="/cheatsheets"
              className={`${buttonBase} border border-white/15 bg-white/5 text-white hover:bg-white/10`}
            >
              Explore Cheatsheets
            </Link>
            <a
              href="/Alex_Gomez_CV.pdf"
              download
              className={`${buttonBase} border border-cyan-300/25 text-cyan-100 hover:bg-cyan-300/10`}
            >
              Download CV <Download size={18} />
            </a>
            <Link
              to="/contact"
              className={`${buttonBase} border border-white/15 text-slate-200 hover:bg-white/10`}
            >
              Contact Me <Mail size={18} />
            </Link>
            <a
              href={contact.github}
              target="_blank"
              rel="noreferrer"
              aria-label="Open Alex Gómez GitHub profile"
              className={`${buttonBase} border border-white/15 text-slate-200 hover:bg-white/10`}
            >
              GitHub <ExternalLink size={18} />
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="Open Alex Gómez LinkedIn profile"
              className={`${buttonBase} border border-white/15 text-slate-200 hover:bg-white/10`}
            >
              LinkedIn <ExternalLink size={18} />
            </a>
          </div>
        </motion.div>

        <motion.div
          className="relative hidden min-h-[520px] lg:block"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 rounded-md border border-white/10 bg-white/[0.04] shadow-2xl shadow-cyan-950/40 backdrop-blur" />
          <div className="relative z-10 flex min-h-[520px] flex-col justify-between gap-6 p-6">
          <div className="rounded-md border border-cyan-300/20 bg-slate-950/80 p-6">
            <div className="mb-6 flex gap-2">
              <span className="h-3 w-3 rounded-full bg-cyan-300" />
              <span className="h-3 w-3 rounded-full bg-blue-400" />
              <span className="h-3 w-3 rounded-full bg-violet-400" />
            </div>
            <div className="space-y-4 font-mono text-sm text-slate-300">
              <p>
                <span className="text-violet-300">const</span>{' '}
                <span className="text-cyan-200">profile</span> = {'{'}
              </p>
              <p className="pl-5">name: 'Alex Gómez',</p>
              <p className="pl-5">role: 'Junior Software Developer',</p>
              <p className="pl-5">focus: ['React', 'APIs', 'Databases'],</p>
              <p className="pl-5">background: ['3D', 'VR', 'Unity'],</p>
              <p>{'}'}</p>
            </div>
          </div>
          <div className="mr-6 rounded-md border border-white/10 bg-slate-900/80 p-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Currently building
            </p>
            <div className="mt-4 grid gap-3">
              {['API dashboards', 'CRUD interfaces', 'Developer learning tools'].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
