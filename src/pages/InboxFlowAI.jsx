import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, CircleCheck, Copy, FileJson, Inbox, LoaderCircle, ScanText, ShieldCheck, Sparkles, Trash2 } from 'lucide-react'
import { analyzeMessage } from '../services/aiMessageProcessorService'
import usePageTitle from '../hooks/usePageTitle'
import './inboxflow.css'

const examples = [
  { label: 'Client request', type: 'client_request', message: 'Hi Alex, could you send me the quote for the website tomorrow? I also wanted to know if we can add a 3D portfolio section. It is a bit urgent because I need it before Friday.' },
  { label: 'Support ticket', type: 'support_ticket', message: 'Hello, I cannot access my account since yesterday. I already tried resetting my password but the link does not work. Can someone help me as soon as possible?' },
  { label: 'Recruiter message', type: 'recruiter_message', message: 'Hi Alex, we reviewed your profile and would like to schedule a technical interview next week for a junior full stack developer position. Are you available on Tuesday morning?' },
  { label: 'Internal task', type: 'internal_task', message: 'Please check the contact form bug, review the Cloudflare deployment and prepare a short update for the team by tomorrow afternoon.' },
]
const types = [['auto', 'Auto-detect'], ['email', 'Email'], ['chat', 'WhatsApp-style message'], ['support_ticket', 'Support ticket'], ['client_request', 'Client request'], ['recruiter_message', 'Job / recruiter message'], ['internal_task', 'Internal task']]

function CopyButton({ text, label }) {
  const [status, setStatus] = useState('idle')
  const timer = useRef(null)
  useEffect(() => { setStatus('idle'); clearTimeout(timer.current) }, [text])
  useEffect(() => () => clearTimeout(timer.current), [])
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
    } catch { setStatus('error') }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus('idle'), 2500)
  }
  return <span className="inboxflow-copy"><button type="button" onClick={copy}>{status === 'copied' ? <Check size={15} /> : <Copy size={15} />}{status === 'copied' ? 'Copied' : label}</button><span role="status">{status === 'error' ? 'Copy failed. Select and copy the text manually.' : ''}</span></span>
}

function AnalysisResult({ result }) {
  return <>
    <div className="inboxflow-result-heading"><span className="inboxflow-kicker"><CircleCheck size={15} /> Analysis complete</span><span className="inboxflow-type">{result.messageType?.replace(/_/g, ' ')}</span></div>
    <section className="inboxflow-summary"><h3>Summary</h3><p>{result.summary}</p></section>
    <dl className="inboxflow-signals">
      <div><dt>Category</dt><dd>{result.category}</dd></div>
      <div><dt>Priority</dt><dd><span className={`inboxflow-priority inboxflow-priority--${result.priority}`}>{result.priority}</span></dd></div>
      <div><dt>Sentiment</dt><dd><span className={`inboxflow-sentiment inboxflow-sentiment--${result.sentiment}`}>{result.sentiment}</span></dd></div>
      <div><dt>Confidence</dt><dd>{Math.round(result.confidence * 100)}%<progress value={result.confidence} max="1" aria-label="Analysis confidence" /></dd></div>
    </dl>
    <div className="inboxflow-deadline"><span>Deadline</span><strong>{result.deadline || 'No deadline detected'}</strong></div>
    <section className="inboxflow-tasks"><div className="inboxflow-section-heading"><h3>Detected tasks</h3><span>{result.tasks.length}</span></div>
      {result.tasks.length ? <ul>{result.tasks.map((task, index) => <li key={index}><CircleCheck size={18} /><div><strong>{task.title}</strong>{(task.owner || task.dueDate) && <p>{[task.owner && `Owner: ${task.owner}`, task.dueDate && `Due: ${task.dueDate}`].filter(Boolean).join(' · ')}</p>}</div></li>)}</ul> : <p className="inboxflow-muted">No explicit tasks detected.</p>}
    </section>
    <section className="inboxflow-reply"><div className="inboxflow-section-heading"><h3>Suggested reply</h3><CopyButton text={result.suggestedReply} label="Copy reply" /></div><p>{result.suggestedReply}</p></section>
    {result.requiresFollowUp && <p className="inboxflow-followup"><ArrowRight size={15} /> Follow-up recommended</p>}
  </>
}

