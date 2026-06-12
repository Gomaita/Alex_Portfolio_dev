import { Mail } from 'lucide-react'
import { useState } from 'react'
import ThreeDLayout from '../../components/three-d/ThreeDLayout'
import { contact } from '../../data/socialLinks'
import usePageTitle from '../../hooks/usePageTitle'
import { createContactMessage } from '../../services/backend/contactMessagesService'

const initialForm = {
  name: '',
  email: '',
  subject: '3D Portfolio Contact',
  message: '',
  website: '',
}

function ThreeDContact() {
  usePageTitle('Contact | Alex Gómez 3D')
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('')
    setStatusType('')
    setIsSubmitting(true)

    try {
      await createContactMessage({
        name: form.name,
        email: form.email,
        honeypot: form.website,
        message: [
          `[3D Portfolio] ${form.subject || '3D Portfolio Contact'}`,
          '',
          form.message,
        ].join('\n'),
      })
      setStatus('Your message has been sent. Thank you for reaching out.')
      setStatusType('success')
      setForm(initialForm)
    } catch {
      setStatus('The message could not be sent. Please try again later.')
      setStatusType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ThreeDLayout>
      <section className="px-4 py-12 sm:px-5 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="text-center lg:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#13aff0]">3D Contact</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Contact</h1>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              Feel free to contact me about my 3D work, portfolio, opportunities or collaborations.
            </p>
            <a href={`mailto:${contact.email}`} className="mt-6 inline-flex min-h-10 items-center gap-2 rounded border border-white/10 px-4 text-sm font-bold text-zinc-200 hover:border-white/25">
              <Mail size={15} /> {contact.email}
            </a>
          </div>

          <form onSubmit={handleSubmit} className="rounded-xl border border-white/[0.08] bg-[#15181d] p-5">
            <label className="hidden" aria-hidden="true">
              <span>Website</span>
              <input
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(event) => updateField('website', event.target.value)}
              />
            </label>

            <div className="grid gap-4">
              <label className="grid gap-1.5 text-sm font-semibold text-zinc-300">
                Name
                <input
                  required
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Your name"
                  className="min-h-10 rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#13aff0]"
                />
              </label>

              <label className="grid gap-1.5 text-sm font-semibold text-zinc-300">
                Email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="you@example.com"
                  className="min-h-10 rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#13aff0]"
                />
              </label>

              <label className="grid gap-1.5 text-sm font-semibold text-zinc-300">
                Subject
                <input
                  value={form.subject}
                  onChange={(event) => updateField('subject', event.target.value)}
                  placeholder="3D Portfolio Contact"
                  className="min-h-10 rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#13aff0]"
                />
              </label>

              <label className="grid gap-1.5 text-sm font-semibold text-zinc-300">
                Message
                <textarea
                  required
                  value={form.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  placeholder="Tell me about the opportunity, project or question."
                  rows={6}
                  className="resize-y rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm leading-6 text-white outline-none placeholder:text-zinc-600 focus:border-[#13aff0]"
                />
              </label>

              {status && (
                <p className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                  statusType === 'success'
                    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100'
                    : 'border-red-400/30 bg-red-500/10 text-red-100'
                }`}
                >
                  {status}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-10 items-center justify-center rounded bg-[#13aff0] px-4 text-sm font-black text-[#061018] hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Sending...' : 'Send message'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </ThreeDLayout>
  )
}

export default ThreeDContact
