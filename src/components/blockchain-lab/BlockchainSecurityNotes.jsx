import OnChainOffChainPanel from './OnChainOffChainPanel'
import RolePermissionMatrix from './RolePermissionMatrix'

function BlockchainSecurityNotes() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h1 className="text-2xl font-bold text-white">Security Notes</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          This lab is educational. It does not use real wallets, real funds, deployed contracts, testnets or mainnet transactions.
        </p>
      </div>
      <RolePermissionMatrix />
      <OnChainOffChainPanel />
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
        <h2 className="font-bold text-amber-100">Important limits</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-amber-50">
          <li>Simplified Solidity snippets are for learning only.</li>
          <li>Real contracts require tests, audits and deployment procedures.</li>
          <li>Wallet connection and transaction signing are intentionally not implemented.</li>
          <li>Private notes, files and long descriptions should usually stay off-chain.</li>
        </ul>
      </div>
    </div>
  )
}

export default BlockchainSecurityNotes
