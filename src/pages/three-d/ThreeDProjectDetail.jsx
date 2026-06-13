import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ContentBlockRenderer from '../../components/three-d/ContentBlockRenderer'
import ProjectSpecsPanel from '../../components/three-d/ProjectSpecsPanel'
import RichTextDescription from '../../components/three-d/RichTextDescription'
import TextureMapsGrid from '../../components/three-d/TextureMapsGrid'
import ThreeDImageFrame from '../../components/three-d/ThreeDImageFrame'
import ThreeDLayout from '../../components/three-d/ThreeDLayout'
import ThreeDLightbox from '../../components/three-d/ThreeDLightbox'
import usePageTitle from '../../hooks/usePageTitle'
import { getPublished3DProjectBySlug } from '../../services/threeDProjectsService'

function Section({ eyebrow, title, children }) {
  return (
    <section className="rounded-xl bg-[#15181d] p-4">
      {eyebrow && <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#13aff0]">{eyebrow}</p>}
      <h2 className="mt-1 text-lg font-bold tracking-tight text-zinc-100">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function PillList({ items }) {
  if (!items?.length) return <p className="text-sm text-zinc-500">Not specified yet.</p>

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-zinc-300">
          {item}
        </span>
      ))}
    </div>
  )
}

function ThreeDProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  usePageTitle(project ? `${project.title} | Alex Gómez 3D` : '3D Project | Alex Gómez 3D')

  useEffect(() => {
    setLoading(true)
    getPublished3DProjectBySlug(slug)
      .then(setProject)
      .finally(() => setLoading(false))
  }, [slug])

  const galleryImages = useMemo(() => {
    if (!project) return []
    const hero = project.heroImageUrl || project.thumbnailUrl
    const legacyImages = project.contentBlocks?.length ? [] : project.images || []
    const images = [
      ...(hero ? [{ url: hero, alt: `${project.title} hero render`, caption: 'Hero render', section: 'Final renders' }] : []),
      ...legacyImages,
    ]
    return images.filter((image) => image?.url)
  }, [project])

  if (loading) {
    return (
      <ThreeDLayout>
        <section className="px-5 py-24">
          <div className="mx-auto max-w-2xl rounded-xl border border-white/10 bg-[#15181d] p-8 text-center">
            <p className="text-sm font-bold text-zinc-400">Loading 3D project...</p>
          </div>
        </section>
      </ThreeDLayout>
    )
  }

  if (!project) {
    return (
      <ThreeDLayout>
        <section className="px-5 py-24">
          <div className="mx-auto max-w-2xl rounded-xl border border-white/10 bg-[#15181d] p-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#13aff0]">Project not found</p>
            <h1 className="mt-4 text-3xl font-black text-white">This project is not available.</h1>
            <p className="mt-3 text-zinc-400">This project is not available or has not been published yet.</p>
            <Link to="/3d/projects" className="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#13aff0] px-5 text-sm font-bold text-slate-950">
              Back to 3D projects
            </Link>
          </div>
        </section>
      </ThreeDLayout>
    )
  }

  const hero = project.heroImageUrl || project.thumbnailUrl
  const meta = [
    ['Category', project.categories?.length ? project.categories.join(', ') : project.category],
    ['Published', project.publishedAt ? new Date(project.publishedAt).getFullYear() : project.year || project.date],
    ['Role', project.role],
    ['Engine', project.engine],
    ['Asset type', project.assetType],
  ].filter(([, value]) => value)
  const contentBlockImages = (project.contentBlocks || []).flatMap((block) => block.images || []).filter((image) => image?.url)
  const textureLightboxImages = (project.textureMaps || []).filter((map) => map.url).map((map) => ({
    url: map.url,
    alt: map.alt || `${project.title} ${map.label || 'texture map'}`,
    caption: map.label || map.caption,
  }))
  const lightboxImages = [
    ...galleryImages,
    ...textureLightboxImages,
    ...contentBlockImages,
  ]
  const hasContentBlocks = Boolean(project.contentBlocks?.length)
  const galleryGroups = galleryImages.reduce((groups, image, index) => {
    const section = image.section || 'Gallery'
    if (!groups[section]) groups[section] = []
    groups[section].push({ ...image, originalIndex: index })
    return groups
  }, {})

  return (
    <ThreeDLayout>
      <article>
        <section className="px-4 pb-6 pt-8 sm:px-5">
          <div className="mx-auto max-w-[92rem]">
            <Link to="/3d/projects" className="inline-flex items-center gap-2 text-sm font-bold text-[#13aff0] hover:text-sky-200">
              <ArrowLeft size={16} /> Back to projects
            </Link>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-teal-300">{project.category || '3D project'}</p>
                <h1 className="mt-3 max-w-4xl text-3xl font-black tracking-tight text-zinc-50 sm:text-5xl">
                  {project.title}
                </h1>
                {project.subtitle && <p className="mt-3 max-w-3xl text-lg font-semibold leading-7 text-zinc-300">{project.subtitle}</p>}
                {project.description && <RichTextDescription text={project.description} className="mt-4 max-w-4xl text-sm text-zinc-400" />}
              </div>

              <aside className="rounded-xl border border-white/10 bg-[#15181d]/90 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">Artwork info</p>
                <dl className="mt-3 grid gap-3">
                  {meta.map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-600">{label}</dt>
                      <dd className="mt-0.5 text-sm font-bold text-zinc-100">{value}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </div>

            <div className="mt-7 overflow-hidden rounded-xl bg-[#15181d]">
              <button
                type="button"
                onClick={() => galleryImages.length && setLightboxIndex(0)}
                className="block aspect-[16/9] w-full text-left"
              >
                <ThreeDImageFrame src={hero} alt={`${project.title} hero render`} priority />
              </button>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-5">
          <div className="mx-auto grid max-w-[92rem] gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
            <div className="space-y-7">
              {hasContentBlocks && (
                <ContentBlockRenderer
                  blocks={project.contentBlocks || []}
                  onImageClick={(image) => {
                    const index = lightboxImages.findIndex((item) => item.url === image.url)
                    if (index >= 0) setLightboxIndex(index)
                  }}
                />
              )}

              {!hasContentBlocks && galleryImages.length > 0 && (
                <Section eyebrow="Renders" title="Gallery">
                  <div className="space-y-6">
                    {Object.entries(galleryGroups).map(([section, images]) => (
                      <div key={section}>
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">{section}</h3>
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          {images.map((image) => (
                            <figure key={`${image.url}-${image.originalIndex}`} className="overflow-hidden rounded-lg bg-black/25">
                              <button type="button" onClick={() => setLightboxIndex(image.originalIndex)} className="block aspect-[4/3] w-full text-left">
                                <ThreeDImageFrame src={image.url} alt={image.alt || `${project.title} render ${image.originalIndex + 1}`} />
                              </button>
                              {image.caption && (
                                <figcaption className="px-3 py-2">
                                  <RichTextDescription text={image.caption} className="text-xs text-zinc-500" />
                                </figcaption>
                              )}
                            </figure>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {project.breakdown && (
                <Section eyebrow="Process" title="Project breakdown">
                  <RichTextDescription text={project.breakdown} className="text-sm text-zinc-400" />
                </Section>
              )}

              {project.technicalNotes && (
                <Section eyebrow="Technical" title="Technical notes">
                  <RichTextDescription text={project.technicalNotes} className="text-sm text-zinc-400" />
                </Section>
              )}

              {(project.shaderNotes || project.optimizationNotes || project.substancePainterNotes || project.substanceDesignerNotes) && (
                <Section eyebrow="Production" title="Material and optimization notes">
                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      ['Shader notes', project.shaderNotes],
                      ['Optimization notes', project.optimizationNotes],
                      ['Substance Painter', project.substancePainterNotes],
                      ['Substance Designer', project.substanceDesignerNotes],
                    ].filter(([, value]) => value).map(([label, value]) => (
                      <div key={label} className="rounded-lg bg-black/25 p-3">
                        <h3 className="text-sm font-bold text-zinc-100">{label}</h3>
                        <RichTextDescription text={value} className="mt-2 text-sm text-zinc-400" />
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              <TextureMapsGrid maps={project.textureMaps || []} onImageClick={(index) => {
                const offset = galleryImages.length
                const textureImages = (project.textureMaps || []).filter((map) => map.url)
                if (!textureImages.length) return
                setLightboxIndex(offset + index)
              }} />
            </div>

            <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
              <ProjectSpecsPanel project={project} />
              <Section title="Software used">
                <PillList items={[...(project.tools || []), ...(project.softwareUsed || [])]} />
              </Section>
              <Section title="Categories">
                <PillList items={project.categories || [project.category].filter(Boolean)} />
              </Section>
              <Section title="Tags">
                <PillList items={project.tags || []} />
              </Section>
              <Section title="Techniques">
                <PillList items={project.techniques || []} />
              </Section>
              <Section title="Materials">
                <PillList items={project.materials || []} />
              </Section>
              {(project.externalLinks || []).length > 0 && (
                <Section title="External links">
                  <div className="grid gap-2">
                    {project.externalLinks.map((link) => (
                      <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[#13aff0]">
                        {link.label} <ExternalLink size={15} />
                      </a>
                    ))}
                  </div>
                </Section>
              )}
            </aside>
          </div>
        </section>
      </article>

      {lightboxIndex !== null && (
        <ThreeDLightbox
          images={lightboxImages}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((current) => {
            return lightboxImages.length ? (current + 1) % lightboxImages.length : null
          })}
          onPrevious={() => setLightboxIndex((current) => {
            return lightboxImages.length ? (current - 1 + lightboxImages.length) % lightboxImages.length : null
          })}
        />
      )}
    </ThreeDLayout>
  )
}

export default ThreeDProjectDetail
