"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadPack } from "../utils/loadPack";

/* =========================
   글로벌 스타일
========================= */
export const helpStyles = `
:root{
  --mint:#50B4BE;
  --mint-weak:#D9F1F3;
  --border:#E6EEF3;
  --card:#FFFFFF;
  --ink:#0B0B12;

  --head-bg:#FCEAEA;       /* 상단 배경(연핑크) */
  --head-icon-bg:#F7D7D4;  /* 아이콘 원 배경 */
  --head-title:#E54848;    /* '긴급 도움' 진한 빨강 */
  --head-sub:#A33C3C;      /* Emergency Help 진한 톤 */
}

.sospack.help-wrap{ padding:12px; }

/* 헤더 */
.help-header{
  display:flex; align-items:center; justify-content:space-between;
  background:var(--head-bg);
  border-radius:14px; padding:12px 14px; position:sticky; top:0; z-index:20;
  box-shadow:0 2px 10px rgba(0,0,0,.05);
}
.help-header-left{ display:flex; gap:10px; align-items:center; }
.help-emoji{
  width:34px; height:34px; border-radius:999px; display:grid; place-items:center;
  background:var(--head-icon-bg); font-size:18px;
}
.help-title{ font-weight:800; color:var(--head-title); line-height:1; }
.help-sub{ font-size:12px; color:var(--head-sub); margin-top:2px; }
.help-close{ background:none; border:0; cursor:pointer; font-size:18px; line-height:1; color:#6C757D; }

/* 탭 레일 */
.help-tabs-rail{
  margin-top:12px; background:#F1F3F5; border:1px solid var(--border);
  border-radius:14px; padding:14px 10px 10px;
}
.tab-grip{
  width:42px; height:4px; border-radius:999px; margin:0 auto 10px;
  background:#D0D5DB;
}
.help-tabs{ display:flex; align-items:center; justify-content:space-between; gap:8px; }
.help-tab{
  flex:1 1 0; text-align:center; padding:10px 0; border-radius:10px;
  background:#fff; color:#334155; border:1px solid var(--border);
  font-weight:700; transition:all .15s ease;
}
.help-tab.on{
  background:var(--mint-weak);
  color:#0b3e42; border-color:#8bcdd4;
  box-shadow:0 2px 8px rgba(80,180,190,.25) inset;
}

/* 섹션 타이틀 + 설명(5ch 들여쓰기) */
.help-section-title{ margin:14px 0 6px; font-weight:800; color:#0B0B12; }
.help-desc{ margin:0 0 14px; color:#495057; text-indent:5ch; }

/* 카드 */
.help-list{ display:grid; gap:12px; }
.help-card{
  background:var(--card); border:1px solid var(--border); border-radius:16px;
  padding:14px; box-shadow:0 4px 16px rgba(0,0,0,.06);
}
.help-card-head{ display:flex; gap:10px; align-items:center; margin-bottom:10px; }
.help-icon{
  width:34px; height:34px; border-radius:999px; display:grid; place-items:center;
  background:#F3F4F6; border:1px solid var(--border);
}
.help-icon-emoji{ font-size:18px; }
.help-card-title{ font-weight:800; color:#0B0B12; }
.help-card-name{ font-weight:800; margin-bottom:6px; color:#0B0B12; }
.help-card-addr{ color:#667085; font-size:14px; }

/* 액션 버튼: 사각형(중앙정렬) */
.help-actions{ margin-top:12px; display:flex; align-items:center; justify-content:center; gap:12px; }
.help-btn{
  height:44px; padding:0 18px; border-radius:8px;
  font-weight:800; border:1px solid transparent;
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
}
.help-btn.call{ background:var(--mint); color:#fff; min-width:120px; }
.help-btn.outline{ background:#fff; color:#0b3e42; border-color:#8bcdd4; min-width:120px; }
.help-btn:hover{ filter:brightness(1.03); }
.help-btn.outline:hover{ background:#f6fbfc; }

/* '알아두세요' 패널 */
.help-info{ margin-top:12px; background:#FFF3D6; border:1px solid #F4C84A; border-radius:12px; padding:14px 16px; }
.help-info-title{ font-weight:800; color:#6B4E00; margin-bottom:6px; display:flex; align-items:center; gap:6px; }
.help-info-title::before{ content:"ⓘ"; font-weight:800; }
.help-info-list{ margin:0; padding-left:18px; color:#6B4E00; }
.help-info-list a{ color:#6B4E00; text-decoration:underline; }

/* 현지표현 번호뱃지/빨간점 fix */
.help-wrap .phrase-list{ display:grid; gap:12px; counter-reset:ph; }
.help-wrap .phrase{
  position:relative; background:#fff; border:1px solid #E6EEF3; border-radius:12px;
  padding:12px 12px 12px 40px;
}
.help-wrap .phrase::before{
  counter-increment:ph; content:counter(ph); position:absolute; left:12px; top:12px;
  width:20px; height:20px; display:grid; place-items:center; font-size:12px; font-weight:800;
  color:#0B0B12; background:#FFECCF; border:1px solid #F4C84A; border-radius:999px;
}
.help-tabs, .help-tabs *{ list-style:none; }
.help-tab{ -webkit-tap-highlight-color:transparent; outline:none; }
.help-tab::marker{ content:""; }
`;

