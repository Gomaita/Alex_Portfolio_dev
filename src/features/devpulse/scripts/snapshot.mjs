import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
export function buildSnapshot() {
  const catalog = JSON.parse(
    fs.readFileSync(path.join(root, "data/catalog.json"), "utf8"),
  );
  const edges = [];
  const files = Object.entries(catalog).map(([id, metadata]) => {
    const source = fs
      .readFileSync(path.join(root, "fixture", id), "utf8")
      .replace(/\r\n/g, "\n");
    const ast = ts.createSourceFile(id, source, ts.ScriptTarget.Latest, true);
    const line = (position) =>
      ast.getLineAndCharacterOfPosition(position).line + 1;
    const symbols = [];
    for (const statement of ast.statements) {
      if (
        ts.isImportDeclaration(statement) &&
        ts.isStringLiteral(statement.moduleSpecifier)
      ) {
        const target =
          path.posix.normalize(
            path.posix.join(
              path.posix.dirname(id),
              statement.moduleSpecifier.text,
            ),
          ) + ".ts";
        if (!catalog[target])
          throw new Error(`Unresolved import: ${id} → ${target}`);
        edges.push({
          id: `${id}:${target}`,
          source: id,
          target,
          line: line(statement.getStart(ast)),
          kind: statement.importClause?.isTypeOnly ? "type-import" : "import",
        });
      }
      if (
        ts.isFunctionDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement)
      ) {
        symbols.push({
          name: statement.name?.text,
          kind: ts.SyntaxKind[statement.kind],
          startLine: line(statement.getStart(ast)),
          endLine: line(statement.end),
        });
      }
      if (ts.isVariableStatement(statement))
        for (const declaration of statement.declarationList.declarations) {
          symbols.push({
            name: declaration.name.getText(ast),
            kind: "Variable",
            startLine: line(statement.getStart(ast)),
            endLine: line(statement.end),
          });
        }
    }
    return {
      id,
      path: id,
      language: "TypeScript",
      ...metadata,
      source,
      sha256: createHash("sha256").update(source).digest("hex"),
      lines: source.trimEnd().split("\n").length,
      symbols,
    };
  });
  return {
    schemaVersion: 1,
    repository: {
      name: "dispatch",
      version: "1.0.0",
      provenance:
        "First-party local fixture · not an external GitHub repository",
      description:
        "A small task application with explicit boundaries between routing, services, domain and storage.",
    },
    snapshotHash: createHash("sha256")
      .update(files.map((f) => `${f.id}:${f.sha256}`).join("\n"))
      .digest("hex"),
    status: "local-fixture",
    files,
    edges,
  };
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const output = JSON.stringify(buildSnapshot(), null, 2) + "\n";
  const target = path.join(root, "data/snapshot.json");
  if (process.argv.includes("--check")) {
    if (fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n") !== output)
      throw new Error(
        "Fixture snapshot is stale. Run npm run devpulse:fixture",
      );
    console.log(
      "Fixture source, imports, symbols and hashes match the snapshot.",
    );
  } else fs.writeFileSync(target, output);
}
