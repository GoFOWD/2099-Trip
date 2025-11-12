/**
 * 범용 API 호출 함수
 * @param {Object} options - 설정 객체
 * @param {string} options.token - Amadeus에서 발급받은 access_token
 * @param {string} options.apiUrl - 요청을 보낼 API 주소
 * @param {string} [options.method="GET"] - HTTP 메서드 ("GET", "POST" 등)
 * @param {Object} [options.params] - 쿼리 파라미터 (GET 시)
 * @param {Object} [options.body] - 요청 본문 (POST 시)
 * @param {Object} [options.headers] - 추가 헤더 (선택)
 * @returns {Promise<any>} API 응답(JSON)
 */
export async function getApi({
  token,
  apiUrl,
  method = "GET",
  params,
  body,
  headers,
}) {
  try {
    const url =
      method === "GET" && params
        ? `${apiUrl}?${new URLSearchParams(params).toString()}`
        : apiUrl;

    const options = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(headers || {}),
      },
      ...(method !== "GET" && body ? { body: JSON.stringify(body) } : {}),
    };

    const res = await fetch(url, options);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Amadeus API 오류: ${res.status} - ${errText}`);
    }

    return await res.json();
  } catch (err) {
    console.error("getApi() Error:", err);
    throw err;
  }
}
