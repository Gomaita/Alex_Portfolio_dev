import styles from '../styles/Portfolio.module.css'

export default function About() {
  return <section id="v2-about" className={styles.about} aria-labelledby="v2-about-title"><p className={styles.eyebrow}>The person behind the code</p><h2 id="v2-about-title">About me<span>.</span></h2><p className={styles.aboutLead}>I like figuring things out.<br />Even more when I can build something with them.</p><div className={styles.aboutText}><p>I'm Alex, a Multimedia Engineering graduate from the University of Alicante.</p><p>I enjoy software development because it brings problem-solving and making things together. I like understanding how an application works, from the interface to the logic and data behind it.</p><p>I learn by building, asking questions and trying again. These projects are part of that process.</p></div><div className={styles.signature}>Alex Gómez<span>Always learning. Always building.</span></div></section>
}
