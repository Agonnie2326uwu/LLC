// Shared engine for the infinite drag strips (ServicesCarousel, RoundCarousel).
//
// Markup contract (all hooks are data-* attributes inside the root):
//   root            data-count="N" (real slides), data-autoplay="ms" (0/absent = off)
//   [data-viewport] clipping box; [data-track] flex row of the real [data-slide]s
//   optional        [data-prev] [data-next] [data-toggle] [data-dot="i"] [data-status]
//                   [data-js-only] (rendered .invisible, revealed once the engine runs)
//
// The server renders only the real slides at translateX(0), so the no-JS (and
// pre-init) state shows slide 1 at the left edge. On init the engine prepends PRE
// clones and appends enough clones to cover the viewport, then offsets the track
// by PRE steps in the same task, so nothing visibly moves.
//
// Position model: `pos` is measured in slides relative to the first real slide;
// x = -(PRE + pos) * step. Drag/glide keep pos wrapped into [0, N); animated
// moves may target [-PRE, N + PRE] and are silently wrapped back once they land.

type Teardown = () => void;

const PRE = 2; // clones before the real set: covers animated targets down to -2
const instances = new Map<HTMLElement, Teardown>();

const mod = (n: number, m: number) => ((n % m) + m) % m;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Clones needed after the real set so any position in [0, N + PRE] fills the viewport. */
export function postClones(viewportWidth: number, step: number, gap: number) {
  return Math.ceil((viewportWidth + gap) / step) + PRE;
}

export function registerStrips(selector: string) {
  const mountAll = () => {
    document.querySelectorAll<HTMLElement>(selector).forEach((root) => {
      instances.get(root)?.();
      instances.set(root, mount(root));
    });
  };
  // astro:page-load fires on the first load too, so this is the only init path.
  document.addEventListener('astro:page-load', mountAll);
}

document.addEventListener('astro:before-swap', () => {
  instances.forEach((teardown) => teardown());
  instances.clear();
});

