import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { selectedWork } from '../data/content'
import ProjectPreview from '../components/ProjectPreview'
import styles from '../styles/Portfolio.module.css'

export default function SelectedWork() {
  return <section id="v2-projects" className={styles.work} aria-labelledby="v2-work-title">
    <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>A selection of projects</p><h2 id="v2-work-title">Selected work<span>.</span></h2><p>A few things I've built and explored.</p></div><Link className={styles.textLink} to="/portfolio">View all projects <ArrowUpRight size={17} /></Link></div>
    <div className={styles.projectGrid}>{selectedWork.map((project) => <article key={project.id} className={styles.project}>
      <ProjectPreview kind={project.id} />
      <div className={styles.projectBody}><div className={styles.projectMeta}><span>{project.category}</span><span>{project.number}</span></div>
        <h3><Link to={project.href}>{project.title}<ArrowUpRight size={22} /></Link></h3>
        <p className={styles.projectDescription}>{project.description}</p>
        <ul className={styles.chips} aria-label={`${project.title} technologies`}>{project.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul>
        <p className={styles.projectNote}>{project.note}</p>
        <Link to={project.href} className={styles.textLink} aria-label={`Open ${project.title}`}>Open project <ArrowUpRight size={16} /></Link>
      </div>
    </article>)}</div>
  </section>
}
