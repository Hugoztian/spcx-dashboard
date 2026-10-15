/* New dashboard sections (approved 14 Oct 2026). Every figure carries a dated source; unknowns are n/a.
   Q1 figures = H1 minus Q2 (calculated from the 10-Q six-month tables); "calc." marks anything derived here. */
(function () {
const U = {
  p424: 'https://www.sec.gov/Archives/edgar/data/1181412/000162828026042639/spaceexplorationtechnologi.htm',
  q10: 'https://www.sec.gov/Archives/edgar/data/1181412/000162828026052535/spcx-20260630.htm',
  pib: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2320510',
  finra: 'https://www.finra.org/finra-data/browse-catalog/equity-short-interest',
  ndx: 'https://indexes.nasdaq.com/docs/Methodology_NDX.pdf',
  russell: 'https://www.lseg.com/en/media-centre/press-releases/ftse-russell/2026/ftse-russell-announces-december-2026-russell-us-indexes-reconstitution-schedule',
  geis: 'https://research.ftserussell.com/products/index-notices/home/getnotice/?id=2617649',
  msci: 'https://www.msci.com/eqb/pressreleases/archive/ir_dates.pdf',
  s8r: 'https://www.sec.gov/Archives/edgar/data/1181412/000162828026052712/spacex-formsx8xresalesx8.htm',
  spx: 'https://press.spglobal.com/2026-06-04-S-P-Dow-Jones-Indices-Consultation-on-Treatment-of-MegaCap-Companies-Results',
  nexus: 'https://spacenexus.us/promises/starship-mars'
};
/* segment data: [Space, Connectivity, AI] revenue / income from operations / Segment Adjusted EBITDA, US$m */
const PER = ['Q2 2026', 'Q1 2026', 'Q2 2025', 'Q1 2025', 'FY2025', 'FY2024', 'FY2023'];
const SEG = {
  Space:        {rev: [962, 619, 746, 865, 4086, 3796, 3557],   op: [-542, -662, -369, -70, -657, 21, -1],         eb: [-205, -351, -93, 224, 653, 1154, 997]},
  Connectivity: {rev: [4291, 3257, 2588, 2475, 11387, 7599, 3869], op: [1656, 1188, 923, 1033, 4423, 2006, 469],     eb: [2597, 2087, 1583, 1617, 7168, 3849, 1602]},
  AI:           {rev: [2561, 818, 737, 727, 3201, 2620, 2961],  op: [-1257, -2469, -1524, -936, -6355, -1561, -3973], eb: [1146, -609, -276, -111, -1237, 347, 1222]}
};
const CAPEX = [18369, 10107, 2825, 4140, 20737, 11163, 4415], OCF = [2419, 1047, -376, 727, 6785, 5776, 4520];
const pct = (a, b) => { if (!b) return 'n/a'; const v = a / b * 100; return (v < -0.05 ? '−' + Math.abs(v).toFixed(1) : Math.abs(v).toFixed(1)) + '%'; };
const m = v => (v < 0 ? '−' : '') + Math.abs(v).toLocaleString('en-US');

window.SPCX_SEC = {
  asof: '16 Oct 2026',
  week: [
    ['16 Oct 2026', 'Elon on X', 'Star Mind computer co-engineered by SpaceX and Nvidia "far better than almost anyone expects" and will reach volume production next year (01:48 SGT).', 'https://x.com/elonmusk/status/2110789964430786745'],
    ['15 Oct 2026', 'Elon on X', 'Reply: unless a major world war, SpaceX probably gets to >$100T in <10 years (10:52 SGT).', 'https://x.com/elonmusk/status/2110564479742120079'],
    ['15 Oct 2026', 'Elon on X', 'Reply to Mykhailo Fedorov: Starshield is owned and controlled by the US government, which sets any speed or usage limits; Starlink is a commercial service limited to civilian or defensive use (03:00 SGT).', 'https://x.com/elonmusk/status/2110445577184133456'],
    ['14 Oct 2026', 'Ukraine', 'Ukraine says an unannounced 160 km/h speed limit on Starshield terminals disrupted drone and front-line missions; Fedorov said connectivity up to 160 km/h was being restored that evening. SpaceX did not comment.', 'BBC, 14 Oct 2026 https://www.bbc.com/news/articles/c8wy9veedgygo'],
    ['14 Oct 2026', 'Regulatory', 'FAA notice of intent for an environmental impact statement on raising Starbase to up to 456 Starship launches and 912 landings a year (now 25 and 50); Phase 1 up to 100 launches. Comments close 30 Nov; scoping meetings 17 to 19 Nov. Starts a review; approves nothing.', 'Federal Register, 14 Oct 2026 https://www.federalregister.gov/documents/2026/10/14/2026-20963/notice-of-intent-to-prepare-a-programmatic-environmental-impact-statement-peis-open-public-scoping'],
    ['14 Oct 2026', 'Analysts', 'Morgan Stanley (Adam Jonas) reiterated Overweight and a US$300 target, calling the Distributed Inference Cloud the most overlooked part of the story.', 'Investing.com, 14 Oct 2026 https://www.investing.com/news/analyst-ratings/morgan-stanley-raises-spacex-stock-price-target-on-distributed-inference-potential-93CH-4948701'],
    ['13 Oct 2026', 'Operations', 'Ship 40 (Flight 13) is standing in a Starbase Megabay; SpaceX says it will give first-of-its-kind data on a flown Starship heatshield, Raptor engines and avionics.', 'TeslaNorth, 13 Oct 2026 https://teslanorth.com/2026/10/13/spacex-ship-40-megabay-data/'],
    ['10 Oct 2026', 'Elon on X', 'Post addressed to “Prime Minister Ambani” asking him to let Starlink compete in India (01:03 SGT).', 'https://x.com/elonmusk/status/2108604227643719745'],
    ['9 Oct 2026', 'Short interest', 'FINRA short interest for settlement 30 Sep 2026: 180,996,777 shares, +11.55% vs 15 Sep; 7.03% of float; 1.83 days to cover.', 'FINRA ' + U.finra],
    ['9 Oct 2026', 'Supply', 'Day-120 lock-up tranche: up to 328.4m Class A shares (7% of the 180-day pool) eligible for release.', '424(b)(4) ' + U.p424],
    ['8 Oct 2026', 'India', 'Ministry of Communications: security assessment under way for all three satellite licensees; spectrum assignment follows only after it.', 'PIB ' + U.pib],
    ['8 Oct 2026', 'Operations', 'Unofficial FAA planning slide lists Starship Flight 15 NET 8 Nov 2026 (not a SpaceX date).', 'https://en.wikipedia.org/wiki/Starship_flight_15'],
    ['7 Oct 2026', 'Operations', 'Ship 40 arrived at the Port of Brownsville aboard the heavy-lift vessel Forte, 75 days after its Indian Ocean splashdown: the first flown Starship to return to Texas.', 'Corpus Christi Caller-Times, 9 Oct 2026 https://www.caller.com/story/news/local/texas/2026/10/09/spacex-starship-ship-40-recovered-starbase-port/92167239007/']
  ],
  next: [
    ['8 Nov 2026', 'Starship Flight 15, NET (unofficial FAA planning; not a SpaceX date)'],
    ['30 Oct 2026', 'Russell December reconstitution rank day'],
    ['26 Oct 2026', 'FINRA short interest for settlement 15 Oct 2026'],
    ['24 Oct 2026', 'Day-135 lock-up tranche, up to 328.4m shares (a Saturday; first session Mon 26 Oct)']
  ],
  /* 1) Starlink */
  countries: [
    ['8 Oct 2026', '“Licensed in over 165 countries”', 'Broadband (CEO claim)', 'Elon Musk on X https://x.com/elonmusk/status/2108187065687118261'],
    ['Q2 2026 10-Q', '167 countries, territories and other markets; over 10,200 broadband and mobile satellites', 'Broadband', '10-Q ' + U.q10],
    ['31 Mar 2026', '164 countries, territories and other markets; ≈10.3m subscribers', 'Broadband', '424(b)(4) ' + U.p424],
    ['31 Mar 2026', '≈30 countries; ≈7.4m monthly unique devices; ≈30 mobile network operator partners', 'Starlink Mobile (direct to cell)', '424(b)(4) ' + U.p424],
    ['Pending', 'India: GMPCS licence (6 Jun 2025) and IN-SPACe authorisation (8 Jul 2025) granted; security clearance, spectrum assignment and FDI approval pending; no launch date', 'Broadband', 'PIB, 8 Oct 2026 ' + U.pib],
    ['Before 31 Mar 2026', 'n/a: earlier country counts not taken from a filing', 'Broadband', 'n/a']
  ],
  /* 2) Launch */
  falconQ: [  // quarter, Falcon, customer, internal, Starship, source
    ['Q3 2026', '≤34 (calc.)', 'n/a', 'n/a', '2', 'Falcon: 111 Falcon 9 launches 1 Jan–6 Oct 2026 (KeepTrack, third-party, accessed 9 Oct 2026) minus 77 in H1 (10-Q), so it includes 1–6 Oct. Starship: Flights 13 (24 Jul) and 14 (28 Sep). Q3 10-Q not yet filed.'],
    ['Q2 2026', '37', '10', '27', '1', '10-Q ' + U.q10],
    ['Q1 2026', '40', '7', '33', '0', '10-Q six-month totals minus Q2 (calc.) ' + U.q10],
    ['Q4 2025', 'n/a', 'n/a', 'n/a', 'n/a', 'Not disclosed by quarter (FY2025: 165 Falcon 9 launches, 157 on flight-proven boosters, 424(b)(4))'],
    ['Q3 2025', 'n/a', 'n/a', 'n/a', 'n/a', 'Not disclosed by quarter'],
    ['Q2 2025', '45', '9', '36', '1', '10-Q ' + U.q10],
    ['Q1 2025', '36', '12', '24', '2', '10-Q six-month totals minus Q2 (calc.) ' + U.q10]
  ],
  reuse: [
    ['25 Aug 2026', 'B1067 flew its 37th mission (Starlink 10-49), the Falcon record; landed on A Shortfall of Gravitas', 'Space.com, 25 Aug 2026 https://www.space.com/space-exploration/launches-spacecraft/spacex-starship-record-37th-booster-flight-100-falcon-9-launches'],
    ['25 Aug 2026', 'Other fleet leaders before that launch: B1071 35 flights, B1063 34, B1069 32, B1077 and B1078 30', 'Space.com, 25 Aug 2026 https://www.space.com/space-exploration/launches-spacecraft/spacex-starship-record-37th-booster-flight-100-falcon-9-launches'],
    ['2 Oct 2026', 'Falcon 9 lifetime: 690 launches, 643 landings, 609 reflights (SpaceX website counters)', 'Tech Dev Notes changelog, third-party https://techdevnotes.com/releases/spacex-website/20261002-023534Z-81e83f2ff3e8'],
    ['Q1 2026', '39 of 40 Falcon launches used flight-proven boosters', '424(b)(4) ' + U.p424],
    ['31 Mar 2026', 'Most reflights of one first stage: 34 · boosters qualified for 40 launches', '424(b)(4) ' + U.p424],
    ['FY2025', '157 of 165 Falcon 9 launches used flight-proven boosters', '424(b)(4) ' + U.p424]
  ],
  cost: [
    ['Launch services revenue per customer launch (calc.)', 'US$64.8m (Q2 2026) · US$47.1m (Q1 2026) · US$54.4m (Q2 2025) · US$47.2m (Q1 2025)', 'Launch services revenue ÷ customer Falcon launches (10-Q); includes Falcon Heavy and rideshare, so not a list price ' + U.q10],
    ['Internal cost per Falcon launch', 'n/a', 'Not disclosed'],
    ['Cost per kg to orbit (historical)', 'US$2,700/kg (Falcon 9, 2010) · US$1,400/kg (Falcon Heavy, 2018) vs US$18,500/kg historical average', 'NASA figures quoted in the 424(b)(4) ' + U.p424],
    ['Starship cost goal', 'Reduce cost to orbit by 99% or more vs the historical average (goal, not achieved)', '424(b)(4) ' + U.p424]
  ],
  ship40: [
    ['13 Oct 2026', 'Stood upright in a Starbase Megabay for heatshield, Raptor and avionics analysis', 'https://teslanorth.com/2026/10/13/spacex-ship-40-megabay-data/'],
    ['7 Oct 2026', 'Arrived at the Port of Brownsville on the Boskalis vessel Forte (12,729 nautical miles via Africa)', 'https://vesselhunter.io/news/boskalis-forte-starship-ship-40-brownsville-christmas-island'],
    ['28 Aug 2026', 'Forte sailed from Christmas Island with the ship loaded', 'https://vesselhunter.io/news/boskalis-forte-starship-ship-40-brownsville-christmas-island'],
    ['18 Aug 2026', 'SpaceX said the ship had reached sheltered waters at Christmas Island after about 24 days under tow', 'https://www.caller.com/story/news/local/texas/2026/10/09/spacex-starship-ship-40-recovered-starbase-port/92167239007/'],
    ['24 Jul 2026', 'Flight 13: first intact Starship ocean splashdown (Indian Ocean); the ship stayed afloat', 'https://www.spacex.com/launches/starship-flight-13']
  ],
  /* 5) Elon promise tracker (non-AI rows; AI rows come from ai.js) */
  promises: [
    ['20 Aug 2026', '“Looks like we will probably catch the ship with the tower in a few months … First reflight of the ship will be either end of this year or early next.”', 'Ship catch; first ship reflight', 'Late 2026 / early 2027', 'No ship catch or reflight yet (14 Oct 2026)', 'Pending', 'https://x.com/elonmusk/status/2090305535937851863'],
    ['25 Jul 2026', '“Unless we discover problems after mission data review, SpaceX will attempt to catch the ship with the tower on next flight”', 'Ship catch on Flight 14', '28 Sep 2026 (Flight 14)', 'Flight 14 splashed down in the Pacific; no catch attempted (catch reported off before the flight)', 'Behind', 'https://x.com/elonmusk/status/2080876967839031712'],
    ['12 Jun 2026', 'Prospectus (company): “We expect Starship to commence payload delivery to orbit in the second half of 2026.”', 'Payload delivery to orbit', 'H2 2026', 'Flight 14 (28 Sep 2026) reached orbit and deployed 26 Starlink V3 satellites', 'Met', U.p424],
    ['3 Sep 2025', '“SpaceX will do orbital refilling several times next year with Starship V3.”', 'Several orbital refilling tests', 'End-2026', 'No propellant transfer attempted as of 14 Oct 2026; GAO (Jul 2026) says these tests are more than a year behind', 'Pending', 'https://x.com/elonmusk/status/1963333192938856662'],
    ['15 Mar 2025', '“Starship departs for Mars at the end of next year, carrying Optimus.”', 'Starship to Mars in the 2026 window', 'Window to ~11 Jan 2027', 'No Mars launch scheduled; on 8 Feb 2026 Musk wrote that SpaceX had shifted focus to a city on the Moon', 'Behind', 'https://x.com/elonmusk/status/1900774290682683612']
  ],
  /* 6) Supply calendar extras (lock-up rows come from data.js) */
  supply: [
    ['2027-06', 'Jun 2027 (earliest)', 'Index', 'S&P 500 eligibility: 12-month seasoning and GAAP profitability test (not met at Q2 2026)', 'n/a', 'S&P DJI, 4 Jun 2026 ' + U.spx],
    ['2026-12-21', '21 Dec 2026 (open)', 'Index', 'Nasdaq-100 annual reconstitution and quarterly rebalance effective; FTSE GEIS quarterly review effective the same day', 'n/a', 'Nasdaq methodology ' + U.ndx],
    ['2026-12-14', '14 Dec 2026 (open)', 'Index', 'Russell US reconstitution effective (after the close on 11 Dec)', 'n/a', 'LSEG ' + U.russell],
    ['2026-12-11', '11 Dec 2026', 'Index', 'Nasdaq-100 reconstitution expected to be announced after the close (6 trading days before effective)', 'n/a', 'Nasdaq methodology ' + U.ndx],
    ['2026-12-01', '1 Dec 2026', 'Index', 'MSCI November 2026 index review effective (announced 11 Nov)', 'n/a', 'MSCI ' + U.msci],
    ['2026-11-24', '24 Nov 2026', 'Short interest', 'FINRA publication for settlement 13 Nov 2026', 'n/a', 'FINRA ' + U.finra],
    ['2026-11-13', '13 Nov 2026', 'Index', 'Russell preliminary additions and deletions published', 'n/a', 'LSEG ' + U.russell],
    ['2026-11-11', '11 Nov 2026', 'Index', 'MSCI November review announced', 'n/a', 'MSCI ' + U.msci],
    ['2026-11-10', '10 Nov 2026', 'Short interest', 'FINRA publication for settlement 30 Oct 2026', 'n/a', 'FINRA ' + U.finra],
    ['2026-10-30', '30 Oct 2026', 'Index', 'Russell rank day (market cap cut-off for the December reconstitution)', 'n/a', 'LSEG ' + U.russell],
    ['2026-10-26', '26 Oct 2026', 'Short interest', 'FINRA publication for settlement 15 Oct 2026', 'n/a', 'FINRA ' + U.finra],
    ['9999', 'n/a', 'Employee vesting', 'RSU vesting dates and amounts by date: not disclosed. Employee shares follow the lock-up tranches; 136,949,657 Class A registered for employee resale (Form S-8, 4 Aug 2026)', '136.9', 'Form S-8 ' + U.s8r]
  ]
};

/* ---------- render helpers ---------- */
const S = window.SPCX_SEC;
const card = (id, title, sub, body) => `<div class="card" id="${id}" style="margin:16px 0"><h3 style="margin-top:0">${esc(title)} <span class="mut">${esc(sub)}</span></h3>${body}</div>`;
const sh = s => `<h3>${esc(s)}</h3>`;

window.secWeek = function () {
  const src = t => { const i = t.lastIndexOf('https://'); const lab = i > 0 ? t.slice(0, i).trim() : ''; const u = i >= 0 ? t.slice(i) : ''; return (lab ? esc(lab) + ' ' : '') + (u ? ext(u) : ''); };
  const li = S.week.map(r => `<li><span class="mut" style="font-size:12px">${esc(r[0])} · ${esc(r[1])}</span><br>${esc(r[2])} <span style="font-size:12px">${src(r[3])}</span></li>`).join('');
  const nx = S.next.map(r => `<li><b>${esc(r[0])}</b> · ${esc(r[1])}</li>`).join('');
  return card('wk', 'What changed this week', `${S.asof} · last 7 days · newest first`,
    `<div class="grid g2"><div><ul class="lst">${li}</ul></div><div><h3 style="margin-top:0">Coming up</h3><ul class="lst">${nx}</ul></div></div>`);
};

window.secStarlink = function () {
  const sub = D.subs, ix = l => sub.labels.indexOf(l);
  const qs = ['Q2 2026', 'Q1 2026', 'Q2 2025', 'Q1 2025', 'FY2025', 'FY2024', 'FY2023'];
  const mixRow = name => { const r = D.mix.find(x => Array.isArray(x) && x[0].trim().startsWith(name)); return qs.map(q => r[1 + D.cols.indexOf(q)]); };
  const con = mixRow('Consumer'), ent = mixRow('Enterprise'), tot = mixRow('Connectivity revenue');
  const rows = [
    ['Starlink subscribers (m)', ...qs.map(q => ix(q) >= 0 ? sub.subs_m[ix(q)].toFixed(1) : 'n/a')],
    ['Subscriber ARPU (US$/month)', ...qs.map(q => ix(q) >= 0 && sub.arpu[ix(q)] != null ? String(sub.arpu[ix(q)]) : 'n/a')],
    ['Connectivity revenue (US$m)', ...tot.map(m)],
    ['  Consumer (US$m)', ...con.map(m)],
    ['  Enterprise & government, incl. Starlink Mobile (US$m)', ...ent.map(m)],
    ['  Consumer share (calc.)', ...con.map((v, i) => pct(v, tot[i]))],
    ['  Aviation / maritime / government, each', ...qs.map(() => 'n/a')],
    ['Connectivity Segment Adj. EBITDA margin (calc.)', ...SEG.Connectivity.eb.map((v, i) => pct(v, SEG.Connectivity.rev[i]))]
  ];
  return card('starue', 'Starlink unit economics', 'filings · newest first',
    `<div class="grid g4" style="margin-bottom:12px">${kpi('Subscribers', '12.0m', 'Q2 2026 · 10.3m at Q1 2026', U.q10)}${kpi('ARPU', 'US$66/mo', 'Q2 2026 · US$85 a year earlier (−22.4%)', U.q10)}${kpi('Countries & markets', '167', 'Q2 2026 10-Q · 164 at 31 Mar 2026', U.q10)}${kpi('India', 'Pending', 'Security clearance and spectrum pending · 8 Oct 2026', U.pib)}</div>` +
    tableBlock({columns: ['Metric', ...qs], rows}, {id: 'tStarUE', noLatest: true, notes: ['The 10-Q does not split aviation, maritime and government revenue: it says only that Q2 2026 revenue rose with “an increase of $939 million in our government, aviation, maritime, and other enterprise businesses”. Starlink Mobile revenue is inside Enterprise & government.', 'Subscribers count consumer and business plans only; managed enterprise and government contracts (aviation, maritime, land mobility, fixed sites) are excluded (10-Q definition). ARPU is shown only where the company states it.', 'Sources: 424(b)(4) ' + U.p424 + ' · Q2 2026 10-Q ' + U.q10]}) +
    sh('Country approvals over time') + tableBlock({columns: ['As of', 'Coverage', 'Service', 'Source'], rows: S.countries}, {id: 'tStarC', wrap: true}));
};

window.secLaunch = function () {
  const st = (D.ops.starship || []).map(s => [s.date ? dlong(s.date) : s.dl, 'Flight ' + s.n, s.veh, s.res, s.src]);
  return card('launchc', 'Launch cadence & cost', 'filings first, third-party counts labelled · newest first',
    `<div class="grid g2" style="margin-bottom:12px">${ccard('lcQ', 'Falcon launches per quarter', 'Customer vs internal · 10-Q · Q3 2026 partial (third-party)')}${ccard('lcS', 'Starship launches per quarter', '10-Q; Q3 2026 from SpaceX flight pages')}</div>` +
    tableBlock({columns: ['Quarter', 'Falcon launches', 'Customer', 'Internal', 'Starship launches', 'Source'], rows: S.falconQ}, {id: 'tLcQ', wrap: true}) +
    sh('Booster reuse') + tableBlock({columns: ['As of', 'Reuse', 'Source'], rows: S.reuse}, {id: 'tLcR', wrap: true}) +
    sh('Cost') + tableBlock({columns: ['Metric', 'Value', 'Source / basis'], rows: S.cost}, {id: 'tLcC', wrap: true}) +
    sh('Starship test progress') + tableBlock({columns: ['Date', 'Flight', 'Vehicles', 'Result', 'Source'], rows: st}, {id: 'tLcS', wrap: true}) +
    sh('Ship 40 return') + tableBlock({columns: ['Date', 'Milestone', 'Source'], rows: S.ship40}, {id: 'tLc40', wrap: true, notes: ['Ship 40 is the first flown Starship to return to Starbase. SpaceX has not said whether it will fly again.']}));
};
window.secLaunchCharts = function () {
  const q = S.falconQ.filter(r => /^\d+$/.test(r[1])).reverse();
  chart('lcQ', {type: 'bar', data: {labels: q.map(r => r[0]), datasets: [{label: 'Customer', data: q.map(r => +r[2]), backgroundColor: C.acc}, {label: 'Internal', data: q.map(r => +r[3]), backgroundColor: C.g3}]}, options: {scales: {x: {stacked: true}, y: {stacked: true}}}});
  const s = S.falconQ.filter(r => /^\d+$/.test(r[4])).reverse();
  chart('lcS', {type: 'bar', data: {labels: s.map(r => r[0]), datasets: [{label: 'Starship', data: s.map(r => +r[4]), backgroundColor: C.acc}]}, options: {plugins: {legend: {display: false}}, scales: {y: {ticks: {stepSize: 1}}}}});
};

window.secAIScore = function () {
  const A = window.SPCX_AI; if (!A) return '';
  const gw = A.fleet_mw / 1000, perGw = (A.ann_si / 1000 / gw).toFixed(1);
  const rows = [
    ['GPUs online, end-2026', '780,000 (CEO, 25 Sep 2026)', '1.22m with two more 220k GB300 tranches (Oct and Nov), 1.44m “if we get lucky” (CEO, 25 Sep 2026)', 'Evercore ISI (28 Sep 2026): two or three tranches', 'Pending', 'https://x.com/elonmusk/status/2103329761690865846'],
    ['Compute, end-2026 (GW)', '1.4 GW nameplate (30 Jun 2026, 10-Q)', '>2 GW (company, Q2 call 4 Aug 2026)', '2.1 consensus (Evercore) · 2.4 Goldman (6 Oct) · 2.7 Evercore', 'Pending', U.q10],
    ['Colossus 2 at 1.5 GW by Apr 2026', '1.0 GW company-wide nameplate at 31 Mar 2026; 1.4 GW at 30 Jun 2026 (not like-for-like)', '1.5 GW (CEO, 17 Jan 2026)', 'n/a', 'Behind', 'https://x.com/elonmusk/status/2012500968571637891'],
    ['Colossus II next phase', 'CEO, 25 Sep 2026: 440k GB300 at Colossus 2', '+220k GB300, >400 MW (prospectus, no date)', 'n/a', 'Met (on count, per CEO post)', U.p424],
    ['Compute, end-2027 (GW)', '1.4 GW', '5 to 10 GW ambition (management, as reported by Evercore)', '5.9 consensus (Evercore) · 7.0 Goldman', 'Pending', 'https://www.insidermonkey.com/news/spacex-is-about-to-spend-53-billion-on-ai-evercore-sees-an-83-billion-payoff-1848693/'],
    ['Orbital AI compute', '0 GW', 'First satellites as early as 2028 (prospectus); 100 GW/year launched in 3 to 4 years (CEO, 23 Jan 2026)', '0.16 GW in 2028 · 2.7 GW in 2030 (Morgan Stanley)', 'Pending', 'https://x.com/elonmusk/status/2014416914550841727']
  ];
  const rv = [
    ['Reported: AI Solutions & Infrastructure revenue, Q2 2026 annualised', 'US$8.8bn', `US$${perGw}bn per GW (calc.: US$8.8bn ÷ ${gw.toFixed(2)} GW nameplate)`, U.q10],
    ['Estimate: revenue capacity at 100% utilisation, base case (this dashboard)', 'US$59.3bn', `US$${(59.3 / gw).toFixed(1)}bn per GW (calc.; range US$31.9–78.7bn)`, 'See the AI compute panel'],
    ['Goldman Sachs (6 Oct 2026): AI segment revenue FY2026 ÷ year-end GW', 'US$27.3bn ÷ 2.4 GW', `US$${(27.3 / 2.4).toFixed(1)}bn per GW (calc.; whole AI segment incl. X ads)`, 'https://www.thestreet.com/investing/stocks/spacex-stock-goldman-raises-price-target-q3-earnings'],
    ['Goldman Sachs (6 Oct 2026): FY2027 ÷ year-end GW', 'US$90.4bn ÷ 7.0 GW', `US$${(90.4 / 7).toFixed(1)}bn per GW (calc.)`, 'https://www.thestreet.com/investing/stocks/spacex-stock-goldman-raises-price-target-q3-earnings'],
    ['TD Cowen (29 Sep 2026): leasing revenue FY2026 ÷ end-2026 GW', 'US$14bn ÷ 2.1 GW', `US$${(14 / 2.1).toFixed(1)}bn per GW (calc.)`, 'https://finance.biggo.com/news/ba8b9013-80e9-49b2-bbc5-19a8a496960d'],
    ['TD Cowen (29 Sep 2026): FY2027 ÷ end-2027 GW', 'US$66bn ÷ 6.0 GW', `US$${(66 / 6).toFixed(1)}bn per GW (calc.)`, 'https://finance.biggo.com/news/ba8b9013-80e9-49b2-bbc5-19a8a496960d']
  ];
  const n = k => rows.filter(r => r[4].startsWith(k)).length;
  return card('aiscore', 'AI compute scorecard', `targets vs actual · scored ${S.asof}`,
    `<div class="grid g3" style="margin-bottom:12px">${kpi('Met', String(n('Met')), 'of ' + rows.length + ' targets')}${kpi('Behind', String(n('Behind')), 'deadline passed or not on track')}${kpi('Pending', String(n('Pending')), 'deadline still ahead')}</div>` +
    tableBlock({columns: ['Target', 'Actual so far', 'Elon / company target', 'Street (third-party, dated)', 'Score', 'Source'], rows}, {id: 'tAiSc', wrap: true, notes: ['Met = done by the deadline · Behind = deadline passed without it, or not on track on the latest data · Pending = deadline still ahead. Street figures are third-party estimates with their dates.']}) +
    sh('Revenue per GW: reported vs estimates') + tableBlock({columns: ['Basis', 'Inputs', 'Revenue per GW', 'Source'], rows: rv}, {id: 'tAiRg', wrap: true, notes: ['Street ratios divide full-year revenue by year-end capacity, so they are rough and not like-for-like with a quarter annualised.']}));
};

window.secSegFin = function () {
  const rows = [];
  for (const [k, s] of Object.entries(SEG)) {
    rows.push({section: k});
    rows.push(['Revenue', ...s.rev.map(m)]);
    rows.push(['Income (loss) from operations', ...s.op.map(m)]);
    rows.push(['Operating margin (calc.)', ...s.op.map((v, i) => pct(v, s.rev[i]))]);
    rows.push(['Segment Adjusted EBITDA (non-GAAP)', ...s.eb.map(m)]);
    rows.push(['Segment Adj. EBITDA margin (calc.)', ...s.eb.map((v, i) => pct(v, s.rev[i]))]);
  }
  rows.push({section: 'Company'});
  rows.push(['Capex (purchases of PP&E)', ...CAPEX.map(m)]);
  rows.push(['Operating cash flow', ...OCF.map(m)]);
  rows.push(['Free cash flow (calc.)', ...OCF.map((v, i) => m(v - CAPEX[i]))]);
  rows.push(['Capex by segment', ...PER.map(() => 'n/a')]);
  return card('segfin', 'Segment financials', 'US$m · 10-Q and 424(b)(4) · newest first',
    `<div class="grid g2" style="margin-bottom:12px">${ccard('sfM', 'Segment Adj. EBITDA margin by quarter (calc.)', '10-Q; Q1 = H1 − Q2')}${ccard('sfC', 'Capex vs operating cash flow by quarter (US$m)', '10-Q / 424(b)(4)')}</div>` +
    tableBlock({columns: ['US$m', ...PER], rows}, {id: 'tSegF', noLatest: true, notes: ['Segments: Space = launch (launch services plus launch & development); Connectivity = Starlink; AI = xAI, Grok and X.', 'Q1 2025 and Q1 2026 = six-month figures minus Q2 (calculated); they reconcile to the reported totals. Q3 and Q4 2025 were not disclosed separately (n/a).', 'Segment Adjusted EBITDA is the company’s non-GAAP measure (income from operations + D&A + share-based compensation + restructuring + impairment). The company does not report capex by segment.', 'Sources: Q2 2026 10-Q ' + U.q10 + ' · 424(b)(4) ' + U.p424]}));
};
window.secSegCharts = function () {
  const q = [3, 2, 1, 0], L = q.map(i => PER[i]);
  const ds = (k, c) => ({type: 'line', label: k, data: q.map(i => +(SEG[k].eb[i] / SEG[k].rev[i] * 100).toFixed(1)), borderColor: c, backgroundColor: c, tension: .25});
  chart('sfM', {type: 'line', data: {labels: L, datasets: [ds('Connectivity', C.acc), ds('Space', C.g3), ds('AI', '#888')]}, options: {scales: {y: {ticks: {callback: v => v + '%'}}}}});
  chart('sfC', {type: 'bar', data: {labels: L, datasets: [{label: 'Operating cash flow', data: q.map(i => OCF[i]), backgroundColor: C.g3}, {label: 'Capex', data: q.map(i => CAPEX[i]), backgroundColor: C.acc}]}});
};

window.secPromises = function () {
  const A = window.SPCX_AI;
  const ai = (A ? A.forecasts : []).map(r => [r[0], r[1], r[2], r[3], r[4], r[5], r[6]]);
  const all = [...S.promises, ...ai].sort((a, b) => Date.parse(b[0].replace(/^(\d+) (\w+) (\d+)$/, '$2 $1, $3')) - Date.parse(a[0].replace(/^(\d+) (\w+) (\d+)$/, '$2 $1, $3')));
  const n = k => all.filter(r => r[5].startsWith(k)).length;
  return card('promise', 'Elon promise tracker', `dated claims scored ${S.asof} · newest first`,
    `<div class="grid g3" style="margin-bottom:12px">${kpi('Met', String(n('Met')), 'of ' + all.length + ' claims')}${kpi('Behind', String(n('Behind')), 'missed or off track')}${kpi('Pending', String(n('Pending')), 'deadline still ahead')}</div>` +
    tableBlock({columns: ['Said', 'Claim (verbatim)', 'Target', 'Deadline', 'Where it stands', 'Score', 'Source'], rows: all}, {id: 'tProm', wrap: true, notes: ['Quotes are verbatim from X posts or the prospectus (company statements are marked). AI rows come from the AI compute panel.', 'Third-party cross-check for the Starship and Mars rows: SpaceNexus promise tracker (verified 26 Sep 2026) ' + U.nexus]}));
};

window.secSupply = function () {
  const R = D.releases.filter(r => !r.cond && ((r.date || '') >= '2026-10-14' || !r.date)).map(r => [r.date || r.sort || '9998', r.label, 'Lock-up', r.what ? `${r.pool} pool · ${r.what}` : r.pool + ' pool', fmt(r.shares_m, 1), '424(b)(4) ' + U.p424]);
  const rows = [...R, ...S.supply].sort((a, b) => b[0].localeCompare(a[0])).map(r => r.slice(1));
  const si = (window.SPCX_SI || {}).hist || [], L = si[0];
  return card('supply', 'Supply calendar', `lock-ups, employee shares, index dates and short interest · from ${S.asof} · latest date first`,
    `<div class="grid g4" style="margin-bottom:12px">${L ? kpi('Short interest', (L.si / 1e6).toFixed(1) + 'm', `settlement ${dlong(L.settle)} · ${L.pct_float}% of float · ${L.dtc} days to cover`, U.finra) : ''}${kpi('Next lock-up', '24 Oct 2026', 'up to 328.4m shares · first session Mon 26 Oct', U.p424)}${kpi('Largest release', '12 Jun 2027', 'Elon Musk, up to 6.4bn shares', U.p424)}${kpi('Next index event', '30 Oct 2026', 'Russell rank day', U.russell)}</div>` +
    tableBlock({columns: ['Date', 'Type', 'What', 'Shares (m, max)', 'Source'], rows}, {id: 'tSupply', wrap: true, notes: ['Lock-up rows repeat the prospectus schedule; dates tied to earnings are TBA until the company sets them. Index events show when funds trade, not whether SPCX weights change.', 'Employee RSU vesting by date is not disclosed (n/a).']}));
};
})();
