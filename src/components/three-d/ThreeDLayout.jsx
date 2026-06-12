import { Link, NavLink, useLocation } from 'react-router-dom'

function ThreeDNavbar() {
  const location = useLocation()
  const isAdmin = location.pathname === '/3d/admin'
  const linkClass = ({ isActive }) =>
    `px-2.5 py-1.5 text-[13px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-300/50 ${
      isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#101216]/92 backdrop-blur-xl">
      <nav className="mx-auto flex h-12 max-w-[92rem] items-center justify-between px-4 sm:px-5">
        <Link to="/3d" className="text-sm font-black tracking-tight text-white">
          Alex Gómez
        </Link>
        <div className="flex items-center gap-1">
          <NavLink to="/3d/projects" className={linkClass}>
            Projects
          </NavLink>
          <a href="mailto:alexgl.dvp@gmail.com" className="px-2.5 py-1.5 text-[13px] font-semibold text-zinc-400 hover:text-white">
            Contact
          </a>
          {isAdmin && (
            <span className="ml-2 rounded-full border border-sky-300/30 bg-sky-300/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-sky-200">
              Admin
            </span>
          )}
        </div>
      </nav>
    </header>
  )
}

function ThreeDFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#0d0f12] px-5 py-6 text-xs text-zinc-500">
      <div className="mx-auto flex max-w-[92rem] flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-zinc-300">Alex Gómez</p>
        <p>3D Environment & Prop Artist · real-time assets, props and environments.</p>
      </div>
    </footer>
  )
}

function ThreeDLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0d0f12] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(19,175,240,0.10),transparent_32%),radial-gradient(circle_at_82%_12%,rgba(20,184,166,0.07),transparent_28%),linear-gradient(180deg,#0d0f12,#0b0d10)]" />
      <div className="relative">
        <ThreeDNavbar />
        <main>{children}</main>
        <ThreeDFooter />
      </div>
    </div>
  )
}

export default ThreeDLayout
