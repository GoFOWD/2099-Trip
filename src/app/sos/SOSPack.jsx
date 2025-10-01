"use client";

import { useEffect, useMemo, useState } from "react";
import { loadPack } from "./utils/loadPack";

/* ========================
   상수 / 유틸 (컴포넌트 밖)
======================== */
const DEBUG = true;
const BASE = "/data/packs";
const CONTINENT_ORDER = ["Asia", "Europe", "America", "Oceania", "Africa"];

const CONTINENT_LABEL = {
  Asia: "아시아",
  Europe: "유럽",
  America: "아메리카",
  Oceania: "오세아니아",
  Africa: "아프리카",
};

const PHRASE_LABEL = {
  sos: "SOS",
  hotel: "호텔",
  taxi: "택시",
  travel: "여행",
  allergy: "알레르기",
  police: "경찰",
  hospital: "병원",
  pharmacy: "약국",
  embassy: "대사관",
};

const LANG_OPTIONS = [
  { code: "en", label: "영어" },
  { code: "ja", label: "일본어" },
  { code: "zh-CN", label: "중국어 간체" },
  { code: "zh-TW", label: "중국어 번체" },
  { code: "fr", label: "프랑스어" },
  { code: "de", label: "독일어" },
  { code: "es", label: "스페인어" },
  { code: "it", label: "이탈리아어" },
  { code: "vi", label: "베트남어" },
  { code: "th", label: "태국어" },
  { code: "id", label: "인도네시아어" },
];

