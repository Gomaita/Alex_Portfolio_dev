import { ArrowDown, ArrowUpRight } from 'lucide-react'
import styles from '../styles/Portfolio.module.css'

export default function Hero() {
  return <section className={styles.hero} aria-labelledby="v2-title">
    <div className={styles.glassObject} aria-hidden="true"><div /><div /><div /><span>&lt;/&gt;</span></div>
    <p className={styles.eyebrow}>Hello, I'm Alex Gómez</p>
    <h1 id="v2-title">I build things<br />for the <span>web.</span></h1>
    <p className={styles.heroDescription}>I'm a software developer who enjoys turning ideas into working applications, exploring new technologies and solving practical problems.</p>
    <div className={styles.actions}><a href="#v2-projects" className={styles.primaryButton}>Explore my work <ArrowUpRight size={17} /></a><a href="#v2-about" className={styles.secondaryButton}>About me <ArrowDown size={16} /></a></div>
    <div className={styles.heroFoot}><span>Software development & a curious mind</span><a href="#v2-projects" aria-label="Scroll to selected work"><ArrowDown size={17} /></a></div>
  </section>
}
