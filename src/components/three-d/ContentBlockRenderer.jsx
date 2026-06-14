import ThreeDImageFrame from './ThreeDImageFrame'
import RichTextDescription from './RichTextDescription'

function ContentBlockRenderer({ blocks = [], onImageClick }) {
  const validBlocks = blocks.filter((block) => block?.type)
  if (!validBlocks.length) return null

  return (
    <div className="space-y-6">
      {validBlocks.map((block, index) => {
        if (block.type === 'image') {
          const image = block.images?.[0] || block.image
          if (!image?.url) return null

          return (
            <section key={block.id || index} className="rounded-2xl border border-white/[0.07] bg-[#111214] p-4">
              {(block.title || block.text || image.caption || block.category) && (
                <div className="mb-4 max-w-3xl">
                  {block.category && <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-200/80">{block.category}</p>}
                  {block.title && <h2 className="mt-1 text-base font-bold text-zinc-100">{block.title}</h2>}
                  {(block.text || image.caption) && <RichTextDescription text={block.text || image.caption} className="mt-1 text-sm text-zinc-400" />}
                </div>
              )}
              <button
                type="button"
                onClick={() => onImageClick?.(image)}
                className="block aspect-[16/10] w-full overflow-hidden rounded-lg text-left"
              >
                <ThreeDImageFrame src={image.url} alt={image.alt || block.title || '3D project image'} />
              </button>
            </section>
          )
        }

        if (block.type === 'imageGrid') {
          const images = (block.images || []).filter((image) => image?.url)
          if (!images.length && !block.title && !block.text) return null

          return (
            <section key={block.id || index} className="rounded-2xl border border-white/[0.07] bg-[#111214] p-4">
              {block.category && <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-200/80">{block.category}</p>}
              {block.title && <h2 className="mt-1 text-lg font-bold text-zinc-100">{block.title}</h2>}
              {block.text && <RichTextDescription text={block.text} className="mt-2 max-w-3xl text-sm text-zinc-400" />}
              {!!images.length && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {images.map((image, imageIndex) => (
                    <figure key={`${image.url}-${imageIndex}`} className="overflow-hidden rounded-lg bg-black/25">
                      <button
                        type="button"
                        onClick={() => onImageClick?.(image)}
                        className="block aspect-[4/3] w-full text-left"
                      >
                        <ThreeDImageFrame src={image.url} alt={image.alt || block.title || '3D block image'} />
                      </button>
                      {image.caption && (
                        <figcaption className="px-3 py-2">
                          <RichTextDescription text={image.caption} className="text-xs text-zinc-500" />
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              )}
            </section>
          )
        }

        if (block.type === 'specs' || block.type === 'technicalBreakdown') {
          const rows = (block.data || [])
            .map((item) => Array.isArray(item) ? item : [item?.label, item?.value])
            .filter(([label, value]) => label && value)
          if (!rows.length) return null

          return (
            <section key={block.id || index} className="rounded-2xl border border-white/[0.07] bg-[#111214] p-4">
              {block.title && <h2 className="text-lg font-bold text-zinc-100">{block.title}</h2>}
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {rows.map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-black/25 p-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
                    <RichTextDescription text={value} className="mt-1 text-sm text-zinc-300" />
                  </div>
                ))}
              </div>
            </section>
          )
        }

        if (block.type === 'technicalNote') {
          if (!block.title && !block.text) return null
          return (
            <section key={block.id || index} className="rounded-2xl border border-white/[0.07] border-l-teal-200/40 bg-[#111214] px-4 py-3">
              {block.category && <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-200/80">{block.category}</p>}
              {block.title && <h2 className="mt-1 text-base font-bold text-zinc-100">{block.title}</h2>}
              {block.text && <RichTextDescription text={block.text} className="mt-2 text-sm text-zinc-400" />}
            </section>
          )
        }

        if (!block.title && !block.text) return null

        return (
          <section key={block.id || index} className="mx-auto max-w-3xl py-1">
            {block.category && <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-200/80">{block.category}</p>}
            {block.title && <h2 className="mt-1 text-xl font-bold text-zinc-100">{block.title}</h2>}
            {block.text && <RichTextDescription text={block.text} className="mt-3 text-sm text-zinc-400" />}
          </section>
        )
      })}
    </div>
  )
}

export default ContentBlockRenderer
