import { NextRequest, NextResponse } from "next/server";

// 🪪 Amadeus API 토큰 요청 함수
async function getAccessToken() {
  const clientId = process.env.AMADEUS_CLIENT_ID!;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET!;

  const tokenRes = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    }
  );

  if (!tokenRes.ok) throw new Error("Amadeus 토큰 발급 실패");

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 🔹 테스트 모드 대비: 오퍼 배열과 hotelOfferId 체크
    const roomAssoc = body.data?.roomAssociations?.[0];
    if (!roomAssoc || !roomAssoc.hotelOfferId) {
      return NextResponse.json(
        { error: "선택된 오퍼 ID가 없습니다. 오퍼를 다시 조회해주세요." },
        { status: 400 }
      );
    }

    const token = await getAccessToken();

    // 🔹 프론트에서 전달받은 body 그대로 예약 API에 전달
    const bookingBody = {
      data: {
        type: "hotel-order",
        guests: body.data.guests,
        travelAgent: body.data.travelAgent,
        roomAssociations: body.data.roomAssociations,
        payment: body.data.payment,
      },
    };

    const res = await fetch(
      "https://test.api.amadeus.com/v2/booking/hotel-orders",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/vnd.amadeus+json",
        },
        body: JSON.stringify(bookingBody),
      }
    );

    const data = await res.json();

    if (!res.ok || data?.errors) {
      console.error("Amadeus 예약 실패:", data);
      return NextResponse.json(
        { error: "예약 실패", details: data },
        { status: res.status }
      );
    }

    console.log("✅ 예약 성공:", data);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("❌ 서버 오류:", err);
    return NextResponse.json(
      { error: "서버 오류", details: err.message },
      { status: 500 }
    );
  }
}
