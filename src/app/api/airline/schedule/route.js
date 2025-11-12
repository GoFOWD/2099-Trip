// planning/airline/api/schedule/route.js
import { NextResponse } from "next/server";
import prisma from "@/share/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const scid = searchParams.get("scid");
    if (!scid) {
      return NextResponse.json({ error: "Missing scid" }, { status: 400 });
    }

    const schedule = await prisma.schedule.findUnique({
      where: { id: scid },
      select: { startDate: true, endDate: true },
    });

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      startDate: schedule.startDate.toISOString(),
      endDate: schedule.endDate.toISOString(),
    });
  } catch (e) {
    console.error("Schedule fetch error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
