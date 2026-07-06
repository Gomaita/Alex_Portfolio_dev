import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Code2,
  Copy,
  Database,
  Download,
  Eye,
  FileText,
  Filter,
  Gauge,
  GitBranch,
  HelpCircle,
  Layers3,
  LockKeyhole,
  Menu,
  Play,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  UserCheck,
  Wand2,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { agentTasks, runAgent } from './agentEngine'
import { categories, createLog, pipelineStages, priorities } from './aiOpsTypes'
import { categoryDistribution, classifyTickets } from './classificationEngine'
import { cleaningSteps, inspectDataset, runCleaningPipeline } from './cleaningEngine'
import { runEvaluationSuite } from './evaluationEngine'
import { askKnowledgeAssistant, sampleQuestions } from './knowledgeBase'
import { generateExecutiveReport } from './reportEngine'
import { applyHumanReview, getReviewQueue, reviewMetrics } from './reviewEngine'
import { supportTickets } from './sampleTickets'
import usePageTitle from '../../hooks/usePageTitle'

const navItems = [
  ['mission', 'Mission Control', Gauge],
  ['dataset', 'Dataset', Database],
  ['cleaning', 'Cleaning', LockKeyhole],
  ['classification', 'Classification', BrainCircuit],
  ['review', 'Review', UserCheck],
  ['agent', 'Agent', Bot],
  ['knowledge', 'Knowledge', Search],
  ['evaluation', 'Evaluation', ShieldCheck],
  ['reports', 'Reports', FileText],
  ['architecture', 'Architecture', GitBranch],
  ['recruiter', 'Recruiter View', ClipboardCheck],
]
const chartColors = ['#22d3ee', '#34d399', '#f59e0b', '#a78bfa', '#fb7185', '#60a5fa']

function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Button({ children, onClick, disabled = false, variant = 'primary' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary'
          ? 'bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/15 hover:bg-cyan-200'
          : 'border border-white/10 bg-white/[0.055] text-slate-100 hover:bg-white/[0.09]',
      )}
    >
      {children}
    </button>
  )
}

function StatusBadge({ status }) {
  const styles = {
    pending: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
    active: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100',
    completed: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100',
    warning: 'border-amber-400/30 bg-amber-400/10 text-amber-100',
    failed: 'border-red-400/30 bg-red-400/10 text-red-100',
    reviewed: 'border-violet-400/30 bg-violet-400/10 text-violet-100',
  }
  return <span className={cx('inline-flex rounded-full border px-2.5 py-1 text-xs font-black capitalize', styles[status] || styles.pending)}>{status}</span>
}

function MetricCard({ label, value, icon: Icon, tone = 'cyan' }) {
  const toneClass = tone === 'green' ? 'from-emerald-400/18' : tone === 'amber' ? 'from-amber-400/18' : tone === 'violet' ? 'from-violet-400/18' : 'from-cyan-400/18'
  return (
    <article className={cx('ai-support-panel rounded-3xl bg-gradient-to-br to-white/[0.035] p-4', toneClass)}>
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-white">
          <Icon size={21} />
        </span>
      </div>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </article>
  )
}

