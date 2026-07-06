import {
  Activity,
  BarChart3,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  Code2,
  Copy,
  Database,
  Download,
  FileText,
  Filter,
  Gauge,
  Layers3,
  Play,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Wand2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { agentTasks, runAgentTask } from './agentEngine'
import { classifyTickets, getCategoryDistribution } from './classificationEngine'
import { cleaningSteps, runCleaningPipeline } from './cleaningEngine'
import { runEvaluation } from './evaluationEngine'
import { askKnowledgeBase, knowledgeDocuments } from './knowledgeBase'
import { generateReport } from './reportEngine'
import { sampleTickets } from './sampleTickets'
import usePageTitle from '../../hooks/usePageTitle'

const sections = [
  ['overview', 'Overview', BarChart3],
  ['dataset', 'Dataset', Database],
  ['cleaning', 'Cleaning', Wand2],
  ['classifier', 'Classifier', BrainCircuit],
  ['agent', 'Agent Runner', Bot],
  ['knowledge', 'Knowledge', Search],
  ['evaluation', 'Evaluation', ShieldCheck],
  ['report', 'Report', FileText],
  ['docs', 'Docs', Code2],
]

const pipeline = ['Data Ingestion', 'Cleaning', 'Classification', 'Agent', 'Evaluation', 'Report']
const statusStyles = {
  Completed: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-100',
  Running: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-100',
  Warning: 'border-amber-400/25 bg-amber-400/10 text-amber-100',
  Failed: 'border-red-400/25 bg-red-400/10 text-red-100',
  Open: 'border-slate-400/25 bg-slate-400/10 text-slate-200',
  New: 'border-blue-400/25 bg-blue-400/10 text-blue-100',
  Escalated: 'border-red-400/25 bg-red-400/10 text-red-100',
  Investigating: 'border-amber-400/25 bg-amber-400/10 text-amber-100',
  Duplicate: 'border-violet-400/25 bg-violet-400/10 text-violet-100',
}
const chartColors = ['#38bdf8', '#34d399', '#f59e0b', '#a78bfa', '#fb7185']

function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

function StatusBadge({ status }) {
  return (
    <span className={cx('inline-flex rounded-full border px-2.5 py-1 text-xs font-black', statusStyles[status] || statusStyles.Open)}>
      {status}
    </span>
  )
}

function MetricCard({ label, value, icon: Icon, tone = 'cyan' }) {
  const toneClass = tone === 'green' ? 'from-emerald-400/18' : tone === 'amber' ? 'from-amber-400/18' : 'from-cyan-400/18'
  return (
    <article className={cx('rounded-3xl border border-white/10 bg-gradient-to-br to-white/[0.035] p-4 shadow-xl shadow-black/15', toneClass)}>
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

function Panel({ title, eyebrow, children, className = '', action }) {
  return (
    <section className={cx('rounded-[1.75rem] border border-white/10 bg-[#111827]/78 p-5 shadow-2xl shadow-black/20 backdrop-blur', className)}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          {eyebrow && <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200/70">{eyebrow}</p>}
          <h2 className="mt-1 text-xl font-black tracking-tight text-white">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function ActionButton({ children, onClick, disabled = false, variant = 'primary' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-55',
        variant === 'primary'
          ? 'bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/15 hover:bg-cyan-200'
          : 'border border-white/10 bg-white/[0.055] text-slate-100 hover:bg-white/[0.09]',
      )}
    >
      {children}
    </button>
  )
}

function TicketTable({ tickets }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-[760px] w-full text-left text-sm">
        <thead className="bg-white/[0.055] text-xs uppercase tracking-[0.14em] text-slate-400">
          <tr>
            {['id', 'customer', 'message', 'channel', 'date', 'status'].map((head) => (
              <th key={head} className="px-4 py-3 font-black">{head}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="align-top text-slate-300">
              <td className="px-4 py-3 font-bold text-white">{ticket.id}</td>
              <td className="px-4 py-3">{ticket.customer || 'Missing'}</td>
              <td className="max-w-[24rem] px-4 py-3 leading-6">{ticket.message}</td>
              <td className="px-4 py-3">{ticket.channel || 'Missing'}</td>
              <td className="px-4 py-3">{ticket.date}</td>
              <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PipelineVisual({ completed = 0 }) {
  return (
    <div className="grid gap-3 md:grid-cols-6">
      {pipeline.map((node, index) => (
        <div key={node} className="relative">
          <div className={cx('rounded-2xl border p-3 text-center transition', index <= completed ? 'border-cyan-300/35 bg-cyan-300/10 text-cyan-100' : 'border-white/10 bg-white/[0.045] text-slate-400')}>
            <span className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-xs font-black">{index + 1}</span>
            <p className="text-xs font-black">{node}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function ActivityLog({ logs }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 font-mono text-xs text-slate-300">
      <div className="mb-3 flex items-center gap-2 text-cyan-200">
        <TerminalSquare size={16} />
        ops.log
      </div>
      <div className="grid gap-2">
        {logs.map((log) => (
          <p key={log} className="leading-5"><span className="text-emerald-300">&gt;</span> {log}</p>
        ))}
      </div>
    </div>
  )
}

function OverviewDashboard({ tickets, classifiedTickets, cleaned, evaluation }) {
  const highPriority = classifiedTickets.filter((ticket) => ticket.priority === 'High').length
  const accuracy = evaluation?.metrics.accuracy || 0
  const automationScore = cleaned ? 87 : 42

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Tickets processed" value={tickets.length} icon={Database} />
        <MetricCard label="Accuracy" value={`${accuracy || 76}%`} icon={Gauge} tone="green" />
        <MetricCard label="High priority" value={highPriority} icon={Activity} tone="amber" />
        <MetricCard label="Avg response" value="1.8s" icon={Sparkles} />
        <MetricCard label="Automation score" value={`${automationScore}%`} icon={Bot} tone="green" />
      </div>
      <Panel title="AI operations pipeline" eyebrow="Workflow">
        <PipelineVisual completed={cleaned ? 5 : 1} />
      </Panel>
      <Panel title="Recent activity" eyebrow="Live trace">
        <ActivityLog logs={[
          'Demo workspace initialized with local mock data.',
          `${tickets.length} ticket rows available for processing.`,
          cleaned ? 'Cleaning pipeline completed and PII masking enabled.' : 'Waiting for cleaning pipeline execution.',
          classifiedTickets.length ? 'Classifier output ready for agent tools.' : 'Classifier has not run yet.',
        ]} />
      </Panel>
    </div>
  )
}

function DatasetWorkspace({ tickets, onLoad, onReset }) {
  return (
    <div className="grid gap-5">
      <Panel
        title="Dataset workspace"
        eyebrow="Business tickets"
        action={(
          <div className="flex flex-wrap gap-2">
            <ActionButton onClick={onLoad}><Database size={16} /> Load demo dataset</ActionButton>
            <ActionButton onClick={onReset} variant="secondary"><RefreshCcw size={16} /> Reset dataset</ActionButton>
          </div>
        )}
      >
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <MetricCard label="Rows" value={tickets.length} icon={Database} />
          <MetricCard label="Channels" value={new Set(tickets.map((ticket) => ticket.channel || 'Missing')).size} icon={Layers3} />
          <MetricCard label="Needs cleaning" value={tickets.some((ticket) => !ticket.customer || !ticket.channel) ? 'Yes' : 'No'} icon={Wand2} tone="amber" />
        </div>
        {tickets.length ? <TicketTable tickets={tickets} /> : <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-slate-400">Load the demo dataset to begin.</p>}
      </Panel>
    </div>
  )
}

function CleaningPipeline({ tickets, result, onRun }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <Panel title="Cleaning pipeline" eyebrow="Data preparation" action={<ActionButton disabled={!tickets.length} onClick={onRun}><Play size={16} /> Run cleaning</ActionButton>}>
        <div className="grid gap-3">
          {cleaningSteps.map((step, index) => (
            <div key={step.id} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300/15 text-sm font-black text-cyan-100">{index + 1}</span>
                <h3 className="font-black text-white">{step.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Before / after" eyebrow="Execution log">
        <div className="mb-4 grid grid-cols-2 gap-3">
          <MetricCard label="Before" value={result?.stats.before || tickets.length} icon={Database} />
          <MetricCard label="After" value={result?.stats.after || 0} icon={CheckCircle2} tone="green" />
        </div>
        <ActivityLog logs={result?.logs || ['Pipeline waiting for execution.']} />
      </Panel>
    </div>
  )
}

function Classifier({ tickets }) {
  const [category, setCategory] = useState('All')
  const [priority, setPriority] = useState('All')
  const distribution = getCategoryDistribution(tickets)
  const chartData = Object.entries(distribution).map(([name, value]) => ({ name, value }))
  const filtered = tickets.filter((ticket) => (category === 'All' || ticket.category === category) && (priority === 'All' || ticket.priority === priority))

  return (
    <div className="grid gap-5">
      <Panel title="Smart ticket classifier" eyebrow="Rule-based local model">
        <div className="mb-4 flex flex-wrap gap-3">
          <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-slate-300">
            <Filter size={15} /> Category
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="bg-transparent font-bold text-white outline-none">
              {['All', 'Technical Support', 'Billing', 'Bug Report', 'Sales', 'General Question'].map((item) => <option key={item} className="bg-slate-900">{item}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-slate-300">
            Priority
            <select value={priority} onChange={(event) => setPriority(event.target.value)} className="bg-transparent font-bold text-white outline-none">
              {['All', 'Low', 'Medium', 'High'].map((item) => <option key={item} className="bg-slate-900">{item}</option>)}
            </select>
          </label>
        </div>
        <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="h-72 min-w-0 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#fff' }} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-3">
            {filtered.map((ticket) => (
              <article key={ticket.id} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-black text-white">{ticket.id} · {ticket.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={ticket.priority} />
                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-black text-slate-300">{Math.round(ticket.confidence * 100)}%</span>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{ticket.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  )
}

function AgentRunner({ tickets }) {
  const [task, setTask] = useState(agentTasks[0])
  const [result, setResult] = useState(null)

  return (
    <Panel title="AI agent runner" eyebrow="Tool-using workflow" action={<ActionButton disabled={!tickets.length} onClick={() => setResult(runAgentTask(task, tickets))}><Play size={16} /> Run agent</ActionButton>}>
      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div>
          <label className="grid gap-2 text-sm font-bold text-slate-300">
            Agent task
            <select value={task} onChange={(event) => setTask(event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-white outline-none">
              {agentTasks.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <div className="mt-5 grid gap-2">
            {(result?.steps || ['Waiting for execution']).map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-300/15 text-xs font-black text-emerald-100">{result ? index + 1 : '-'}</span>
                <span className="text-sm font-bold text-slate-200">{step}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4">
          <ActivityLog logs={result?.toolCalls || ['Tool calls will appear here after execution.']} />
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100/70">Agent output</p>
            <p className="mt-3 leading-7 text-white">{result?.output || 'Choose a task and run the agent to generate a recommendation.'}</p>
          </div>
        </div>
      </div>
    </Panel>
  )
}

function KnowledgeAssistant() {
  const [question, setQuestion] = useState('How should we handle a failed payment ticket?')
  const [answer, setAnswer] = useState(() => askKnowledgeBase('How should we handle a failed payment ticket?'))

  return (
    <Panel title="Knowledge assistant" eyebrow="RAG-style local retrieval" action={<ActionButton onClick={() => setAnswer(askKnowledgeBase(question))}><Search size={16} /> Ask</ActionButton>}>
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div>
          <textarea value={question} onChange={(event) => setQuestion(event.target.value)} className="min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-sm leading-6 text-white outline-none focus:border-cyan-300" />
          <div className="mt-4 grid gap-3">
            {knowledgeDocuments.map((doc) => (
              <div key={doc.id} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <p className="font-black text-white">{doc.title}</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">{doc.tags.join(' · ')}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100/70">Answer</p>
          <p className="mt-3 leading-7 text-slate-100">{answer.answer}</p>
          <p className="mt-4 text-sm font-bold text-emerald-200">Confidence: {Math.round(answer.confidence * 100)}%</p>
          <div className="mt-5 grid gap-3">
            {answer.sources.map((source) => (
              <div key={source.id} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <p className="font-black text-white">{source.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{source.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  )
}

function EvaluationDashboard({ evaluation, onRun }) {
  return (
    <Panel title="Model evaluation dashboard" eyebrow="Validation suite" action={<ActionButton onClick={onRun}><Play size={16} /> Run evaluation</ActionButton>}>
      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Accuracy" value={`${evaluation?.metrics.accuracy || 0}%`} icon={Gauge} />
        <MetricCard label="Safety score" value={`${evaluation?.metrics.safetyScore || 0}%`} icon={ShieldCheck} tone="green" />
        <MetricCard label="Hallucination risk" value={`${evaluation?.metrics.hallucinationRisk || 0}%`} icon={BrainCircuit} tone="amber" />
        <MetricCard label="Failed cases" value={evaluation?.metrics.failedCases || 0} icon={Activity} tone="amber" />
      </div>
      <div className="grid gap-3">
        {(evaluation?.tests || []).map((test) => (
          <article key={test.id} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-black text-white">{test.id} · {test.question}</h3>
              <StatusBadge status={test.status} />
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-400"><strong className="text-slate-200">Expected:</strong> {test.expected}</p>
            <p className="mt-1 text-sm leading-6 text-slate-400"><strong className="text-slate-200">Answer:</strong> {test.answer}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">{test.notes}</p>
          </article>
        ))}
        {!evaluation && <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-slate-400">Run the evaluation suite to inspect model behavior.</p>}
      </div>
    </Panel>
  )
}

function ReportGenerator({ tickets }) {
  const [report, setReport] = useState(null)
  const reportText = report ? JSON.stringify(report, null, 2) : ''

  function downloadJson() {
    if (!report) return
    const blob = new Blob([reportText], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ai-operations-report.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Panel
      title="Report generator"
      eyebrow="Executive summary"
      action={(
        <div className="flex flex-wrap gap-2">
          <ActionButton disabled={!tickets.length} onClick={() => setReport(generateReport(tickets))}><FileText size={16} /> Generate</ActionButton>
          <ActionButton disabled={!report} onClick={() => navigator.clipboard?.writeText(reportText)} variant="secondary"><Copy size={16} /> Copy</ActionButton>
          <ActionButton disabled={!report} onClick={downloadJson} variant="secondary"><Download size={16} /> JSON</ActionButton>
        </div>
      )}
    >
      {report ? (
        <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-3">
            <MetricCard label="Total tickets" value={report.totalTickets} icon={Database} />
            <MetricCard label="Common category" value={report.mostCommonCategory} icon={BarChart3} />
          </div>
          <pre className="max-h-[34rem] overflow-auto rounded-2xl border border-white/10 bg-slate-950/65 p-4 text-xs leading-6 text-slate-200">{reportText}</pre>
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-slate-400">Generate a report after classification to summarize the workflow.</p>
      )}
    </Panel>
  )
}

function TechnicalDocs() {
  const badges = ['React', 'TypeScript-ready structure', 'Python', 'FastAPI', 'Pandas', 'Docker', 'AI Agents', 'RAG', 'Model Evaluation']
  return (
    <Panel title="Technical documentation" eyebrow="Implementation notes">
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4">
          {[
            ['Architecture', 'React orchestrates local engines for cleaning, classification, agent execution, retrieval and evaluation.'],
            ['Data flow', 'Tickets move from raw dataset to cleaned rows, classified objects, agent context and final report.'],
            ['AI pipeline', 'The current rule-based modules are shaped so a real model API can replace them later.'],
            ['Evaluation strategy', 'The demo includes expected behavior checks, safety notes and hallucination risk metrics.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <h3 className="font-black text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            {badges.map((badge) => <span key={badge} className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs font-black text-slate-200">{badge}</span>)}
          </div>
          <pre className="overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs leading-6 text-slate-200">{`async function classifyTicket(ticket) {
  const cleanText = await cleaningPipeline(ticket)
  const prediction = await aiProvider.classify(cleanText)
  const evaluation = await evaluationSuite.run(prediction)

  return {
    ...prediction,
    validated: evaluation.status === 'Passed'
  }
}`}</pre>
        </div>
      </div>
    </Panel>
  )
}

function AIOperationsStudioPage() {
  usePageTitle('AI Operations Studio | Alex Gómez')
  const [activeSection, setActiveSection] = useState('overview')
  const [tickets, setTickets] = useState(sampleTickets)
  const [cleaningResult, setCleaningResult] = useState(null)
  const [classifiedTickets, setClassifiedTickets] = useState(() => classifyTickets(sampleTickets))
  const [evaluation, setEvaluation] = useState(null)

  const currentTickets = classifiedTickets.length ? classifiedTickets : tickets
  const logs = useMemo(() => [
    'AI provider: local demo mode',
    'No API keys required',
    'Python/FastAPI integration prepared as future backend layer',
  ], [])

  function loadDataset() {
    setTickets(sampleTickets)
    setCleaningResult(null)
    setClassifiedTickets(classifyTickets(sampleTickets))
  }

  function resetDataset() {
    setTickets([])
    setCleaningResult(null)
    setClassifiedTickets([])
    setEvaluation(null)
  }

  function runCleaning() {
    const result = runCleaningPipeline(tickets)
    setCleaningResult(result)
    setTickets(result.tickets)
    setClassifiedTickets(classifyTickets(result.tickets))
  }

  function runEvaluationSuite() {
    setEvaluation(runEvaluation())
  }

  const content = {
    overview: <OverviewDashboard tickets={tickets} classifiedTickets={classifiedTickets} cleaned={Boolean(cleaningResult)} evaluation={evaluation} />,
    dataset: <DatasetWorkspace tickets={tickets} onLoad={loadDataset} onReset={resetDataset} />,
    cleaning: <CleaningPipeline tickets={tickets} result={cleaningResult} onRun={runCleaning} />,
    classifier: <Classifier tickets={currentTickets} />,
    agent: <AgentRunner tickets={currentTickets} />,
    knowledge: <KnowledgeAssistant />,
    evaluation: <EvaluationDashboard evaluation={evaluation} onRun={runEvaluationSuite} />,
    report: <ReportGenerator tickets={currentTickets} />,
    docs: <TechnicalDocs />,
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#060914] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(16,185,129,0.12),transparent_30%),linear-gradient(135deg,#060914,#0b1020_48%,#05070d)]" />
      <div className="relative mx-auto grid min-h-screen max-w-[98rem] gap-5 px-4 py-5 lg:grid-cols-[18rem_minmax(0,1fr)_20rem] lg:px-6">
        <aside className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="mb-5 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100/70">AI demo</p>
            <h1 className="mt-2 text-2xl font-black tracking-tight">AI Operations Studio</h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">Data processing, agents, RAG and model validation in one local demo.</p>
          </div>
          <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {sections.map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSection(id)}
                className={cx('flex min-h-12 items-center gap-3 rounded-2xl px-3 text-left text-sm font-bold transition active:scale-95', activeSection === id ? 'bg-cyan-300 text-slate-950' : 'text-slate-300 hover:bg-white/[0.075] hover:text-white')}
              >
                <Icon size={17} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">
          <div className="mb-5 rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-200/75">Enterprise AI workflow simulation</p>
                <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">AI Operations Studio</h2>
                <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                  Process business tickets, clean data, classify issues, run AI-style agents, retrieve internal knowledge and validate model outputs.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={classifiedTickets.length ? 'Completed' : 'Warning'} />
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-slate-300">Mock data</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-slate-300">API-ready</span>
              </div>
            </div>
          </div>
          {content[activeSection]}
        </section>

        <aside className="grid h-fit gap-5 rounded-[2rem] border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/20 backdrop-blur">
          <Panel title="Technical logs" eyebrow="Runtime">
            <ActivityLog logs={logs} />
          </Panel>
          <Panel title="Integration notes" eyebrow="Future API">
            <div className="space-y-3 text-sm leading-6 text-slate-400">
              <p>Real AI providers can replace local engines through a backend service layer.</p>
              <p>Python/FastAPI + Pandas would handle heavier cleaning, embeddings and evaluation jobs.</p>
              <p>No secrets or external calls are required in this demo version.</p>
            </div>
          </Panel>
        </aside>
      </div>
    </main>
  )
}

export default AIOperationsStudioPage
