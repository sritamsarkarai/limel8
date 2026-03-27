import { getFeedForUser } from "@/modules/feed/queries";
import { db } from "@/lib/db";

jest.mock("@/lib/db", () => ({
  db: { follow: { findMany: jest.fn() }, post: { findMany: jest.fn() } }
}));

describe("getFeedForUser", () => {
  it("returns posts from followed profiles and groups", async () => {
    (db.follow.findMany as jest.Mock).mockResolvedValue([
      { followedProfileId: "p1", followedGroupId: null },
      { followedProfileId: null, followedGroupId: "g1" },
    ]);
    (db.post.findMany as jest.Mock).mockResolvedValue([{ id: "post1" }]);

    const result = await getFeedForUser("myProfileId");

    expect(db.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { OR: [{ profileId: { in: ["p1"] } }, { groupId: { in: ["g1"] } }] },
      })
    );
    expect(result).toEqual([{ id: "post1" }]);
  });
});
