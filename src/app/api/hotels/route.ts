export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // 기본 도시코드
    const cityCode = searchParams.get("cityCode") || "PAR";

    // 선택적 쿼리
    const amenities = searchParams.get("amenities"); // 쉼표 구분
    const ratings = searchParams.get("ratings"); // 쉼표 구분

    // 🔹 Amadeus 토큰 요청
    const tokenRes = await fetch(
      `${process.env.AMADEUS_API_URL}/v1/security/oauth2/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: process.env.AMADEUS_CLIENT_ID!,
          client_secret: process.env.AMADEUS_CLIENT_SECRET!,
        }),
      }
    );

    if (!tokenRes.ok) {
      return new Response(JSON.stringify({ error: "토큰 발급 실패" }), {
        status: 500,
      });
    }
    const tokenData = await tokenRes.json();

    // 🔹 호텔 조회 URL 구성
    const hotelUrl = new URL(
      `${process.env.AMADEUS_API_URL}/v1/reference-data/locations/hotels/by-city`
    );
    hotelUrl.searchParams.set("cityCode", cityCode);
    if (amenities) hotelUrl.searchParams.set("amenities", amenities);
    if (ratings) hotelUrl.searchParams.set("ratings", ratings);

    const offerRes = await fetch(hotelUrl.toString(), {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!offerRes.ok) {
      return new Response(JSON.stringify({ error: "호텔 조회 실패" }), {
        status: 500,
      });
    }

    const data = await offerRes.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
    });
  }
}