export default function InboxFlowAI() {
  usePageTitle('InboxFlow AI | Alex Gómez')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('auto')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const request = useRef(null)
  useEffect(() => () => request.current?.abort(), [])
  function clearResult() { setAnalysis(null); setError('') }
  function loadExample() { const example = examples[exampleIndex]; setMessage(example.message); setMessageType(example.type); clearResult() }
  async function submit(event) {
    event.preventDefault()
    if (loading) return
    if (message.trim().length < 5 || message.length > 4000) { setError('Enter between 5 and 4000 characters.'); return }
    const controller = new AbortController()
    request.current = controller
    setLoading(true); clearResult()
    try {
      const data = await analyzeMessage({ message, messageType, signal: controller.signal })
      if (!controller.signal.aborted) setAnalysis(data)
    } catch (failure) { if (!controller.signal.aborted) setError(failure.message) }
    finally { if (!controller.signal.aborted) setLoading(false) }
  }
  return <div className="inboxflow">
    <div className="inboxflow-app">
      <header className="inboxflow-topbar"><Link to="/portfolio"><ArrowLeft size={16} /> Portfolio</Link><span><ShieldCheck size={15} /> Single-message processing</span></header>
      <div className="inboxflow-heading"><div className="inboxflow-brand"><Inbox size={25} /></div><div><h1>InboxFlow AI</h1><p>Turn messy messages into structured actions.</p></div><div className="inboxflow-provider"><span className="inboxflow-mode">{loading ? 'Analyzing' : analysis ? analysis.demoMode ? 'Demo mode' : analysis.provider === 'groq' ? 'Groq AI enabled' : 'AI enabled' : 'Ready to analyze'}</span>{analysis && <span className="inboxflow-model">{analysis.model}</span>}</div></div>
      <div className="inboxflow-workspace">
        <form className="inboxflow-input-panel" onSubmit={submit}>
          <div className="inboxflow-panel-heading"><span className="inboxflow-step">01</span><h2>Message intake</h2><ScanText size={20} /></div>
          <div className="inboxflow-example-picker"><label htmlFor="inboxflow-example">Try an example</label><div><select id="inboxflow-example" value={exampleIndex} onChange={(event) => setExampleIndex(Number(event.target.value))} disabled={loading}>{examples.map((example, index) => <option key={example.type} value={index}>{example.label}</option>)}</select><button type="button" onClick={loadExample} disabled={loading}>Load example</button></div></div>
          <label htmlFor="inboxflow-message">Your message</label>
          <textarea id="inboxflow-message" value={message} onChange={(event) => { setMessage(event.target.value); clearResult() }} disabled={loading} maxLength={4000} placeholder={examples[0].message} aria-describedby="inboxflow-counter inboxflow-privacy" />
          <div id="inboxflow-counter" className="inboxflow-counter"><span>Plain text input</span><span>{message.length} / 4,000</span></div>
          <label htmlFor="inboxflow-type">Message type</label><select id="inboxflow-type" value={messageType} onChange={(event) => { setMessageType(event.target.value); clearResult() }} disabled={loading}>{types.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
          <div className="inboxflow-input-actions"><button className="inboxflow-primary" disabled={loading || message.trim().length < 5} type="submit">{loading ? <LoaderCircle className="inboxflow-spin" size={18} /> : <Sparkles size={18} />}{loading ? 'Analyzing message...' : 'Analyze message'}</button><button type="button" disabled={loading || !message} onClick={() => { setMessage(''); setMessageType('auto'); clearResult() }}><Trash2 size={16} /> Clear</button></div>
          <p id="inboxflow-privacy" className="inboxflow-privacy"><ShieldCheck size={16} /> Do not paste sensitive personal information.</p>
        </form>
        <section className="inboxflow-output-panel" aria-label="Structured analysis" aria-busy={loading}>
          <div className="inboxflow-panel-heading"><span className="inboxflow-step">02</span><h2>Structured output</h2><FileJson size={20} /></div>
          {error && <div className="inboxflow-error" role="alert">{error}</div>}
          {(analysis?.warning || analysis?.demoMode) && <div className="inboxflow-notice" role="status">{analysis.warning || 'Demo mode is active because Groq is not configured.'}{analysis.demoMode && <span>Rule-based results; confidence is illustrative.</span>}</div>}
          {loading ? <div className="inboxflow-empty" role="status"><LoaderCircle size={30} className="inboxflow-spin" /><h3>Extracting the signal</h3><p>Classifying the message and checking structured output.</p></div>
            : analysis ? <AnalysisResult result={analysis.result} /> : <div className="inboxflow-empty"><div className="inboxflow-empty-icon"><FileJson size={32} /></div><h3>From inbox noise to next steps</h3><p>Your summary, signals, tasks and suggested reply will appear here.</p><div className="inboxflow-empty-flow"><span>Message</span><ArrowRight size={16} /><span>Analysis</span><ArrowRight size={16} /><span>JSON</span></div></div>}
        </section>
      </div>
      {analysis && <details className="inboxflow-json"><summary><FileJson size={17} /> Raw JSON <span>View response payload</span></summary><div><CopyButton text={JSON.stringify(analysis, null, 2)} label="Copy JSON" /><pre>{JSON.stringify(analysis, null, 2)}</pre></div></details>}
      <footer className="inboxflow-footer"><span>This is a portfolio demo. Messages are not stored by this application.</span><Link to="/portfolio/ai-message-processor">Project details <ArrowRight size={14} /></Link></footer>
    </div>
  </div>
}
