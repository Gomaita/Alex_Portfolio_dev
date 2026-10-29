import { Route, Routes, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import About from './pages/About'
import BlockchainLab from './pages/BlockchainLab'
import Contact from './pages/Contact'
import CheatsheetDetail from './pages/CheatsheetDetail'
import Cheatsheets from './pages/Cheatsheets'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import NovaAIChat from './pages/NovaAIChat'
import NutriCore from './pages/NutriCore'
import Portfolio from './pages/Portfolio'
import ProjectDetail from './pages/ProjectDetail'
import SecurityLab from './pages/SecurityLab'
import ThreeDAdmin from './pages/three-d/ThreeDAdmin'
import ThreeDContact from './pages/three-d/ThreeDContact'
import ThreeDHome from './pages/three-d/ThreeDHome'
import ThreeDProjectDetail from './pages/three-d/ThreeDProjectDetail'
import ThreeDProjects from './pages/three-d/ThreeDProjects'
import PortfolioV2Route from './features/portfolio-v2/PortfolioV2Route'

const AIOperationsStudioPage = lazy(() => import('./demos/ai-operations-studio/AIOperationsStudioPage'))
const AISupportIntelligencePage = lazy(() => import('./demos/ai-support-intelligence/AISupportIntelligencePage'))
const InboxFlowAI = lazy(() => import('./pages/InboxFlowAI'))
const DevPulseApp = lazy(() => import('./features/devpulse/DevPulseApp'))

function RouteLoader() {
  return (
    <div className="min-h-[calc(100svh-4rem)] bg-slate-950 px-6 py-20 text-center text-sm font-bold text-slate-300">
      Loading demo...
    </div>
  )
}

function App() {
  const location = useLocation()
  const isThreeDRoute = location.pathname === '/3d' || location.pathname.startsWith('/3d/')

  if (location.pathname === '/newindex' || location.pathname === '/newindex/') {
    return <PortfolioV2Route />
  }

  if (location.pathname === '/devpulse' || location.pathname.startsWith('/devpulse/')) {
    return (
      <Routes>
        <Route path="/devpulse/*" element={
          <Suspense fallback={
            <div role="status" className="min-h-screen bg-[#101215] p-8 text-white">Loading DevPulse…</div>
          }>
            <DevPulseApp />
          </Suspense>
        } />
      </Routes>
    )
  }

  if (isThreeDRoute) {
    return (
      <Routes>
        <Route path="/3d" element={<ThreeDHome />} />
        <Route path="/3d/projects" element={<ThreeDProjects />} />
        <Route path="/3d/projects/:slug" element={<ThreeDProjectDetail />} />
        <Route path="/3d/contact" element={<ThreeDContact />} />
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
          <Route path="/ai-operations-studio" element={<Suspense fallback={<RouteLoader />}><AIOperationsStudioPage /></Suspense>} />
          <Route path="/ai-support-intelligence" element={<Suspense fallback={<RouteLoader />}><AISupportIntelligencePage /></Suspense>} />
          <Route path="/ai-chat" element={<NovaAIChat />} />
          <Route path="/ai-message-processor" element={<Suspense fallback={<RouteLoader />}><InboxFlowAI /></Suspense>} />
          <Route path="/nutricore" element={<NutriCore />} />
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
