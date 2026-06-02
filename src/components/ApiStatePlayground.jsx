import { AlertCircle, CheckCircle2, CircleDashed, Loader2 } from 'lucide-react'
import { useState } from 'react'

const states = [
  {
    id: 'idle',
    label: 'Idle',
    title: 'Ready to request data',
    text: 'The interface is waiting for the user to start an action.',
    icon: CircleDashed,
  },
  {
    id: 'loading',
    label: 'Loading',
    title: 'Fetching data',
    text: 'The UI should show progress and avoid feeling frozen.',
    icon: Loader2,
  },
  {
    id: 'success',
    label: 'Success',
    title: 'Data loaded',
    text: 'The app can render cards, tables, charts or other useful information.',
    icon: CheckCircle2,
  },
  {
    id: 'error',
    label: 'Error',
    title: 'Something failed',
    text: 'The user needs a clear explanation and a way to recover.',
    icon: AlertCircle,
  },
  {
    id: 'empty',
    label: 'Empty',
    title: 'No results found',
    text: 'An empty state explains what happened and what the user can try next.',
    icon: CircleDashed,
  },
]

function ApiStatePlayground() {
  const [selectedState, setSelectedState] = useState(states[0])
  const Icon = selectedState.icon

  return (
    <section className="border-t border-white/10 bg-[linear-gradient(180deg,#020617_0%,#07111f_100%)] px-5 py-16 sm:px-6 lg:px-8">
      <div id="api-state-playground" className="mx-auto max-w-6xl scroll-mt-24">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              UI State Playground
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal text-white">
              Thinking through API states
            </h2>
            <p className="mt-3 leading-7 text-slate-300">
              Real interfaces need more than the happy path. This mini demo
              shows how I think about idle, loading, success, error and empty
              states before connecting real data.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {states.map((state) => (
                <button
                  key={state.id}
                  type="button"
                  onClick={() => setSelectedState(state)}
                  className={`rounded-md border px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                    selectedState.id === state.id
                      ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100'
                      : 'border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {state.label}
                </button>
              ))}
            </div>
          </div>

          <article className="rounded-md border border-white/10 bg-white/[0.04] p-6">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-md border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
                <Icon
                  size={24}
                  className={selectedState.id === 'loading' ? 'animate-spin' : ''}
                />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                  {selectedState.label}
                </p>
                <h3 className="mt-1 text-2xl font-bold text-white">
                  {selectedState.title}
                </h3>
                <p className="mt-2 leading-7 text-slate-300">
                  {selectedState.text}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-md border border-white/10 bg-slate-950/70 p-4">
              {selectedState.id === 'loading' ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 w-2/3 rounded bg-white/10" />
                  <div className="h-4 w-full rounded bg-white/10" />
                  <div className="h-4 w-4/5 rounded bg-white/10" />
                </div>
              ) : (
                <p className="text-sm leading-6 text-slate-300">
                  This block represents the UI area that would change depending
                  on the current request state.
                </p>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default ApiStatePlayground
