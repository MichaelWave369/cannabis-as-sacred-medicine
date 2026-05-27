import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  Brain,
  ChevronRight,
  Compass,
  Download,
  ExternalLink,
  FileText,
  Flower2,
  Gavel,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  HeartPulse,
  Landmark,
  Leaf,
  Map,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from 'lucide-react';

const VERSION = 'v1.0.1 Public Release';
const AUTHOR = 'Michael W. Hughes — Parallax / PHI369 Labs';

const downloads = [
  ['Main Paper PDF', '/cannabis-as-sacred-medicine/papers/Cannabis_as_Sacred_Medicine_Michael_W_Hughes_Parallax_PHI369_Labs_v1_0_1_Public_Release.pdf'],
  ['Executive Summary', '/cannabis-as-sacred-medicine/papers/Cannabis_as_Sacred_Medicine_v1_0_1_Executive_Summary_4_Page.pdf'],
  ['Policy / Testimony', '/cannabis-as-sacred-medicine/papers/Cannabis_as_Sacred_Medicine_v1_0_1_Policy_Testimony_2_Page.pdf'],
  ['Safe-Language Guide', '/cannabis-as-sacred-medicine/papers/Cannabis_as_Sacred_Medicine_v1_0_1_Safe_Language_Guide.pdf'],
];

const navItems = [
  ['thesis', 'Thesis'],
  ['map', 'Evidence Map'],
  ['explore', 'Explore'],
  ['policy', 'Policy'],
  ['language', 'Safe Language'],
  ['cycle', 'Transmutation'],
  ['downloads', 'Downloads'],
];

