---
title: "KeyVault: A Minimalist Desktop API Key Manager"
date: 2026-04-27
---

# KeyVault: A Minimalist Desktop API Key Manager

Every developer collects API keys — OpenAI, GitHub, SiliconFlow, Volcengine. They end up in `.env` files, scattered across projects, copy-pasted in chat windows. KeyVault is a desktop tool that gives you a single, secure, visually refined home for all of them. Post-it-note sized. Windows 11 native. No cloud dependency.

## The Problem

API keys are the modern developer's loose change. They're everywhere and nowhere at once:

| Pain Point | The Reality |
|------------|-------------|
| **Scattered** | Keys live in `.env`, `.bashrc`, `~/.config`, random text files |
| **Insecure** | Plaintext files with no access control |
| **Invisible** | You forget what keys you have until a service stops working |
| **Friction** | Every new project means re-finding and re-copying keys |

KeyVault solves this with a single compact window. All keys, one place, one click to copy.

## What It Does

| Feature | How It Works |
|---------|--------------|
| **Secure display** | Keys hidden by default, one-click show/hide toggle |
| **Quick copy** | Click any key → copied to clipboard instantly |
| **Local only** | All data stored on disk, never leaves your machine |
| **3 visual modes** | Mica (Win11 native), Glass (blur), Acrylic (dynamic gradient) |
| **Theme auto-switch** | Light/dark follows system preference |
| **Compact footprint** | 380×520px — sits in the corner like a sticky note |

## Visual Design: Three Glass Effects

The app doesn't just store keys. It looks good doing it. Three rendering modes for different tastes:

| Mode | Style | Best For |
|------|-------|----------|
| **Mica** | Windows 11 native frosted glass, adapts to wallpaper | Daily driver, system integration |
| **Glass** | Classic glassmorphism — heavy blur, gradient halos | Visual flair, dark mode setups |
| **Acrylic** | Dynamic gradient with soft transparency | Lighter, more fluid feel |

All three effects use CSS variables for accent colors — easy to customize.

> **Design principle**: A tool you use 20 times a day should be pleasant to look at. Ugly tools get abandoned.

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Runtime** | Electron 28 | Cross-platform desktop, Windows native APIs |
| **UI** | React | Component state for key management, fast re-renders |
| **Styling** | CSS3 | Glass effects, animations, theme transitions |
| **Storage** | electron-store v7 | Persistent local JSON, CJS-compatible |
| **Platform** | Windows 11 Mica API | Native material effects |

The entire app is a single React component (`app.jsx`) with a focused stylesheet (`styles.css`). No state management library. No router. Just what's needed.

## Architecture

```
┌──────────────────────────────────┐
│  main.js (Electron main process) │
│  ┌────────────────────────────┐  │
│  │  index.html (entry)        │  │
│  │  ┌──────────────────────┐  │  │
│  │  │  app.jsx (React)     │  │  │
│  │  │  - Key list state    │  │  │
│  │  │  - Add/edit/delete   │  │  │
│  │  │  - Visual mode       │  │  │
│  │  │  - Theme switch      │  │  │
│  │  └──────────────────────┘  │  │
│  │  styles.css                │  │
│  │  - Glass/Mica/Acrylic      │  │
│  │  - Theme variables         │  │
│  │  - Animations              │  │
│  └────────────────────────────┘  │
│  preload.js (IPC bridge)         │
│  electron-store (persistence)    │
└──────────────────────────────────┘
```

## Development Journey

### v1.0 — Initial Release (April 24, 2026)

The first version shipped with core key management: add, view, copy, delete. Three visual effects, theme switching, and local persistence via React state. Packaged as a 76MB portable `.exe` for Windows.

### v1.0.1 — Stability (April 26, 2026)

The first bug-fix release addressed real-world issues:

| Fix | What Was Wrong |
|-----|----------------|
| Settings menu crash | Menu failed to open in packaged builds |
| Fake key cleanup | New users saw example data on first launch |
| saveKeys parameter order | Wrong argument order broke persistence |
| CSS variable typo | Misspelled variable name caused visual glitches |
| electron-store crash | ESM/CJS mismatch in v8 → downgraded to v7 |

> **Lesson**: Electron packaging surfaces bugs that never appear in dev mode. Test the built artifact, not just `npm start`.

### What's Next

| Priority | Feature | Status |
|----------|---------|--------|
| P0 | Key group management | In progress |
| P0 | Import/export (JSON, CSV) | In progress |
| P1 | Cloud sync (GitHub Gist, WebDAV) | Planned |
| P1 | Global keyboard shortcuts | In progress |
| P2 | Master password protection | Planned |
| P2 | Auto-lock on idle | Planned |
| P2 | Key expiration reminders | Planned |

## Why Local-First

KeyVault intentionally avoids cloud storage as the default. The data is yours, on your disk, in a format you can inspect. Cloud sync is planned as an opt-in feature — GitHub Gist for developers who want backup, WebDAV for self-hosted sync.

This is the opposite of "upload everything to our servers." It's the old-school desktop app philosophy: the app works for you, not the other way around.

## Get It

```bash
git clone https://github.com/HXS482/key-vault.git
cd key-vault
npm install
npm start
```

Or download the portable `.exe` from [Releases](https://github.com/HXS482/key-vault/releases).

---

> *"Your keys, your machine, your control."*

[github.com/HXS482/key-vault](https://github.com/HXS482/key-vault)
