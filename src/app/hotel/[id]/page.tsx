"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Hotel {
  hotelId: string;
  name: string;
  chainCode?: string;
  iataCode?: string;
  rating?: number;
  geoCode?: { latitude: number; longitude: number };
}

interface Offer {
  id: string;
  price?: { total?: string; currency?: string };
  room?: { description?: { text?: string } };
  checkInDate?: string;
  checkOutDate?: string;
}

export default function HotelDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOfferDetail, setSelectedOfferDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  // -----------------------------
  // 📌 세션에서 호텔 & 오퍼 목록 읽기
  // -----------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedHotel = sessionStorage.getItem("selectedHotel");
    const savedOffers = sessionStorage.getItem("selectedOffers");

    if (savedHotel) {
      try {
        const parsed = JSON.parse(savedHotel);
        if (parsed?.hotelId === id) setHotel(parsed);
      } catch {}
    }

    if (savedOffers) {
      try {
        setOffers(JSON.parse(savedOffers));
      } catch {}
    }
  }, [id]);

  // -----------------------------
  //  오퍼 상세 불러오기 API 호출
  // -----------------------------
  const loadOfferDetail = async (offerId: string) => {
    setLoading(true);

    const res = await fetch(`/api/offer/${offerId}`);
    const json = await res.json();

    setSelectedOfferDetail(json.data);
    setLoading(false);
  };

  // -----------------------------
  // 예약하기 API 호출
  // -----------------------------
  const bookOffer = async (offer: any) => {
    try {
      setLoading(true);

      const body = {
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
              hotelOfferId: offer.id,
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
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (!res.ok || !result?.data?.data?.id) {
        alert("예약 실패: " + (result.error || "알 수 없는 오류"));
        return;
      }

      // -------------------------------------------------------
      // 2) 예약 성공 → 여기에만 DB 저장 코드 실행
      // -------------------------------------------------------
      await fetch("/api/order/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: hotel.hotelId,
          hotelName: hotel.name,
          offerId: offer.id,
          room: offer.room?.description?.text,
          price: offer.price?.total,
          currency: offer.price?.currency,
          checkIn: offer.checkInDate,
          checkOut: offer.checkOutDate,
        }),
      });

      // 3) UI에 예약 결과 업데이트
      setBookingResult(result);
      alert("예약 완료!");
    } catch (err) {
      alert("예약 오류: " + err);
    } finally {
      setLoading(false);
    }
  };

  if (!hotel) return <p>호텔 정보를 불러올 수 없습니다.</p>;

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => router.push("/")}>← 뒤로가기</button>

      <h1>{hotel.name}</h1>
      <p>호텔 ID: {hotel.hotelId}</p>

      {/* ---------------------------------------- */}
      {/* 기본 오퍼 목록 */}
      {/* ---------------------------------------- */}
      <h2>객실 오퍼</h2>

      {offers.length === 0 && <p>오퍼 없음</p>}

      {offers.map((offer) => (
        <div
          key={offer.id}
          style={{
            marginBottom: 10,
            padding: 12,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        >
          <p>
            💰 가격:{" "}
            {offer.price?.total
              ? `${offer.price.total} ${offer.price.currency}`
              : "가격 없음"}
          </p>

          <p>{offer.room?.description?.text || "객실 설명 없음"}</p>

          <p>
            📆 {offer.checkInDate} → {offer.checkOutDate}
          </p>

          <button
            style={{
              marginTop: 8,
              padding: "8px 12px",
              background: "#222",
              color: "white",
              borderRadius: 6,
            }}
            onClick={() => loadOfferDetail(offer.id)}
          >
            상세 정보 보기
          </button>
          <button onClick={() => bookOffer(offer)}>예약하기</button>
        </div>
      ))}

      {/* ---------------------------------------- */}
      {/* 선택한 오퍼 상세 정보 표시 */}
      {/* ---------------------------------------- */}
      {selectedOfferDetail && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            background: "#f7f7f7",
            borderRadius: 8,
          }}
        >
          <h2>상세 오퍼 정보</h2>

          <h3>호텔 어메니티</h3>
          <ul>
            {selectedOfferDetail.hotel.amenities?.map((a: string) => (
              <li key={a}>{a}</li>
            )) || <p>없음</p>}
          </ul>

          <h3>방 정보</h3>
          <p>{selectedOfferDetail.offers[0].room?.description?.text}</p>

          <h3>가격</h3>
          <p>
            총액: {selectedOfferDetail.offers[0].price.total}{" "}
            {selectedOfferDetail.offers[0].price.currency}
          </p>

          <h4>세금 정보</h4>
          <pre style={{ background: "#eee", padding: 10 }}>
            {JSON.stringify(selectedOfferDetail.offers[0].price.taxes, null, 2)}
          </pre>

          <h4>정책</h4>
          <pre style={{ background: "#eee", padding: 10 }}>
            {JSON.stringify(selectedOfferDetail.offers[0].policies, null, 2)}
          </pre>

          <button
            style={{
              marginTop: 10,
              padding: "10px 15px",
              background: "black",
              color: "white",
              borderRadius: 8,
            }}
            onClick={() => bookOffer(selectedOfferDetail.offers[0])}
          >
            예약하기
          </button>

          {bookingResult && (
            <div
              style={{
                marginTop: 20,
                padding: 15,
                border: "2px solid green",
                borderRadius: 8,
              }}
            >
              <h2>예약 완료 🎉</h2>
              <pre>{JSON.stringify(bookingResult, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
