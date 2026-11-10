export function validateECSNetwork(feed) {
  if(!feed||feed.contract_version!=='1.0.0'||feed.dataset_id!=='cannabiverse-ecs-network-evidence'||!Array.isArray(feed.entities)||!Array.isArray(feed.relationships)||!Array.isArray(feed.claims)||!Array.isArray(feed.sources))throw new Error('Unsupported ECS evidence contract');
  const unique=(items,key)=>new Set(items.map(x=>x[key])).size===items.length;
  if(!unique(feed.entities,'id')||!unique(feed.sources,'id')||!unique(feed.claims,'id')||!unique(feed.relationships,'id'))throw new Error('Duplicate ECS record IDs');
  const entities=new Set(feed.entities.map(e=>e.id)),sources=new Set(feed.sources.map(s=>s.id)),claims=new Map(feed.claims.map(c=>[c.id,c]));
  if(!feed.entities.length||!feed.sources.length||!feed.claims.length||!feed.medical_boundary)throw new Error('Incomplete ECS evidence feed');
  for(const c of feed.claims){
    if(!c.title||!c.summary||!c.model||!c.boundary||!c.lane||!c.evidence_strength||!Array.isArray(c.source_ids)||!c.source_ids.length||!c.source_ids.every(id=>sources.has(id))||!Array.isArray(c.related_entities)||!c.related_entities.every(id=>entities.has(id)))throw new Error('Unverifiable ECS claim');
  }
  for(const e of feed.relationships){
    const c=claims.get(e.claim_id);
    if(!entities.has(e.from)||!entities.has(e.to)||!c||!c.related_entities.includes(e.from)||!c.related_entities.includes(e.to))throw new Error('Unreceipted ECS relationship');
  }
  return feed;
}
export function ecsClaimsForEntity(feed,id) {
  return feed.claims.filter(c=>!id||c.related_entities.includes(id));
}
