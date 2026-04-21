import { registerUser } from "@/modules/auth/register";
import { db } from "@/lib/db";

jest.mock("@/lib/db", () => ({ db: { user: { findUnique: jest.fn(), create: jest.fn() }, profile: { create: jest.fn() }, $transaction: jest.fn() } }));
jest.mock("@/lib/email", () => ({ sendVerificationEmail: jest.fn().mockResolvedValue(undefined) }));

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
    (db.$transaction as jest.Mock).mockImplementation(async (fn: any) => {
      const tx = {
        user: { findUnique: jest.fn().mockResolvedValue(null), create: jest.fn().mockResolvedValue(mockUser) },
        profile: { create: jest.fn() },
      };
      return fn(tx);
    });

    await expect(registerUser({ email: "a@b.com", password: "password123", name: "Test" }))
      .resolves.not.toThrow();
  });

  it("hashes the password before storing", async () => {
    let capturedHash = "";
    (db.$transaction as jest.Mock).mockImplementation(async (fn: any) => {
      const tx = {
        user: { findUnique: jest.fn().mockResolvedValue(null), create: jest.fn().mockImplementation(async ({ data }: any) => { capturedHash = data.passwordHash; return { id: "u1", email: "a@b.com" }; }) },
        profile: { create: jest.fn() },
      };
      return fn(tx);
    });

    await registerUser({ email: "a@b.com", password: "plaintext", name: "Test" });
    expect(capturedHash).not.toBe("plaintext");
    expect(capturedHash).toMatch(/^\$2[ab]\$/); // bcrypt hash prefix
  });
});
