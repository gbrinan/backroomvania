# BACKROOMVANIA playable prototype design

## 1. Reference and intent
Approved game direction: dark fantasy top-down 2D sprites; Evelyn's teal coat, burgundy scarf; amber lamps against flooded black-green museum rooms. Existing Higgsfield water concepts are atmospheric reference, not collision maps. The title uses the existing drowned corridor. Gameplay uses original code-drawn pixel sprites and tile rooms so traversal remains readable.

## 2. Tokens
Ink #0b1012, panel #121c1d, rim #52605b, parchment #e3d3ae, muted #a9b5ad, gold #d9b56d, teal #59beb0, danger #d66b70. Room stone ramps vary by culture. Serif display Georgia/Batang; body system Korean sans; numeric monospace. Spacing 4/8/12/16/24/32. Borders 1px, square corners; no card dashboard.

## 3. Geometry
960×640 canvas, integer pixel sprites, fit viewport preserving ratio. Slim top identity bar, objective and controls below canvas. Title artwork 16:9 crop with readable dark scrim. Native HTML dialogs, buttons and journal above game. On small screens touch movement/actions remain >=44px.

## 4. Motion
Movement 155 world pixels/s; dash with finite recharge and visible stamina. Weapon-specific attack timing. Enemy attacks have visible wind-up. Water ripples are slow; reduced-motion disables decorative ripples/shake. Hidden tabs pause simulation.

## 5. Primitives and states
Action button: idle/focus/pressed/disabled. Weapon slot: locked/available/selected. Progress bar: full/partial/empty plus label. Dialog: title/speaker/body/choice; pauses simulation. Status toast: transient readable text. Map: current/visited/locked. Runtime menu itself serves as primitive state harness.

## 6. Accessibility
Keyboard movement via WASD/arrows, E interact, J attack, Space dash, 1–3 weapons, M map, Esc pause. Pointer and touch buttons mirror actions. Visible focus. No color-only locks. Audio optional and never required. Canvas has adjacent objective/status text. Real-time spatial gameplay is not screen-reader playable; this is documented prototype scope.

## 7. Acceptance
Start -> ordinary archive tasks -> mirror -> Rhast -> Jack chase -> safe room. Six relics obtained from reachable wings; weapons distinct; death retries latest room checkpoint. HAster reveal distinct from Hastur; three Holmes stages and optional Watson true ending. Stable maps and safe hub. Browser resize, input blur, restart and ending tested.

## 8. Limits
First playable prototype, not the finished multi-hour game. Compact rooms, original provisional sprite animation, synthesized sounds, simplified cultural guardian designs; full art/level production and human difficulty feedback remain. No paid assets or external runtime dependencies.

## 9. Traversal and optional quest
User explicitly requests avoiding ordinary enemies while moving between stages and simple quests. Ordinary mobs patrol until within 220px, then chase; doors never require room clearance. Only a marked guardian locks its relic. Quest pickups require no combat. Billy asks for three transport records in Egypt, flooded Backrooms and China; turn-in improves revolver reload. Relic-enabled return shortcuts make the visited museum a connected loop. Quest status appears in the objective bar and journal.
