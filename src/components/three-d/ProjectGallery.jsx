import { useState } from 'react'
import ThreeDImageFrame from './ThreeDImageFrame'

function ProjectGallery({ images = [], title = '3D project', onOpenLightbox }) {
  const validImages = images.filter((image) => image?.url)
  const [activeIndex, setActiveIndex] = useState(0)

  if (!validImages.length) return null

  const activeImage = validImages[Math.min(activeIndex, validImages.length - 1)]

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(19,175,240,0.10),transparent_34%),#15181d] p-4 shadow-2xl shadow-black/25 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#13aff0]">Gallery</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-100">Project Gallery</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-zinc-400">
          {activeIndex + 1} / {validImages.length}
        </span>
      </div>

      <figure className="mt-5 overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/25">
        <button type="button" onClick={() => onOpenLightbox?.(activeImage.originalIndex ?? activeIndex)} className="block aspect-[16/10] w-full text-left sm:aspect-[16/9]">
          <ThreeDImageFrame src={activeImage.url} alt={activeImage.alt || `${title} render ${activeIndex + 1}`} />
        </button>
        {(activeImage.label || activeImage.section || activeImage.caption) && (
          <figcaption className="flex flex-wrap items-center gap-2 px-4 py-3">
            {(activeImage.label || activeImage.section) && (
              <span className="rounded-full bg-[#13aff0]/15 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-sky-200">
                {activeImage.label || activeImage.section}
              </span>
            )}
            {activeImage.caption && <span className="text-xs text-zinc-500">{activeImage.caption}</span>}
          </figcaption>
        )}
      </figure>

      {validImages.length > 1 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {validImages.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`group overflow-hidden rounded-xl border bg-black/30 transition duration-200 hover:-translate-y-0.5 ${index === activeIndex ? 'border-[#13aff0] shadow-lg shadow-sky-500/10' : 'border-white/10 hover:border-white/30'}`}
              aria-label={`Show image ${index + 1}`}
            >
              <div className="aspect-[4/3]">
                <ThreeDImageFrame src={image.url} alt={image.alt || `${title} thumbnail ${index + 1}`} className="transition group-hover:scale-105" />
              </div>
              {(image.label || image.section) && (
                <span className="block truncate px-2 py-1 text-[10px] font-bold text-zinc-400">
                  {image.label || image.section}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default ProjectGallery
