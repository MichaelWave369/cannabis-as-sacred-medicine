# Ancient Cannabis & Archaeochemistry · Sacred Medicine consumer

This is a **site-only addition** to the public navigator. It does **not** amend the published Zenodo v1.0.1 paper, DOI, downloadable PDFs, existing testimony, or the canonical Cannabiverse chemistry atlas.

## Publisher and transport
- Scientific publisher: `MichaelWave369/Cannabiverse`, file `data/archaeology/evidence-v1.json`
- Versioned manifest: `data/bridge/research-index-v2.json`; **transport contract v2**, **content release v4**
- Consumer component: `src/ArchaeologyEvidence.jsx`
- Integration: `src/researchBridgeFeed.js` already validates domain and canonical compound references and loads new manifest domains without a transport change.

## Editorial boundaries
- The Tunnug 1 paper reports CBN-consistent and weaker possible THC signals in ancient hair. An independent forensic toxicologist challenges whether external exposure was excluded. Display both, with links.
- Jirzankal chemical residues and Pazyryk material artifacts are **not** equivalent measurements and not the same grave.
- Herodotus is ancient testimony, not modern chemical proof.
- Do not attribute smoking equipment in Pazyryk kurgan 2 to the Ice Maiden's burial.
- Do not infer cancer treatment, current safety, dosing, or clinical outcomes from burial evidence.
- No original media are copied into the project: links go to sources, respecting image and publication rights.

## Release order
1. Merge the Cannabiverse archaeology-provider PR after its validation workflow passes.
2. Merge this consumer PR after `npm run check:archaeology`, `npm run check:bridge`, and `npm run build` pass. If the provider is unavailable, this section fails closed and shows no unsourced cards.
3. Verify Pages navigation and source links. Original Zenodo PDFs remain unchanged.
