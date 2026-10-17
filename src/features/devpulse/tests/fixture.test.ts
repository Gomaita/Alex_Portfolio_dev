import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import {
  repository,
  files,
  edges,
  incoming,
  outgoing,
  metrics,
} from "../data/repository";

describe("sample evidence integrity", () => {
  it("includes every fixture file exactly once", () => {
    const root = path.resolve("src/features/devpulse/fixture");
    const onDisk = fs
      .readdirSync(root, { recursive: true })
      .map(String)
      .filter((f) => f.endsWith(".ts"))
      .map((f) => f.replaceAll("\\", "/"));
    expect(files.map((f) => f.path).sort()).toEqual(onDisk.sort());
    expect(new Set(files.map((f) => f.id)).size).toBe(files.length);
  });
  for (const file of files)
    it(`${file.path}: source, symbols, import evidence and hash`, () => {
      const source = fs
        .readFileSync(`src/features/devpulse/fixture/${file.path}`, "utf8")
        .replace(/\r\n/g, "\n");
      expect(file.source).toBe(source);
      expect(file.sha256).toBe(
        createHash("sha256").update(source).digest("hex"),
      );
      expect(file.lines).toBe(source.trimEnd().split("\n").length);
      const ast = ts.createSourceFile(
        file.path,
        source,
        ts.ScriptTarget.Latest,
        true,
      );
      const imports = ast.statements.filter(ts.isImportDeclaration);
      expect(outgoing(file.id)).toHaveLength(imports.length);
      for (const symbol of file.symbols) {
        expect(symbol.startLine).toBeGreaterThan(0);
        expect(symbol.endLine).toBeLessThanOrEqual(file.lines);
        expect(
          source
            .split("\n")
            .slice(symbol.startLine - 1, symbol.endLine)
            .join("\n"),
        ).toContain(symbol.name);
      }
      for (const edge of outgoing(file.id)) {
        expect(files.some((f) => f.id === edge.target)).toBe(true);
        const declaration = imports.find(
          (i) =>
            ast.getLineAndCharacterOfPosition(i.getStart()).line + 1 ===
            edge.line,
        )!;
        const specifier = (declaration.moduleSpecifier as ts.StringLiteral)
          .text;
        expect(
          path.posix.normalize(
            path.posix.join(path.posix.dirname(file.path), specifier),
          ) + ".ts",
        ).toBe(edge.target);
      }
    });
  it("reports structural counts and immutable content identity only", () => {
    expect(metrics.files).toBe(7);
    expect(metrics.imports).toBe(edges.length);
    expect(incoming("services/taskService.ts").map((e) => e.source)).toEqual(
      expect.arrayContaining(["app.ts", "api/router.ts"]),
    );
    expect(repository.status).toBe("local-fixture");
    expect(repository.snapshotHash).toBe(
      createHash("sha256")
        .update(files.map((f) => `${f.id}:${f.sha256}`).join("\n"))
        .digest("hex"),
    );
  });
});
