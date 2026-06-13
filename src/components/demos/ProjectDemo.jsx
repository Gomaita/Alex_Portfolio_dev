import { Link } from 'react-router-dom'
import GitHubProjectsExplorer from '../GitHubProjectsExplorer'
import MarketDashboard from '../MarketDashboard'
import ProjectManagerDemo from '../ProjectManagerDemo'
import APIHealthMonitor from './APIHealthMonitor'
import AuthFlowSimulator from './AuthFlowSimulator'
import CheckoutFlowSimulator from './CheckoutFlowSimulator'
import D1DatabaseMetrics from './D1DatabaseMetrics'
import SecureUsersRolesDemo from './SecureUsersRolesDemo'
import SQLQueryPlayground from './SQLQueryPlayground'
import WeatherSearchDemo from '../WeatherSearchDemo'
import DemoContainer from './DemoContainer'

const demos = {
  market: <MarketDashboard />,
  crud: <ProjectManagerDemo />,
  weather: <WeatherSearchDemo />,
  github: <GitHubProjectsExplorer />,
  sql: <SQLQueryPlayground />,
  'secure-users': <SecureUsersRolesDemo />,
  'api-health': <APIHealthMonitor />,
  'd1-metrics': <D1DatabaseMetrics />,
  'auth-flow': <AuthFlowSimulator />,
  'checkout-flow': <CheckoutFlowSimulator />,
}

function ProjectDemo({ project }) {
  if (project.demoComponentKey === 'cheatsheets') {
    return (
      <DemoContainer note="This project lives as its own reference area with dynamic routes and copyable snippets.">
        <Link
          to="/cheatsheets"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
        >
          Open Programming Cheatsheets
        </Link>
      </DemoContainer>
    )
  }

  if (project.demoComponentKey === 'nova-ai-chat') {
    return (
      <DemoContainer note="Nova AI Chat lives as a full standalone app so the conversation interface can use the whole screen.">
        <Link
          to="/ai-chat"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
        >
          Open Nova AI Chat
        </Link>
      </DemoContainer>
    )
  }

  if (project.demoComponentKey === 'nutricore') {
    return (
      <DemoContainer note="NutriCore is a full standalone SaaS-style demo, so it opens as its own nutrition and training platform.">
        <Link
          to="/nutricore"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
        >
          Open NutriCore
        </Link>
      </DemoContainer>
    )
  }

  return demos[project.demoComponentKey] ? (
    <DemoContainer>{demos[project.demoComponentKey]}</DemoContainer>
  ) : null
}

export default ProjectDemo
