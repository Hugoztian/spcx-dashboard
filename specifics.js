/* SpaceX-specific sections (preview 21 Oct 2026): Tesla merger, SI segment, financing, government, regulatory, Starship flights, governance.
   Every figure carries a dated source; n/a where not disclosed. Rows newest first. */
(() => {
const Q8K = 'https://www.sec.gov/Archives/edgar/data/1181412/000162828026066482/spaceexplorationtechnologi.htm';
const P424 = 'https://www.sec.gov/Archives/edgar/data/1181412/000162828026042639/spaceexplorationtechnologi.htm';
const L = {
  nbc: 'https://www.nbcnews.com/business/business-news/elon-musk-spacex-tesla-merger-rcna604685',
  bbc: 'https://www.bbc.com/news/articles/cmlyl09xjke4o',
  bbg: 'https://news.bloomberglaw.com/antitrust/musk-says-spacex-tesla-have-formed-committees-to-explore-merger',
  tc: 'https://techcrunch.com/2026/10/20/spacex-and-tesla-boards-form-special-committees-to-review-merger/',
  cna: 'https://www.channelnewsasia.com/business/musk-says-spacex-tesla-merger-good-idea-companies-form-deal-committees-6476721',
  ms: 'https://www.tipranks.com/news/the-countdown-begins-morgan-stanley-weighs-in-on-spacex-stock-ahead-of-earnings',
  comp: 'https://x.com/elonmusk/status/2112017286764659176',
  faa: 'https://www.faa.gov/space/stakeholder_engagement/spacex_starship',
  fr: 'https://www.federalregister.gov/documents/2026/10/14/2026-20963/notice-of-intent-to-prepare-a-programmatic-environmental-impact-statement-peis-open-public-scoping',
  tn: 'https://teslanorth.com/2026/10/13/faa-starbase-starship-456-peis/',
  sp15: 'https://www.space.com/space-exploration/launches-spacecraft/spacex-will-attempt-1st-ever-double-starship-rocket-catch-on-next-test-launch-a-profound-technology-milestone-elon-musk-says',
  nsf15: 'https://www.nasaspaceflight.com/2026/10/spacex-flight-15-16-milestones/',
  wiki: 'https://en.wikipedia.org/wiki/List_of_Starship_launches',
  f14: 'https://www.spacex.com/launches/starship-flight-14/',
  bbcUa: 'https://www.bbc.co.uk/news/articles/c8wy9veedgygo',
  cnnUa: 'https://www.cnn.com/2026/10/14/europe/russia-ukraine-energy-strike-early-warning-intl-hnk',
  a3: 'https://www.nasa.gov/mission/artemis-iii/',
  sli: 'https://slinews.com/technology/starship-propellant-transfer-demo-on-orbit-refueling/',
  nssl: 'https://spacenews.com/spacex-lands-majority-of-u-s-national-security-launches-awarded-for-fiscal-year-2026/',
};
const card = (id, title, sub, body) => `<div class="card" id="${id}" style="margin:16px 0"><h3 style="margin-top:0">${esc(title)} <span class="mut">${esc(sub)}</span></h3>${body.replace(/>https?:\/\/(?:www\.)?([^/<\s]+)[^<]*<\/a>/g, '>$1 ↗</a>')}</div>`;
const m = v => v == null ? 'n/a' : (v < 0 ? '−' : '') + 'US$' + Math.abs(v).toLocaleString('en-US') + 'm';
const T = (cols, rows, id, notes) => tableBlock({columns: cols, rows}, {id, wrap: true, noLatest: true, notes});

/* 1) Tesla merger tracker — Musk tab */
window.secMerger = () => card('merger', 'Tesla merger tracker', 'exploratory only · newest first',
  `<div class="grid g4" style="margin-bottom:12px">${kpi('Status', 'Committees formed', 'No terms agreed; no deal certain (Musk, 20 Oct 2026)', L.nbc)}${kpi('Tesla approval needed', '50% of all shares', 'Not just a majority of votes cast (Musk, 20 Oct 2026)', L.bbg)}${kpi('Musk role', 'Recused', 'Conflicted party; not on either committee', L.nbc)}${kpi('Terms / price', 'n/a', 'None disclosed', '')}</div>` +
  T(['Date', 'Event', 'Source'], [
    ['20 Oct 2026', 'Q3 call: SpaceX and Tesla boards have each formed special committees of independent directors, at shareholders’ request, to discuss a merger. Members not named. Musk: “a good idea, but it’s really up to the special committees”; committees “have not reached agreement on terms … and there’s no guarantee that they will”.', 'NBC News, 20 Oct 2026 ' + L.nbc + ' · TechCrunch ' + L.tc],
    ['20 Oct 2026', 'Musk: Tesla would need approval of 50% of all shareholders, rather than a majority of those voting — “quite a high hurdle to achieve”.', 'BBC, 21 Oct 2026 ' + L.bbc + ' · Bloomberg Law ' + L.bbg],
    ['20 Oct 2026', 'Reuters (unnamed source): talks began in recent weeks and could result in SpaceX acquiring Tesla; Tesla is working with an investment bank. Not confirmed by either company.', 'CNA / Reuters, 20 Oct 2026 ' + L.cna],
    ['Mid-Oct 2026', 'Barclays suggested a deal could be announced before Tesla’s annual meeting in December (third-party view).', 'CNA / Reuters, 20 Oct 2026 ' + L.cna],
    ['Next steps', 'Committee recommendation, terms, fairness opinions, proxy and shareholder votes: dates n/a.', 'n/a']], 'tMerger',
    ['Implications (sourced, not forecasts): Musk owns nearly a fifth of Tesla and just under half of SpaceX, and analysts say a merger would give him control of the combined entity (Reuters via CNA, 20 Oct 2026). Musk cited cooperation on superintelligence software, chip design (Terafab, first test chip around May–June 2027), robotics and connectivity. Market values cited by BBC on 21 Oct 2026: Tesla about US$1.5tn, SpaceX about US$2tn.',
     'A related-party deal of this size would need special-committee approval at both companies and both shareholder votes; exchange ratio, structure and timetable are n/a.']));

/* 2) Super Intelligence segment — Operations tab */
window.secSI = () => card('sicard', 'Super Intelligence (SI) segment', 'Q3 2026 8-K · formerly AI',
  `<div class="grid g4" style="margin-bottom:12px">${kpi('SI revenue Q3', 'US$7,560m', '+830% y/y; +195% q/q', Q8K)}${kpi('Income from operations', 'US$431m', 'After US$1,217m Cursor-related share-based pay', Q8K)}${kpi('Cursor revenue', 'US$608m', '14 Aug–30 Sep 2026', Q8K)}${kpi('Nameplate compute', '1.7 GW', '30 Sep 2026 · 1.4 GW at 30 Jun', Q8K)}</div>` +
  T(['US$m', 'Q3 2026', 'Q2 2026', 'Q3 2025', 'Note'], [
    ['Advertising revenue', '538', '367', '454', 'X advertising'],
    ['SI solutions & infrastructure revenue', '7,022', '2,194', '359', 'Cloud services agreements, Cursor, Grok'],
    ['  of which Cursor (from 14 Aug 2026)', '608', 'n/a', 'n/a', 'Acquisition closed 14 Aug 2026'],
    ['  excluding Cursor (calc.)', '6,414', '2,194', '359', '7,022 − 608'],
    ['SI revenue', '7,560', '2,561', '813', ''],
    ['Income (loss) from operations', '431', '−1,257', '−1,722', ''],
    ['  Cursor-related share-based compensation', '1,217', '—', '—', 'Excluded from Segment Adj. EBITDA'],
    ['  Income from operations before Cursor SBC (calc.)', '1,648', '−1,257', '−1,722', '431 + 1,217'],
    ['Depreciation & amortization', '2,473', '1,885', '922', ''],
    ['SI Adjusted EBITDA (non-GAAP)', '4,953', '1,146', '−428', ''],
    ['SI capex', '16,444', '15,828', '4,760', ''],
    ['Nameplate compute (GW)', '1.7', '1.4', '0.6', 'Buildout of Colossus II']], 'tSI',
    ['Cursor: implied equity value US$60bn; GAAP purchase consideration US$42.5bn; equity awards for post-acquisition service US$23.4bn, expensed over vesting (8-K, 20 Oct 2026 ' + Q8K + ').',
     'Compute shortage: on 19 Oct 2026 Musk said SpaceX had tried to rent inference compute from AWS, GCP “or anyone else” to move load off its training clusters, without success (' + L.comp + '). SI customers’ capacity pipeline grew in Q3 (8-K).',
     'Colossus II next phase: at least 220,000 more GB300 and over 400 MW (424(b)(4)); CEO post 25 Sep 2026: 440k GB300 at Colossus 2. See the SI compute scorecard above.']));

/* 3) Financing & cash burn — Financials tab */
window.secFinancing = () => {
  const cash = 51294 + 38561, debt = 2698 + 36146, fcf9 = 13097 - 48069, fcfQ3 = 9631 - 19593;
  return card('financing', 'Financing & cash burn', '30 Sep 2026 · Q3 2026 8-K',
  `<div class="grid g4" style="margin-bottom:12px">${kpi('Cash & marketable securities', m(cash), '51,294 cash + 38,561 securities', Q8K)}${kpi('Debt & finance leases', m(debt), '2,698 current + 36,146 long-term', Q8K)}${kpi('Free cash flow, 9M 2026 (calc.)', m(fcf9), 'OCF 13,097 − capex 48,069', Q8K)}${kpi('Runway at Q3 burn (calc.)', (cash / -fcfQ3).toFixed(1) + ' quarters', 'Cash & securities ÷ Q3 FCF of ' + m(fcfQ3) + '; not a forecast', Q8K)}</div>` +
  T(['US$m', '9M 2026', '9M 2025', 'Source'], [
    ['Net cash from operating activities', '13,097', '4,120', '8-K'],
    ['Purchases of PP&E (capex)', '−48,069', '−13,846', '8-K'],
    ['Free cash flow (calc.)', m(fcf9).replace('US$', '').replace('m', ''), '−9,726', 'calc.'],
    ['IPO proceeds, net', '85,675', '—', '8-K'],
    ['Proceeds from debt and other financing', '51,834', '10,947', '8-K'],
    ['Repayments of debt and other financing', '−39,845', '−6,014', '8-K'],
    ['Debt extinguishment premium', '−1,153', '—', '8-K'],
    ['Capital stock issued (net)', '8,319', '5,299', '8-K'],
    ['Share repurchases', '−4,426', '−525', '8-K'],
    ['Net cash from financing', '99,819', '9,440', '8-K'],
    ['Purchases of marketable securities', '−46,834', '−601', '8-K']], 'tFinancing',
    ['Runway uses Q3 2026 free cash flow (OCF 9,631 calc. − capex 19,593) and ignores new financing, capex changes and SI contract prepayments (deferred revenue rose US$4,922m in 9M). At the 9M average burn of ' + m(Math.round(fcf9 / 3)) + ' a quarter it would be ' + (cash / (-fcf9 / 3)).toFixed(1) + ' quarters (calc.).',
     'Morgan Stanley (Adam Jonas), 19 Oct 2026: the need for additional financing is the biggest risk to its model; it models debt issuance of US$60bn, US$80bn and US$90bn in 2027, 2028 and 2029 (third-party; TipRanks ' + L.ms + ').',
     'Debt maturities, interest rates and credit ratings: n/a in the 8-K (await the Q3 10-Q). Related-party debt: US$2,181m current and US$10,716m long-term.',
     'Source: Q3 2026 8-K, 20 Oct 2026 ' + Q8K]));
};

/* 4) Government business — Business tab */
window.secGovt = () => card('govt', 'Government business', 'NASA · national security · Starshield · newest first',
  `<div class="grid g3" style="margin-bottom:12px">${kpi('Q3 NSSL signings', '18 missions', 'Plus 3 NASA ISS crew missions (8-K)', Q8K)}${kpi('Connectivity: enterprise & government', 'US$2,127m', 'Q3 2026 · +91% y/y; government not split out', Q8K)}${kpi('Government revenue share', 'n/a', 'Not disclosed by customer type', '')}</div>` +
  T(['Date', 'Programme', 'Milestone / event', 'Status', 'Source'], [
    ['20 Oct 2026', 'NSSL / NASA', 'Q3: signed 18 National Security Space Launch missions, three more NASA ISS crew missions, three commercial Starfall missions and a Starship lunar-surface payload contract; launched NASA’s Nancy Grace Roman Space Telescope.', 'Reported', '8-K, 20 Oct 2026 ' + Q8K],
    ['14 Oct 2026', 'Starshield (Ukraine)', 'Ukraine said Starshield terminals were limited without warning; connectivity cut above about 100 mph (160 km/h), disrupting drone operations. Partly restored by 15 Oct (Fedorov). Musk: Starshield is “owned and controlled by the US government”; limits are decided by the US military “and ultimately POTUS”.', 'Partly restored', 'BBC, 15 Oct 2026 ' + L.bbcUa + ' · CNN ' + L.cnnUa],
    ['28 Sep 2026', 'Artemis HLS', 'Starship Flight 14 reached orbit for the first time (relevant to HLS orbital operations).', 'Met', 'SpaceX, 28 Sep 2026 ' + L.f14],
    ['Later 2026 (target)', 'Artemis HLS', 'Ship-to-ship cryogenic propellant transfer demo (two Starships). Slipped from March 2025 and June 2026; flight system review passed.', 'Pending', 'SLI News, mid-2026 ' + L.sli],
    ['2027 (NASA)', 'Artemis III', 'Now a low-Earth-orbit crewed test of Orion rendezvous and docking with Starship and Blue Moon landers; not a landing.', 'Pending', 'NASA Artemis III page ' + L.a3],
    ['Early 2028 (NASA plan)', 'Artemis IV', 'First crewed lunar landing candidate; needs certified propellant transfer.', 'Pending', 'SLI News ' + L.sli],
    ['1 Oct 2025', 'NSSL Phase 3 Lane 2', 'FY26 assignments: 5 missions to SpaceX (4 Falcon Heavy), launches NET FY27.', 'Awarded', 'SpaceNews ' + L.nssl]], 'tGovt',
    ['HLS contract values and NSSL dollar values are not restated here (n/a in the 8-K). Starshield revenue is not disclosed separately.']));

/* 5) Regulatory calendar — Risks tab */
window.secReg = () => card('regcal', 'Regulatory calendar', 'FAA · spectrum · licences · latest first',
  T(['Date', 'Regulator', 'Item', 'Status', 'Source'], [
    ['H1 2027 (expected close)', 'FCC', '800 MHz spectrum: agreement (8 Oct 2026) to acquire up to 14 MHz of paired nationwide low-band spectrum for Starlink Mobile.', 'Pending approval', '8-K, 20 Oct 2026 ' + Q8K],
    ['30 Nov 2026', 'FAA', 'Starbase PEIS scoping comments close (docket FAA-2026-12808). Proposal: up to 100 launches/200 landings a year (Phase 1), then up to 456 launches/912 landings (Phase 2). Current cap: 25 launches a year.', 'Open', 'FAA ' + L.faa + ' · Federal Register, 14 Oct 2026 ' + L.fr],
    ['17–19 Nov 2026', 'FAA', 'PEIS scoping meetings: Brownsville (17 Nov), virtual (18 Nov), Port Isabel (19 Nov).', 'Scheduled', 'TeslaNorth, 13 Oct 2026 ' + L.tn],
    ['NET 8 Nov 2026 (provisional)', 'FAA', 'Starship Flight 15 licence modification for return to Starbase and tower catch of booster and ship. Shotwell expects the licence to include both catches; no approval published yet.', 'Pending', 'Space.com, 20 Oct 2026 ' + L.sp15 + ' · NSF, Oct 2026 ' + L.nsf15],
    ['8 Oct 2026', 'India DoT / IN-SPACe', 'Starlink India: security assessments in progress for all three satellite licensees; spectrum assignment only after completion.', 'Pending', 'PIB, 8 Oct 2026 ' + 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2320510'],
    ['n/a', 'FAA', 'Draft PEIS publication and record of decision.', 'n/a', 'FAA ' + L.faa]], 'tReg',
    ['Dates are as published; FAA provisional launch dates (CADENA) are not SpaceX dates.']));

/* 6) Starship flight scorecard — Operations tab */
window.secStarship = () => {
  const F = [
    ['15', 'NET 8 Nov 2026', 'B22 / S42', 'First attempt to catch both booster and ship at the tower', 'Upcoming', 'Musk: “more likely than not” to succeed', L.sp15],
    ['14', '28 Sep 2026', 'B21 / S41', 'First orbit; deploy 26 Starlink V3; 6 orbits; deorbit burn', 'Met mostly', 'Orbit and all 26 deployed; one Raptor shut down early; flight cut to about 3 h; controlled splashdowns', L.f14],
    ['13', '24 Jul 2026', 'B20 / S40', 'Deploy Starlink V3; ship splashdown', 'Partial', 'First V3 deploy; ship splashed down and survived tip-over; booster lost (10 of 13 landing engines lit)', L.wiki],
    ['12', '22 May 2026', 'B19 / S39', 'Block 3 debut; Pad 2; payload deploy; relight', 'Partial', 'Ship reached SECO, deployed 22 payloads, relight skipped; booster lost', L.wiki],
    ['11', '13 Oct 2025', 'B15-2 / S38', 'Last Block 2; deploy; relight; reentry with tiles removed', 'Met', 'All objectives; both controlled splashdowns', L.wiki],
    ['10', '26 Aug 2025', 'B16 / S37', 'Deploy simulators; relight', 'Met', 'Deploy and relight; engine-section damage; on-target splashdown', L.wiki],
    ['9', '27 May 2025', 'B14-2 / S35', 'First booster reuse; deploy', 'Failed', 'Payload door failed; leak and loss of control; booster lost', L.wiki],
    ['8', '6 Mar 2025', 'B15 / S34', 'Deploy simulators', 'Failed', 'Ship lost on ascent; booster caught', L.wiki],
    ['7', '16 Jan 2025', 'B14 / S33', 'Block 2 debut', 'Failed', 'Ship lost (propellant leak); booster caught', L.wiki],
    ['6', '19 Nov 2024', 'B13 / S31', 'Booster catch; in-space relight', 'Partial', 'Relight done; catch aborted to ocean', L.wiki],
    ['5', '13 Oct 2024', 'B12 / S30', 'First booster catch', 'Met', 'Booster caught; ship on-target splashdown', L.wiki],
    ['4', '6 Jun 2024', 'B11 / S29', 'Controlled splashdowns', 'Met', 'Both controlled splashdowns', L.wiki],
    ['3', '14 Mar 2024', 'B10 / S28', 'Full-duration burn; propellant transfer demo', 'Partial', 'Reached space; ship lost on reentry; booster lost', L.wiki],
    ['2', '18 Nov 2023', 'B9 / S25', 'Hot staging', 'Failed', 'Hot staging done; both stages lost', L.wiki],
    ['1', '20 Apr 2023', 'B7 / S24', 'Clear the pad; stage separation', 'Failed', 'Lost before separation', L.wiki]];
  const n = k => F.filter(r => r[4].startsWith(k)).length;
  return card('starshipsc', 'Starship flight scorecard', 'goals vs outcome · newest first',
    `<div class="grid g4" style="margin-bottom:12px">${kpi('Flights', '14', 'to 28 Sep 2026', L.wiki)}${kpi('Met', String(n('Met')), 'main goals achieved')}${kpi('Partial', String(n('Partial')), 'some goals missed')}${kpi('Failed', String(n('Failed')), 'vehicle lost before main goals')}</div>` +
    T(['Flight', 'Date', 'Booster / ship', 'Main goals', 'Score', 'Outcome', 'Source'], F.map(r => [r[0], r[1], r[2], r[3], r[4], r[5], r[6]]), 'tStarship',
      ['Scores are this dashboard’s judgement against each flight’s published goals, not SpaceX’s. Outcome summaries from SpaceX flight pages and the Wikipedia launch list (accessed 21 Oct 2026). Ship tower catch: not yet attempted.']));
};

/* 7) Governance — Insiders tab */
window.secGovern = () => {
  const B = (window.SPCX_BOARD || {}).board || [], mu = B.find(b => /Musk/.test(b.name));
  const ind = B.filter(b => b.ind === 'Yes').length;
  const voteB = 5339 * 10, voteA = 8240, pctB = (voteB / (voteA + voteB) * 100).toFixed(1);
  return card('govern', 'Governance', 'dual-class control · board',
    `<div class="grid g4" style="margin-bottom:12px">${kpi('Musk voting power', mu ? mu.pro[4] : 'n/a', '424(b)(4) beneficial-ownership table, after the IPO', P424)}${kpi('Class B share of votes (calc.)', pctB + '%', '5,339m Class B × 10 votes vs 8,240m Class A, 30 Sep 2026', Q8K)}${kpi('Board', B.length ? B.length + ' directors' : 'n/a', ind + ' independent (424(b)(4))', P424)}${kpi('Lock-up (Musk)', '12 Jun 2027', '424(b)(4)', P424)}</div>` +
    T(['Feature', 'Detail', 'Source'], [
      ['Dual-class shares', 'Class A: 1 vote; Class B: 10 votes. Class B holders elect a majority of the board. Class C (482m at 31 Dec 2025) no longer outstanding at 30 Sep 2026.', '424(b)(4) ' + P424 + ' · 8-K ' + Q8K],
      ['Controlled company', 'Musk controls a majority of votes, so shareholder-approved matters (including any merger vote at SpaceX) depend on him.', '424(b)(4) ' + P424],
      ['Tesla merger conflict', 'Musk is excluded from both special committees as a conflicted party (20 Oct 2026).', 'NBC News ' + L.nbc],
      ['Board roster and holdings', 'See the Board of Directors table in this tab (Form 4 and 424(b)(4)).', '—']], 'tGovern',
      ['The 84.4% figure is the 424(b)(4) post-offering voting power including options exercisable within 60 days; the prospectus cover’s “approximately 82.4%” uses a narrower basis. Current voting power after 30 Sep share changes: n/a (no new ownership table).']));
};
})();
