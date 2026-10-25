import React,{useEffect,useMemo,useState} from 'react';
import {RESEARCH_BRIDGE_VIEWER,fetchBridge,claimsForCompound} from './researchBridgeFeed.js';

const linkStyle='font-semibold text-emerald-900 underline decoration-amber-500 underline-offset-4 hover:text-emerald-700';
const cbdId='CPA-CAN-0047';
function initialId(){
  const id=new URLSearchParams(window.location.search).get('compound');
  return id&&/^CPA-CAN-\d{4}$/.test(id)?id:cbdId;
}
export default function ResearchBridge(){
  const [data,setData]=useState(null);
  const [status,setStatus]=useState('loading');
  const [selectedId,setSelectedId]=useState(initialId);
  const [query,setQuery]=useState('');
  useEffect(()=>{
    const ctrl=new AbortController();
    fetchBridge(ctrl.signal).then(found=>{
      if(ctrl.signal.aborted)return;
      setData(found);setStatus('ready');
      if(!found.compounds.some(c=>c.atlas_id===selectedId))setSelectedId(cbdId);
    }).catch(()=>{if(!ctrl.signal.aborted){setData(null);setStatus('unavailable')}});
    return ()=>ctrl.abort();
  },[]);
  const current=useMemo(()=>data?.compounds.find(c=>c.atlas_id===selectedId),[data,selectedId]);
  const matches=useMemo(()=>data&&current?claimsForCompound(data,current.atlas_id):[],[data,current]);
  const searchResults=useMemo(()=>{
    if(!data)return [];
    const needle=query.trim().toLowerCase();
    const list=data.compounds.filter(c=>!needle||
      [c.atlas_id,c.canonical_name,c.short_label,c.family].join(' ').toLowerCase().includes(needle));
    if(!needle){
      const chosen=list.find(c=>c.atlas_id===selectedId);
      return [...(chosen?[chosen]:[]),...list.filter(c=>c.atlas_id!==selectedId)].slice(0,24);
    }
    return list.slice(0,24);
  },[data,query,selectedId]);
  const sourcesById=useMemo(()=>new Map(data?.chemicalSources.map(s=>[s.source_id,s])||[]),[data]);
  const structureIds=useMemo(()=>new Set(data?.structures.map(s=>s.atlas_id)||[]),[data]);
  const choose=(id)=>{
    setSelectedId(id);
    const url=new URL(window.location.href);
    url.searchParams.set('compound',id);
    history.replaceState(null,'',url);
  };
  return <section id="research-bridge" className="mx-auto max-w-7xl scroll-mt-32 px-4 py-10 md:px-6" aria-labelledby="research-bridge-title">
    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-800">Φ Research Bridge · Shared Scientific Network</p>
    <h2 id="research-bridge-title" className="mt-2 text-3xl font-black tracking-tight text-emerald-950 md:text-4xl">Molecules → source receipts → bounded research</h2>
    <p className="mt-3 max-w-4xl leading-7 text-stone-700">Cannabiverse publishes governed molecular identities and evidence domains. This navigator reads those original sources without duplicating them or inventing medical claims.</p>
    <div className="mt-5 rounded-2xl border border-amber-400 bg-amber-50 p-4">
      <p className="font-semibold text-amber-950">Important clinical boundary</p>
      <p className="mt-1 text-sm leading-6 text-stone-800">Laboratory mechanisms do not demonstrate treatment effectiveness in people. Cannabinoids have not been established as human anticancer therapies, and cancer care must not be replaced by cannabis. A chemical identity is not evidence of effectiveness or safety.</p>
    </div>
    <div className="mt-4 flex flex-wrap gap-4 text-sm">
      <a className={linkStyle} href={RESEARCH_BRIDGE_VIEWER} target="_blank" rel="noopener noreferrer">Open Cannabiverse Research Bridge</a>
      <a className={linkStyle} href="https://michaelwave369.github.io/Cannabiverse/data/bridge/research-index-v2.json" target="_blank" rel="noopener noreferrer">Inspect the publisher contract</a>
    </div>
    {status==='loading'&&<p role="status" className="mt-5 text-sm text-stone-600">Reading the governed research sources…</p>}
    {status==='unavailable'&&<p role="status" className="mt-5 rounded-2xl border border-amber-200 bg-white p-5 text-sm text-stone-700">Research Bridge sources are unavailable or incompatible. No unsourced claims are shown. The existing oncology evidence section remains separate.</p>}
    {status==='ready'&&data&&<div className="mt-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-900" role="status">{data.compounds.length} canonical identities · {data.domains.length} governed domain · contract v{data.manifest.contract_version}</p>
      <label htmlFor="bridge-search" className="block text-sm font-bold text-emerald-950">Find a canonical molecule</label>
      <input id="bridge-search" className="mt-2 w-full max-w-xl rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-900" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search THC, CBD, family or CPA-CAN ID"/>
      <div className="mt-3 flex max-h-48 flex-wrap gap-2 overflow-auto" aria-label="Molecule results">
        {searchResults.map(c=><button key={c.atlas_id} type="button" onClick={()=>choose(c.atlas_id)} aria-pressed={selectedId===c.atlas_id} className={'rounded-full border px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-900 '+(selectedId===c.atlas_id?'border-emerald-950 bg-emerald-950 text-amber-100':'border-amber-300 bg-white text-emerald-950 hover:bg-amber-50')}>{c.short_label||c.canonical_name} · {c.atlas_id}</button>)}
        {!searchResults.length&&<p className="text-sm text-stone-600">No matching compound.</p>}
      </div>
      {current&&<div className="mt-5 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl border border-amber-200 bg-white/90 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-800">Canonical chemistry</p>
          <h3 className="mt-2 text-2xl font-bold text-emerald-950">{current.short_label||current.canonical_name}</h3>
          <p className="mt-2 text-sm text-stone-700">{current.canonical_name} · {current.family}</p>
          <p className="mt-4 text-xs leading-6 text-stone-600">{current.atlas_id}<br/>Identity: {current.identity_level} ({current.identity_claim_id})<br/>Occurrence: {current.occurrence_level} ({current.occurrence_claim_id})</p>
          {current.occurrence_cautioned&&<p className="mt-2 text-sm text-amber-900">Occurrence caution: {current.caution}</p>}
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <a className={linkStyle} href={RESEARCH_BRIDGE_VIEWER+'?id='+encodeURIComponent(current.atlas_id)} target="_blank" rel="noopener noreferrer">Research profile</a>
            {structureIds.has(current.atlas_id)&&<a className={linkStyle} href={'https://michaelwave369.github.io/Cannabiverse/app/molecules/?id='+encodeURIComponent(current.atlas_id)} target="_blank" rel="noopener noreferrer">3D molecule</a>}
          </div>
          {sourcesById.has(current.source_id)&&<p className="mt-4 text-xs"><a className={linkStyle} href={sourcesById.get(current.source_id).url} target="_blank" rel="noopener noreferrer">Chemistry source: {sourcesById.get(current.source_id).title}</a></p>}
        </div>
        <div className="rounded-2xl border border-amber-200 bg-white/90 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-800">Scoped research claims · {matches.length}</p>
          {!matches.length&&<p className="mt-4 text-sm leading-6 text-stone-700">No citations from the currently registered research domains are linked to this compound. That is not evidence that the compound has no effects or has never been studied.</p>}
          <div className="mt-3 space-y-4">
          {matches.map(claim=><article key={claim.id} className="rounded-xl border border-emerald-900/15 bg-emerald-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">{claim.domain_title} · {claim.lane.replaceAll('_',' ')}</p>
            <h4 className="mt-2 text-lg font-bold text-emerald-950">{claim.title}</h4>
            <p className="mt-2 text-sm leading-6 text-stone-700">{claim.summary}</p>
            <p className="mt-2 text-xs text-stone-600">Context: {claim.model}</p>
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950"><strong>Limit:</strong> {claim.boundary}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs">
              {claim.source_ids.map(id=>{const s=claim.domain_sources.find(source=>source.id===id);return s?<a key={id} className={linkStyle} href={s.url} target="_blank" rel="noopener noreferrer">{s.title} · {s.kind}</a>:null;})}
            </div>
          </article>)}
          </div>
        </div>
      </div>}
    </div>}
  </section>;
}
