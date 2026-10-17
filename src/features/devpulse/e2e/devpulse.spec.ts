import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("visitor journey, source navigation, URL history and copy", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/devpulse");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Understand your code.",
  );
  await page
    .getByRole("link", { name: "Explore the sample", exact: true })
    .click();
  await expect(
    page.getByText("First-party local fixture. No live scan or AI analysis."),
  ).toBeVisible();
  await page.getByRole("button", { name: /domain\/task.ts Domain/ }).click();
  await expect(
    page.getByRole("region", { name: "Source code for domain/task.ts" }),
  ).toContainText("export function completeTask");
  await page.getByRole("button", { name: /completeTask.*L9/ }).click();
  await expect(page.locator(".dp-code-line.is-highlighted")).toContainText(
    "export function completeTask",
  );
  await page.getByRole("button", { name: "Copy source", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "export function completeTask",
  );
  await page.getByRole("button", { name: "Toggle code wrapping" }).click();
  await expect(page.locator("pre")).toHaveClass("dp-code-wrap");
  await page
    .getByRole("button", { name: /services\/taskService.ts L1/ })
    .click();
  await expect(page.locator(".dp-code-line.is-highlighted")).toContainText(
    "from '../domain/task'",
  );
  await page.goBack();
  await expect(
    page.getByRole("region", { name: "Source code for domain/task.ts" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("region", { name: "Source code for domain/task.ts" }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Filter modules" })
    .fill("does-not-exist");
  await expect(page.getByText(/No modules match/)).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(
    page.getByRole("button", { name: /domain\/task.ts Domain/ }),
  ).toBeVisible();
});

test("graph supports selection, directions, zoom, fit, reset and keyboard alternative", async ({
  page,
}) => {
  await page.goto("/devpulse/explore/architecture");
  const service = page
    .locator(".react-flow__node")
    .filter({ hasText: "taskService.ts" });
  await service.click();
  await expect(page.locator(".dp-inspector h2")).toHaveText("taskService.ts");
  await expect(page.locator(".dp-outgoing")).toHaveCount(3);
  await expect(page.locator(".dp-incoming")).toHaveCount(2);
  const viewport = page.locator(".react-flow__viewport");
  const before = await viewport.getAttribute("style");
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(viewport).not.toHaveAttribute("style", before!);
  await page.getByRole("button", { name: "Fit graph to view" }).click();
  await page.getByRole("button", { name: "Reset graph selection" }).click();
  await expect(page.getByText("The details are in the code.")).toBeVisible();
  const domain = page.getByRole("button", { name: /domain\/task.ts Domain/ });
  await domain.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".dp-inspector h2")).toHaveText("task.ts");
  await page.reload();
  await expect(page.locator(".dp-inspector h2")).toHaveText("task.ts");
});

test("responsive pages, visual captures and accessible interactions", async ({
  page,
}, testInfo) => {
  test.setTimeout(90000);
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/devpulse",
      "/devpulse/explore",
      "/devpulse/explore/architecture?file=services%2FtaskService.ts",
    ]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      if (route.includes("architecture"))
        await expect(page.locator(".react-flow__node")).toHaveCount(7);
      if (route.includes("explore"))
        await expect(page.locator(".dp-code-viewer")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      if (route === "/devpulse") {
        for (const section of await page.locator("main section").all()) {
          await section.scrollIntoViewIfNeeded();
          await page.waitForTimeout(550);
        }
        await page.evaluate(() =>
          window.scrollTo({ top: 0, behavior: "instant" }),
        );
      }
      await page.screenshot({
        path: testInfo.outputPath(
          `${width}-${route.includes("architecture") ? "architecture" : route.includes("explore") ? "overview" : "landing"}.png`,
        ),
        fullPage: true,
        animations: "disabled",
      });
    }
  }
  const results = await new AxeBuilder({ page })
    .include(".devpulse-root")
    .analyze();
  expect(results.violations).toEqual([]);
});

test("mobile navigation, reduced motion, metadata, invalid file and not-found", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/devpulse");
  await expect(page.locator(".devpulse-root")).toHaveAttribute(
    "data-reduced-motion",
    "true",
  );
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Mobile DevPulse navigation" })
    .getByRole("link", { name: "Architecture" })
    .click();
  await expect(
    page.getByRole("navigation", { name: "Mobile DevPulse navigation" }),
  ).toHaveCount(0);
  await expect(page).toHaveTitle("Architecture explorer — DevPulse AI");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://alexgl.dev/devpulse/explore/architecture",
  );
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Mobile DevPulse navigation" })
    .getByRole("link", { name: "Product" })
    .focus();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
  await page.goto("/devpulse/explore/architecture?file=missing.ts");
  await expect(
    page.getByRole("heading", { name: "Module not found" }),
  ).toBeVisible();
  await page.goto("/devpulse/missing");
  await expect(
    page.getByRole("heading", { name: "This path leads nowhere." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Alex Gómez" }).click();
  await expect(page.locator(".devpulse-root")).toHaveCount(0);
  await expect(page).not.toHaveTitle(/DevPulse/);
});

test("existing route families still mount outside DevPulse", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/portfolio",
    "/about",
    "/contact",
    "/cheatsheets",
    "/3d",
    "/3d/projects",
    "/ai-chat",
    "/ai-message-processor",
    "/ai-operations-studio",
    "/ai-support-intelligence",
    "/nutricore",
    "/security-lab",
    "/blockchain-lab",
  ]) {
    await page.goto(route);
    await expect(page.locator("#root")).not.toBeEmpty();
    await expect(page.locator(".devpulse-root")).toHaveCount(0);
    await expect(page.locator("h1").first()).toBeVisible();
  }
});
