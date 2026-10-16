import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  GitBranch,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import Brand from "./components/Brand";
import { metadataFor } from "./metadata";
import { motionTokens } from "./motion";
import "./styles.css";

const Landing = lazy(() => import("./pages/Landing"));
const Workspace = lazy(() => import("./pages/Workspace"));

class FeatureBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="dp-empty">
        <h1>That view couldn’t load.</h1>
        <p>The page may have been updated. Reload to try again.</p>
        <button
          className="dp-button dp-primary"
          onClick={() => window.location.reload()}
        >
          Reload page
        </button>
        <Link className="dp-button dp-secondary" to="/">
          Return to portfolio
        </Link>
      </div>
    ) : (
      this.props.children
    );
  }
}
function RouteMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const metadata = metadataFor(pathname);
    const previousTitle = document.title;
    document.title = metadata.title;
    const undo: (() => void)[] = [];
    const tags = [
      ["name", "description", metadata.description],
      ["name", "robots", metadata.robots],
      ["property", "og:title", metadata.title],
      ["property", "og:description", metadata.description],
      ["property", "og:url", `https://alexgl.dev${metadata.path}`],
      ["property", "og:image", "https://alexgl.dev/devpulse-og.svg"],
      [
        "property",
        "og:image:alt",
        "DevPulse AI — Understand your code. Improve what matters.",
      ],
      ["name", "twitter:image", "https://alexgl.dev/devpulse-og.svg"],
      [
        "name",
        "twitter:image:alt",
        "DevPulse AI — Understand your code. Improve what matters.",
      ],
      ["name", "twitter:title", metadata.title],
      ["name", "twitter:description", metadata.description],
      ["name", "twitter:url", `https://alexgl.dev${metadata.path}`],
    ];
    for (const [attribute, key, value] of tags) {
      const existing = document.head.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${key}"]`,
      );
      const element = existing ?? document.createElement("meta");
      const previous = element.getAttribute("content");
      element.setAttribute(attribute, key);
      element.content = value;
      if (!existing) document.head.append(element);
      undo.push(() => {
        if (!existing) element.remove();
        else if (previous !== null) element.content = previous;
        else element.removeAttribute("content");
      });
    }
    const existing = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    const canonical = existing ?? document.createElement("link");
    const previous = canonical.getAttribute("href");
    canonical.rel = "canonical";
    canonical.href = `https://alexgl.dev${metadata.path}`;
    if (!existing) document.head.append(canonical);
    return () => {
      document.title = previousTitle;
      undo.forEach((fn) => fn());
      if (!existing) canonical.remove();
      else if (previous) canonical.href = previous;
    };
  }, [pathname]);
  return null;
}
function Navigation({ close }: { close?: () => void }) {
  return (
    <>
      <NavLink end to="/devpulse" onClick={close}>
        Product
      </NavLink>
      <NavLink end to="/devpulse/explore" onClick={close}>
        <LayoutDashboard size={16} />
        Overview
      </NavLink>
      <NavLink to="/devpulse/explore/architecture" onClick={close}>
        <GitBranch size={16} />
        Architecture
      </NavLink>
    </>
  );
}
function Shell() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const reduced = useReducedMotion();
  const [menu, setMenu] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const main = useRef<HTMLElement>(null);
  const previousPath = useRef<string | null>(null);
  const workspace = location.pathname.startsWith("/devpulse/explore");
  useEffect(() => {
    // Query-only module selection must preserve the active control and scroll.
    if (previousPath.current === location.pathname) return;
    previousPath.current = location.pathname;
    if (navigationType !== "POP")
      window.scrollTo({ top: 0, behavior: "instant" });
    // Focus the route container immediately; lazy children need not delay navigation.
    main.current?.focus({ preventScroll: true });
  }, [location.pathname, navigationType]);
  return (
    <div className="devpulse-root" data-reduced-motion={!!reduced}>
      <RouteMetadata />
      <a className="dp-skip" href="#dp-main">
        Skip to content
      </a>
      <header className="dp-header">
        <Brand />
        <nav className="dp-desktop-nav" aria-label="DevPulse navigation">
          <Navigation />
        </nav>
        <Link className="dp-portfolio-link" to="/">
          alexgl.dev <ArrowUpRight size={14} />
        </Link>
        <button
          ref={toggle}
          className="dp-menu-toggle dp-icon-button"
          aria-label={menu ? "Close navigation" : "Open navigation"}
          aria-expanded={menu}
          aria-controls="dp-mobile-nav"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      {menu && (
        <nav
          id="dp-mobile-nav"
          className="dp-mobile-nav"
          aria-label="Mobile DevPulse navigation"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setMenu(false);
              toggle.current?.focus();
            }
          }}
        >
          <Navigation close={() => setMenu(false)} />
          <Link to="/" onClick={() => setMenu(false)}>
            <ArrowLeft size={16} />
            Back to portfolio
          </Link>
        </nav>
      )}
      <div className={workspace ? "dp-shell-workspace" : ""}>
        {workspace && (
          <aside className="dp-sidebar">
            <span className="dp-eyebrow">WORKSPACE</span>
            <div className="dp-sidebar-repo">
              <span className="dp-repo-small">D</span>
              <div>
                dispatch<small>Local sample / v1.0.0</small>
              </div>
            </div>
            <nav aria-label="Workspace navigation">
              <NavLink end to="/devpulse/explore">
                <LayoutDashboard size={17} />
                Overview
              </NavLink>
              <NavLink to="/devpulse/explore/architecture">
                <GitBranch size={17} />
                Architecture
              </NavLink>
            </nav>
            <div className="dp-sidebar-note">
              <span className="dp-eyebrow">BUILT ON EVIDENCE</span>
              <p>
                Real source files.
                <br />
                Deterministic relationships.
                <br />
                No simulated intelligence.
              </p>
              <Link to="/devpulse">
                About this project <ArrowUpRight size={14} />
              </Link>
            </div>
          </aside>
        )}
        <main id="dp-main" ref={main} tabIndex={-1}>
          <FeatureBoundary>
            <motion.div
              key={location.pathname}
              initial={reduced ? false : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduced ? 0 : motionTokens.duration.route,
                ease: motionTokens.ease,
              }}
            >
              <Suspense
                fallback={
                  <div className="dp-loading" role="status">
                    Loading DevPulse…
                  </div>
                }
              >
                <Routes>
                  <Route index element={<Landing />} />
                  <Route path="explore" element={<Workspace />} />
                  <Route
                    path="explore/architecture"
                    element={<Workspace architecture />}
                  />
                  <Route
                    path="*"
                    element={
                      <div className="dp-empty dp-not-found">
                        <span className="dp-eyebrow">
                          404 / OUTSIDE THE GRAPH
                        </span>
                        <h1>This path leads nowhere.</h1>
                        <p>
                          Return to the sample and follow a connection that
                          exists.
                        </p>
                        <Link
                          className="dp-button dp-primary"
                          to="/devpulse/explore"
                        >
                          Explore the sample <ArrowUpRight size={17} />
                        </Link>
                      </div>
                    }
                  />
                </Routes>
              </Suspense>
            </motion.div>
          </FeatureBoundary>
        </main>
      </div>
      <footer className="dp-footer">
        <Brand />
        <span>Software intelligence. Human judgment.</span>
        <nav aria-label="Footer navigation">
          <Link to="/devpulse/explore">Explore sample</Link>
          <Link to="/">
            Alex Gómez <ArrowUpRight size={13} />
          </Link>
        </nav>
        <span className="dp-footer-status">PHASE 01 · FRONTEND EXPLORER</span>
      </footer>
    </div>
  );
}
export default function DevPulseApp() {
  return (
    <MotionConfig reducedMotion="user">
      <Shell />
    </MotionConfig>
  );
}
