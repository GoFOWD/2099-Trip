// ✅ 항공사 코드 → 이름 매핑
const AIRLINE_NAMES = {
  TW: "티웨이항공",
  OZ: "아시아나항공",
  KE: "대한항공",
  LJ: "진에어",
  "7C": "제주항공",
  BX: "에어부산",
  ZE: "이스타항공",
  MM: "피치항공",
  NH: "ANA",
  JL: "일본항공",
  SQ: "싱가포르항공",
  CX: "캐세이퍼시픽",
  UA: "유나이티드항공",
  DL: "델타항공",
  AA: "아메리칸항공",
};

export function normalizeFlightOffer(offer) {
  try {
    const itineraries = offer.itineraries || [];

    // ✅ 모든 segments를 하나의 배열로 모으기 (편도 / 왕복 / 다구간 모두 처리됨)
    const allSegments = itineraries.flatMap(
      (it) =>
        it.segments?.map((seg) => ({
          id: seg.id,
          departurePort: seg.departure.iataCode,
          arrivalPort: seg.arrival.iataCode,

          departureCountry: seg.departure.countryCode || "",
          arrivalCountry: seg.arrival.countryCode || "",

          departureDate: seg.departure.at.split("T")[0],
          departureTime: seg.departure.at.split("T")[1].slice(0, 5),

          arrivalDate: seg.arrival.at.split("T")[0],
          arrivalTime: seg.arrival.at.split("T")[1].slice(0, 5),

          departureTerminal: seg.departure.terminal || "-",
          arrivalTerminal: seg.arrival.terminal || "-",

          flightNumber: seg.number,
          carrierCode: seg.carrierCode,
          aircraft: seg.aircraft?.code || "",
        })) || []
    );

    // ✅ 항공사 이름 (첫 구간 기준)
    const firstSeg = allSegments[0];
    const airlineCode = firstSeg?.carrierCode || "UNKNOWN";

    return {
      id: offer.id,

      airline: AIRLINE_NAMES[airlineCode] || airlineCode,
      airlineCode,
      flightNo: firstSeg?.flightNumber || "",

      price: Number(offer.price?.total || 0),

      airlineLogo: `/airlines/${airlineCode}.png`,

      // ✅ 왕복/편도/다구간 구간을 모두 담는다
      segments: allSegments,
    };
  } catch (err) {
    console.error("❗ normalizeFlightOffer Error:", err);
    return null;
  }
}

export function normalizeFlightList(list = []) {
  return list.map(normalizeFlightOffer).filter(Boolean);
}
