import { useEffect, useMemo, useState } from 'react'
import ThreeDImageFrame from '../../components/three-d/ThreeDImageFrame'
import ThreeDLayout from '../../components/three-d/ThreeDLayout'
import usePageTitle from '../../hooks/usePageTitle'
import {
  create3DProject,
  delete3DProject,
  getAll3DProjects,
  toggle3DProjectFeatured,
  toggle3DProjectPublished,
  update3DProject,
} from '../../services/adminThreeDProjectsService'

const emptyForm = {
  title: '',
  slug: '',
  subtitle: '',
  description: '',
  date: '',
  year: '',
  category: 'Personal Project',
  role: '',
  thumbnailUrl: '',
  heroImageUrl: '',
  imagesText: '',
  toolsText: '',
  techniquesText: '',
  externalLinksText: '',
  breakdown: '',
  technicalNotes: '',
  published: false,
  featured: false,
  sortOrder: 0,
}

function splitList(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

function parseImages(value) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [url, alt = '', caption = ''] = line.split('|').map((part) => part.trim())
      return { url, alt, caption }
    })
}

function parseLinks(value) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url] = line.split('|').map((part) => part.trim())
      return { label, url }
    })
    .filter((link) => link.label && link.url)
}

function projectToForm(project) {
  if (!project) return emptyForm
  return {
    ...emptyForm,
    title: project.title || '',
    slug: project.slug || '',
    subtitle: project.subtitle || '',
    description: project.description || '',
    date: project.date || '',
    year: project.year || '',
    category: project.category || 'Personal Project',
    role: project.role || '',
    thumbnailUrl: project.thumbnailUrl || project.thumbnail_url || '',
    heroImageUrl: project.heroImageUrl || project.hero_image_url || '',
    imagesText: (project.images || []).map((image) => [image.url, image.alt, image.caption].filter(Boolean).join(' | ')).join('\n'),
    toolsText: (project.tools || []).join(', '),
    techniquesText: (project.techniques || []).join(', '),
    externalLinksText: (project.externalLinks || []).map((link) => `${link.label} | ${link.url}`).join('\n'),
    breakdown: project.breakdown || '',
    technicalNotes: project.technicalNotes || project.technical_notes || '',
    published: Boolean(project.published),
    featured: Boolean(project.featured),
    sortOrder: project.sortOrder ?? project.sort_order ?? 0,
  }
}

function formToPayload(form) {
  return {
    title: form.title,
    slug: form.slug,
    subtitle: form.subtitle,
    description: form.description,
    date: form.date,
    year: form.year,
    category: form.category,
    role: form.role,
    thumbnailUrl: form.thumbnailUrl,
    heroImageUrl: form.heroImageUrl,
    images: parseImages(form.imagesText),
    tools: splitList(form.toolsText),
    techniques: splitList(form.techniquesText),
    externalLinks: parseLinks(form.externalLinksText),
    breakdown: form.breakdown,
    technicalNotes: form.technicalNotes,
    published: form.published,
    featured: form.featured,
    sortOrder: Number(form.sortOrder) || 0,
  }
}