const sections = [
  {
    id: 'body',
    domain: 'Body',
    icon: Brain,
    title: 'Endocannabinoid Science',
    summary: 'Cannabis interacts with cannabinoid-responsive systems involved in pain, appetite, mood, memory, inflammation, immune signaling, and homeostasis.',
    points: [
      'The endocannabinoid system includes receptors, endogenous cannabinoids, and enzymes.',
      'THC, CBD, and other cannabinoids interact with this system through different pathways.',
      'Whole-plant cannabis may involve complex compound interactions, but the entourage effect remains debated.',
    ],
    boundary: 'Strong biological plausibility does not mean every cannabis product or claim is clinically proven.',
  },
  {
    id: 'medical',
    domain: 'Body',
    icon: Stethoscope,
    title: 'Evidence-Based Medical Uses',
    summary: 'The strongest evidence supports cannabis or cannabinoids for chronic pain in adults, chemotherapy-related nausea/vomiting, and patient-reported MS spasticity symptoms.',
    points: [
      'Evidence is condition-specific, not universal.',
      'Palliative contexts may involve dignity-centered symptom relief, appetite, anxiety, sleep, and presence.',
      'Drug interactions, polypharmacy, pregnancy, youth use, CHS, CUD, and psychosis vulnerability require caution.',
    ],
    boundary: 'Sacred medicine does not mean harmless medicine. It means powerful medicine held with humility and boundaries.',
  },
  {
    id: 'testimony',
    domain: 'Body / Justice',
    icon: HeartPulse,
    title: 'Lived Testimony as Moral Witness',
    summary: 'The author’s story of severe kidney-stone pain, opioid exposure, methadone-clinic stigma, and cannabis-mediated restoration is framed as lived testimony, not universal proof.',
    points: [
      'Patient testimony should not replace clinical evidence.',
      'Patient testimony should not be erased by clinical evidence either.',
      'The project treats lived experience as moral witness and a reason to study patient outcomes more seriously.',
    ],
    boundary: 'This is not a recommendation for childhood cannabis use, abrupt medication withdrawal, or rejecting medical care.',
  },
  {
    id: 'ritual',
    domain: 'Spirit',
    icon: BookOpen,
    title: 'Ritual and Sacred History',
    summary: 'Cannabis has appeared in ritual, devotional, and sacramental contexts, including evidence from ancient Central Asia, Iron Age Judah, Hindu practice, and Rastafari sacramental use.',
    points: [
      'Archaeology supports some ancient ritual cannabis use.',
      'Living traditions should be treated with cultural humility, not extracted as branding.',
      'The qaneh-bosem question remains contested and should be stated as possibility, not certainty.',
    ],
    boundary: 'Ritual history does not prove universal sacred status, theological doctrine, or clinical efficacy.',
  },
  {
    id: 'ecology',
    domain: 'Spirit / Ecology',
    icon: Flower2,
    title: 'Bees, Hemp, and Honey',
    summary: 'Flowering hemp can support pollinators through pollen, but cannabis does not naturally produce nectar-based varietal honey.',
    points: [
      'The bee-cannabis connection is ecological and symbolic.',
      '“Cannabis honey” is usually infused or human-made, not natural nectar honey from cannabis.',
      'The symbolism remains meaningful when the science is kept honest.',
    ],
    boundary: 'Do not claim bees naturally make psychoactive cannabis honey from cannabis nectar.',
  },
  {
    id: 'prohibition',
    domain: 'Justice',
    icon: Gavel,
    title: 'Prohibition Trauma and Stigma Repair',
    summary: 'Cannabis prohibition criminalized many people’s attempts to survive, heal, pray, create, or manage pain with a plant.',
    points: [
      'The paper frames prohibition as legal, cultural, racial, psychological, and spiritual harm.',
      'Rescheduling is not automatically repair.',
      'Repair requires expungement, stigma reduction, patient disclosure protections, cultural respect, and measurable accountability.',
    ],
    boundary: 'Justice repair does not erase cannabis risks. It asks society to stop adding shame and punishment to pain.',
  },
  {
    id: 'market',
    domain: 'Justice / Practice',
    icon: Scale,
    title: 'Commercialization Without Reverence',
    summary: 'Legal access can heal some prohibition harms, but profit-maximized intoxication can create new harms.',
    points: [
      'The concern is not potency itself; some patients may need higher potency in severe pain or palliative settings.',
      'The concern is potency pushed as novelty, branding, and endless consumption without education or restraint.',
      'Wise access, not endless access, is the goal.',
    ],
    boundary: 'Sacred medicine resists both prohibitionist fear and reckless commercialization.',
  },
  {
    id: 'stewardship',
    domain: 'Practice',
    icon: HandHeart,
    title: 'Set, Setting, Route, and Stewardship',
    summary: 'Cannabis use is shaped by dose, route, context, intention, environment, maturity, support, and relationship to the medicine.',
    points: [
      'Combustion, vaporization, tinctures, oils, edibles, capsules, and topicals carry different onset times, risks, and ritual possibilities.',
      'Elders, clinicians, peer stewards, chaplains, and informed community guides can help hold non-exploitative containers.',
      'Sacred practice requires truth, consent, patience, and refusal to push more use for profit.',
    ],
    boundary: 'No route is automatically sacred. Relationship, context, and outcome matter.',
  },
];

const evidenceRows = [
  ['Cannabis/cannabinoids can help some chronic pain patients.', 'Strongest clinical support', 'Supported for some adult chronic-pain contexts; not a universal cure.'],
  ['Oral cannabinoids can help chemotherapy-related nausea/vomiting.', 'Strong clinical support', 'Supported in specific medical contexts; product and patient factors matter.'],
  ['Cannabis has ritual/sacred history.', 'Historically credible, context-specific', 'Some cultures and archaeological sites support ritual use; do not universalize.'],
  ['Qaneh-bosem was definitely cannabis.', 'Contested interpretation', 'Some argue it may refer to cannabis, but the identification remains unresolved.'],
  ['Cannabis honey is natural honey from cannabis nectar.', 'Incorrect / needs correction', 'Hemp can support pollen for bees; cannabis honey is usually infused.'],
  ['Cannabis is harmless.', 'False overclaim', 'Cannabis has benefits and risks; sacred does not mean harmless.'],
  ['Personal testimony proves cannabis works for everyone.', 'Incorrect claim category', 'Testimony is moral witness and a reason to study outcomes, not universal proof.'],
];

