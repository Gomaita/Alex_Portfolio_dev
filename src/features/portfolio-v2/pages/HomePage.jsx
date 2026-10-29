import Navigation from '../components/Navigation'
import Hero from '../sections/Hero'
import SelectedWork from '../sections/SelectedWork'
import Tools from '../sections/Tools'
import About from '../sections/About'
import Contact from '../sections/Contact'
import styles from '../styles/Portfolio.module.css'

export default function HomePage() {
  return <div id="v2-home" className={styles.page}>
    <a className={styles.skipLink} href="#v2-main">Skip to content</a>
    <Navigation />
    <main id="v2-main" className={styles.container} tabIndex={-1}><Hero /><SelectedWork /><Tools /><About /><Contact /></main>
    <footer className={`${styles.footer} ${styles.container}`}><a className={styles.wordmark} href="#v2-home" aria-label="Alex — back to top">alex<span>.</span></a><p>Thoughtfully built, continually learning.</p><span>© {new Date().getFullYear()} Alex Gómez</span></footer>
  </div>
}
