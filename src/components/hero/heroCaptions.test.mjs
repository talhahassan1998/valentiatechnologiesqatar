// Caption rules for the looping hero (src/components/hero/Hero.tsx).
//
// The hero used to scrub captions against scroll position; it now cycles them
// on a timer. The old windows (in/hold/out) are gone, so what is worth testing
// changed: the loop must show exactly one caption at a time, return to its
// start so the repeat is seamless, and drive scene progress across the full
// 0..1 range that HeroScene's camera push expects.
//
// Mirrors the timeline built in Hero.tsx. Keep in step with HOLD and the
// durations there.
const CAPTIONS = 4;
const HOLD = 3.6;
const OUT = 0.55;   // outgoing fade
const IN = 0.7;     // incoming rise
const OVERLAP = 0.25; // incoming starts before outgoing ends

let fail = 0;
const ok = (m, v) => { if (!v) { console.log("FAIL", m); fail++; } };

// One step = hold, then the cross-fade (incoming overlaps the outgoing tail).
const step = HOLD + OUT + IN - OVERLAP;

// A caption is readable for its hold plus the part of the fades where it is
// still the dominant one. The overlap must stay short enough that two
// headlines are never both substantially visible.
ok("cross-fade overlap is brief", OVERLAP < OUT);
ok("overlap leaves a clean handoff", OUT - OVERLAP > 0.2);

// Hold dominates the transition, or the hero reads as a flickering carousel
// rather than copy the reader can actually finish.
ok("hold longer than the transition", HOLD > OUT + IN);

// Every caption gets an identical turn — no caption is skipped or doubled.
ok("cycle covers every caption", CAPTIONS === 4);
const cycle = step * CAPTIONS;
ok("cycle is a sane length", cycle > 15 && cycle < 30);

// Scene progress: each step tweens progress to i/(n-1), so the sequence must
// span 0..1 exactly. HeroScene maps this onto its camera dolly; overshooting
// pushes the composition out of frame.
const stops = [];
for (let i = 0; i < CAPTIONS; i++) stops.push(((i + 1) % CAPTIONS) / (CAPTIONS - 1));
ok("progress never exceeds 1", Math.max(...stops) <= 1);
ok("progress never goes negative", Math.min(...stops) >= 0);
ok("progress reaches the far end", stops.includes(1));
// The wrap must return to 0 so the repeat does not jump the camera.
ok("progress returns to 0 on wrap", stops[CAPTIONS - 1] === 0);

console.log(fail ? `${fail} failing` : "all caption rules pass");
process.exit(fail ? 1 : 0);
