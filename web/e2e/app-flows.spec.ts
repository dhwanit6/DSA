import { expect, test } from "@playwright/test";

async function gotoApp(page: import("@playwright/test").Page, appPath = "") {
  const normalizedPath = appPath.replace(/^\/+/, "");
  await page.goto(normalizedPath);
}

async function clearProgress(page: import("@playwright/test").Page) {
  await gotoApp(page);
  await page.evaluate(() => {
    window.localStorage.clear();
  });
  await page.reload();
}

test("homepage and sidebar navigation reach the expected chapters", async ({ page }) => {
  await clearProgress(page);

  await expect(page.getByRole("heading", { name: /Stop stitching together random prep\./i })).toBeVisible();

  await page.getByRole("link", { name: "Start Here" }).first().click();
  await expect(page).toHaveURL(/\/start-here\/?$/);
  await expect(page.getByRole("heading", { name: "Start Here" })).toBeVisible();
  await expect(page.getByTestId("chapter-support-panel")).toBeVisible();

  await page.getByRole("link", { name: "CS Fundamentals Roadmap" }).first().click();
  await expect(page).toHaveURL(/\/cs-fundamentals-roadmap\/?$/);
  await expect(page.getByRole("heading", { name: "CS Fundamentals Roadmap" })).toBeVisible();
});

test("chapter checklist state persists across reload", async ({ page }) => {
  await clearProgress(page);
  await gotoApp(page, "phase-0-cpp");

  const firstChecklist = page.getByTestId("chapter-checklist-item").first().locator('input[type="checkbox"]');
  await firstChecklist.check();
  await expect(firstChecklist).toBeChecked();

  await page.reload();
  await expect(page.getByTestId("chapter-checklist-item").first().locator('input[type="checkbox"]')).toBeChecked();
});

test("planner task completion persists across reload", async ({ page }) => {
  await clearProgress(page);
  await gotoApp(page, "planner");

  const firstTask = page.getByTestId("planner-day-card").first().locator('input[type="checkbox"]').first();
  await firstTask.check();
  await expect(firstTask).toBeChecked();

  await page.reload();
  await expect(page.getByTestId("planner-day-card").first().locator('input[type="checkbox"]').first()).toBeChecked();
});

test("dashboard track and daily hours persist across reload", async ({ page }) => {
  await clearProgress(page);
  await gotoApp(page, "dashboard");

  await page.getByRole("button", { name: /Crash/i }).click();
  const hoursSlider = page.locator("#daily-hours");
  await hoursSlider.fill("4");

  await expect(page.getByText(/Current:\s*Crash Track/i)).toBeVisible();
  await expect(page.getByLabel(/Daily commitment:\s*4 hours/i)).toBeVisible();

  await page.reload();
  await expect(page.getByText(/Current:\s*Crash Track/i)).toBeVisible();
  await expect(page.getByLabel(/Daily commitment:\s*4 hours/i)).toBeVisible();
});

test("problems page renders and supports filtering", async ({ page }) => {
  await clearProgress(page);
  await gotoApp(page, "problems");

  await expect(page.getByRole("heading", { name: "Problem Set" })).toBeVisible();
  await page.getByPlaceholder("Search by name, pattern, or LC #").fill("Two Sum");
  await expect(page.getByRole("link", { name: "Two Sum" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Best Time to Buy and Sell Stock" })).not.toBeVisible();
});