/* 아이콘(이모지) */
const KIND_EMOJI = {
  "대사관": "🏛️",
  "경찰서": "🚓",
  "병원":  "🏥",
};

export default function HelpPage() {
  const router = useRouter();
  const params = useSearchParams();

  const from = (params.get("from") || "").toLowerCase(); // sos에서 열었는지 구분용
  const country = (params.get("c") || "").toUpperCase();
  const cityId  = params.get("city") || "";
  const currentId = cityId || country;

  const [data, setData] = useState(null);
  const [err, setErr]   = useState("");
  const [tab, setTab]   = useState("contact"); // contact | phrases | share
  const [phraseCat, setPhraseCat] = useState("sos");

  /* 닫기: 오버레이만 닫히도록 */
  const handleClose = () => {
    const keepStateDest = `/sos?c=${country}${cityId ? `&city=${cityId}` : ""}`;

    // 메인(/sos)에서 열었으면 뒤로가기 → 오버레이만 닫힘
    if (from === "sos") { router.back(); return; }
    if (typeof document !== "undefined" && document.referrer.includes("/sos")) {
      router.back(); return;
    }
    // 팝업으로 열렸다면 창 닫기
    if (typeof window !== "undefined" && window.opener && !window.opener.closed) {
      window.close(); return;
    }
    // 그 외엔 상태 유지한 채 /sos로
    router.replace(keepStateDest);
  };

  /* 데이터 로드 */
  useEffect(() => {
    if (!currentId) return;
    setErr(""); setData(null);
    loadPack(currentId)
      .then(j => {
        setData(j);
        const keys = Object.keys(j?.phrases || {});
        const order = ["sos","travel","taxi","hotel","allergy"];
        setPhraseCat(order.find(k => keys.includes(k)) || keys[0] || "sos");
      })
      .catch(e => setErr(String(e)));
  }, [currentId]);

  /* 액션 */
  const call = (num) => {
    if (!num) return;
    window.location.href = `tel:${String(num).replace(/\s+/g,"")}`;
  };
  const openMap = (name, addr) => {
    const q = encodeURIComponent([name, addr].filter(Boolean).join(" "));
    window.open(`https://maps.google.com/?q=${q}`, "_blank", "noopener,noreferrer");
  };
  const shareLocation = async () => {
    try {
      if (!navigator.geolocation) return alert("위치 권한을 허용해 주세요.");
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy:true, timeout:8000 })
      );
      const { latitude, longitude } = pos.coords;
      const url = `https://maps.google.com/?q=${latitude},${longitude}`;
      if (navigator.share) await navigator.share({ title:"SOS 위치", text:"나의 현재 위치", url });
      else { await navigator.clipboard.writeText(url); alert("링크 복사됨:\n"+url); }
    } catch { alert("위치를 가져오지 못했습니다."); }
  };

  /* 카드 구성 */
  const cards = useMemo(() => {
    const arr = [];
    if (data?.embassy_kr) {
      const e = data.embassy_kr;
      arr.push({
        kind: "대사관",
        name: e.name || "한국 대사관",
        address: e.address,
        phones: (e.phones || []).map(p => p.number),
      });
    }
    if (country || cityId) {
      const cityLabel = cityId ? cityId.split("-").pop() : country;
      arr.push({
        kind: "경찰서",
        name: `${cityLabel} 경찰서`,
        address: "",
        phones: (data?.emergency?.police?.number ? [data.emergency.police.number] : []),
      });
      arr.push({
        kind: "병원",
        name: `${cityLabel} 병원`,
        address: "",
        phones: (data?.emergency?.ambulance?.number ? [data.emergency.ambulance.number] : []),
      });
    }
    return arr;
  }, [data, country, cityId]);

  return (
    <div className="sospack help-wrap">
      <style jsx global>{helpStyles}</style>

      {/* 헤더 */}
      <header className="help-header">
        <div className="help-header-left">
          <div className="help-emoji">🆘</div>
          <div>
            <div className="help-title">긴급 도움</div>
            <div className="help-sub">Emergency Help</div>
          </div>
        </div>
        <button type="button" className="help-close" onClick={handleClose} aria-label="닫기">✕</button>
      </header>

      {/* 탭 */}
      <div className="help-tabs-rail">
        <div className="tab-grip" aria-hidden />
        <div className="help-tabs">
          <button className={`help-tab ${tab==="contact" ? "on" : ""}`} onClick={()=>setTab("contact")}>연락처</button>
          <button className={`help-tab ${tab==="phrases" ? "on" : ""}`} onClick={()=>setTab("phrases")}>현지 표현</button>
          <button className={`help-tab ${tab==="share" ? "on" : ""}`} onClick={()=>setTab("share")}>위치 공유</button>
        </div>
      </div>

      {/* 안내문 */}
      {tab==="contact" && (
        <>
          <div className="help-section-title">긴급 연락처</div>
          <p className="help-desc">응급 상황 시 연락할 수 있는 기관들입니다.</p>
        </>
      )}

      {/* 상태 */}
      {err && <div className="sos-empty">{err}</div>}
      {!data && !err && <div className="sos-loading">불러오는 중…</div>}

      {/* 연락처 탭 */}
      {data && tab==="contact" && (
        <>
          <div className="help-list">
            {cards.map((c, idx)=>(
              <section key={idx} className="help-card">
                <div className="help-card-head">
                  <div className="help-icon">
                    <span className="help-icon-emoji">{KIND_EMOJI[c.kind] || "❗"}</span>
                  </div>
                  <div className="help-card-titles">
                    <div className="help-card-title">{c.kind}</div>
                  </div>
                </div>

                <div className="help-card-name">{c.name}</div>
                {c.address && <div className="help-card-addr">{c.address}</div>}

                <div className="help-actions">
                  <button className="help-btn call" onClick={()=>call(c.phones?.[0])}>전화걸기</button>
                  <button className="help-btn outline" onClick={()=>openMap(c.name, c.address)}>위치보기</button>
                </div>
              </section>
            ))}
          </div>

          {/* 알아두세요 패널 */}
          <section className="help-info">
            <div className="help-info-title">알아두세요</div>
            {country === "JP" ? (
              <ul className="help-info-list">
                <li>일본 긴급전화: <b>경찰 110</b>, <b>소방/구급 119</b></li>
                <li>한국 영사콜센터: <a href="tel:+82232100404">+82-2-3210-0404</a></li>
                <li>관할 연락처: <a href="tel:+81334527787">+81-3-3452-7787 (24시간)</a></li>
              </ul>
            ) : (
              <ul className="help-info-list">
                <li>현지 긴급전화(경찰/소방/구급)는 위 연락처에서 확인하세요.</li>
                <li><b>현재 위치 링크</b>를 함께 공유하면 대응이 빨라집니다.</li>
                <li>여권 분실 시, 한국 대사관/영사관에 즉시 연락하세요.</li>
              </ul>
            )}
          </section>
        </>
      )}

      {/* 현지 표현 탭 */}
      {data && tab==="phrases" && (
        <>
          <div className="help-pills">
            {Object.keys(data?.phrases || {}).map(k=>(
              <button
                key={k}
                className={`help-pill ${k===phraseCat ? "on" : ""}`}
                onClick={()=>setPhraseCat(k)}
              >
                {k.toUpperCase()}
              </button>
            ))}
          </div>

          <section className="help-card">
            <div className="phrase-list">
              {(data?.phrases?.[phraseCat] || []).map((row, i)=>(
                <div className="phrase" key={i}>
                  {row.title && <div className="ko" style={{marginBottom:4}}>{row.title}</div>}
                  {row.ko && <div className="ko">{row.ko}</div>}
                  {row.local && <div className="local">{row.local}</div>}
                  {row.roma && <div className="roma">{row.roma}</div>}
                  {row.en && <div className="en">{row.en}</div>}
                </div>
              ))}
              {(!data?.phrases?.[phraseCat] || data.phrases[phraseCat].length===0) && (
                <div className="sos-empty">이 카테고리에 문구가 없습니다.</div>
              )}
            </div>
          </section>
        </>
      )}

      {/* 위치 공유 탭 */}
      {tab==="share" && (
        <section className="help-card">
          <div className="help-card-name" style={{marginBottom:8}}>내 위치 공유</div>
          <p className="help-desc" style={{marginTop:0}}>현재 좌표를 지도 링크로 공유합니다.</p>
          <button className="help-btn call" onClick={shareLocation}>현재 위치 보내기</button>
        </section>
      )}
    </div>
  );
}
