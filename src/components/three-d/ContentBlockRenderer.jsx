import ThreeDImageFrame from './ThreeDImageFrame'

function ContentBlockRenderer({ blocks = [], onImageClick }) {
  if (!blocks.length) return null

  return (
    <div className="space-y-8">
      {blocks.map((block, index) => {
        if (!block || !block.type) return null

        if (block.type === 'image') {
          const image = block.images?.[0] || block.image
          if (!image?.url) return null

          return (
            <figure key={index} className="overflow-hidden rounded-2xl border border-white/10 bg-[#12161c]/95">
              <button
                type="button"
                onClick={() => onImageClick?.(image)}
                className="block aspect-[16/10] w-full text-left"
              >
                <ThreeDImageFrame src={image.url} alt={image.alt || block.title || '3D project image'} />
              </button>
              {(block.title || block.text || image.caption || block.category) && (
                <figcaption className="border-t border-white/10 p-5">
                  {block.category && <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">{block.category}</p>}
                  {block.title && <h2 className="mt-1 text-xl font-black text-white">{block.title}</h2>}
                  {(block.text || image.caption) && <p className="mt-2 leading-7 text-zinc-400">{block.text || image.caption}</p>}
                </figcaption>
              )}
            </figure>
          )
        }

        if (block.type === 'imageGrid') {
          return (
            <section key={index} className="rounded-2xl border border-white/10 bg-[#12161c]/95 p-6">
              {block.category && <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">{block.category}</p>}
              {block.title && <h2 className="text-2xl font-black text-white">{block.title}</h2>}
              {block.text && <p className="mt-3 leading-7 text-zinc-400">{block.text}</p>}
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {(block.images || []).map((image, imageIndex) => (
                  <button
                    key={`${image.url}-${imageIndex}`}
                    type="button"
                    onClick={() => onImageClick?.(image)}
                    className="overflow-hidden rounded-xl border border-white/10 bg-black/20 text-left"
                  >
                    <div className="aspect-[4/3]">
                      <ThreeDImageFrame src={image.url} alt={image.alt || block.title || '3D block image'} />
                    </div>
                    {image.caption && <p className="p-3 text-sm text-zinc-400">{image.caption}</p>}
                  </button>
                ))}
              </div>
            </section>
          )
        }

        if (block.type === 'specs' || block.type === 'technicalBreakdown') {
          const rows = (block.data || [])
            .map((item) => Array.isArray(item) ? item : [item?.label, item?.value])
            .filter(([label, value]) => label && value)

          return (
            <section key={index} className="rounded-2xl border border-white/10 bg-[#12161c]/95 p-6">
              {block.title && <h2 className="text-2xl font-black text-white">{block.title}</h2>}
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {rows.map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">{value}</p>
                  </div>
                ))}
              </div>
            </section>
          )
        }

        return (
          <section key={index} className="rounded-2xl border border-white/10 bg-[#12161c]/95 p-6">
            {block.category && <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">{block.category}</p>}
            {block.title && <h2 className="text-2xl font-black text-white">{block.title}</h2>}
            {block.text && <p className="mt-4 leading-8 text-zinc-400">{block.text}</p>}
          </section>
        )
      })}
    </div>
  )
}

export default ContentBlockRenderer
