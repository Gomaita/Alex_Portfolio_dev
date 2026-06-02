import { ArrowRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="min-h-[calc(100svh-5rem)] bg-[linear-gradient(180deg,#020617_0%,#07111f_100%)] px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[55svh] max-w-3xl items-center justify-center">
        <div className="rounded-md border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-slate-950/30">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            404
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal text-white">
            Page not found
          </h1>
          <p className="mt-4 leading-7 text-slate-300">
            This route does not exist, but the main portfolio pages are still
            right here.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <Home size={18} />
              Go Home
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              View Portfolio
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotFound
