import ThreeDImageFrame from './ThreeDImageFrame'
import RichTextDescription from './RichTextDescription'

function getBlockTitle(block, fallback = null) {
  return block.blockTitle || block.title || fallback
}

function ContentBlockRenderer({ blocks = [], onImageClick }) {
  const validBlocks = blocks.filter((block) => block?.type)
  if (!validBlocks.length) return null

  return (
    <div className="space-y-8">
      {validBlocks.map((block, index) => {
        if (block.type === 'image') {
          const image = block.images?.[0] || block.image
          if (!image?.url) return null
          const title = getBlockTitle(block)

          return (
            <section key={block.id || index} className="mx-auto max-w-5xl">
              {(title || block.text || image.caption) && (
                <div className="mb-3 max-w-3xl">
                  {title && <h2 className="text-lg font-bold tracking-tight text-zinc-100">{title}</h2>}
                  {(block.text || image.caption) && <RichTextDescription text={block.text || image.caption} className="mt-1 text-sm text-zinc-400" />}
                </div>
              )}
              <button
                type="button"
                onClick={() => onImageClick?.(image)}
                className="block aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-black/25 text-left shadow-2xl shadow-black/15"
              >
                <ThreeDImageFrame src={image.url} alt={image.alt || title || '3D project image'} />
              </button>
            </section>
          )
        }

        if (block.type === 'imageGrid') {
          const images = (block.images || []).filter((image) => image?.url)
          const title = getBlockTitle(block)
          if (!images.length && !title && !block.text) return null

          return (
            <section key={block.id || index} className="mx-auto max-w-5xl">
              {title && <h2 className="text-lg font-bold tracking-tight text-zinc-100">{title}</h2>}
              {block.text && <RichTextDescription text={block.text} className="mt-2 max-w-3xl text-sm text-zinc-400" />}
              {!!images.length && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {images.map((image, imageIndex) => (
                    <figure key={`${image.url}-${imageIndex}`} className="overflow-hidden rounded-2xl border border-white/[0.06] bg-black/25 shadow-xl shadow-black/10">
                      <button
                        type="button"
                        onClick={() => onImageClick?.(image)}
                        className="block aspect-[4/3] w-full text-left"
                      >
                        <ThreeDImageFrame src={image.url} alt={image.alt || title || '3D block image'} />
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
            <section key={block.id || index} className="mx-auto max-w-5xl rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
              {getBlockTitle(block) && <h2 className="text-lg font-bold text-zinc-100">{getBlockTitle(block)}</h2>}
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
          const title = getBlockTitle(block)
          if (!title && !block.text) return null
          return (
            <section key={block.id || index} className="mx-auto max-w-5xl rounded-2xl border border-white/[0.06] border-l-teal-200/35 bg-white/[0.025] px-4 py-3">
              {title && <h2 className="text-base font-bold text-zinc-100">{title}</h2>}
              {block.text && <RichTextDescription text={block.text} className="mt-2 text-sm text-zinc-400" />}
            </section>
          )
        }

        const title = getBlockTitle(block)
        if (!title && !block.text) return null

        return (
          <section key={block.id || index} className="mx-auto max-w-3xl py-1">
            {title && <h2 className="text-xl font-bold text-zinc-100">{title}</h2>}
            {block.text && <RichTextDescription text={block.text} className="mt-3 text-sm text-zinc-400" />}
          </section>
        )
      })}
    </div>
  )
}

export default ContentBlockRenderer
