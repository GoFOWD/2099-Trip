export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hotelIds = searchParams.get("hotelIds");
  const checkInDate = searchParams.get("checkInDate");
  const checkOutDate = searchParams.get("checkOutDate");
  const adults = searchParams.get("adults") || "1";
  const amenities = searchParams.get("amentities") || "";
  console.log({ adults });
  // 🔹 토큰 요청
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
  const tokenData = await tokenRes.json();

  // 🔹 객실 오퍼 조회
  const offerRes = await fetch(
    `${process.env.AMADEUS_API_URL}/v3/shopping/hotel-offers?hotelIds=${hotelIds}&amenities=${amenities}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}`,
    { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
  );
  const data = await offerRes.json();
  return Response.json(data);
}
