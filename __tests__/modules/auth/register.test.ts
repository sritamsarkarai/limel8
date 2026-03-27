import { registerUser } from "@/modules/auth/register";
import { db } from "@/lib/db";

jest.mock("@/lib/db", () => ({ db: { user: { findUnique: jest.fn(), create: jest.fn() }, profile: { create: jest.fn() }, $transaction: jest.fn() } }));

describe("registerUser", () => {
  it("throws if email already taken", async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue({ id: "existing" });
    await expect(registerUser({ email: "a@b.com", password: "pass", name: "Test" }))
      .rejects.toThrow("Email already in use");
  });
});
