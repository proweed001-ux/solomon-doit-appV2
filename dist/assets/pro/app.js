import "./bootstrap.js";
import "./core.js";
import { initFuelSecret } from "./fuel-secret.js";
import { initResultsMode } from "./results-mode.js";
import { initTeam } from "./team.js";
import { initTelesaleButtonCount } from "./telesale.js";

initFuelSecret();
initResultsMode();
initTelesaleButtonCount();
initTeam();

document.getElementById("fuelBillBtn")?.addEventListener("click", () => {
  location.href = "/fuel.html?t=1028";
});
