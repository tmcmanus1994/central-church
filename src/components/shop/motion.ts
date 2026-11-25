"use client";

import { useEffect, useState } from "react";

/** True when the visitor has asked for reduced motion. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** True on devices with a real pointer (mouse/trackpad) — the hover tilts
 *  only make sense there. */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
}

/**
 * Web Animations API with a no-op fallback: skipped under reduced motion
 * and in the rare browser without `element.animate`. Returns the Animation
 * so callers can wait on `finished`.
 */
export function animate(
  el: Element | null,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
  reduced: boolean,
): Animation | null {
  if (!el || reduced || typeof el.animate !== "function") return null;
  return el.animate(keyframes, options);
}