function mount(root: HTMLElement): Teardown {
  const viewport = root.querySelector<HTMLElement>('[data-viewport]');
  const track = root.querySelector<HTMLElement>('[data-track]');
  if (!viewport || !track) return () => {};

  // Stale clones from an earlier mount of this same DOM (e.g. HMR)
  track.querySelectorAll(':scope > [data-clone]').forEach((n) => n.remove());
  const real = Array.from(track.querySelectorAll<HTMLElement>(':scope > [data-slide]'));
  const count = Number(root.dataset.count) || real.length;
  if (count < 1 || real.length < count) return () => {};

  const interval = Number(root.dataset.autoplay) || 0;
  const prevBtn = root.querySelector<HTMLButtonElement>('[data-prev]');
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-next]');
  const toggle = root.querySelector<HTMLButtonElement>('[data-toggle]');
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-dot]'));
  const status = root.querySelector<HTMLElement>('[data-status]');

  const ac = new AbortController();
  const { signal } = ac;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduceMotion = () => motionQuery.matches;

  // ---- Geometry & clones -------------------------------------------------
  let step = 0;
  let gap = 0;
  let vw = 0;
  let pre = 0;
  let post = 0;
  let primed = false; // all strip images switched to eager after page load

  function measure() {
    gap = parseFloat(getComputedStyle(track!).columnGap) || 0;
    // Sub-pixel step (homepage widths come from aspect-ratio) so wraps never drift.
    step =
      real.length > 1
        ? real[1].getBoundingClientRect().left - real[0].getBoundingClientRect().left
        : real[0].getBoundingClientRect().width + gap;
    vw = viewport!.clientWidth;
  }

  function makeClone(src: HTMLElement) {
    const c = src.cloneNode(true) as HTMLElement;
    c.removeAttribute('data-slide');
    c.removeAttribute('role');
    c.removeAttribute('aria-roledescription');
    c.removeAttribute('aria-label');
    c.setAttribute('data-clone', '');
    c.setAttribute('aria-hidden', 'true');
    c.setAttribute('inert', '');
    c.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
    c.querySelectorAll('img').forEach((img) => {
      img.alt = '';
      img.loading = primed ? 'eager' : 'lazy';
      img.removeAttribute('fetchpriority');
    });
    return c;
  }

  /** (Re)builds clones when the needed count changes. Returns true if rebuilt. */
  function buildClones() {
    if (!step) return false;
    const need = postClones(vw, step, gap);
    if (pre === PRE && post === need) return false;
    track!.querySelectorAll(':scope > [data-clone]').forEach((n) => n.remove());
    const before = document.createDocumentFragment();
    for (let j = 0; j < PRE; j++) before.append(makeClone(real[mod(j - PRE, count)]));
    const after = document.createDocumentFragment();
    for (let j = 0; j < need; j++) after.append(makeClone(real[j % count]));
    track!.prepend(before);
    track!.append(after);
    pre = PRE;
    post = need;
    return true;
  }

  // ---- Position ------------------------------------------------------------
  let pos = 0; // where the track is drawn (slides)
  let target = 0; // integer destination of the current move (== pos at rest)
  let settleTimer = 0;

  const xOf = (p: number) => -(pre + p) * step;

  function apply(x: number, animate: boolean) {
    track!.classList.toggle('no-anim', !animate);
    track!.style.transform = `translateX(${x}px)`;
  }

  function livePos() {
    const m41 = new DOMMatrix(getComputedStyle(track!).transform).m41;
    return Math.round((-m41 / step - pre) * 1e4) / 1e4;
  }

  /** Pin the track where it is on screen right now (mid-transition or mid-glide),
   *  wrapped into the real range, with transitions off. */
  function rebase() {
    stopGlide();
    clearTimeout(settleTimer);
    if (!step) return;
    const live = livePos();
    const shift = -Math.floor(live / count) * count;
    pos = live + shift;
    target += shift;
    apply(xOf(pos), false);
    void track!.offsetWidth; // flush so the next transition starts from here
  }

  function settle() {
    if (dragging || glideId) return;
    const wrapped = mod(target, count);
    if (wrapped !== target || pos !== target) {
      pos = target = wrapped;
      apply(xOf(pos), false);
    }
  }

  function scheduleSettle(animated: boolean) {
    clearTimeout(settleTimer);
    if (animated) settleTimer = window.setTimeout(settle, 750);
    else settle();
  }

  function current() {
    return mod(Math.round(target), count);
  }

  function syncChrome(announce: boolean) {
    const li = current();
    dots.forEach((d, di) => {
      if (di === li) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
    if (announce && status) {
      const title = real[li].dataset.title;
      status.textContent = `${title ? `${title}, ` : ''}${li + 1} of ${count}`;
    }
  }

  /** Animate to a destination computed from the (rebased) current target. */
  function move(dest: (t: number) => number, announce: boolean) {
    rebase();
    if (!step) return;
    target = clamp(Math.round(dest(target)), -PRE, count + PRE);
    pos = target;
    const animate = !reduceMotion();
    apply(xOf(target), animate);
    syncChrome(announce);
    scheduleSettle(animate);
  }

  /** Nearest copy of real slide `index` to where the track is now. */
  function nearest(index: number) {
    // pos is the rebased on-screen position (move() rebases before calling this)
    return () =>
      [index - count, index, index + count]
        .filter((c) => c >= -PRE && c <= count + PRE)
        .reduce((a, b) => (Math.abs(b - pos) < Math.abs(a - pos) ? b : a));
  }

  function snap() {
    // Soft-snap to the nearest card after a drag or glide
    track!.classList.remove('dragging');
    target = Math.round(pos);
    pos = target;
    const animate = !reduceMotion();
    apply(xOf(target), animate);
    syncChrome(true);
    scheduleSettle(animate);
    syncAutoplay();
  }

  // ---- Drag / swipe with momentum -------------------------------------------
  let dragging = false;
  let captured = false;
  let startX = 0;
  let baseX = 0;
  let movedX = 0;
  let samples: { x: number; t: number }[] = [];
  let glideId = 0;
  let suppressClick = false;

  function stopGlide() {
    if (glideId) cancelAnimationFrame(glideId);
    glideId = 0;
  }

  /** Draw at track offset x, wrapping into [0, N). Returns the (possibly shifted) x. */
  function drawWrapped(x: number) {
    let p = -x / step - pre;
    const k = Math.floor(p / count);
    if (k) {
      p -= k * count;
      x += k * count * step;
    }
    pos = p;
    target = p;
    apply(x, false);
    return x;
  }

  function flickVelocity() {
    const now = performance.now();
    const recent = samples.filter((s) => now - s.t < 120);
    if (recent.length < 2) return 0;
    const a = recent[0];
    const b = recent[recent.length - 1];
    const dt = b.t - a.t;
    return dt > 0 ? (b.x - a.x) / dt : 0;
  }

  function startGlide(v0: number) {
    stopGlide();
    let v = clamp(v0, -8, 8);
    let x = xOf(pos);
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      v *= Math.pow(0.95, dt / 16.7);
      x = drawWrapped(x + v * dt);
      if (Math.abs(v) > 0.15) {
        glideId = requestAnimationFrame(frame);
      } else {
        glideId = 0;
        snap();
      }
    };
    glideId = requestAnimationFrame(frame);
  }

  viewport.addEventListener(
    'pointerdown',
    (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      // Grab exactly where the strip is on screen, even mid-animation.
      rebase();
      dragging = true;
      captured = false;
      startX = e.clientX;
      movedX = 0;
      baseX = xOf(pos);
      samples = [{ x: e.clientX, t: performance.now() }];
      syncAutoplay();
    },
    { signal },
  );

  viewport.addEventListener(
    'pointermove',
    (e) => {
      if (!dragging || !step) return;
      const dx = e.clientX - startX;
      movedX = dx;
      if (!captured && Math.abs(dx) <= 5) return;
      if (!captured) {
        captured = true;
        track.classList.add('dragging');
        interaction();
        try {
          viewport.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
      samples.push({ x: e.clientX, t: performance.now() });
      if (samples.length > 8) samples.shift();
      // 1:1 finger tracking; keep baseX in step with any wrap shift
      const x = baseX + dx;
      baseX += drawWrapped(x) - x;
    },
    { signal },
  );

  function endDrag(e: PointerEvent) {
    if (!dragging) return;
    dragging = false;
    if (!captured) {
      // Pure tap: let the click (e.g. Learn more) through untouched, and finish
      // any move that the grab interrupted.
      suppressClick = false;
      if (pos !== Math.round(pos)) snap();
      else scheduleSettle(false);
      syncAutoplay();
      return;
    }
    captured = false;
    try {
      if (viewport!.hasPointerCapture(e.pointerId)) viewport!.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    suppressClick = Math.abs(movedX) > 10;
    const v = flickVelocity();
    if (Math.abs(v) > 0.25 && !reduceMotion()) startGlide(v);
    else snap();
  }
  viewport.addEventListener('pointerup', endDrag, { signal });
  viewport.addEventListener('pointercancel', endDrag, { signal });
  viewport.addEventListener('dragstart', (e) => e.preventDefault(), { signal });
  viewport.addEventListener(
    'click',
    (e) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopPropagation();
        suppressClick = false;
      }
    },
    { capture: true, signal },
  );

  track.addEventListener(
    'transitionend',
    (e) => {
      if (e.target === track && e.propertyName === 'transform') {
        clearTimeout(settleTimer);
        settle();
      }
    },
    { signal },
  );

  // The browser may scroll the clipped viewport to reveal focus; we own position.
  viewport.addEventListener(
    'scroll',
    () => {
      if (viewport.scrollLeft) viewport.scrollLeft = 0;
    },
    { signal },
  );

  // ---- Buttons, dots, keyboard, focus ---------------------------------------
  const go = (dir: number) => {
    interaction();
    move((t) => Math.round(t) + dir, true);
  };
  prevBtn?.addEventListener('click', () => go(-1), { signal });
  nextBtn?.addEventListener('click', () => go(1), { signal });
  dots.forEach((d, di) =>
    d.addEventListener(
      'click',
      () => {
        interaction();
        move(nearest(di), true);
      },
      { signal },
    ),
  );

  root.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      go(e.key === 'ArrowLeft' ? -1 : 1);
    },
    { signal },
  );

  let focusInSlides = false;
  viewport.addEventListener(
    'focusin',
    (e) => {
      focusInSlides = true;
      viewport.scrollLeft = 0;
      const el = e.target as HTMLElement;
      const slide = el.closest<HTMLElement>('[data-slide]');
      // Keyboard focus only — a mouse press on a link must not start a move under the grab.
      if (slide && el.matches(':focus-visible')) {
        interaction();
        const index = real.indexOf(slide);
        if (index >= 0 && index !== current()) move(nearest(index), true);
      }
      syncAutoplay();
    },
    { signal },
  );
  viewport.addEventListener(
    'focusout',
    (e) => {
      focusInSlides = viewport.contains(e.relatedTarget as Node | null);
      syncAutoplay();
    },
    { signal },
  );

  // ---- Autoplay ---------------------------------------------------------------
  let playing = interval > 0 && !reduceMotion();
  let inView = true;
  let hovering = false;
  let timer = 0;

  function syncAutoplay() {
    const run =
      playing && inView && !document.hidden && !hovering && !focusInSlides && !dragging && !reduceMotion();
    if (run && !timer) {
      timer = window.setInterval(() => move((t) => Math.round(t) + 1, false), interval);
    } else if (!run && timer) {
      clearInterval(timer);
      timer = 0;
    }
  }

  function syncToggle() {
    if (!toggle) return;
    toggle.hidden = !interval || reduceMotion();
    toggle.setAttribute('aria-label', playing ? 'Pause automatic slide show' : 'Play automatic slide show');
    toggle.dataset.state = playing ? 'playing' : 'paused';
  }

  /** Any deliberate navigation stops autoplay for good (until Play is pressed). */
  function interaction() {
    if (playing) {
      playing = false;
      syncToggle();
    }
    syncAutoplay();
  }

  toggle?.addEventListener(
    'click',
    () => {
      playing = !playing && !reduceMotion();
      syncToggle();
      syncAutoplay();
    },
    { signal },
  );
  viewport.addEventListener(
    'pointerenter',
    (e) => {
      if (e.pointerType === 'mouse') {
        hovering = true;
        syncAutoplay();
      }
    },
    { signal },
  );
  viewport.addEventListener(
    'pointerleave',
    () => {
      hovering = false;
      syncAutoplay();
    },
    { signal },
  );
  document.addEventListener('visibilitychange', syncAutoplay, { signal });
  motionQuery.addEventListener(
    'change',
    () => {
      if (reduceMotion()) playing = false;
      syncToggle();
      syncAutoplay();
    },
    { signal },
  );

  const io = new IntersectionObserver((entries) => {
    inView = entries.some((en) => en.isIntersecting);
    syncAutoplay();
  });
  io.observe(root);

  // ---- Resize ------------------------------------------------------------------
  let resizeRaf = 0;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      if (dragging) return;
      stopGlide();
      clearTimeout(settleTimer);
      const at = current();
      measure();
      buildClones();
      pos = target = at;
      apply(xOf(pos), false);
    });
  });
  ro.observe(viewport);

  // ---- Image priming: fetch the rest once the page has loaded ------------------
  let idleHandle = 0;
  const hasIdle = 'requestIdleCallback' in window;
  const prime = () => {
    primed = true;
    track.querySelectorAll('img').forEach((img) => {
      img.loading = 'eager';
    });
  };
  const schedulePrime = () => {
    idleHandle = hasIdle ? window.requestIdleCallback(prime, { timeout: 3000 }) : window.setTimeout(prime, 300);
  };
  if (document.readyState === 'complete') schedulePrime();
  else window.addEventListener('load', schedulePrime, { once: true, signal });

  // ---- Init (same task as the clone insert, so the first paint never jumps) ---
  measure();
  buildClones();
  apply(xOf(0), false);
  syncChrome(false);
  root.setAttribute('data-ready', '');
  root.querySelectorAll('[data-js-only]').forEach((el) => el.classList.remove('invisible'));
  syncToggle();
  syncAutoplay();

  return () => {
    ac.abort();
    clearInterval(timer);
    clearTimeout(settleTimer);
    stopGlide();
    cancelAnimationFrame(resizeRaf);
    if (hasIdle) window.cancelIdleCallback(idleHandle);
    else clearTimeout(idleHandle);
    io.disconnect();
    ro.disconnect();
    timer = 0;
  };
}
