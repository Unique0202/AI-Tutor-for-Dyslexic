# NeuroLearn — Redesign Plan

> A dyslexia-friendly learning platform for students ages 6–16.
> Built on research-backed principles: Structured Literacy, phoneme-first instruction, immediate feedback, zero shame mechanics.

---

## Research Foundation

| Finding | Source | Impact on Design |
|---|---|---|
| Dyslexia is neurobiological — not an intelligence issue | IDA / fMRI studies | No shame language, no penalty mechanics |
| Two deficit pathways: phonological AND visual attention span | Liu et al. 2022 | Need both sound-first AND visual clarity |
| Structured Literacy: explicit instruction + immediate feedback | IDA, 38+ US states mandate | Instruction screen before every game |
| 28-session phonics program cut risk from 88% → 8% | Frontiers in Education 2026 | Repetition and phoneme focus in games |
| 7 gamification elements that work: story, goals, levels, points, rewards, feedback, badges | LexiPal study | All 7 built into game system |
| Warm light backgrounds reduce visual stress | UX accessibility research | Light mode as default |
| No italic text — letters shift shape | Dyslexia UX standards | `font-style: normal` enforced globally |
| No justified text — creates "rivers" | Dyslexia UX standards | `text-align: left` enforced globally |
| Min 16px text, 1.7 line height, 68ch max line length | WCAG + dyslexia standards | CSS variables enforce these everywhere |

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 19 + React Router 7 | Already in place, solid |
| Build tool | **Vite** (replaces CRA) | 296ms builds vs 30s, no security debt |
| Styling | **Tailwind v4 + utility classes** | No separate CSS files, faster to build |
| Animation | **Framer Motion** | Page transitions, game feedback, celebrations |
| Fonts | Baloo 2 (headings) + Comic Neue (body) | Playful, readable, dyslexia-friendly |
| AI Tutor | **Claude API** (claude-haiku-4-5) via Express proxy | Real AI, key stays server-side |
| Icons | Lucide React | Consistent SVG, no emojis as icons |

### Design System
- **Style**: Claymorphism — soft 3D, rounded (20px cards, 14px buttons), thick borders (3px), clay shadows
- **Default theme**: Light mode (`#EEF2FF` cream background) — evidence-based for dyslexia
- **Dark mode**: Available as accessibility toggle
- **Primary**: `#4F46E5` indigo · **Success**: `#22C55E` green · **Text**: `#312E81` deep indigo

---

## Phase 0 — Foundation ✅ COMPLETE

**Goal:** Replace the broken CRA foundation with a fast, modern stack.

| Task | Status |
|---|---|
| Uninstall `react-scripts`, TensorFlow.js, axios | ✅ Done |
| Install Vite + `@vitejs/plugin-react` | ✅ Done |
| Install Tailwind v4 via `@tailwindcss/vite` | ✅ Done |
| Install `framer-motion`, `@anthropic-ai/sdk`, `concurrently` | ✅ Done |
| Create `vite.config.js` with dev proxy | ✅ Done |
| Create root `index.html` with Google Fonts | ✅ Done |
| Rename `src/index.js` → `src/main.jsx` | ✅ Done |
| Rename all component `.js` → `.jsx` (16 files) | ✅ Done |
| Delete 15+ junk files (App.tsx, home.js, styles.css dupes, etc.) | ✅ Done |
| Build Tailwind design system in `src/index.css` | ✅ Done |
| Update `src/App.jsx` with new routes + AnimatePresence | ✅ Done |
| Update `.gitignore` | ✅ Done |

**Result:** Build time 296ms. Bundle dropped from ~6MB → ~317KB. 7 vulnerabilities (vs 59 before).

---

## Phase 1 — Cleanup ✅ COMPLETE (merged into Phase 0)

**Goal:** Remove everything that doesn't belong.

**Removed from codebase:**
- `@tensorflow/tfjs` + `@tensorflow-models/qna` — 4MB bundle, never actually used
- `axios` — unused, native fetch is sufficient
- `react-scripts` — deprecated since 2022
- `src/home.js`, `src/main.js`, `src/main.tsx`, `src/App.tsx` — unused duplicates
- `src/App.css`, `src/profile.css` — unused CSS
- `src/logo.svg` — unused
- `src/components/LearningGame.js` — empty placeholder
- `src/styles/index.css` — duplicate
- `assets/` (root level) — legacy folder
- `public/index.html` — replaced by root `index.html`

---

## Phase 2 — Core Structure & Layout

**Goal:** Rebuild the navigation, routing, accessibility system, and layout foundation.

### 2a — AccessibilityContext (`src/contexts/AccessibilityContext.jsx`)
- Expand theme options: `light` (default) | `dark` | `high-contrast`
- Add font toggle: `default` | `opendyslexic`
- Add font size: `normal` | `large` | `xlarge`
- Add line spacing: `normal` | `wide`
- Apply CSS classes to `document.body` for each setting
- Persist all settings to `localStorage`

