import {
  Activity,
  AlertTriangle,
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
  Gauge,
  GitBranch,
  HelpCircle,
  Layers3,
  LockKeyhole,
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
import { agentTasks, runAgent } from './agentEngine'
import { categories, createLog, pipelineStages, priorities } from './aiOpsTypes'
import { categoryDistribution, classifyTickets } from './classificationEngine'
import { cleaningSteps, inspectDataset, runCleaningPipeline } from './cleaningEngine'
import { runEvaluationSuite } from './evaluationEngine'
import { askKnowledgeAssistant, knowledgeDocs, sampleQuestions } from './knowledgeBase'
import { generateExecutiveReport } from './reportEngine'
import { applyHumanReview, getReviewQueue, reviewMetrics } from './reviewEngine'
import { supportTickets } from './sampleTickets'
import usePageTitle from '../../hooks/usePageTitle'

const navItems = [
  ['mission', 'Mission', Gauge],
  ['dataset', 'Dataset', Database],
  ['cleaning', 'Privacy', LockKeyhole],
  ['classification', 'Classify', BrainCircuit],
  ['review', 'Review', UserCheck],
  ['agent', 'Agent', Bot],
  ['knowledge', 'Knowledge', Search],
  ['evaluation', 'QA Lab', ShieldCheck],
  ['reports', 'Reports', FileText],
  ['architecture', 'Blueprint', GitBranch],
  ['recruiter', 'Impact', ClipboardCheck],
]

const sectionTitles = {
  mission: 'Mission Control',
  dataset: 'Data Intake Console',
  cleaning: 'Privacy Processing Engine',
  classification: 'AI Classification Desk',
  review: 'Human Validation Board',
  agent: 'Agent Operations Console',
  knowledge: 'Knowledge Retrieval System',
  evaluation: 'Model QA Laboratory',
  reports: 'Executive Briefing Room',
  architecture: 'System Blueprint',
  recruiter: 'Technical Impact Brief',
}

function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

function CommandButton({ children, onClick, disabled = false, variant = 'primary', className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx('ai-command-button', `ai-command-button--${variant}`, className)}
    >
      {children}
    </button>
  )
}

function StatusPill({ status = 'pending' }) {
  return <span className={cx('ai-status-pill', `is-${String(status).toLowerCase()}`)}>{status}</span>
}

function Meter({ value = 0, label, tone = 'cyan' }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0))
  return (
    <div className="ai-meter">
      <div className="ai-meter__top">
        <span>{label}</span>
        <strong>{safeValue}%</strong>
      </div>
      <div className="ai-meter__track">
        <span className={`ai-meter__fill ai-meter__fill--${tone}`} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  )
}

function EmptyConsole({ title, text, action }) {
  return (
    <div className="ai-empty-console">
      <Sparkles size={24} />
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  )
}

function OperationsTopBar({ active, progress, metrics, onRunFullDemo, onReset }) {
  const completed = Object.values(progress).filter(Boolean).length
  return (
    <header className="ai-ops-topbar">
      <div className="ai-ops-brand">
        <span className="ai-live-dot" />
        <div>
          <p>AI Support Command Center</p>
          <h1>{sectionTitles[active]}</h1>
        </div>
      </div>
      <div className="ai-ops-strip" aria-label="System telemetry">
        <span>DEMO MODE</span>
        <span>{completed}/7 stages</span>
        <span>{metrics.avgConfidence}% avg confidence</span>
        <span>${metrics.estimatedCost} est. cost</span>
      </div>
      <div className="ai-ops-actions">
        <CommandButton onClick={onRunFullDemo}>
          <Play size={15} />
          Run full operation
        </CommandButton>
        <CommandButton variant="ghost" onClick={onReset}>
          <RefreshCcw size={15} />
          Reset
        </CommandButton>
      </div>
    </header>
  )
}

