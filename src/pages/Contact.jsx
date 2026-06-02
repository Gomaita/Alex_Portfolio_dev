import { motion } from 'framer-motion'
import { Download, ExternalLink, Mail } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import { contact } from '../data/socialLinks'

const contactItems = [
  {
    label: 'Email',
    value: contact.email,
    href: `mailto:${contact.email}`,
    icon: Mail,
  },
  {
    label: 'GitHub',
    value: 'github.com',
    href: contact.github,
    icon: ExternalLink,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com',
    href: contact.linkedin,
    icon: ExternalLink,
  },
  {
    label: 'CV',
    value: 'Download PDF',
    href: '/Alex_Gomez_CV.pdf',
    icon: Download,
    download: true,
  },
]

function Contact() {
  return (
    <section className="min-h-[calc(100svh-5rem)] bg-[linear-gradient(180deg,#020617_0%,#061526_100%)] px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          eyebrow="Contact"
          title="Let's build something clean and useful"
          description="I'm open to junior developer roles, internships, collaborations and projects where I can keep learning and contribute with clean, reliable work."
        />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            className="rounded-md border border-white/10 bg-white/[0.04] p-6 sm:p-8"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid gap-4">
              {contactItems.map((item) => {
                const Icon = item.icon

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={
                      item.label === 'Email' || item.download ? undefined : '_blank'
                    }
                    rel={
                      item.label === 'Email' || item.download ? undefined : 'noreferrer'
                    }
                    download={item.download}
                    aria-label={`Open ${item.label}`}
                    className="flex items-center gap-4 rounded-md border border-white/10 bg-slate-950/50 p-4 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-cyan-300/10 text-cyan-200">
                      <Icon size={20} />
                    </span>
                    <div>
                      <p className="text-sm text-slate-400">{item.label}</p>
                      <p className="font-semibold text-white">{item.value}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </motion.div>

          <motion.form
            className="rounded-md border border-white/10 bg-white/[0.04] p-6 sm:p-8"
            onSubmit={(event) => event.preventDefault()}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <h2 className="text-2xl font-bold text-white">Contact form UI</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              This form is prepared as a UI demo. For real contact, please use
              the email link.
            </p>

            <div className="mt-6 grid gap-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-200">Name</span>
                <input
                  type="text"
                  placeholder="Your name"
                  className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-200">Email</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-200">Message</span>
                <textarea
                  placeholder="Tell me about the role, project or collaboration."
                  className="mt-2 min-h-32 w-full resize-y rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                />
              </label>
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Send via Email <Mail size={18} />
              </a>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

export default Contact
