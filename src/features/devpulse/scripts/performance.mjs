import fs from "node:fs";
import os from "node:os";
import { chromium } from "@playwright/test";

// Run against a locally built preview; never sends source or telemetry externally.
const origin = process.argv[2] || "http://127.0.0.1:4174";
if (!["localhost", "127.0.0.1"].includes(new URL(origin).hostname))
  throw new Error("Local preview only");
const browser = await chromium.launch();
const runs = [];
try {
  for (let run = 0; run < 3; run++) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const session = await context.newCDPSession(page);
    await session.send("Network.enable");
    await session.send("Network.setCacheDisabled", { cacheDisabled: true });
    await session.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: 200000,
      uploadThroughput: 100000,
    });
    await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.addInitScript(() => {
      globalThis.__dpPerformance = { lcp: 0, cls: 0, longTasks: [] };
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          globalThis.__dpPerformance.lcp = e.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          if (!e.hadRecentInput) globalThis.__dpPerformance.cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          globalThis.__dpPerformance.longTasks.push({
            start: e.startTime,
            duration: e.duration,
          });
      }).observe({ type: "longtask", buffered: true });
    });
    await page.goto(`${origin}/devpulse`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { level: 1 }).waitFor();
    await page.waitForTimeout(1000);
    const measurement = await page.evaluate(() => ({
      ...globalThis.__dpPerformance,
      transferBytes: performance
        .getEntriesByType("resource")
        .reduce((sum, e) => sum + e.transferSize, 0),
    }));
    runs.push(measurement);
    await context.close();
  }
  const sorted = (key) => runs.map((r) => r[key]).sort((a, b) => a - b)[1];
  const result = {
    date: new Date().toISOString(),
    browser: browser.version(),
    platform: os.platform(),
    cpu: os.cpus()[0].model,
    viewport: "390x844",
    cpuThrottle: 4,
    network: "150ms latency, 200000 bytes/s download, cache disabled",
    origin,
    medianLcpMs: sorted("lcp"),
    medianCls: sorted("cls"),
    runs,
    limitations:
      "Local synthetic measurements, not Lighthouse or field INP. Preview transfer size includes local server compression behavior. Long tasks include the existing portfolio entry.",
  };
  fs.mkdirSync("test-results", { recursive: true });
  fs.writeFileSync(
    "test-results/devpulse-performance.json",
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
