"use client";
import { useState } from "react";

export default function HotelsPage() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchHotels = async () => {
    setError("");
    if (!country && !city) {
      setError("날짜만으로는 검색할 수 없습니다. 국가 또는 도시를 입력하세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryCode: country.toUpperCase(),
          cityCode: city.toUpperCase(),
        }),
      });
      const data = await res.json();
      if (res.ok) setHotels(data.hotels);
      else setError(data.error || "검색 실패");
    } catch (e) {
      setError("서버 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">호텔 검색</h1>
      <div className="space-y-3 mb-6">
        <div>
          <label className="block mb-1">
            국가 코드 (필수 아님, 예: FR, KR)
          </label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border px-2 py-1 rounded w-48"
          />
        </div>
        <div>
          <label className="block mb-1">도시 코드 (선택, 예: PAR, SEL)</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border px-2 py-1 rounded w-48"
          />
        </div>
        <button
          onClick={searchHotels}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "검색 중..." : "검색"}
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </div>

      <div>
        {hotels.length === 0 && !loading && <p>검색 결과 없음</p>}
        {hotels.map((h) => (
          <div key={h.hotelId} className="border p-3 mb-3 rounded shadow">
            <h2 className="font-semibold text-lg">{h.name}</h2>
            <p>ID: {h.hotelId}</p>
            <p>
              위도: {h.geoCode.latitude}, 경도: {h.geoCode.longitude}
            </p>
            <p>국가: {h.address?.countryCode}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
