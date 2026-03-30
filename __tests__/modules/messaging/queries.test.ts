import { getConversations } from "@/modules/messaging/queries";
import { db } from "@/lib/db";

jest.mock("@/lib/db", () => ({ db: { message: { findMany: jest.fn() } } }));

describe("getConversations", () => {
  it("queries messages where user is sender or recipient", async () => {
    (db.message.findMany as jest.Mock).mockResolvedValue([]);
    await getConversations("myId");
    expect(db.message.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { OR: [{ senderId: "myId" }, { recipientId: "myId" }] },
      })
    );
  });
});
