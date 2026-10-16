# Dispatch — local source fixture

First-party sample authored for DevPulse AI. This is not an external GitHub repository, a running HTTP service or an AI analysis result. The seven TypeScript modules describe a small task application with in-memory storage. They are bundled as text for inspection, not imported or executed by the DevPulse frontend.

`../data/catalog.json` contains authored descriptions, layers and stable graph coordinates. `../scripts/snapshot.mjs` parses the source with TypeScript and generates `../data/snapshot.json`: normalized LF source, SHA-256 file/tree identities, import locations and top-level symbol ranges. No timestamps or randomness affect output. Only relative imports within this fixture are supported. This generator is not a production ingestion parser.

Run `npm run devpulse:fixture` after source changes and `npm run devpulse:fixture:check` to check reproducibility. Tests also compare the complete TypeScript file inventory, source hashes, symbol spans and import targets. Source metrics count TypeScript files only; trailing newline is not counted as an extra line. Type-only imports remain in the structural graph and are drawn dashed.

Descriptions and layout are authored documentation, not AI reasoning. Source files are first-party project material; third-party UI libraries retain their own licenses. Future imported repositories require the security boundary documented in `docs/devpulse/SECURITY.md`.
