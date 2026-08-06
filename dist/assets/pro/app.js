import "./bootstrap.js";
import "./core.js";
import { initFuelSecret } from "./fuel-secret.js";
import { initResultsMode } from "./results-mode.js";
import { initTeam } from "./team.js";

initFuelSecret();
initResultsMode();
initTeam();

document.addEventListener(
  "click",
  (event) => {
    const printButton =
      event.target instanceof Element
        ? event.target.closest("#prepPrint")
        : null;
    if (!printButton || !document.querySelector(".printOverlay")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  },
  true,
);

document.getElementById("fuelBillBtn")?.addEventListener("click", () => {
  location.href = "/fuel.html?t=1028";
});
