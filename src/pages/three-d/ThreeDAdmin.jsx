import { ArrowDown, ArrowUp, Eye, FileText, Grid2X2, Image, Save, Settings, Trash2, Upload, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import ThreeDImageFrame from '../../components/three-d/ThreeDImageFrame'
import ThreeDLayout from '../../components/three-d/ThreeDLayout'
import usePageTitle from '../../hooks/usePageTitle'
import {
  create3DProject,
  delete3DProject,
  delete3DMedia,
  getAll3DProjects,
  toggle3DProjectPublished,
  update3DProject,
  upload3DMedia,
} from '../../services/adminThreeDProjectsService'

const softwareOptions = [
  'Blender',
  '3ds Max',
  'Maya',
  'Unreal Engine',
  'Unity',
  'Substance 3D Painter',
  'Substance 3D Designer',
  'Marmoset Toolbag',
  'ZBrush',
]

const categoryOptions = [
  'Environment',
  'Prop',
  'Material',
  'Procedural Material',
  'Texture',
  'Real-time Asset',
  'VR Asset',
  'Render',
  'Breakdown',
  'Personal Project',
]

const imageCategories = [
  'Main render',
  'Final render',
  'Close-up',
  'Wireframe',
  'UV layout',
  'Texture maps',
  'Material breakdown',
  'High poly',
  'Low poly',
  'Engine screenshot',
  'Lighting pass',
  'Breakdown',
  'Other',
]

const uploadTypes = [
  { value: 'main-render', label: 'Main render' },
  { value: 'final-render', label: 'Final render' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'closeup', label: 'Close-up' },
  { value: 'breakdown', label: 'Breakdown' },
  { value: 'texture-map', label: 'Texture map' },
  { value: 'uv', label: 'UV' },
  { value: 'wireframe', label: 'Wireframe' },
  { value: 'material', label: 'Material' },
  { value: 'engine', label: 'Engine screenshot' },
  { value: 'other', label: 'Other' },
]

const emptyForm = {
  title: '',
  slug: '',
  description: '',
  thumbnailUrl: '',
  heroImageUrl: '',
  contentBlocks: [],
  categories: [],
  softwareUsed: [],
  otherSoftware: '',
  tagsText: '',
  featured: false,
  published: false,
  sortOrder: 0,
  engine: '',
  assetType: '',
  polycount: '',
  textureResolution: '',
  texelDensity: '',
  targetPlatform: '',
  timeSpent: '',
  textureWorkflow: '',
  role: '',
  shaderNotes: '',
  optimizationNotes: '',
  substancePainterNotes: '',
  substanceDesignerNotes: '',
  publishedAt: '',
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function createBlock(type) {
  return {
    id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    title: '',
    text: '',
    category: type === 'technicalNote' ? 'Breakdown' : 'Main render',
    images: [],
  }
}

function splitTags(value = '') {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

function getBlockImages(blocks = []) {
  return blocks.flatMap((block) => block.images || []).filter((image) => image?.url)
}

function projectToForm(project) {
  if (!project) return emptyForm

  const contentBlocks = project.contentBlocks?.length
    ? project.contentBlocks
    : (project.images || []).map((image) => ({
      ...createBlock('image'),
      title: image.caption || '',
      category: image.section || 'Final render',
      images: [image],
    }))

  const softwareUsed = project.softwareUsed?.length ? project.softwareUsed : project.tools || []
  const knownSoftware = softwareUsed.filter((item) => softwareOptions.includes(item))
  const otherSoftware = softwareUsed.filter((item) => !softwareOptions.includes(item)).join(', ')

  return {
    ...emptyForm,
    title: project.title || '',
    slug: project.slug || '',
    description: project.description || '',
    thumbnailUrl: project.thumbnailUrl || '',
    heroImageUrl: project.heroImageUrl || '',
    contentBlocks,
    categories: project.categories?.length ? project.categories : [project.category].filter(Boolean),
    softwareUsed: knownSoftware,
    otherSoftware,
    tagsText: (project.tags || []).join(', '),
    featured: Boolean(project.featured),
    published: Boolean(project.published),
    sortOrder: project.sortOrder ?? 0,
    engine: project.engine || '',
    assetType: project.assetType || '',
    polycount: project.polycount || '',
    textureResolution: project.textureResolution || '',
    texelDensity: project.texelDensity || '',
    targetPlatform: project.targetPlatform || '',
    timeSpent: project.timeSpent || '',
    textureWorkflow: project.textureWorkflow || '',
    role: project.role || '',
    shaderNotes: project.shaderNotes || '',
    optimizationNotes: project.optimizationNotes || '',
    substancePainterNotes: project.substancePainterNotes || '',
    substanceDesignerNotes: project.substanceDesignerNotes || '',
    publishedAt: project.publishedAt || '',
  }
}

function formToPayload(form, nextPublished = form.published) {
  const otherSoftware = splitTags(form.otherSoftware)
  const softwareUsed = [...form.softwareUsed, ...otherSoftware]
  const images = getBlockImages(form.contentBlocks)

  return {
    title: form.title,
    slug: form.slug || slugify(form.title),
    description: form.description,
    category: form.categories[0] || 'Personal Project',
    categories: form.categories,
    tags: splitTags(form.tagsText),
    thumbnailUrl: form.thumbnailUrl,
    heroImageUrl: form.heroImageUrl || images[0]?.url || '',
    images,
    contentBlocks: form.contentBlocks,
    softwareUsed,
    tools: softwareUsed,
    techniques: [],
    externalLinks: [],
    breakdown: '',
    technicalNotes: '',
    engine: form.engine,
    assetType: form.assetType,
    polycount: form.polycount,
    textureResolution: form.textureResolution,
    texelDensity: form.texelDensity,
    targetPlatform: form.targetPlatform,
    timeSpent: form.timeSpent,
    textureWorkflow: form.textureWorkflow,
    role: form.role,
    shaderNotes: form.shaderNotes,
    optimizationNotes: form.optimizationNotes,
    substancePainterNotes: form.substancePainterNotes,
    substanceDesignerNotes: form.substanceDesignerNotes,
    textureMaps: [],
    materials: [],
    published: nextPublished,
    featured: form.featured,
    sortOrder: Number(form.sortOrder) || 0,
    publishedAt: nextPublished ? form.publishedAt : '',
  }
}

function CompactInput({ label, value, onChange, placeholder = '', type = 'text' }) {
  return (
    <label className="grid gap-1.5 text-[13px] font-semibold text-zinc-300">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-10 rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-sky-300"
      />
    </label>
  )
}

function CompactTextarea({ label, value, onChange, placeholder = '', rows = 4 }) {
  return (
    <label className="grid gap-1.5 text-[13px] font-semibold text-zinc-300">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm leading-6 text-white outline-none placeholder:text-zinc-600 focus:border-sky-300"
      />
    </label>
  )
}

function Chip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
        active ? 'border-sky-300 bg-sky-300 text-slate-950' : 'border-white/10 bg-white/[0.03] text-zinc-300 hover:border-sky-300/50'
      }`}
    >
      {children}
    </button>
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
  const [uploading, setUploading] = useState('')
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const cleanSlug = useMemo(() => slugify(form.slug || form.title), [form.slug, form.title])
  const mediaCount = useMemo(() => getBlockImages(form.contentBlocks).length, [form.contentBlocks])
  const warnings = useMemo(() => {
    const notes = []
    if (!form.title.trim()) notes.push('Title is required.')
    if (!form.thumbnailUrl.trim()) notes.push('Thumbnail is missing.')
    if (!form.description.trim()) notes.push('Description is missing.')
    if (!mediaCount) notes.push('Add at least one media block before publishing.')
    if (form.categories.length > 5) notes.push('Try to keep categories focused.')
    return notes
  }, [form, mediaCount])
  const canPublish = form.title.trim() && form.thumbnailUrl.trim() && form.description.trim() && mediaCount > 0

  useEffect(() => {
    if (token) loadProjects(token)
  }, [token])

  async function loadProjects(nextToken = token) {
    setLoading(true)
    setError('')
    try {
      const data = await getAll3DProjects(nextToken)
      const nextProjects = data.projects || []
      setProjects(nextProjects)
      setStatus('Admin panel unlocked.')
      return nextProjects
    } catch (err) {
      setError(err.message || 'Could not load projects. Check the token.')
      sessionStorage.removeItem('threeDAdminToken')
      setToken('')
      return []
    } finally {
      setLoading(false)
    }
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function updateTitle(value) {
    setForm((current) => ({
      ...current,
      title: value,
      slug: current.slug ? current.slug : slugify(value),
    }))
  }

  function toggleArrayValue(field, value) {
    setForm((current) => {
      const items = current[field] || []
      return {
        ...current,
        [field]: items.includes(value) ? items.filter((item) => item !== value) : [...items, value],
      }
    })
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

  function addBlock(type) {
    setForm((current) => ({
      ...current,
      contentBlocks: [...current.contentBlocks, createBlock(type)],
    }))
  }

  function updateBlock(index, patch) {
    setForm((current) => ({
      ...current,
      contentBlocks: current.contentBlocks.map((block, blockIndex) => blockIndex === index ? { ...block, ...patch } : block),
    }))
  }

  function removeBlock(index) {
    setForm((current) => ({
      ...current,
      contentBlocks: current.contentBlocks.filter((_, blockIndex) => blockIndex !== index),
    }))
  }

  function moveBlock(index, direction) {
    setForm((current) => {
      const nextIndex = index + direction
      if (nextIndex < 0 || nextIndex >= current.contentBlocks.length) return current
      const blocks = [...current.contentBlocks]
      const [block] = blocks.splice(index, 1)
      blocks.splice(nextIndex, 0, block)
      return { ...current, contentBlocks: blocks }
    })
  }

  function updateGridImage(blockIndex, imageIndex, patch) {
    setForm((current) => ({
      ...current,
      contentBlocks: current.contentBlocks.map((block, index) => {
        if (index !== blockIndex) return block
        return {
          ...block,
          images: (block.images || []).map((imageItem, itemIndex) => itemIndex === imageIndex ? { ...imageItem, ...patch } : imageItem),
        }
      }),
    }))
  }

  function removeGridImage(blockIndex, imageIndex) {
    setForm((current) => ({
      ...current,
      contentBlocks: current.contentBlocks.map((block, index) => {
        if (index !== blockIndex) return block
        return { ...block, images: (block.images || []).filter((_, itemIndex) => itemIndex !== imageIndex) }
      }),
    }))
  }

  async function uploadFile(file, mediaType, onComplete) {
    if (!file) return
    if (!cleanSlug) {
      setError('Add a title or slug before uploading media.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus('For better performance, WebP images under 5 MB are recommended.')
    }

    setUploading(mediaType)
    setError('')
    try {
      const result = await upload3DMedia(token, { file, projectSlug: cleanSlug, mediaType })
      onComplete(result)
    } catch (err) {
      setError(err.message || 'Could not upload media.')
    } finally {
      setUploading('')
    }
  }

  async function deleteUploadedMedia(image, onComplete) {
    if (!image?.key && !image?.url) {
      onComplete()
      return
    }

    setError('')
    try {
      await delete3DMedia(token, { key: image.key, url: image.url })
      onComplete()
      setStatus('Media deleted.')
    } catch (err) {
      setError(err.message || 'Could not delete media.')
    }
  }

  async function saveProject(nextPublished = form.published) {
    setSaving(true)
    setError('')
    setStatus('')
    try {
      const payload = formToPayload(form, nextPublished)
      const data = selectedProject
        ? await update3DProject(token, selectedProject.id, payload)
        : await create3DProject(token, payload)

      setStatus(data.message || (nextPublished ? 'Artwork published.' : 'Draft saved.'))
      const nextProjects = await loadProjects(token)
      if (data.id && nextPublished) {
        const createdProject = nextProjects.find((project) => project.id === data.id)
        if (createdProject) setSelectedProject(createdProject)
      }
      if (!selectedProject && !nextPublished) {
        setSelectedProject(null)
        setForm(emptyForm)
      }
      if (nextPublished) updateForm('published', true)
    } catch (err) {
      setError(err.message || 'Could not save artwork.')
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

  async function unpublishSelected() {
    if (!selectedProject) {
      updateForm('published', false)
      return
    }
    await toggle3DProjectPublished(token, selectedProject.id, false)
    updateForm('published', false)
    await loadProjects(token)
  }

  function previewProject() {
    if (!cleanSlug) return
    window.open(`/3d/projects/${cleanSlug}`, '_blank', 'noopener,noreferrer')
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
            <CompactInput label="Admin token" type="password" value={tokenInput} onChange={setTokenInput} />
            {error && <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</p>}
            <button type="submit" className="mt-5 min-h-10 w-full rounded-lg bg-sky-300 px-4 py-2 text-sm font-black text-slate-950 hover:bg-sky-200">
              Unlock admin panel
            </button>
          </form>
        </section>
      </ThreeDLayout>
    )
  }

  return (
    <ThreeDLayout>
      <section className="px-4 py-6 sm:px-5">
        <div className="mx-auto max-w-[92rem]">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-sky-300">Artwork editor</p>
              <h1 className="mt-1 text-3xl font-black text-white">3D Project Admin</h1>
            </div>
            <button type="button" onClick={logout} className="w-fit rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-zinc-300 hover:border-red-300/50">
              Log out
            </button>
          </div>

          {(status || error) && (
            <div className={`mt-4 rounded-xl border p-3 text-sm ${error ? 'border-red-500/30 bg-red-500/10 text-red-100' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'}`}>
              {error || status}
            </div>
          )}

          <div className="mt-5 grid gap-5 xl:grid-cols-[18rem_minmax(0,1fr)_20rem]">
            <aside className="rounded-2xl border border-white/10 bg-[#12161c] p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-black text-white">Projects</h2>
                <button type="button" onClick={newProject} className="rounded-full bg-sky-300 px-3 py-1.5 text-xs font-black text-slate-950">
                  New
                </button>
              </div>
              <div className="mt-4 max-h-[32rem] space-y-2 overflow-y-auto pr-1">
                {loading ? <p className="text-sm text-zinc-400">Loading...</p> : projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => editProject(project)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      selectedProject?.id === project.id ? 'border-sky-300/60 bg-sky-300/10' : 'border-white/10 bg-black/20 hover:border-white/20'
                    }`}
                  >
                    <p className="text-sm font-bold text-white">{project.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">{project.published ? 'Published' : 'Draft'} · {project.category}</p>
                  </button>
                ))}
                {!loading && !projects.length && <p className="text-sm text-zinc-500">No artworks yet.</p>}
              </div>
            </aside>

            <main className="space-y-5">
              <section className="rounded-2xl border border-white/10 bg-[#12161c] p-4">
                <div className="grid gap-4 lg:grid-cols-[1fr_15rem]">
                  <CompactInput
                    label="Artwork title"
                    value={form.title}
                    onChange={updateTitle}
                    placeholder="What is your project called?"
                  />
                  <CompactInput
                    label="Slug"
                    value={form.slug}
                    onChange={(value) => updateForm('slug', slugify(value))}
                    placeholder="auto-generated"
                  />
                </div>
                <div className="mt-4">
                  <CompactTextarea
                    label="Artwork description"
                    value={form.description}
                    onChange={(value) => updateForm('description', value)}
                    placeholder="Write a short description of the project, the goal and what you worked on."
                    rows={4}
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#12161c] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base font-black text-white">Media builder</h2>
                    <p className="mt-1 text-xs text-zinc-500">Build the project like an artwork post: images, grids and text between renders.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => addBlock('image')} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-zinc-200"><Image size={14} /> Add image</button>
                    <button type="button" onClick={() => addBlock('imageGrid')} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-zinc-200"><Grid2X2 size={14} /> Add image grid</button>
                    <button type="button" onClick={() => addBlock('text')} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-zinc-200"><FileText size={14} /> Add text</button>
                    <button type="button" onClick={() => addBlock('technicalNote')} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-zinc-200"><Settings size={14} /> Add technical note</button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {form.contentBlocks.map((block, index) => (
                    <article key={block.id || index} className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-black uppercase text-zinc-300">{block.type}</span>
                          <select
                            value={block.category || 'Other'}
                            onChange={(event) => updateBlock(index, { category: event.target.value })}
                            className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-xs font-bold text-zinc-200 outline-none"
                          >
                            {imageCategories.map((category) => <option key={category} value={category} className="bg-[#12161c]">{category}</option>)}
                          </select>
                        </div>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => moveBlock(index, -1)} className="rounded-lg border border-white/10 p-2 text-zinc-300"><ArrowUp size={14} /></button>
                          <button type="button" onClick={() => moveBlock(index, 1)} className="rounded-lg border border-white/10 p-2 text-zinc-300"><ArrowDown size={14} /></button>
                          <button type="button" onClick={() => removeBlock(index)} className="rounded-lg border border-red-400/30 p-2 text-red-200"><X size={14} /></button>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-3">
                        <CompactInput label="Block title" value={block.title || ''} onChange={(value) => updateBlock(index, { title: value })} />
                        {(block.type === 'text' || block.type === 'technicalNote' || block.type === 'image' || block.type === 'imageGrid') && (
                          <CompactTextarea label={block.type === 'technicalNote' ? 'Technical note' : 'Text / caption'} value={block.text || ''} onChange={(value) => updateBlock(index, { text: value })} rows={3} />
                        )}

                        {block.type === 'image' && (
                          <div className="grid gap-3 md:grid-cols-[12rem_1fr]">
                            <div className="overflow-hidden rounded-lg border border-white/10">
                              <div className="aspect-[4/3]">
                                <ThreeDImageFrame src={block.images?.[0]?.url} alt={block.images?.[0]?.alt || block.title || 'Image block'} />
                              </div>
                            </div>
                            <div className="grid gap-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <select
                                  value={block.mediaType || 'gallery'}
                                  onChange={(event) => updateBlock(index, { mediaType: event.target.value })}
                                  className="min-h-10 rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-white outline-none"
                                >
                                  {uploadTypes.map((type) => <option key={type.value} value={type.value} className="bg-[#12161c]">{type.label}</option>)}
                                </select>
                                <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-sky-300 px-3 text-xs font-black text-slate-950">
                                  <Upload size={14} /> Upload image
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/avif"
                                    className="sr-only"
                                    onChange={(event) => uploadFile(event.target.files?.[0], block.mediaType || 'gallery', (result) => {
                                      updateBlock(index, { images: [{ url: result.url, key: result.key, alt: block.title, caption: block.text }] })
                                    })}
                                  />
                                </label>
                              </div>
                              <CompactInput label="Alt text" value={block.images?.[0]?.alt || ''} onChange={(value) => updateBlock(index, { images: [{ ...(block.images?.[0] || {}), alt: value }] })} />
                              {block.images?.[0]?.url && (
                                <button
                                  type="button"
                                  onClick={() => deleteUploadedMedia(block.images[0], () => updateBlock(index, { images: [] }))}
                                  className="w-fit rounded-lg border border-red-400/30 px-3 py-2 text-xs font-bold text-red-200"
                                >
                                  Delete media
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {block.type === 'imageGrid' && (
                          <div className="space-y-3">
                            <label className="inline-flex min-h-10 w-fit cursor-pointer items-center gap-2 rounded-lg bg-sky-300 px-3 text-xs font-black text-slate-950">
                              <Upload size={14} /> Upload image to grid
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/avif"
                                className="sr-only"
                                onChange={(event) => uploadFile(event.target.files?.[0], 'gallery', (result) => {
                                  updateBlock(index, { images: [...(block.images || []), { url: result.url, key: result.key, alt: block.title, caption: '' }] })
                                })}
                              />
                            </label>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {(block.images || []).map((imageItem, imageIndex) => (
                                <div key={`${imageItem.url}-${imageIndex}`} className="rounded-lg border border-white/10 bg-black/20 p-2">
                                  <div className="aspect-[4/3] overflow-hidden rounded-md">
                                    <ThreeDImageFrame src={imageItem.url} alt={imageItem.alt || 'Grid image'} />
                                  </div>
                                  <div className="mt-2 grid gap-2">
                                    <input value={imageItem.caption || ''} onChange={(event) => updateGridImage(index, imageIndex, { caption: event.target.value })} placeholder="Caption" className="min-h-9 rounded-md border border-white/10 bg-black/30 px-2 text-xs text-white outline-none" />
                                    <input value={imageItem.alt || ''} onChange={(event) => updateGridImage(index, imageIndex, { alt: event.target.value })} placeholder="Alt text" className="min-h-9 rounded-md border border-white/10 bg-black/30 px-2 text-xs text-white outline-none" />
                                    <button
                                      type="button"
                                      onClick={() => deleteUploadedMedia(imageItem, () => removeGridImage(index, imageIndex))}
                                      className="rounded-md border border-red-400/30 px-2 py-1 text-xs font-bold text-red-200"
                                    >
                                      Delete media
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                  {!form.contentBlocks.length && (
                    <div className="rounded-xl border border-dashed border-white/15 p-8 text-center">
                      <p className="text-sm font-bold text-white">No media blocks yet.</p>
                      <p className="mt-1 text-xs text-zinc-500">Start with a main render, then add text or breakdown images between blocks.</p>
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#12161c] p-4">
                <h2 className="text-base font-black text-white">Categories</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {categoryOptions.map((category) => (
                    <Chip key={category} active={form.categories.includes(category)} onClick={() => toggleArrayValue('categories', category)}>
                      {category}
                    </Chip>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#12161c] p-4">
                <h2 className="text-base font-black text-white">Software used</h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {softwareOptions.map((software) => (
                    <label key={software} className="flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 text-sm font-semibold text-zinc-300">
                      <input type="checkbox" checked={form.softwareUsed.includes(software)} onChange={() => toggleArrayValue('softwareUsed', software)} />
                      {software}
                    </label>
                  ))}
                </div>
                <div className="mt-3">
                  <CompactInput label="Other software" value={form.otherSoftware} onChange={(value) => updateForm('otherSoftware', value)} placeholder="Comma separated" />
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#12161c] p-4">
                <CompactInput label="Tags" value={form.tagsText} onChange={(value) => updateForm('tagsText', value)} placeholder="PBR, game-ready, low poly, UVs, baking" />
              </section>

              <details open={advancedOpen} onToggle={(event) => setAdvancedOpen(event.currentTarget.open)} className="rounded-2xl border border-white/10 bg-[#12161c] p-4">
                <summary className="cursor-pointer text-base font-black text-white">Technical details</summary>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {[
                    ['engine', 'Engine'],
                    ['assetType', 'Asset type'],
                    ['role', 'Role'],
                    ['polycount', 'Polycount'],
                    ['textureResolution', 'Texture resolution'],
                    ['texelDensity', 'Texel density'],
                    ['targetPlatform', 'Target platform'],
                    ['timeSpent', 'Time spent'],
                    ['textureWorkflow', 'Texture workflow'],
                  ].map(([field, label]) => (
                    <CompactInput key={field} label={label} value={form[field]} onChange={(value) => updateForm(field, value)} />
                  ))}
                  <div className="md:col-span-2 grid gap-3">
                    <CompactTextarea label="Shader notes" value={form.shaderNotes} onChange={(value) => updateForm('shaderNotes', value)} rows={3} />
                    <CompactTextarea label="Optimization notes" value={form.optimizationNotes} onChange={(value) => updateForm('optimizationNotes', value)} rows={3} />
                    <CompactTextarea label="Substance Painter notes" value={form.substancePainterNotes} onChange={(value) => updateForm('substancePainterNotes', value)} rows={3} />
                    <CompactTextarea label="Substance Designer notes" value={form.substanceDesignerNotes} onChange={(value) => updateForm('substanceDesignerNotes', value)} rows={3} />
                  </div>
                </div>
              </details>
            </main>

            <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
              <section className="rounded-2xl border border-white/10 bg-[#12161c] p-4">
                <h2 className="text-base font-black text-white">Project thumbnail</h2>
                <p className="mt-1 text-xs text-zinc-500">Recommended: 1200x900 WebP or JPG, under 1 MB.</p>
                <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                  <div className="aspect-[4/3]">
                    <ThreeDImageFrame src={form.thumbnailUrl} alt={`${form.title || 'Artwork'} thumbnail`} />
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-sky-300 px-3 text-xs font-black text-slate-950">
                    <Upload size={14} /> Upload thumbnail
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="sr-only"
                      onChange={(event) => uploadFile(event.target.files?.[0], 'thumbnail', (result) => updateForm('thumbnailUrl', result.url))}
                    />
                  </label>
                  {form.thumbnailUrl && (
                    <button
                      type="button"
                      onClick={() => deleteUploadedMedia({ url: form.thumbnailUrl }, () => updateForm('thumbnailUrl', ''))}
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-zinc-300"
                    >
                      Delete thumbnail
                    </button>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#12161c] p-4">
                <h2 className="text-base font-black text-white">Publishing</h2>
                <p className="mt-2 text-sm text-zinc-400">Status: <span className="font-black text-white">{form.published ? 'Published' : 'Draft'}</span></p>
                <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-zinc-300">
                  <input type="checkbox" checked={form.featured} onChange={(event) => updateForm('featured', event.target.checked)} />
                  Featured
                </label>
                <CompactInput label="Sort order" type="number" value={form.sortOrder} onChange={(value) => updateForm('sortOrder', value)} />

                {warnings.length > 0 && (
                  <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100">
                    {warnings.map((warning) => <p key={warning}>{warning}</p>)}
                  </div>
                )}

                {uploading && <p className="mt-3 text-xs font-bold text-sky-300">Uploading {uploading}...</p>}

                <div className="mt-4 grid gap-2">
                  <button type="button" onClick={() => saveProject(false)} disabled={saving} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 text-sm font-black text-zinc-200 disabled:opacity-50">
                    <Save size={15} /> Save draft
                  </button>
                  <button type="button" onClick={() => saveProject(true)} disabled={saving || !canPublish} className="min-h-10 rounded-lg bg-sky-300 px-3 text-sm font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">
                    Publish
                  </button>
                  {form.published && (
                    <button type="button" onClick={unpublishSelected} className="min-h-10 rounded-lg border border-white/10 px-3 text-sm font-bold text-zinc-300">
                      Unpublish
                    </button>
                  )}
                  <button type="button" onClick={previewProject} disabled={!cleanSlug} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 text-sm font-bold text-zinc-300 disabled:opacity-50">
                    <Eye size={15} /> Preview
                  </button>
                  {selectedProject && (
                    <button type="button" onClick={() => deleteProject(selectedProject)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3 text-sm font-black text-red-100">
                      <Trash2 size={15} /> Delete
                    </button>
                  )}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </ThreeDLayout>
  )
}

export default ThreeDAdmin
