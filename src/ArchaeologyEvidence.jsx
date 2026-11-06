import React, {useEffect, useMemo, useState} from 'react';
import {fetchBridge, RESEARCH_BRIDGE_VIEWER} from './researchBridgeFeed.js';

const labels = {
  dated_botanical_material: 'Dated plant material',
  analytical_biomarker_signal: 'Chemical biomarker',
  contested_interpretation: 'Scientific disagreement',
  contextual_inference: 'Contextual inference',
  archaeological_context: 'Excavated artifacts',
  historical_text: 'Ancient testimony',
  interpretive_boundary: 'Claim boundary',
};
const sourceClass='font-semibold text-emerald-900 underline decoration-amber-500 underline-offset-4';

export default function ArchaeologyEvidence() {
  const [record,setRecord]=useState(null);
  const [status,setStatus]=useState('loading');
  const [site,setSite]=useState('all');
  const [lane,setLane]=useState('all');
  useEffect(()=>{
    const controller=new AbortController();
    fetchBridge(controller.signal).then(data=>{
      if(controller.signal.aborted)return;
      const i=data.manifest.domains.findIndex(d=>d.id==='archaeology');
      if(i<0 || !Array.isArray(data.domains[i]?.sites))throw new Error('Archaeology feed unavailable');
      const feed=data.domains[i],spec=data.manifest.domains[i];
      if(feed.dataset_id!=='cannabiverse-archaeology-evidence' || feed.contract_version!=='1.0.0')
        throw new Error('Unknown archaeology contract');
      if(!feed.claims.every(c=>feed.sites.some(s=>s.id===c.site_id)&&c.method&&c.evidence_strength&&c.lane))
        throw new Error('Unbounded archaeology claim');
      setRecord({feed,spec});setStatus('ready');
    }).catch(()=>{if(!controller.signal.aborted){setStatus('unavailable');setRecord(null)}});
    return ()=>controller.abort();
  },[]);
  const claims=useMemo(()=>record?.feed.claims.filter(c=>(site==='all'||c.site_id===site)&&(lane==='all'||c.lane===lane))??[],[record,site,lane]);
  const bySite=useMemo(()=>new Map(record?.feed.sites.map(s=>[s.id,s])??[]),[record]);
  const bySource=useMemo(()=>new Map(record?.feed.sources.map(s=>[s.id,s])??[]),[record]);
  const lanes=useMemo(()=>[...new Set(record?.feed.claims.map(c=>c.lane)??[])],[record]);
  return <section id="archaeology" className="mx-auto max-w-7xl scroll-mt-32 px-4 py-10 md:px-6" aria-labelledby="archaeology-title">
    <p className="text-sm font-bold uppercase tracking-widest text-amber-800">Φ Research Bridge · Historical evidence v4</p>
    <h2 id="archaeology-title" className="mt-2 text-3xl font-black tracking-tight text-emerald-950 md:text-4xl">Ancient Cannabis & Archaeochemistry</h2>
    <p className="mt-3 max-w-4xl leading-7 text-stone-700">Explore site-specific burial artifacts, radiocarbon dates, measured chemical traces, historical accounts and competing interpretations. Cannabiverse owns every scientific record; this educational navigator reads the published source feed.</p>
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <h3 className="font-bold text-emerald-950">What is physically evidenced</h3>
        <p className="mt-2 text-sm leading-7 text-stone-700">The early eighth-century BCE Tunnug 1 tomb yielded directly dated cannabis seeds and reported hair biomarkers. Jirzankal braziers yielded cannabinoid residues around 500 BCE. Pazyryk funerary implements have a different evidence history.</p>
      </div>
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
        <h3 className="font-bold text-amber-950">What cannot be concluded</h3>
        <p className="mt-2 text-sm leading-7 text-stone-800">The Tunnug 1 hair interpretation is disputed. CBN does not establish original THC potency, dose or impairment. Artifacts from a Pazyryk tomb do not show the Ice Maiden was treated for cancer. Ancient ritual use is not evidence of modern clinical efficacy.</p>
      </div>
    </div>
    <div className="mt-4 flex flex-wrap gap-4 text-sm">
      <a className={sourceClass} href="https://michaelwave369.github.io/Cannabiverse/app/archaeology/" target="_blank" rel="noopener noreferrer">Open Cannabiverse Archaeology Explorer</a>
      <a className={sourceClass} href="https://doi.org/10.1126/science.aeg3800" target="_blank" rel="noopener noreferrer">Tunnug 1 primary paper (2026)</a>
      <a className={sourceClass} href="https://doi.org/10.1126/sciadv.aaw1391" target="_blank" rel="noopener noreferrer">Jirzankal primary paper (2019)</a>
    </div>
    {status==='loading'&&<p className="mt-6 text-sm text-stone-700" role="status">Verifying the archaeological source ledger…</p>}
    {status==='unavailable'&&<p className="mt-6 rounded-xl border border-amber-200 bg-white p-5 text-sm text-stone-700" role="status">The versioned archaeology feed is not available or compatible. No unverified evidence cards are displayed. The published paper remains unchanged.</p>}
    {status==='ready'&&record&&<>
      <div className="mt-7 flex flex-wrap items-end gap-4">
        <p className="w-full text-xs font-bold uppercase tracking-wider text-emerald-900" role="status">{record.feed.claims.length} bounded claims · {record.feed.sources.length} sources · curated {record.feed.release_date}</p>
        <label htmlFor="arch-site" className="text-sm font-semibold text-emerald-950">Context
          <select id="arch-site" value={site} onChange={e=>setSite(e.target.value)} className="ml-2 max-w-[260px] rounded-xl border border-amber-200 bg-white px-3 py-2">
            <option value="all">All contexts</option>
            {record.feed.sites.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label htmlFor="arch-lane" className="text-sm font-semibold text-emerald-950">Evidence lane
          <select id="arch-lane" value={lane} onChange={e=>setLane(e.target.value)} className="ml-2 max-w-[260px] rounded-xl border border-amber-200 bg-white px-3 py-2">
            <option value="all">All evidence types</option>
            {lanes.map(l=><option key={l} value={l}>{labels[l]||l}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{claims.map(c=><article key={c.id} className="rounded-2xl border border-amber-200 bg-white/90 p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-800">{labels[c.lane]||c.lane} · {c.evidence_strength.replaceAll('_',' ')}</p>
        <h3 className="mt-2 text-xl font-bold text-emerald-950">{c.title}</h3>
        <p className="mt-2 text-xs text-stone-600">{bySite.get(c.site_id)?.name} · {bySite.get(c.site_id)?.period}</p>
        <p className="mt-3 text-sm leading-6 text-stone-700">{c.summary}</p>
        <p className="mt-2 text-xs text-stone-600">Method: {c.method}. Context: {c.model}.</p>
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950"><strong>Evidence limit:</strong> {c.boundary}</p>
        {!!c.related_compounds.length&&<p className="mt-3 text-xs text-stone-600">Contextual analytes, not proven human effects: {c.related_compounds.map((x,i)=><React.Fragment key={x.atlas_id}>{i>0?', ':''}<a className={sourceClass} href={RESEARCH_BRIDGE_VIEWER+'?id='+encodeURIComponent(x.atlas_id)} target="_blank" rel="noopener noreferrer">{x.name} ({x.atlas_id})</a></React.Fragment>)}</p>}
        <div className="mt-4 flex flex-wrap gap-3 text-xs">{c.source_ids.map(id=>{const s=bySource.get(id);return s?<a key={id} className={sourceClass} href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a>:null})}</div>
      </article>)}</div>
      <p className="mt-4 text-xs text-stone-600">{record.spec.human_efficacy_warning} Source records are curated, not a systematic review. No changes were made to the published Zenodo PDFs.</p>
    </>}
  </section>;
}