const safeLanguage = [
  ['Cannabis cures pain.', 'Cannabis or cannabinoids may help some adults with chronic pain; benefits vary by person and condition.'],
  ['Cannabis is harmless because it is natural.', 'Cannabis is powerful enough to help and powerful enough to harm; it deserves respect and boundaries.'],
  ['Cannabis was definitely in the Bible.', 'Some argue qaneh-bosem may refer to cannabis, but the identification remains contested.'],
  ['Cannabis should replace opioids.', 'Some patients report substituting cannabis for opioids, but opioid changes should be medically supervised.'],
  ['Sacred means scientifically proven divine medicine.', 'Sacred is used here as an ethical category: reverence, evidence, consent, maturity, cultural humility, and harm-reduction boundaries.'],
  ['Legalization fixes everything.', 'Legal reform is not the same as repair; dignity, expungement, education, and stigma reduction still matter.'],
];

const policyPillars = [
  ['Research & Education', GraduationCap, ['ECS education', 'Whole-plant research', 'Patient registries', 'Provider training']],
  ['Justice & Repair', Landmark, ['Record clearing', 'Stigma repair', 'Disclosure protections', 'Equity pathways']],
  ['Market & Safety', ShieldCheck, ['Potency labeling', 'Contaminant testing', 'Youth protection', 'Adverse-event education']],
  ['Community & Culture', Users, ['Religious respect', 'Cultural protections', 'Peer stewardship', 'Patient testimony archives']],
];

const cycle = [
  ['Pain', AlertTriangle, 'The wound becomes visible rather than denied.', 'Name what hurts without shame.'],
  ['Breath', Compass, 'The body becomes bearable enough to remain present.', 'Return to the body slowly and safely.'],
  ['Dignity', ShieldCheck, 'The person is no longer reduced to diagnosis, stigma, or criminal label.', 'Replace shame with truth.'],
  ['Responsibility', Scale, 'Healing becomes honest, measured, and relational.', 'Use boundaries, support, and self-assessment.'],
  ['Joy', Sparkles, 'Relief becomes vitality rather than escape.', 'Let the nervous system remember life.'],
  ['Service', HeartHandshake, 'The healed wound becomes a lantern for others.', 'Turn survival into care.'],
];

const metrics = [
  ['Provider education', '% of clinicians trained in ECS basics and stigma-aware cannabis communication'],
  ['Stigma repair', 'Patient-reported comfort disclosing cannabis use to providers'],
  ['Justice', 'Expungement pathways, record-clearing numbers, and reintegration supports'],
  ['Market safety', 'Potency labeling compliance, CHS tracking, youth-use monitoring, impaired-driving education'],
  ['Research', 'Whole-plant studies, patient registries, long-term outcome tracking'],
  ['Stewardship', 'Peer/clinician guide programs and patient satisfaction with guidance'],
];

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Card({ children, className = '' }) {
  return <div className={cx('rounded-2xl border border-amber-200/70 bg-white/85 p-5 shadow-sm backdrop-blur', className)}>{children}</div>;
}

function Badge({ children, tone = 'emerald' }) {
  const tones = {
    emerald: 'bg-emerald-950 text-amber-100 border-emerald-800',
    amber: 'bg-amber-100 text-amber-950 border-amber-300',
    cream: 'bg-stone-100 text-stone-800 border-stone-300',
  };
  return <span className={cx('inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold', tones[tone])}>{children}</span>;
}

function IconBubble({ icon: Icon }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-amber-200 shadow-sm" aria-hidden="true">
      <Icon size={22} />
    </div>
  );
}

