import { test, expect } from "@playwright/test";

const email = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASSWORD;

test.describe("Login page", () => {
  test("login page opens with email, password and button", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByPlaceholder("Enter your email")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your password")).toBeVisible();
    await expect(page.getByRole("button", { name: "ACCESS PREMIUM GARAGE" })).toBeVisible();
  });

  test("password show/hide eye button toggles the field type", async ({ page }) => {
    await page.goto("/login");
    const pwd = page.getByPlaceholder("Enter your password");
    await expect(pwd).toHaveAttribute("type", "password");
    // the eye icon is the only type="button" inside the form
    await page.locator("form button[type='button']").click();
    await expect(pwd).toHaveAttribute("type", "text");
  });

  test("wrong credentials do not log the user in", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Enter your email").fill("nobody@example.com");
    await page.getByPlaceholder("Enter your password").fill("WrongPass123");
    await page.getByRole("button", { name: "ACCESS PREMIUM GARAGE" }).click();
    await expect(page.getByText("Login Failed")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
    expect(await page.evaluate(() => localStorage.getItem("token"))).toBeNull();
  });

  test("CREATE ACCOUNT link goes to signup", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: "CREATE ACCOUNT" }).click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test("valid login stores token and leaves the login page", async ({ page }) => {
    test.skip(!email || !password, "TEST_USER_EMAIL / TEST_USER_PASSWORD not set");
    await page.goto("/login");
    await page.getByPlaceholder("Enter your email").fill(email!);
    await page.getByPlaceholder("Enter your password").fill(password!);
    await page.getByRole("button", { name: "ACCESS PREMIUM GARAGE" }).click();
    await expect(page).not.toHaveURL(/\/login/);
    expect(await page.evaluate(() => localStorage.getItem("token"))).toBeTruthy();
  });
});
