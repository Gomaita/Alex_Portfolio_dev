import { Copy, Eye, Save, Trash2 } from 'lucide-react'
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
  engine: '',
  assetType: '',
  polycount: '',
  textureResolution: '',
  texelDensity: '',
  targetPlatform: '',
  timeSpent: '',
  softwareUsedText: '',
  materialsText: '',
  shaderNotes: '',
  optimizationNotes: '',
  textureWorkflow: '',
  substancePainterNotes: '',
  substanceDesignerNotes: '',
  textureMapsText: '',
  contentBlocksText: '',
  published: false,
  featured: false,
  sortOrder: 0,
}

function splitList(value = '') {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

function parseImages(value = '') {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [url, alt = '', caption = '', section = ''] = line.split('|').map((part) => part.trim())
      return { url, alt, caption, section }
    })
    .filter((image) => image.url)
}

function parseLinks(value = '') {
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

function parseTextureMaps(value = '') {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url = '', note = ''] = line.split('|').map((part) => part.trim())
      return { label, url, note, alt: label ? `${label} texture map` : 'Texture map' }
    })
    .filter((map) => map.label || map.url)
}

function parseContentBlocks(value = '') {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [type = 'text', title = '', text = '', rawData = ''] = line.split('|').map((part) => part.trim())
      if (type === 'specs' || type === 'technicalBreakdown') {
        return {
          type,
          title,
          data: rawData
            .split(';')
            .map((item) => item.trim())
            .filter(Boolean)
            .map((item) => item.split(':').map((part) => part.trim()))
            .filter(([label, value]) => label && value),
        }
      }
      if (type === 'imageGrid') {
        return {
          type,
          title,
          text,
          images: rawData
            .split(';')
            .map((item) => item.trim())
            .filter(Boolean)
            .map((item) => {
              const [url, caption = ''] = item.split(',').map((part) => part.trim())
              return { url, caption, alt: caption || title || '3D project image' }
            })
            .filter((image) => image.url),
        }
      }
      return { type, title, text }
    })
}

function stringifyImages(images = []) {
  return images.map((image) => [image.url, image.alt, image.caption, image.section].filter(Boolean).join(' | ')).join('\n')
}

function stringifyTextureMaps(maps = []) {
  return maps.map((map) => [map.label, map.url, map.note].filter(Boolean).join(' | ')).join('\n')
}

function stringifyContentBlocks(blocks = []) {
  return blocks.map((block) => {
    if (block.type === 'specs' || block.type === 'technicalBreakdown') {
      return [block.type, block.title, '', (block.data || []).map(([label, value]) => `${label}: ${value}`).join('; ')].join(' | ')
    }
    if (block.type === 'imageGrid') {
      return [block.type, block.title, block.text, (block.images || []).map((image) => `${image.url}, ${image.caption || ''}`).join('; ')].join(' | ')
    }
    return [block.type || 'text', block.title, block.text].filter(Boolean).join(' | ')
  }).join('\n')
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
    imagesText: stringifyImages(project.images || []),
    toolsText: (project.tools || []).join(', '),
    techniquesText: (project.techniques || []).join(', '),
    externalLinksText: (project.externalLinks || []).map((link) => `${link.label} | ${link.url}`).join('\n'),
    breakdown: project.breakdown || '',
    technicalNotes: project.technicalNotes || project.technical_notes || '',
    engine: project.engine || '',
    assetType: project.assetType || '',
    polycount: project.polycount || '',
    textureResolution: project.textureResolution || '',
    texelDensity: project.texelDensity || '',
    targetPlatform: project.targetPlatform || '',
    timeSpent: project.timeSpent || '',
    softwareUsedText: (project.softwareUsed || []).join(', '),
    materialsText: (project.materials || []).join(', '),
    shaderNotes: project.shaderNotes || '',
    optimizationNotes: project.optimizationNotes || '',
    textureWorkflow: project.textureWorkflow || '',
    substancePainterNotes: project.substancePainterNotes || '',
    substanceDesignerNotes: project.substanceDesignerNotes || '',
    textureMapsText: stringifyTextureMaps(project.textureMaps || []),
    contentBlocksText: stringifyContentBlocks(project.contentBlocks || []),
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
    engine: form.engine,
    assetType: form.assetType,
    polycount: form.polycount,
    textureResolution: form.textureResolution,
    texelDensity: form.texelDensity,
    targetPlatform: form.targetPlatform,
    timeSpent: form.timeSpent,
    softwareUsed: splitList(form.softwareUsedText),
    materials: splitList(form.materialsText),
    shaderNotes: form.shaderNotes,
    optimizationNotes: form.optimizationNotes,
    textureWorkflow: form.textureWorkflow,
    substancePainterNotes: form.substancePainterNotes,
    substanceDesignerNotes: form.substanceDesignerNotes,
    textureMaps: parseTextureMaps(form.textureMapsText),
    contentBlocks: parseContentBlocks(form.contentBlocksText),
    published: form.published,
    featured: form.featured,
    sortOrder: Number(form.sortOrder) || 0,
  }
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-zinc-300">
      {label}
      {children}
    </label>
  )
}

