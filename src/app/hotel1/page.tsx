"use client";
import pLimit from "p-limit";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  _scrollTo?: boolean;
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
  const searchParams = useSearchParams();

  // ----------------------
  // URL 파라미터 처리
  // ----------------------
  const urlCity = searchParams.get("city");
  const urlBudget = searchParams.get("budget");
  const urlAdults = searchParams.get("adults");
  const urlCheckIn = searchParams.get("checkIn");
  const urlCheckOut = searchParams.get("checkOut");

  // ----------------------
  // 기본값들
  // ----------------------
  const [cityCode, setCity] = useState(urlCity || "TYO");
  const [budget, setBudget] = useState(urlBudget ? Number(urlBudget) : 730000);
  const [tempBudget, setTempBudget] = useState(budget);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);

  const [adults, setAdults] = useState(urlAdults ? Number(urlAdults) : 2);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [amenities, setAmenities] = useState<string[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [offersMap, setOffersMap] = useState<Record<string, Offer[]>>({});
  const [loading, setLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  // 지도 — 모달
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // 정렬
  const [sortBy, setSortBy] = useState<"priceLow" | "priceHigh">("priceLow");

  const hotelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const modalHotelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [bookingResult, setBookingResult] = useState<any>(null);

  // ----------------------
  // 체크인 / 체크아웃 기본값 설정
  // ----------------------
  useEffect(() => {
    if (urlCheckIn && urlCheckOut) {
      setCheckIn(urlCheckIn);
      setCheckOut(urlCheckOut);
      return;
    }

    const today = new Date();
    const t1 = new Date(today);
    const t2 = new Date(today);
    t1.setDate(today.getDate() + 1);
    t2.setDate(today.getDate() + 2);

    setCheckIn(t1.toISOString().split("T")[0]);
    setCheckOut(t2.toISOString().split("T")[0]);
  }, []);

  // ----------------------
  // 숙박박수 계산
  // ----------------------
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = d2.getTime() - d1.getTime();
    return Math.max(1, diff / 86400000);
  }, [checkIn, checkOut]);

  // ----------------------
  // 편의시설 toggle
  // ----------------------
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
        setMapCenter({
          lat: fetchedHotels[0].geoCode.latitude,
          lng: fetchedHotels[0].geoCode.longitude,
        });
      }

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
          const q = chunk.join(",");
          const r = await fetch(
            `/api/offers?hotelIds=${q}&amenities=${amenities.join(
              ","
            )}&checkInDate=${checkIn}&checkOutDate=${checkOut}&adults=${adults}`
          );
          const offerData = await r.json();

          (offerData.data || []).forEach((g: any) => {
            const id = g.hotel.hotelId;
            const offers = g.offers || [];
            const valid = offers.filter((o: Offer) => o.price?.total);
            allOffers[id] = valid;
          });
        })
      );

      await Promise.all(tasks);

      setOffersMap(allOffers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------
  // 최저가
  // ----------------------
  const getLowestPrice = (hotelId: string) => {
    const list = offersMap[hotelId] || [];
    const prices = list
      .filter((o) => o.price?.total)
      .map((o) => ({
        price: Number(o.price!.total),
        currency: o.price!.currency,
      }));
    if (!prices.length) return null;
    return prices.reduce((a, b) => (b.price < a.price ? b : a));
  };

  // ----------------------
  // 예산 적용 + 정렬
  // ----------------------
  const budgetHotels = useMemo(() => {
    const list = hotels.filter((h) => {
      const low = getLowestPrice(h.hotelId);
      return low && low.price <= budget;
    });

    if (sortBy === "priceLow") {
      return list.sort(
        (a, b) =>
          (getLowestPrice(a.hotelId)?.price ?? Infinity) -
          (getLowestPrice(b.hotelId)?.price ?? Infinity)
      );
    } else {
      return list.sort(
        (a, b) =>
          (getLowestPrice(b.hotelId)?.price ?? Infinity) -
          (getLowestPrice(a.hotelId)?.price ?? Infinity)
      );
    }
  }, [hotels, offersMap, budget, sortBy]);

  // ----------------------
  // 선택 호텔 스크롤 (메인 리스트)
  // ----------------------
  useEffect(() => {
    if (!selectedHotel) return;
    hotelRefs.current[selectedHotel.hotelId]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [selectedHotel]);

  // ----------------------
  // 상세보기 버튼
  // ----------------------
  const goToSelectedHotelDetail = () => {
    if (!selectedHotel) {
      alert("먼저 숙소를 선택해주세요.");
      return;
    }
    setShowDetailPanel(true);
  };
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

  useEffect(() => {
    // 값이 준비된 상태에서 자동 검색 실행
    if (!cityCode || !checkIn || !checkOut) return;
    searchHotels();
  }, [cityCode, checkIn, checkOut, adults, budget]);
  // ============================================================
  // UI 렌더링
  // ============================================================
  return (
    <div
      style={{
        padding: 16,
        maxWidth: 480,
        margin: "0 auto",
        paddingBottom: 200,
      }}
    >
      {/* ----------------------------- */}
      {/* 상단 고정 ① : 도시 + 숙박박수 + 예산카드 */}
      {/* ----------------------------- */}
      <div
        style={{
          position: "sticky",
          top: 0,
          borderRadius: "16px",
          background: "#259e37ff",
          zIndex: 20,
          padding: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* 도시/박수 */}
          <div>
            <div
              style={{
                color: "#ffffffff",
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              {cityCode}
            </div>

            <div style={{ fontSize: 13, color: "#ffffffff" }}>
              {nights}박 숙박
            </div>
          </div>

          {/* 예산 카드 */}
          <div
            style={{
              background: "#259e37ff",
              padding: "10px 14px",
              borderRadius: 12,
              textAlign: "right",
              minWidth: 130,
            }}
          >
            <div style={{ fontSize: 12, color: "#ffffffff" }}>숙박 예산</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#ffffffff" }}>
              {budget.toLocaleString()}원
            </div>
            <div style={{ fontSize: 12, color: "#ffffffff" }}>
              총 {nights}박
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------- */}
      {/* 상단 고정 ② : 가격순 / 필터 / 지도 */}
      {/* ----------------------------- */}
      <div
        style={{
          position: "sticky",
          top: 110,
          background: "#fff",
          zIndex: 19,
          padding: "8px 0",
          display: "flex",
          gap: 8,
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() =>
            setSortBy(sortBy === "priceLow" ? "priceHigh" : "priceLow")
          }
          style={{
            flex: 1,
            padding: "12px 0",
            borderRadius: 8,
            background: "#50B4BE",

            border: "none",
          }}
        >
          가격순 {sortBy === "priceLow" ? "⬇" : "⬆"}
        </button>

        <button
          onClick={() => setBudgetModalOpen(true)}
          style={{
            flex: 1,
            padding: "12px 0",
            borderRadius: 8,
            background: "#50B4BE",
            border: "none",
          }}
        >
          필터
        </button>

        <button
          onClick={() => setShowMap(true)}
          style={{
            flex: 1,
            padding: "12px 0",
            borderRadius: 8,
            background: "#50B4BE",
            border: "none",
          }}
        >
          지도
        </button>
      </div>

      {/* ----------------------------- */}
      {/* 호텔 리스트 */}
      {/* ----------------------------- */}
      <h4 style={{ marginTop: 16 }}>예약 가능 숙소 {budgetHotels.length}개</h4>

      {budgetHotels.length === 0 && (
        <div
          style={{
            padding: 20,
            textAlign: "center",
            borderRadius: 10,
            marginTop: 12,
          }}
        >
          예산에 맞는 숙소가 없습니다.
          <br />
          필터 또는 예산을 조정하세요.
        </div>
      )}

      {budgetHotels.map((hotel) => {
        const low = getLowestPrice(hotel.hotelId);

        return (
          <div
            key={hotel.hotelId}
            ref={(el) => {
              hotelRefs.current[hotel.hotelId] = el;
            }}
            onClick={() => {
              setSelectedHotel({ ...hotel, _scrollTo: true });
              setShowDetailPanel(true);
              setShowMap(false);
              // ⭐ 상세 페이지 자동 열림
            }}
            style={{
              padding: 14,
              border:
                selectedHotel?.hotelId === hotel.hotelId
                  ? "2px solid #50B4BE"
                  : "1px solid #ddd",
              borderRadius: 12,
              marginBottom: 12,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <strong>{hotel.name}</strong>
              <span style={{ fontSize: 12, color: "#666" }}>
                ID: {hotel.hotelId}
              </span>
            </div>

            <div style={{ fontSize: 14 }}>
              {low
                ? `💰 ${low.price.toLocaleString()} ${low.currency}~`
                : "가격 없음"}
            </div>

            {selectedHotel?.hotelId === hotel.hotelId && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRoomModalOpen(true);
                }}
                style={{
                  width: "100%",
                  marginTop: 10,
                  padding: "10px 0",
                  borderRadius: 8,
                  background: "#50B4BE",
                  border: "none",
                  color: "white",
                }}
              >
                객실 선택
              </button>
            )}
          </div>
        );
      })}

      {/* ----------------------------- */}
      {/* 지도 모달 */}
      {/* ----------------------------- */}
      {showMap && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
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
                zIndex: 60,
              }}
            >
              닫기
            </button>

            {/* 지도 영역 */}
            <div style={{ flex: 2 }}>
              <HotelMap
                hotels={budgetHotels}
                offers={offersMap}
                selectedHotel={selectedHotel}
                onSelectHotel={(hotel: Hotel | null) =>
                  setSelectedHotel(hotel ? { ...hotel, _scrollTo: true } : null)
                }
                cityCenter={mapCenter || undefined}
              />
            </div>

            {/* 지도 옆 호텔 리스트 */}
            <div
              style={{
                flex: 1,
                padding: 10,
                overflowY: "auto",
              }}
            >
              <h4>호텔 목록 (예산 내)</h4>
              {budgetHotels.map((hotel) => {
                const low = getLowestPrice(hotel.hotelId);
                return (
                  <div
                    key={hotel.hotelId}
                    ref={(el) => {
                      modalHotelRefs.current[hotel.hotelId] = el;
                    }}
                    onClick={() => {
                      setSelectedHotel({ ...hotel, _scrollTo: true });
                      setShowDetailPanel(true); // ⭐ 상세페이지 자동 열기
                    }}
                    style={{
                      padding: 8,
                      marginBottom: 8,
                      borderRadius: 8,
                      border:
                        selectedHotel?.hotelId === hotel.hotelId
                          ? "2px solid #50B4BE"
                          : "1px solid #ccc",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{hotel.name}</div>
                    <div style={{ fontSize: 13 }}>
                      {low
                        ? `💰 ${low.price.toLocaleString()} ${low.currency}~`
                        : "가격 없음"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* ---------------------- */}
      {/* 예약 완료 표시 */}
      {/* ---------------------- */}

      {/* ----------------------------- */}
      {/* 하단 고정 네비 & 선택한 숙소 상세보기 */}
      {/* ----------------------------- */}
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
        }}
      >
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
            <h2> 예약 완료</h2>
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
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => router.push("/prev")}
            style={{
              flex: 1,
              padding: 12,
              background: "#50B4BE",
              border: "none",
              borderRadius: 8,
            }}
          >
            ← 이전
          </button>

          <button
            onClick={() => router.push("/hotel")}
            style={{
              flex: 1,
              padding: 16,
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
            padding: "20px 0",
            fontWeight: 600,
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
            left: 0,

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

          <h2 style={{ fontWeight: 700, color: "white" }}>
            {selectedHotel.name}
          </h2>
          <p style={{ color: "white" }}>Hotel ID: {selectedHotel.hotelId}</p>

          <h3 style={{ marginTop: 20, color: "white" }}>객실 & 가격</h3>
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
        /* 모든 버튼 공통 효과 */
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
      {/* ----------------------------- */}
      {/* 필터 모달 (예산/인원/도시/날짜 등) */}
      {/* ----------------------------- */}
      {budgetModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 30,
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: 430,
              background: "#fff",
              borderRadius: 12,
              padding: 20,
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <h3>필터</h3>

            {/* 예산 슬라이더 */}
            <div style={{ marginTop: 12 }}>
              <div style={{ marginBottom: 6 }}>
                예산: {budget.toLocaleString()}원
              </div>
              <input
                type="range"
                min={100000}
                max={2000000}
                step={50000}
                value={budget}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setBudget(v);
                  setTempBudget(v); // ⭐ 슬라이더 움직일 때 직접 입력값도 동기화
                }}
                style={{ width: "100%" }}
              />
            </div>

            {/* 예산 직접 입력 */}
            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 6 }}>예산 직접 입력</div>
              <input
                type="number"
                value={tempBudget}
                onChange={(e) => setTempBudget(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                }}
              />
            </div>

            {/* 도시 */}
            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 6 }}>도시 코드</div>
              <input
                value={cityCode}
                onChange={(e) => setCity(e.target.value.toUpperCase())}
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                }}
              />
            </div>

            {/* 날짜 */}
            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 6 }}>체크인 / 체크아웃</div>
              <div style={{ display: "flex", gap: 8 }}>
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
            </div>

            {/* 인원 */}
            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 6 }}>인원</div>
              <input
                type="number"
                value={adults}
                min={1}
                onChange={(e) => setAdults(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                }}
              />
            </div>

            {/* 편의시설 */}
            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 6 }}>편의시설</div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  "WIFI",
                  "SPA",
                  "FITNESS_CENTER",
                  "PARKING",
                  "RESTAURANT",
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
                      color: amenities.includes(a) ? "#fff" : "#000",
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* 하단 버튼 */}
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <button
                onClick={() => setBudgetModalOpen(false)}
                style={{
                  flex: 1,
                  padding: 12,
                  background: "#ccc",
                  border: "none",
                  borderRadius: 8,
                }}
              >
                닫기
              </button>

              <button
                onClick={() => {
                  setBudget(tempBudget);
                  searchHotels();
                  setBudgetModalOpen(false);
                }}
                style={{
                  flex: 1,
                  padding: 12,
                  background: "#50B4BE",
                  border: "none",
                  color: "#fff",
                  borderRadius: 8,
                }}
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
