import { E } from "./utils.js";

const CONFIG_URL =
  "https://saodmeoilixfdqentofp.supabase.co/functions/v1/dev-qr?action=config";
const IMAGE_URL =
  "https://saodmeoilixfdqentofp.supabase.co/functions/v1/dev-qr?action=image";
const CACHE_KEY = "doit-dev-qr-config-v1";
const STABLE_IMAGE_URL = IMAGE_URL + "&t=stable";
let qrPromise = null;
let qrCache = null;

function normalize(config) {
  if (!config) return null;
  const normalized = { ...config };
  if (normalized.enabled !== false) normalized.enabled = true;
  if (
    !normalized.image_url ||
    String(normalized.image_url).includes(
      "/storage/v1/object/public/doit-files/team/dev-qr.png",
    )
  ) {
    normalized.image_url =
      IMAGE_URL +
      "&t=" +
      encodeURIComponent(normalized.updated_at || "stable");
  }
  return normalized;
}

function block() {
  let element = document.getElementById("devQrBlock");
  const body = document.querySelector(".devBody");
  if (!element && body) {
    element = document.createElement("div");
    element.id = "devQrBlock";
    element.className = "devQrPoster";
    body.appendChild(element);
  }
  return element;
}

function render(config) {
  const element = block();
  if (!element) return;
  const top = E(config?.top_text || config?.header || "CNR SDO HFSAYA");
  const brand = E(config?.brand_text || "AYA DOIT");
  const scan = E(config?.bottom_text || "Scan QR Code");
  if (!config?.image_url || config.enabled === false) {
    element.innerHTML =
      '<div class="devQrPosterTop">' +
      top +
      '</div><div class="devQrPosterLine"></div><div class="devQrPosterFrame"><div class="devQrPosterEmpty">รอ QR Code</div></div><div class="devQrPosterBrand">' +
      brand +
      '</div><div class="devQrPosterScan">' +
      scan +
      "</div>";
    return;
  }
  element.innerHTML =
    '<div class="devQrPosterTop">' +
    top +
    '</div><div class="devQrPosterLine"></div><div class="devQrPosterFrame"><img src="' +
    E(config.image_url) +
    '" alt="QR Code"></div><div class="devQrPosterBrand">' +
    brand +
    '</div><div class="devQrPosterScan">' +
    scan +
    "</div>";
}

function cachedConfig() {
  try {
    return normalize(JSON.parse(localStorage.getItem(CACHE_KEY) || "null"));
  } catch {
    return null;
  }
}

async function loadConfig() {
  try {
    const response = await fetch(CONFIG_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(String(response.status));
    const config = normalize(await response.json());
    localStorage.setItem(CACHE_KEY, JSON.stringify(config));
    return config;
  } catch {
    return cachedConfig();
  }
}

export async function primeDeveloperQr() {
  if (qrCache) {
    render(qrCache);
    return qrCache;
  }
  if (qrPromise) return qrPromise;
  const cached = cachedConfig();
  render(cached || normalize({ image_url: STABLE_IMAGE_URL }));
  qrPromise = loadConfig()
    .then((config) => {
      qrCache = config || normalize({ image_url: STABLE_IMAGE_URL });
      render(qrCache);
      return qrCache;
    })
    .catch(() => {
      qrPromise = null;
      qrCache = normalize({ image_url: STABLE_IMAGE_URL });
      render(qrCache);
      return qrCache;
    });
  return qrPromise;
}
