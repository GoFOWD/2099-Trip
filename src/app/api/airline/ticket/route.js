import prisma from "@/share/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      price,
      airline,
      tripType,
      scheduleId,
      segments,

      // ⭐ 새 스케줄 생성에 필요한 최소 데이터 3개
      userId,
      startDate,
      endDate,
    } = body;

    // 기본 유효성 검사
    if (!price || !airline || !segments?.length) {
      return NextResponse.json({ error: "필수 값 누락" }, { status: 400 });
    }

    let finalScheduleId = scheduleId;

    /* -------------------------------------------------
      🟦 1) scheduleId가 없다면 → 새 스케줄 생성
    ------------------------------------------------- */
    if (!finalScheduleId) {
      if (!userId || !startDate || !endDate) {
        return NextResponse.json(
          { error: "새 스케줄 생성: userId, startDate, endDate 필요" },
          { status: 400 }
        );
      }

      const newSchedule = await prisma.schedule.create({
        data: {
          userId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          companion: 0,
        },
      });

      finalScheduleId = newSchedule.id;
    }

    /* -------------------------------------------------
      🟦 2) AirTicket 생성
    ------------------------------------------------- */
    const newTicket = await prisma.airTicket.create({
      data: {
        price,
        airline,
        tripType,
        scheduleId: finalScheduleId,

        segments: {
          create: segments.map((s) => ({
            departurePort: s.departurePort,
            arrivalPort: s.arrivalPort,
            airportName: s.airportName || "",
            departureCountry: s.departureCountry,
            departureCity: s.departureCity ?? "",
            arrivalCountry: s.arrivalCountry,
            arrivalCity: s.arrivalCity ?? "",
            departureDate: new Date(s.departureDate),
            arrivalDate: new Date(s.arrivalDate),
            flightNumber: s.flightNumber,
          })),
        },
      },
      include: { segments: true },
    });

    return NextResponse.json({
      success: true,
      scheduleId: finalScheduleId,
      ticket: newTicket,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { error: "서버 오류", detail: error.message },
      { status: 500 }
    );
  }
}