function ThreeDAdmin() {
  usePageTitle('3D Admin | Alex Gómez')
  const [token, setToken] = useState(() => sessionStorage.getItem('threeDAdminToken') || '')
  const [tokenInput, setTokenInput] = useState('')
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const preview = useMemo(() => formToPayload(form), [form])

  useEffect(() => {
    if (token) {
      loadProjects(token)
    }
  }, [token])

  async function loadProjects(nextToken = token) {
    setLoading(true)
    setError('')
    try {
      const data = await getAll3DProjects(nextToken)
      setProjects(data.projects || [])
      setStatus('Admin panel unlocked.')
    } catch (err) {
      setError(err.message || 'Could not load projects. Check the token.')
      sessionStorage.removeItem('threeDAdminToken')
      setToken('')
    } finally {
      setLoading(false)
    }
  }

  function unlock(event) {
    event.preventDefault()
    const cleanToken = tokenInput.trim()
    if (!cleanToken) {
      setError('Admin token is required.')
      return
    }
    sessionStorage.setItem('threeDAdminToken', cleanToken)
    setToken(cleanToken)
    setTokenInput('')
  }

  function logout() {
    sessionStorage.removeItem('threeDAdminToken')
    setToken('')
    setProjects([])
    setSelectedProject(null)
    setForm(emptyForm)
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function editProject(project) {
    setSelectedProject(project)
    setForm(projectToForm(project))
    setStatus('')
    setError('')
  }

  function newProject() {
    setSelectedProject(null)
    setForm(emptyForm)
    setStatus('')
    setError('')
  }

  async function saveProject(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setStatus('')
    try {
      const payload = formToPayload(form)
      const data = selectedProject
        ? await update3DProject(token, selectedProject.id, payload)
        : await create3DProject(token, payload)
      setStatus(data.message || 'Project saved.')
      await loadProjects(token)
      if (!selectedProject) setForm(emptyForm)
    } catch (err) {
      setError(err.message || 'Could not save project.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteProject(project) {
    if (!window.confirm(`Delete "${project.title}"?`)) return
    await delete3DProject(token, project.id)
    await loadProjects(token)
    if (selectedProject?.id === project.id) newProject()
  }

  async function togglePublished(project) {
    await toggle3DProjectPublished(token, project.id, !project.published)
    await loadProjects(token)
  }

  async function toggleFeatured(project) {
    await toggle3DProjectFeatured(token, project.id, !project.featured)
    await loadProjects(token)
  }

  if (!token) {
    return (
      <ThreeDLayout>
        <section className="mx-auto flex min-h-[calc(100svh-8rem)] max-w-md items-center px-5 py-16">
          <form onSubmit={unlock} className="w-full rounded-2xl border border-white/10 bg-[#12161c] p-6 shadow-2xl shadow-black/30">
            <h1 className="text-2xl font-black text-white">3D Admin</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Enter the backend admin token. It is stored only in sessionStorage for this browser session.
            </p>
            <label className="mt-5 grid gap-2 text-sm font-semibold text-zinc-300">
              Admin token
              <input
                type="password"
                value={tokenInput}
                onChange={(event) => setTokenInput(event.target.value)}
                className="min-h-11 rounded-xl border border-white/10 bg-black/30 px-3 text-white outline-none focus:border-sky-300"
              />
            </label>
            {error && <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</p>}
            <button type="submit" className="mt-5 min-h-11 w-full rounded-xl bg-sky-400 px-4 py-2 text-sm font-black text-slate-950 hover:bg-sky-300">
              Unlock admin panel
            </button>
          </form>
        </section>
      </ThreeDLayout>
    )
  }

  return (
    <ThreeDLayout>
      <section className="px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-sky-300">Private route</p>
              <h1 className="mt-3 text-4xl font-black text-white">3D Project Admin</h1>
              <p className="mt-3 text-sm text-zinc-400">
                Upload your images to public/3d/projects or use an external image URL, then paste the image path here.
              </p>
            </div>
            <button type="button" onClick={logout} className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 hover:border-red-300/50">
              Log out
            </button>
          </div>

          {(status || error) && (
            <div className={`mt-6 rounded-xl border p-3 text-sm ${error ? 'border-red-500/30 bg-red-500/10 text-red-100' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'}`}>
              {error || status}
            </div>
          )}

          <div className="mt-8 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <aside className="rounded-2xl border border-white/10 bg-[#12161c] p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-black text-white">Projects</h2>
                <button type="button" onClick={newProject} className="rounded-full bg-sky-400 px-3 py-1.5 text-xs font-black text-slate-950">
                  New
                </button>
              </div>
              {loading ? (
                <p className="mt-5 text-sm text-zinc-400">Loading projects...</p>
              ) : (
                <div className="mt-5 space-y-3">
                  {projects.map((project) => (
                    <div key={project.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="font-bold text-white">{project.title}</p>
                      <p className="mt-1 text-xs text-zinc-500">{project.category} - Updated {project.updatedAt || project.updated_at}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button type="button" onClick={() => editProject(project)} className="rounded-lg border border-white/10 px-2 py-1 text-xs font-bold text-zinc-300">Edit</button>
                        <button type="button" onClick={() => togglePublished(project)} className="rounded-lg border border-white/10 px-2 py-1 text-xs font-bold text-zinc-300">{project.published ? 'Hide' : 'Publish'}</button>
                        <button type="button" onClick={() => toggleFeatured(project)} className="rounded-lg border border-white/10 px-2 py-1 text-xs font-bold text-zinc-300">{project.featured ? 'Unfeature' : 'Feature'}</button>
                        <button type="button" onClick={() => deleteProject(project)} className="rounded-lg border border-red-400/30 px-2 py-1 text-xs font-bold text-red-200">Delete</button>
                      </div>
                    </div>
                  ))}
                  {!projects.length && <p className="text-sm text-zinc-500">No 3D projects yet.</p>}
                </div>
              )}
            </aside>

            <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
              <form onSubmit={saveProject} className="rounded-2xl border border-white/10 bg-[#12161c] p-5">
                <h2 className="font-black text-white">{selectedProject ? 'Edit project' : 'Create project'}</h2>
                <div className="mt-5 grid gap-4">
                  {[
                    ['title', 'Title'],
                    ['slug', 'Slug'],
                    ['subtitle', 'Subtitle'],
                    ['date', 'Date'],
                    ['year', 'Year'],
                    ['category', 'Category'],
                    ['role', 'Role'],
                    ['thumbnailUrl', 'Thumbnail URL'],
                    ['heroImageUrl', 'Hero Image URL'],
                  ].map(([field, label]) => (
                    <label key={field} className="grid gap-2 text-sm font-semibold text-zinc-300">
                      {label}
                      <input value={form[field]} onChange={(event) => updateField(field, event.target.value)} className="min-h-11 rounded-xl border border-white/10 bg-black/30 px-3 text-white outline-none focus:border-sky-300" />
                    </label>
                  ))}
                  <label className="grid gap-2 text-sm font-semibold text-zinc-300">
                    Description
                    <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} rows={4} className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-white outline-none focus:border-sky-300" />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-zinc-300">
                    Gallery images
                    <textarea value={form.imagesText} onChange={(event) => updateField('imagesText', event.target.value)} rows={4} placeholder="/3d/projects/project/hero.jpg | Alt text | Caption" className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-white outline-none focus:border-sky-300" />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-zinc-300">
                    Tools
                    <input value={form.toolsText} onChange={(event) => updateField('toolsText', event.target.value)} placeholder="Blender, Substance Painter" className="min-h-11 rounded-xl border border-white/10 bg-black/30 px-3 text-white outline-none focus:border-sky-300" />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-zinc-300">
                    Techniques
                    <input value={form.techniquesText} onChange={(event) => updateField('techniquesText', event.target.value)} placeholder="UV Mapping, PBR Texturing" className="min-h-11 rounded-xl border border-white/10 bg-black/30 px-3 text-white outline-none focus:border-sky-300" />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-zinc-300">
                    External links
                    <textarea value={form.externalLinksText} onChange={(event) => updateField('externalLinksText', event.target.value)} rows={3} placeholder="ArtStation | https://..." className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-white outline-none focus:border-sky-300" />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-zinc-300">
                    Project breakdown
                    <textarea value={form.breakdown} onChange={(event) => updateField('breakdown', event.target.value)} rows={4} className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-white outline-none focus:border-sky-300" />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-zinc-300">
                    Technical notes
                    <textarea value={form.technicalNotes} onChange={(event) => updateField('technicalNotes', event.target.value)} rows={4} className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-white outline-none focus:border-sky-300" />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-zinc-300">
                    Sort order
                    <input type="number" value={form.sortOrder} onChange={(event) => updateField('sortOrder', event.target.value)} className="min-h-11 rounded-xl border border-white/10 bg-black/30 px-3 text-white outline-none focus:border-sky-300" />
                  </label>
                  <div className="flex flex-wrap gap-4 text-sm font-semibold text-zinc-300">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={(event) => updateField('published', event.target.checked)} /> Published</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(event) => updateField('featured', event.target.checked)} /> Featured</label>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="submit" disabled={saving} className="rounded-xl bg-sky-400 px-5 py-3 text-sm font-black text-slate-950 disabled:opacity-60">
                    {saving ? 'Saving...' : 'Save project'}
                  </button>
                  <button type="button" onClick={newProject} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-zinc-300">
                    Reset
                  </button>
                </div>
              </form>

              <aside className="rounded-2xl border border-white/10 bg-[#12161c] p-5">
                <h2 className="font-black text-white">Preview</h2>
                <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                  <div className="aspect-[4/3]">
                    <ThreeDImageFrame src={preview.thumbnailUrl || preview.heroImageUrl} alt={`${preview.title || 'Project'} preview`} />
                  </div>
                </div>
                <p className="mt-4 text-xl font-black text-white">{preview.title || 'Untitled project'}</p>
                <p className="mt-2 text-sm text-zinc-400">{preview.category}</p>
                <p className="mt-4 text-sm leading-6 text-zinc-400">{preview.description || 'Project description preview.'}</p>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </ThreeDLayout>
  )
}

export default ThreeDAdmin
