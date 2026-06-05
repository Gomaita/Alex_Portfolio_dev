import { useMemo, useState } from 'react'
import { riskExamples } from '../../data/blockchainLabData'
import { analyzeSoliditySnippet } from '../../utils/contractRiskRules'

function severityClass(severity) {
  return {
    low: 'text-emerald-300',
    medium: 'text-amber-300',
    high: 'text-red-300',
    critical: 'text-purple-300',
  }[severity] || 'text-slate-300'
}

function ContractRiskAnalyzer() {
  const [activeId, setActiveId] = useState(riskExamples[0].id)
  const active = riskExamples.find((example) => example.id === activeId) || riskExamples[0]
  const analysis = useMemo(() => analyzeSoliditySnippet(active.snippet), [active])

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h1 className="text-2xl font-bold text-white">Contract Risk Analyzer</h1>
        <p className="mt-2 text-sm text-slate-400">
          This analyzer uses simple educational rules. It is not a replacement for a professional smart contract audit.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-bold text-white">Example snippets</h2>
          <div className="mt-4 grid gap-2">
            {riskExamples.map((example) => (
              <button key={example.id} type="button" onClick={() => setActiveId(example.id)} className={`rounded-lg px-3 py-2 text-left text-sm font-semibold ${activeId === example.id ? 'bg-violet-500/20 text-violet-100' : 'border border-slate-800 text-slate-300 hover:border-slate-700'}`}>
                {example.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{active.label}</h2>
              <p className={`mt-2 text-sm font-bold capitalize ${severityClass(analysis.severity)}`}>{analysis.severity} risk</p>
            </div>
            <p className="text-4xl font-bold text-white">{analysis.riskScore}<span className="text-xl text-slate-500">/100</span></p>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-cyan-100"><code>{active.snippet}</code></pre>

          <div className="mt-5 grid gap-4">
            {analysis.detectedIssues.length ? analysis.detectedIssues.map((issue) => (
              <div key={issue.title} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="font-semibold text-white">{issue.title}</p>
                <p className={`mt-1 text-xs font-bold uppercase ${severityClass(issue.severity)}`}>{issue.severity}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{issue.explanation}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{issue.recommendation}</p>
              </div>
            )) : (
              <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                No major issue detected by the educational rules.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContractRiskAnalyzer
