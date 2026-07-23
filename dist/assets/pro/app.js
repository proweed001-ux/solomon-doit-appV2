import "./bootstrap.js";
import "../vendor/xlsx-0.18.5.full.min.js";
import "../pro-team-single.js";
import "../pro-results-mode.js";
import "../pro-print-store-bills.js";
import "../pro-native-core.js";
import "../pro-native-core-overrides.js";
import "../pro-print-mode-fixes.js";
import "../pro-print-column-widths.js";
import "../pro-print-a4-pro-fix.js";
import { initFuelSecret } from "./fuel-secret.js";

initFuelSecret();

document.getElementById("fuelBillBtn")?.addEventListener("click", () => {
  location.href = "/fuel.html?t=1028";
});
document.getElementById("resultsModeBtn")?.addEventListener("click", () => {
  location.href = "/performance";
});
document.querySelector(".devTeamBtn")?.addEventListener("click", () => {
  globalThis.openDevTeamModal?.();
});

const teamModal = document.getElementById("devTeamModal");
document
  .querySelector("#devTeamModal .devClose")
  ?.addEventListener("click", () => {
    teamModal?.classList.remove("on");
  });
teamModal?.addEventListener("click", (event) => {
  if (event.target === teamModal) teamModal.classList.remove("on");
});
