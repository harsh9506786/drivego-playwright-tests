import { test, expect } from "@playwright/test";

test.describe("Public + auth API", () => {
  test("GET /api/cars returns a list of cars", async ({ request }) => {
    const res = await request.get("/api/cars");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.cars)).toBeTruthy();
    expect(body.cars.length).toBeGreaterThan(0);
    for (const key of ["name", "price", "category"]) {
      expect(body.cars[0]).toHaveProperty(key);
    }
  });

  test("login with wrong password gives 401 Invalid credentials", async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: { email: "nobody@example.com", password: "WrongPass123" },
    });
    expect(res.status()).toBe(401);
    expect((await res.json()).message).toBe("Invalid credentials");
  });

  test("signup without required fields gives 400", async ({ request }) => {
    const res = await request.post("/api/auth/signup", { data: { email: "a@b.com" } });
    expect(res.status()).toBe(400);
  });

  test("GET /api/bookings without token is rejected", async ({ request }) => {
    const res = await request.get("/api/bookings");
    expect([401, 403]).toContain(res.status());
  });

  test("POST /api/cars without token is rejected (admin only)", async ({ request }) => {
    const res = await request.post("/api/cars", { data: { name: "Hacker car" } });
    expect([401, 403]).toContain(res.status());
  });
});

test.describe("Booking API (needs test user)", () => {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  test("booking with a past pickup date is rejected", async ({ request }) => {
    test.skip(!email || !password, "TEST_USER_EMAIL / TEST_USER_PASSWORD not set");
    const login = await request.post("/api/auth/login", { data: { email, password } });
    const { token } = await login.json();
    const cars = (await (await request.get("/api/cars")).json()).cars;

    const res = await request.post("/api/bookings", {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        carId: cars[0]._id,
        pickupDate: "2020-01-01",
        returnDate: "2020-01-03",
        pickupLocation: "Bhopal",
        phone: "9999999999",
      },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).message).toBe("Pickup date cannot be in the past.");
  });
});
