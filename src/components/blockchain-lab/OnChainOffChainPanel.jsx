import { onChainOffChainItems } from '../../data/blockchainLabData'

function OnChainOffChainPanel() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-violet-300/12 bg-[#11112a]/95 p-5 shadow-xl shadow-violet-950/10">
        <h2 className="font-bold text-white">On-chain</h2>
        <ul className="mt-4 space-y-3 text-sm text-indigo-200/75">
          {onChainOffChainItems.onChain.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <div className="rounded-2xl border border-violet-300/12 bg-[#11112a]/95 p-5 shadow-xl shadow-violet-950/10">
        <h2 className="font-bold text-white">Off-chain</h2>
        <ul className="mt-4 space-y-3 text-sm text-indigo-200/75">
          {onChainOffChainItems.offChain.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <p className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5 text-sm leading-6 text-cyan-100 lg:col-span-2">
        Not every piece of application data should be stored on-chain. Expensive or private data usually belongs off-chain.
      </p>
    </div>
  )
}

export default OnChainOffChainPanel
