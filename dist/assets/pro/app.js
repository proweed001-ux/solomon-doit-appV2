import "./bootstrap.js";
import "../vendor/xlsx-0.18.5.full.min.js";
import "../pro-print-store-bills.js";
import "./core.js";
import "../pro-print-mode-fixes.js";
import "../pro-print-column-widths.js";
import "../pro-print-a4-pro-fix.js";
import { initFuelSecret } from "./fuel-secret.js";
import { initResultsMode } from "./results-mode.js";
import { initTeam } from "./team.js";

initFuelSecret();
initResultsMode();
initTeam();

document.getElementById("fuelBillBtn")?.addEventListener("click", () => {
  location.href = "/fuel.html?t=1028";
});
