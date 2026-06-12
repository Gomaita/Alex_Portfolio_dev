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
  ].filter(([, value]) => value)

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
