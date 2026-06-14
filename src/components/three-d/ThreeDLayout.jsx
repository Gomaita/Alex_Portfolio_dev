import { Link, NavLink, useLocation } from 'react-router-dom'

function ThreeDNavbar() {
  const location = useLocation()
  const isAdmin = location.pathname === '/3d/admin'
  const linkClass = ({ isActive }) =>
    `px-2.5 py-1.5 text-[13px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-300/40 ${
      isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#070809]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-[92rem] items-center justify-between px-4 sm:px-5">
        <Link to="/3d" className="text-sm font-black tracking-tight text-white">
          Alex Gómez 3D
        </Link>
        <div className="flex items-center gap-1">
          <NavLink to="/3d/projects" className={linkClass}>
            Projects
          </NavLink>
          <a href="/3d#about" className="px-2.5 py-1.5 text-[13px] font-semibold text-zinc-400 transition hover:text-white">
            About
          </a>
          <NavLink to="/3d/contact" className={linkClass}>
            Contact
          </NavLink>
          {isAdmin && (
            <span className="ml-2 rounded-full border border-teal-300/25 bg-teal-300/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-teal-100">
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
    <footer className="border-t border-white/[0.07] bg-[#070809] px-5 py-6 text-xs text-zinc-500">
      <div className="mx-auto flex max-w-[92rem] flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-zinc-300">Alex Gómez</p>
        <p>3D Environment & Prop Artist · real-time assets, props and environments.</p>
      </div>
    </footer>
  )
}

function ThreeDLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#070809] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(20,184,166,0.07),transparent_34%),radial-gradient(circle_at_82%_12%,rgba(249,115,22,0.035),transparent_30%),linear-gradient(180deg,#0a0b0d,#070809)]" />
      <div className="relative">
        <ThreeDNavbar />
        <main>{children}</main>
        <ThreeDFooter />
      </div>
    </div>
  )
}

export default ThreeDLayout
