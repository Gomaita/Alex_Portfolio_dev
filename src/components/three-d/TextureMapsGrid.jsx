import ThreeDImageFrame from './ThreeDImageFrame'
import RichTextDescription from './RichTextDescription'

function TextureMapsGrid({ maps = [], onImageClick }) {
  if (!maps.length) return null

  return (
    <section className="rounded-xl bg-[#15181d] p-4">
      <h2 className="text-lg font-bold text-zinc-100">Texture maps</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {maps.map((map, index) => (
          <figure key={`${map.label}-${index}`} className="overflow-hidden rounded-lg bg-black/25">
            <button type="button" onClick={() => onImageClick?.(index)} className="block aspect-square w-full text-left">
              <ThreeDImageFrame src={map.url} alt={`${map.label} texture map`} />
            </button>
            <figcaption className="px-3 py-2">
              <p className="text-sm font-bold text-zinc-100">{map.label}</p>
              {map.note && <RichTextDescription text={map.note} className="mt-1 text-xs text-zinc-500" />}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default TextureMapsGrid
