import { ArrowRight, Home } from 'lucide-react'
import Button from '../components/ui/Button'

function NotFound() {
  return (
    <section className="min-h-[calc(100svh-4rem)] bg-[#F6F8FB] px-5 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[55svh] max-w-3xl items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            404
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal text-slate-950">
            Page not found
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            This route does not exist, but the main portfolio pages are still
            right here.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/" variant="primary">
              <Home size={18} />
              Go home
            </Button>
            <Button to="/portfolio">
              View portfolio
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotFound
