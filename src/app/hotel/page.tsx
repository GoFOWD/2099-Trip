"use client";
import pLimit from "p-limit";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import HotelMap from "@/components/HotelMap";

// ----------------------
// 인터페이스
// ----------------------
interface Hotel {
  hotelId: string;
  name: string;
  chainCode?: string;
  iataCode?: string;
  geoCode?: { latitude: number; longitude: number };
  _scrollTo?: boolean; // ⭐ 자동 스크롤 플래그
}

interface Offer {
  id: string;
  room?: { description?: { text?: string } };
  price?: { total?: string; currency?: string };
  checkInDate?: string;
  checkOutDate?: string;
}

export default function HotelBooking() {
  const router = useRouter();

  const hotelListRef = useRef<HTMLDivElement | null>(null);
  const hotelItemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const budget = 730000;

  const [cityCode, setCity] = useState("TYO");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);

  const [amenities, setAmenities] = useState<string[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [offersMap, setOffersMap] = useState<Record<string, Offer[]>>({});
  const [loading, setLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [sortBy, setSortBy] = useState<"price" | "name">("price");

  const [bookingResult, setBookingResult] = useState<any>(null);

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  // ⭐ 메인 호텔 리스트 ref
  const hotelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ⭐ 지도 모달 내 호텔 리스트 ref
  const modalHotelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ----------------------
  // 날짜 기본값 설정
  // ----------------------
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);

    setCheckIn(tomorrow.toISOString().split("T")[0]);
    setCheckOut(dayAfter.toISOString().split("T")[0]);
  }, []);

  const toggleAmenity = (a: string) => {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  // ----------------------
  // 호텔 검색
  // ----------------------
  const searchHotels = async () => {
    setLoading(true);
    setSelectedHotel(null);
    setBookingResult(null);

    try {
      const params = new URLSearchParams({
        cityCode,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        adults: String(adults),
      });

      const res = await fetch(`/api/hotels?${params.toString()}`);
      const data = await res.json();

      const fetchedHotels = data.data || [];
      setHotels(fetchedHotels);
      setOffersMap({});

      if (fetchedHotels.length && fetchedHotels[0].geoCode) {
        const g = fetchedHotels[0].geoCode;
        setMapCenter({ lat: g.latitude, lng: g.longitude });
      }
      if (!fetchedHotels.length) return;

      const hotelIds = fetchedHotels.map((h: any) => h.hotelId);

      const chunkSize = 60;
      const chunks: string[][] = [];
      for (let i = 0; i < hotelIds.length; i += chunkSize) {
        chunks.push(hotelIds.slice(i, i + chunkSize));
      }

      const limit = pLimit(20);
      const allOffers: Record<string, Offer[]> = {};

      const tasks = chunks.map((chunk) =>
        limit(async () => {
          const hotelIdsJoined = chunk.join(",");

          try {
            const r = await fetch(
              `/api/offers?hotelIds=${hotelIdsJoined}&amenities=${amenities.join(
                ","
              )}&checkInDate=${checkIn}&checkOutDate=${checkOut}&adults=${adults}`
            );
            const offerData = await r.json();

            (offerData.data || []).forEach((g: any) => {
              const id = g.hotel?.hotelId;
              const offers: Offer[] = g.offers || [];
              const filtered = offers.filter((o) => o.price?.total);
              if (id) allOffers[id] = filtered;
            });
          } catch (e) {
            console.error("오퍼 요청 실패:", e);
          }
        })
      );

      await Promise.all(tasks);

      fetchedHotels.forEach((h: any) => {
        if (!allOffers[h.hotelId]) allOffers[h.hotelId] = [];
      });

      setOffersMap(allOffers);
    } catch (err) {
      console.error("호텔 검색 오류:", err);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------
  // 최저가 계산
  // ----------------------
  const getLowestPrice = (hotelId: string) => {
    const hotelOffers = offersMap[hotelId] || [];

    const priceList = hotelOffers
      .filter((o) => o.price?.total)
      .map((o) => ({
        price: Number(o.price!.total),
        currency: o.price!.currency,
      }));

    if (!priceList.length) return null;
    return priceList.reduce((min, cur) => (cur.price < min.price ? cur : min));
  };

  // ----------------------
  // 정렬된 호텔 리스트
  // ----------------------
  const budgetHotels = useMemo(() => {
    const hotelsWithPrice: Hotel[] = [];
    const hotelsWithoutPrice: Hotel[] = [];

    hotels.forEach((h) => {
      const p = getLowestPrice(h.hotelId);
      if (p) hotelsWithPrice.push(h);
      else hotelsWithoutPrice.push(h);
    });

    if (sortBy === "price") {
      hotelsWithPrice.sort((a, b) => {
        const pa = getLowestPrice(a.hotelId)?.price ?? Infinity;
        const pb = getLowestPrice(b.hotelId)?.price ?? Infinity;
        return pa - pb;
      });
    } else {
      hotelsWithPrice.sort((a, b) => a.name.localeCompare(b.name));
      hotelsWithoutPrice.sort((a, b) => a.name.localeCompare(b.name));
    }

    return [...hotelsWithPrice, ...hotelsWithoutPrice];
  }, [hotels, offersMap, sortBy]);

  // ----------------------
  // ⭐ 자동 스크롤 (메인 리스트)
  // ----------------------
  useEffect(() => {
    if (!selectedHotel) return;
    if (!selectedHotel._scrollTo) return;

    const ref = hotelRefs.current[selectedHotel.hotelId];
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedHotel]);

  // ----------------------
  // ⭐ 자동 스크롤 (지도 모달 리스트)
  // ----------------------
  useEffect(() => {
    if (!selectedHotel) return;
    if (!selectedHotel._scrollTo) return;

    const modalRef = modalHotelRefs.current[selectedHotel.hotelId];
    if (modalRef) {
      modalRef.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedHotel]);

  // ----------------------
  // 상세 패널 열기
  // ----------------------
  const goToSelectedHotelDetail = () => {
    if (!selectedHotel) {
      alert("먼저 숙소를 선택해주세요.");
      return;
    }
    setShowDetailPanel(true);
  };

  // ----------------------
  // 예약 처리
  // ----------------------
  const bookOffer = async () => {
    if (!selectedHotel || !selectedOffer) return;

    try {
      setLoading(true);

      const bookingBody = {
        data: {
          type: "hotel-order",
          guests: [
            {
              tid: 1,
              title: "MR",
              firstName: "BOB",
              lastName: "SMITH",
              phone: "+33679278416",
              email: "bob.smith@email.com",
            },
          ],
          travelAgent: { contact: { email: "bob.smith@email.com" } },
          roomAssociations: [
            {
              guestReferences: [{ guestReference: "1" }],
              hotelOfferId: selectedOffer.id,
            },
          ],
          payment: {
            method: "CREDIT_CARD",
            paymentCard: {
              paymentCardInfo: {
                vendorCode: "VI",
                cardNumber: "4151289722471370",
                expiryDate: "2026-08",
                holderName: "BOB SMITH",
              },
            },
          },
        },
      };

      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingBody),
      });

      const result = await res.json();

      if (!res.ok) {
        alert("예약 실패: " + (result.error || "서버 오류"));
        return;
      }

      setIsRoomModalOpen(false);

      setBookingResult({
        hotelName: selectedHotel.name,
        room: selectedOffer.room?.description?.text,
        checkIn: selectedOffer.checkInDate,
        checkOut: selectedOffer.checkOutDate,
        price: selectedOffer.price?.total,
        currency: selectedOffer.price?.currency,
        bookingId: result.data?.data?.id,
      });

      alert("예약 성공!");
    } catch (err) {
      alert("예약 오류 발생: " + err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------
  // 객실 선택 모달
  // ----------------------
  const renderRoomModal = () => {
    if (!selectedHotel) return null;

    const hotelOffers = offersMap[selectedHotel.hotelId] || [];

    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2000,
        }}
      >
        <div
          style={{
            width: "90%",
            maxWidth: 500,
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <h3 style={{ marginBottom: 10 }}>객실 선택 – {selectedHotel.name}</h3>

          {hotelOffers.map((offer) => (
            <div
              key={offer.id}
              style={{
                padding: 12,
                borderRadius: 10,
                border: "1px solid #ddd",
                marginBottom: 10,
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {offer.room?.description?.text || "방 정보 없음"}
              </div>
              <div style={{ marginTop: 6 }}>
                💰 {offer.price?.total} {offer.price?.currency}
              </div>

              <button
                onClick={() => {
                  setSelectedOffer(offer);
                  bookOffer();
                }}
                style={{
                  width: "100%",
                  marginTop: 10,
                  padding: "8px 0",
                  background: "#50B4BE",
                  border: "none",
                  color: "#fff",
                  borderRadius: 8,
                }}
              >
                이 방으로 예약하기
              </button>
            </div>
          ))}

          <button
            onClick={() => setIsRoomModalOpen(false)}
            style={{
              width: "100%",
              marginTop: 10,
              padding: "8px 0",
              borderRadius: 8,
            }}
          >
            닫기
          </button>
        </div>
      </div>
    );
  };

  // ----------------------
  // UI 렌더링
  // ----------------------
  return (
    <div
      style={{
        padding: 16,
        maxWidth: 480,
        margin: "0 auto",
        paddingBottom: 180, // ✅ 하단 고정 버튼만큼 공간 확보
      }}
    >
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
        숙소 선택 및 예약
      </h2>

      {/* 검색 UI */}
      <div
        style={{
          borderRadius: 12,
          border: "1px solid #eee",
          padding: 12,
          marginBottom: 16,
        }}
      >
        {/* 도시 코드 */}
        <div style={{ marginBottom: 8 }}>
          <label>도시 코드</label>
          <input
            value={cityCode}
            onChange={(e) => setCity(e.target.value.toUpperCase())}
            placeholder="예: TYO, LON, PAR"
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid #ccc",
              padding: "6px 8px",
              fontSize: 14,
            }}
          />
        </div>

        {/* 날짜 */}
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            style={{ flex: 1 }}
          />
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>

        {/* 인원 */}
        <div style={{ marginBottom: 8 }}>
          <label>인원</label>
          <input
            type="number"
            min={1}
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value) || 1)}
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid #ccc",
              padding: "6px 8px",
            }}
          />
        </div>

        {/* 부대시설 */}
        <div style={{ marginBottom: 12 }}>
          <label>부대시설 (Amenity 선택)</label>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}
          >
            {[
              "WIFI",
              "SWIMMING_POOL",
              "SPA",
              "FITNESS_CENTER",
              "PARKING",
              "RESTAURANT",
              "AIR_CONDITIONING",
              "PETS_ALLOWED",
            ].map((a) => (
              <button
                key={a}
                onClick={() => toggleAmenity(a)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 20,
                  border: "1px solid #ccc",
                  background: amenities.includes(a) ? "#50B4BE" : "#fff",
                  color: amenities.includes(a) ? "white" : "black",
                  fontSize: 12,
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* 지도 보기 버튼 */}
        <button
          onClick={() => setShowMap(true)}
          style={{
            width: "100%",
            background: "#fdf6f6ff",
            border: "none",

            borderRadius: 8,
            padding: "10px 0",
            marginTop: 12,
          }}
        >
          지도 보기
        </button>

        {/* 검색 버튼 */}
        <button
          onClick={searchHotels}
          style={{
            width: "100%",
            background: "#50B4BE",
            border: "none",
            color: "#fff",
            borderRadius: 8,
            padding: "10px 0",
            marginTop: 8,
          }}
        >
          호텔 검색
        </button>
      </div>

      {/* ---------------------- */}
      {/* 메인 호텔 리스트 */}
      {/* ---------------------- */}
      {budgetHotels.map((hotel) => {
        const lowest = getLowestPrice(hotel.hotelId);
        const priceText =
          lowest !== null
            ? `${lowest.price.toLocaleString()} ${lowest.currency}~`
            : "가격 정보 없음";

        return (
          <div
            key={hotel.hotelId}
            ref={(el) => {
              modalHotelRefs.current[hotel.hotelId] = el;
            }}
            onClick={() => {
              setSelectedHotel({ ...hotel, _scrollTo: true });
              setShowDetailPanel(true); // ⭐ 상세 페이지 켜기
            }}
            style={{
              marginBottom: 10,
              padding: 12,
              borderRadius: 10,
              border:
                selectedHotel?.hotelId === hotel.hotelId
                  ? "2px solid #50B4BE"
                  : "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{hotel.name}</strong>
              <span>ID: {hotel.hotelId}</span>
            </div>
            <div style={{ fontSize: 13 }}>💰 {priceText}</div>

            {selectedHotel?.hotelId === hotel.hotelId && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRoomModalOpen(true);
                }}
                style={{
                  marginTop: 8,
                  width: "100%",
                  padding: "8px 0",
                  background: "#50B4BE",
                  border: "none",
                  color: "#fff",
                  borderRadius: 8,
                }}
              >
                예약하기
              </button>
            )}
          </div>
        );
      })}

      {/* ---------------------- */}
      {/* 지도 모달 */}
      {/* ---------------------- */}
      {showMap && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3000,
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: 900,
              height: "80vh",
              background: "#fff",
              borderRadius: 12,
              overflow: "hidden",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setShowMap(false)}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: 6,
              }}
            >
              닫기
            </button>

            {/* 지도 */}
            <div style={{ flex: 2 }}>
              <HotelMap
                hotels={hotels}
                offers={offersMap}
                selectedHotel={selectedHotel}
                onSelectHotel={(hotel: Hotel | null) =>
                  setSelectedHotel(hotel ? { ...hotel, _scrollTo: true } : null)
                }
                cityCenter={mapCenter || undefined}
              />
            </div>

            {/* ⭐ 오른쪽 호텔 목록 */}
            <div
              style={{
                flex: 1,
                borderLeft: "1px solid #eee",
                padding: 10,
                overflowY: "auto",
              }}
            >
              <h4>호텔 목록</h4>

              {hotels.map((hotel) => {
                const lowest = getLowestPrice(hotel.hotelId);

                return (
                  <div
                    key={hotel.hotelId}
                    ref={(el) => {
                      modalHotelRefs.current[hotel.hotelId] = el;
                    }}
                    onClick={() => {
                      setSelectedHotel({ ...hotel, _scrollTo: true });
                      setShowDetailPanel(true); // ⭐ 상세 패널 열기
                      setShowMap(false); // ⭐ 지도 닫기
                    }}
                    style={{
                      padding: 8,
                      borderRadius: 8,
                      border:
                        selectedHotel?.hotelId === hotel.hotelId
                          ? "2px solid #1f6feb"
                          : "1px solid #ccc",
                      cursor: "pointer",
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>{hotel.name}</div>
                    <div style={{ fontSize: 12 }}>
                      💰
                      {lowest
                        ? `${lowest.price.toLocaleString()} ${lowest.currency}~`
                        : "가격 없음"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 객실 모달 */}
      {isRoomModalOpen && renderRoomModal()}

      {/* 상세보기 버튼 */}
      {/* ⭐ 화면 하단 고정 버튼 박스 */}
      <div
        style={{
          position: "fixed",
          bottom: 85,
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          zIndex: 1000,
        }}
      >
        {/* ---------------------- */}
        {/* 예약 완료 표시 */}
        {/* ---------------------- */}
        {bookingResult && (
          <div
            style={{
              marginTop: 20,
              padding: 15,
              border: "2px solid green",
              borderRadius: 8,
              background: "black",
              color: "white",
            }}
          >
            <h2>✅ 예약 완료</h2>
            <p>호텔명: {bookingResult.hotelName}</p>
            <p>객실: {bookingResult.room}</p>
            <p>
              체크인: {bookingResult.checkIn} | 체크아웃:{" "}
              {bookingResult.checkOut}
            </p>
            <p>
              총액: {bookingResult.price} {bookingResult.currency}
            </p>
            <p>예약ID: {bookingResult.bookingId}</p>
          </div>
        )}
        {/* ⭐ 이전 / 다음 버튼 라인 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => router.push("/hotel1")}
            style={{
              flex: 1,
              marginRight: 8,
              padding: "10px 14px",
              border: "none",
              background: "#ccc",
              borderRadius: 8,
            }}
          >
            ← 이전
          </button>

          <button
            onClick={() => router.push("/next")}
            style={{
              flex: 1,
              marginLeft: 8,
              padding: "10px 14px",
              background: "#50B4BE",
              border: "none",
              color: "#fff",
              borderRadius: 8,
            }}
          >
            다음 →
          </button>
        </div>

        {/* ⭐ 선택한 숙소 상세보기 버튼 */}
        <button
          onClick={goToSelectedHotelDetail}
          style={{
            width: "100%",
            background: "#50B4BE",
            border: "none",
            color: "#fff",
            borderRadius: 10,
            padding: "14px 0",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          }}
        >
          선택한 숙소 상세보기
        </button>
      </div>

      {/* 오른쪽 상세 패널 */}
      {showDetailPanel && selectedHotel && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,

            maxWidth: "100%",

            left: 0, // ⭐ 왼쪽까지 붙여주기
            height: "100vh",
            background: "#ffffffff",
            boxShadow: "-4px 0 20px rgba(0,0,0,0.2)",
            zIndex: 3000,
            padding: 20,
            overflowY: "auto",
            transform: "translateX(0)",
            transition: "transform 0.35s ease-in-out",
          }}
        >
          <button
            onClick={() => setShowDetailPanel(false)}
            style={{
              marginBottom: 12,
              padding: "8px 12px",
              borderRadius: 8,
              background: "gray",
              border: "none",
              color: "white",
            }}
          >
            ← 뒤로가기
          </button>

          <h2 style={{ fontWeight: 700, color: "black" }}>
            {selectedHotel.name}
          </h2>
          <p style={{ color: "black" }}>Hotel ID: {selectedHotel.hotelId}</p>

          <h3 style={{ marginTop: 20, color: "black" }}>객실 & 가격</h3>
          {(offersMap[selectedHotel.hotelId] || []).map((offer) => (
            <div
              key={offer.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 12,
                marginBottom: 10,
                background: "white",
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {offer.room?.description?.text || "방 정보 없음"}
              </div>

              <div>
                💰 {offer.price?.total} {offer.price?.currency}
              </div>

              <button
                onClick={() => {
                  setSelectedOffer(offer);
                  bookOffer();
                }}
                style={{
                  marginTop: 10,
                  width: "100%",
                  background: "#50B4BE",
                  border: "none",
                  color: "white",
                  padding: "8px 0",
                  borderRadius: 6,
                }}
              >
                이 방 예약하기
              </button>
            </div>
          ))}
        </div>
      )}
      <style jsx global>{`
        button {
          transition: background-color 0.15s ease, transform 0.1s ease;
        }

        /* 마우스 올렸을 때 (hover) - 살짝 어두워짐 */
        button:hover {
          filter: brightness(0.92);
        }

        /* 클릭 순간 (active) - 더 눌린 느낌 */
        button:active {
          filter: brightness(0.75);
          transform: scale(0.98);
        }
      `}</style>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
