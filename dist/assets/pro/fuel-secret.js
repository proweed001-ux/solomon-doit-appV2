const UPLOAD_TAP_WINDOW_MS = 2500;
const REQUIRED_TAPS = 5;

export function initFuelSecret() {
  let unlocked = false;
  let count = 0;
  let last = 0;

  const button = () => document.getElementById("fuelBillBtn");
  const textOf = (element) =>
    String(
      element?.innerText || element?.textContent || element?.value || "",
    ).trim();

  function hide() {
    unlocked = false;
    count = 0;
    last = 0;
    document.body.classList.remove("fuelSecretOn");
    if (button()) button().style.display = "none";
  }

  function show() {
    unlocked = true;
    document.body.classList.add("fuelSecretOn");
    if (button()) button().style.display = "";
  }

  function isUploadTap(element) {
    if (!element?.closest) return false;
    const card = element.closest(".uploadCard");
    if (!card) return false;
    const uploadTitle = [
      ...card.querySelectorAll("h1,h2,h3,h4,button,span,label,div"),
    ].find(
      (node) =>
        textOf(node).includes("☁") &&
        textOf(node).includes("อัปโหลด") &&
        textOf(node).includes("DOIT"),
    );
    if (
      uploadTitle &&
      (element === uploadTitle || uploadTitle.contains(element))
    )
      return true;
    return Boolean(element.closest("#choose,#file,#fileLabel,.uploadRow"));
  }

  document.addEventListener(
    "click",
    (event) => {
      if (!isUploadTap(event.target)) {
        if (!unlocked) queueMicrotask(hide);
        return;
      }
      if (unlocked) return;
      const now = Date.now();
      count = now - last < UPLOAD_TAP_WINDOW_MS ? count + 1 : 1;
      last = now;
      if (count >= REQUIRED_TAPS) show();
    },
    true,
  );
  document.addEventListener("click", (event) => {
    if (!unlocked && !isUploadTap(event.target)) queueMicrotask(hide);
  });
  hide();
}
