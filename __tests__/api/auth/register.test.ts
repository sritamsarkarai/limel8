import { POST } from "@/app/api/auth/register/route";

jest.mock("@/modules/auth/register", () => ({
  registerUser: jest.fn(),
}));

import { registerUser } from "@/modules/auth/register";

describe("POST /api/auth/register", () => {
  it("returns 400 when fields are missing", async () => {
    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: "a@b.com" }), // missing name and password
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Missing fields");
  });

  it("returns 200 on successful registration", async () => {
    (registerUser as jest.Mock).mockResolvedValue({ user: {}, profile: {} });
    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: "a@b.com", password: "pass", name: "Test" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  it("returns 409 on duplicate email", async () => {
    (registerUser as jest.Mock).mockRejectedValue(new Error("Email already in use"));
    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: "a@b.com", password: "pass", name: "Test" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe("Email already in use");
  });
});