const _norm = (s) => (s ?? "").toString().replace(/\uFEFF/g, "").trim().toLowerCase();
const _toKey = (raw) => {
  const v = _norm(raw);
  if (v === "asia" || v === "아시아") return "Asia";
  if (v === "europe" || v === "유럽") return "Europe";
  if (v === "africa" || v === "아프리카") return "Africa";
  if (
    v === "america" || v === "아메리카" ||
    v === "north america" || v === "북아메리카" || v === "북미" ||
    v === "south america" || v === "남아메리카" || v === "남미" ||
    v === "latin america" || v === "라틴아메리카" || v === "중남미"
  ) return "America";
  if (
    v === "oceania" || v === "오세아니아" ||
    v.includes("australasia") ||
    v.includes("australia and oceania") || v.includes("australia & oceania") ||
    v.includes("australia/new zealand") ||
    v.includes("australia and new zealand") || v.includes("australia & new zealand") ||
    v.includes("pacific") || v.includes("태평양") ||
    v.includes("oceania") || v.includes("호주") || v.includes("뉴질랜드")
  ) return "Oceania";
  return null;
};
function _forceOceaniaByNameOrCode(c) {
  const code = String(c?.code || c?.country_code || "").toUpperCase().trim();
  const name = `${_norm(c?.name)} ${_norm(c?.ko)}`;
  if (code === "AU" || name.includes("australia") || name.includes("호주")) return "Oceania";
  if (code === "NZ" || name.includes("new zealand") || name.includes("뉴질랜드")) return "Oceania";
  return null;
}
function getContinentKey(c) {
  const code = String(c?.code || c?.country_code || "").toUpperCase().trim();
  if (code === "AU" || code === "NZ") return "Oceania";
  return (
    _toKey(c?.region) ||
    _toKey(c?.continent) ||
    _toKey(c?.regionName) ||
    _forceOceaniaByNameOrCode(c) ||
    null
  );
}
function prettyCity(id) {
  const end = (id || "").split("-").pop();
  const map = {
    NYC:"New York City", LA:"Los Angeles", SF:"San Francisco", MIA:"Miami", LV:"Las Vegas",
    SYD:"Sydney", MEL:"Melbourne", BNE:"Brisbane", PER:"Perth",
    AKL:"Auckland", WLG:"Wellington", CHC:"Christchurch",
    TYO:"Tokyo", OSA:"Osaka", FUK:"Fukuoka", CTS:"Sapporo",
    SEL:"Seoul", PUS:"Busan", JEJ:"Jeju",
    BKK:"Bangkok", CNX:"Chiang Mai", HKT:"Phuket", PAT:"Pattaya",
    HAN:"Hanoi", SGN:"Ho Chi Minh City", DAD:"Da Nang",
    SIN:"Singapore",
    KUL:"Kuala Lumpur", PEN:"Penang", BKI:"Kota Kinabalu",
    MNL:"Manila", CEB:"Cebu", BOR:"Boracay",
    JKT:"Jakarta", DPS:"Bali (Denpasar)", SUB:"Surabaya", YOG:"Yogyakarta",
    TPE:"Taipei", TXG:"Taichung", TNN:"Tainan", KHH:"Kaohsiung", HUN:"Hualien",
    HKG:"Hong Kong",
    LON:"London", EDI:"Edinburgh", MAN:"Manchester",
    PAR:"Paris", NCE:"Nice", LYS:"Lyon",
    BER:"Berlin", MUC:"Munich", FRA:"Frankfurt", HAM:"Hamburg", CGN:"Cologne",
    BCN:"Barcelona", MAD:"Madrid", SVQ:"Seville", VLC:"Valencia", BIO:"Bilbao",
    ROM:"Rome", MIL:"Milan", VCE:"Venice", FLR:"Florence", NAP:"Naples",
    AMS:"Amsterdam", RTM:"Rotterdam",
    IST:"Istanbul", ANK:"Ankara", IZM:"Izmir",
    BJS:"Beijing", SHA:"Shanghai", CAN:"Guangzhou", SZX:"Shenzhen",
    CTU:"Chengdu", XIY:"Xi'an", HGH:"Hangzhou", NKG:"Nanjing", WUH:"Wuhan", CKG:"Chongqing",
    UBN:"Ulaanbaatar", ERD:"Erdenet", DRK:"Darkhan", COQ:"Choibalsan", HVD:"Khovd", ULG:"Ölgii",
    DHA:"Dhaka", CTG:"Chattogram", SYL:"Sylhet", KHU:"Khulna", RJH:"Rajshahi",
    DEL:"Delhi", BOM:"Mumbai", BLR:"Bengaluru", MAA:"Chennai", CCU:"Kolkata", HYD:"Hyderabad", PNQ:"Pune", AMD:"Ahmedabad", JAI:"Jaipur", COK:"Kochi", GOI:"Goa",
    PNH:"Phnom Penh", REP:"Siem Reap", KOS:"Sihanoukville", BBM:"Battambang",
    MOW:"Moscow", LED:"Saint Petersburg", KZN:"Kazan", OVB:"Novosibirsk", AER:"Sochi",
    TOR:"Toronto", VAN:"Vancouver", MTL:"Montreal", CAL:"Calgary", OTT:"Ottawa",
    BUE:"Buenos Aires", COR:"Córdoba", ROS:"Rosario", MDZ:"Mendoza", BRC:"Bariloche",
    SAO:"São Paulo", RIO:"Rio de Janeiro", BSB:"Brasília", SSA:"Salvador", FOR:"Fortaleza",
    MEX:"Mexico City", CUN:"Cancún", GDL:"Guadalajara", MTY:"Monterrey", OAX:"Oaxaca",
    CAS:"Casablanca", RBA:"Rabat", RAK:"Marrakech",
    CAI:"Cairo", ALY:"Alexandria", SSH:"Sharm El Sheikh",
  };
  return map[end] || (id || "").replaceAll("-", " ");
}
const labelMap = {
  police:"경찰", ambulance:"구급", fire:"소방",
  all_services:"통합(112)", all_services_mobile:"통합(모바일)",
  poison_control:"독극물", mental_health_crisis:"정신건강",
  tourist_police:"관광경찰", coast_guard:"해안경비",
  gendarmerie:"헌병", gas:"가스"
};