function SectionTitle({ eyebrow, title, children }) {
  return (
    <div className="mb-8">
      {eyebrow ? <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-amber-800">{eyebrow}</p> : null}
      <h2 className="text-3xl font-bold tracking-tight text-emerald-950 md:text-4xl">{title}</h2>
      {children ? <p className="mt-3 max-w-3xl text-base leading-7 text-stone-700">{children}</p> : null}
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState('All');
  const [copied, setCopied] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sections.filter((section) => {
      const domainMatch = domain === 'All' || section.domain.toLowerCase().includes(domain.toLowerCase());
      const haystack = [section.title, section.summary, section.domain, section.boundary, ...section.points].join(' ').toLowerCase();
      return domainMatch && (!q || haystack.includes(q));
    });
  }, [domain, query]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(''), 1800);
    } catch {
      setCopied('Copy unavailable');
      setTimeout(() => setCopied(''), 1800);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f7e7b6_0,#fbf7ed_28%,#eef5ea_60%,#dfeade_100%)] text-stone-900">
      <header className="sticky top-0 z-40 border-b border-amber-200/70 bg-stone-50/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <button onClick={() => scrollTo('top')} className="flex items-center gap-3 text-left" aria-label="Return to top">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-950 text-amber-200 shadow-sm" aria-hidden="true">
              <Leaf size={22} />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-emerald-950">Cannabis as Sacred Medicine</p>
              <p className="hidden text-xs text-stone-600 sm:block">{VERSION}</p>
            </div>
          </button>
          <nav aria-label="Main sections" className="hidden items-center gap-1 lg:flex">
            {navItems.map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="rounded-full px-3 py-2 text-xs font-semibold text-stone-700 transition hover:bg-amber-100 hover:text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-900">
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-6 md:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge>Evidence-informed public education</Badge>
              <Badge tone="amber">Policy & testimony paper</Badge>
              <Badge tone="cream">Not medical advice</Badge>
            </div>
            <h1 className="max-w-4xl text-5xl font-black tracking-tight text-emerald-950 md:text-7xl">Cannabis as Sacred Medicine</h1>
            <p className="mt-5 max-w-3xl text-xl leading-8 text-stone-700">Healing the body, restoring dignity, and transmuting pain into joy — without overclaiming, romanticizing, or erasing risk.</p>
            <p className="mt-4 text-base font-semibold text-amber-900">{AUTHOR}</p>
            <Card className="mt-8 border-emerald-900/20 bg-emerald-950 text-stone-50">
              <p className="text-lg font-semibold text-amber-200">Core thesis</p>
              <p className="mt-3 text-2xl font-bold leading-snug">Cannabis is sacred medicine when it helps a person return to breath, dignity, responsibility, joy, love — and when that return becomes care for others.</p>
            </Card>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[[Brain, 'Body', 'biology, pain, ECS'], [Sparkles, 'Spirit', 'ritual, reverence, meaning'], [Scale, 'Justice', 'repair, policy, dignity']].map(([Icon, title, text]) => (
                <Card key={title} className="bg-white/70">
                  <IconBubble icon={Icon} />
                  <h3 className="mt-3 font-bold text-emerald-950">{title}</h3>
                  <p className="mt-1 text-sm text-stone-600">{text}</p>
                </Card>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="relative overflow-hidden rounded-[2rem] border border-amber-300 bg-emerald-950 p-6 text-amber-50 shadow-xl">
              <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_center,#f8d36e_1px,transparent_1px)] [background-size:28px_28px]" />
              <div className="relative">
                <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-full border border-amber-300/70 bg-emerald-900/60 shadow-inner md:h-80 md:w-80">
                  <Leaf className="text-amber-200" size={118} strokeWidth={1.25} aria-hidden="true" />
                </div>
                <div className="mt-8 grid gap-3">
                  {['Sacred is an ethical category, not a lab measurement.', 'Evidence must stay in its lane.', 'Patient testimony is moral witness, not universal proof.', 'Reverence means truth, consent, restraint, and care.'].map((line) => (
                    <div key={line} className="flex items-start gap-3 rounded-2xl border border-amber-300/20 bg-white/10 p-3">
                      <BadgeCheck className="mt-0.5 shrink-0 text-amber-200" size={18} aria-hidden="true" />
                      <p className="text-sm leading-6">{line}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="thesis" className="mx-auto max-w-7xl px-4 py-10 md:px-6 scroll-mt-24">
          <SectionTitle eyebrow="Genre boundary" title="What this project is — and is not">This navigator presents an evidence-informed public education, policy, and testimony paper. It is not a clinical trial, systematic review, dosing protocol, medical guideline, legal advice, or theological proof.</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[[FileText, 'Evidence-informed', 'Built from major reviews, government sources, peer-reviewed literature, policy records, and clearly labeled testimony.'], [ShieldCheck, 'Bounded claims', 'Clinical evidence, ritual history, contested interpretation, ecology, and testimony remain separate claim categories.'], [AlertTriangle, 'Risk-aware', 'Names risks including impaired driving, CUD, CHS, youth concerns, psychosis vulnerability, pregnancy, interactions, and potency.'], [HandHeart, 'Dignity-centered', 'Argues for reverence, repair, consent, maturity, cultural humility, and harm-reduction boundaries.']].map(([Icon, title, text]) => (
              <Card key={title}><IconBubble icon={Icon} /><h3 className="mt-4 text-lg font-bold text-emerald-950">{title}</h3><p className="mt-2 text-sm leading-6 text-stone-700">{text}</p></Card>
            ))}
          </div>
        </section>

        <section id="map" className="mx-auto max-w-7xl px-4 py-10 md:px-6 scroll-mt-24">
          <SectionTitle eyebrow="Claim discipline" title="Evidence Strength Map">The key discipline is preventing the reader from confusing one type of claim for another.</SectionTitle>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="bg-emerald-950 text-amber-100"><tr><th className="px-5 py-4 font-bold">Claim</th><th className="px-5 py-4 font-bold">Evidence status</th><th className="px-5 py-4 font-bold">Safer wording</th></tr></thead>
                <tbody>{evidenceRows.map((row, idx) => <tr key={row[0]} className={idx % 2 ? 'bg-amber-50/60' : 'bg-white'}><td className="px-5 py-4 font-semibold text-emerald-950">{row[0]}</td><td className="px-5 py-4 text-stone-700">{row[1]}</td><td className="px-5 py-4 text-stone-700">{row[2]}</td></tr>)}</tbody>
              </table>
            </div>
          </Card>
        </section>

        <section id="explore" className="mx-auto max-w-7xl px-4 py-10 md:px-6 scroll-mt-24">
          <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <SectionTitle eyebrow="Explore" title="Navigate the paper by theme">Search or filter the core framework. Each card includes the claim boundary that keeps the argument honest.</SectionTitle>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <label className="relative"><span className="sr-only">Search sections</span><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} aria-hidden="true" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sections..." className="w-full rounded-2xl border border-amber-200 bg-white px-10 py-3 text-sm outline-none ring-emerald-900/20 transition focus:ring-4 sm:w-72" /></label>
              <label><span className="sr-only">Filter by domain</span><select value={domain} onChange={(e) => setDomain(e.target.value)} className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold outline-none ring-emerald-900/20 transition focus:ring-4"><option>All</option><option>Body</option><option>Spirit</option><option>Justice</option><option>Practice</option></select></label>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((section) => {
              const Icon = section.icon;
              return <motion.article key={section.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><Card className="h-full"><div className="flex items-start gap-4"><IconBubble icon={Icon} /><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-xl font-bold text-emerald-950">{section.title}</h3><Badge tone="amber">{section.domain}</Badge></div><p className="mt-2 text-sm leading-6 text-stone-700">{section.summary}</p></div></div><ul className="mt-5 space-y-2 text-sm leading-6 text-stone-700">{section.points.map((point) => <li key={point} className="flex gap-2"><ChevronRight className="mt-1 shrink-0 text-amber-700" size={16} aria-hidden="true" /><span>{point}</span></li>)}</ul><div className="mt-5 rounded-2xl border border-emerald-900/15 bg-emerald-50 p-4"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">Boundary</p><p className="mt-1 text-sm leading-6 text-emerald-950">{section.boundary}</p></div></Card></motion.article>;
            })}
          </div>
        </section>

        <section id="policy" className="mx-auto max-w-7xl px-4 py-10 md:px-6 scroll-mt-24">
          <SectionTitle eyebrow="Policy framework" title="How a society institutionalizes reverence">Reverence becomes real when systems protect truth, dignity, access, restraint, and repair.</SectionTitle>
          <div className="grid gap-4 lg:grid-cols-4">{policyPillars.map(([title, Icon, bullets]) => <Card key={title}><IconBubble icon={Icon} /><h3 className="mt-4 text-lg font-bold text-emerald-950">{title}</h3><ul className="mt-3 space-y-2 text-sm text-stone-700">{bullets.map((b) => <li key={b} className="flex gap-2"><BadgeCheck className="mt-0.5 shrink-0 text-emerald-800" size={15} aria-hidden="true" /><span>{b}</span></li>)}</ul></Card>)}</div>
          <Card className="mt-6 overflow-hidden p-0"><div className="bg-emerald-950 px-5 py-4 text-amber-100"><h3 className="text-lg font-bold">Metrics of success</h3><p className="mt-1 text-sm text-amber-100/80">The framework should be measurable, not merely inspirational.</p></div><div className="grid divide-y divide-amber-100 md:grid-cols-2 md:divide-x md:divide-y-0">{metrics.map(([label, metric]) => <div key={label} className="p-5"><p className="font-bold text-emerald-950">{label}</p><p className="mt-1 text-sm leading-6 text-stone-700">{metric}</p></div>)}</div></Card>
        </section>

        <section id="language" className="mx-auto max-w-7xl px-4 py-10 md:px-6 scroll-mt-24">
          <SectionTitle eyebrow="Safe-language guide" title="Say this, not that">Advocacy becomes stronger when it refuses overclaiming.</SectionTitle>
          {copied ? <p className="mb-4 rounded-2xl bg-emerald-950 px-4 py-3 text-sm font-semibold text-amber-100" role="status">Copied safer wording.</p> : null}
          <div className="grid gap-4 md:grid-cols-2">{safeLanguage.map(([avoid, use]) => <Card key={avoid}><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-red-200 bg-red-50 p-4"><p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Avoid</p><p className="mt-2 text-sm font-semibold text-red-950">“{avoid}”</p></div><div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Use</p><p className="mt-2 text-sm font-semibold leading-6 text-emerald-950">“{use}”</p><button onClick={() => copyText(use)} className="mt-3 rounded-full bg-emerald-950 px-3 py-2 text-xs font-bold text-amber-100 transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-900" aria-label={`Copy safer wording: ${use}`}>Copy safer wording</button></div></div></Card>)}</div>
        </section>

        <section id="cycle" className="mx-auto max-w-7xl px-4 py-10 md:px-6 scroll-mt-24">
          <SectionTitle eyebrow="Transmutation cycle" title="Pain becomes care">The paper’s moral arc is not self-indulgence. It is survival becoming service.</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{cycle.map(([stage, Icon, meaning, practice], idx) => <Card key={stage} className="relative overflow-hidden"><div className="absolute right-4 top-4 text-5xl font-black text-amber-100">{idx + 1}</div><div className="relative"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-950"><Icon size={22} aria-hidden="true" /></div><h3 className="text-2xl font-black text-emerald-950">{stage}</h3><p className="mt-2 text-sm leading-6 text-stone-700">{meaning}</p><p className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-950">{practice}</p></div></Card>)}</div>
        </section>

        <section id="downloads" className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:pb-20 scroll-mt-24">
          <SectionTitle eyebrow="Release package" title="Download and share responsibly">PDF links will work after the release files are uploaded into <code>public/papers/</code>.</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{downloads.map(([label, href]) => <a key={label} href={href} download className="group rounded-2xl border border-amber-200 bg-white/85 p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-900"><div className="flex items-center justify-between gap-4"><IconBubble icon={Download} /><ExternalLink className="text-stone-400 transition group-hover:text-emerald-800" size={18} aria-hidden="true" /></div><h3 className="mt-4 text-lg font-bold text-emerald-950">{label}</h3><p className="mt-2 text-sm text-stone-600">Direct download from the public release package.</p></a>)}</div>
          <Card className="mt-6 bg-emerald-950 text-stone-50"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="font-bold text-amber-200">Public status</p><p className="mt-1 text-sm leading-6 text-stone-200">{VERSION} · Evidence-informed public education, policy, and testimony paper · Not medical, legal, or spiritual advice.</p></div><div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-amber-100"><Map size={18} aria-hidden="true" />Body · Spirit · Justice · Practice</div></div></Card>
        </section>
      </main>
    </div>
  );
}
