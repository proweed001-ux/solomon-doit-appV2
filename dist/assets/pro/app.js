import "./bootstrap.js";
import "../vendor/xlsx-0.18.5.full.min.js";
import "./core.js";
import { initFuelSecret } from "./fuel-secret.js";
import { initResultsMode } from "./results-mode.js";
import { initTeam } from "./team.js";

initFuelSecret();
initResultsMode();
initTeam();

document.getElementById("fuelBillBtn")?.addEventListener("click", () => {
  location.href = "/fuel.html?t=1028";
});
