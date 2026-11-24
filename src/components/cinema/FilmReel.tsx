"use client";

import { useEffect, useImperativeHandle, useRef, useSyncExternalStore, type Ref } from "react";
import { CLIPS, CLIP_SECONDS, SCENES, STARTS, TOTAL_SECONDS } from "./story";

/** Shared, mutable film state the overlays read every animation frame (no React re-renders). */
export interface FilmBus {
  /** Film position 0..1 across all scenes, holds included. */
  p: number;
  /** Where the 16:9 (or 9:16) video frame sits on screen, in CSS px, for pinning callouts. */
  box: { x: number; y: number; w: number; h: number };
}

export type ReelState = "loading" | "playing" | "blocked" | "error";

export interface ReelHandle {
  /** Start or resume. Call it straight from a click when autoplay was blocked. */
  play: () => Promise<boolean>;
  pause: () => void;
  /** Jump to the start of scene i. */
  jump: (i: number) => void;
}

type Mode = "clip" | "hold" | "switch";

/** Portrait clips on phones held upright, landscape everywhere else. Decided once per visit. */
let chosenOrient: "l" | "p" | null = null;
const getOrient = () => (chosenOrient ??= window.innerWidth / Math.max(1, window.innerHeight) < 0.8 ? "p" : "l");
const noSubscribe = () => () => undefined;

/**
 * Plays the film on its own: each scene's clip, then a hold on its last frame (a slow push-in),
 * then the next clip, which starts on that same frame. Loops forever.
 * One <video> per clip, stacked; only the current one is visible. Muted and inline, so browsers
 * allow it to autoplay; when one refuses (Low Power Mode, data saver, a browser setting) the
 * reel reports "blocked" and the page shows its still layout instead.
 */
