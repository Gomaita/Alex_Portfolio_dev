import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ContentBlockRenderer from '../../components/three-d/ContentBlockRenderer'
import ProjectSpecsPanel from '../../components/three-d/ProjectSpecsPanel'
import TextureMapsGrid from '../../components/three-d/TextureMapsGrid'
import ThreeDImageFrame from '../../components/three-d/ThreeDImageFrame'
import ThreeDLayout from '../../components/three-d/ThreeDLayout'
import ThreeDLightbox from '../../components/three-d/ThreeDLightbox'
import usePageTitle from '../../hooks/usePageTitle'
import { getPublished3DProjectBySlug } from '../../services/threeDProjectsService'

function Section({ eyebrow, title, children }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#12161c]/85 p-5 shadow-2xl shadow-black/20 sm:p-7">
      {eyebrow && <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-300">{eyebrow}</p>}
      <h2 className="mt-1 text-2xl font-black tracking-tight text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function PillList({ items }) {
  if (!items?.length) return <p className="text-sm text-zinc-500">Not specified yet.</p>

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-black text-zinc-200">
          {item}
        </span>
      ))}
    </div>
  )
}

function ThreeDProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  usePageTitle(project ? `${project.title} | Alex Gómez 3D` : '3D Project | Alex Gómez 3D')

  useEffect(() => {
    getPublished3DProjectBySlug(slug).then(setProject)
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

  if (!project) {
    return (
      <ThreeDLayout>
        <section className="px-5 py-24">
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-[#12161c] p-8 text-center shadow-2xl shadow-black/30">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">Project not found</p>
            <h1 className="mt-4 text-3xl font-black text-white">This project is not available.</h1>
            <p className="mt-3 text-zinc-400">This project is not available or has not been published yet.</p>
            <Link to="/3d/projects" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-sky-300 px-5 text-sm font-black text-slate-950">
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
        <section className="px-5 pb-8 pt-10">
          <div className="mx-auto max-w-7xl">
            <Link to="/3d/projects" className="inline-flex items-center gap-2 text-sm font-black text-sky-300 hover:text-sky-200">
              <ArrowLeft size={16} /> Back to 3D Projects
            </Link>
            <div className="mt-8 overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#181d24] shadow-2xl shadow-black/40">
              <button
                type="button"
                onClick={() => galleryImages.length && setLightboxIndex(0)}
                className="block aspect-[16/9] w-full text-left"
              >
                <ThreeDImageFrame src={hero} alt={`${project.title} hero render`} priority />
              </button>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.34em] text-teal-300">{project.category || '3D project'}</p>
                <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
                  {project.title}
                </h1>
                {project.subtitle && <p className="mt-4 max-w-3xl text-xl font-semibold leading-8 text-zinc-300">{project.subtitle}</p>}
                {project.description && <p className="mt-5 max-w-4xl leading-8 text-zinc-400">{project.description}</p>}
              </div>
              <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <dl className="grid gap-4">
                  {meta.map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{label}</dt>
                      <dd className="mt-1 text-sm font-black text-white">{value}</dd>
                    </div>
                  ))}
                </dl>
                {(project.externalLinks || []).length > 0 && (
                  <div className="mt-5 border-t border-white/10 pt-5">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">External links</p>
                    <div className="mt-3 grid gap-2">
                      {project.externalLinks.map((link) => (
                        <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-black text-sky-300">
                          {link.label} <ExternalLink size={15} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>

        <section className="px-5 py-10">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[22rem_1fr]">
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <ProjectSpecsPanel project={project} />
              <Section title="Tools">
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
            </aside>

            <div className="space-y-8">
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
                  <div className="space-y-7">
                    {Object.entries(galleryGroups).map(([section, images]) => (
                      <div key={section}>
                        <h3 className="text-sm font-black uppercase tracking-[0.22em] text-zinc-500">{section}</h3>
                        <div className="mt-3 grid gap-4 md:grid-cols-2">
                          {images.map((image) => (
                            <figure key={`${image.url}-${image.originalIndex}`} className="overflow-hidden rounded-2xl border border-white/10 bg-[#181d24]">
                              <button type="button" onClick={() => setLightboxIndex(image.originalIndex)} className="block aspect-[4/3] w-full text-left">
                                <ThreeDImageFrame src={image.url} alt={image.alt || `${project.title} render ${image.originalIndex + 1}`} />
                              </button>
                              {image.caption && <figcaption className="border-t border-white/10 p-3 text-sm text-zinc-400">{image.caption}</figcaption>}
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
                  <p className="whitespace-pre-line leading-8 text-zinc-400">{project.breakdown}</p>
                </Section>
              )}

              {project.technicalNotes && (
                <Section eyebrow="Technical" title="Technical notes">
                  <p className="whitespace-pre-line leading-8 text-zinc-400">{project.technicalNotes}</p>
                </Section>
              )}

              {(project.shaderNotes || project.optimizationNotes || project.substancePainterNotes || project.substanceDesignerNotes) && (
                <Section eyebrow="Production" title="Material and optimization notes">
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      ['Shader notes', project.shaderNotes],
                      ['Optimization notes', project.optimizationNotes],
                      ['Substance Painter', project.substancePainterNotes],
                      ['Substance Designer', project.substanceDesignerNotes],
                    ].filter(([, value]) => value).map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <h3 className="font-black text-white">{label}</h3>
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-400">{value}</p>
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
