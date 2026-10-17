import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Browser-only API doubles. These are never bundled into the product and do not
// count as PostgreSQL/worker integration evidence.
async function mockApi(
  page: Page,
  options: { signedIn?: boolean; failure?: boolean; delay?: number } = {},
) {
  let signedIn = options.signedIn ?? true;
  let project: Record<string, unknown> | null = null;
  await page.route("http://127.0.0.1:8000/api/v1/**", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname.replace("/api/v1", "");
    const method = request.method();
    if (options.delay && path === "/me")
      await new Promise((resolve) => setTimeout(resolve, options.delay));
    const json = (body: unknown, status = 200) =>
      route.fulfill({ status, json: body });
    if (options.failure)
      return json(
        {
          error: {
            code: "unavailable",
            message: "Service unavailable.",
            request_id: "browser-test",
          },
        },
        503,
      );
    if (!signedIn)
      return json(
        { error: { code: "unauthenticated", message: "Sign in to continue." } },
        401,
      );
    if (path === "/me")
      return json({
        id: "user",
        display_name: "Test developer",
        csrf_token: "test-csrf",
        expires_at: "2099-01-01T00:00:00Z",
      });
    if (path === "/auth/logout") {
      signedIn = false;
      return route.fulfill({ status: 204 });
    }
    if (path.endsWith("/jobs"))
      return json({ items: [], total: 0, limit: 20, offset: 0 });
    if (path === "/projects" && method === "POST") {
      expect(request.headers()["x-csrf-token"]).toBe("test-csrf");
      project = {
        ...request.postDataJSON(),
        id: "project-1",
        visibility: "private",
        created_at: "2026-01-01T10:00:00Z",
        updated_at: "2026-01-01T10:00:00Z",
      };
      return json(project, 201);
    }
    if (path === "/projects")
      return json({
        items: project ? [project] : [],
        total: project ? 1 : 0,
        limit: 12,
        offset: 0,
      });
    if (method === "PATCH") {
      project = { ...project, ...request.postDataJSON() };
      return json(project);
    }
    if (method === "DELETE") {
      project = null;
      return route.fulfill({ status: 204 });
    }
    return project
      ? json(project)
      : json(
          { error: { code: "not_found", message: "Project not found." } },
          404,
        );
  });
}

test("private project CRUD, refresh persistence contract and logout", async ({
  page,
}) => {
  await mockApi(page);
  await page.goto("/devpulse/projects");
  await expect(
    page.getByRole("heading", { name: "Every system starts somewhere." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "New project", exact: true }).click();
  await page.getByLabel("Project name").fill("Dispatch platform");
  await page.getByLabel("Description").fill("A private engineering project");
  await page
    .getByRole("button", { name: "Create project", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Dispatch platform",
  );
  await expect(
    page.getByText("No infrastructure tests yet.", { exact: false }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Dispatch platform",
  );
  await page.getByRole("button", { name: "Edit project", exact: true }).click();
  await page.getByLabel("Project name").fill("Dispatch revised");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Dispatch revised",
  );
  await page
    .getByRole("link", { name: "Projects", exact: true })
    .last()
    .click();
  await expect(
    page.getByRole("heading", { name: "Dispatch revised", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Dispatch revised.*Private/ }).click();
  await page
    .getByRole("button", { name: "Delete project", exact: true })
    .click();
  await page.getByRole("button", { name: "Keep project" }).click();
  await page
    .getByRole("button", { name: "Delete project", exact: true })
    .click();
  await page.getByRole("button", { name: "Confirm deletion" }).click();
  await expect(
    page.getByRole("heading", { name: "Every system starts somewhere." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "Sign in securely" }),
  ).toHaveAttribute("href", "http://127.0.0.1:8000/api/v1/auth/login");
});

test("protected routes, loading, failures and independent public sample", async ({
  page,
}) => {
  await mockApi(page, { signedIn: false, delay: 300 });
  await page.goto("/devpulse/projects/new");
  await expect(page.getByRole("status")).toContainText(
    "Loading your workspace",
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A place for",
  );
  await expect(page.getByLabel("Project name")).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex,nofollow",
  );
  await page.unrouteAll();
  await mockApi(page, { failure: true });
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("Service unavailable");
  await page.getByRole("link", { name: "Explore the public sample" }).click();
  await expect(
    page.getByText("First-party local fixture. No live scan or AI analysis."),
  ).toBeVisible();
});

test("private views reflow and pass automated accessibility checks", async ({
  page,
}) => {
  await mockApi(page);
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 960 });
    for (const path of ["/devpulse/projects", "/devpulse/projects/new"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `test-results/devpulse/live-${path.endsWith("new") ? "new" : "list"}-${width}.png`,
        fullPage: true,
      });
      if ([390, 1440].includes(width)) {
        expect(
          (await new AxeBuilder({ page }).include(".devpulse-root").analyze())
            .violations,
        ).toEqual([]);
      }
    }
  }
});

test("signed-out screen remains accessible on mobile", async ({ page }) => {
  await mockApi(page, { signedIn: false });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/devpulse/projects");
  await expect(
    page.getByRole("link", { name: "Sign in securely" }),
  ).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).include(".devpulse-root").analyze())
      .violations,
  ).toEqual([]);
  await page.screenshot({
    path: "test-results/devpulse/live-sign-in-390.png",
    fullPage: true,
  });
});

test("job submission and cancellation use API state; detail layout is accessible", async ({
  page,
}) => {
  await mockApi(page);
  let status: string | null = null;
  const job = () => ({
    id: "job-1",
    project_id: "project-1",
    job_type: "diagnostic",
    status,
    progress: status === "completed" ? 100 : 0,
    stage:
      status === "completed"
        ? "infrastructure_verified"
        : status === "cancelled"
          ? "cancelled"
          : "awaiting_worker",
    error_category: null,
    attempt_count: status === "completed" ? 1 : 0,
    cancel_requested: status === "cancelled",
    created_at: "2026-01-01T10:00:00Z",
    started_at: null,
    completed_at: null,
  });
  await page.route("**/api/v1/projects/project-1/jobs**", async (route) => {
    if (route.request().url().endsWith("/cancel")) {
      status = "cancelled";
      return route.fulfill({ json: job() });
    }
    if (route.request().method() === "POST") {
      expect(route.request().headers()["idempotency-key"]).toHaveLength(36);
      expect(route.request().postDataJSON()).toEqual({
        job_type: "diagnostic",
      });
      status = "queued";
      return route.fulfill({ status: 202, json: job() });
    }
    return route.fulfill({
      json: {
        items: status ? [job()] : [],
        total: status ? 1 : 0,
        limit: 20,
        offset: 0,
      },
    });
  });
  await page.goto("/devpulse/projects/new");
  await page.getByLabel("Project name").fill("Dispatch infrastructure");
  await page
    .getByRole("button", { name: "Create project", exact: true })
    .click();
  await page.getByRole("button", { name: "Run infrastructure test" }).click();
  await expect(page.locator(".dp-job-status")).toHaveText("queued");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.locator(".dp-job-status")).toHaveText("cancelled");
  status = "completed";
  await page.getByRole("button", { name: "Refresh jobs" }).click();
  await expect(page.locator(".dp-job-status")).toHaveText("completed");
  await expect(page.getByRole("progressbar")).toHaveAttribute("value", "100");
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      (await new AxeBuilder({ page }).include(".devpulse-root").analyze())
        .violations,
    ).toEqual([]);
    await page.screenshot({
      path: `test-results/devpulse/live-detail-${width}.png`,
      fullPage: true,
    });
  }
});
