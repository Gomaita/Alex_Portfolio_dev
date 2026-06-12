import ThreeDImageFrame from './ThreeDImageFrame'

function TextureMapsGrid({ maps = [], onImageClick }) {
  if (!maps.length) return null

  return (
    <section className="rounded-2xl border border-white/10 bg-[#12161c]/95 p-6">
      <h2 className="text-2xl font-black text-white">Texture maps</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {maps.map((map, index) => (
          <figure key={`${map.label}-${index}`} className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
            <button type="button" onClick={() => onImageClick?.(index)} className="block aspect-square w-full text-left">
              <ThreeDImageFrame src={map.url} alt={`${map.label} texture map`} />
            </button>
            <figcaption className="p-3">
              <p className="font-bold text-white">{map.label}</p>
              {map.note && <p className="mt-1 text-xs leading-5 text-zinc-500">{map.note}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default TextureMapsGrid