function CommandRail({ active, setActive, progress }) {
  return (
    <nav className="ai-command-rail" aria-label="AI Support modules">
      <div className="ai-rail-mark">
        <BrainCircuit size={22} />
      </div>
      <div className="ai-rail-items">
        {navItems.map(([id, label, Icon], index) => {
          const stage = pipelineStages[index - 1]?.[0]
          const completed = stage ? progress[stage] : false
          return (
            <button
              key={id}
              type="button"
              title={sectionTitles[id]}
              aria-label={sectionTitles[id]}
              onClick={() => setActive(id)}
              className={cx('ai-rail-button', active === id && 'is-active', completed && 'is-complete')}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function LiveConsolePanel({ logs, active, metrics, agentResult }) {
  const latest = logs[0]
  return (
    <aside className="ai-live-console">
      <div className="ai-console-head">
        <div>
          <p>Live Operations Console</p>
          <h2>Runtime trace</h2>
        </div>
        <span className="ai-console-live">LIVE</span>
      </div>
      <div className="ai-console-feature">
        <span>latest event</span>
        <strong>{latest?.message || 'System waiting for operation.'}</strong>
      </div>
      <div className="ai-console-telemetry">
        <div><span>module</span><strong>{active}</strong></div>
        <div><span>latency</span><strong>1.4s</strong></div>
        <div><span>tokens</span><strong>{metrics.estimatedTokens}</strong></div>
        <div><span>tools</span><strong>{metrics.toolCalls}</strong></div>
      </div>
      <div className="ai-console-stream">
        {logs.map((log) => (
          <div key={log.id} className={`ai-console-line is-${log.type}`}>
            <span className="ai-console-time">[{log.time}]</span>
            <span className="ai-console-module">[{log.module.toUpperCase()}]</span>
            <span>{log.message}</span>
          </div>
        ))}
      </div>
      {agentResult && (
        <div className="ai-console-agent">
          <span>agent briefing</span>
          <p>{agentResult.output.mainFinding}</p>
        </div>
      )}
    </aside>
  )
}

function OperationNode({ label, status, index, icon: Icon = CheckCircle2 }) {
  return (
    <div className={cx('ai-operation-node', `is-${status}`)}>
      <span className="ai-operation-node__index">{index}</span>
      <Icon size={18} />
      <strong>{label}</strong>
      <small>{status}</small>
    </div>
  )
}

function PipelineSystemMap({ progress }) {
  const nodes = [
    ['Dataset Intake', progress.datasetLoaded, Database],
    ['Privacy Masking', progress.cleaningCompleted, LockKeyhole],
    ['Classification', progress.classificationCompleted, BrainCircuit],
    ['Human Review', progress.reviewCompleted, UserCheck],
    ['Agent Run', progress.agentCompleted, Bot],
    ['Evaluation', progress.evaluationCompleted, ShieldCheck],
    ['Report', progress.reportGenerated, FileText],
  ]
  return (
    <div className="ai-pipeline-map">
      {nodes.map(([label, complete, Icon], index) => (
        <OperationNode
          key={label}
          label={label}
          index={index + 1}
          icon={Icon}
          status={complete ? 'completed' : index === 0 ? 'active' : 'pending'}
        />
      ))}
    </div>
  )
}

function Instrument({ label, value, detail, tone = 'cyan', icon: Icon = Activity }) {
  return (
    <div className={`ai-instrument ai-instrument--${tone}`}>
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  )
}

function DistributionBars({ tickets }) {
  const distribution = categoryDistribution(tickets)
  const entries = Object.entries(distribution)
  const max = Math.max(...entries.map(([, value]) => value), 1)
  if (!entries.length) return <EmptyConsole title="No clusters yet" text="Run classification to build category intelligence." />
  return (
    <div className="ai-distribution">
      {entries.map(([label, value]) => (
        <div key={label} className="ai-distribution__row">
          <span>{label}</span>
          <div><i style={{ width: `${(value / max) * 100}%` }} /></div>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  )
}

function MissionControl({ dataset, classifiedTickets, progress, metrics, actions }) {
  const intelligence = classifiedTickets.length
    ? `${metrics.highPriority} high-impact cases detected with ${metrics.avgConfidence}% average confidence.`
    : dataset.length
      ? 'Dataset is loaded. Privacy masking and classification are ready to run.'
      : 'System is idle. Load the demo dataset or run the full operation.'

  return (
    <section className="ai-workspace ai-workspace--mission">
      <div className="ai-workspace-hero">
        <div>
          <p className="ai-kicker">Mission Control</p>
          <h2>Support operations command map</h2>
          <p>{intelligence}</p>
        </div>
        <div className="ai-action-cluster">
          <CommandButton onClick={actions.runFullDemo}><Play size={15} /> Run full operation</CommandButton>
          <CommandButton variant="secondary" onClick={actions.loadDataset}><Database size={15} /> Load dataset</CommandButton>
        </div>
      </div>
      <PipelineSystemMap progress={progress} />
      <div className="ai-command-grid ai-command-grid--mission">
        <div className="ai-intelligence-panel">
          <h3>Current intelligence</h3>
          <div className="ai-orbit-metrics">
            <Instrument label="Processed" value={dataset.length} detail="tickets" icon={Database} />
            <Instrument label="High priority" value={metrics.highPriority} tone="amber" icon={AlertTriangle} />
            <Instrument label="Privacy masked" value={metrics.privacyRisks} tone="green" icon={LockKeyhole} />
            <Instrument label="Evaluation" value={`${metrics.evaluationScore}%`} tone="violet" icon={ShieldCheck} />
          </div>
        </div>
        <div className="ai-system-health">
          <h3>System health</h3>
          <Meter label="Automation score" value={progress.reportGenerated ? 94 : progress.classificationCompleted ? 72 : 28} />
          <Meter label="Privacy readiness" value={progress.cleaningCompleted ? 96 : 24} tone="green" />
          <Meter label="Human review coverage" value={progress.reviewCompleted ? 100 : metrics.reviewRate || 0} tone="violet" />
        </div>
        <div className="ai-intelligence-panel">
          <h3>Issue clusters</h3>
          <DistributionBars tickets={classifiedTickets} />
        </div>
      </div>
    </section>
  )
}

function DataInspector({ ticket, onClose }) {
  if (!ticket) return null
  return (
    <div className="ai-ticket-inspector">
      <div className="ai-inspector-head">
        <div>
          <span>raw payload</span>
          <h3>{ticket.id}</h3>
        </div>
        <button type="button" onClick={onClose} aria-label="Close ticket inspector"><X size={16} /></button>
      </div>
      <dl>
        <div><dt>Customer</dt><dd>{ticket.customerName || 'Missing'}</dd></div>
        <div><dt>Channel</dt><dd>{ticket.channel || 'missing'}</dd></div>
        <div><dt>Email</dt><dd>{ticket.email || 'missing'}</dd></div>
        <div><dt>Phone</dt><dd>{ticket.phone || 'missing'}</dd></div>
      </dl>
      <pre>{JSON.stringify(ticket, null, 2)}</pre>
    </div>
  )
}

function DatasetConsole({ dataset, selectedTicket, setSelectedTicket, actions }) {
  const summary = inspectDataset(dataset)
  return (
    <section className="ai-workspace">
      <div className="ai-section-head">
        <div>
          <p className="ai-kicker">Data Intake Console</p>
          <h2>Ticket stream scanner</h2>
          <p>Inspect raw customer messages, channel mix, missing fields and privacy risk before AI processing.</p>
        </div>
        <div className="ai-action-cluster">
          <CommandButton onClick={actions.loadDataset}><Database size={15} /> Load demo dataset</CommandButton>
          <CommandButton variant="ghost" onClick={actions.resetDataset}><RefreshCcw size={15} /> Reset</CommandButton>
        </div>
      </div>
      <div className="ai-scanner-strip">
        <Instrument label="Records" value={summary.totalRows} icon={Database} />
        <Instrument label="Duplicates" value={summary.duplicatedRows} tone="amber" icon={Copy} />
        <Instrument label="Missing fields" value={summary.missingFields} tone="amber" icon={HelpCircle} />
        <Instrument label="Sensitive entities" value={summary.sensitiveData.names + summary.sensitiveData.emails + summary.sensitiveData.phones} tone="green" icon={LockKeyhole} />
        <Instrument label="Channels" value={summary.channels.length} icon={Layers3} />
      </div>
      <div className="ai-data-console-layout">
        <div className="ai-data-grid">
          {dataset.length ? dataset.map((ticket) => (
            <button key={ticket.id} type="button" onClick={() => setSelectedTicket(ticket)} className={cx('ai-data-row', selectedTicket?.id === ticket.id && 'is-selected')}>
              <span>{ticket.id}</span>
              <strong>{ticket.customerName || 'Missing customer'}</strong>
              <em>{ticket.channel || 'missing'}</em>
              <p>{ticket.message}</p>
              <small>{ticket.status || 'open'}</small>
            </button>
          )) : <EmptyConsole title="Dataset not loaded" text="Start by loading the demo support ticket dataset." action={<CommandButton onClick={actions.loadDataset}>Load dataset</CommandButton>} />}
        </div>
        <DataInspector ticket={selectedTicket || dataset[0]} onClose={() => setSelectedTicket(null)} />
      </div>
    </section>
  )
}

function PrivacyProcessingEngine({ dataset, cleaning, actions }) {
  const before = dataset[0]?.message || 'Hola soy Carlos, mi email es carlos@email.com y mi telefono es 612345678'
  const after = cleaning?.tickets?.[0]?.message || 'Hola soy [CUSTOMER_NAME], mi email es [EMAIL] y mi telefono es [PHONE]'
  return (
    <section className="ai-workspace">
      <div className="ai-section-head">
        <div>
          <p className="ai-kicker">Privacy Processing Engine</p>
          <h2>Clean, normalize and mask sensitive data</h2>
          <p>Before business data reaches an AI model, sensitive entities are detected and masked.</p>
        </div>
        <CommandButton disabled={!dataset.length} onClick={actions.runCleaning}><Wand2 size={15} /> Run cleaning pipeline</CommandButton>
      </div>
      <div className="ai-machine">
        {cleaningSteps.map((step, index) => (
          <div key={step} className={cx('ai-machine-step', cleaning && 'is-complete')}>
            <span>{index + 1}</span>
            <strong>{step}</strong>
            <small>{cleaning ? 'completed' : 'queued'}</small>
          </div>
        ))}
      </div>
      <div className="ai-command-grid ai-command-grid--two">
        <div className="ai-before-after">
          <div>
            <span>original sample</span>
            <p>{before}</p>
          </div>
          <ChevronRight size={22} />
          <div>
            <span>masked output</span>
            <p>{after}</p>
          </div>
        </div>
        <div className="ai-risk-panel">
          <h3>Privacy risk findings</h3>
          <Instrument label="Names" value={cleaning?.stats?.privacy?.names || 0} tone="green" />
          <Instrument label="Emails" value={cleaning?.stats?.privacy?.emails || 0} tone="green" />
          <Instrument label="Phones" value={cleaning?.stats?.privacy?.phones || 0} tone="green" />
          <div className="ai-log-stack">
            {(cleaning?.logs || ['Pipeline waiting for execution']).map((log) => <p key={log}>{log}</p>)}
          </div>
        </div>
      </div>
    </section>
  )
}

function ClassificationDesk({ tickets, selectedTicket, setSelectedTicket, actions }) {
  const [category, setCategory] = useState('All')
  const [priority, setPriority] = useState('All')
  const classified = tickets.filter((ticket) => ticket.category)
  const filtered = classified.filter((ticket) => (category === 'All' || ticket.category === category) && (priority === 'All' || ticket.priority === priority))
  const selected = selectedTicket?.category ? selectedTicket : filtered[0]

  return (
    <section className="ai-workspace ai-classification-desk">
      <div className="ai-section-head">
        <div>
          <p className="ai-kicker">AI Classification Desk</p>
          <h2>Explainable ticket routing</h2>
          <p>Classify issue type, priority, sentiment and review risk with transparent reasoning signals.</p>
        </div>
        <CommandButton onClick={actions.runClassification}><BrainCircuit size={15} /> Run classification</CommandButton>
      </div>
      {!classified.length ? (
        <EmptyConsole title="Classifier is idle" text="Load data and run classification to open the analysis desk." action={<CommandButton onClick={actions.runClassification}>Run classification</CommandButton>} />
      ) : (
        <div className="ai-desk-layout">
          <div className="ai-ticket-list">
            <div className="ai-filter-row">
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {['All', ...categories].map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={priority} onChange={(event) => setPriority(event.target.value)}>
                {['All', ...priorities].map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            {filtered.map((ticket) => (
              <button key={ticket.id} type="button" onClick={() => setSelectedTicket(ticket)} className={cx('ai-analysis-ticket', selected?.id === ticket.id && 'is-selected')}>
                <strong>{ticket.id}</strong>
                <span>{ticket.category}</span>
                <Meter label="confidence" value={ticket.confidence} />
              </button>
            ))}
          </div>
          <div className="ai-ticket-analysis">
            <span>selected case</span>
            <h3>{selected?.summary || 'No ticket selected'}</h3>
            <p>{selected?.message}</p>
            <div className="ai-result-grid">
              <Instrument label="Category" value={selected?.category} />
              <Instrument label="Priority" value={selected?.priority} tone={selected?.priority === 'Critical' ? 'amber' : 'cyan'} />
              <Instrument label="Sentiment" value={selected?.sentiment} tone="violet" />
            </div>
          </div>
          <div className="ai-explain-panel">
            <h3>Explainability</h3>
            <Meter label="Model confidence" value={selected?.confidence || 0} />
            <div className="ai-signal-cloud">
              {(selected?.reasoningSignals || []).map((signal) => <span key={signal}>{signal}</span>)}
            </div>
            <p>{selected?.recommendedAction}</p>
            <DistributionBars tickets={classified} />
          </div>
        </div>
      )}
    </section>
  )
}

function HumanValidationBoard({ tickets, actions }) {
  const queue = getReviewQueue(tickets)
  const corrected = tickets.filter((ticket) => ticket.reviewed && ticket.feedback?.includes('Corrected'))
  const approved = tickets.filter((ticket) => ticket.reviewed && !ticket.feedback?.includes('Corrected'))
  const [selectedId, setSelectedId] = useState(queue[0]?.id || tickets[0]?.id)
  const selected = tickets.find((ticket) => ticket.id === selectedId) || queue[0] || tickets[0]
  const [category, setCategory] = useState(selected?.category || categories[0])
  const [priority, setPriority] = useState(selected?.priority || priorities[0])
  const [feedback, setFeedback] = useState('')

  function handleReview(type) {
    if (!selected) return
    actions.reviewTicket(selected.id, {
      category,
      priority,
      feedback: feedback || (type === 'corrected' ? 'Corrected by human reviewer.' : 'Approved by human reviewer.'),
    })
  }

  const columns = [
    ['Needs Review', queue],
    ['Corrected', corrected],
    ['Approved', approved],
  ]

  return (
    <section className="ai-workspace">
      <div className="ai-section-head">
        <div>
          <p className="ai-kicker">Human Validation Board</p>
          <h2>Human-in-the-loop triage</h2>
          <p>Low-confidence and critical items stay under human control before automation trusts them.</p>
        </div>
      </div>
      {!tickets.length ? <EmptyConsole title="No classified tickets" text="Run classification before opening the validation board." /> : (
        <div className="ai-review-board">
          <div className="ai-kanban">
            {columns.map(([title, items]) => (
              <div key={title} className="ai-kanban-column">
                <h3>{title}<span>{items.length}</span></h3>
                {items.map((ticket) => (
                  <button key={ticket.id} type="button" onClick={() => { setSelectedId(ticket.id); setCategory(ticket.category); setPriority(ticket.priority) }}>
                    <strong>{ticket.id}</strong>
                    <span>{ticket.category}</span>
                    <Meter label="confidence" value={ticket.confidence} />
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="ai-human-decision">
            <span>decision cockpit</span>
            <h3>{selected?.id || 'Select a case'}</h3>
            <p>{selected?.message}</p>
            <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Priority<select value={priority} onChange={(event) => setPriority(event.target.value)}>{priorities.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Feedback<textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Capture reviewer feedback..." /></label>
            <div className="ai-action-cluster">
              <CommandButton onClick={() => handleReview('approved')}>Approve</CommandButton>
              <CommandButton variant="secondary" onClick={() => handleReview('corrected')}>Correct</CommandButton>
              <CommandButton variant="ghost" onClick={() => actions.addLog('review', `${selected?.id || 'Ticket'} sent back to analysis`, 'warning')}>Send back</CommandButton>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function AgentOperationsConsole({ tickets, agentResult, actions }) {
  const [task, setTask] = useState(agentTasks[0])
  const timeline = agentResult?.timeline || ['Understanding task', 'Selecting tools', 'Waiting for dataset signal']
  return (
    <section className="ai-workspace">
      <div className="ai-section-head">
        <div>
          <p className="ai-kicker">Agent Operations Console</p>
          <h2>Tool-using support agent</h2>
          <p>Run mission-based agent workflows with visible tool calls, durations and validation output.</p>
        </div>
        <CommandButton disabled={!tickets.length} onClick={() => actions.runAgentTask(task)}><Bot size={15} /> Run agent mission</CommandButton>
      </div>
      <div className="ai-agent-console-grid">
        <div className="ai-mission-selector">
          <h3>Mission selector</h3>
          {agentTasks.map((item) => (
            <button key={item} type="button" onClick={() => setTask(item)} className={cx(task === item && 'is-active')}>{item}</button>
          ))}
        </div>
        <div className="ai-agent-timeline">
          <h3>Execution timeline</h3>
          {timeline.map((step, index) => (
            <div key={step} className={cx('ai-timeline-step', agentResult && 'is-complete')}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
              <StatusPill status={agentResult ? 'completed' : index === 0 ? 'active' : 'pending'} />
            </div>
          ))}
        </div>
        <div className="ai-tool-console">
          <h3>Tool calls console</h3>
          {(agentResult?.toolCalls || []).map((tool) => (
            <div key={tool.name} className="ai-tool-call">
              <div><code>{tool.name}</code><StatusPill status={tool.status} /></div>
              <p>input: {tool.input}</p>
              <p>output: {tool.output}</p>
              <small>{tool.duration}ms</small>
            </div>
          ))}
          {!agentResult && <EmptyConsole title="No tool calls yet" text="Choose a mission and run the agent to inspect its operations." />}
        </div>
      </div>
      <div className="ai-agent-briefing">
        <span>final briefing</span>
        <h3>{agentResult?.output.mainFinding || 'Agent output waiting for execution.'}</h3>
        {agentResult && (
          <>
            <p>{agentResult.output.businessImpact}</p>
            <div className="ai-signal-cloud">{agentResult.output.recommendedActions.map((item) => <span key={item}>{item}</span>)}</div>
            <Meter label="Agent confidence" value={agentResult.output.confidence} tone="green" />
          </>
        )}
      </div>
    </section>
  )
}

function KnowledgeRetrievalSystem() {
  const [question, setQuestion] = useState(sampleQuestions[0])
  const [answer, setAnswer] = useState(() => askKnowledgeAssistant(sampleQuestions[0]))
  const flow = ['Question', 'Retrieve', 'Rank', 'Generate', 'Cite']
  return (
    <section className="ai-workspace">
      <div className="ai-section-head">
        <div>
          <p className="ai-kicker">Knowledge Retrieval System</p>
          <h2>Policy-grounded assistant</h2>
          <p>A local RAG-style flow retrieves internal documents before generating an answer with sources.</p>
        </div>
        <CommandButton onClick={() => setAnswer(askKnowledgeAssistant(question))}><Search size={15} /> Retrieve answer</CommandButton>
      </div>
      <div className="ai-rag-flow">{flow.map((step) => <span key={step}>{step}</span>)}</div>
      <div className="ai-knowledge-layout">
        <div className="ai-vault">
          <h3>Knowledge vault</h3>
          {knowledgeDocs.map((doc) => <article key={doc.id}><strong>{doc.title}</strong><p>{doc.tags.join(' / ')}</p></article>)}
        </div>
        <div className="ai-query-station">
          <textarea value={question} onChange={(event) => setQuestion(event.target.value)} />
          <div>{sampleQuestions.map((item) => <button key={item} type="button" onClick={() => setQuestion(item)}>{item}</button>)}</div>
        </div>
        <div className="ai-answer-panel">
          <span>answer</span>
          <p>{answer.answer}</p>
          <Meter label="Confidence" value={answer.confidence} tone="violet" />
          <h4>Sources used</h4>
          {answer.sources.map((source) => <blockquote key={source.id}><strong>{source.title}</strong><p>{source.content}</p></blockquote>)}
          <small>{answer.limitations}</small>
        </div>
      </div>
    </section>
  )
}

function EvaluationLaboratory({ evaluation, actions }) {
  const [selectedId, setSelectedId] = useState(null)
  const tests = evaluation?.tests || []
  const selected = tests.find((test) => test.id === selectedId) || tests[0]
  return (
    <section className="ai-workspace">
      <div className="ai-section-head">
        <div>
          <p className="ai-kicker">Model QA Laboratory</p>
          <h2>Evaluation matrix and safety checks</h2>
          <p>Validate accuracy, privacy masking, hallucination risk and human review behavior.</p>
        </div>
        <CommandButton onClick={actions.runEvaluation}><ShieldCheck size={15} /> Run evaluation suite</CommandButton>
      </div>
      {!evaluation ? <EmptyConsole title="Evaluation suite not executed" text="Run the QA laboratory to inspect model behavior before trusting automation." /> : (
        <>
          <div className="ai-lab-instruments">
            <Instrument label="Accuracy" value={`${evaluation.metrics.accuracy}%`} />
            <Instrument label="Privacy" value={`${evaluation.metrics.privacyScore}%`} tone="green" />
            <Instrument label="Hallucination risk" value={`${evaluation.metrics.hallucinationRisk}%`} tone="amber" />
            <Instrument label="Safety" value={`${evaluation.metrics.safetyScore}%`} tone="violet" />
          </div>
          <div className="ai-evaluation-layout">
            <div className="ai-test-matrix">
              {tests.map((test) => (
                <button key={test.id} type="button" onClick={() => setSelectedId(test.id)} className={cx(selected?.id === test.id && 'is-selected')}>
                  <strong>{test.name}</strong>
                  <StatusPill status={test.status === 'passed' ? 'completed' : test.status} />
                </button>
              ))}
            </div>
            <div className="ai-test-detail">
              <span>test detail</span>
              <h3>{selected?.name}</h3>
              <p><strong>Input:</strong> {selected?.input}</p>
              <p><strong>Expected:</strong> {selected?.expected}</p>
              <p><strong>Actual:</strong> {selected?.actual}</p>
              <p>{selected?.notes}</p>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

function ExecutiveBriefingRoom({ report, actions }) {
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
    <section className="ai-workspace">
      <div className="ai-section-head">
        <div>
          <p className="ai-kicker">Executive Briefing Room</p>
          <h2>Manager-ready operations report</h2>
          <p>Turn workflow signals into a concise support intelligence briefing.</p>
        </div>
        <div className="ai-action-cluster">
          <CommandButton onClick={actions.generateReport}><FileText size={15} /> Generate report</CommandButton>
          <CommandButton disabled={!report} variant="secondary" onClick={() => navigator.clipboard?.writeText(text)}><Copy size={15} /> Copy</CommandButton>
          <CommandButton disabled={!report} variant="ghost" onClick={exportJson}><Download size={15} /> Export JSON</CommandButton>
        </div>
      </div>
      {!report ? <EmptyConsole title="No briefing generated" text="Generate the executive report after the workflow has enough signals." /> : (
        <div className="ai-report-room">
          <aside>
            <Instrument label="Status" value={report.reportStatus} tone="green" icon={CheckCircle2} />
            <Instrument label="Tickets" value={report.totalTicketsAnalyzed} icon={Database} />
            <Instrument label="Evaluation" value={`${report.evaluationScore || 0}%`} tone="violet" icon={ShieldCheck} />
          </aside>
          <article className="ai-executive-document">
            <span>{new Date(report.generatedAt).toLocaleString()}</span>
            <h3>Executive summary</h3>
            <p>{report.executiveSummary}</p>
            <h4>Main incident</h4>
            <p>{report.mainIncidentDetected}</p>
            <h4>Recommended actions</h4>
            <ul>{report.suggestedNextSteps.map((item) => <li key={item}>{item}</li>)}</ul>
            <h4>Suggested response</h4>
            <p>{report.suggestedCustomerResponse}</p>
          </article>
        </div>
      )}
    </section>
  )
}

function SystemBlueprint() {
  const layers = ['React Command UI', 'Local AI Simulation Layer', 'Data Processing Services', 'Privacy Engine', 'Classification Engine', 'Agent Tools', 'Evaluation Engine', 'Future FastAPI Backend']
  return (
    <section className="ai-workspace">
      <div className="ai-section-head">
        <div>
          <p className="ai-kicker">System Blueprint</p>
          <h2>Full-stack-ready AI operations architecture</h2>
          <p>The demo runs locally but is structured for a future Python/FastAPI backend and external AI providers.</p>
        </div>
      </div>
      <div className="ai-blueprint">
        <div className="ai-blueprint-map">
          {layers.map((layer, index) => <div key={layer} className="ai-blueprint-layer"><span>{index + 1}</span><strong>{layer}</strong></div>)}
        </div>
        <div className="ai-code-wall">
          <pre>{`const toolCall = {
  name: "groupBySimilarity",
  input: cleanedTickets,
  output: issueClusters,
  validated: true
}`}
          </pre>
          <pre>{`const evaluationCase = {
  expected: "masked private data",
  actual: privacyEngine(ticket),
  status: "passed"
}`}
          </pre>
        </div>
      </div>
      <div className="ai-signal-cloud">
        {['React', 'Python-ready', 'FastAPI-ready', 'Pandas-ready', 'AI Agents', 'RAG', 'Model Evaluation', 'Privacy Masking', 'Human in the Loop', 'Docker-ready'].map((tag) => <span key={tag}>{tag}</span>)}
      </div>
    </section>
  )
}

function TechnicalImpactBrief() {
  const blocks = [
    ['What it demonstrates', ['AI workflow design', 'Data cleaning', 'Privacy-aware processing', 'Human in the Loop', 'Model evaluation']],
    ['Why it matters', ['Reduces manual triage work', 'Protects sensitive data', 'Keeps humans in control', 'Produces manager-ready reports']],
    ['AI engineering mapping', ['Python-ready services', 'Agent workflows', 'RAG-style retrieval', 'Testing and validation', 'Technical documentation']],
  ]
  return (
    <section className="ai-workspace">
      <div className="ai-section-head">
        <div>
          <p className="ai-kicker">Technical Impact Brief</p>
          <h2>Recruiter-facing proof of applied AI work</h2>
          <p>A fast overview of the business value and engineering capabilities behind the demo.</p>
        </div>
      </div>
      <div className="ai-impact-grid">
        {blocks.map(([title, items]) => (
          <article key={title}>
            <h3>{title}</h3>
            {items.map((item) => <p key={item}><CheckCircle2 size={16} /> {item}</p>)}
          </article>
        ))}
      </div>
    </section>
  )
}

function AISupportIntelligencePage() {
  usePageTitle('AI Support Intelligence Platform | Alex Gomez')
  const [active, setActive] = useState('mission')
  const [dataset, setDataset] = useState([])
  const [cleaning, setCleaning] = useState(null)
  const [classifiedTickets, setClassifiedTickets] = useState([])
  const [agentResult, setAgentResult] = useState(null)
  const [evaluation, setEvaluation] = useState(null)
  const [report, setReport] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [logs, setLogs] = useState([createLog('system', 'Command center initialized in local demo mode', 'info')])

  const review = reviewMetrics(classifiedTickets)
  const progress = {
    datasetLoaded: dataset.length > 0,
    cleaningCompleted: Boolean(cleaning),
    classificationCompleted: classifiedTickets.length > 0,
    reviewCompleted: classifiedTickets.length > 0 && review.queued === 0,
    agentCompleted: Boolean(agentResult),
    evaluationCompleted: Boolean(evaluation),
    reportGenerated: Boolean(report),
  }

  const metrics = useMemo(() => ({
    highPriority: classifiedTickets.filter((ticket) => ['High', 'Critical'].includes(ticket.priority)).length,
    avgConfidence: classifiedTickets.length ? Math.round(classifiedTickets.reduce((sum, ticket) => sum + ticket.confidence, 0) / classifiedTickets.length) : 0,
    privacyRisks: cleaning ? cleaning.stats.privacy.names + cleaning.stats.privacy.emails + cleaning.stats.privacy.phones : 0,
    evaluationScore: evaluation?.metrics.safetyScore || 0,
    estimatedTokens: classifiedTickets.length ? classifiedTickets.length * 420 : 0,
    estimatedCost: classifiedTickets.length ? (classifiedTickets.length * 0.004).toFixed(2) : '0.00',
    toolCalls: agentResult?.toolCalls.length || 0,
    reviewRate: review.reviewRate,
  }), [agentResult, classifiedTickets, cleaning, evaluation, review.reviewRate])

  function addLog(module, message, type = 'info') {
    setLogs((current) => [createLog(module, message, type), ...current].slice(0, 40))
  }

  function loadDataset() {
    setDataset(supportTickets)
    setCleaning(null)
    setClassifiedTickets([])
    setAgentResult(null)
    setEvaluation(null)
    setReport(null)
    setSelectedTicket(supportTickets[0])
    addLog('dataset', `Loaded ${supportTickets.length} support tickets`, 'success')
  }

  function resetDataset() {
    setDataset([])
    setCleaning(null)
    setClassifiedTickets([])
    setAgentResult(null)
    setEvaluation(null)
    setReport(null)
    setSelectedTicket(null)
    addLog('system', 'Command center reset completed', 'info')
  }

  function runCleaning() {
    const result = runCleaningPipeline(dataset.length ? dataset : supportTickets)
    setDataset(result.tickets)
    setCleaning(result)
    setSelectedTicket(result.tickets[0])
    addLog('privacy', `Masked ${result.stats.privacy.names + result.stats.privacy.emails + result.stats.privacy.phones} sensitive entities`, 'success')
  }

  function runClassification() {
    const source = cleaning?.tickets?.length ? cleaning.tickets : dataset.length ? dataset : supportTickets
    const result = classifyTickets(source)
    setClassifiedTickets(result)
    setSelectedTicket(result[0])
    const avg = Math.round(result.reduce((sum, ticket) => sum + ticket.confidence, 0) / result.length)
    addLog('classifier', `Classification completed with ${avg}% average confidence`, 'success')
    addLog('review', `${getReviewQueue(result).length} tickets require human validation`, 'warning')
  }

  function reviewTicket(id, patch) {
    setClassifiedTickets((current) => applyHumanReview(current, id, patch))
    addLog('review', `${id} reviewed. Model improvement signal captured`, 'success')
  }

  function runAgentTask(task) {
    const source = classifiedTickets.length ? classifiedTickets : classifyTickets(dataset.length ? dataset : supportTickets)
    const result = runAgent(task, source)
    setAgentResult(result)
    addLog('agent', `${result.toolCalls.length} tools executed for: ${task}`, 'success')
  }

  function runEvaluation() {
    const result = runEvaluationSuite(review.reviewRate)
    setEvaluation(result)
    addLog('evaluation', `Evaluation suite completed: ${result.tests.filter((test) => test.status === 'passed').length}/${result.tests.length} checks passed`, 'success')
  }

  function generateReport() {
    const source = classifiedTickets.length ? classifiedTickets : classifyTickets(dataset.length ? dataset : supportTickets)
    const result = generateExecutiveReport({ tickets: source, cleaning, review: reviewMetrics(source), agent: agentResult, evaluation })
    setReport(result)
    addLog('report', 'Executive briefing generated', 'success')
  }

  function runFullDemo() {
    const clean = runCleaningPipeline(supportTickets)
    const classified = classifyTickets(clean.tickets)
    const firstReview = getReviewQueue(classified)[0]
    const reviewed = firstReview ? applyHumanReview(classified, firstReview.id, { feedback: 'Approved during full operation run.' }) : classified
    const agent = runAgent('Prepare manager briefing', reviewed)
    const evalResult = runEvaluationSuite(reviewMetrics(reviewed).reviewRate)
    const reportResult = generateExecutiveReport({ tickets: reviewed, cleaning: clean, review: reviewMetrics(reviewed), agent, evaluation: evalResult })
    setDataset(clean.tickets)
    setCleaning(clean)
    setClassifiedTickets(reviewed)
    setAgentResult(agent)
    setEvaluation(evalResult)
    setReport(reportResult)
    setSelectedTicket(reviewed[0])
    setLogs([
      createLog('report', 'Executive briefing generated', 'success'),
      createLog('evaluation', 'Evaluation suite completed: 7/8 checks passed', 'success'),
      createLog('agent', `${agent.toolCalls.length} tools executed successfully`, 'success'),
      createLog('review', 'Human validation signal captured', 'success'),
      createLog('classifier', 'Classification completed with local deterministic model', 'success'),
      createLog('privacy', `Masked ${clean.stats.privacy.names + clean.stats.privacy.emails + clean.stats.privacy.phones} sensitive entities`, 'success'),
      createLog('dataset', `Loaded ${supportTickets.length} support tickets`, 'success'),
    ])
    setActive('mission')
  }

  const actions = { loadDataset, resetDataset, runCleaning, runClassification, reviewTicket, runAgentTask, runEvaluation, generateReport, runFullDemo, addLog }
  const modelTickets = classifiedTickets.length ? classifiedTickets : dataset
  const content = {
    mission: <MissionControl dataset={dataset} classifiedTickets={classifiedTickets} progress={progress} metrics={metrics} actions={actions} />,
    dataset: <DatasetConsole dataset={dataset} selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket} actions={actions} />,
    cleaning: <PrivacyProcessingEngine dataset={dataset} cleaning={cleaning} actions={actions} />,
    classification: <ClassificationDesk tickets={modelTickets} selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket} actions={actions} />,
    review: <HumanValidationBoard tickets={classifiedTickets} actions={actions} />,
    agent: <AgentOperationsConsole tickets={classifiedTickets} agentResult={agentResult} actions={actions} />,
    knowledge: <KnowledgeRetrievalSystem />,
    evaluation: <EvaluationLaboratory evaluation={evaluation} actions={actions} />,
    reports: <ExecutiveBriefingRoom report={report} actions={actions} />,
    architecture: <SystemBlueprint />,
    recruiter: <TechnicalImpactBrief />,
  }

  return (
    <main className="ai-support-app ai-command-center">
      <div className="ai-command-bg" />
      <OperationsTopBar active={active} progress={progress} metrics={metrics} onRunFullDemo={runFullDemo} onReset={resetDataset} />
      <div className="ai-command-shell">
        <CommandRail active={active} setActive={setActive} progress={progress} />
        <div className="ai-command-workspace">
          {content[active]}
        </div>
        <LiveConsolePanel logs={logs} active={sectionTitles[active]} metrics={metrics} agentResult={agentResult} />
      </div>
    </main>
  )
}

export default AISupportIntelligencePage
