import { searchProfiles } from "@/modules/search/queries";
import { db } from "@/lib/db";

jest.mock("@/lib/db", () => ({ db: { profile: { findMany: jest.fn() } } }));

describe("searchProfiles", () => {
  it("filters by availability status when provided", async () => {
    (db.profile.findMany as jest.Mock).mockResolvedValue([]);
    await searchProfiles({ availability: "open_to_collab" });
    expect(db.profile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ availabilityStatus: "open_to_collab" }),
      })
    );
  });

  it("does full-text search when query provided", async () => {
    (db.profile.findMany as jest.Mock).mockResolvedValue([]);
    await searchProfiles({ query: "jazz" });
    expect(db.profile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ name: expect.objectContaining({ contains: "jazz" }) }),
          ]),
        }),
      })
    );
  });
});
