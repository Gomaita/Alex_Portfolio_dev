import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { contact } from "../../data/socialLinks";
import { appConfig } from "../../config/appConfig";
import { projects } from "./data";
import {
  EditorialHeading,
  OrganicArt,
  OrganicButton,
  OrganicHero,
  ProjectGallery,
  ContactSection,
} from "./components";
import ContactForm from "./ContactForm";
import s from "./Organic.module.css";

export function HomePage({ base }) {
  return (
    <>
      <OrganicHero base={base} />
      <section id="organic-work" className={s.workSection}>
        <div className={s.sectionIntro}>
          <EditorialHeading as="h2" eyebrow="A few things I’ve built">
            Selected <em>work.</em>
          </EditorialHeading>
          <p>
            Applications, experiments and ideas
            <br />
            made tangible through code.
          </p>
        </div>
        <ProjectGallery projects={projects.slice(0, 2)} base={base} />
        <div className={s.allProjects}>
          <OrganicButton to={`${base}/projects`} secondary>
            Explore all projects
          </OrganicButton>
        </div>
      </section>
      <section className={s.manifesto}>
        <p className={s.label}>A little about my approach</p>
        <h2>
          Curious by nature.
          <br />
          <em>Thoughtful</em> by design.
        </h2>
        <p>
          I like understanding how things work — then making them a little
          clearer, more useful and easier to use.
        </p>
        <Link className={s.textLink} to={`${base}/about`}>
          Meet the person behind the code <ArrowUpRight size={16} />
        </Link>
      </section>
      <ContactSection base={base} />
    </>
  );
}

export function ProjectsPage({ base }) {
  const [category, setCategory] = useState("All work");
  const categories = [
    "All work",
    ...new Set(projects.map((project) => project.category)),
  ];
  const filtered = projects.filter(
    (project) => category === "All work" || project.category === category,
  );
  return (
    <div className={s.pageContent}>
      <div className={s.pageIntro}>
        <EditorialHeading eyebrow="Applications / experiments / explorations">
          Selected <em>Work.</em>
        </EditorialHeading>
        <p>
          Different problems. Different tools.
          <br />
          The same curiosity to build something useful.
        </p>
      </div>
      <div className={s.filters} role="group" aria-label="Filter projects">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <p className={s.resultCount} role="status">
        {filtered.length} {filtered.length === 1 ? "project" : "projects"}
      </p>
      <ProjectGallery projects={filtered} base={base} />
      <ContactSection base={base} />
    </div>
  );
}

export function ProjectPage({ base }) {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);
  if (!project) return <MissingPage base={base} />;
  return (
    <article className={s.pageContent}>
      <Link to={`${base}/projects`} className={s.textLink}>
        <ArrowLeft size={15} />
        All projects
      </Link>
      <div className={s.detailIntro}>
        <EditorialHeading eyebrow={`${project.index} / ${project.category}`}>
          {project.title}
          <em>.</em>
        </EditorialHeading>
        <p>{project.intro}</p>
        <div className={s.actions}>
          <OrganicButton to={project.href}>Open application</OrganicButton>
          <OrganicButton
            href={project.source}
            secondary
            target="_blank"
            rel="noopener noreferrer"
          >
            View source
          </OrganicButton>
        </div>
      </div>
      <figure className={s.showcase}>
        <img
          src={project.image}
          alt={project.imageAlt}
          width="1440"
          height="1000"
        />
        <figcaption>Actual local application · {project.status}</figcaption>
      </figure>
      <div className={s.caseGrid}>
        <section>
          <p className={s.label}>01 / The idea</p>
          <h2>What it’s about.</h2>
          <p>{project.description}</p>
          <p>{project.objective}</p>
        </section>
        <section>
          <p className={s.label}>02 / In practice</p>
          <h2>What you can explore.</h2>
          <ul>
            {project.features.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <p className={s.label}>03 / Behind the interface</p>
          <h2>A deliberate choice.</h2>
          <p>{project.decision}</p>
        </section>
        <section>
          <p className={s.label}>04 / Built with</p>
          <h2>The tools.</h2>
          <ul className={s.techList}>
            {project.tech.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
      {project.gallery.map((photo) => (
        <figure className={s.showcase} key={photo.src}>
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            width="1440"
            height="1000"
          />
          <figcaption>{photo.caption}</figcaption>
        </figure>
      ))}
      <div className={s.nextProject}>
        <span className={s.label}>Continue exploring</span>
        <Link
          to={`${base}/projects/${projects[(projects.indexOf(project) + 1) % projects.length].slug}`}
        >
          {projects[(projects.indexOf(project) + 1) % projects.length].title}
          <ArrowUpRight />
        </Link>
      </div>
    </article>
  );
}

export function AboutPage({ base }) {
  return (
    <div className={s.pageContent}>
      <section className={s.aboutHero}>
        <OrganicArt slot="about" />
        <div>
          <EditorialHeading eyebrow="The person behind the work">
            About <em>Me.</em>
          </EditorialHeading>
          <p className={s.lead}>
            A technical mind.
            <br />
            An eye for the experience.
          </p>
          <p>
            I’m Alex Gómez, a Multimedia Engineering graduate from the
            University of Alicante.
          </p>
          <p>
            I enjoy building software and understanding how its pieces fit
            together: the interface, the logic and the data. My background in
            multimedia, 3D and interactive experiences also shapes how I think
            about design.
          </p>
          <p>
            I’m developing my skills through practical projects, from web
            applications and databases to AI integrations. I like learning
            something new and finding a real use for it.
          </p>
          <OrganicButton href={appConfig.cvLinks.ats} download secondary>
            Download my CV
          </OrganicButton>
        </div>
      </section>
      <section className={s.aboutNotes}>
        <div>
          <p className={s.label}>Education</p>
          <h2>Multimedia Engineering</h2>
          <p>University of Alicante</p>
        </div>
        <div>
          <p className={s.label}>Areas I explore</p>
          <h2>From interface to data.</h2>
          <p>
            Software development, web applications, backend systems, SQL and AI
            workflows — connected by an interest in making things work well.
          </p>
        </div>
      </section>
      <ContactSection base={base} />
    </div>
  );
}

export function ContactPage() {
  return (
    <div className={s.pageContent}>
      <section className={s.contactHero}>
        <div>
          <EditorialHeading eyebrow="Start a conversation">
            Let’s build
            <br />
            something <em>great.</em>
          </EditorialHeading>
          <p>
            An opportunity, a project or simply a question.
            <br />
            I’d be happy to hear from you.
          </p>
          <a className={s.email} href={`mailto:${contact.email}`}>
            {contact.email}
            <ArrowUpRight size={21} />
          </a>
          <div className={s.socials}>
            <a href={contact.github} target="_blank" rel="noopener noreferrer">
              GitHub <ArrowUpRight size={15} />
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
        <OrganicArt slot="contact" />
      </section>
      <ContactForm />
    </div>
  );
}

export function MissingPage({ base }) {
  return (
    <div className={s.pageContent}>
      <EditorialHeading eyebrow="404 / Uncharted territory">
        Nothing here.
        <br />
        <em>Yet.</em>
      </EditorialHeading>
      <OrganicButton to={base}>Back to the portfolio</OrganicButton>
    </div>
  );
}
