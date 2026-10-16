# DevPulse AI — motion specification

Status: Phase 1 motion implemented with the existing `framer-motion`. Future job/finding/diff transitions below remain specifications.

## Actual Phase 1 behavior

`motion.tsx` exports shared duration/easing/spring/stagger tokens and a once-per-mount `Reveal`. Landing sections reveal on viewport entry; route transitions use 200 ms opacity/5 px translation. Module and edge emphasis uses bounded CSS transitions. Graph fit/zoom uses 220 ms, or 0 with reduced motion. No continuous simulation, animation loops or custom animation-frame listeners.

MotionConfig, useReducedMotion and a scoped CSS media query respect reduced motion. Native module lists and relationship links expose the same information without the diagram. Route focus moves to the main landmark immediately; navigation is never held until a reveal ends. Native disclosure navigation does not trap focus; Escape closes it and restores focus to its trigger.

Reserve a full viewport of main content during lazy loading. Lab testing found CLS 0.246 before this adjustment and approximately 0.014 afterwards. Screenshots must scroll through reveal sections before capturing the whole landing; offscreen content is intentionally not yet revealed. Browser checks exercise reduced-motion mode and keyboard navigation. Full animation frame-rate profiling and assistive-technology review remain unclaimed.

## Principles

Motion explains selection, hierarchy, causality and actual work. The visual signature is an evidence path appearing between a selected module and its source, then settling. The interface must remain understandable with animation disabled. No endless ambient movement, pointer-following glow or decorative live ticker.

| Interaction | Duration / behavior | Reduced motion |
| --- | --- | --- |
| Button hover/focus | 100–140 ms color/opacity, no layout shift | immediate state |
| Route content | 180–220 ms opacity and at most 6 px translation | immediate, preserve focus |
| Inspector open/close | 180–240 ms contained transform/opacity | immediate panel |
| Finding disclosure | 160–200 ms bounded expansion; no giant list reflow | immediate disclosure |
| Selected graph relationship | 220–360 ms one-shot emphasis; settle afterwards | static high-contrast edge |
| Hero graph entrance | <=600 ms once; stagger <=30 ms, total <=800 ms | static complete graph |
| Job stage change | 160 ms actual state transition, accessible text | same status without movement |
| Tool invocation pending | compact progress indicator only while pending | static pending text |
| Finding-to-diff navigation | 180–240 ms shared evidence identity, no whole-page morph | direct navigation |

Use a restrained ease-out curve around `(0.2, 0.8, 0.2, 1)`. Avoid elastic motion for code/table surfaces. Frequent animations use transforms and opacity; finite height transitions only for small disclosure regions and after profiling. Never animate the full dependency graph on every pointer movement.

## Lifecycle and accessibility

Use Motion reduced-motion support and scoped CSS media queries. Disable entrance/edge animations when preference changes at runtime. Stop scheduled work on unmount, route change, document hidden or offscreen graph; remove listeners/observers and cancel animation frames. StrictMode double mount must not duplicate timers or subscriptions. No requestAnimationFrame loop unless measured interaction needs it.

Live stage labels use a polite status region; do not announce every streaming token or graph hover. Route focus waits only for mount, not for decorative animation. Selected state is semantic and visible even if a transition is interrupted. Never delay button actions until an animation completes.

## Validation

Phase 1: keyboard and pointer select a sample node, rapidly switch nodes, open/close evidence, back/forward navigation, reduced motion and hidden-tab behavior. Confirm no stale updates after unmount and no layout shifts from entrances. Record a browser performance trace for graph interactions; target no animation-caused tasks above 50 ms on documented test hardware. Initial sample graph <=20 nodes, expanded graph later defaults to bounded neighborhoods (around 150 visible nodes), with list mode and aggregation. Large-repository benchmarks belong to Phase 3/9.

No endless fake processing. In sample mode show static provenance, never an animated timeline implying a current backend execution.
