// Mock the stripe module-level client so it doesn't error without env vars
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({}));
});

import { calculatePlatformFee } from "@/lib/stripe";

describe("calculatePlatformFee", () => {
  it("returns 0 for subscribed sellers regardless of price", () => {
    expect(calculatePlatformFee(500, true)).toBe(0);
  });

  it("returns 0 for listings at or below $200", () => {
    expect(calculatePlatformFee(200, false)).toBe(0);
    expect(calculatePlatformFee(50, false)).toBe(0);
  });

  it("returns 10% for listings above $200", () => {
    expect(calculatePlatformFee(300, false)).toBe(30);
    expect(calculatePlatformFee(500, false)).toBe(50);
  });
});
