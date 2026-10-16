import { describe, it, expect } from "vitest";
import { metadataFor } from "../metadata";
// Exercise the actual Pages middleware, including its existing route branches.
// @ts-expect-error Existing portfolio Functions are JavaScript.
import { onRequest } from "../../../../functions/_middleware.js";

describe("server metadata and portfolio preservation", () => {
  for (const path of [
    "/devpulse",
    "/devpulse/explore",
    "/devpulse/explore/architecture",
  ])
    it(path, async () => {
      const response = await onRequest({
        request: new Request(`https://alexgl.dev${path}`),
        next: async () =>
          new Response(
            '<html><head><title>Old</title></head><body><div id="root"></div></body></html>',
            { headers: { "Content-Type": "text/html" } },
          ),
      });
      const html = await response.text();
      expect(html).toContain(metadataFor(path).title);
      expect(html).toContain(`https://alexgl.dev${path}`);
      expect(html).toContain("devpulse-og.svg");
      expect(html).toContain(`content="${metadataFor(path).robots}"`);
    });
  for (const [path, title] of [
    ["/", "Alex Gómez | Junior Software Developer"],
    ["/3d", "Alex Gómez | 3D Environment &amp; Prop Artist"],
    ["/portfolio", "Alex Gómez | Software Portfolio"],
  ])
    it(`preserves ${path}`, async () => {
      const response = await onRequest({
        request: new Request(`https://alexgl.dev${path}`),
        next: async () =>
          new Response("<html><head></head></html>", {
            headers: { "Content-Type": "text/html" },
          }),
      });
      expect(await response.text()).toContain(title);
    });
  it("leaves API JSON unchanged", async () => {
    const response = new Response('{"ok":true}', {
      headers: { "Content-Type": "application/json" },
    });
    expect(
      await onRequest({
        request: new Request("https://alexgl.dev/api/health"),
        next: async () => response,
      }),
    ).toBe(response);
  });
});
