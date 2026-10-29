import { toolGroups } from '../data/content'
import styles from '../styles/Portfolio.module.css'

export default function Tools() {
  return <section className={styles.tools} aria-labelledby="v2-tools-title"><p className={styles.eyebrow}>Different tools. The same curiosity.</p><h2 id="v2-tools-title">Tools I work with<span>.</span></h2><div className={styles.toolGroups}>{toolGroups.map((group, index) => <div key={group.title}><span className={styles.groupNumber}>0{index + 1}</span><h3>{group.title}</h3><ul className={styles.chips}>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div></section>
}
