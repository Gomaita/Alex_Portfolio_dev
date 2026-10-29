import { useLayoutEffect, useRef } from "react";
import {
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { variants } from "./data";
import {
  HomePage,
  ProjectsPage,
  ProjectPage,
  AboutPage,
  ContactPage,
  MissingPage,
} from "./pages";
import s from "./Organic.module.css";

function Studio() {
  const { variant } = useParams();
  const location = useLocation();
  const main = useRef(null);
  const previousPath = useRef(location.pathname);
  const base = `/preview/organic/${variant}`;
  const suffix = location.pathname.slice(base.length);
  const selection = variants.find((item) => item.id === variant);

  useLayoutEffect(() => {
    const title = document.title;
    const restore = [];
    const entries = [
      ["robots", "noindex, nofollow"],
      [
        "description",
        "Local design study for Alex Gómez’s software portfolio.",
      ],
      ["theme-color", "#faf9f6"],
    ];
    entries.forEach(([name, content]) => {
      const existing = document.head.querySelector(`meta[name="${name}"]`);
      const meta = existing || document.createElement("meta");
      const previous = meta.getAttribute("content");
      meta.name = name;
      meta.content = content;
      if (!existing) document.head.append(meta);
      restore.push(() => {
        if (!existing) meta.remove();
        else if (previous === null) meta.removeAttribute("content");
        else meta.setAttribute("content", previous);
      });
    });
    const style = document.documentElement.style;
    const oldScroll = style.getPropertyValue("scroll-behavior");
    const oldPriority = style.getPropertyPriority("scroll-behavior");
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      style.setProperty(
        "scroll-behavior",
        preference.matches ? "auto" : "smooth",
      );
    update();
    preference.addEventListener("change", update);
    return () => {
      document.title = title;
      restore.forEach((reset) => reset());
      preference.removeEventListener("change", update);
      if (oldScroll)
        style.setProperty("scroll-behavior", oldScroll, oldPriority);
      else style.removeProperty("scroll-behavior");
    };
  }, []);

  useLayoutEffect(() => {
    document.title = `${selection?.name || "Design preview"} — Alex Gómez`;
    if (previousPath.current !== location.pathname) {
      main.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
      previousPath.current = location.pathname;
    }
  }, [location.pathname, selection]);

  if (!selection) return <Navigate replace to="/preview/organic/c" />;

  return (
    <div className={s.studio} data-variant={variant}>
      <a href="#organic-main" className={s.skip}>
        Skip to content
      </a>
      <aside className={s.previewBar} aria-label="Design preview controls">
        <span>
          LOCAL DESIGN STUDY{" "}
          <span className={s.previewBarDetail}>/ SOFT ORGANIC EDITORIAL</span>
        </span>
        <div>
          {variants.map((item) => (
            <Link
              key={item.id}
              to={`/preview/organic/${item.id}${suffix}${location.search}`}
              aria-current={variant === item.id ? "page" : undefined}
              aria-label={`${item.id.toUpperCase()} ${item.name}`}
              title={item.description}
            >
              <span>{item.id.toUpperCase()}</span>
              <span className={s.variantName}>{item.name}</span>
            </Link>
          ))}
        </div>
      </aside>
      <header className={s.header}>
        <nav className={s.nav} aria-label="Organic portfolio navigation">
          <Link className={s.logo} to={base}>
            alexgl<span>.dev</span>
          </Link>
          <div className={s.navLinks}>
            <Link to={`${base}#organic-work`}>Work</Link>
            <NavLink to={`${base}/projects`}>Projects</NavLink>
            <NavLink to={`${base}/about`}>About</NavLink>
            <NavLink to={`${base}/contact`}>Contact</NavLink>
          </div>
          <Link className={s.navTalk} to={`${base}/contact`}>
            Let’s talk <ArrowUpRight size={15} />
          </Link>
        </nav>
      </header>
      <main ref={main} id="organic-main" tabIndex={-1} className={s.main}>
        <HashScroll />
        <Routes>
          <Route index element={<HomePage base={base} />} />
          <Route path="projects" element={<ProjectsPage base={base} />} />
          <Route path="projects/:slug" element={<ProjectPage base={base} />} />
          <Route path="about" element={<AboutPage base={base} />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<MissingPage base={base} />} />
        </Routes>
      </main>
      <footer className={s.footer}>
        <Link className={s.logo} to={base}>
          alexgl<span>.dev</span>
        </Link>
        <p>Built with curiosity. Shaped with care.</p>
        <span>© {new Date().getFullYear()} Alex Gómez</span>
      </footer>
    </div>
  );
}

function HashScroll() {
  const { pathname, hash } = useLocation();
  useLayoutEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() =>
      document.getElementById(hash.slice(1))?.scrollIntoView(),
    );
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}

export default function OrganicPreview() {
  return (
    <Routes>
      <Route
        path="/preview/organic"
        element={<Navigate replace to="/preview/organic/c" />}
      />
      <Route path="/preview/organic/:variant/*" element={<Studio />} />
    </Routes>
  );
}