### 2b — Header (`src/components/Header.jsx`)
- 4 nav items only: **Home · Learn · Progress · Help**
- Min 48px touch targets on all links
- Desktop: logo left, nav right, accessibility icon always visible
- Mobile: bottom tab bar (no hamburger overlay)
- No italic text anywhere
- Smooth active state with Framer Motion underline

### 2c — AccessibilityMenu (`src/components/AccessibilityMenu.jsx`)
- Redesigned as a slide-out panel (Framer Motion)
- Controls: theme toggle, font toggle, font size, line spacing, TTS speed
- Every control has a clear label + icon

### 2d — Footer (`src/components/Footer.jsx`)
- Minimal: logo, 4 links, copyright
- No dense columns

### File changes
- `src/contexts/AccessibilityContext.jsx` — full rewrite
- `src/components/Header.jsx` — full rewrite
- `src/components/Footer.jsx` — simplified rewrite
- `src/components/AccessibilityMenu.jsx` — redesigned

---

## Phase 3 — Visual Design (The Beauty)

**Goal:** Apply the full claymorphism design system. Every screen feels warm, polished, and purposeful.

### 3a — Homepage (`src/pages/HomePage.jsx`)
Complete rebuild. Sections in order:
1. **Hero** — headline + subline + 2 CTAs + SVG illustration (no stock photos)
2. **How it works** — 3 numbered steps, icon-based, simple language
3. **Games showcase** — 4 clay cards, staggered animation on scroll
4. **Why it's different** — 3 feature pills: Sound-first · No penalties · Your pace
5. **Start CTA** — single green button, large

Remove: fake testimonials, dense text walls, Pexels images.

### 3b — Games/Learn Page (`src/pages/GamesPage.jsx`)
- URL: `/learn`
- Cleaner card grid (2 col mobile, 3 col desktop)
- Each card: icon, name, description, difficulty badge, "Play" CTA
- Search bar redesigned with clay style
- Category filters as pill buttons
- Staggered card entrance animation

### 3c — Game Detail (`src/pages/GameDetail.jsx`)
- Clean layout: game info left, big "Start Game" right
- Warm illustrated background, no dark overlay

### 3d — Profile/Progress (`src/pages/ProfilePage.jsx`)
- URL: `/progress`
- Stars instead of scores as primary metric
- Progress bars with Framer Motion fill animation
- Achievements grid with clay badge style
- Mock data clearly visible but styled beautifully

### 3e — FAQ (`src/components/FAQPage.jsx`)
- Accordion style, clay cards
- Large readable text, generous spacing

### Framer Motion animations
| Element | Animation |
|---|---|
| Page transitions | Fade + 8px slide up, 300ms |
| Game cards | Staggered fade-in, 80ms delay each |
| Correct answer | Scale bounce + green flash |
| Wrong answer | Gentle horizontal shake (no red flash) |
| Achievement unlock | Scale pop |
| Progress bar fill | Width tween, 600ms |
| Instruction screen | Slide in from right |
| Accessibility panel | Slide in from right |

### Rule: respect `prefers-reduced-motion`
All animations check `reducedMotion` from AccessibilityContext and skip if set.

---

## Phase 4 — Game Pedagogy Overhaul

**Goal:** Every game follows Structured Literacy. Sound-first. Explicit instruction. Immediate feedback. No shame.

### 4a — GameWrapper (`src/components/GameWrapper.jsx`)
Universal state machine used by all games:
```
INSTRUCTION → PLAYING → RESULT → (REPLAY | NEXT_LEVEL)
```

**INSTRUCTION screen:**
- Explicit rule explained in plain language
- Read-aloud button (auto-plays on load)
- Large text, generous spacing
- "I'm Ready" green CTA

**PLAYING:**
- Immediate feedback after every answer
- Correct: green glow + bounce animation + encouraging message
- Wrong: gentle shake + "Let's try again" — NO life lost, NO score penalty

**RESULT screen:**
- Stars (1–3) based on accuracy, NOT speed
- "Great job!" with specific praise ("You got 8 out of 10!")
- Replay or Next Level buttons

### 4b — LetterMaster (`src/games/LetterMaster.jsx`)
- **Remove** lives system entirely
- **Add** phoneme audio on every letter option (click to hear)
- Audio is PRIMARY signal, visual is secondary
- Remove score display during play — show stars at end only

### 4c — ReadingAdventure (`src/games/ReadingAdventure.jsx`)
- Add pre-reading instruction screen
- Word highlighting during TTS must be high-contrast
- "Read this word to me" button on every word
- Larger text size

