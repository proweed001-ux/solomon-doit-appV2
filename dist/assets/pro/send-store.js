const SEND_SELECTOR = '#table input.jdata[data-map="send"]';
const QUANTITY_SELECTOR = "#table input.jdata[data-map]";
let editSession = null;
let pointerTarget = null;
let pointerTrackingBound = false;

function sendInputs() {
  return [...document.querySelectorAll(SEND_SELECTOR)].filter(
    (input) => !input.disabled,
  );
}

function quantityInputs() {
  return [...document.querySelectorAll(QUANTITY_SELECTOR)].filter(
    (input) => !input.disabled,
  );
}

function refreshSendInputs() {
  sendInputs().forEach((input, index) => {
    input.enterKeyHint = "next";
    input.tabIndex = 1000 + index;
  });
}

function inputTarget(input) {
  return {
    map: input.dataset.map || "",
    key: input.dataset.k || "",
  };
}

function sameTarget(input, target) {
  return (
    input.dataset.map === target?.map && input.dataset.k === target?.key
  );
}

function nextTargetFor(input, backwards = false) {
  const inputs = input.matches(SEND_SELECTOR) ? sendInputs() : quantityInputs();
  const index = Math.max(0, inputs.indexOf(input));
  const nextIndex = Math.min(
    inputs.length - 1,
    Math.max(0, index + (backwards ? -1 : 1)),
  );
  return inputTarget(inputs[nextIndex] || input);
}

function focusTarget(target) {
  refreshSendInputs();
  const next = quantityInputs().find((input) => sameTarget(input, target));
  if (!next) return;
  next.focus({ preventScroll: true });
  next.scrollIntoView({ block: "center", inline: "nearest" });
  try {
    next.select();
  } catch {}
}

function ensurePointerTracking() {
  if (pointerTrackingBound) return;
  pointerTrackingBound = true;
  document.addEventListener(
    "pointerdown",
    (event) => {
      const input = event.target.closest?.(QUANTITY_SELECTOR);
      pointerTarget =
        input && !input.disabled ? inputTarget(input) : null;
    },
    true,
  );
}

function restorePointerTarget() {
  if (!pointerTarget) return;
  const target = pointerTarget;
  pointerTarget = null;
  queueMicrotask(() => focusTarget(target));
}

function beginEdit(input, callbacks) {
  if (editSession?.input === input) return editSession;
  if (editSession) commitPendingQuantityEdit({ render: false });
  editSession = {
    input,
    callbacks,
    beforeValue: input.value,
    changed: false,
    editStarted: false,
    historyCheckpoint: null,
  };
  return editSession;
}

function updateEdit(input, callbacks) {
  const session = beginEdit(input, callbacks);
  const changed = input.value !== session.beforeValue;
  if (changed && !session.editStarted) {
    session.historyCheckpoint = session.callbacks.onEditStart(input);
    session.editStarted = true;
  }
  session.changed = changed;
  session.callbacks.onInput(input);
}

function finishEdit(input, options = {}) {
  const session = editSession;
  if (!session || session.input !== input) return false;
  editSession = null;
  if (!session.editStarted) return false;
  if (!session.changed) {
    session.callbacks.onRevert?.(
      input,
      session.historyCheckpoint,
      options,
    );
    return false;
  }
  session.callbacks.onCommit(input, options);
  return true;
}

export function commitPendingQuantityEdit(options = {}) {
  if (!editSession) return false;
  return finishEdit(editSession.input, options);
}

export function pendingQuantityEdit() {
  return Boolean(editSession?.changed);
}

export function bindQuantityInputs({
  inputs,
  onEditStart,
  onInput,
  onCommit,
}) {
  ensurePointerTracking();
  refreshSendInputs();
  inputs.forEach((input) => {
    const callbacks = { onEditStart, onInput, onCommit };
    input.onfocus = () => {
      pointerTarget = null;
      beginEdit(input, callbacks);
      if (input.matches(SEND_SELECTOR)) refreshSendInputs();
    };
    input.oninput = () => updateEdit(input, callbacks);
    input.onchange = () => {
      if (finishEdit(input, { reason: "change", render: true })) {
        restorePointerTarget();
      }
    };
    input.onblur = () => {
      if (finishEdit(input, { reason: "blur", render: true })) {
        restorePointerTarget();
      }
    };
    input.onkeydown = (event) => {
      if (event.key !== "Enter" && event.key !== "Tab") return;
      const moveTarget = nextTargetFor(input, event.shiftKey);
      event.preventDefault();
      event.stopPropagation();
      finishEdit(input, {
        reason: event.key.toLowerCase(),
        render: true,
      });
      focusTarget(moveTarget);
    };
  });
}
