import { NextResponse } from "next/server";
import prisma from "@/share/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      hotelId,
      hotelName,
      offerId,
      room,
      price,
      currency,
      checkIn,
      checkOut,
    } = body;

    const saved = await prisma.order.create({
      data: {
        hotelId,
        hotelName,
        offerId,
        room,
        price,
        currency,
        checkIn,
        checkOut,
      },
    });

    return NextResponse.json({ ok: true, saved });
  } catch (err) {
    console.error("예약 저장 실패:", err);
    return NextResponse.json(
      { ok: false, error: "예약 DB 저장 실패" },
      { status: 500 }
    );
  }
}
