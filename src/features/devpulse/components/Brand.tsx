import { Link } from "react-router-dom";

export default function Brand() {
  return (
    <Link className="dp-brand" to="/devpulse" aria-label="devpulseAI home">
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M3 18h7l4-12 5 21 4-13h6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M3 27h7M23 6h6" stroke="currentColor" opacity=".4" />
      </svg>
      <span>
        devpulse<span className="dp-brand-ai">AI</span>
      </span>
    </Link>
  );
}
