import { Activity, FileText, Gauge, RadioTower, ShieldCheck, Siren } from 'lucide-react'
import { useMemo, useState } from 'react'
import { firewallRules, incidents as initialIncidents, simulatedTrafficEvents } from '../../data/securityLabData'
import FirewallRules from './FirewallRules'
import IncidentsPanel from './IncidentsPanel'
import RequestSimulator from './RequestSimulator'
import SecurityOverview from './SecurityOverview'
import SecurityReport from './SecurityReport'
import SecurityShell from './SecurityShell'
import TrafficMonitor from './TrafficMonitor'

const tabs = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'traffic', label: 'Traffic Monitor', icon: RadioTower },
  { id: 'rules', label: 'Firewall Rules', icon: ShieldCheck },
  { id: 'simulator', label: 'Request Simulator', icon: Activity },
  { id: 'incidents', label: 'Incidents', icon: Siren },
  { id: 'report', label: 'Security Report', icon: FileText },
]

function calculatePostureScore(events, rules, incidents) {
  const averageRisk = events.reduce((sum, event) => sum + event.riskScore, 0) / events.length
  const activeRuleRatio = rules.filter((rule) => rule.enabled).length / rules.length
  const openCriticalIncidents = incidents.filter((incident) => incident.status !== 'resolved' && ['high', 'critical'].includes(incident.severity)).length
  const score = 100 - averageRisk * 0.25 + activeRuleRatio * 18 - openCriticalIncidents * 5
  return Math.max(0, Math.min(100, Math.round(score)))
}

function SecurityLabPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [rules, setRules] = useState(firewallRules)
  const [incidents, setIncidents] = useState(initialIncidents)

  const postureScore = useMemo(
    () => calculatePostureScore(simulatedTrafficEvents, rules, incidents),
    [incidents, rules],
  )

  function toggleRule(ruleId) {
    setRules((current) =>
      current.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)),
    )
  }

  function resetRules() {
    setRules(firewallRules)
  }

  function updateIncident(incidentId, updates) {
    setIncidents((current) =>
      current.map((incident) => (incident.id === incidentId ? { ...incident, ...updates } : incident)),
    )
  }

  function resetIncidents() {
    setIncidents(initialIncidents)
  }

  const content = {
    overview: <SecurityOverview events={simulatedTrafficEvents} incidents={incidents} postureScore={postureScore} />,
    traffic: <TrafficMonitor events={simulatedTrafficEvents} />,
    rules: <FirewallRules rules={rules} onToggleRule={toggleRule} onResetRules={resetRules} />,
    simulator: <RequestSimulator rules={rules} />,
    incidents: <IncidentsPanel incidents={incidents} onUpdateIncident={updateIncident} onResetIncidents={resetIncidents} />,
    report: <SecurityReport events={simulatedTrafficEvents} incidents={incidents} rules={rules} postureScore={postureScore} />,
  }[activeTab]

  return (
    <SecurityShell activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs}>
      {content}
    </SecurityShell>
  )
}

export default SecurityLabPage
