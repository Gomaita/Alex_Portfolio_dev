import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ThreeDImageFrame from '../../components/three-d/ThreeDImageFrame'
import ThreeDLayout from '../../components/three-d/ThreeDLayout'
import usePageTitle from '../../hooks/usePageTitle'
import { getPublished3DProjectBySlug } from '../../services/threeDProjectsService'

function ThreeDProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  usePageTitle(project ? `${project.title} | Alex Gómez 3D` : '3D Project | Alex Gómez 3D')

  useEffect(() => {
    getPublished3DProjectBySlug(slug).then(setProject)
  }, [slug])

  if (!project) {
    return (
      <ThreeDLayout>
        <section className="px-5 py-20 text-center text-zinc-400">Project not found or not published.</section>
      </ThreeDLayout>
    )
  }

  const hero = project.heroImageUrl || project.hero_image_url || project.thumbnailUrl || project.thumbnail_url
  const images = project.images || []

  return (
    <ThreeDLayout>
      <section className="px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <Link to="/3d/projects" className="inline-flex items-center gap-2 text-sm font-bold text-sky-300 hover:text-sky-200">
            <ArrowLeft size={16} /> Back to 3D Projects
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-teal-300">{project.category}</p>
              <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl">{project.title}</h1>
              {project.subtitle && <p className="mt-3 text-xl font-semibold text-zinc-300">{project.subtitle}</p>}
              <p className="mt-5 max-w-3xl leading-8 text-zinc-400">{project.description}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#12161c] p-5">
              <dl className="grid gap-4 text-sm">
                <div><dt className="text-zinc-500">Year</dt><dd className="mt-1 font-semibold text-white">{project.year || project.date}</dd></div>
                <div><dt className="text-zinc-500">Role</dt><dd className="mt-1 font-semibold text-white">{project.role}</dd></div>
                <div><dt className="text-zinc-500">Tools</dt><dd className="mt-2 flex flex-wrap gap-2">{(project.tools || []).map((tool) => <span key={tool} className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-zinc-300">{tool}</span>)}</dd></div>
              </dl>
            </div>
          </div>
          <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-[#181d24]">
            <div className="aspect-[16/9]">
              <ThreeDImageFrame src={hero} alt={`${project.title} hero image`} priority />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#12161c] p-5">
              <h2 className="font-bold text-white">Techniques</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {(project.techniques || []).map((item) => <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-zinc-300">{item}</span>)}
              </div>
            </div>
            {(project.externalLinks || []).length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-[#12161c] p-5">
                <h2 className="font-bold text-white">Links</h2>
                <div className="mt-4 grid gap-2">
                  {project.externalLinks.map((link) => (
                    <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-sky-300">
                      {link.label} <ExternalLink size={15} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
          <div className="space-y-8">
            <section className="rounded-2xl border border-white/10 bg-[#12161c] p-6">
              <h2 className="text-2xl font-black text-white">Project breakdown</h2>
              <p className="mt-4 leading-8 text-zinc-400">{project.breakdown}</p>
            </section>
            <section className="rounded-2xl border border-white/10 bg-[#12161c] p-6">
              <h2 className="text-2xl font-black text-white">Technical notes</h2>
              <p className="mt-4 leading-8 text-zinc-400">{project.technicalNotes}</p>
            </section>
          </div>
        </div>
      </section>

      <section className="px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black text-white">Gallery</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {(images.length ? images : [{ url: hero, alt: `${project.title} gallery image` }]).map((image, index) => (
              <figure key={`${image.url}-${index}`} className="overflow-hidden rounded-2xl border border-white/10 bg-[#181d24]">
                <div className="aspect-[4/3]">
                  <ThreeDImageFrame src={image.url} alt={image.alt || `${project.title} gallery image ${index + 1}`} />
                </div>
                {image.caption && <figcaption className="p-3 text-sm text-zinc-400">{image.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </div>
      </section>
    </ThreeDLayout>
  )
}

export default ThreeDProjectDetail