/* ========================
      컴포넌트 본문
======================== */
export default function SOSPack({ onClose }) {
  // 상태
  const [countries, setCountries] = useState([]);
  const [fallbackMap, setFallbackMap] = useState({});
  const [err, setErr] = useState("");

  const [step, setStep] = useState("continent"); // continent | country | city | view
  const [continent, setContinent] = useState("");
  const [country, setCountry] = useState("");
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState("");
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("sos");
  const [data, setData] = useState(null);

  // 번역기 상태
  const [tText, setTText] = useState("");
  const [tTo, setTTo] = useState("en");

  const currentId = useMemo(() => cityId || country, [country, cityId]);

  // 번역기 열기
  function openTranslate(service) {
    const q = encodeURIComponent(tText.trim());
    if (!q) return alert("번역할 문장을 입력해 주세요.");
    const to = tTo;
    let url = "";
    switch (service) {
      case "google":
        url = `https://translate.google.com/?sl=auto&tl=${to}&text=${q}&op=translate`; break;
      case "papago":
        url = `https://papago.naver.com/?sk=auto&tk=${to}&st=${q}`; break;
      case "deepl":
        url = `https://www.deepl.com/translator#auto/${to}/${q}`; break;
      default: return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // fallback 도시맵
  useEffect(() => {
    const url = `${BASE}/cities/fallback.json`;
    fetch(url, { cache: "no-store" })
      .then(r => (r.ok ? r.json() : {}))
      .then((m) => { setFallbackMap(m || {}); if (DEBUG) console.log("[SOS] fallback cities loaded:", m); })
      .catch(() => setFallbackMap({}));
  }, []);

  // 국가 인덱스
  useEffect(() => {
    const url = `${BASE}/index.json`;
    fetch(url, { cache: "no-store" })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status} at ${url}`); return r.json(); })
      .then(j => {
        const raw = Array.isArray(j?.countries) ? j.countries : [];
        const norm = raw.map(c => {
          const code = String(c?.code ?? c?.country_code ?? "").replace(/\uFEFF/g, "").trim().toUpperCase();
          const name = String(c?.name ?? "").replace(/\uFEFF/g, "").trim();
          const ko   = String(c?.ko   ?? "").replace(/\uFEFF/g, "").trim();
          const region = String(c?.region ?? c?.continent ?? c?.regionName ?? "").replace(/\uFEFF/g, "").trim();
          return { ...c, code, name, ko, region };
        });
        if (!norm.some(x => x.code === "AU")) norm.push({ code:"AU", name:"Australia", ko:"호주", region:"Oceania" });
        if (!norm.some(x => x.code === "NZ")) norm.push({ code:"NZ", name:"New Zealand", ko:"뉴질랜드", region:"Oceania" });
        const fixed = norm.map(c => {
          const v = (c.name + " " + c.ko + " " + c.region).toLowerCase();
          if (c.code === "AU" || v.includes("australia") || v.includes("호주")) return { ...c, region: "Oceania" };
          if (c.code === "NZ" || v.includes("new zealand") || v.includes("뉴질랜드")) return { ...c, region: "Oceania" };
          return c;
        });
        setCountries(fixed);
      })
      .catch(e => setErr(String(e)));
  }, []);

  // 도시 인덱스
  useEffect(() => {
    setCityId("");
    if (!country) { setCities([]); return; }
    const code = (country || "").toUpperCase();
    const url = `${BASE}/cities/${code}/index.json`;
    fetch(url, { cache: "no-store" })
      .then(r => r.ok ? r.json() : { cities: [] })
      .then(j => {
        const fileList = Array.isArray(j?.cities) ? j.cities : [];
        const fbList = Array.isArray(fallbackMap[code]) ? fallbackMap[code] : [];
        const merged = fileList.length ? fileList : fbList;
        setCities(merged);
      })
      .catch(() => {
        const fbList = Array.isArray(fallbackMap[code]) ? fallbackMap[code] : [];
        setCities(fbList);
      });
  }, [country, fallbackMap]);

  // 상세 로드
  useEffect(() => {
    if (step !== "view" || !currentId) return;
    setErr(""); setData(null);
    loadPack(currentId)
      .then(setData)
      .catch(e => setErr(`load ${currentId}: ${String(e)}`));
  }, [step, currentId]);

  // 탭 기본값
  useEffect(() => {
    const keys = Object.keys(data?.phrases || {});
    if (keys.length) setTab((prev) => keys.includes(prev) ? prev : keys[0]);
  }, [data]);

  // 대륙 필터 & 검색
  const continentCountries = useMemo(() => {
    const arr = countries.filter(c => getContinentKey(c) === continent)
      .sort((a,b)=>(a.ko||a.name).localeCompare(b.ko||b.name,"ko"));
    if (continent === "Oceania" && arr.length === 0) {
      const fb = countries.filter(c => ["AU","NZ"].includes(String(c?.code||"").toUpperCase()))
        .sort((a,b)=>(a.ko||a.name).localeCompare(b.ko||b.name,"ko"));
      return fb;
    }
    return arr;
  }, [countries, continent]);

  const filteredCountries = useMemo(() => {
    const s = _norm(q);
    const base = s ? countries : continentCountries;
    if (!s) return base;
    const out = base.filter(c =>
      (c.name || "").toLowerCase().includes(s) ||
      (c.ko   || "").toLowerCase().includes(s) ||
      (String(c.code || c.country_code || "")).toLowerCase().includes(s)
    ).sort((a,b)=>(a.ko||a.name).localeCompare(b.ko||b.name,"ko"));
    return out;
  }, [countries, continentCountries, q]);

  function handleClose() {
    setStep("continent");
    setContinent("");
    setCountry("");
    setCities([]);
    setCityId("");
    setQ("");
    setData(null);
    setErr("");
    window.scrollTo(0, 0);
    // if (onClose) onClose();
  }

  /* ============= 렌더 ============= */
  return (
    <div className="sos-wrap">
      <style>{sosStyles}</style>

      <header className="sos-top">
        <h1 className="sos-title">SOS Pack</h1>
        <button className="sos-btn" onClick={handleClose}>처음으로</button>
      </header>

      {err && <div className="sos-error">{err}</div>}

      {/* STEP 1: 대륙 */}
      {step === "continent" && (
        <section className="sos-stage">
          <div className="continent-grid">
            {CONTINENT_ORDER.map(r => (
              <button
                key={r}
                className={`tile mint ${continent === r ? "on": ""}`}
                onClick={() => { setContinent(r); setStep("country"); }}
              >
                <div className="tile-main">{CONTINENT_LABEL[r] || r}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* STEP 2: 나라 */}
      {step === "country" && (
        <section className="sos-stage">
          <div className="sos-bar">
            <div className="sos-bar-left">
              <button className="sos-btn" onClick={() => setStep("continent")}>← 이전</button>
              <div className="sos-crumb">{CONTINENT_LABEL[continent] || continent}</div>
            </div>
            <button className="sos-btn" onClick={handleClose}>닫기 ✕</button>
          </div>

          <div style={{margin:"8px 0 4px"}}>
            <input
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              placeholder="국가명/영문/코드 (예: 일본 / Japan / JP / AU / NZ)"
              className="sos-input"
            />
          </div>

          <div className="country-grid">
            {filteredCountries.map(c => (
              <button
                key={(c.code || c.name)}
                className={`tile ${country === (c.code||"") ? "on": ""}`}
                onClick={() => { setCountry(c.code); setStep("city"); }}
                title={`${c.name} (${c.code || ""})`}
              >
                <div className="tile-top">{c.code || "??"} · {c.region || c.continent || c.regionName}</div>
                <div className="tile-main">{c.ko || c.name}</div>
                {c.ko && <div className="tile-sub">{c.name}</div>}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* STEP 3: 도시 */}
      {step === "city" && (
        <section className="sos-stage">
          <div className="sos-bar">
            <div className="sos-bar-left">
              <button className="sos-btn" onClick={() => setStep("country")}>← 이전</button>
              <div className="sos-crumb">{(CONTINENT_LABEL[continent] || continent)} / {country}</div>
            </div>
            <button className="sos-btn" onClick={handleClose}>닫기 ✕</button>
          </div>

          {cities.length > 0 ? (
            <div className="city-grid">
              <button className={`chip ${!cityId ? "on" : ""}`} onClick={() => { setCityId(""); setStep("view"); }}>
                국가 정보 보기
              </button>
              {cities.map(id => (
                <button
                  key={id}
                  className={`chip ${cityId === id ? "on" : ""}`}
                  onClick={() => { setCityId(id); setStep("view"); }}
                >
                  {prettyCity(id)}
                </button>
              ))}
            </div>
          ) : (
            <div className="sos-empty">
              도시 목록이 없습니다. 국가 기본으로 진행합니다.
              <div style={{ marginTop: 8 }}>
                <button className="sos-btn mint" onClick={() => setStep("view")}>국가 정보 보기</button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* STEP 4: 보기 */}
      {step === "view" && (
        <section className="sos-stage">
          <div className="sos-bar">
            <div className="sos-bar-left">
              <button className="sos-btn" onClick={() => setStep(cities.length ? "city" : "country")}>← 이전</button>
              <div className="sos-crumb">
                {(CONTINENT_LABEL[continent] || continent)} / {country}{cityId ? ` / ${prettyCity(cityId)}` : ""}
              </div>
            </div>
            <button className="sos-btn" onClick={handleClose}>닫기 ✕</button>
          </div>

          {!data && !err && <div className="sos-loading">불러오는 중…</div>}

          {data && (
            <div className="sos-grid">
              <section className="sos-card">
                <h3>긴급번호</h3>
                <table className="sos-table">
                  <tbody>
                    {Object.entries(data.emergency || {}).map(([k, v]) => (
                      <tr key={k}><td>{labelMap[k] || k}</td><td className="num">{v?.number}</td></tr>
                    ))}
                  </tbody>
                </table>
                <div className="verify">Last verified: {data.last_verified}</div>
              </section>

              <section className="sos-card">
                <h3>대사관(대한민국)</h3>
                {data.embassy_kr ? (
                  <div className="emb">
                    <div className="emb-name">{data.embassy_kr.name}</div>
                    <div className="emb-row">📍 {data.embassy_kr.address}</div>
                    {data.embassy_kr.phones?.map((p, i) => (
                      <div className="emb-row" key={i}>☎️ {p.label}: <a href={`tel:${p.number}`}>{p.number}</a></div>
                    ))}
                    {data.embassy_kr.email && <div className="emb-row">✉️ {data.embassy_kr.email}</div>}
                    {data.embassy_kr.fax && <div className="emb-row">📠 {data.embassy_kr.fax}</div>}
                  </div>
                ) : (
                  <div className="sos-empty">대사관 정보가 없습니다.</div>
                )}
              </section>

              {/* 문구 탭 */}
              <section className="sos-card wide">
                <div className="sos-tabs">
                  {Object.keys(data?.phrases || {}).map(k => (
                    <button
                      key={k}
                      className={`chip ${tab === k ? "on" : ""}`}
                      onClick={() => setTab(k)}
                      title={k}
                    >
                      {PHRASE_LABEL[k] || k}
                    </button>
                  ))}
                </div>

                <div className="phrase-list">
                  {(data?.phrases?.[tab] || []).map((row, i) => (
                    <div className="phrase" key={i}>
                      {row.title && <div className="ko" style={{marginBottom:4}}>{row.title}</div>}
                      {row.ko     && <div className="ko">{row.ko}</div>}
                      {row.local  && <div className="local">{row.local}</div>}
                      {row.roma   && <div className="roma">{row.roma}</div>}
                      {row.en     && <div className="en">{row.en}</div>}
                    </div>
                  ))}
                  {(!data?.phrases?.[tab] || data.phrases[tab].length === 0) && (
                    <div className="sos-empty">이 탭에 표시할 문구가 없습니다.</div>
                  )}
                </div>
              </section>

              {/* 번역기 바로가기 */}
              <section className="sos-card">
                <h3>번역기 바로가기</h3>
                <div style={{display:"grid", gap:8}}>
                  <textarea
                    value={tText}
                    onChange={(e)=>setTText(e.target.value)}
                    placeholder="번역할 문장을 여기에 입력하거나 붙여넣으세요."
                    style={{
                      width:"100%", minHeight:90, border:"1px solid #8BE3D4",
                      borderRadius:10, padding:"10px 12px", background:"#fff", color:"#063B3B"
                    }}
                  />
                  <div style={{display:"flex", gap:8, alignItems:"center", flexWrap:"wrap"}}>
                    <label style={{fontSize:13, color:"#0B5E5E"}}>목표 언어</label>
                    <select
                      value={tTo}
                      onChange={(e)=>setTTo(e.target.value)}
                      className="sos-input"
                      style={{maxWidth:200}}
                    >
                      {LANG_OPTIONS.map(o => <option key={o.code} value={o.code}>{o.label}</option>)}
                    </select>
                    <div style={{flex:1}} />
                    <button className="sos-btn" onClick={()=>openTranslate("google")}>Google 번역</button>
                    <button className="sos-btn" onClick={()=>openTranslate("papago")}>Papago</button>
                    <button className="sos-btn" onClick={()=>openTranslate("deepl")}>DeepL</button>
                  </div>
                  <div style={{fontSize:12, color:"#0B5E5E"}}>
                    팁: 위 문구 카드를 누르면 자동 입력하도록도 확장 가능해요.
                  </div>
                </div>
              </section>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

/* ========================
            CSS
======================== */
export const sosStyles = `
:root { --mint:#50B4BE; --mint-hover:#3ba6b1; --bg:#E9FFFA; --ink:#063B3B; }

.sos-wrap { min-height:100dvh; background:var(--bg); color:var(--ink); }
.sos-top { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:16px 20px; position:sticky; top:0; background:var(--bg); z-index:10; border-bottom:1px solid #8BE3D4; }
.sos-title { font-size:18px; font-weight:800; margin:0; letter-spacing:-.2px; }

.sos-btn { background:#fff; color:var(--ink); border:1px solid #8BE3D4; border-radius:10px; padding:8px 12px; cursor:pointer; transition: background .15s, border-color .15s, transform .05s, box-shadow .15s; }
.sos-btn:hover { background:#D9FBF3; border-color:#6EDAC8; transform:translateY(-1px); }
.sos-btn:active { transform:translateY(0); }
.sos-btn.mint { background:var(--mint); color:#08252a; border-color:transparent; font-weight:800; }

.sos-stage { padding:16px 20px; display:grid; gap:14px; }
.sos-bar { display:flex; align-items:center; justify-content:space-between; gap:8px; }
.sos-bar-left{ display:flex; align-items:center; gap:8px; }
.sos-crumb { color:#0B5E5E; font-size:13px; }
.sos-loading, .sos-empty { background:#fff; border:1px solid #8BE3D4; border-radius:12px; padding:16px; }

.sos-input { width:100%; max-width:460px; padding:10px 12px; border-radius:10px; border:1px solid #8BE3D4; background:#fff; color:#063B3B; }

.continent-grid { display:grid; gap:12px; grid-template-columns: repeat(2, 1fr); }
@media (max-width:520px){ .continent-grid{ grid-template-columns: repeat(2, 1fr);} }
.country-grid { display:grid; gap:12px; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); }
.city-grid { display:flex; flex-wrap:wrap; gap:8px; }

.tile { text-align:left; background:#fff; border:1px solid #8BE3D4; border-radius:12px; padding:12px; cursor:pointer; transition: border-color .15s, transform .05s, box-shadow .15s, background .15s; color:#063B3B; }
.tile:hover { border-color:#6EDAC8; background:#D9FBF3; transform: translateY(-1px); box-shadow:0 4px 14px rgba(0,0,0,.06); }
.tile.on { border-color:#6EDAC8; background:#D9FBF3; }
.tile-top { color:#0B5E5E; font-size:12px; margin-bottom:2px; }
.tile-main { font-weight:800; letter-spacing:-.2px; }
.tile-sub { color:#0B5E5E; font-size:12px; margin-top:2px; }

.chip{ background:#fff; color:#063B3B; border:1px solid #8BE3D4; padding:6px 10px; border-radius:999px; transition: background .15s, border-color .15s; }
.chip.on,.chip:hover{ background:#D9FBF3; border-color:#6EDAC8; }

.sos-grid { display:grid; gap:12px; grid-template-columns: repeat(12, 1fr); }
.sos-card { grid-column: span 6; background:#fff; border:1px solid #8BE3D4; border-radius:16px; padding:16px; }
.sos-card.wide { grid-column: span 12; }
.sos-card h3 { margin:0 0 8px; font-size:18px; }
.sos-table { width:100%; border-collapse:collapse; }
.sos-table td { padding:8px 6px; border-bottom:1px solid #8BE3D4; }
.sos-table td.num { text-align:right; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.verify { color:#0B5E5E; font-size:12px; margin-top:8px; }
.emb .emb-name { font-weight:700; margin-bottom:6px; }
.emb .emb-row { margin:3px 0; }

.sos-tabs{ display:flex; gap:8px; flex-wrap:wrap; margin-bottom:8px; }

@media (max-width:900px){ .sos-card{ grid-column: span 12; } }

.phrase-list{ display: grid; gap: 12px; counter-reset: ph; }
.phrase{ position: relative; background: #fff; border: 1px solid #8BE3D4; border-radius: 12px; padding: 12px 12px 12px 40px; }
.phrase::before{
  counter-increment: ph; content: counter(ph); position: absolute; left: 12px; top: 12px;
  width: 20px; height: 20px; display: grid; place-items: center; font-size: 12px; font-weight: 800;
  color: #063B3B; background: #E9FFFA; border: 1px solid #8BE3D4; border-radius: 999px;
}
.phrase .ko{ font-weight: 800; margin-bottom: 2px; }
.phrase .local{ color:#063B3B; }
.phrase .roma{ color:#0B5E5E; font-size: 13px; }
.phrase .en{ color:#0B5E5E; font-size: 13px; }
.phrase .ko + .local, .phrase .local + .roma, .phrase .roma + .en{ margin-top: 2px; }
`;
