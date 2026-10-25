import React, {useEffect, useMemo, useState} from 'react';
import {fetchBridge} from './researchBridgeFeed.js';

const labels = {
  human_clinical_evidence: 'Human pain outcomes',
  clinical_safety: 'Adverse effects',
  evidence_gap: 'Evidence gaps',
  clinical_guidance_context: 'Clinical guidance and approval context',
  preclinical_physiology: 'CB1 / CB2 physiology'
};
const sourceClass = 'font-semibold text-emerald-900 underline decoration-amber-500 underline-offset-4';

export default function PainEvidence() {
  const [dataset, setDataset] = useState(null);
  const [status, setStatus] = useState('loading');
  const [lane, setLane] = useState('all');
  useEffect(() => {
    const controller = new AbortController();
    fetchBridge(controller.signal).then(data => {
      if (controller.signal.aborted) return;
      const index = data.manifest.domains.findIndex(d => d.id === 'pain-ecs');
      if (index < 0) throw Error('Pain domain unavailable');
      setDataset({feed: data.domains[index], spec: data.manifest.domains[index]});
      setStatus('ready');
    }).catch(() => {
      if (!controller.signal.aborted) {setDataset(null); setStatus('unavailable');}
    });
    return () => controller.abort();
  }, []);
  const claims = useMemo(() => dataset?.feed.claims.filter(c => lane === 'all' || c.lane === lane) ?? [], [dataset, lane]);
  const sources = useMemo(() => new Map(dataset?.feed.sources.map(s => [s.id, s]) ?? []), [dataset]);

  return <section id="pain-ecs" className="mx-auto max-w-7xl scroll-mt-32 px-4 py-10 md:px-6" aria-labelledby="pain-title">
    <p className="text-sm font-bold uppercase tracking-widest text-amber-800">Φ Research Bridge · Second evidence domain</p>
    <h2 id="pain-title" className="mt-2 text-3xl font-black tracking-tight text-emerald-950 md:text-4xl">Pain & the Endocannabinoid System</h2>
    <p className="mt-3 max-w-4xl leading-7 text-stone-700">Human results, basic CB1/CB2 biology, adverse effects, and evidence gaps stay in separate scientific lanes. Cannabiverse owns the cited records; this page provides the public-facing interpretation.</p>
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <h3 className="font-bold text-emerald-950">What clinical research found</h3>
        <p className="mt-2 text-sm leading-7 text-stone-700">The 2025 AHRQ review found small short-term pain benefits for certain studied THC-rich or balanced THC/CBD products, mostly in neuropathic chronic pain. Studied oral CBD alone did not improve chronic pain or function.</p>
      </div>
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
        <h3 className="font-bold text-amber-950">What the biology cannot prove</h3>
        <p className="mt-2 text-sm leading-7 text-stone-800">A receptor pathway is not clinical efficacy. Dizziness, sedation, nausea, drug interactions, whole-plant research gaps, and uncertain long-term outcomes matter. Do not change prescribed treatment without medical guidance.</p>
      </div>
    </div>
    <div className="mt-4 flex flex-wrap gap-4 text-sm">
      <a className={sourceClass} target="_blank" rel="noopener noreferrer" href="https://michaelwave369.github.io/Cannabiverse/app/pain/">Open Cannabiverse Pain Explorer</a>
      <a className={sourceClass} target="_blank" rel="noopener noreferrer" href="https://www.ncbi.nlm.nih.gov/books/NBK618040/">2025 AHRQ report</a>
    </div>
    {status === 'loading' && <p role="status" className="mt-6 text-sm text-stone-700">Verifying scientific sources…</p>}
    {status === 'unavailable' && <p role="status" className="mt-6 rounded-xl border border-amber-200 bg-white p-5 text-sm text-stone-700">The governed Pain & ECS data is not available or compatible yet. No unverified findings are displayed.</p>}
    {status === 'ready' && dataset && <div className="mt-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-xs font-bold uppercase tracking-wider text-emerald-900">{dataset.feed.claims.length} bounded claims · {dataset.feed.sources.length} cited sources · curated {dataset.feed.release_date}</p>
        <label htmlFor="pain-filter" className="text-sm font-semibold text-emerald-950">Evidence type
          <select id="pain-filter" value={lane} onChange={e => setLane(e.target.value)} className="ml-2 rounded-xl border border-amber-200 bg-white px-3 py-2">
            <option value="all">All evidence</option>
            {Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {claims.map(c => <article key={c.id} className="rounded-2xl border border-amber-200 bg-white/90 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">{labels[c.lane] || c.lane} · {c.evidence_strength?.replaceAll('_',' ')}</p>
          <h3 className="mt-2 text-xl font-bold text-emerald-950">{c.title}</h3>
          <p className="mt-3 text-sm leading-6 text-stone-700">{c.summary}</p>
          <p className="mt-3 text-xs text-stone-600"><strong>Population or model:</strong> {c.model}</p>
          {c.mechanism_steps?.length > 0 && <div className="mt-3 rounded-xl bg-emerald-50 p-4">
            <p className="text-xs font-bold uppercase text-emerald-950">Experimental signaling only</p>
            <ol className="ml-5 mt-2 list-decimal space-y-1 text-sm">{c.mechanism_steps.map((step,i) => <li key={i}>{step}</li>)}</ol>
          </div>}
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950"><strong>Limit:</strong> {c.boundary}</p>
          {c.related_compounds?.length > 0 && <p className="mt-3 text-xs text-stone-600">Compound references: {c.related_compounds.map(x => x.name+' ('+x.atlas_id+')').join(', ')}. Scope: {c.link_scope?.replaceAll('_',' ')}.</p>}
          <div className="mt-4 flex flex-wrap gap-3 text-xs">{c.source_ids.map(id => {
            const source = sources.get(id);
            return source ? <a key={id} className={sourceClass} href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a> : null;
          })}</div>
        </article>)}
      </div>
      <p className="mt-4 text-xs text-stone-600">{dataset.spec.human_efficacy_warning} Evidence cards use the versioned Cannabiverse source feed directly.</p>
    </div>}
  </section>;
}
