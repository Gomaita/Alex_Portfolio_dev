import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("accessibility, keyboard graph selection, pan and narrow reflow", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/devpulse",
      "/devpulse/explore",
      "/devpulse/explore/architecture?file=services%2FtaskService.ts",
    ]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      if (route.includes("explore"))
        await expect(page.locator(".dp-code-viewer")).toBeVisible();
      if (route.includes("architecture"))
        await expect(page.locator(".react-flow__node")).toHaveCount(7);
      const results = await new AxeBuilder({ page })
        .include(".devpulse-root")
        .analyze();
      expect(results.violations).toEqual([]);
    }
  }
  const node = page
    .locator(".react-flow__node")
    .filter({ hasText: "validation.ts" });
  await node.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".dp-inspector h2")).toHaveText("validation.ts");
  await expect(node).toBeFocused();
  const box = (await page.locator(".react-flow__pane").boundingBox())!;
  const before = await page
    .locator(".react-flow__viewport")
    .getAttribute("style");
  await page.mouse.move(box.x + 30, box.y + 30);
  await page.mouse.down();
  await page.mouse.move(box.x + 110, box.y + 80, { steps: 5 });
  await page.mouse.up();
  await expect(page.locator(".react-flow__viewport")).not.toHaveAttribute(
    "style",
    before!,
  );
  await page.setViewportSize({ width: 320, height: 800 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("link", { name: "Read selected source" }).click();
  await expect(page.locator(".dp-inspector")).toBeInViewport();
});
