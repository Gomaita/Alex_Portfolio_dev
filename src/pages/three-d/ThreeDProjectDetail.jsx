import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ContentBlockRenderer from '../../components/three-d/ContentBlockRenderer'
import ProjectGallery from '../../components/three-d/ProjectGallery'
import ProjectInfoCard from '../../components/three-d/ProjectInfoCard'
import ProjectSpecsPanel from '../../components/three-d/ProjectSpecsPanel'
import RichTextDescription from '../../components/three-d/RichTextDescription'
import TechnicalHighlights from '../../components/three-d/TechnicalHighlights'
import TextureMapsGrid from '../../components/three-d/TextureMapsGrid'
import ThreeDImageFrame from '../../components/three-d/ThreeDImageFrame'
import ThreeDLayout from '../../components/three-d/ThreeDLayout'
import ThreeDLightbox from '../../components/three-d/ThreeDLightbox'
import { SkillChipList, splitSoftwareAndSkills } from '../../components/three-d/ToolBadges'
import usePageTitle from '../../hooks/usePageTitle'
import { getPublished3DProjectBySlug } from '../../services/threeDProjectsService'

function Section({ eyebrow, title, children }) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-[#15181d] p-5 shadow-2xl shadow-black/10">
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

function getImageCandidate(value) {
  if (!value) return null
  if (typeof value === 'string') return value
  return value.src || value.url || null
}

function getProjectSummaryThumbnail(project) {
  const candidates = [
    project.thumbnail,
    project.thumbnailUrl,
    project.coverImage,
    project.heroImage,
    project.heroImageUrl,
    project.mainImage,
    project.image,
    project.images?.[0]?.src,
    project.images?.[0],
  ]

  return candidates.map(getImageCandidate).find(Boolean)
}

function SummaryThumbnail({ project }) {
  const thumbnail = getProjectSummaryThumbnail(project)
  if (!thumbnail) return null

  return (
    <figure className="overflow-hidden rounded-2xl border border-white/10 bg-[#12161c]/95 p-2 shadow-2xl shadow-black/20">
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-black/30 sm:aspect-[16/10] lg:aspect-[4/3]">
        <ThreeDImageFrame src={thumbnail} alt={`${project.title} project thumbnail`} className="h-full w-full object-cover" />
      </div>
    </figure>
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
      ...(hero ? [{ url: hero, alt: `${project.title} hero render`, caption: 'Hero render', section: 'Final renders', label: 'Beauty Render' }] : []),
      ...legacyImages,
    ]
    return images.filter((image) => image?.url).map((image, index) => ({ ...image, originalIndex: index }))
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
  const allToolLikeItems = [...(project.softwareUsed || []), ...(project.tools || [])]
  const allSkillLikeItems = [...(project.techniques || []), ...(project.tags || [])]
  const { skills: skillFallbacks } = splitSoftwareAndSkills(allToolLikeItems)
  const skillItems = [...allSkillLikeItems, ...skillFallbacks]
  const contentBlockImages = (project.contentBlocks || [])
    .flatMap((block) => (block.images || []).map((image) => ({
      ...image,
      label: image.label || block.category || block.title,
      section: image.section || block.category || 'Breakdown',
    })))
    .filter((image) => image?.url)
    .map((image, index) => ({ ...image, originalIndex: galleryImages.length + index }))
  const textureLightboxImages = (project.textureMaps || []).filter((map) => map.url).map((map) => ({
    url: map.url,
    alt: map.alt || `${project.title} ${map.label || 'texture map'}`,
    caption: map.label || map.caption,
  }))
  const lightboxImages = [
    ...galleryImages,
    ...contentBlockImages,
    ...textureLightboxImages,
  ]
  const hasContentBlocks = Boolean(project.contentBlocks?.length)
  const galleryShowcaseImages = [...galleryImages, ...contentBlockImages]

  return (
    <ThreeDLayout>
      <article className="pb-10">
        <section className="px-4 pb-8 pt-6 sm:px-5">
          <div className="mx-auto max-w-[98rem]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <Link to="/3d/projects" className="inline-flex items-center gap-2 text-sm font-bold text-[#13aff0] hover:text-sky-200">
                <ArrowLeft size={16} /> Back to projects
              </Link>
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-zinc-400">
                {project.assetType || project.category || '3D project'}
              </span>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#15181d] shadow-2xl shadow-black/35">
              <button
                type="button"
                onClick={() => galleryImages.length && setLightboxIndex(0)}
                className="block h-[62vh] min-h-[32rem] w-full text-left max-lg:h-[58vh] max-lg:min-h-[25rem] max-sm:h-[70vh] max-sm:min-h-[28rem]"
              >
                <ThreeDImageFrame src={hero} alt={`${project.title} hero render`} priority />
              </button>
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.28)_38%,rgba(0,0,0,0.88))]" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
                <p className="text-[11px] font-black uppercase tracking-[0.32em] text-sky-200">{project.category || '3D project'}</p>
                <h1 className="mt-3 max-w-5xl text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                  {project.title}
                </h1>
                {project.subtitle && <p className="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-200 sm:text-xl">{project.subtitle}</p>}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-5">
          <div className="mx-auto grid max-w-[98rem] gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="space-y-8">
              {project.description && (
                <section className="rounded-[1.6rem] border border-white/10 bg-[#15181d] p-5 shadow-2xl shadow-black/10 sm:p-7">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#13aff0]">Project Description</p>
                  <RichTextDescription text={project.description} className="mt-4 max-w-4xl text-sm text-zinc-300 sm:text-base" />
                </section>
              )}

              <TechnicalHighlights project={project} />

              {hasContentBlocks && (
                <ContentBlockRenderer
                  blocks={project.contentBlocks || []}
                  onImageClick={(image) => {
                    const index = lightboxImages.findIndex((item) => item.url === image.url)
                    if (index >= 0) setLightboxIndex(index)
                  }}
                />
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
                const offset = galleryImages.length + contentBlockImages.length
                const textureImages = (project.textureMaps || []).filter((map) => map.url)
                if (!textureImages.length) return
                setLightboxIndex(offset + index)
              }} />
            </div>

            <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
              <SummaryThumbnail project={project} />
              <ProjectInfoCard project={project} tools={allToolLikeItems} />
              <ProjectSpecsPanel project={project} />
              <Section title="Skills / Pipeline">
                <SkillChipList items={skillItems} />
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

        <section className="px-4 py-8 sm:px-5">
          <div className="mx-auto max-w-[98rem]">
            <ProjectGallery images={galleryShowcaseImages} title={project.title} onOpenLightbox={setLightboxIndex} />
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
