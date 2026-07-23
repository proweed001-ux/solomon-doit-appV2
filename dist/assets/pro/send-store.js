const SEND_SELECTOR = '#table input.jdata[data-map="send"]';

function sendInputs() {
  return [...document.querySelectorAll(SEND_SELECTOR)].filter(
    (input) => !input.disabled,
  );
}

function refreshSendInputs() {
  sendInputs().forEach((input, index) => {
    input.enterKeyHint = "next";
    input.tabIndex = 1000 + index;
  });
}

function nextIndexFor(input) {
  const inputs = sendInputs();
  return Math.max(0, inputs.indexOf(input)) + 1;
}

function focusSendAt(index) {
  setTimeout(() => {
    requestAnimationFrame(() => {
      refreshSendInputs();
      const inputs = sendInputs();
      const next = inputs[index] || inputs[inputs.length - 1] || inputs[0];
      if (!next) return;
      next.focus({ preventScroll: true });
      next.scrollIntoView({ block: "center", inline: "nearest" });
      try {
        next.select();
      } catch {}
    });
  }, 140);
}

export function bindQuantityInputs({ inputs, onInput, onCommit }) {
  refreshSendInputs();
  inputs.forEach((input) => {
    input.oninput = () => onInput(input);
    input.onchange = () => {
      const isSend = input.matches(SEND_SELECTOR);
      const nextIndex = isSend ? nextIndexFor(input) : -1;
      onCommit(input);
      if (isSend) focusSendAt(nextIndex);
    };
    if (!input.matches(SEND_SELECTOR)) return;
    input.onfocus = refreshSendInputs;
    input.onkeydown = (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      event.stopPropagation();
      input.blur();
    };
  });
}
