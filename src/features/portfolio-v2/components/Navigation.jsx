import styles from '../styles/Portfolio.module.css'

export default function Navigation() {
  return <header className={styles.header}>
    <nav className={styles.nav} aria-label="Portfolio navigation">
      <a className={styles.wordmark} href="#v2-home" aria-label="Alex — home">alex<span>.</span></a>
      <div className={styles.navLinks}>
        <a href="#v2-home">Home</a><a href="#v2-projects">Projects</a>
        <a href="#v2-about">About</a><a href="#v2-contact">Contact</a>
      </div>
    </nav>
  </header>
}
