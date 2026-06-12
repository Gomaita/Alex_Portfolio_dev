const pipelineSteps = ['Blockout', 'High Poly', 'Low Poly', 'UVs', 'Baking', 'PBR Texturing', 'Engine Setup', 'Lighting']

function PipelineTimeline() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#12161c]/80 p-4">
      <div className="flex min-w-[760px] items-center gap-3">
        {pipelineSteps.map((step, index) => (
          <div key={step} className="flex flex-1 items-center gap-3">
            <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 p-3 text-center">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-300">{step}</p>
            </div>
            {index < pipelineSteps.length - 1 && <span className="text-sky-300/60">-&gt;</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PipelineTimeline
