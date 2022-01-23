export enum SpecialKey {
  Backspace,
  Enter
}

export type Key = string | SpecialKey;

export function addInputListener(handler: (key: Key) => void) {
  document.addEventListener("keydown", (event) => {
      const key = event.key;
      if (key === "Enter") {
        handler(SpecialKey.Enter);
      } else if (key === "Backspace") {
        handler(SpecialKey.Backspace);
      } else if (/^[a-zA-Z]$/.test(key)) {
        handler(key.toUpperCase());
      }
    }
  );
  document.querySelectorAll(".key").forEach((key) => {
    key.addEventListener("click", (event) => {
      (key as HTMLElement).blur();
      if (key.getAttribute("aria-label") === "Backspace") {
        handler(SpecialKey.Backspace);
      } else if (key.textContent === "ENTER") {
        handler(SpecialKey.Enter);
      } else {
        handler(key.textContent);
      }
    });
  });
}