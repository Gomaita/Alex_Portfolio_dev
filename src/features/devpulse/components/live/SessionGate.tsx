import { useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, LockKeyhole, LogOut } from "lucide-react";
import { api, ApiError } from "../../api/client";
import type { Me } from "../../api/contracts";
import { ErrorNotice, Loading, useRequest } from "./shared";
export default function SessionGate({
  children,
}: {
  children: (me: Me, expire: () => void) => ReactNode;
}) {
  const session = useRequest((signal) => api.me(signal), []);
  const [params] = useSearchParams();
  const [logoutError, setLogoutError] = useState<unknown>();
  const [busy, setBusy] = useState(false);
  if (session.loading) return <Loading />;
  if (!session.data) {
    const signedOut =
      session.error instanceof ApiError && session.error.status === 401;
    return (
      <section className="dp-auth-panel">
        <div className="dp-auth-art" aria-hidden="true">
          <div className="dp-auth-grid" />
          <LockKeyhole size={44} strokeWidth={1} />
          <span>PRIVATE BY DESIGN</span>
          <div className="dp-auth-rail">
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="dp-auth-copy">
          <span className="dp-eyebrow">YOUR ENGINEERING WORKSPACE</span>
          <h1>
            A place for
            <br />
            your next project.
          </h1>
          <p>
            Keep your projects in a private workspace. Repository analysis comes
            next; your project foundation starts here.
          </p>
          {!signedOut && <ErrorNotice error={session.error} />}
          {params.get("auth") === "failed" && (
            <ErrorNotice
              error={
                new Error("Sign-in could not be completed. Please try again.")
              }
            />
          )}
          {api.configured && (
            <a className="dp-button dp-primary" href={api.loginUrl}>
              Sign in securely <ArrowRight size={17} />
            </a>
          )}
          {!signedOut && api.configured && (
            <button
              className="dp-button dp-secondary"
              onClick={session.refresh}
            >
              Retry connection
            </button>
          )}
          <Link className="dp-auth-sample" to="/devpulse/explore">
            Explore the public sample <ArrowRight size={15} />
          </Link>
          <small>
            No account needed for the sample. Private projects are never shown
            there.
          </small>
        </div>
      </section>
    );
  }
  const signOut = async () => {
    setBusy(true);
    setLogoutError(undefined);
    try {
      await api.logout();
      session.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) session.refresh();
      else setLogoutError(error);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="dp-live-container">
      <div className="dp-live-identity">
        <span>
          <LockKeyhole size={13} /> PRIVATE WORKSPACE
        </span>
        <div>
          {session.data.display_name}
          <button
            aria-label="Sign out"
            disabled={busy}
            onClick={() => void signOut()}
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>
      <ErrorNotice error={logoutError} />
      {children(session.data, session.refresh)}
    </div>
  );
}
