import { getProfileById } from "@/modules/profiles/queries";
import { db } from "@/lib/db";

jest.mock("@/lib/db", () => ({
  db: {
    profile: { findUnique: jest.fn() },
    group: { findUnique: jest.fn() },
  },
}));

describe("getProfileById", () => {
  it("returns profile for valid p_ prefixed id", async () => {
    (db.profile.findUnique as jest.Mock).mockResolvedValue({ id: "abc" });
    const result = await getProfileById("p_abc");
    expect(db.profile.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "abc" } })
    );
    expect(result).toEqual({ type: "profile", data: { id: "abc" } });
  });

  it("returns null for unknown prefix", async () => {
    const result = await getProfileById("x_abc");
    expect(result).toBeNull();
  });

  it("returns group for valid g_ prefixed id", async () => {
    (db.group.findUnique as jest.Mock).mockResolvedValue({ id: "grp1" });
    const result = await getProfileById("g_grp1");
    expect(db.group.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "grp1" } }));
    expect(result).toEqual({ type: "group", data: { id: "grp1" } });
  });
});
