import assert from 'node:assert/strict';
import {validateECSNetwork,ecsClaimsForEntity} from '../src/ecsNetwork.js';
const base={
  contract_version:'1.0.0',dataset_id:'cannabiverse-ecs-network-evidence',medical_boundary:'No treatment claims',
  sources:[{id:'S',url:'https://example.org'}],
  entities:[{id:'AEA',kind:'endocannabinoid'},{id:'FAAH',kind:'enzyme'}],
  relationships:[{id:'R',from:'AEA',to:'FAAH',claim_id:'C',predicate:'metabolized_by'}],
  claims:[{id:'C',title:'Test',summary:'Review context',model:'cell',boundary:'Not human evidence',lane:'mechanistic_physiology',evidence_strength:'review',source_ids:['S'],related_entities:['AEA','FAAH'],related_compounds:[]}]
};
assert.equal(validateECSNetwork(base),base);
assert.equal(ecsClaimsForEntity(base,'AEA').length,1);
assert.equal(ecsClaimsForEntity(base,'missing').length,0);
assert.throws(()=>validateECSNetwork({...base,entities:[...base.entities,base.entities[0]]}),/Duplicate/);
assert.throws(()=>validateECSNetwork({...base,relationships:[{...base.relationships[0],to:'missing'}]}),/Unreceipted/);
assert.throws(()=>validateECSNetwork({...base,claims:[{...base.claims[0],source_ids:['missing']}]}),/Unverifiable/);
assert.throws(()=>validateECSNetwork({...base,contract_version:'2.0.0'}),/contract/);
console.log('PASS Sacred Medicine ECS network consumer: validation and fail-closed boundaries');
