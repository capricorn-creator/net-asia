import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const STORAGE_KEY = 'netasia-scroll-positions';
const MAIN_ID = 'main-content';
const INSTANT = 'instant' as ScrollBehavior;

// We restore scroll ourselves (see below), so turn the browser's version off.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

function loadPositions(): Map<string, number> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      return new Map(Object.entries(JSON.parse(raw) as Record<string, number>));
    }
  } catch {
    /* storage unavailable or corrupt: start empty */
  }
  return new Map();
}

const positions = loadPositions();

function persistPositions() {
  try {
    const recent = Array.from(positions.entries()).slice(-100);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(recent)));
  } catch {
    /* ignore */
  }
}

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let pendingFrame = 0;

function cancelPending() {
  if (pendingFrame) {
    cancelAnimationFrame(pendingFrame);
    pendingFrame = 0;
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: INSTANT });
}

// Lazy routes may not have rendered yet, so wait (briefly) until the page is tall enough.
function restorePosition(y: number) {
  let tries = 0;
  const attempt = () => {
    pendingFrame = 0;
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    if (maxY >= y || tries >= 40) {
      window.scrollTo({ top: y, left: 0, behavior: INSTANT });
      return;
    }
    tries += 1;
    pendingFrame = requestAnimationFrame(attempt);
  };
  attempt();
}

// Wait (briefly) for the target element to exist, then scroll to it.
function scrollToHash(hash: string, smooth: boolean) {
  let id = hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    /* use the raw id */
  }
  let tries = 0;
  const attempt = () => {
    pendingFrame = 0;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : INSTANT });
      return;
    }
    if (tries < 60) {
      tries += 1;
      pendingFrame = requestAnimationFrame(attempt);
    }
  };
  attempt();
}

export default function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const navType = useNavigationType();
  const keyRef = useRef(key);
  const prev = useRef<{ pathname: string; hash: string } | null>(null);

  useLayoutEffect(() => {
    keyRef.current = key;
    const last = prev.current;
    prev.current = { pathname, hash };
    cancelPending();

    const pathChanged = last !== null && last.pathname !== pathname;
    const hashChanged = last !== null && last.hash !== hash;

    if (navType === 'POP') {
      // Back/forward (and reload): restore where the user was.
      const saved = positions.get(key);
      if (saved !== undefined) restorePosition(saved);
      else if (hash) scrollToHash(hash, false);
      else if (pathChanged) scrollToTop();
    } else if (pathChanged) {
      // PUSH / REPLACE to a different page.
      scrollToTop();
      if (hash) scrollToHash(hash, false);
    } else if (hashChanged && hash) {
      // Same-page anchor click: smooth, unless the user prefers reduced motion.
      scrollToHash(hash, !prefersReducedMotion());
    }
    // Query-string-only changes (e.g. /tools?q=...) fall through: scroll is untouched.

    if (pathChanged) {
      document.getElementById(MAIN_ID)?.focus({ preventScroll: true });
    }
  }, [key, pathname, hash, navType]);

  // Remember the scroll position of every history entry.
  useEffect(() => {
    let frame = 0;
    const save = () => {
      frame = 0;
      positions.delete(keyRef.current);
      positions.set(keyRef.current, Math.round(window.scrollY));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(save);
    };
    const onPageHide = () => {
      save();
      persistPositions();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pagehide', onPageHide);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pagehide', onPageHide);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}