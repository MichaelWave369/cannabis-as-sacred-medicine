import assert from 'node:assert/strict';
import {validateBridgeManifest, validateBridgeDataset, claimsForCompound} from '../src/researchBridgeFeed.js';
const specs = [
  {id:'oncology', evidence_url:'../oncology/evidence-v1.json', expected_dataset_id:'cannabiverse-oncology-evidence',expected_contract_version:'1.0.0',human_efficacy_warning:'not established'},
  {id:'pain-ecs', evidence_url:'../pain-ecs/evidence-v1.json',expected_dataset_id:'cannabiverse-pain-ecs-evidence',expected_contract_version:'1.0.0',human_efficacy_warning:'not established'}
];
const manifest = {
  contract_version:'2.0.0', dataset_id:'cannabiverse-research-bridge',
  relationship_semantics:'A molecule link does not prove efficacy',
  sources:{compounds:'../evidence/compound_evidence_summary.json',structures:'../structures/structure_index.json',chemistry_sources:'../research/sources.json'},
  domains:specs
};
const compounds=Array.from({length:145},(_,i)=>({atlas_id:'CPA-CAN-'+String(i+1).padStart(4,'0'),canonical_name:'Compound '+(i+1),source_id:'CHEM',identity_claim_id:'I',occurrence_claim_id:'O'}));
const oncology={contract_version:'1.0.0',dataset_id:'cannabiverse-oncology-evidence',sources:[{id:'O'}],claims:[{id:'O-1',title:'Oncology',summary:'test',boundary:'not an efficacy claim',model:'cell',source_ids:['O'],related_compounds:[]}]};
const pain={contract_version:'1.0.0',dataset_id:'cannabiverse-pain-ecs-evidence',sources:[{id:'P'}],claims:[{id:'PAIN-1',title:'Combination product',summary:'small benefit',model:'adult trials',boundary:'formulation only',source_ids:['P'],related_compounds:[{atlas_id:'CPA-CAN-0001'},{atlas_id:'CPA-CAN-0047'}],link_scope:'combination_formulation_components_only',lane:'human_clinical_evidence',evidence_strength:'moderate',mechanism_steps:[]}]};
assert.equal(validateBridgeManifest(manifest),manifest);
const result=validateBridgeDataset(manifest,compounds,[],[{source_id:'CHEM'}],[oncology,pain]);
assert.equal(claimsForCompound(result,'CPA-CAN-0047')[0].link_scope,'combination_formulation_components_only');
assert.equal(claimsForCompound(result,'CPA-CAN-0003').length,0);
assert.throws(()=>validateBridgeDataset(manifest,compounds,[],[{source_id:'CHEM'}],[oncology,{...pain,claims:[{...pain.claims[0],related_compounds:[{atlas_id:'CPA-CAN-9999'}]}]}]));
assert.throws(()=>validateBridgeManifest({...manifest,domains:[...specs,specs[1]]}));
console.log('PASS Research Bridge pain domain integration and evidence-link boundaries');
