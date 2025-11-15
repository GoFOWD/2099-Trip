// app/api/schedule/create-ticket/route.js
import prisma from "@/share/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { price, airline, tripType, segments, userId, startDate, endDate } =
      body;

    if (!price || !airline || !segments?.length) {
      return NextResponse.json({ error: "필수 값 누락" }, { status: 400 });
    }

    if (!userId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "새 스케줄 생성에 필요한 값(userId,startDate,endDate) 누락" },
        { status: 400 }
      );
    }

    // ⭐ 스케줄 자동 생성
    const newSchedule = await prisma.schedule.create({
      data: {
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    const finalScheduleId = newSchedule.id;

    // ⭐ AirTicket 생성
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
            airportName: s.airportName ?? "",
            departureCountry: s.departureCountry ?? "",
            departureCity: s.departureCity ?? "",
            arrivalCountry: s.arrivalCountry ?? "",
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
    return NextResponse.json(
      { error: "서버 오류", detail: error.message },
      { status: 500 }
    );
  }
}
