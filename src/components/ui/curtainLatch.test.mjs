// Curtain handoff ordering (src/components/ui/Preloader.tsx).
//
// CURTAIN_UP is a one-shot window event, but its two consumers — Hero and the
// lazy-loaded HeroScene — can subscribe *after* it fires: the Three.js chunk
// is ~275KB and on a cold first load it can still be in flight when the
// curtain's fixed ~3.15s timeline finishes. A plain event dispatched into an
// empty room left the scene frozen at its pre-entrance pose (scale 0.45,
// -2.4rad, camera at z=11.5) for the life of the page.
//
// The fix is a latch: announce() sets a flag, and late subscribers read it.
// This models that handoff. Mirrors the announce/curtainIsUp pair.

let fail = 0;
const ok = (m, v) => { if (!v) { console.log("FAIL", m); fail++; } };

// Minimal stand-in for the module's latch + event pair.
function makeCurtain() {
  const listeners = [];
  let up = false;
  return {
    isUp: () => up,
    announce() {
      if (up) return false;          // idempotent: bail timer + onComplete both call it
      up = true;
      listeners.splice(0).forEach((f) => f());
      return true;
    },
    // A consumer subscribing at some point in time, latch checked first.
    subscribe(onUp) {
      if (up) { onUp(); return; }
      listeners.push(onUp);
    },
  };
}

// Early subscriber: warm cache, chunk already parsed. Classic path.
{
  const c = makeCurtain();
  let started = false;
  c.subscribe(() => { started = true; });
  ok("early subscriber waits for the curtain", !started);
  c.announce();
  ok("early subscriber starts when curtain lifts", started);
}

// Late subscriber: cold load, chunk lands after the curtain is gone.
// This is the regression — without the latch, started stays false forever.
{
  const c = makeCurtain();
  c.announce();
  let started = false;
  c.subscribe(() => { started = true; });
  ok("late subscriber starts immediately from the latch", started);
}

// Both consumers, mounting on opposite sides of the curtain.
{
  const c = makeCurtain();
  let hero = false, scene = false;
  c.subscribe(() => { hero = true; });   // Hero is eager, mounts early
  c.announce();
  c.subscribe(() => { scene = true; });  // HeroScene is lazy, mounts late
  ok("hero entrance ran", hero);
  ok("scene intro ran despite mounting after the curtain", scene);
}

// announce() is called by both the timeline's onComplete and the 5s bail
// timeout; the second must not re-fire listeners.
{
  const c = makeCurtain();
  let count = 0;
  c.subscribe(() => { count++; });
  ok("first announce fires", c.announce() === true);
  ok("second announce is a no-op", c.announce() === false);
  ok("listener ran exactly once", count === 1);
  ok("latch stays up", c.isUp());
}

console.log(fail ? `${fail} failed` : "curtain latch ok");
process.exit(fail ? 1 : 0);
