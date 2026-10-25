import React, { useEffect, useState } from 'react';
import {
  CANNABIVERSE_ONCOLOGY_URL,
  CANNABIVERSE_ONCOLOGY_EXPLORER,
  validateOncologyFeed,
} from './oncologyFeed.js';

const laneLabels = {
  preclinical_mechanism: 'Preclinical mechanism',
  risk_context: 'Risk / conflicting observations',
  human_pilot_context: 'Small human pilot',
  clinical_supportive_care: 'Human supportive care',
  clinical_efficacy_boundary: 'Anticancer efficacy boundary',
};
const linkClass = 'font-semibold text-emerald-900 underline decoration-amber-500 underline-offset-4 hover:text-emerald-700';

export default function OncologyEvidence() {
  const [feed, setFeed] = useState(null);
  const [status, setStatus] = useState('loading');
  const [lane, setLane] = useState('all');

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(CANNABIVERSE_ONCOLOGY_URL, {
          signal: controller.signal,
          cache: 'no-cache',
        });
        if (!response.ok) throw new Error('Feed unavailable');
        const checked = validateOncologyFeed(await response.json());
        if (controller.signal.aborted) return;
        setFeed(checked);
        setStatus('ready');
      } catch (error) {
        if (controller.signal.aborted) return;
        setFeed(null);
        setStatus('unavailable');
      }
    }
    load();
    return () => controller.abort();
  }, []);

  const visible = feed?.claims.filter((claim) => lane === 'all' || claim.lane === lane) ?? [];
  const sourceById = new Map(feed?.sources.map((source) => [source.id, source]) ?? []);

  return (
    <section id="oncology" className="mx-auto max-w-7xl scroll-mt-32 px-4 py-10 md:px-6" aria-labelledby="oncology-title">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-amber-800">Cannabiverse ↔ Sacred Medicine</p>
      <h2 id="oncology-title" className="text-3xl font-bold tracking-tight text-emerald-950 md:text-4xl">Cannabinoids and cancer: evidence in its lane</h2>
      <p className="mt-3 max-w-4xl leading-7 text-stone-700">
        Our two research projects now share a versioned evidence feed. Cannabiverse curates molecular claims and citations; this page explains what they mean, and what they cannot tell us about human treatment.
      </p>
      <div className="mt-6 rounded-2xl border border-amber-500 bg-amber-50 p-5" role="note">
        <p className="font-bold text-amber-950">Cancer treatment is not established by laboratory mechanisms.</p>
        <p className="mt-2 text-sm leading-7 text-stone-800">
          The reported tumor-cell effects occur in selected experiments. They do not show that cannabis cures cancer, and cannabis should never replace oncology care. Cannabinoid products can interact with treatment; discuss use with a clinical team. Separately, particular cannabinoid medicines are used for some treatment-related symptoms.
        </p>
      </div>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <a className={linkClass} href={CANNABIVERSE_ONCOLOGY_EXPLORER} target="_blank" rel="noopener noreferrer">Open Cannabiverse Oncology Explorer</a>
        <a className={linkClass} href={CANNABIVERSE_ONCOLOGY_URL} target="_blank" rel="noopener noreferrer">Inspect the versioned JSON evidence</a>
        <a className={linkClass} href="https://www.cancer.gov/about-cancer/treatment/cam/hp/cannabis-pdq" target="_blank" rel="noopener noreferrer">NCI clinical context</a>
      </div>
      {status === 'loading' && <p className="mt-6 text-sm text-stone-700" role="status">Checking the live Cannabiverse evidence release…</p>}
      {status === 'unavailable' && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-white p-5" role="status">
          <p className="font-semibold text-emerald-950">The Cannabiverse evidence feed is not available here yet.</p>
          <p className="mt-2 text-sm leading-6 text-stone-700">This page does not invent or silently substitute scientific records. The verified research links above remain available. If the Cannabiverse PR has not been merged and published yet, its feed will not be live.</p>
        </div>
      )}
      {status === 'ready' && feed && (
        <div className="mt-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-900" role="status">
              Connected · Cannabiverse v{feed.contract_version} · Curated {feed.release_date} · {feed.claims.length} claims
            </p>
            <label className="text-sm font-semibold text-emerald-950" htmlFor="oncology-lane">
              Evidence lane
              <select id="oncology-lane" value={lane} onChange={(event) => setLane(event.target.value)}
                className="ml-3 rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800">
                <option value="all">All lanes</option>
                {Object.entries(laneLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {visible.map((claim) => (
              <article className="rounded-2xl border border-amber-200 bg-white/90 p-5 shadow-sm" key={claim.id}>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-amber-800">{laneLabels[claim.lane] || claim.lane} · {claim.id}</p>
                <h3 className="mt-2 text-xl font-bold text-emerald-950">{claim.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-700">{claim.summary}</p>
                <p className="mt-3 text-xs leading-5 text-stone-600"><strong>Model:</strong> {claim.model}</p>
                {claim.mechanism_steps.length > 0 && (
                  <div className="mt-4 rounded-xl bg-emerald-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">Reported experimental pathway</p>
                    <ol className="ml-4 mt-2 list-decimal space-y-1 text-sm leading-6 text-emerald-950">
                      {claim.mechanism_steps.map((step, index) => <li key={index}>{step}</li>)}
                    </ol>
                  </div>
                )}
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-900">Boundary</p>
                  <p className="mt-1 text-sm leading-6 text-stone-800">{claim.boundary}</p>
                </div>
                {claim.related_compounds.length > 0 && <p className="mt-3 text-xs text-stone-600">Atlas references: {claim.related_compounds.map((c) => c.name + ' (' + c.atlas_id + ')').join(', ')}</p>}
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {claim.source_ids.map((id) => {
                    const source = sourceById.get(id);
                    return source ? (
                      <a key={id} href={source.url} target="_blank" rel="noopener noreferrer" className={linkClass}
                        title={source.title}>{source.authors} · {source.year || 'Living NCI summary'}</a>
                    ) : null;
                  })}
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-stone-600">
            Source scope: narrative research review and living NCI evidence summary, not independent replication or a treatment guideline. Data is live from Cannabiverse and may be revised in future versioned releases. The parent Sacred Medicine Zenodo paper retains its published version; this live section is an additional research navigator, not a retroactive PDF edit.
          </p>
        </div>
      )}
    </section>
  );
}
