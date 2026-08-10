# IMPI Event Plan Generator (Phase 4 — all modules complete)

Offline, zero-cost browser tool that generates SASREA-aligned event compliance
documents as ready-to-edit Word (.docx) documents, from one shared
questionnaire:

- Safety Management Plan
- Security Management Plan
- Parking Management Plan
- Event Risk Assessment (full tagged hazard library + live 67-item
  classification scoring, Marathon / Sports / Exhibition-Festival)
- Traffic Management Plan (generic — not the EMPD-specific Ekurhuleni form)
- Emergency Evacuation Plan

## Before you deploy

Check `src/data/companyInfo.js` for correct contact details — already
pre-filled with IMPI's details, but worth a once-over. The official IMPI
master logo is already installed at `public/assets/impi-master-logo.png`.

## Local development

```
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Create a new GitHub repo (suggested name: `impi-event-plans`).
2. If you use a different repo name, update `base` in `vite.config.js` to
   match: `base: '/your-repo-name/'`.
3. Push this project to the repo's `main` branch (use github.dev or the
   GitHub web "Add file → Upload files" — but note the web uploader drops
   `.github/workflows/`, so create `deploy.yml` via github.dev or the "Create
   new file" button instead, same as the JOC Binder setup).
4. In the repo Settings → Pages, set Source to "GitHub Actions".
5. Push to `main` — GitHub Actions will build and deploy automatically.
6. Your app will be live at `https://<username>.github.io/impi-event-plans/`.

## How it works

- **New Event** starts a draft, saved automatically to the browser's
  IndexedDB (via Dexie) — fully offline, no backend, no subscription.
- Toggle **Safety Management Plan** / **Security Management Plan** — the
  questionnaire below adjusts to ask only what's needed, and shared
  questions (medical provider, JOC contact, assembly points, etc.) are asked
  once and used by both documents.
- **Generate Selected Documents** produces a separate .docx per toggled
  module, each carrying the IMPI master logo + your uploaded event logo on
  the cover, and the IMPI contact footer on every page.
- Drafts persist between sessions — close the browser, come back later, pick
  up where you left off.

## How it works

- **New Event** starts a draft, saved automatically to the browser's
  IndexedDB (via Dexie) — fully offline, no backend, no subscription.
- Toggle any combination of the six documents — the questionnaire below
  adjusts to ask only what's needed, and shared questions (medical provider,
  JOC contact, assembly points, etc.) are asked once and used by every
  document that needs them.
- **Generate Selected Documents** produces a separate .docx per toggled
  module, each carrying the IMPI master logo + your uploaded event logo on
  the cover, and the IMPI contact footer on every page.
- Drafts persist between sessions — close the browser, come back later, pick
  up where you left off.

## Not yet built

- EMPD-specific Traffic Management Plan (Ekurhuleni's own form) — the
  current Traffic Management Plan module is IMPI's generic in-house format,
  suitable for Tshwane / Joburg / Mogale / Cape Town submissions. Building
  the actual EMPD form requires the real template as a starting point.

## Architecture notes

- React + Vite, static build, GitHub Pages hosting — same stack as the Site
  Plan Designer and Digital Business Cards tools.
- Word generation via the `docx` npm library — documents are built
  programmatically in the browser (not template-filling), validated by
  rendering through LibreOffice and visually checking every module.
- All data stays in the browser (IndexedDB). Nothing is sent anywhere.
