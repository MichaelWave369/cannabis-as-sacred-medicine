# Cannabis as Sacred Medicine

**Evidence-informed public education, policy, and testimony project on cannabis as sacred medicine, claim discipline, dignity repair, and harm reduction.**

Author: **Michael W. Hughes — Parallax / PHI369 Labs**  
Status: **v1.0.1 Public Release**

This repository hosts the public-facing React navigator and release materials for *Cannabis as Sacred Medicine: Healing the Body, Restoring Dignity, and Transmuting Pain into Joy*.

> Core thesis: **Cannabis is sacred medicine when it helps a person return to breath, dignity, responsibility, joy, love — and when that return becomes care for others.**

## What this project is

This is an **evidence-informed public education, policy, and testimony project**. It is designed to make the full paper easier to explore online while preserving the paper's core discipline: clinical evidence stays clinical, ritual history stays historical, contested interpretation stays contested, ecology stays ecological/symbolic, and lived testimony stays testimony.

## What this project is not

This project is **not** medical advice, legal advice, spiritual direction, a clinical trial, a systematic review, a dosing protocol, a treatment guideline, or a theological proof.

## Repository contents

```text
app / source files live at the repository root for GitHub Pages deployment
src/App.jsx             Interactive React navigator
src/main.jsx            React entry point
src/index.css           Tailwind styles and accessibility polish
public/papers/          Drop release PDFs here before deployment
public/images/          Drop visual assets here before deployment
docs/                   Claim boundaries and launch notes
```

## Local development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

The included GitHub Pages workflow builds the Vite app and deploys `dist/`.

Expected public URL after Pages is enabled:

```text
https://michaelwave369.github.io/cannabis-as-sacred-medicine/
```

In GitHub, go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Asset upload checklist

Before official launch, place the v1.0.1 PDFs and images into:

```text
public/papers/
public/images/
```

Expected filenames are listed in `public/papers/README.md` and `public/images/README.md`.

## License

- **Code:** MIT License. See `LICENSE`.
- **Written materials, PDFs, testimony language, diagrams, and visual assets:** Creative Commons BY-NC-SA 4.0 unless otherwise noted. See `LICENSE-CONTENT-CC-BY-NC-SA-4.0.md`.
- Personal testimony remains attributed to Michael W. Hughes — Parallax / PHI369 Labs and may not be used to imply endorsement of any product, brand, organization, campaign, or medical recommendation.

## Citation

See `CITATION.cff`.

## Claim boundary

The power of this project is that it argues for reverence **without pretending reverence is evidence**. See `docs/CLAIM_BOUNDARIES.md`.
