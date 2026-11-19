import { test, expect } from "@playwright/test";

test.describe("Cars page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cars");
    // wait until at least one car card is rendered (each card has a Book Now button)
    await expect(page.getByRole("button", { name: /Book Now/ }).first()).toBeVisible();
  });

  test("shows the heading and at least one car", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Premium Car Collection" })).toBeVisible();
    expect(await page.getByRole("button", { name: /Book Now/ }).count()).toBeGreaterThan(0);
  });

  test("search with a nonsense word shows the empty state", async ({ page }) => {
    await page.getByPlaceholder("Search by name, brand, or category...").fill("zzzzqqqq");
    await expect(page.getByText("No cars match your filters. Try adjusting them.")).toBeVisible();
  });

  test("Clear filters restores the cars", async ({ page }) => {
    await page.getByPlaceholder("Search by name, brand, or category...").fill("zzzzqqqq");
    await page.getByRole("button", { name: "Clear filters" }).first().click();
    await expect(page.getByRole("button", { name: /Book Now/ }).first()).toBeVisible();
  });

  test("max price filter keeps only cars within the limit", async ({ page }) => {
    await page.getByRole("button", { name: "Filters" }).click();
    await page.getByPlaceholder("Max price/day").fill("1");
    await expect(page.getByText("No cars match your filters. Try adjusting them.")).toBeVisible();
  });

  test("Book Now without login redirects to login with redirect param", async ({ page }) => {
    await page.getByRole("button", { name: /Book Now/ }).first().click();
    await expect(page).toHaveURL(/\/login\?redirect=\/cars\/.+/);
  });
});
