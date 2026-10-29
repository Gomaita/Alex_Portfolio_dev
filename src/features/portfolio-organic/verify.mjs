// Run against the local Vite server: node src/features/portfolio-organic/verify.mjs
// Does not submit messages, contact production APIs, or edit application data.
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
import process from "node:process";
import assert from "node:assert/strict";

const origin = "http://127.0.0.1:4180";
const output = "test-results/organic";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
let pagesChecked = 0;
try {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const variant of ["a", "b", "c"]) {
    for (const width of [1440, 1024, 768, 390, 375]) {
      await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
      for (const route of [
        "",
        "/projects",
        "/projects/devpulse",
        "/about",
        "/contact",
      ]) {
        await page.goto(`${origin}/preview/organic/${variant}${route}`);
        await expect(page.locator("main h1")).toBeVisible();
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
          "content",
          "noindex, nofollow",
        );
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          `Overflow: ${variant}${route} at ${width}`,
        );
        await page
          .locator("main img")
          .evaluateAll((images) =>
            Promise.all(images.map((image) => image.decode())),
          );
        if (width === 1440 || width === 390) {
          await page.screenshot({
            path: `${output}/${variant}-${route.replaceAll("/", "-") || "home"}-${width}.png`,
            fullPage: true,
          });
        }
        if (
          (variant === "c" && width === 390) ||
          (route === "" && width === 1440)
        ) {
          const audit = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze();
          assert.deepEqual(
            audit.violations.map((item) => ({
              id: item.id,
              nodes: item.nodes.map((node) => node.target),
            })),
            [],
            `Accessibility: ${variant}${route}`,
          );
        }
        pagesChecked++;
      }
    }
    process.stdout.write(
      `PASS: variant ${variant}, 5 pages × 5 viewport widths\n`,
    );
  }
  await page.goto(`${origin}/preview/organic/c/projects`);
  await page.getByRole("button", { name: "Data & SQL", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("1 project");
  await expect(
    page.getByRole("heading", { name: "SQL Query Playground" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "View SQL Query Playground project" })
    .click();
  await expect(page.locator("main h1")).toContainText("SQL Query Playground");
  await page
    .getByRole("link", { name: "B Fluid Sculpture", exact: true })
    .click();
  await expect(page).toHaveURL(/\/b\/projects\/sql-playground$/);
  for (const slug of ["nutricore", "inboxflow", "sql-playground"]) {
    await page.goto(`${origin}/preview/organic/c/projects/${slug}`);
    await expect(
      page.getByRole("link", { name: "Open application" }),
    ).toBeVisible();
    await page
      .locator("main img")
      .evaluateAll((images) =>
        Promise.all(images.map((image) => image.decode())),
      );
  }
  await page.goto(`${origin}/preview/organic/c/about`);
  const cv = await page
    .getByRole("link", { name: "Download my CV" })
    .getAttribute("href");
  assert.equal((await page.request.get(`${origin}${cv}`)).status(), 200);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await expect(page).toHaveURL(/\/c#organic-work$/);
  await expect(page.locator("#organic-work")).toBeInViewport();
  await page.goto(`${origin}/preview/organic/c/projects/devpulse`);
  await page.getByRole("link", { name: "Open application" }).click();
  await expect(page).toHaveURL(/\/devpulse$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "index,follow",
  );
  await page.goBack();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  await page.goto(`${origin}/preview/organic/c`);
  await expect(page.locator("main h1")).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  assert.deepEqual(errors, [], "No uncaught browser errors");
  process.stdout.write(
    `PASS: ${pagesChecked} page/viewport checks; accessibility, filters, variant switching, images, CV, anchors, keyboard, reduced motion and metadata lifecycle.\n`,
  );
} finally {
  await browser.close();
}
