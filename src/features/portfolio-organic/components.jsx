import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { portraits } from "./data";
import s from "./Organic.module.css";

export function EditorialHeading({ children, eyebrow, as: Tag = "h1" }) {
  return (
    <div className={s.heading}>
      {eyebrow && <p className={s.label}>{eyebrow}</p>}
      <Tag>{children}</Tag>
    </div>
  );
}

export function OrganicButton({
  children,
  to,
  href,
  secondary = false,
  ...props
}) {
  const className = secondary ? s.secondary : s.button;
  return to ? (
    <Link className={className} to={to} {...props}>
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
    </Link>
  ) : (
    <a className={className} href={href} {...props}>
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  );
}

export function OvalPortrait({ slot = "hero" }) {
  const photo = portraits[slot];
  return (
    <div className={`${s.portrait} ${photo.src ? "" : s.portraitPlaceholder}`}>
      {photo.src ? (
        <img
          src={photo.src}
          alt={photo.alt}
          style={{ objectPosition: photo.position }}
          loading={slot === "hero" ? "eager" : "lazy"}
          decoding="async"
        />
      ) : (
        <div className={s.placeholderContents}>
          <span className={s.portraitMonogram} aria-hidden="true">
            ag.
          </span>
          <span>PERSONAL PORTRAIT</span>
          <small>Reserved for Alex’s photograph</small>
        </div>
      )}
    </div>
  );
}

export function OrganicArt({ slot = "hero", badges = false }) {
  return (
    <div className={s.art}>
      <div className={s.orbit} aria-hidden="true" />
      <div className={s.glassOne} aria-hidden="true" />
      <OvalPortrait slot={slot} />
      <div className={s.glassTwo} aria-hidden="true" />
      <div className={s.glassThree} aria-hidden="true" />
      {badges && (
        <>
          <span className={`${s.capsule} ${s.badgeOne}`}>Full Stack</span>
          <span className={`${s.capsule} ${s.badgeTwo}`}>Databases & SQL</span>
          <span className={`${s.capsule} ${s.badgeThree}`}>Applications</span>
        </>
      )}
      <span className={s.artCaption}>
        ALEX GÓMEZ <span>SOFTWARE & VISUAL THINKING</span>
      </span>
    </div>
  );
}

export function ProjectGallery({ projects, base }) {
  return (
    <div className={s.gallery}>
      {projects.map((project) => (
        <article key={project.slug} className={s.project}>
          <Link
            className={s.projectImage}
            to={`${base}/projects/${project.slug}`}
            aria-label={`View ${project.title} project`}
          >
            <img
              src={project.image}
              alt={project.imageAlt}
              loading="lazy"
              decoding="async"
              width="1440"
              height="1000"
            />
            <span className={s.imageArrow}>
              <ArrowUpRight size={23} />
            </span>
          </Link>
          <div className={s.projectCaption}>
            <span className={s.label}>
              {project.index} / {project.category}
            </span>
            <h3>
              <Link to={`${base}/projects/${project.slug}`}>
                {project.title}
              </Link>
            </h3>
            <p>{project.intro}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ContactSection({ base }) {
  return (
    <section className={s.contactSection}>
      <span className={s.label}>Good things begin with a conversation</span>
      <h2>
        Let’s build
        <br />
        something <em>great.</em>
      </h2>
      <OrganicButton to={`${base}/contact`}>Let’s talk</OrganicButton>
      <span className={s.contactLoop} aria-hidden="true" />
    </section>
  );
}

export function OrganicHero({ base }) {
  return (
    <section className={s.hero}>
      <div className={s.heroCopy}>
        <EditorialHeading eyebrow="Software portfolio">
          Building
          <br />
          software that
          <br />
          <em>flows.</em>
        </EditorialHeading>
        <p>
          I’m Alex Gómez. I turn ideas into working applications, with curiosity
          for the code and care for the experience.
        </p>
        <div className={s.actions}>
          <OrganicButton href="#organic-work">Explore my work</OrganicButton>
          <OrganicButton to={`${base}/about`} secondary>
            About me
          </OrganicButton>
        </div>
      </div>
      <OrganicArt badges />
      <div className={s.heroBottom}>
        <span>ENGINEERING MEETS VISUAL THINKING</span>
        <a href="#organic-work">
          Scroll to discover <ArrowDown size={14} />
        </a>
        <span>SELECTED WORK / 01—04</span>
      </div>
    </section>
  );
}
