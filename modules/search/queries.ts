import "server-only";
import { db } from "@/lib/db";
import { AvailabilityStatus } from "@prisma/client";

interface SearchParams {
  query?: string;
  artistType?: string;
  availability?: AvailabilityStatus;
  location?: string;
}

export async function searchProfiles({ query, artistType, availability, location }: SearchParams) {
  return db.profile.findMany({
    where: {
      ...(availability ? { availabilityStatus: availability } : {}),
      ...(artistType ? { artistType } : {}),
      ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
      ...(query ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { bio: { contains: query, mode: "insensitive" } },
          { artistType: { contains: query, mode: "insensitive" } },
        ],
      } : {}),
    },
    take: 50,
  });
}
