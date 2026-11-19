# DriveGo – Test Plan (starter)

Scope: login, cars listing (search/filter), Book Now redirect, public/auth API checks.
Out of scope for now: payments (Razorpay), Google/phone login, admin panel, AI chat.

| ID | Area | Scenario | Type | Automated |
|----|------|----------|------|-----------|
| L1 | Login | Page shows email, password, button | UI | auth.spec.ts |
| L2 | Login | Eye icon toggles password visibility | UI | auth.spec.ts |
| L3 | Login | Wrong credentials -> "Login Failed", no token | UI | auth.spec.ts |
| L4 | Login | CREATE ACCOUNT -> /signup | UI | auth.spec.ts |
| L5 | Login | Valid login stores token (needs test user) | UI | auth.spec.ts |
| C1 | Cars | Heading and cars visible | UI | cars.spec.ts |
| C2 | Cars | Nonsense search -> empty state | UI | cars.spec.ts |
| C3 | Cars | Clear filters restores list | UI | cars.spec.ts |
| C4 | Cars | Max price 1 -> empty state | UI | cars.spec.ts |
| C5 | Cars | Book Now logged out -> /login?redirect=/cars/<id> | UI | cars.spec.ts |
| A1 | API | GET /api/cars -> 200 + list | API | api.spec.ts |
| A2 | API | Login wrong password -> 401 | API | api.spec.ts |
| A3 | API | Signup missing fields -> 400 | API | api.spec.ts |
| A4 | API | Bookings/POST cars without token rejected | API | api.spec.ts |
| A5 | API | Past pickup date -> 400 (needs test user) | API | api.spec.ts |

Next to add: signup flow, booking happy path + double-booking (same dates -> "Car Already Booked"), return < pickup date, My Bookings cancel, admin-only routes with a user token.
