export function initResultsMode() {
  document.getElementById("resultsModeBtn")?.addEventListener("click", () => {
    location.href = "/performance";
  });
}
