export const ACTIVE_ENDPOINT =
  "https://saodmeoilixfdqentofp.supabase.co/functions/v1/doit-active";

export async function publicFetch(mode) {
  const response = await fetch(ACTIVE_ENDPOINT + "?mode=" + mode, {
    headers: { Accept: "application/json" },
  });
  const text = await response.text();
  if (!response.ok) throw new Error(text || String(response.status));
  return JSON.parse(text);
}

export async function resolveCloudPayload(response) {
  return response.mode === "json_url"
    ? await (await fetch(response.url)).json()
    : response.payload;
}
