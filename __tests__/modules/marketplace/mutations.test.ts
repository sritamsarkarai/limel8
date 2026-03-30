import { publishListing } from "@/modules/marketplace/mutations";
import { db } from "@/lib/db";

jest.mock("@/lib/db", () => ({ db: { profile: { findUnique: jest.fn() }, listing: { update: jest.fn() } } }));

describe("publishListing", () => {
  it("throws if seller has no stripe account", async () => {
    (db.profile.findUnique as jest.Mock).mockResolvedValue({ stripeAccountId: null });
    await expect(publishListing("listing1", "profile1")).rejects.toThrow("Stripe Connect");
  });
});
