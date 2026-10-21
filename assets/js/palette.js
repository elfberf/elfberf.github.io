/**
 * Command menu (⌘K / Ctrl+K): a searchable list of every action on the page.
 * Accessible combobox + listbox pattern; arrow keys move, Enter runs, Escape closes.
 */
import { el, icon } from "./render.js?v=20261021-1513";

const normalize = (s) =>
  s
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ı/g, "i");

/**
 * @param {{ label: (key: string) => string, commands: () => Array<{ id: string, icon: string, text: string, hint?: string, keywords?: string, run: () => void }> }} options
 */
export function createPalette({ label, commands }) {
  const dialog = document.getElementById("palette");
  const input = dialog?.querySelector("[data-palette-input]");
  const list = dialog?.querySelector("[data-palette-list]");
  const empty = dialog?.querySelector("[data-palette-empty]");
  if (!dialog || !input || !list) return null;

  let items = [];
  let active = 0;
  let lastFocus = null;

  function render() {
    const query = normalize(input.value.trim());
    items = commands().filter((c) => !query || normalize(`${c.text} ${c.keywords ?? ""}`).includes(query));
    active = Math.min(active, Math.max(0, items.length - 1));
    list.replaceChildren(
      ...items.map((c, i) =>
        el(
          "li",
          {
            id: `cmd-${c.id}`,
            role: "option",
            class: "palette__item",
            "aria-selected": String(i === active),
          },
          el("span", { class: "palette__icon" }, icon(c.icon)),
          el("span", { class: "palette__text" }, c.text),
          c.hint ? el("kbd", { class: "palette__hint" }, c.hint) : null,
        ),
      ),
    );
    [...list.children].forEach((node, i) => {
      node.addEventListener("click", () => run(i));
      node.addEventListener("pointermove", () => setActive(i, false));
    });
    if (empty) empty.hidden = items.length > 0;
    input.setAttribute("aria-activedescendant", items[active] ? `cmd-${items[active].id}` : "");
  }

  function setActive(index, scroll = true) {
    if (!items.length) return;
    active = (index + items.length) % items.length;
    [...list.children].forEach((node, i) => node.setAttribute("aria-selected", String(i === active)));
    input.setAttribute("aria-activedescendant", `cmd-${items[active].id}`);
    if (scroll) list.children[active]?.scrollIntoView({ block: "nearest" });
  }

  function run(index) {
    const command = items[index];
    if (!command) return;
    close({ restoreFocus: false });
    // Let the dialog close before the action moves focus or scrolls.
    requestAnimationFrame(() => command.run());
  }

  function open() {
    lastFocus = document.activeElement;
    input.value = "";
    active = 0;
    input.placeholder = label("palette.placeholder");
    render();
    dialog.hidden = false;
    requestAnimationFrame(() => dialog.classList.add("is-open"));
    document.documentElement.classList.add("palette-open");
    input.focus();
  }

  function close({ restoreFocus = true } = {}) {
    dialog.classList.remove("is-open");
    document.documentElement.classList.remove("palette-open");
    setTimeout(() => {
      if (!dialog.classList.contains("is-open")) dialog.hidden = true;
    }, 160);
    if (restoreFocus && lastFocus instanceof HTMLElement) lastFocus.focus();
  }

  const isOpen = () => dialog.classList.contains("is-open");

  input.addEventListener("input", () => {
    active = 0;
    render();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(active + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(active - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(active);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      // Keep focus inside the dialog: the input is its only focus stop.
      event.preventDefault();
    }
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      isOpen() ? close() : open();
    } else if (event.key === "/" && !isOpen() && !event.target.closest?.("input, textarea, [contenteditable]")) {
      event.preventDefault();
      open();
    }
  });

  for (const trigger of document.querySelectorAll("[data-palette-open]")) {
    trigger.addEventListener("click", open);
  }

  return { open, close, isOpen };
}
