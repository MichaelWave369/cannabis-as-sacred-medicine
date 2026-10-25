export const RESEARCH_BRIDGE_URL='https://michaelwave369.github.io/Cannabiverse/data/bridge/research-index-v2.json';
export const RESEARCH_BRIDGE_VIEWER='https://michaelwave369.github.io/Cannabiverse/app/bridge/';

const officialPrefix='/Cannabiverse/data/';
function sourceURL(path) {
  const url=new URL(path,RESEARCH_BRIDGE_URL);
  if(url.origin!==new URL(RESEARCH_BRIDGE_URL).origin || !url.pathname.startsWith(officialPrefix))
    throw new Error('Research source must remain inside Cannabiverse data');
  return url.href;
}
export function validateBridgeManifest(manifest) {
  if(!manifest || manifest.contract_version!=='2.0.0'||manifest.dataset_id!=='cannabiverse-research-bridge')
    throw new Error('Unknown research bridge contract');
  if(!manifest.sources || typeof manifest.sources.compounds!=='string' ||
    typeof manifest.sources.structures!=='string' ||
    typeof manifest.sources.chemistry_sources!=='string' ||
    !Array.isArray(manifest.domains)||manifest.domains.length<1 ||
    typeof manifest.relationship_semantics!=='string' || !/does not prove/i.test(manifest.relationship_semantics))
    throw new Error('Invalid research manifest');
  [manifest.sources.compounds,manifest.sources.structures,manifest.sources.chemistry_sources,
   ...manifest.domains.map(d=>d.evidence_url)].forEach(sourceURL);
  const domainIds=new Set();
  for(const d of manifest.domains) {
    if(!d.id||domainIds.has(d.id)||!d.expected_contract_version||!d.expected_dataset_id||!d.human_efficacy_warning)
      throw new Error('Invalid research domain');
    domainIds.add(d.id);
  }
  return manifest;
}
export function validateBridgeDataset(manifest, compounds,structures,chemicalSources,domains) {
  if(!Array.isArray(compounds)||compounds.length!==145||!Array.isArray(structures)||
      !Array.isArray(chemicalSources)||!Array.isArray(domains)||domains.length!==manifest.domains.length)
    throw new Error('Unexpected source data shape');
  const compoundIds=new Set(compounds.map(c=>c.atlas_id));
  const chemicalIds=new Set(chemicalSources.map(s=>s.source_id));
  if(compoundIds.size!==compounds.length || chemicalIds.size!==chemicalSources.length)
    throw new Error('Duplicate canonical IDs or chemistry sources');
  for(const c of compounds) {
    if(!/^CPA-CAN-\d{4}$/.test(c.atlas_id)||!chemicalIds.has(c.source_id)||
        typeof c.canonical_name!=='string'||!c.identity_claim_id||!c.occurrence_claim_id)
      throw new Error('Unverifiable chemical profile');
  }
  for(const s of structures)if(!compoundIds.has(s.atlas_id))throw new Error('Orphaned 3D structure');
  for(let i=0;i<domains.length;i++){
    const domain=domains[i],spec=manifest.domains[i];
    if(domain.contract_version!==spec.expected_contract_version||
       domain.dataset_id!==spec.expected_dataset_id ||
       !Array.isArray(domain.sources)||!Array.isArray(domain.claims))throw new Error('Incompatible domain feed');
    const sources=new Set(domain.sources.map(s=>s.id)),ids=new Set();
    for(const c of domain.claims){
      if(ids.has(c.id)||!c.id||!c.title||!c.model||!c.summary||!c.boundary||
          !Array.isArray(c.related_compounds)||!Array.isArray(c.source_ids)||!c.source_ids.length||
          !c.source_ids.every(id=>sources.has(id))||
          !c.related_compounds.every(m=>compoundIds.has(m.atlas_id)))
        throw new Error('Unverifiable scientific claim');
      ids.add(c.id);
    }
  }
  return {manifest,compounds,structures,chemicalSources,domains};
}
export async function fetchBridge(signal, fetcher=fetch) {
  async function read(url){
    const response=await fetcher(url,{cache:'no-cache',signal});
    if(!response.ok)throw new Error('Research source unavailable');
    return response.json();
  }
  const manifest=validateBridgeManifest(await read(RESEARCH_BRIDGE_URL));
  const parts=await Promise.all([
    read(sourceURL(manifest.sources.compounds)),
    read(sourceURL(manifest.sources.structures)),
    read(sourceURL(manifest.sources.chemistry_sources)),
    ...manifest.domains.map(d=>read(sourceURL(d.evidence_url)))
  ]);
  return validateBridgeDataset(manifest,parts[0],parts[1],parts[2],parts.slice(3));
}
export function claimsForCompound(data,id){
  return data.domains.flatMap((domain,i)=>domain.claims.filter(claim=>
    claim.related_compounds.some(ref=>ref.atlas_id===id)
  ).map(claim=>({...claim,domain_title:data.manifest.domains[i].title,domain_sources:domain.sources})));
}
