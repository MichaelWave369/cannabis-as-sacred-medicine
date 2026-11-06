import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateBridgeManifest,validateBridgeDataset,claimsForCompound} from '../src/researchBridgeFeed.js';
const base={contract_version:'2.0.0',dataset_id:'cannabiverse-research-bridge',relationship_semantics:'References do not prove efficacy',sources:{compounds:'../evidence/compound_evidence_summary.json',structures:'../structures/structure_index.json',chemistry_sources:'../research/sources.json'}};
const specs=[
 {id:'oncology',title:'Oncology',evidence_url:'../oncology/evidence-v1.json',expected_dataset_id:'cannabiverse-oncology-evidence',expected_contract_version:'1.0.0',human_efficacy_warning:'Anticancer efficacy not established'},
 {id:'pain-ecs',title:'Pain',evidence_url:'../pain-ecs/evidence-v1.json',expected_dataset_id:'cannabiverse-pain-ecs-evidence',expected_contract_version:'1.0.0',human_efficacy_warning:'Unstudied products not established'},
 {id:'archaeology',title:'Ancient archaeology',evidence_url:'../archaeology/evidence-v1.json',expected_dataset_id:'cannabiverse-archaeology-evidence',expected_contract_version:'1.0.0',human_efficacy_warning:'Historical use not established as clinical efficacy'}
];
const manifest=validateBridgeManifest({...base,domains:specs});
const molecules=Array.from({length:145},(_,i)=>({atlas_id:'CPA-CAN-'+String(i+1).padStart(4,'0'),canonical_name:'Compound '+i,source_id:'CHEM-1',identity_claim_id:'I',occurrence_claim_id:'O'}));
const claim=(id,related_compounds,source_ids)=>({id,title:id,summary:'Bounded source context',model:'Archaeological material',boundary:'Not medical efficacy or human intoxication proof',source_ids,related_compounds});
const standard=(id,source)=>({contract_version:'1.0.0',dataset_id:id,sources:[{id:source}],claims:[claim('DUMMY-'+source,[],[source])]});
const archaeology={...standard('cannabiverse-archaeology-evidence','ARCH-SRC'),sites:[{id:'ARCH-SITE-TUNNUG1'}],claims:[claim('ARCH-CLM-002',[{atlas_id:'CPA-CAN-0076',name:'CBN'}],['ARCH-SRC']),claim('ARCH-CLM-003',[],['ARCH-SRC'])]};
const d=validateBridgeDataset(manifest,molecules,[],[{source_id:'CHEM-1'}],[standard(specs[0].expected_dataset_id,'ONC'),standard(specs[1].expected_dataset_id,'PAIN'),archaeology]);
const matches=claimsForCompound(d,'CPA-CAN-0076');
assert.equal(matches.length,1);
assert.equal(matches[0].domain_title,'Ancient archaeology');
assert.equal(claimsForCompound(d,'CPA-CAN-0047').length,0);
assert.throws(()=>validateBridgeDataset(manifest,molecules,[],[{source_id:'CHEM-1'}],[standard(specs[0].expected_dataset_id,'ONC'),standard(specs[1].expected_dataset_id,'PAIN'),{...archaeology,claims:[claim('BAD',[{atlas_id:'CPA-CAN-9999'}],['ARCH-SRC'])]}]));
const app=readFileSync(new URL('../src/App.jsx',import.meta.url),'utf8');
assert.match(app,/id.*archaeology|\['archaeology', 'Ancient Cannabis'\]/);
assert.match(app,/<ArchaeologyEvidence \/>/);
const component=readFileSync(new URL('../src/ArchaeologyEvidence.jsx',import.meta.url),'utf8');
assert.match(component,/feed\.sites/);
assert.match(component,/source_ids/);
assert.match(component,/status==='unavailable'/);
console.log('PASS archaeology consumer: v2 manifest, third domain, canonical CBN context, navigation, fail-closed source rendering');
