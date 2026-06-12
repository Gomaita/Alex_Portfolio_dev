import { Link, NavLink } from 'react-router-dom'

function ThreeDNavbar() {
  const linkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-300/60 ${
      isActive ? 'bg-sky-400/15 text-sky-200' : 'text-zinc-300 hover:bg-white/5 hover:text-white'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0d10]/82 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link to="/3d" className="font-bold tracking-normal text-white">
          Alex Gómez <span className="text-sky-300">3D</span>
        </Link>
        <div className="flex items-center gap-1">
          <NavLink to="/3d/projects" className={linkClass}>
            Projects
          </NavLink>
          <a href="mailto:alexgl.dvp@gmail.com" className="rounded-full px-3 py-2 text-sm font-semibold text-zinc-300 hover:bg-white/5 hover:text-white">
            Contact
          </a>
        </div>
      </nav>
    </header>
  )
}

function ThreeDFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0b0d10] px-5 py-8 text-sm text-zinc-500">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-zinc-300">Alex Gómez 3D Portfolio</p>
        <p>Real-time assets, props, environments and VR-ready presentation.</p>
      </div>
    </footer>
  )
}

function ThreeDLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0b0d10] bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),radial-gradient(circle_at_12%_0%,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_88%_10%,rgba(249,115,22,0.10),transparent_24%),linear-gradient(135deg,#0b0d10,#101318_52%,#07080a)] bg-[length:56px_56px,56px_56px,auto,auto,auto] text-zinc-100">
      <ThreeDNavbar />
      <main>{children}</main>
      <ThreeDFooter />
    </div>
  )
}

export default ThreeDLayout
