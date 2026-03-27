import { type NextRequest, NextResponse } from "next/server";
import { searchProfiles } from "@/modules/search/queries";
import { AvailabilityStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") ?? undefined;
    const artistType = searchParams.get("artistType") ?? undefined;
    const availability = searchParams.get("availability") ?? undefined;
    const location = searchParams.get("location") ?? undefined;

    const profiles = await searchProfiles({
      query,
      artistType,
      availability: availability as AvailabilityStatus | undefined,
      location,
    });

    return NextResponse.json(profiles);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
