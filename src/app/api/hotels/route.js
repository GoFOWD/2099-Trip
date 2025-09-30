import { NextResponse } from "next/server";

// 토큰 발급
async function getAccessToken() {
  const res = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
      }),
    }
  );
  const data = await res.json();
  return data.access_token;
}

// 나라 → 도시코드(IATA) 리스트 가져오기
async function fetchCitiesByCountry(token, countryCode) {
  // Amadeus에는 국가 전체 호텔 조회는 없으므로
  // 우선 국가별 도시코드를 받아서 각 도시 검색
  const res = await fetch(
    `https://test.api.amadeus.com/v1/reference-data/locations/cities?countryCode=${countryCode}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const data = await res.json();
  return (data.data || []).map((c) => c.iataCode);
}

export async function POST(req) {
  const { countryCode, cityCode } = await req.json();
  if (!countryCode && !cityCode) {
    return NextResponse.json(
      { error: "날짜만으로는 검색 불가. 최소 국가 또는 도시 입력 필요" },
      { status: 400 }
    );
  }

  const token = await getAccessToken();
  let hotels = [];

  // 도시 선택된 경우 → 해당 도시만
  if (cityCode) {
    const url = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`;
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const d = await r.json();
    console.log("API Response for cityCode:", cityCode, d);

    hotels = d.data || [];
  } else if (countryCode) {
    // 나라만 선택 시: 그 나라 모든 도시코드 순회
    const codes = await fetchCitiesByCountry(token, countryCode);
    for (const code of codes) {
      const r = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${code}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const d = await r.json();

      hotels.push(...(d.data || []));
    }
  }

  return NextResponse.json({ hotels });
}
