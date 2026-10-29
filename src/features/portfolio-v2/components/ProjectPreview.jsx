import { ArrowRight, Check, FileText, ListTodo, Sparkles } from 'lucide-react'
import styles from '../styles/Portfolio.module.css'

// Editorial illustrations of the workflows, not screenshots or live results.
export default function ProjectPreview({ kind }) {
  return <div className={`${styles.preview} ${styles[kind]}`} aria-hidden="true">
    <span className={styles.previewLabel}>WORKFLOW ILLUSTRATION</span>
    {kind === 'inbox' && <div className={styles.messageFlow}>
      <div className={styles.messagePaper}><FileText size={20} /><span>A message comes in.</span><i /><i /><i /></div>
      <div className={styles.flowConnector}><span /><Sparkles size={22} /><span /></div>
      <div className={styles.actionPaper}><div><ListTodo size={18} /><strong>A clearer next step.</strong></div><p><Check size={14} /> Identify the priority</p><p><Check size={14} /> Extract the tasks</p><p><Check size={14} /> Suggest a reply</p></div>
    </div>}
    {kind === 'nutrition' && <div className={styles.nutritionArt}>
      <div className={styles.nutritionRing}><span>Plan.<br /><strong>Build a routine.</strong></span></div>
      <div className={styles.routineNote}><span>THE EVERYDAY, ORGANIZED</span><p>Meals <ArrowRight size={14} /></p><p>Training <ArrowRight size={14} /></p><p>Progress <ArrowRight size={14} /></p></div>
    </div>}
    {kind === 'sql' && <div className={styles.queryPaper}>
      <div className={styles.paperTop}><span /><span /><span /><small>query.sql</small></div>
      <code><b>SELECT</b> title, category<br /><b>FROM</b> projects<br /><b>WHERE</b> status = <em>'Completed'</em>;</code>
      <div className={styles.tableArt}><span>title</span><span>category</span><i /><i /><i /><i /></div>
    </div>}
  </div>
}
