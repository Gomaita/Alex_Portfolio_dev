import { permissionMatrix } from '../../data/blockchainLabData'

function RolePermissionMatrix() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-5">
        <h2 className="font-bold text-white">Role Permission Matrix</h2>
        <p className="mt-2 text-sm text-slate-400">Smart contracts need explicit role checks so only the right account can execute sensitive actions.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full text-left text-sm">
          <thead className="bg-slate-950 text-xs uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Freelancer</th>
              <th className="px-4 py-3">Arbiter</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {permissionMatrix.map(([action, client, freelancer, arbiter]) => (
              <tr key={action}>
                <td className="px-4 py-3 text-slate-300">{action}</td>
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
