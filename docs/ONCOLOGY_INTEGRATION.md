# Cannabiverse ↔ Sacred Medicine oncology bridge
A one-way, read-only publication contract. **Cannabiverse owns and versions the science.** Sacred Medicine reads a vetted public JSON artifact and presents an accessible, explicitly bounded interpretation.

## Links
- Data publisher: https://github.com/MichaelWave369/Cannabiverse/blob/main/data/oncology/evidence-v1.json
- Live feed: https://michaelwave369.github.io/Cannabiverse/data/oncology/evidence-v1.json
- Source explorer: https://michaelwave369.github.io/Cannabiverse/app/oncology/
- Consumer: https://michaelwave369.github.io/cannabis-as-sacred-medicine/#oncology

## Operational behavior
- React fetches on page visit and checks `dataset_id`, `contract_version`, claim/source structure and provenance links.
- No cookies, API keys, server process, or runtime GitHub access needed; hosted as ordinary GitHub Pages static JSON.
- Unknown or unavailable feed returns an honest unavailable state, **not fabricated scientific findings**.
- The schema contract is v1. Upstream breaking changes must ship under a new file and a reviewed downstream update.
- Cross-repo links are useful even before the source deployment but the live evidence cards appear only after Cannabiverse is deployed.
- `npm run check:oncology` verifies the consumer contract shape before build.

## Clinical and publishing boundaries
- Research on cell cultures and animals ≠ anticancer efficacy demonstrated in humans.
- A nine-person phase I pilot ≠ confirmation of clinical benefit.
- Licensed/specific supportive-care cannabinoid pharmaceuticals ≠ using cannabis to treat cancer.
- This integration is **not a new Zenodo release**. The Zenodo DOI and PDFs retain their original frozen version until a separate versioned publication is prepared and uploaded.
- Reconfirm mutable National Cancer Institute guidance before republishing any future literature review.
