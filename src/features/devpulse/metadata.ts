export function metadataFor(path: string) {
  if (path === "/devpulse" || path === "/devpulse/")
    return {
      title: "DevPulse AI — Understand your code",
      description:
        "Explore software architecture through real source evidence. A developer intelligence project by Alex Gómez.",
      path: "/devpulse",
      robots: "index,follow",
    };
  if (path === "/devpulse/explore")
    return {
      title: "Dispatch sample repository — DevPulse AI",
      description:
        "Inspect the source modules, symbols and dependencies of a reproducible TypeScript sample.",
      path,
      robots: "noindex,follow",
    };
  if (path === "/devpulse/explore/architecture")
    return {
      title: "Architecture explorer — DevPulse AI",
      description:
        "Trace real module imports and inspect their source in an interactive architecture explorer.",
      path,
      robots: "noindex,follow",
    };
  return {
    title: "Page not found — DevPulse AI",
    description:
      "This DevPulse page does not exist. Return to the sample repository.",
    path: "/devpulse",
    robots: "noindex,follow",
  };
}
