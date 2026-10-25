import assert from 'node:assert/strict';
import {RESEARCH_BRIDGE_URL,validateBridgeManifest,validateBridgeDataset,claimsForCompound} from '../src/researchBridgeFeed.js';
const manifest={contract_version:'2.0.0',dataset_id:'cannabiverse-research-bridge',relationship_semantics:'A link does not prove efficacy',
 sources:{compounds:'../evidence/compound_evidence_summary.json',structures:'../structures/structure_index.json',chemistry_sources:'../research/sources.json'},
 domains:[{id:'oncology',evidence_url:'../oncology/evidence-v1.json',expected_contract_version:'1.0.0',expected_dataset_id:'cannabiverse-oncology-evidence',human_efficacy_warning:'not established'}]};
const chem={source_id:'CHEM',title:'Chemistry',url:'https://example.org'};
const compounds=Array.from({length:145},(_,i)=>({atlas_id:'CPA-CAN-'+String(i+1).padStart(4,'0'),canonical_name:'Compound '+i,identity_claim_id:'I',occurrence_claim_id:'O',source_id:'CHEM'}));
const domains=[{contract_version:'1.0.0',dataset_id:'cannabiverse-oncology-evidence',sources:[{id:'S'}],
 claims:[{id:'C',title:'Study context',summary:'Not efficacy',model:'cell',boundary:'Not in humans',source_ids:['S'],related_compounds:[{atlas_id:'CPA-CAN-0047'}]}]}];
assert.equal(validateBridgeManifest(manifest),manifest);
const data=validateBridgeDataset(manifest,compounds,[],[chem],domains);
assert.equal(claimsForCompound(data,'CPA-CAN-0047').length,1);
assert.equal(claimsForCompound(data,'CPA-CAN-0001').length,0);
assert.throws(()=>validateBridgeManifest({...manifest,contract_version:'3.0.0'}));
assert.throws(()=>validateBridgeManifest({...manifest,sources:{...manifest.sources,compounds:'https://example.org/evil.json'}}));
assert.throws(()=>validateBridgeDataset(manifest,compounds.slice(1),[],[chem],domains));
assert.throws(()=>validateBridgeDataset(manifest,compounds,[],[chem],[{...domains[0],claims:[{...domains[0].claims[0],related_compounds:[{atlas_id:'CPA-CAN-9999'}]}]}]));
assert.match(RESEARCH_BRIDGE_URL,/research-index-v2\.json$/);
console.log('PASS Sacred Medicine Research Bridge v2: validation, fail-closed, scoped links');
