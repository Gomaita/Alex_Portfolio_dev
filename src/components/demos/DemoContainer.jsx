import Card from '../ui/Card'

function DemoContainer({ children, note }) {
  return (
    <Card className="overflow-hidden border-blue-100 bg-white/90 p-0 shadow-xl shadow-slate-200/70 dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/25">
      <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Working demo
          </span>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        {note && <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{note}</p>}
        {children}
      </div>
    </Card>
  )
}

export default DemoContainer
