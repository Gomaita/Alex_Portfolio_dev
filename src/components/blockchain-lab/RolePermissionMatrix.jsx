import { permissionMatrix } from '../../data/blockchainLabData'

function RolePermissionMatrix() {
  return (
    <div className="overflow-hidden rounded-2xl border border-violet-300/12 bg-[#11112a]/95 shadow-xl shadow-violet-950/10">
      <div className="border-b border-violet-300/10 p-5">
        <h2 className="font-bold text-white">Role Permission Matrix</h2>
        <p className="mt-2 text-sm text-indigo-200/70">Smart contracts need explicit role checks so only the right account can execute sensitive actions.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full text-left text-sm">
          <thead className="bg-[#080b1f] text-xs uppercase tracking-widest text-indigo-200/55">
            <tr>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Freelancer</th>
              <th className="px-4 py-3">Arbiter</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-violet-300/10">
            {permissionMatrix.map(([action, client, freelancer, arbiter]) => (
              <tr key={action}>
                <td className="px-4 py-3 text-indigo-200/75">{action}</td>
                {[client, freelancer, arbiter].map((allowed, index) => (
                  <td key={`${action}-${index}`} className={`px-4 py-3 font-bold ${allowed ? 'text-emerald-300' : 'text-red-300'}`}>
                    {allowed ? 'Allowed' : 'Denied'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RolePermissionMatrix
