/* CapEx tracker (Operations › CapEx, #ops/capex). Management figures first; n/a where not guided. */
(function () {
  const MF = 'https://www.fool.com/earnings/call-transcripts/2026/10/20/spacex-spcx-q3-2026-earnings-call-transcript/';
  const Q3 = 'https://www.sec.gov/Archives/edgar/data/1181412/000162828026066482/spaceexplorationtechnologi.htm';
  const K8 = 'https://www.sec.gov/Archives/edgar/data/1181412/000110465926118614/tm2628247d1_8k.htm';
  const YT = 'https://youtu.be/-RRKOP_JMdI?t=2414';
  const a = (u, t) => `<a href="${u}" target="_blank" rel="noopener">${t} ↗</a>`;
  const plan = [ // period, actual, management guide, basis, source
    ['FY2028+', 'n/a', 'n/a', 'No multi-year capex plan disclosed', '—'],
    ['FY2027', 'n/a', 'n/a (no capex figure)', 'Related: ≥13 GW compute by end-2027 (Musk); ~US$40bn Apollo GPU leases start H1 2027 — leases, not company capex', a(K8, '8-K 26 Oct') + ' · ' + a(MF, 'Q3 call')],
    ['Q4 2026', 'n/a (reports ~Jan 2027)', 'US$35–40bn', 'Bret Johnsen (CFO), Q3 call 20 Oct 2026, 40:14', a(YT, 'Replay') + ' · ' + a(MF, 'Transcript')],
    ['FY2026 (calc.)', 'n/a', 'US$83.1–88.1bn', '9M actual 48.1 + Q4 guide 35–40 (calculated, not stated)', a(Q3, '8-K 20 Oct')],
    ['Q3 2026', 'US$19.6bn (SI 16.4 · Conn 1.5 · Space 1.6)', 'Guided “very similar” to Q2', 'Actual beat the prior guide by ~US$1.2bn', a(Q3, '8-K 20 Oct')],
    ['Q2 2026', 'US$18.4bn (SI 15.8)', '—', 'Q2 call 4 Aug: Q3 and Q4 “very similar” to Q2', '10-Q'],
    ['Q1 2026', 'US$10.1bn', '—', '', '10-Q (calc.)'],
  ];
  const changes = [ // newest first
    ['26 Oct 2026', 'Funding / timing', '~US$40bn Apollo-managed vehicle buys Nvidia Vera Rubin pods and leases them to SpaceX over ~5 years; close expected before year-end, leases start H1 2027 as GPUs arrive. Likely moves part of 2027 compute spend from capex to leases (our reading, not company-stated). Fitch (28 Oct): already in its forecast.', a(K8, '8-K')],
    ['20 Oct 2026', 'Guidance raised', 'Q4 2026 capex now US$35–40bn, up from “very similar to Q2” (~US$18.4bn) — roughly double. Reason: additional capacity coming online (2.5–3 GW nameplate by end-2026).', a(MF, 'Q3 call')],
    ['4 Aug 2026', 'Guidance set', 'Q3 and Q4 capex “very similar” to Q2’s US$18.4bn.', 'Q2 call'],
  ];
  window.capexPanel = function () {
    const t = (cols, rows) => `<div class="tblwrap"><table class="wrapt"><thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    return `<div class="card pbk" id="capexhl" style="margin:0 0 16px"><div class="mut" style="font-size:13px">Latest change · 20 Oct 2026</div><div class="pbv">Q4 2026 capex US$35–40bn</div><div class="mut" style="font-size:13px">Raised from “very similar to Q2” (US$18.4bn) · Q3 actual US$19.6bn · Bret Johnsen (CFO) · ${a(YT, 'Replay 40:14')}</div></div>
<div class="card" id="capexc" style="margin:0 0 16px"><h3 style="margin-top:0">CapEx plan by period <span class="mut">management guidance · newest first · as of 29 Oct 2026</span></h3>
${t(['Period', 'Actual', 'Management guide', 'Basis / timing', 'Source'], plan)}
<p class="mut" style="font-size:13px">Management has guided one quarter at a time; no FY2027 or later capex figure has been given (n/a). FY2026 total is calculated. Street estimates are not shown.</p>
<h3>What changed <span class="mut">newest first</span></h3>
${t(['Date', 'Type', 'Change', 'Source'], changes)}</div>`;
  };
})();
