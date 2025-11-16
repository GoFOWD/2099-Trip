"use client";

import { useRef, useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

interface Hotel {
  hotelId: string;
  name: string;
  geoCode?: { latitude: number; longitude: number };
  _scrollTo?: boolean; // ⭐ 리스트 자동 스크롤용 플래그
}

interface Offer {
  id: string;
  price?: { total?: string; currency?: string };
}

interface Props {
  hotels: Hotel[];
  offers: Record<string, Offer[]>;
  selectedHotel: Hotel | null;
  onSelectHotel: (hotel: Hotel | null) => void;
  cityCenter?: { lat: number; lng: number };
}

export default function HotelMap({
  hotels,
  offers,
  selectedHotel,
  onSelectHotel,
  cityCenter,
}: Props) {
  const [center, setCenter] = useState({ lat: 35.6804, lng: 139.769 });
  const [openHotelId, setOpenHotelId] = useState<string | null>(null);
  const [visibleHotels, setVisibleHotels] = useState<Hotel[]>([]);
  const [zoom, setZoom] = useState(12);
  const [hasUserMoved, setHasUserMoved] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (cityCenter && !hasUserMoved) {
      setCenter(cityCenter);
    }
  }, [cityCenter, hasUserMoved]);

  useEffect(() => {
    if (!selectedHotel || !selectedHotel.geoCode || !mapRef.current) return;

    const { latitude, longitude } = selectedHotel.geoCode;
    mapRef.current.panTo({ lat: latitude, lng: longitude });
    mapRef.current.setZoom(15);

    setCenter({ lat: latitude, lng: longitude });

    setOpenHotelId(selectedHotel.hotelId);
  }, [selectedHotel]);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    updateVisibleHotels(map, zoom);
  };

  const onZoomChanged = () => {
    if (!mapRef.current) return;
    const z = mapRef.current.getZoom() || 12;
    setZoom(z);
    updateVisibleHotels(mapRef.current, z);
  };

  const onMapIdle = () => {
    if (!mapRef.current) return;
    updateVisibleHotels(mapRef.current, zoom);
  };

  const onDragEnd = () => {
    if (!mapRef.current) return;
    setHasUserMoved(true);
    const c = mapRef.current.getCenter();
    if (c) setCenter({ lat: c.lat(), lng: c.lng() });
  };

  const updateVisibleHotels = (map: google.maps.Map, z: number) => {
    const bounds = map.getBounds();
    if (!bounds) return;

    let filtered = hotels.filter((hotel) => {
      if (!hotel.geoCode) return false;
      const pos = new google.maps.LatLng(
        hotel.geoCode.latitude,
        hotel.geoCode.longitude
      );
      return bounds.contains(pos);
    });

    if (z < 10) filtered = filtered.slice(0, 10);
    else if (z < 12) filtered = filtered.slice(0, 30);
    else if (z < 14) filtered = filtered.slice(0, 60);

    if (selectedHotel) {
      if (!filtered.some((h) => h.hotelId === selectedHotel.hotelId)) {
        filtered.push(selectedHotel);
      }
    }

    if (openHotelId) {
      const clicked = hotels.find((h) => h.hotelId === openHotelId);
      if (clicked && !filtered.some((h) => h.hotelId === openHotelId)) {
        filtered.push(clicked);
      }
    }

    setVisibleHotels(filtered);
  };

  const createPriceMarker = (price: string) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="40">
        <rect width="120" height="40" rx="8" ry="8"
          fill="#2A6BF2" stroke="#003B95" stroke-width="2"/>
        <text x="60" y="25" font-size="16" font-weight="700"
          fill="white" text-anchor="middle">${price}</text>
      </svg>
    `;
    return {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
      scaledSize: new google.maps.Size(120, 40),
      anchor: new google.maps.Point(60, 40),
    };
  };

  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "100%",
      }}
      center={center}
      zoom={zoom}
      onLoad={onMapLoad}
      onIdle={onMapIdle}
      onZoomChanged={onZoomChanged}
      onDragEnd={onDragEnd}
      options={{ gestureHandling: "greedy" }}
    >
      {visibleHotels.map((hotel) => {
        if (!hotel.geoCode) return null;
        const { latitude: lat, longitude: lng } = hotel.geoCode;

        const hotelOffers = offers[hotel.hotelId] || [];
        const best = hotelOffers
          .filter((o) => o.price?.total)
          .map((o) => ({
            price: Number(o.price!.total),
            currency: o.price!.currency || "",
          }))
          .sort((a, b) => a.price - b.price)[0];

        // ⭐ 여기서 _scrollTo: true 넣어줌 (핵심)
        const handleClickHotel = () => {
          onSelectHotel({ ...hotel, _scrollTo: true });
          setOpenHotelId(hotel.hotelId);
        };

        if (!best) {
          return (
            <Marker
              key={hotel.hotelId}
              position={{ lat, lng }}
              onClick={handleClickHotel}
            />
          );
        }

        const priceLabel = `${best.price.toLocaleString()} ${best.currency}`;
        return (
          <Marker
            key={hotel.hotelId}
            position={{ lat, lng }}
            onClick={handleClickHotel}
            icon={createPriceMarker(priceLabel)}
          />
        );
      })}

      {selectedHotel &&
        selectedHotel.geoCode &&
        openHotelId === selectedHotel.hotelId && (
          <InfoWindow
            position={{
              lat: selectedHotel.geoCode.latitude,
              lng: selectedHotel.geoCode.longitude,
            }}
            onCloseClick={() => setOpenHotelId(null)}
          >
            <div style={{ minWidth: 220, padding: 10 }}>
              <h3 style={{ margin: "0 0 5px 0" }}>{selectedHotel.name}</h3>
            </div>
          </InfoWindow>
        )}
    </GoogleMap>
  );
}
