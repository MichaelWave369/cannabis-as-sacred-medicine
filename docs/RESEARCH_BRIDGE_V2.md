# Shared Φ Research Bridge v2
Sacred Medicine is a **read-only client** of the [Cannabiverse v2 source manifest](https://michaelwave369.github.io/Cannabiverse/data/bridge/research-index-v2.json).

- Chemistry source of truth: Cannabiverse canonical compound evidence summary + its chemistry references.
- Clinical study claims: independent, versioned oncology evidence v1 with bounded claims and source receipts.
- 3D: Cannabiverse's published structure-index entries only. A link is shown only if a governed conformer exists.
- Browsers access static GitHub Pages URLs without keys or subscriptions.
- URL `?compound=CPA-CAN-0047#research-bridge` deep-links a canonical identity. The back link uses `app/bridge/?id=...`.
- The manifest is an index of data feeds, not a second editable medical ledger.

A source-linked mention does not imply positive clinical efficacy, universal receptor activity, safety, or dosing. Absence of a domain link does not imply the compound has not been studied. Missing, incompatible, duplicated or unresolvable source data fails closed rather than showing fake claims.

Testing: `npm run check:bridge` plus the existing `npm run check:oncology` and `npm run build`. No published Zenodo/PDF change is included.
