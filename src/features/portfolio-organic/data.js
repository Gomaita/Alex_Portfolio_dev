import devpulse from "./assets/devpulse.jpg";
import architecture from "./assets/architecture.jpg";
import nutricore from "./assets/nutricore.jpg";
import inboxflow from "./assets/inboxflow.jpg";
import sql from "./assets/sql.jpg";

export const variants = [
  {
    id: "a",
    name: "Editorial Air",
    description: "Quiet, asymmetric, spacious.",
  },
  {
    id: "b",
    name: "Fluid Sculpture",
    description: "Sculptural, layered, expressive.",
  },
  {
    id: "c",
    name: "Balanced Organic",
    description: "Editorial clarity, organic character.",
  },
];

// Import your own photos here, then assign src. Never stretch or synthesize a face.
export const portraits = {
  hero: { src: null, alt: "Alex Gómez", position: "50% 40%" },
  about: { src: null, alt: "Alex Gómez", position: "50% 50%" },
  contact: { src: null, alt: "Alex Gómez", position: "50% 50%" },
};

export const projects = [
  {
    slug: "devpulse",
    title: "DevPulse AI",
    category: "Developer tools",
    index: "01",
    intro: "A closer look at the code behind an application.",
    description:
      "Explore a curated repository through source files, symbols and an interactive architecture graph. A separate private-project foundation prepares the next stage.",
    status:
      "Public sample available. Private backend infrastructure acceptance is pending; automated AI analysis is not available.",
    objective:
      "Make a codebase easier to understand through traceable source evidence, rather than unsupported conclusions.",
    features: [
      "Browse the curated sample and inspect source lines.",
      "Trace imports in a navigable architecture graph.",
      "Explore modules, symbols and dependencies.",
    ],
    tech: ["React", "TypeScript", "React Flow", "FastAPI", "PostgreSQL"],
    decision:
      "Keep the public sample separate from private project data. Every source reference belongs to an exact snapshot. The Python API and worker remain independent of the existing portfolio.",
    href: "/devpulse",
    source:
      "https://github.com/Gomaita/Alex_Portfolio_dev/tree/master/src/features/devpulse",
    image: devpulse,
    imageAlt: "Actual DevPulse public sample explorer with source modules",
    gallery: [
      {
        src: architecture,
        alt: "Actual DevPulse sample architecture graph",
        caption:
          "The architecture explorer — dependencies from the curated sample.",
      },
    ],
  },
  {
    slug: "nutricore",
    title: "NutriCore",
    category: "Applications",
    index: "02",
    intro: "A little structure for everyday routines.",
    description:
      "An editable nutrition and training application with meal plans, workout routines and progress charts.",
    status:
      "Local demo. Browser storage and role-based views, without production authentication or a connected database.",
    objective:
      "Bring planning, editing and tracking together in a usable application with a complete local workflow.",
    features: [
      "Edit meal plans and training routines.",
      "Manage local user profiles and templates.",
      "Track weight changes through progress charts.",
    ],
    tech: ["React", "JavaScript", "Recharts", "localStorage"],
    decision:
      "Use browser persistence to make the application explorable without an account. Keep the UI role switch explicitly separate from real authorization.",
    href: "/nutricore",
    source:
      "https://github.com/Gomaita/Alex_Portfolio_dev/blob/master/src/pages/NutriCore.jsx",
    image: nutricore,
    imageAlt:
      "Actual NutriCore local demo dashboard with sample nutrition and training data",
    gallery: [],
  },
  {
    slug: "inboxflow",
    title: "InboxFlow AI",
    category: "AI workflows",
    index: "03",
    intro: "From a message to a clearer next step.",
    description:
      "A message-processing demo that extracts priorities, tasks and suggested replies as structured information.",
    status:
      "Portfolio demo. Groq integration when configured; a labeled rule-based fallback otherwise. No emails or tasks are sent automatically.",
    objective:
      "Turn unstructured text into information that can be reviewed and acted on by a person.",
    features: [
      "Classify a message and identify its priority.",
      "Extract tasks and a suggested reply.",
      "Inspect structured JSON and the processing mode.",
    ],
    tech: ["React", "Groq API", "Cloudflare Pages Functions"],
    decision:
      "Validate provider output and keep credentials on the server. Clearly distinguish actual model output from the deterministic fallback.",
    href: "/ai-message-processor",
    source:
      "https://github.com/Gomaita/Alex_Portfolio_dev/blob/master/src/pages/InboxFlowAI.jsx",
    image: inboxflow,
    imageAlt:
      "Actual InboxFlow AI message-processing interface before submitting a message",
    gallery: [],
  },
  {
    slug: "sql-playground",
    title: "SQL Query Playground",
    category: "Data & SQL",
    index: "04",
    intro: "Different questions. A different view of the data.",
    description:
      "An interactive learning interface for SQL queries, filters, joins and grouped results.",
    status:
      "Educational demo with prepared queries and result sets. It does not execute arbitrary SQL or connect to a database.",
    objective:
      "Make the relationship between a query and its result easier to see and understand.",
    features: [
      "Switch between prepared query examples.",
      "Read explanations of SQL concepts.",
      "Compare tabular results and copy the query.",
    ],
    tech: ["React", "SQL concepts", "JavaScript"],
    decision:
      "Use deterministic sample data so query examples can be explored safely without database configuration.",
    href: "/portfolio/sql-query-playground",
    source:
      "https://github.com/Gomaita/Alex_Portfolio_dev/blob/master/src/components/demos/SQLQueryPlayground.jsx",
    image: sql,
    imageAlt:
      "Actual SQL Query Playground with a prepared query and sample result table",
    gallery: [],
  },
];
