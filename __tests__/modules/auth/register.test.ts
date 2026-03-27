import { registerUser } from "@/modules/auth/register";
import { db } from "@/lib/db";

jest.mock("@/lib/db", () => ({ db: { user: { findUnique: jest.fn(), create: jest.fn() }, profile: { create: jest.fn() }, $transaction: jest.fn() } }));

describe("registerUser", () => {
  it("throws if email already taken", async () => {
    (db.$transaction as jest.Mock).mockImplementation(async (fn: any) => {
      const tx = {
        user: { findUnique: jest.fn().mockResolvedValue({ id: "existing" }), create: jest.fn() },
        profile: { create: jest.fn() },
      };
      return fn(tx);
    });
    await expect(registerUser({ email: "a@b.com", password: "password123", name: "Test" }))
      .rejects.toThrow("Email already in use");
  });

  it("creates user and profile in a transaction on success", async () => {
    const mockUser = { id: "user1", email: "a@b.com" };
    const mockProfile = { id: "profile1", userId: "user1", name: "Test" };
    (db.$transaction as jest.Mock).mockImplementation(async (fn: any) => {
      const tx = {
        user: { findUnique: jest.fn().mockResolvedValue(null), create: jest.fn().mockResolvedValue(mockUser) },
        profile: { create: jest.fn().mockResolvedValue(mockProfile) },
      };
      return fn(tx);
    });

    const result = await registerUser({ email: "a@b.com", password: "password123", name: "Test" });
    expect(result.user.email).toBe("a@b.com");
    expect(result.profile.name).toBe("Test");
  });

  it("hashes the password before storing", async () => {
    let capturedHash = "";
    (db.$transaction as jest.Mock).mockImplementation(async (fn: any) => {
      const tx = {
        user: { findUnique: jest.fn().mockResolvedValue(null), create: jest.fn().mockImplementation(async ({ data }: any) => { capturedHash = data.passwordHash; return { id: "u1", email: "a@b.com" }; }) },
        profile: { create: jest.fn().mockResolvedValue({ id: "p1", userId: "u1", name: "Test" }) },
      };
      return fn(tx);
    });

    await registerUser({ email: "a@b.com", password: "plaintext", name: "Test" });
    expect(capturedHash).not.toBe("plaintext");
    expect(capturedHash).toMatch(/^\$2[ab]\$/); // bcrypt hash prefix
  });
});
