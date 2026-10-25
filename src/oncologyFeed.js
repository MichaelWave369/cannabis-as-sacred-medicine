export const CANNABIVERSE_ONCOLOGY_URL = 'https://michaelwave369.github.io/Cannabiverse/data/oncology/evidence-v1.json';
export const CANNABIVERSE_ONCOLOGY_EXPLORER = 'https://michaelwave369.github.io/Cannabiverse/app/oncology/';

// Reject incompatible upstream releases: fail closed instead of silently presenting
// stronger or changed health claims through an unreviewed data shape.
export function validateOncologyFeed(feed) {
  if (!feed || feed.contract_version !== '1.0.0' || feed.dataset_id !== 'cannabiverse-oncology-evidence') {
    throw new Error('Incompatible Cannabiverse oncology feed');
  }
  if (!Array.isArray(feed.sources) || !feed.sources.length || !Array.isArray(feed.claims) || !feed.claims.length ||
      typeof feed.medical_boundary !== 'string' || !feed.medical_boundary) {
    throw new Error('Missing upstream oncology evidence');
  }
  const sourceIds = new Set();
  for (const source of feed.sources) {
    if (typeof source.id !== 'string' || sourceIds.has(source.id) ||
        typeof source.title !== 'string' || !/^https:\/\//.test(source.url)) {
      throw new Error('Invalid source receipt');
    }
    sourceIds.add(source.id);
  }
  const claimIds = new Set();
  for (const claim of feed.claims) {
    if (typeof claim.id !== 'string' || claimIds.has(claim.id) ||
        typeof claim.title !== 'string' || typeof claim.summary !== 'string' ||
        typeof claim.boundary !== 'string' || !claim.boundary ||
        typeof claim.lane !== 'string' || typeof claim.model !== 'string' ||
        !Array.isArray(claim.mechanism_steps) || !Array.isArray(claim.related_compounds) ||
        !Array.isArray(claim.source_ids) || !claim.source_ids.length ||
        !claim.source_ids.every((id) => sourceIds.has(id))) {
      throw new Error('Unverifiable or duplicate oncology claim');
    }
    claimIds.add(claim.id);
  }
  return feed;
}
