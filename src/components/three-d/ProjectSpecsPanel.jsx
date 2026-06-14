const emptyLabels = new Set(['not specified', 'not specified yet', 'no especificado', 'n/a', 'na', 'none', '-'])

function hasProjectValue(value) {
  if (value === null || value === undefined) return false
  const text = String(value).trim()
  if (!text) return false
  return !emptyLabels.has(text.toLowerCase())
}

function ProjectSpecsPanel({ project }) {
  const specs = [
    ['Engine', project.engine],
    ['Asset type', project.assetType],
    ['Polycount', project.polycount],
    ['Textures', project.textureResolution],
    ['Texel density', project.texelDensity],
    ['Target', project.targetPlatform],
    ['Time spent', project.timeSpent],
    ['Workflow', project.textureWorkflow],
  ].filter(([, value]) => hasProjectValue(value))

  if (!specs.length) return null

  return (
    <section className="rounded-2xl border border-white/10 bg-[#12161c]/95 p-5">
      <h2 className="font-black text-white">Asset specs</h2>
      <dl className="mt-5 grid gap-3">
        {specs.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[0.8fr_1.2fr] gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm">
            <dt className="text-zinc-500">{label}</dt>
            <dd className="font-semibold text-zinc-100">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default ProjectSpecsPanel
