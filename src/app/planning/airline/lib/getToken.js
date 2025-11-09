// lib/getToken.js
export default async function getToken({ id, secret, url }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: id,
      client_secret: secret,
    }),
  });

  if (!res.ok) {
    throw new Error(`Token request failed: ${res.status}`);
  }

  return res.json(); // { access_token, expires_in, ... }
}