export default function FilmReel({
  ref,
  bus,
  onState,
  onScene,
  autoStart = true,
}: {
  ref?: Ref<ReelHandle>;
  bus: React.MutableRefObject<FilmBus>;
  onState: (s: ReelState) => void;
  onScene: (i: number) => void;
  autoStart?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const orient = useSyncExternalStore(noSubscribe, getOrient, () => null);
  const cb = useRef({ onState, onScene });
  useEffect(() => {
    cb.current = { onState, onScene };
  }, [onState, onScene]);

  // Live playback state, kept out of React.
  const st = useRef({
    i: 0,
    mode: "clip" as Mode,
    holdStart: 0,
    holdDone: 0,
    paused: true,
    started: false,
    zoom: 1,
    zoomFrom: 1,
  });

  const show = (i: number) => {
    vids.current.forEach((v, k) => {
      if (v) v.style.opacity = k === i ? "1" : "0";
    });
  };

  const clipSrc = (i: number) => `/film/${getOrient()}/${CLIPS[i].id}.mp4`;

  /** Attach a clip's file only when it is about to play, so the first view does not open six downloads. */
  const arm = (i: number) => {
    const v = vids.current[i];
    if (!v || v.dataset.armed === "1") return;
    v.dataset.armed = "1";
    v.preload = "auto";
    v.src = clipSrc(i);
  };

  const warm = (i: number) => arm(i % CLIPS.length);

  /** Start clip i from its first frame; swap it in once it is actually playing. */
  const startClip = (i: number) => {
    const s = st.current;
    arm(i);
    const v = vids.current[i];
    if (!v) return;
    s.mode = "switch";
    s.i = i;
    cb.current.onScene(i);
    if (v.currentTime > 0.01) v.currentTime = 0;
    const swapIn = () => {
      if (st.current.i !== i) return;
      show(i);
      s.mode = "clip";
      s.zoomFrom = s.zoom;
      // Rewind the others so the loop can reuse them.
      vids.current.forEach((o, k) => {
        if (o && k !== i) {
          o.pause();
          if (o.currentTime > 0.01) o.currentTime = 0;
        }
      });
      warm((i + 1) % CLIPS.length);
    };
    if (s.paused) return;
    v.play()
      .then(() => {
        if ("requestVideoFrameCallback" in v) {
          (v as HTMLVideoElement & { requestVideoFrameCallback: (f: () => void) => void }).requestVideoFrameCallback(swapIn);
        } else swapIn();
      })
      .catch(() => {
        // Autoplay was allowed for the first clip, so this is rare; fall back to the still layout.
        cb.current.onState("blocked");
      });
  };

  const endClip = (i: number) => {
    const s = st.current;
    if (s.i !== i || s.mode !== "clip") return;
    s.mode = "hold";
    s.holdStart = -1; // stamped by the clock on its next frame
    s.holdDone = 0;
  };

  useImperativeHandle(ref, () => ({
    play: async () => {
      const s = st.current;
      s.paused = false;
      arm(s.i);
      const v = vids.current[s.i];
      if (!v) return false;
      if (s.mode === "hold") {
        s.holdStart = performance.now();
        return true;
      }
      try {
        await v.play();
        if (s.paused) return false;
        if (!s.started) {
          s.started = true;
          warm(s.i + 1);
        }
        show(s.i);
        s.mode = "clip";
        cb.current.onState("playing");
        return true;
      } catch (e) {
        const name = (e as DOMException)?.name;
        if (name === "AbortError") {
          s.paused = true;
          return false;
        }
        s.paused = true;
        cb.current.onState(name === "NotAllowedError" ? "blocked" : "error");
        return false;
      }
    },
    pause: () => {
      const s = st.current;
      if (s.paused) return;
      s.paused = true;
      if (s.mode === "hold" && s.holdStart >= 0) s.holdDone += performance.now() - s.holdStart;
      vids.current[s.i]?.pause();
    },
    jump: (i: number) => {
      const s = st.current;
      warm(i);
      s.zoom = 1;
      s.zoomFrom = 1;
      if (s.paused) {
        s.i = i;
        cb.current.onScene(i);
        const v = vids.current[i];
        if (v) v.currentTime = 0;
        show(i);
        s.mode = "clip";
        return;
      }
      startClip(i);
    },
  }));

  // Autoplay once the videos exist (or stay armed & ready until scrolled into view when autoStart is false).
  useEffect(() => {
    if (!orient) return;
    const v = vids.current[0];
    if (!v) return;
    arm(0);
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    // `?still` previews the no-autoplay layout (QA); data saver gets it for real.
    if (conn?.saveData || new URLSearchParams(window.location.search).has("still")) {
      cb.current.onState("blocked");
      return;
    }
    if (!autoStart) return;
    const s = st.current;
    s.paused = false;
    let cancelled = false;
    v.play()
      .then(() => {
        if (cancelled || s.paused) return;
        s.started = true;
        show(0);
        warm(1);
        cb.current.onState("playing");
      })
      .catch((e: DOMException) => {
        if (cancelled) return;
        s.paused = true;
        if (e?.name === "AbortError") return;
        cb.current.onState(e?.name === "NotAllowedError" ? "blocked" : "error");
      });
    return () => {
      cancelled = true;
    };
  }, [orient, autoStart]);

  // Clock: film position, holds, the push-in and the frame box for the overlays.
  useEffect(() => {
    if (!orient) return;
    let raf = 0;
    let last = performance.now();
    const aspect = orient === "p" ? 9 / 16 : 16 / 9;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const s = st.current;
      const sc = SCENES[s.i];
      const v = vids.current[s.i];
      let T = STARTS[s.i];
      if (s.mode === "clip" && v) {
        T += Math.min(v.currentTime, CLIP_SECONDS);
        // Ease the previous hold's push-in back out while the camera moves.
        s.zoom = 1 + (s.zoom - 1) * Math.exp(-dt * 1.4);
      } else if (s.mode === "hold") {
        if (s.holdStart < 0) s.holdStart = now;
        const held = (s.holdDone + (s.paused ? 0 : now - s.holdStart)) / 1000;
        const k = Math.min(1, held / sc.dwell);
        s.zoom = s.zoomFrom + (1.045 - s.zoomFrom) * (1 - Math.pow(1 - k, 2)) * 0.9;
        T += CLIP_SECONDS + Math.min(held, sc.dwell - 0.001);
        if (held >= sc.dwell && !s.paused) {
          s.zoomFrom = s.zoom;
          startClip((s.i + 1) % SCENES.length);
        }
      }
      // Switching: the copy has moved on; sit at the very start of the new scene (black at the loop)
      // until its clip is really playing.
      bus.current.p = Math.min(0.99999, T / TOTAL_SECONDS);

      const el = host.current;
      if (!el) return;
      const W = el.clientWidth;
      const H = el.clientHeight;
      let w = W;
      let h = W / aspect;
      if (h < H) {
        h = H;
        w = H * aspect;
      }
      w *= s.zoom;
      h *= s.zoom;
      bus.current.box = { x: (W - w) / 2, y: (H - h) / 2, w, h };
      const z = s.zoom.toFixed(4);
      vids.current.forEach((o) => {
        if (o && o.style.transform !== `scale(${z})`) o.style.transform = `scale(${z})`;
      });
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // startClip reads refs only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orient, bus]);

  return (
    <div ref={host} className="absolute inset-0 overflow-hidden bg-[#050302]">
      {/* Poster before hydration and while the first clip buffers: the right crop for the screen. */}
      <picture>
        <source media="(max-aspect-ratio: 4/5)" srcSet="/film/p/c1.jpg" />
        <img src="/film/l/c1.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
      </picture>
      {orient
        ? CLIPS.map((c, i) => (
            <video
              key={c.id}
              ref={(el) => {
                vids.current[i] = el;
              }}
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
              style={{ opacity: 0, transformOrigin: "50% 50%" }}
              poster={i === 0 ? `/film/${orient}/${c.id}.jpg` : undefined}
              muted
              playsInline
              preload="none"
              disablePictureInPicture
              disableRemotePlayback
              onEnded={() => endClip(i)}
              onError={() => {
                if (i === 0 && !st.current.started) cb.current.onState("error");
              }}
              aria-hidden
              tabIndex={-1}
            />
          ))
        : null}
    </div>
  );
}
