/* "From the Q3 call" blocks (Q3 2026 earnings webcast, 20 Oct 2026, 3:30 p.m. CT = 04:30 SGT 21 Oct).
   Primary text: Motley Fool transcript; timestamps: Benzinga's full restream of the webcast on YouTube.
   Quotes are verbatim from the transcript; figures are as stated on the call. */
(() => {
const V = 'https://www.youtube.com/watch?v=-RRKOP_JMdI', MF = 'https://www.fool.com/earnings/call-transcripts/2026/10/20/spacex-spcx-q3-2026-earnings-call-transcript/';
const ts = t => { const [a, b] = t.split(':').map(Number); return `https://youtu.be/-RRKOP_JMdI?t=${a * 60 + b}`; };
const blk = (id, title, rows, notes) => `<div class="card" id="${id}" style="margin:16px 0"><h3 style="margin-top:0">${esc(title)} <span class="mut">Q3 2026 earnings call, 20 Oct 2026 (US time)</span></h3>` +
  tableBlock({columns: ['Type', 'What was said', 'Speaker', 'Video time', 'Source'], rows: rows.map(r => [r[0], r[1], r[2], r[3] || 'n/a', r[3] ? ts(r[3]) : MF])}, {id: 't' + id, wrap: true, noLatest: true, notes: [
    'Text from the Motley Fool transcript, 21 Oct 2026 ' + MF + '. Video times refer to Benzinga’s full restream of the webcast on YouTube ' + V + ' (the company streamed the call on X; no SpaceX YouTube upload was found on 21 Oct 2026).', ...(notes || [])]})
  .replace(/>https?:\/\/(?:www\.)?([^/<\s]+)[^<]*<\/a>/g, '>$1 ↗</a>') + '</div>';

window.callSI = () => blk('callsi', 'From the Q3 call: Super Intelligence (SI)', [
  ['Metric', 'Nameplate compute 1.7 GW at 30 Sep, with “additional data halls already online in early October”.', 'Bret Johnsen (CFO)', '36:09'],
  ['Metric', 'SI solutions & infrastructure revenue US$7bn, of which US$608m from Cursor; excluding Cursor it grew 192% q/q.', 'Bret Johnsen (CFO)', '36:17'],
  ['Metric', 'Excluding US$1.2bn of Cursor-related share-based compensation, SI operating profit was US$1.6bn; Cursor awards (US$23bn of the US$60bn equity value) are expensed over roughly 3 years.', 'Bret Johnsen (CFO)', ''],
  ['Metric', 'Grok Bot (launched August): 800,000 paid weekly users earlier in October, more than doubling over the month. Grok Enterprise customers above US$1m run-rate up 50% q/q (pro forma, incl. Cursor).', 'Gwynne Shotwell (President & COO)', '29:40'],
  ['Metric', 'Deploying roughly 200,000 GB300s per month for the rest of 2026, continuing that pace in 2027 (mainly Vera Rubin).', 'Elon Musk (CEO)', '16:58'],
  ['Pricing', 'New compute deployments have a payback of less than a year; pricing is “tracking slightly above the high end of the $30 to $50 per watt range”.', 'Bret Johnsen (CFO)', '37:08'],
  ['Guidance', 'Nearly 2.2 GW of nameplate compute by end-October; 2.5 to 3 GW by end-2026.', 'Bret Johnsen (CFO)', '39:54'],
  ['Guidance', '“I would be surprised if we brought on less than 13 gigawatts of compute by the end of next year”; aiming for an incremental 20 GW of power and cooling in 2027 (a “small possibility” of over 20 GW of compute).', 'Elon Musk (CEO)', '17:44'],
  ['Guidance', 'Most powerful training cluster online by end of Q2 2027: 440,000 Vera Rubin computers.', 'Elon Musk (CEO)', '18:58'],
  ['Comment', 'Compute split “50-50, more or less” between internal use and renting to others; prefers short-term contracts at spot rates because “the value of compute per watt will increase over time, not decrease”; renewals at higher dollars per watt.', 'Elon Musk (CEO)', '60:00'],
  ['Risk', '“I think we’re going to face a shortage of super intelligence compute. And that shortage is going to remain for a long time.” Power, cooling and electrical infrastructure are the limiting factor.', 'Elon Musk (CEO)', '61:11']],
  ['The ~200,000/month GB300 figure is from the prepared remarks (16:58) and is confirmed; Q&A captions at 46:37 read differently.']);

window.callConn = () => blk('callconn', 'From the Q3 call: Connectivity (Starlink)', [
  ['Metric', 'Active in 174 markets (new: Vietnam, Uganda); 1.6m consumer net adds to 13.6m, plus hundreds of thousands of enterprise and aviation subscribers.', 'Gwynne Shotwell (President & COO)', '25:01'],
  ['Metric', 'Aviation: contracted for roughly 12,000 planes (“almost 1/4 of the available aircraft”); aviation production rate quadrupled since January and expected to double again by year-end.', 'Gwynne Shotwell (President & COO)', '26:20'],
  ['Metric', 'Starlink Mobile: over 22 million monthly users, +37% q/q; FCC approval to launch 15,000 Mobile V2 satellites.', 'Gwynne Shotwell (President & COO)', '28:41'],
  ['Metric', 'Gross margin 55%, including a one-time benefit of roughly 3 points mainly from tariff refunds; ARPU US$69 (+5% q/q) on customer mix; V5 kit production ramp easing inventory constraints.', 'Bret Johnsen (CFO)', '34:26'],
  ['Guidance', 'Mobile V2 satellites fly on Starship from 2027; service on the new spectrum targeted for early 2028. Each Starship V3 launch ramping towards over 20x the downlink capacity of a Falcon 9 launch.', 'Gwynne Shotwell / Bret Johnsen', '35:02'],
  ['Guidance', 'A few hundred V3 satellites are needed before users “really feel the impact”; achievable by mid-2027.', 'Gwynne Shotwell (President & COO)', '64:19'],
  ['Comment', 'Enterprise and government revenues, each, on pace to exceed consumer connectivity revenues in future; Starshield growth cited.', 'Gwynne Shotwell (President & COO)', '27:34'],
  ['Comment', 'Within about three years, roughly 100x the bandwidth of today’s constellation (about 100,000 satellites); “a clear path to several hundred billion dollars a year in connectivity revenue”.', 'Elon Musk (CEO)', '13:28'],
  ['Risk', 'Q3 margin flattered by one-time items; Evercore asked whether the US spectrum portfolio can compete with incumbents (Shotwell: S-band to carry the majority, 800 MHz for building penetration).', 'Bret Johnsen / Gwynne Shotwell', '56:54']]);

window.callSpace = () => blk('callspace', 'From the Q3 call: Space (launch, Starship, government)', [
  ['Metric', '35 launches in Q3: 21 Starlink on Falcon 9, 2 Starship, 1 Falcon Heavy (NASA Roman telescope), 12 customer missions, 6 national security missions.', 'Gwynne Shotwell (President & COO)', '21:57'],
  ['Metric', 'Signed 18 new National Security Space Launch missions, three more Dragon crew missions (through 2028), Starlink communications for Artemis III, a Starship lunar-surface payload and three Starfall missions.', 'Gwynne Shotwell (President & COO)', '22:37'],
  ['Metric', 'Space revenue up 6% y/y on a favorable customer mix despite fewer launches; investing in Raptor and vehicle production, Gigabay and pads at Starbase and the Cape.', 'Bret Johnsen (CFO)', ''],
  ['Guidance', 'Flight 15 next month: attempt to catch both booster and ship; “more likely than not that this succeeds next flight”.', 'Elon Musk (CEO)', '09:46'],
  ['Guidance', 'Return both stages to the tower this year, refly the second stage by early 2027, on-orbit refueling attempt early 2027, Mobile V2 and Starmind satellites from 2027.', 'Gwynne Shotwell (President & COO)', '24:05'],
  ['Guidance', 'Starship weekly at some point in H1 2027, twice weekly or more by end-2027.', 'Elon Musk (CEO)', ''],
  ['Guidance', 'Louisiana: internal aim for first launch in 2028; “29 is highly likely”; eventually “20 or more launch towers”.', 'Elon Musk (CEO)', '64:56'],
  ['Comment', 'Expects the FAA licence for Flight 15 to include return to launch site and tower catch for both stages.', 'Gwynne Shotwell (President & COO)', '24:26'],
  ['Risk', '“Success is not guaranteed on these first flights.”', 'Elon Musk (CEO)', '09:46']]);

window.callCo = () => blk('callco', 'From the Q3 call: company outlook', [
  ['Guidance', 'Q1 2027 total revenue US$33bn to US$37bn.', 'Bret Johnsen (CFO)', '40:48'],
  ['Guidance', 'Q4 2026 capex US$35bn to US$40bn (Q3: US$19.6bn); Q4 gross margin more consistent with Q2.', 'Bret Johnsen (CFO)', '40:14'],
  ['Metric', 'Backlog US$63bn at 30 Sep, of which US$17.5bn deferred revenue; about US$42bn to be recognised within a year.', 'Bret Johnsen (CFO)', '39:11'],
  ['Guidance', 'On track for US$100bn ARR by end-2026 (December annualised).', 'Bret Johnsen (CFO)', '39:34'],
  ['Comment', 'ARR by end-2027 “somewhere between $500 billion and $1 trillion”.', 'Elon Musk (CEO)', '20:51'],
  ['Comment', 'Funding: operating cash flow first, then debt markets (investment grade) and vendor/customer partnerships; aims to keep investment-grade status.', 'Bret Johnsen (CFO)', '50:43'],
  ['Risk', 'Tesla merger: “the special committees have not reached agreement on the terms of any transaction. And obviously, there’s no guarantee that they will.”', 'Elon Musk (CEO)', '54:13']]);
})();
