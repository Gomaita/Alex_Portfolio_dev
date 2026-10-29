import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from '../styles/Portfolio.module.css'

export default function Contact() {
  return <section id="v2-contact" className={styles.contact} aria-labelledby="v2-contact-title"><p className={styles.eyebrow}>Have something in mind?</p><h2 id="v2-contact-title">Let's get in touch<span>.</span></h2><p>If you'd like to talk about an opportunity, a project or just have a question, feel free to reach out.</p><Link to="/contact" className={styles.primaryButton}>Contact me <ArrowUpRight size={17} /></Link></section>
}
