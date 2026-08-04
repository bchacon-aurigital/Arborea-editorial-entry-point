export const BACKEND_URL = process.env.NEXT_PUBLIC_ORDERS_BACKEND_URL || "";
export const SHARED_SECRET = process.env.NEXT_PUBLIC_ORDERS_SHARED_SECRET || "";

export async function submitOrder(payload) {
  if (!BACKEND_URL) {
    return { ok: false, error: "missing-backend-url" };
  }

  let response;
  try {
    response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ ...payload, secret: SHARED_SECRET }),
    });
  } catch (err) {
    return { ok: false, error: String(err) };
  }

  try {
    return await response.json();
  } catch {
    return { ok: false, error: `bad-response-${response.status}` };
  }
}
