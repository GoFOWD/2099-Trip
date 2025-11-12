// app/api/amadeus/flights/route.js
import { NextResponse } from "next/server";
import getToken from "@/lib/airline/getToken";
import { getApi } from "@/lib/airline/getApi";

const AMADEUS_FLIGHTS_URL =
  "https://test.api.amadeus.com/v2/shopping/flight-offers";

// ✅ 공통 토큰 발급 함수
async function getAccessToken() {
  const tokenData = await getToken({
    id: process.env.AMADEUS_API_KEY,
    secret: process.env.AMADEUS_API_SECRET,
    url: "https://test.api.amadeus.com/v1/security/oauth2/token",
  });
  return tokenData.access_token;
}

/* ----------------------------------------
   ✈️ GET : 기본 항공편 검색 (편도/왕복)
---------------------------------------- */
export async function GET(request) {
  try {
    const token = await getAccessToken();
    const { searchParams } = new URL(request.url);

    // 필수 파라미터
    const originLocationCode = searchParams.get("originLocationCode") || "ICN";
    const destinationLocationCode =
      searchParams.get("destinationLocationCode") || "NRT";
    const departureDate =
      searchParams.get("departureDate") ||
      new Date().toISOString().split("T")[0];
    const adults = searchParams.get("adults") || "1";
    const children = searchParams.get("children") || "0";
    const infants = searchParams.get("infants") || "0";
    const currencyCode = searchParams.get("currencyCode") || "KRW";

    // 선택 파라미터
    const returnDate = searchParams.get("returnDate");
    const travelClass = searchParams.get("travelClass");
    const nonStopParam = searchParams.get("nonStop");
    const nonStop = nonStopParam === null ? undefined : nonStopParam === "true";

    // API 호출 (GET)
    const flights = await getApi({
      token,
      apiUrl: AMADEUS_FLIGHTS_URL,
      params: {
        originLocationCode,
        destinationLocationCode,
        departureDate,
        adults,
        children,
        infants,
        ...(returnDate ? { returnDate } : {}),
        ...(travelClass ? { travelClass } : {}),
        ...(nonStop !== undefined ? { nonStop } : {}),
        currencyCode,
        max: 10,
      },
    });

    return NextResponse.json(flights);
  } catch (err) {
    console.error("✈️ [GET] Flights API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ----------------------------------------
   🧩 POST : 다구간 항공편 검색 (multiSegments)
---------------------------------------- */
export async function POST(request) {
  try {
    const token = await getAccessToken();
    const body = await request.json();

    const {
      currencyCode = "KRW",
      adults = 1,
      children = 0,
      infants = 0,
      travelClass,
      nonStop,
      multiSegments = [],
    } = body;

    if (!Array.isArray(multiSegments) || multiSegments.length === 0) {
      return NextResponse.json(
        { error: "multiSegments 배열이 비어 있습니다." },
        { status: 400 }
      );
    }

    // Amadeus API POST Body 형식에 맞게 변환
    const travelers = [];
    for (let i = 0; i < adults; i++)
      travelers.push({ id: `${i + 1}`, travelerType: "ADULT" });
    for (let i = 0; i < children; i++)
      travelers.push({ id: `${adults + i + 1}`, travelerType: "CHILD" });
    for (let i = 0; i < infants; i++)
      travelers.push({
        id: `${adults + children + i + 1}`,
        travelerType: "HELD_INFANT",
      });

    const slices = multiSegments.map((seg) => ({
      originLocationCode: seg.origin,
      destinationLocationCode: seg.destination,
      departureDate: seg.date,
    }));

    const bodyData = {
      currencyCode,
      travelers,
      slices,
      sources: ["GDS"],
      ...(travelClass ? { travelClass } : {}),
      ...(nonStop !== undefined ? { nonStop } : {}),
    };

    // Amadeus API POST 요청
    const res = await fetch(AMADEUS_FLIGHTS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Amadeus POST 요청 실패: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("🧩 [POST] Multi Flights API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
