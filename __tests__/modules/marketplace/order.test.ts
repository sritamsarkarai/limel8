// Mock the stripe module-level client so it doesn't error without env vars
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({}));
});

import { calculatePlatformFee } from "@/lib/stripe";

describe("order fee logic", () => {
  it("charges no fee to subscribed sellers on high-value listings", () => {
    expect(calculatePlatformFee(500, true)).toBe(0);
  });

  it("charges 10% fee to free sellers on listings above $200", () => {
    expect(calculatePlatformFee(400, false)).toBe(40);
  });

  it("charges no fee on listings at exactly $200", () => {
    expect(calculatePlatformFee(200, false)).toBe(0);
  });
});
