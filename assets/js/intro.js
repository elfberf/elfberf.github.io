/**
 * First-visit intro: soft points of light drift down behind the hero while the
 * backdrop glow settles in and the surname gets a single shimmer.
 *
 * - Plays on every page load. With prefers-reduced-motion it does not start on
 *   its own; offerIntro() shows a button so the visitor can choose to play it.
 * - Purely decorative: the canvas sits behind the hero content, ignores the
 *   pointer, is hidden from assistive tech and removes itself when done.
 */

const DURATION = 4200; // ms until the last particle has faded
const SPAWN_FOR = 2200; // ms during which new particles appear
/** "#0e6b63" or "rgb(…)" → [r, g, b] */
function toRgb(color) {
  const probe = document.createElement("span");
  probe.style.color = color;
  document.body.append(probe);
  const [r, g, b] = getComputedStyle(probe).color.match(/\d+/g).map(Number);
  probe.remove();
  return [r, g, b];
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** With reduced motion, adds a small "play the light effect" button to the hero instead of autoplaying. */
export function offerIntro(label) {
  const copy = document.querySelector(".hero__copy");
  if (!copy || !reducedMotion() || copy.querySelector("[data-intro-play]")) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "intro-offer";
  button.dataset.introPlay = "";
  const text = document.createElement("span");
  text.dataset.i18n = "intro.play";
  text.textContent = label("intro.play");
  button.append("✨ ", text);
  button.addEventListener("click", () => playIntro({ force: true }));
  copy.append(button);
}

export function playIntro({ force = false } = {}) {
  const hero = document.querySelector(".hero");
  const root = document.documentElement;
  if (!hero || (reducedMotion() && !force)) return;
  hero.querySelector(".hero__lights")?.remove();

  root.classList.add("intro");
  setTimeout(() => root.classList.remove("intro"), DURATION + 200);

  const canvas = document.createElement("canvas");
  canvas.className = "hero__lights";
  canvas.setAttribute("aria-hidden", "true");
  // After the backdrop (same z-index), so the lights glow over it but stay behind the text.
  (hero.querySelector(".hero__backdrop") ?? hero.firstChild)?.after(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas.remove();

  const styles = getComputedStyle(root);
  const dark =
    root.dataset.theme === "dark" ||
    (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const palette = [
    toRgb(styles.getPropertyValue("--accent").trim()),
    toRgb(styles.getPropertyValue("--accent-2").trim()),
    dark ? [236, 238, 239] : [255, 214, 140], // a warm spark in light mode, a pale one in dark mode
  ];

  let width = 0;
  let height = 0;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  // Fewer particles on small screens.
  const total = Math.round(Math.min(240, Math.max(90, width / 6)));
  const particles = [];
  const start = performance.now();
  let spawned = 0;

  const spawn = (now) => {
    const [r, g, b] = palette[Math.floor(Math.random() * palette.length)];
    // Mostly fine sparks, with an occasional large soft orb.
    const orb = Math.random() < 0.12;
    particles.push({
      x: Math.random() * width,
      y: -20 + Math.random() * height * 0.35,
      radius: orb ? 3 + Math.random() * 3 : 0.8 + Math.random() * 2.2,
      alpha: orb ? 0.35 : 1,
      speed: orb ? 0.06 + Math.random() * 0.08 : 0.12 + Math.random() * 0.24, // px per ms
      sway: 8 + Math.random() * 22,
      phase: Math.random() * Math.PI * 2,
      born: now,
      life: 1800 + Math.random() * 1600,
      color: `${r}, ${g}, ${b}`,
    });
  };

  const frame = (now) => {
    const elapsed = now - start;
    // Spawn on an ease-out curve: a burst at first, then a trickle.
    const target = Math.round(total * Math.min(1, 1 - Math.pow(1 - elapsed / SPAWN_FOR, 2)));
    while (spawned < target && elapsed < SPAWN_FOR) {
      spawn(now);
      spawned++;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = dark ? "lighter" : "source-over";
    for (const p of particles) {
      const age = (now - p.born) / p.life;
      if (age >= 1) continue;
      const fade = age < 0.2 ? age / 0.2 : 1 - (age - 0.2) / 0.8;
      const x = p.x + Math.sin(p.phase + (now - p.born) / 380) * p.sway;
      const y = p.y + (now - p.born) * p.speed;
      const glow = p.radius * 5;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, glow);
      gradient.addColorStop(0, `rgba(${p.color}, ${p.alpha * fade})`);
      gradient.addColorStop(0.25, `rgba(${p.color}, ${0.4 * p.alpha * fade})`);
      gradient.addColorStop(1, `rgba(${p.color}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, glow, 0, Math.PI * 2);
      ctx.fill();
    }

    if (elapsed < DURATION && !document.hidden) {
      requestAnimationFrame(frame);
    } else {
      canvas.classList.add("is-done");
      window.removeEventListener("resize", resize);
      setTimeout(() => canvas.remove(), 600);
    }
  };
  requestAnimationFrame(frame);
}
