import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import About from './pages/About'
import BlockchainLab from './pages/BlockchainLab'
import Contact from './pages/Contact'
import CheatsheetDetail from './pages/CheatsheetDetail'
import Cheatsheets from './pages/Cheatsheets'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Portfolio from './pages/Portfolio'
import ProjectDetail from './pages/ProjectDetail'
import SecurityLab from './pages/SecurityLab'
import ThreeDAdmin from './pages/three-d/ThreeDAdmin'
import ThreeDHome from './pages/three-d/ThreeDHome'
import ThreeDProjectDetail from './pages/three-d/ThreeDProjectDetail'
import ThreeDProjects from './pages/three-d/ThreeDProjects'

function App() {
  const location = useLocation()
  const isThreeDRoute = location.pathname === '/3d' || location.pathname.startsWith('/3d/')

  if (isThreeDRoute) {
    return (
      <Routes>
        <Route path="/3d" element={<ThreeDHome />} />
        <Route path="/3d/projects" element={<ThreeDProjects />} />
        <Route path="/3d/projects/:slug" element={<ThreeDProjectDetail />} />
        <Route path="/3d/admin" element={<ThreeDAdmin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<ProjectDetail />} />
          <Route path="/security-lab" element={<SecurityLab />} />
          <Route path="/blockchain-lab" element={<BlockchainLab />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cheatsheets" element={<Cheatsheets />} />
          <Route path="/cheatsheets/:slug" element={<CheatsheetDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
