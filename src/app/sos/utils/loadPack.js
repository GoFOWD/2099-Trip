// src/utils/loadPack.js
export async function loadPack(id) {
  const withTimeout = (p, ms = 8000) =>
    new Promise((res, rej) => {
      const t = setTimeout(() => rej(new Error(`timeout ${ms}ms`)), ms);
      p.then(v => { clearTimeout(t); res(v); })
       .catch(e => { clearTimeout(t); rej(e); });
    });

  const fetchJson = async (url) => {
    try {
      const r = await withTimeout(fetch(url, { cache: "no-store" }), 8000);
      if (!r.ok) { console.warn("[loadPack] not ok", url, r.status); return null; }
      return await r.json();
    } catch (e) {
      console.error("[loadPack] fetch fail", url, e);
      return null;
    }
  };

  const tryId = String(id || "").trim();
  if (!tryId) throw new Error("empty id");

  // 1) 도시/국가 id 그대로
  let data = await fetchJson(`/data/packs/${tryId}.json`);
  if (data) return data;

  // 2) 도시형식이면 앞 2글자(대문자) 국가 폴백
  const cc = tryId.slice(0, 2).toUpperCase();
  if (cc && cc !== tryId) {
    data = await fetchJson(`/data/packs/${cc}.json`);
    if (data) return data;
  }

  throw new Error(`pack not found for ${tryId}`);
}
