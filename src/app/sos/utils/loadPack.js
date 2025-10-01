// src/utils/loadPack.js
export async function loadPack(id) {
  const fetchJson = async (url) => {
    try {
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) return null;         // 404면 null
      return await r.json();          // JSON 파싱 실패시 catch로 내려감
    } catch {
      return null;
    }
  };

  // 1) 요청한 id 그대로 시도 (도시 혹은 국가)
  let data = await fetchJson(`/data/packs/${id}.json`);
  if (data) return data;

  // 2) 도시형식(JP-TYO 등)이면 앞 2글자 국가코드로 폴백
  const cc = String(id).slice(0, 2).toUpperCase();
  if (cc && cc !== id) {
    data = await fetchJson(`/data/packs/${cc}.json`);
    if (data) return data;
  }

  throw new Error(`pack not found for ${id}`);
}
