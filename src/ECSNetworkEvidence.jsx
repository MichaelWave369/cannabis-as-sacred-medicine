import React,{useEffect,useMemo,useState} from 'react';
import {fetchBridge} from './researchBridgeFeed.js';
import {validateECSNetwork,ecsClaimsForEntity} from './ecsNetwork.js';

export default function ECSNetworkEvidence(){
  const [state,setState]=useState({status:'loading',feed:null,spec:null});
  const [kind,setKind]=useState('all');
  const [selected,setSelected]=useState('');
  useEffect(()=>{
    const controller=new AbortController();
    fetchBridge(controller.signal).then(data=>{
      if(controller.signal.aborted)return;
      const i=data.manifest.domains.findIndex(d=>d.id==='ecs-network');
      if(i<0)throw new Error('ECS domain not published');
      const feed=validateECSNetwork(data.domains[i]);
      setState({status:'ready',feed,spec:data.manifest.domains[i]});
    }).catch(()=>{if(!controller.signal.aborted)setState({status:'unavailable',feed:null,spec:null});});
    return ()=>controller.abort();
  },[]);
  const feed=state.feed;
  const entities=useMemo(()=>feed?.entities.filter(e=>kind==='all'||e.kind===kind)??[],[feed,kind]);
  const active=feed?.entities.find(e=>e.id===selected);
  const related=useMemo(()=>feed?ecsClaimsForEntity(feed,selected):[],[feed,selected]);
  const sources=useMemo(()=>new Map(feed?.sources.map(s=>[s.id,s])??[]),[feed]);
  const kinds={all:'All entities',endocannabinoid:'Own-body signals',receptor:'Receptors',enzyme:'Enzymes',phytocannabinoid:'Plant compounds',context:'Cell contexts'};
  const linkClass='font-semibold text-emerald-900 underline underline-offset-4 decoration-amber-500';
  return <section id="ecs-network" className="mx-auto max-w-7xl scroll-mt-32 px-4 py-10 md:px-6" aria-labelledby="ecs-network-title">
    <p className="text-sm font-bold uppercase tracking-widest text-amber-800">Φ Research Bridge · ECS Network Atlas</p>
    <h2 id="ecs-network-title" className="mt-2 text-3xl font-black tracking-tight text-emerald-950 md:text-4xl">The body's endocannabinoid network</h2>
    <p className="mt-3 max-w-4xl leading-7 text-stone-700">Our bodies synthesize endogenous lipid messengers such as anandamide and 2-AG. Receptors and metabolic enzymes participate in context-dependent signaling. Cannabis compounds may interact with that network, but receptor activity is not proof of a treatment benefit or restored balance.</p>
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <h3 className="font-bold text-emerald-950">Biology and evidence</h3><p className="mt-2 text-sm leading-6 text-stone-700">Explore CB1, CB2, AEA, 2-AG, FAAH, MAGL, synthesis pathways and their experimentally studied signaling contexts. Each scientific statement retains a source receipt and a model or population boundary.</p>
      </div>
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
        <h3 className="font-bold text-amber-950">Sacred is an ethical interpretation</h3><p className="mt-2 text-sm leading-6 text-stone-700">Reverence, dignity and lived experience can shape how people approach medicine. They do not convert laboratory mechanisms into human treatment claims, prove universal benefit or erase risks.</p>
      </div>
    </div>
    <div className="mt-4 flex flex-wrap gap-4 text-sm">
      <a className={linkClass} target="_blank" rel="noopener noreferrer" href="https://michaelwave369.github.io/Cannabiverse/app/ecs/">Open interactive Cannabiverse ECS Network Atlas</a>
      <a className={linkClass} target="_blank" rel="noopener noreferrer" href="https://michaelwave369.github.io/Cannabiverse/app/ecs/body.html">Explore the human-body CB1/CB2 map</a>
    </div>
    {state.status==='loading'&&<p role="status" className="mt-6 text-sm text-stone-700">Verifying versioned scientific source…</p>}
    {state.status==='unavailable'&&<p role="status" className="mt-6 rounded-xl border border-amber-300 bg-white p-5 text-sm text-stone-700">The authoritative ECS feed is not yet published, available, or compatible. No fallback medical or mechanistic claims will be displayed.</p>}
    {state.status==='ready'&&feed&&<div className="mt-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p role="status" className="text-xs font-bold uppercase tracking-wide text-emerald-900">{feed.entities.length} entities · {feed.relationships.length} sourced relationships · {feed.claims.length} scoped claims · {feed.release_date}</p>
        <label className="text-sm font-semibold text-emerald-950">Entity type
          <select className="ml-2 rounded-xl border border-amber-300 bg-white px-3 py-2" value={kind} onChange={e=>{setKind(e.target.value);setSelected('');}}>
            {Object.entries(kinds).map(([id,title])=><option key={id} value={id}>{title}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" aria-pressed={!selected} onClick={()=>setSelected('')} className={'rounded-full px-3 py-2 text-xs font-semibold ring-1 '+(!selected?'bg-emerald-950 text-white ring-emerald-950':'bg-white text-emerald-950 ring-emerald-200')}>All claims</button>
        {entities.map(e=><button key={e.id} type="button" aria-pressed={selected===e.id} onClick={()=>setSelected(e.id)} className={'rounded-full px-3 py-2 text-xs font-semibold ring-1 '+(selected===e.id?'bg-emerald-950 text-white ring-emerald-950':'bg-white text-emerald-950 ring-emerald-200')}>{e.label}</button>)}
      </div>
      {active&&<p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-stone-800"><strong>{active.label}:</strong> {active.summary}</p>}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {related.map(c=><article key={c.id} className="rounded-2xl border border-amber-200 bg-white/90 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">{c.lane.replaceAll('_',' ')} · {c.evidence_strength.replaceAll('_',' ')}</p>
          <h3 className="mt-2 text-lg font-bold text-emerald-950">{c.title}</h3>
          <p className="mt-3 text-sm leading-6 text-stone-700">{c.summary}</p>
          <p className="mt-2 text-xs text-stone-600"><strong>Research context:</strong> {c.model}</p>
          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-950"><strong>Boundary:</strong> {c.boundary}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">{c.source_ids.map(id=>{const s=sources.get(id);return s?<a key={id} className={linkClass} target="_blank" rel="noopener noreferrer" href={s.url}>{s.title}</a>:null;})}</div>
        </article>)}
      </div>
      <p className="mt-4 text-xs text-stone-600">{state.spec?.human_efficacy_warning} Cannabiverse alone owns these records; the navigator is read-only.</p>
    </div>}
  </section>;
}
