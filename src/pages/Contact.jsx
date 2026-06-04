import { ExternalLink, Mail } from 'lucide-react'
import { useState } from 'react'
import PageHeader from '../components/ui/PageHeader'
import Section from '../components/ui/Section'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import CVDownloads from '../components/ui/CVDownloads'
import { appConfig } from '../config/appConfig'
import { contact } from '../data/socialLinks'
import { createContactMessage } from '../services/backend/contactMessagesService'

const contactItems = [
  { label: 'Email', value: contact.email, href: `mailto:${contact.email}`, icon: Mail },
  { label: 'LinkedIn', value: 'Professional profile', href: contact.linkedin, icon: ExternalLink },
  { label: 'GitHub', value: 'Projects and code', href: contact.github, icon: ExternalLink },
]

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    website: '',
  })
  const [formStatus, setFormStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormStatus('')

    if (!appConfig.isBackendEnabled) {
      setFormStatus('The backend is not connected in this demo build. Please use the email link.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await createContactMessage({
        name: form.name,
        email: form.email,
        message: form.message,
        honeypot: form.website,
      })
      setFormStatus(response?.message || 'Message received.')
      setForm({ name: '', email: '', message: '', website: '' })
    } catch (error) {
      setFormStatus(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-[#F6F8FB] dark:bg-slate-950">
      <Section className="pt-16">
        <PageHeader
          eyebrow="Contact"
          title="Let's connect"
          description="I'm open to junior developer roles, internships and projects where I can keep learning and contribute with reliable work."
        />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4">
            {contactItems.map((item) => {
              const Icon = item.icon
              const external = item.href.startsWith('http')

              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                  download={item.download}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:hover:bg-slate-800/70 dark:focus:ring-sky-400 dark:focus:ring-offset-slate-950"
                >
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-sky-950/60 dark:text-sky-200">
                      <Icon size={20} />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">{item.label}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.value}</p>
                    </div>
                  </div>
                </a>
              )
            })}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                Download my CV
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Choose the version that fits best.
              </p>
              <CVDownloads layout="cards" className="mt-4" />
            </div>
          </div>

          <Card as="form" className="p-6 sm:p-8" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Contact form</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              This form is prepared for the future Cloudflare backend. In this
              demo build, the email link remains the safest contact option.
            </p>
            <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
              Submitted content is not public unless a real backend receives it
              and an admin approves it.
            </p>
            <div className="mt-6 grid gap-4">
              <label className="hidden" aria-hidden="true">
                <span>Website</span>
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(event) => updateField('website', event.target.value)}
                />
              </label>

              {[
                ['name', 'Name'],
                ['email', 'Email'],
              ].map(([field, label]) => (
                <label key={field} className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
                  <input
                    type={label === 'Email' ? 'email' : 'text'}
                    value={form[field]}
                    onChange={(event) => updateField(field, event.target.value)}
                    placeholder={label === 'Email' ? 'you@example.com' : 'Your name'}
                    className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-950"
                  />
                </label>
              ))}
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Message</span>
                <textarea
                  value={form.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  placeholder="Tell me about the role, project or collaboration."
                  className="mt-2 min-h-32 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-950"
                />
              </label>

              {formStatus && (
                <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
                  {formStatus}
                </p>
              )}

              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send message'}
              </Button>
              <Button href={`mailto:${contact.email}`}>
                Use email link <Mail size={18} />
              </Button>
            </div>
          </Card>
        </div>
      </Section>
    </main>
  )
}

export default Contact
