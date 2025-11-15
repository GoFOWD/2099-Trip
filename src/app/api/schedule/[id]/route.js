import prisma from "@/share/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  const { id } = params;

  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id },
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
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
