import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export const FRONTEND_URL =
  process.env.BASE_URL || "https://car-rental-application-gray.vercel.app";
export const API_URL =
  process.env.API_URL || "https://car-rental-application-y2mk.onrender.com";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: FRONTEND_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", testDir: "./tests/ui", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", testDir: "./tests/ui", use: { ...devices["Pixel 7"] } },
    { name: "api", testDir: "./tests/api", use: { baseURL: API_URL } },
  ],
});