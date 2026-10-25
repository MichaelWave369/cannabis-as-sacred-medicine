import assert from 'node:assert/strict';
import { CANNABIVERSE_ONCOLOGY_URL, validateOncologyFeed } from '../src/oncologyFeed.js';
const source={id:'ONC-SRC-TEST',title:'Test',url:'https://example.org/source'};
const claim={id:'ONC-CLM-TEST',title:'Model',summary:'Preclinical test summary',
  boundary:'Not clinical efficacy',model:'Cell culture',lane:'preclinical_mechanism',
  source_ids:['ONC-SRC-TEST'],mechanism_steps:[],related_compounds:[]};
const valid={contract_version:'1.0.0',dataset_id:'cannabiverse-oncology-evidence',
  medical_boundary:'Cannabinoids are not an established treatment',sources:[source],claims:[claim]};
assert.equal(validateOncologyFeed(valid),valid);
assert.throws(()=>validateOncologyFeed({...valid,contract_version:'2.0.0'}));
assert.throws(()=>validateOncologyFeed({...valid,sources:[]}));
assert.throws(()=>validateOncologyFeed({...valid,claims:[{...claim,source_ids:['unknown']}]}));
assert.throws(()=>validateOncologyFeed({...valid,claims:[claim,claim]}));
assert.match(CANNABIVERSE_ONCOLOGY_URL,/Cannabiverse\/data\/oncology\/evidence-v1\.json$/);
console.log('Sacred Medicine oncology feed-contract tests PASS');