function Panel({ eyebrow, title, children, action, className = '' }) {
  return (
    <section className={cx('ai-support-panel rounded-[1.7rem] p-5', className)}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          {eyebrow && <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100/65">{eyebrow}</p>}
          <h2 className="mt-1 text-xl font-black tracking-tight text-white">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-white/[0.035] p-8 text-center">
      <Sparkles className="mx-auto text-cyan-200" size={30} />
      <h3 className="mt-4 text-xl font-black text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

function ConfidenceBar({ value }) {
  const tone = value >= 85 ? 'bg-emerald-300' : value >= 75 ? 'bg-cyan-300' : value >= 60 ? 'bg-amber-300' : 'bg-red-300'
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-bold text-slate-400">
        <span>Confidence</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className={cx('h-full rounded-full', tone)} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function ActivityLog({ logs }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 font-mono text-xs text-slate-300">
      <div className="mb-3 flex items-center gap-2 text-cyan-200">
        <TerminalSquare size={16} />
        activity.log
      </div>
      <div className="grid max-h-80 gap-2 overflow-auto pr-1">
        {logs.map((log) => (
          <p key={log.id} className="leading-5">
            <span className="text-slate-500">[{log.time}]</span> <span className="text-emerald-300">{log.module}</span> · {log.message}
          </p>
        ))}
      </div>
    </div>
  )
}

function DataTable({ tickets, onSelect }) {
  if (!tickets.length) return <EmptyState title="No dataset loaded" text="Load the demo dataset to inspect raw support tickets." />
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-[920px] w-full text-left text-sm">
        <thead className="bg-white/[0.055] text-xs uppercase tracking-[0.14em] text-slate-400">
          <tr>
            {['id', 'customer', 'channel', 'message', 'date', 'status', 'action'].map((head) => <th key={head} className="px-4 py-3 font-black">{head}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="align-top text-slate-300">
              <td className="px-4 py-3 font-bold text-white">{ticket.id}</td>
              <td className="px-4 py-3">{ticket.customerName || 'Missing'}</td>
              <td className="px-4 py-3"><span className="rounded-full border border-white/10 px-2 py-1 text-xs font-black">{ticket.channel || 'missing'}</span></td>
              <td className="max-w-[28rem] px-4 py-3 leading-6">{ticket.message}</td>
              <td className="px-4 py-3">{ticket.date}</td>
              <td className="px-4 py-3">{ticket.status}</td>
              <td className="px-4 py-3">
                <Button variant="secondary" onClick={() => onSelect(ticket)}><Eye size={15} /> Open</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TicketDrawer({ ticket, onClose }) {
  if (!ticket) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="ml-auto flex h-full max-w-xl flex-col rounded-[2rem] border border-white/10 bg-[#0b1020] p-5 shadow-2xl shadow-black">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-100/70">Ticket detail</p>
            <h2 className="mt-2 text-2xl font-black text-white">{ticket.id}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 p-2 text-slate-300 hover:bg-white/10" aria-label="Close ticket drawer">
            <X size={18} />
          </button>
        </div>
        <div className="mt-5 grid gap-3 text-sm text-slate-300">
          <p><strong className="text-white">Customer:</strong> {ticket.customerName || 'Missing'}</p>
          <p><strong className="text-white">Channel:</strong> {ticket.channel || 'missing'}</p>
          <p><strong className="text-white">Email:</strong> {ticket.email || 'missing'}</p>
          <p><strong className="text-white">Phone:</strong> {ticket.phone || 'missing'}</p>
          <p className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 leading-7">{ticket.message}</p>
        </div>
      </div>
    </div>
  )
}

function Sidebar({ active, setActive, progress, open, setOpen }) {
  return (
    <aside className={cx('ai-support-sidebar', open && 'is-open')}>
      <div className="mb-5 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100/70">AI product demo</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-white">AI Support Intelligence</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">Support data, agents, privacy and evaluation.</p>
      </div>
      <nav className="grid gap-2">
        {navItems.map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => { setActive(id); setOpen(false) }}
            className={cx('flex min-h-11 items-center gap-3 rounded-2xl px-3 text-left text-sm font-bold transition active:scale-95', active === id ? 'bg-cyan-300 text-slate-950' : 'text-slate-300 hover:bg-white/[0.075] hover:text-white')}
          >
            <Icon size={17} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Pipeline progress</p>
        <div className="mt-3 grid gap-2">
          {pipelineStages.map(([key, label]) => (
            <div key={key} className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-300">{label}</span>
              <StatusBadge status={progress[key] ? 'completed' : 'pending'} />
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

function Header({ activeLabel, onReset, onRunFullDemo, onMenu }) {
  return (
    <header className="ai-support-panel flex flex-wrap items-center justify-between gap-3 rounded-[1.7rem] p-4">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onMenu} className="rounded-2xl border border-white/10 p-2 text-white lg:hidden" aria-label="Open navigation">
          <Menu size={20} />
        </button>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-100/65">Current module</p>
          <h2 className="text-xl font-black text-white">{activeLabel}</h2>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <StatusBadge status="active" />
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-slate-300">Demo mode</span>
        <Button onClick={onRunFullDemo}><Play size={15} /> Run full demo</Button>
        <Button variant="secondary" onClick={onReset}><RefreshCcw size={15} /> Reset</Button>
      </div>
    </header>
  )
}

function ContextPanel({ active, logs, metrics, selectedTicket, agentResult }) {
  return (
    <aside className="ai-support-context">
      <Panel eyebrow="Context" title="Operational telemetry">
        <div className="grid gap-3">
          <MetricCard label="Avg latency" value="1.4s" icon={Activity} />
          <MetricCard label="Est. tokens" value={metrics.estimatedTokens} icon={BrainCircuit} tone="violet" />
          <MetricCard label="Est. cost" value={`$${metrics.estimatedCost}`} icon={Gauge} tone="green" />
          <MetricCard label="Tool calls" value={metrics.toolCalls} icon={TerminalSquare} />
        </div>
      </Panel>
      <Panel eyebrow={active} title="Technical trace">
        <ActivityLog logs={logs.slice(0, 9)} />
      </Panel>
      <Panel eyebrow="Explainability" title={selectedTicket ? selectedTicket.id : 'No ticket selected'}>
        {selectedTicket ? (
          <div className="space-y-3 text-sm leading-6 text-slate-300">
            <p><strong className="text-white">Category:</strong> {selectedTicket.category || 'Unclassified'}</p>
            <p><strong className="text-white">Priority:</strong> {selectedTicket.priority || 'Pending'}</p>
            {selectedTicket.confidence && <ConfidenceBar value={selectedTicket.confidence} />}
            <p><strong className="text-white">Signals:</strong> {(selectedTicket.reasoningSignals || []).join(', ')}</p>
          </div>
        ) : (
          <p className="text-sm leading-6 text-slate-400">Select a ticket to inspect model reasoning and risk signals.</p>
        )}
      </Panel>
      {agentResult && (
        <Panel eyebrow="Agent output" title="Latest recommendation">
          <p className="text-sm leading-7 text-slate-300">{agentResult.output.mainFinding}</p>
        </Panel>
      )}
    </aside>
  )
}

function MissionControl({ state, actions, metrics }) {
  const distribution = categoryDistribution(state.classifiedTickets)
  const chartData = Object.entries(distribution).map(([name, value]) => ({ name, value }))
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Tickets processed" value={state.dataset.length} icon={Database} />
        <MetricCard label="High priority issues" value={metrics.highPriority} icon={AlertTriangle} tone="amber" />
        <MetricCard label="Avg confidence" value={`${metrics.avgConfidence}%`} icon={Gauge} />
        <MetricCard label="Privacy risks masked" value={metrics.privacyRisks} icon={LockKeyhole} tone="green" />
        <MetricCard label="Evaluation score" value={`${metrics.evaluationScore}%`} icon={ShieldCheck} tone="green" />
        <MetricCard label="Estimated AI cost" value={`$${metrics.estimatedCost}`} icon={BrainCircuit} tone="violet" />
      </div>
      <Panel eyebrow="Workflow" title="Control pipeline" action={<Button onClick={actions.runFullDemo}><Play size={16} /> Start pipeline</Button>}>
        <div className="grid gap-3 md:grid-cols-7">
          {['Dataset Intake', 'Privacy Masking', 'Classification', 'Human Review', 'AI Agent', 'Evaluation', 'Report'].map((step, index) => {
            const key = pipelineStages[index]?.[0]
            return (
              <div key={step} className={cx('rounded-2xl border p-3 text-center transition', state.progress[key] ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100' : 'border-white/10 bg-white/[0.045] text-slate-400')}>
                <span className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-xs font-black">{index + 1}</span>
                <p className="text-xs font-black">{step}</p>
              </div>
            )
          })}
        </div>
      </Panel>
      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Panel eyebrow="Current operation" title="System status">
          <div className="grid gap-3">
            <StatusBadge status={state.progress.reportGenerated ? 'completed' : state.progress.datasetLoaded ? 'active' : 'pending'} />
            <p className="text-sm leading-7 text-slate-300">
              {state.progress.reportGenerated
                ? 'Full workflow completed. Executive report is ready.'
                : state.progress.datasetLoaded
                  ? 'Dataset is loaded. Continue through cleaning, classification and evaluation.'
                  : 'Load the demo dataset to start the AI workflow.'}
            </p>
          </div>
        </Panel>
        <Panel eyebrow="Category distribution" title="Ticket clusters">
          {chartData.length ? <MiniBarChart data={chartData} /> : <EmptyState title="No categories yet" text="Run classification to see issue distribution." />}
        </Panel>
      </div>
    </div>
  )
}

function MiniBarChart({ data }) {
  return (
    <div className="h-72 min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#fff' }} />
          <Bar dataKey="value" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function DatasetIntake({ dataset, actions, selectedTicket, setSelectedTicket }) {
  const summary = inspectDataset(dataset)
  return (
    <Panel
      eyebrow="Dataset intake"
      title="Raw support tickets"
      action={<div className="flex flex-wrap gap-2"><Button onClick={actions.loadDataset}><Database size={16} /> Load demo dataset</Button><Button variant="secondary" onClick={actions.resetDataset}><RefreshCcw size={16} /> Reset</Button></div>}
    >
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Rows" value={summary.totalRows} icon={Database} />
        <MetricCard label="Duplicates" value={summary.duplicatedRows} icon={Copy} tone="amber" />
        <MetricCard label="Missing fields" value={summary.missingFields} icon={HelpCircle} tone="amber" />
        <MetricCard label="Sensitive entities" value={summary.sensitiveData.names + summary.sensitiveData.emails + summary.sensitiveData.phones} icon={LockKeyhole} tone="green" />
        <MetricCard label="Channels" value={summary.channels.length} icon={Layers3} />
      </div>
      <DataTable tickets={dataset} onSelect={setSelectedTicket} />
      <TicketDrawer ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
    </Panel>
  )
}

function CleaningPrivacyPipeline({ dataset, cleaning, actions }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
      <Panel eyebrow="Cleaning & privacy" title="Privacy-first processing" action={<Button disabled={!dataset.length} onClick={actions.runCleaning}><Wand2 size={16} /> Run cleaning pipeline</Button>}>
        <div className="grid gap-3">
          {cleaningSteps.map((step, index) => (
            <div key={step} className={cx('rounded-2xl border p-4 transition', cleaning ? 'border-emerald-300/25 bg-emerald-300/10' : 'border-white/10 bg-white/[0.045]')}>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08] text-sm font-black text-white">{index + 1}</span>
                <div>
                  <h3 className="font-black text-white">{step}</h3>
                  <p className="text-sm text-slate-400">{cleaning ? 'Completed' : 'Pending execution'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel eyebrow="Privacy example" title="Before / after">
        <p className="mb-4 text-sm leading-7 text-slate-300">Before sending business data to an AI model, sensitive information is detected and masked to reduce privacy risks.</p>
        <div className="grid gap-3">
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm leading-6 text-red-100">Hola soy Carlos, mi email es carlos@email.com y mi teléfono es 612345678</div>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">Hola soy [CUSTOMER_NAME], mi email es [EMAIL] y mi teléfono es [PHONE]</div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <MetricCard label="Before" value={cleaning?.stats.before || dataset.length} icon={Database} />
          <MetricCard label="After" value={cleaning?.stats.after || 0} icon={CheckCircle2} tone="green" />
        </div>
      </Panel>
    </div>
  )
}

function SmartClassification({ tickets, selectedTicket, setSelectedTicket, actions }) {
  const [category, setCategory] = useState('All')
  const [priority, setPriority] = useState('All')
  const [review, setReview] = useState('All')
  const distribution = categoryDistribution(tickets)
  const chartData = Object.entries(distribution).map(([name, value]) => ({ name, value }))
  const filtered = tickets.filter((ticket) =>
    (category === 'All' || ticket.category === category) &&
    (priority === 'All' || ticket.priority === priority) &&
    (review === 'All' || (review === 'Needs review' ? ticket.needsReview : !ticket.needsReview)),
  )

  return (
    <Panel eyebrow="Explainable AI" title="Smart classification" action={<Button disabled={!tickets.length} onClick={actions.runClassification}><BrainCircuit size={16} /> Run classification</Button>}>
      {!tickets.length ? <EmptyState title="No clean tickets available" text="Load and clean the dataset before running classification." action={<Button onClick={actions.loadDataset}>Load dataset</Button>} /> : (
        <div className="grid gap-5">
          <div className="flex flex-wrap gap-2">
            <SelectFilter label="Category" value={category} onChange={setCategory} options={['All', ...categories]} />
            <SelectFilter label="Priority" value={priority} onChange={setPriority} options={['All', ...priorities]} />
            <SelectFilter label="Review" value={review} onChange={setReview} options={['All', 'Needs review', 'Auto accepted']} />
          </div>
          <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
            <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4"><MiniBarChart data={chartData} /></div>
            <div className="grid gap-3">
              {filtered.map((ticket) => (
                <button key={ticket.id} type="button" onClick={() => setSelectedTicket(ticket)} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-left transition hover:border-cyan-300/30 hover:bg-white/[0.07]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-black text-white">{ticket.id} · {ticket.category}</h3>
                    <div className="flex flex-wrap gap-2"><StatusBadge status={ticket.needsReview ? 'warning' : 'completed'} /><span className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-black text-slate-300">{ticket.priority}</span></div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{ticket.summary}</p>
                  <div className="mt-3"><ConfidenceBar value={ticket.confidence} /></div>
                </button>
              ))}
            </div>
          </div>
          {selectedTicket && <ReasoningPanel ticket={selectedTicket} />}
        </div>
      )}
    </Panel>
  )
}

function SelectFilter({ label, value, onChange, options }) {
  return (
    <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-slate-300">
      <Filter size={15} /> {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="bg-transparent font-bold text-white outline-none">
        {options.map((option) => <option key={option} className="bg-slate-900">{option}</option>)}
      </select>
    </label>
  )
}

function ReasoningPanel({ ticket }) {
  return (
    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
      <h3 className="font-black text-white">Explainability · {ticket.id}</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <p className="text-sm leading-6 text-slate-300"><strong className="text-white">Why this category?</strong><br />Signals: {ticket.reasoningSignals.join(', ')}</p>
        <p className="text-sm leading-6 text-slate-300"><strong className="text-white">Recommended action</strong><br />{ticket.recommendedAction}</p>
      </div>
    </div>
  )
}

function ReviewQueue({ tickets, actions }) {
  const queue = getReviewQueue(tickets)
  const [selectedId, setSelectedId] = useState(queue[0]?.id)
  const selected = queue.find((ticket) => ticket.id === selectedId) || queue[0]
  const [feedback, setFeedback] = useState('')
  const [category, setCategory] = useState(selected?.category || categories[0])
  const [priority, setPriority] = useState(selected?.priority || priorities[0])

  if (!tickets.length) return <EmptyState title="Review queue is locked" text="Run classification first to identify low-confidence and critical cases." />
  if (!queue.length) return <EmptyState title="No tickets waiting for review" text="All low-confidence cases have been reviewed or no review candidates were detected." />

  return (
    <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
      <Panel eyebrow="Human in the loop" title="Review queue">
        <div className="grid gap-3">
          {queue.map((ticket) => (
            <button key={ticket.id} type="button" onClick={() => { setSelectedId(ticket.id); setCategory(ticket.category); setPriority(ticket.priority) }} className={cx('rounded-2xl border p-4 text-left transition', selected?.id === ticket.id ? 'border-cyan-300/40 bg-cyan-300/10' : 'border-white/10 bg-white/[0.045] hover:bg-white/[0.07]')}>
              <p className="font-black text-white">{ticket.id}</p>
              <p className="mt-1 text-sm text-slate-400">{ticket.category} · {ticket.priority}</p>
              <ConfidenceBar value={ticket.confidence} />
            </button>
          ))}
        </div>
      </Panel>
      <Panel eyebrow="Decision panel" title={selected ? selected.id : 'Select a ticket'}>
        {selected && (
          <div className="grid gap-4">
            <p className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm leading-7 text-slate-300">{selected.message}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectFilter label="Category" value={category} onChange={setCategory} options={categories} />
              <SelectFilter label="Priority" value={priority} onChange={setPriority} options={priorities} />
            </div>
            <textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Internal feedback for future model improvement..." className="min-h-28 rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-sm text-white outline-none focus:border-cyan-300" />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => actions.reviewTicket(selected.id, { category, priority, feedback: feedback || 'AI recommendation approved.' })}><CheckCircle2 size={16} /> Approve</Button>
              <Button variant="secondary" onClick={() => actions.reviewTicket(selected.id, { category, priority, feedback: feedback || 'Corrected by reviewer.' })}>Correct</Button>
              <Button variant="secondary" onClick={() => actions.addLog('review', `${selected.id} sent back to analysis`, 'warning')}>Send back to analysis</Button>
            </div>
          </div>
        )}
      </Panel>
    </div>
  )
}

function AgentWorkspace({ tickets, agentResult, actions }) {
  const [task, setTask] = useState(agentTasks[0])
  return (
    <Panel eyebrow="Agent workspace" title="Tool-using AI agent" action={<Button disabled={!tickets.length} onClick={() => actions.runAgentTask(task)}><Bot size={16} /> Run agent</Button>}>
      <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <div>
          <label className="grid gap-2 text-sm font-bold text-slate-300">Task<select value={task} onChange={(event) => setTask(event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-white outline-none">{agentTasks.map((item) => <option key={item}>{item}</option>)}</select></label>
          <div className="mt-5 grid gap-2">{(agentResult?.timeline || ['Waiting for execution']).map((step, index) => <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-sm font-bold text-slate-200">{agentResult ? `${index + 1}. ${step}` : step}</div>)}</div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-3">{(agentResult?.toolCalls || []).map((tool) => <div key={tool.name} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"><div className="flex flex-wrap justify-between gap-2"><p className="font-mono text-sm font-black text-cyan-100">{tool.name}</p><StatusBadge status="completed" /></div><p className="mt-2 text-xs text-slate-400">Input: {tool.input} · Duration: {tool.duration}ms</p><p className="mt-2 text-sm text-slate-300">{tool.output}</p></div>)}</div>
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-100/70">Final output</p>
            <p className="mt-3 text-lg font-black text-white">{agentResult?.output.mainFinding || 'Run the agent to generate an action plan.'}</p>
            {agentResult && <p className="mt-2 text-sm leading-7 text-slate-300">{agentResult.output.businessImpact}</p>}
          </div>
        </div>
      </div>
    </Panel>
  )
}

function KnowledgeAssistant() {
  const [question, setQuestion] = useState(sampleQuestions[0])
  const [answer, setAnswer] = useState(() => askKnowledgeAssistant(sampleQuestions[0]))
  return (
    <Panel eyebrow="RAG-style assistant" title="Knowledge Assistant" action={<Button onClick={() => setAnswer(askKnowledgeAssistant(question))}><Search size={16} /> Ask</Button>}>
      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="grid gap-3">
          <textarea value={question} onChange={(event) => setQuestion(event.target.value)} className="min-h-32 rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-sm leading-6 text-white outline-none focus:border-cyan-300" />
          {sampleQuestions.map((sample) => <button key={sample} type="button" onClick={() => setQuestion(sample)} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-left text-sm font-bold text-slate-300 hover:bg-white/[0.07]">{sample}</button>)}
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100/70">Answer with sources</p>
          <p className="mt-3 leading-7 text-slate-100">{answer.answer}</p>
          <p className="mt-3 text-sm font-bold text-emerald-200">Confidence: {answer.confidence}%</p>
          <div className="mt-4 grid gap-3">{answer.sources.map((source) => <div key={source.id} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4"><p className="font-black text-white">{source.title}</p><p className="mt-2 text-sm leading-6 text-slate-400">{source.content}</p></div>)}</div>
          <p className="mt-4 text-xs leading-5 text-slate-500">{answer.limitations}</p>
        </div>
      </div>
    </Panel>
  )
}

function EvaluationLab({ evaluation, actions }) {
  const [selectedId, setSelectedId] = useState(evaluation?.tests?.[0]?.id)
  const tests = evaluation?.tests || []
  const selected = tests.find((test) => test.id === selectedId) || tests[0]
  return (
    <Panel eyebrow="Validation" title="Evaluation Lab" action={<Button onClick={actions.runEvaluation}><ShieldCheck size={16} /> Run evaluation suite</Button>}>
      {evaluation ? (
        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            <MetricCard label="Accuracy" value={`${evaluation.metrics.accuracy}%`} icon={Gauge} />
            <MetricCard label="Privacy" value={`${evaluation.metrics.privacyScore}%`} icon={LockKeyhole} tone="green" />
            <MetricCard label="Hallucination" value={`${evaluation.metrics.hallucinationRisk}%`} icon={BrainCircuit} tone="amber" />
            <MetricCard label="Review rate" value={`${evaluation.metrics.humanReviewRate}%`} icon={UserCheck} />
            <MetricCard label="Failed" value={evaluation.metrics.failedCases} icon={AlertTriangle} tone="amber" />
            <MetricCard label="Safety" value={`${evaluation.metrics.safetyScore}%`} icon={ShieldCheck} tone="green" />
          </div>
          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-2">{tests.map((test) => <button key={test.id} type="button" onClick={() => setSelectedId(test.id)} className={cx('rounded-2xl border p-4 text-left', selected?.id === test.id ? 'border-cyan-300/40 bg-cyan-300/10' : 'border-white/10 bg-white/[0.045]')}><div className="flex justify-between gap-2"><span className="font-black text-white">{test.name}</span><StatusBadge status={test.status === 'passed' ? 'completed' : test.status} /></div></button>)}</div>
            {selected && <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-5 text-sm leading-7 text-slate-300"><p><strong className="text-white">Input:</strong> {selected.input}</p><p><strong className="text-white">Expected:</strong> {selected.expected}</p><p><strong className="text-white">Actual:</strong> {selected.actual}</p><p className="mt-2 text-slate-400">{selected.notes}</p></div>}
          </div>
        </div>
      ) : <EmptyState title="Evaluation has not run yet" text="Run the validation suite to inspect accuracy, privacy, hallucination and safety metrics." />}
    </Panel>
  )
}

function ReportCenter({ report, actions }) {
  const text = report ? JSON.stringify(report, null, 2) : ''
  function exportJson() {
    if (!report) return
    const blob = new Blob([text], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ai-support-report.json'
    link.click()
    URL.revokeObjectURL(url)
  }
  return (
    <Panel eyebrow="Reports" title="Executive report center" action={<div className="flex flex-wrap gap-2"><Button onClick={actions.generateReport}><FileText size={16} /> Generate executive report</Button><Button disabled={!report} variant="secondary" onClick={() => navigator.clipboard?.writeText(text)}><Copy size={16} /> Copy report</Button><Button disabled={!report} variant="secondary" onClick={exportJson}><Download size={16} /> Export JSON</Button></div>}>
      {report ? <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]"><div className="grid gap-3"><MetricCard label="Status" value={report.reportStatus} icon={CheckCircle2} tone="green" /><MetricCard label="Tickets" value={report.totalTicketsAnalyzed} icon={Database} /><MetricCard label="Score" value={`${report.evaluationScore || 0}%`} icon={ShieldCheck} /></div><pre className="max-h-[38rem] overflow-auto rounded-2xl border border-white/10 bg-slate-950/65 p-4 text-xs leading-6 text-slate-200">{text}</pre></div> : <EmptyState title="No report generated" text="Generate the executive report after running the AI workflow." />}
    </Panel>
  )
}

function TechnicalArchitecture() {
  const badges = ['React', 'JavaScript', 'TypeScript-ready', 'Python-ready', 'FastAPI-ready', 'Pandas-ready', 'AI Agents', 'RAG', 'Model Evaluation', 'Privacy Masking', 'Human in the Loop', 'Docker-ready']
  return (
    <Panel eyebrow="Architecture" title="Full-stack-ready AI architecture">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-3">
          {['React Frontend', 'Local AI Simulation Layer', 'Data Processing Services', 'Classification Engine', 'Agent Engine', 'Evaluation Engine', 'Future FastAPI Backend'].map((node, index) => <div key={node} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-4"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300/15 text-xs font-black text-cyan-100">{index + 1}</span><span className="font-black text-white">{node}</span></div>)}
        </div>
        <div>
          <div className="mb-4 flex flex-wrap gap-2">{badges.map((badge) => <span key={badge} className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs font-black text-slate-200">{badge}</span>)}</div>
          <pre className="overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs leading-6 text-slate-200">{`const evaluationTest = {
  input: "customer cannot access account",
  expected: "Account Access + escalation",
  actual: classifier.predict(ticket),
  assert: output => output.category === "Account Access"
}

const agentToolCall = {
  tool: "filterByPriority",
  input: { priority: "Critical" },
  output: urgentTickets
}`}</pre>
        </div>
      </div>
    </Panel>
  )
}

function RecruiterSummary() {
  const skills = ['AI workflow design', 'Data cleaning', 'Privacy-aware processing', 'Ticket classification', 'Human in the Loop', 'AI agents with tool calls', 'Knowledge assistant / RAG-style flow', 'Model evaluation', 'Report generation', 'Product UI/UX', 'Full-stack-ready architecture']
  return (
    <div className="grid gap-5">
      <Panel eyebrow="Recruiter view" title="What this project demonstrates">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{skills.map((skill) => <div key={skill} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4"><CheckCircle2 className="mb-3 text-emerald-300" size={18} /><p className="font-bold text-white">{skill}</p></div>)}</div>
      </Panel>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel eyebrow="Business value" title="Why this matters in a real company"><ul className="grid gap-2 text-sm leading-7 text-slate-300">{['Reduces manual triage work', 'Helps support teams prioritize incidents', 'Protects sensitive data before AI processing', 'Keeps humans in control', 'Validates outputs before trusting automation', 'Produces reports for decision makers'].map((item) => <li key={item}>• {item}</li>)}</ul></Panel>
        <Panel eyebrow="Role mapping" title="How this maps to an AI engineering role"><ul className="grid gap-2 text-sm leading-7 text-slate-300">{['Python programming and service integration', 'AI integration and agent workflows', 'Data preparation and privacy masking', 'Testing, validation and evaluation strategy', 'Technical documentation and team collaboration'].map((item) => <li key={item}>• {item}</li>)}</ul></Panel>
      </div>
    </div>
  )
}

function AISupportIntelligencePage() {
  usePageTitle('AI Support Intelligence Platform | Alex Gómez')
  const [active, setActive] = useState('mission')
  const [menuOpen, setMenuOpen] = useState(false)
  const [dataset, setDataset] = useState([])
  const [cleaning, setCleaning] = useState(null)
  const [classifiedTickets, setClassifiedTickets] = useState([])
  const [agentResult, setAgentResult] = useState(null)
  const [evaluation, setEvaluation] = useState(null)
  const [report, setReport] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [logs, setLogs] = useState([createLog('system', 'AI Support Intelligence initialized in local demo mode')])

  const progress = {
    datasetLoaded: dataset.length > 0,
    cleaningCompleted: Boolean(cleaning),
    classificationCompleted: classifiedTickets.length > 0,
    reviewCompleted: classifiedTickets.length > 0 && reviewMetrics(classifiedTickets).queued === 0,
    agentCompleted: Boolean(agentResult),
    evaluationCompleted: Boolean(evaluation),
    reportGenerated: Boolean(report),
  }
  const activeLabel = navItems.find(([id]) => id === active)?.[1] || 'Mission Control'
  const review = reviewMetrics(classifiedTickets)
  const metrics = {
    highPriority: classifiedTickets.filter((ticket) => ['High', 'Critical'].includes(ticket.priority)).length,
    avgConfidence: classifiedTickets.length ? Math.round(classifiedTickets.reduce((sum, ticket) => sum + ticket.confidence, 0) / classifiedTickets.length) : 0,
    privacyRisks: cleaning ? cleaning.stats.privacy.names + cleaning.stats.privacy.emails + cleaning.stats.privacy.phones : 0,
    evaluationScore: evaluation?.metrics.safetyScore || 0,
    estimatedTokens: classifiedTickets.length ? classifiedTickets.length * 420 : 0,
    estimatedCost: classifiedTickets.length ? (classifiedTickets.length * 0.004).toFixed(2) : '0.00',
    toolCalls: agentResult?.toolCalls.length || 0,
  }

  function addLog(module, message, type = 'info') {
    setLogs((current) => [createLog(module, message, type), ...current].slice(0, 24))
  }
  function loadDataset() {
    setDataset(supportTickets)
    setCleaning(null); setClassifiedTickets([]); setAgentResult(null); setEvaluation(null); setReport(null)
    addLog('dataset', `Dataset loaded with ${supportTickets.length} tickets`, 'success')
  }
  function resetDataset() {
    setDataset([]); setCleaning(null); setClassifiedTickets([]); setAgentResult(null); setEvaluation(null); setReport(null); setSelectedTicket(null)
    addLog('system', 'Demo reset completed', 'info')
  }
  function runCleaning() {
    const result = runCleaningPipeline(dataset.length ? dataset : supportTickets)
    setDataset(result.tickets); setCleaning(result)
    addLog('privacy', `Privacy engine masked ${result.stats.privacy.names + result.stats.privacy.emails + result.stats.privacy.phones} sensitive entities`, 'success')
  }
  function runClassification() {
    const source = cleaning?.tickets || dataset
    const result = classifyTickets(source.length ? source : supportTickets)
    setClassifiedTickets(result)
    const avg = Math.round(result.reduce((sum, ticket) => sum + ticket.confidence, 0) / result.length)
    addLog('classification', `Classification completed with ${avg}% average confidence`, 'success')
    addLog('review', `${getReviewQueue(result).length} tickets sent to human review`, 'warning')
  }
  function reviewTicket(id, patch) {
    setClassifiedTickets((current) => applyHumanReview(current, id, patch))
    addLog('review', `${id} reviewed. Model improvement signal captured`, 'success')
  }
  function runAgentTask(task) {
    const result = runAgent(task, classifiedTickets.length ? classifiedTickets : classifyTickets(dataset))
    setAgentResult(result)
    addLog('agent', `Agent used ${result.toolCalls.length} tools to complete: ${task}`, 'success')
  }
  function runEvaluation() {
    const result = runEvaluationSuite(review.reviewRate)
    setEvaluation(result)
    addLog('evaluation', `Evaluation suite completed: ${result.tests.filter((test) => test.status === 'passed').length}/${result.tests.length} tests passed`, 'success')
  }
  function generateReport() {
    const result = generateExecutiveReport({ tickets: classifiedTickets, cleaning, review, agent: agentResult, evaluation })
    setReport(result)
    addLog('report', 'Executive report generated', 'success')
  }
  function runFullDemo() {
    const clean = runCleaningPipeline(supportTickets)
    const classified = classifyTickets(clean.tickets)
    const reviewed = applyHumanReview(classified, getReviewQueue(classified)[0]?.id, { feedback: 'Approved during full demo run.' })
    const agent = runAgent('Prepare manager briefing', reviewed)
    const evalResult = runEvaluationSuite(reviewMetrics(reviewed).reviewRate)
    const reportResult = generateExecutiveReport({ tickets: reviewed, cleaning: clean, review: reviewMetrics(reviewed), agent, evaluation: evalResult })
    setDataset(clean.tickets); setCleaning(clean); setClassifiedTickets(reviewed); setAgentResult(agent); setEvaluation(evalResult); setReport(reportResult)
    setLogs([
      createLog('report', 'Executive report generated', 'success'),
      createLog('evaluation', 'Evaluation suite completed: 7/8 tests passed', 'success'),
      createLog('agent', `Agent used ${agent.toolCalls.length} tools to generate manager briefing`, 'success'),
      createLog('review', 'Human review signal captured for low-confidence ticket', 'success'),
      createLog('classification', 'Classification completed with local deterministic model', 'success'),
      createLog('privacy', `Privacy engine masked ${clean.stats.privacy.names + clean.stats.privacy.emails + clean.stats.privacy.phones} sensitive entities`, 'success'),
      createLog('dataset', `Dataset loaded with ${supportTickets.length} tickets`, 'success'),
    ])
    setActive('mission')
  }

  const actions = { loadDataset, resetDataset, runCleaning, runClassification, reviewTicket, runAgentTask, runEvaluation, generateReport, runFullDemo, addLog }
  const ticketsForModel = classifiedTickets.length ? classifiedTickets : dataset
  const content = {
    mission: <MissionControl state={{ dataset, classifiedTickets, progress }} actions={actions} metrics={metrics} />,
    dataset: <DatasetIntake dataset={dataset} actions={actions} selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket} />,
    cleaning: <CleaningPrivacyPipeline dataset={dataset} cleaning={cleaning} actions={actions} />,
    classification: <SmartClassification tickets={ticketsForModel} selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket} actions={actions} />,
    review: <ReviewQueue tickets={classifiedTickets} actions={actions} />,
    agent: <AgentWorkspace tickets={classifiedTickets} agentResult={agentResult} actions={actions} />,
    knowledge: <KnowledgeAssistant />,
    evaluation: <EvaluationLab evaluation={evaluation} actions={actions} />,
    reports: <ReportCenter report={report} actions={actions} />,
    architecture: <TechnicalArchitecture />,
    recruiter: <RecruiterSummary />,
  }

  return (
    <main className="ai-support-app min-h-screen overflow-hidden bg-[#050813] text-white">
      <div className="ai-support-bg" />
      <div className="relative mx-auto grid min-h-screen max-w-[104rem] gap-5 px-4 py-5 lg:grid-cols-[19rem_minmax(0,1fr)_21rem] lg:px-6">
        <Sidebar active={active} setActive={setActive} progress={progress} open={menuOpen} setOpen={setMenuOpen} />
        <section className="min-w-0">
          <Header activeLabel={activeLabel} onReset={resetDataset} onRunFullDemo={runFullDemo} onMenu={() => setMenuOpen(true)} />
          <div className="mt-5">{content[active]}</div>
        </section>
        <ContextPanel active={activeLabel} logs={logs} metrics={metrics} selectedTicket={selectedTicket} agentResult={agentResult} />
      </div>
    </main>
  )
}

export default AISupportIntelligencePage
