import { registerUser } from "@/modules/auth/register";
import { calculatePlatformFee, MARKETPLACE_FEE_PERCENT, MARKETPLACE_FEE_THRESHOLD } from "@/lib/stripe";
import { getProfileById, getProfileByUserId } from "@/modules/profiles/queries";
import { searchProfiles } from "@/modules/search/queries";
import { getFeedForUser } from "@/modules/feed/queries";
import { getConversations } from "@/modules/messaging/queries";
import { getListings, getListing } from "@/modules/marketplace/queries";

// Mock all DB and external dependencies
jest.mock("@/lib/db", () => ({
  db: {
    user: { create: jest.fn(), findUnique: jest.fn() },
    profile: { create: jest.fn(), findUnique: jest.fn(), findMany: jest.fn(), update: jest.fn() },
    group: { findUnique: jest.fn() },
    follow: { findMany: jest.fn() },
    post: { findMany: jest.fn() },
    message: { findMany: jest.fn() },
    listing: { findUnique: jest.fn(), findMany: jest.fn() },
    $transaction: jest.fn(),
  },
}));

jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    checkout: { sessions: { create: jest.fn() } },
    accounts: { create: jest.fn() },
  }));
});

describe("ArtistConnect Smoke Tests", () => {
  describe("fee calculation", () => {
    it("exports fee constants with correct values", () => {
      expect(MARKETPLACE_FEE_PERCENT).toBe(10);
      expect(MARKETPLACE_FEE_THRESHOLD).toBe(200);
    });

    it("charges 10% fee on sales above $200 for non-subscribers", () => {
      expect(calculatePlatformFee(300, false)).toBe(30);
      expect(calculatePlatformFee(500, false)).toBe(50);
    });

    it("waives fee for subscribers regardless of price", () => {
      expect(calculatePlatformFee(300, true)).toBe(0);
      expect(calculatePlatformFee(1000, true)).toBe(0);
    });

    it("waives fee for sales at or below $200", () => {
      expect(calculatePlatformFee(200, false)).toBe(0);
      expect(calculatePlatformFee(199.99, false)).toBe(0);
    });
  });

  describe("module exports", () => {
    it("auth module exports registerUser", () => {
      expect(typeof registerUser).toBe("function");
    });

    it("profiles module exports getProfileById and getProfileByUserId", () => {
      expect(typeof getProfileById).toBe("function");
      expect(typeof getProfileByUserId).toBe("function");
    });

    it("search module exports searchProfiles", () => {
      expect(typeof searchProfiles).toBe("function");
    });

    it("feed module exports getFeedForUser", () => {
      expect(typeof getFeedForUser).toBe("function");
    });

    it("messaging module exports getConversations", () => {
      expect(typeof getConversations).toBe("function");
    });

    it("marketplace module exports getListings and getListing", () => {
      expect(typeof getListings).toBe("function");
      expect(typeof getListing).toBe("function");
    });
  });
});