### 4d — WordBuilder (`src/games/WordBuilder.jsx`)
- Audio pronunciation of target word auto-plays before building
- Each letter tile speaks its phoneme when clicked

### 4e — SpellQuest (`src/games/SpellQuest.jsx`)
- Audio plays automatically (not just on button click)
- Larger input field, no italic placeholder
- Hints more prominent

### 4f — WordSounds (NEW — `src/games/WordSounds.jsx`)
**Fills the biggest gap: pure phoneme awareness.**
- Play a sound (e.g., `/b/`) → pick which word starts with that sound
- Pure audio-first — no reading required at all
- 3 levels: initial sounds → ending sounds → middle sounds
- Added to games library at `/learn/word-sounds`

---

## Phase 5 — AI Tutor (Claude API)

**Goal:** Replace the fake keyword chatbot with real, age-appropriate AI.

### Architecture
```
React (port 3000)
    ↓ POST /api/chat
Express proxy (port 3001)
    ↓
Claude API (claude-haiku-4-5)
```

### Files
- **`server.js`** (root) — Express proxy, holds `ANTHROPIC_API_KEY`
- **`src/chatbotService.js`** — rewrite to call `/api/chat`
- **`src/pages/ChatbotPage.jsx`** — renamed "Learning Helper", remove TF imports

### System prompt
> "You are a friendly, encouraging learning helper for children with dyslexia aged 6–16.
> Keep responses to 2–3 sentences. Use simple words. Never make the student feel bad.
> Help with: reading tips, spelling strategies, how to use the games, encouragement.
> If asked something off-topic, gently redirect back to learning."

### Running dev
```bash
npm run dev   # starts both Vite (3000) and Express (3001) via concurrently
```

---

## File Map (final state)

```
E:\AI-Tutor-for-Dyslexic\
├── index.html                    ← Vite root entry, Google Fonts
├── vite.config.js                ← Vite + Tailwind + API proxy
├── server.js                     ← Express AI proxy (Phase 5)
├── package.json                  ← scripts: dev, start, build, server
├── .env                          ← ANTHROPIC_API_KEY (gitignored)
├── .gitignore                    ← updated
├── plan.md                       ← this file
├── public/
│   └── brain.png, favicon, logos
└── src/
    ├── main.jsx                  ← Vite entry point
    ├── App.jsx                   ← routes + AnimatePresence
    ├── index.css                 ← Tailwind + design tokens + clay components
    ├── contexts/
    │   └── AccessibilityContext.jsx
    ├── components/
    │   ├── Header.jsx
    │   ├── Footer.jsx
    │   ├── AccessibilityMenu.jsx
    │   ├── FAQPage.jsx
    │   ├── GameWrapper.jsx       ← NEW (Phase 4)
    │   ├── TextToSpeech.jsx
    │   └── SpeechToText.jsx
    ├── pages/
    │   ├── HomePage.jsx
    │   ├── GamesPage.jsx
    │   ├── GameDetail.jsx
    │   ├── ChatbotPage.jsx       ← renamed "Learning Helper"
    │   └── ProfilePage.jsx       ← renamed "Progress"
    ├── games/
    │   ├── ReadingAdventure.jsx
    │   ├── LetterMaster.jsx
    │   ├── WordBuilder.jsx
    │   ├── SpellQuest.jsx
    │   └── WordSounds.jsx        ← NEW (Phase 4)
    ├── chatbotService.js
    └── assets/
        ├── bot-icon.png
        ├── user-icon.png
        └── speaker-icon.png
```

---

## Dyslexia Design Rules (enforced everywhere)

| Rule | Implementation |
|---|---|
| No italic text | `em, i { font-style: normal }` in global CSS |
| No justified text | `text-align: left` globally |
| Min 18px body text | `html { font-size: 18px }` |
| Line height ≥ 1.75 | `body { line-height: 1.75 }` |
| Max line length 68ch | `p { max-width: 68ch }` |
| Min 48px touch targets | All buttons and nav links |
| Immediate feedback | After every game answer, no delay |
| No shame language | "Let's try again" — never "Wrong!" |
| No time pressure | No timers in any game |
| Sound as primary signal | Audio plays first, visual is secondary |
| Color not only indicator | Always icon + text alongside color |
| Alt text on all images | Required on all `<img>` tags |

---

## Progress Tracker

| Phase | Status | Description |
|---|---|---|
| Phase 0 | ✅ Complete | Vite + Tailwind + JSX migration |
| Phase 1 | ✅ Complete | Cleanup — junk files, dead deps |
| Phase 2 | ⏳ Next | Structure — nav, accessibility, layout |
| Phase 3 | 🔲 Pending | Visual — homepage, all pages, animations |
| Phase 4 | 🔲 Pending | Games — pedagogy, GameWrapper, WordSounds |
| Phase 5 | 🔲 Pending | AI Tutor — Claude API integration |
