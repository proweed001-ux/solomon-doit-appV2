import { primeDeveloperQr } from "./developer-qr.js";

const TEAM_FUNCTION_URL =
  "https://saodmeoilixfdqentofp.supabase.co/functions/v1/team-photo/";
const TEAM_PUBLIC_URL =
  "https://saodmeoilixfdqentofp.supabase.co/storage/v1/object/public/doit-files/team/";
const ITEMS = [
  ["teamThakoonPro", "teamThakoonNoPhoto", "thakoon", "team-thakoon.jpg"],
  ["teamAtthawitPro", "teamAtthawitNoPhoto", "atthawit", "team-atthawit.jpg"],
  ["teamChatchaiPro", "teamChatchaiNoPhoto", "chatchai", "team-chatchai.jpg"],
];
const imageState = new Map();
let loaded = false;

function sources(key, file) {
  const values = [];
  try {
    const local = localStorage.getItem("doit-team-photo-" + key + "-dataurl");
    if (local?.startsWith("data:image/")) values.push(local);
  } catch {}
  values.push(TEAM_FUNCTION_URL + key);
  values.push(TEAM_PUBLIC_URL + file);
  return values;
}

function loadPhoto(id, noPhotoId, key, file) {
  const image = document.getElementById(id);
  const noPhoto = document.getElementById(noPhotoId);
  if (!image) return Promise.resolve(false);
  const current = imageState.get(id);
  if (current?.loaded) return Promise.resolve(true);
  if (current?.promise) return current.promise;
  const entry = { loaded: false, promise: null };
  imageState.set(id, entry);
  if (noPhoto) noPhoto.style.display = "flex";
  image.style.display = "none";
  const candidates = sources(key, file);
  entry.promise = new Promise((resolve) => {
    let index = 0;
    const next = () => {
      if (index >= candidates.length) {
        image.style.display = "none";
        if (noPhoto) noPhoto.style.display = "flex";
        resolve(false);
        return;
      }
      image.onload = () => {
        entry.loaded = true;
        image.style.display = "block";
        if (noPhoto) noPhoto.style.display = "none";
        resolve(true);
      };
      image.onerror = () => {
        index += 1;
        next();
      };
      image.src = candidates[index];
    };
    next();
  });
  return entry.promise;
}

export function loadTeamPhotos() {
  loaded = true;
  return Promise.all(ITEMS.map((item) => loadPhoto(...item)));
}

export function openTeamModal() {
  document.getElementById("devTeamModal")?.classList.add("on");
  if (!loaded) loadTeamPhotos();
  primeDeveloperQr();
}

export function initTeam() {
  const modal = document.getElementById("devTeamModal");
  document.querySelector(".devTeamBtn")?.addEventListener("click", openTeamModal);
  document
    .querySelector("#devTeamModal .devClose")
    ?.addEventListener("click", () => modal?.classList.remove("on"));
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) modal.classList.remove("on");
  });
  loadTeamPhotos();
  primeDeveloperQr();
  setTimeout(openTeamModal, 350);
}