function Input({ value, onChange, ...props }) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-11 rounded-xl border border-white/10 bg-black/30 px-3 text-white outline-none focus:border-sky-300"
      {...props}
    />
  )
}

function TextArea({ value, onChange, ...props }) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-white outline-none focus:border-sky-300"
      {...props}
    />
  )
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
  const warnings = useMemo(() => {
    const notes = []
    if (!form.thumbnailUrl.trim()) notes.push('Thumbnail is missing.')
    if (form.published && !form.description.trim()) notes.push('Published projects should include a description.')
    if (form.published && !form.heroImageUrl.trim() && !form.imagesText.trim()) notes.push('Published projects should include at least one image.')
    return notes
  }, [form])

  useEffect(() => {
    if (token) loadProjects(token)
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

  function duplicateProject(project) {
    const nextForm = projectToForm(project)
    setSelectedProject(null)
    setForm({
      ...nextForm,
      title: `${nextForm.title} Copy`,
      slug: nextForm.slug ? `${nextForm.slug}-copy` : '',
      published: false,
      featured: false,
    })
    setStatus('Project copied as a new draft.')
  }

  async function saveProject(event, forceDraft = false) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setStatus('')
    try {
      const payload = { ...formToPayload(form), published: forceDraft ? false : form.published }
      const data = selectedProject
        ? await update3DProject(token, selectedProject.id, payload)
        : await create3DProject(token, payload)
      setStatus(data.message || (forceDraft ? 'Draft saved.' : 'Project saved.'))
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
            <Field label="Admin token">
              <Input type="password" value={tokenInput} onChange={setTokenInput} />
            </Field>
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
              <p className="text-xs font-black uppercase tracking-[0.32em] text-sky-300">Private route</p>
              <h1 className="mt-3 text-4xl font-black text-white">3D Project Admin</h1>
              <p className="mt-3 text-sm text-zinc-400">
                Upload images to public/3d/projects or use external URLs, then paste paths here. No binary images are stored in D1.
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
                        <button type="button" onClick={() => duplicateProject(project)} className="rounded-lg border border-white/10 px-2 py-1 text-xs font-bold text-zinc-300">Duplicate</button>
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

                <div className="mt-5 grid gap-6">
                  <section className="grid gap-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.24em] text-sky-300">Basics</h3>
                    {[
                      ['title', 'Title'],
                      ['slug', 'Slug'],
                      ['subtitle', 'Subtitle'],
                      ['date', 'Date'],
                      ['year', 'Year'],
                      ['category', 'Category'],
                      ['role', 'Role'],
                    ].map(([field, label]) => (
                      <Field key={field} label={label}>
                        <Input value={form[field]} onChange={(value) => updateField(field, value)} />
                      </Field>
                    ))}
                    <Field label="Description">
                      <TextArea value={form.description} onChange={(value) => updateField('description', value)} rows={4} />
                    </Field>
                  </section>

                  <section className="grid gap-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.24em] text-sky-300">Visuals</h3>
                    <Field label="Thumbnail URL">
                      <Input value={form.thumbnailUrl} onChange={(value) => updateField('thumbnailUrl', value)} />
                    </Field>
                    <Field label="Hero Image URL">
                      <Input value={form.heroImageUrl} onChange={(value) => updateField('heroImageUrl', value)} />
                    </Field>
                    <Field label="Gallery images">
                      <TextArea value={form.imagesText} onChange={(value) => updateField('imagesText', value)} rows={5} placeholder="/3d/projects/project/final-01.jpg | Final render | Final lighting pass | Final renders" />
                    </Field>
                  </section>

                  <section className="grid gap-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.24em] text-sky-300">Technical specs</h3>
                    {[
                      ['engine', 'Engine'],
                      ['assetType', 'Asset type'],
                      ['polycount', 'Polycount'],
                      ['textureResolution', 'Texture resolution'],
                      ['texelDensity', 'Texel density'],
                      ['targetPlatform', 'Target platform'],
                      ['timeSpent', 'Time spent'],
                      ['textureWorkflow', 'Texture workflow'],
                    ].map(([field, label]) => (
                      <Field key={field} label={label}>
                        <Input value={form[field]} onChange={(value) => updateField(field, value)} />
                      </Field>
                    ))}
                    <Field label="Tools">
                      <Input value={form.toolsText} onChange={(value) => updateField('toolsText', value)} placeholder="Blender, Substance Painter" />
                    </Field>
                    <Field label="Software used">
                      <Input value={form.softwareUsedText} onChange={(value) => updateField('softwareUsedText', value)} placeholder="Unreal Engine, Marmoset Toolbag" />
                    </Field>
                    <Field label="Techniques">
                      <Input value={form.techniquesText} onChange={(value) => updateField('techniquesText', value)} placeholder="UV Mapping, PBR Texturing" />
                    </Field>
                    <Field label="Materials">
                      <Input value={form.materialsText} onChange={(value) => updateField('materialsText', value)} placeholder="Metal, painted plastic, moss" />
                    </Field>
                  </section>

                  <section className="grid gap-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.24em] text-sky-300">Breakdown notes</h3>
                    <Field label="Project breakdown">
                      <TextArea value={form.breakdown} onChange={(value) => updateField('breakdown', value)} rows={4} />
                    </Field>
                    <Field label="Technical notes">
                      <TextArea value={form.technicalNotes} onChange={(value) => updateField('technicalNotes', value)} rows={4} />
                    </Field>
                    <Field label="Shader notes">
                      <TextArea value={form.shaderNotes} onChange={(value) => updateField('shaderNotes', value)} rows={3} />
                    </Field>
                    <Field label="Optimization notes">
                      <TextArea value={form.optimizationNotes} onChange={(value) => updateField('optimizationNotes', value)} rows={3} />
                    </Field>
                    <Field label="Substance Painter notes">
                      <TextArea value={form.substancePainterNotes} onChange={(value) => updateField('substancePainterNotes', value)} rows={3} />
                    </Field>
                    <Field label="Substance Designer notes">
                      <TextArea value={form.substanceDesignerNotes} onChange={(value) => updateField('substanceDesignerNotes', value)} rows={3} />
                    </Field>
                  </section>

                  <section className="grid gap-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.24em] text-sky-300">Texture maps and content blocks</h3>
                    <Field label="Texture maps">
                      <TextArea value={form.textureMapsText} onChange={(value) => updateField('textureMapsText', value)} rows={4} placeholder="Base Color | /3d/projects/project/basecolor.jpg | 2K PBR map" />
                    </Field>
                    <Field label="Content blocks">
                      <TextArea
                        value={form.contentBlocksText}
                        onChange={(value) => updateField('contentBlocksText', value)}
                        rows={5}
                        placeholder={`text | Lighting pass | I used cool key light and warm fill
specs | Asset specs | | Tris: 18k; Textures: 2K
imageGrid | Wireframe | Low poly mesh | /path/wire.jpg, Wireframe`}
                      />
                    </Field>
                  </section>

                  <section className="grid gap-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.24em] text-sky-300">Publishing</h3>
                    <Field label="External links">
                      <TextArea value={form.externalLinksText} onChange={(value) => updateField('externalLinksText', value)} rows={3} placeholder="ArtStation | https://..." />
                    </Field>
                    <Field label="Sort order">
                      <Input type="number" value={form.sortOrder} onChange={(value) => updateField('sortOrder', value)} />
                    </Field>
                    <div className="flex flex-wrap gap-4 text-sm font-semibold text-zinc-300">
                      <label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={(event) => updateField('published', event.target.checked)} /> Published</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(event) => updateField('featured', event.target.checked)} /> Featured</label>
                    </div>
                  </section>
                </div>

                {warnings.length > 0 && (
                  <div className="mt-5 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
                    {warnings.map((warning) => <p key={warning}>{warning}</p>)}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-3 text-sm font-black text-slate-950 disabled:opacity-60">
                    <Save size={16} /> {saving ? 'Saving...' : 'Save project'}
                  </button>
                  <button type="button" onClick={(event) => saveProject(event, true)} disabled={saving} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-zinc-300">
                    Save draft
                  </button>
                  <button type="button" onClick={newProject} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-zinc-300">
                    Clear form
                  </button>
                </div>
              </form>

              <aside className="space-y-5">
                <div className="rounded-2xl border border-white/10 bg-[#12161c] p-5">
                  <h2 className="inline-flex items-center gap-2 font-black text-white"><Eye size={18} /> Preview</h2>
                  <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                    <div className="aspect-[4/3]">
                      <ThreeDImageFrame src={preview.thumbnailUrl || preview.heroImageUrl} alt={`${preview.title || 'Project'} preview`} />
                    </div>
                  </div>
                  <p className="mt-4 text-xl font-black text-white">{preview.title || 'Untitled project'}</p>
                  <p className="mt-2 text-sm text-zinc-400">{preview.category} {preview.engine ? `- ${preview.engine}` : ''}</p>
                  <p className="mt-4 text-sm leading-6 text-zinc-400">{preview.description || 'Project description preview.'}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#12161c] p-5">
                  <h2 className="inline-flex items-center gap-2 font-black text-white"><Copy size={18} /> Input formats</h2>
                  <div className="mt-4 space-y-4 text-xs leading-5 text-zinc-400">
                    <p><strong className="text-zinc-200">Gallery:</strong> URL | Alt text | Caption | Section</p>
                    <p><strong className="text-zinc-200">Texture maps:</strong> Label | URL | Note</p>
                    <p><strong className="text-zinc-200">Blocks:</strong> type | title | text | data</p>
                    <p><strong className="text-zinc-200">Images:</strong> keep files in public/3d/projects/project-slug/ and paste the public path.</p>
                  </div>
                </div>

                {selectedProject && (
                  <button type="button" onClick={() => deleteProject(selectedProject)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-5 py-3 text-sm font-black text-red-100">
                    <Trash2 size={16} /> Delete selected project
                  </button>
                )}
              </aside>
            </div>
          </div>
        </div>
      </section>
    </ThreeDLayout>
  )
}

export default ThreeDAdmin
