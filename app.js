/* SpaceX (SPCX) Dashboard · © 2026 Hugo Tian. All rights reserved. Data from data.js (build_data.py), feed.js (build_feed.py) and x_feed.js (build_x.py). */
'use strict';
const D = window.SPCX_DATA;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt = (v, d = 0) => v == null || isNaN(v) ? 'n/a' : Number(v).toLocaleString('en-US', {minimumFractionDigits: d, maximumFractionDigits: d});
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const dlong = iso => { if (!iso) return ''; const [y, m, d] = iso.slice(0, 10).split('-').map(Number); return `${d} ${MON[m-1]} ${y}`; };
const pct = (v, d = 1) => v == null || isNaN(v) ? 'n/a' : (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(d) + '%';
const pcls = v => v == null ? 'mut' : v >= 0 ? 'pos' : 'neg';
const money = (v, d = 1) => v == null ? 'n/a' : (v < 0 ? '−$' : '$') + fmt(Math.abs(v), d) + 'm';
const qshort = q => q.replace(/^Q(\d) (\d{2})(\d{2})$/, "Q$1'$3");
const linkify = s => esc(s).replace(/(https?:\/\/[^\s;,)]+)/g, (u) => `<a href="${u}" target="_blank" rel="noopener">${u.length > 60 || /\/status\/\d/.test(u) ? u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] + ' ↗' : u}</a>`);
const isDark = () => { const t = document.documentElement.dataset.theme; return t ? t === 'dark' : !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches); };
const info = (k, extra = '') => `<i class="i" tabindex="0" data-tip="${esc('<b>' + esc(k) + '</b>' + (extra ? ' — ' + esc(extra) : ''))}">i</i>`;
(function tips() {
  const tip = $('#tip'); let cur = null;
  const show = el => { cur = el; tip.innerHTML = el.dataset.tip; tip.classList.add('on'); const r = el.getBoundingClientRect(); const w = Math.min(300, innerWidth - 16);
    tip.style.maxWidth = w + 'px'; const tw = tip.offsetWidth, th = tip.offsetHeight; let x = Math.min(Math.max(8, r.left + r.width / 2 - tw / 2), innerWidth - tw - 8); let y = r.top - th - 8; if (y < 56) y = r.bottom + 8;
    tip.style.left = x + 'px'; tip.style.top = y + 'px'; };
  const hide = () => { cur = null; tip.classList.remove('on'); };
  document.addEventListener('mouseover', e => { const el = e.target.closest('[data-tip]'); if (el && el !== cur) show(el); else if (!el && cur) hide(); });
  document.addEventListener('focusin', e => { const el = e.target.closest('[data-tip]'); if (el) show(el); });
  document.addEventListener('focusout', e => { if (!e.relatedTarget || !e.relatedTarget.closest('[data-tip]')) hide(); });
  document.addEventListener('click', e => { const el = e.target.closest('[data-tip]'); if (el) show(el); else hide(); }, true);
  addEventListener('scroll', hide, {passive: true});
})();
let TID = 0;
const BAD = /cost of revenue|development|administrative|liabilit|capex|preferred/i;
function cellFmt(v, col) {
  if (v == null || v === '') return ['', ''];
  if (typeof v === 'number') { const h = String(col || ''); let s;
    if (/%/.test(h) && !Number.isInteger(v)) s = fmt(v, 1);
    else if (Number.isInteger(v)) s = Math.abs(v) >= 10000 ? fmt(v, 0) : String(v);
    else s = fmt(v, Math.abs(v) < 10 ? 2 : 1);
    return [s, v < 0 ? 'neg-num' : '']; }
  const s = String(v); if (/^(n\/a|n\/m|n\/p)$/i.test(s)) return [s, 'na'];
  return [s, ''];
}
/* long notes and source lines sit behind a quiet disclosure */
function fnote(lines, label = 'Notes & sources', raw = false) { lines = (lines || []).filter(x => x != null && String(x).trim() !== ''); if (!lines.length) return '';
  return `<details class="fn"><summary>${esc(label)} <span class="fnn">${lines.length}</span></summary><ul class="notes">${lines.map(n => `<li>${raw ? n : linkify(n)}</li>`).join('')}</ul></details>`; }
function tableBlock(t, o = {}) {
  const id = o.id || ('t' + (++TID)); const cols = t.columns; const qcols = cols.map((c, i) => /^Q[1-4]\s?'?\d{2}/.test(String(c)) ? i : -1).filter(i => i >= 0);
  const lastQ = qcols.length ? qcols[qcols.length - 1] : -1, prevQ = qcols.length > 1 ? qcols[qcols.length - 2] : -1;
  let h = '';
  if (t.title && !o.notitle) h += `<h3>${esc(t.title)}</h3>`;
  const pre = [...(o.pre || []), ...(t.pre || [])];
  h += `<div class="tbar"><input type="search" placeholder="Filter" aria-label="Filter table rows" data-t="${id}"><span class="tcount" id="${id}-n"></span><button class="lnk" data-csv="${id}" title="Download this table as CSV">CSV ↓</button></div>`;
  h += `<div class="tblwrap" style="${o.maxh ? 'max-height:' + o.maxh + 'px' : ''}"><table id="${id}" class="${o.wrap ? 'wrapt' : ''} ${o.cls || ''}" data-title="${esc(o.csvname || t.title || o.id || 'table')}"><thead><tr>${cols.map((c, i) => `<th data-i="${i}" class="${i === lastQ ? 'latest' : ''}">${o.headTip && i === 0 ? '' : ''}${esc(c)}</th>`).join('')}</tr></thead><tbody>`;
  t.rows.forEach((r, ri) => {
    if (!Array.isArray(r)) { h += `<tr class="sec"><td colspan="${cols.length}">${esc(r.section)}</td></tr>`; return; }
    const label = r[0]; let trend = '';
    if (o.colorLatest && lastQ > 0 && typeof r[lastQ] === 'number' && typeof r[prevQ] === 'number' && r[lastQ] !== r[prevQ]) { const up = r[lastQ] > r[prevQ]; const good = BAD.test(label) ? !up : up; trend = good ? 'up' : 'dn'; }
    const xd = o.expand ? o.expand(r, ri) : null;
    h += `<tr data-ri="${ri}" class="${xd ? 'xrow' : ''}">` + r.map((c, i) => { const [s, cl] = cellFmt(c, cols[i]); const w = (String(s).length > 44 || o.wrap) ? ' wrap' : '';
      const body = linkify(s);
      return `<td class="${cl}${w}${i === lastQ ? ' latest ' + trend : ''}">${body}</td>`; }).join('') + '</tr>';
    if (xd) h += `<tr class="xdetail" data-for="${ri}" hidden><td colspan="${cols.length}">${xd}</td></tr>`;
  });
  h += '</tbody></table></div>';
  const notes = [...pre, ...(t.notes || []), ...(o.notes || [])]; h += fnote(notes);
  return h;
}
function wireTables(root) {
  $$('table', root).forEach(tb => {
    if (tb.dataset.wired) return; tb.dataset.wired = 1;
    const body = tb.tBodies[0]; const orig = [...body.rows];
    const n = document.getElementById(tb.id + '-n'); const total = orig.filter(r => !r.classList.contains('sec') && !r.classList.contains('xdetail')).length;
    const count = () => { if (n) { const vis = orig.filter(r => !r.classList.contains('sec') && !r.classList.contains('xdetail') && !r.hidden).length; n.textContent = vis === total ? tl(`${total} rows`, `共 ${total} 行`) : tl(`${vis} of ${total} rows`, `显示 ${vis} / 共 ${total} 行`); } };
    count();
    // expandable rows
    orig.filter(r => r.classList.contains('xrow')).forEach(r => r.addEventListener('click', e => { if (e.target.closest('a,[data-tip]')) return; const d = body.querySelector(`tr.xdetail[data-for="${r.dataset.ri}"]`); if (!d) return; d.hidden = !d.hidden; r.classList.toggle('open', !d.hidden); }));
    // sort
    tb.querySelectorAll('th').forEach(th => th.addEventListener('click', () => {
      const i = +th.dataset.i; const cur = th.dataset.dir; tb.querySelectorAll('th').forEach(x => delete x.dataset.dir);
      const dir = cur === 'a' ? 'd' : cur === 'd' ? null : 'a';
      const val = r => { const t = (r.cells[i]?.innerText || '').replace(/[$,%+▸▾×x]/g, '').replace('−', '-').trim(); const m = t.match(/^\(?-?[\d.]+/); const f = m ? parseFloat(m[0].replace('(', '-')) : NaN; return isNaN(f) ? t.toLowerCase() : f; };
      const data = orig.filter(r => !r.classList.contains('sec') && !r.classList.contains('xdetail'));
      if (!dir) { orig.forEach(r => body.appendChild(r)); orig.filter(r => r.classList.contains('sec')).forEach(r => r.style.display = ''); return; }
      th.dataset.dir = dir;
      data.sort((a, b) => { const x = val(a), y = val(b); if (typeof x !== typeof y) return typeof x === 'number' ? -1 : 1; return (x > y ? 1 : x < y ? -1 : 0) * (dir === 'a' ? 1 : -1); });
      orig.filter(r => r.classList.contains('sec')).forEach(r => r.style.display = 'none');
      data.forEach(r => { body.appendChild(r); const d = body.querySelector(`tr.xdetail[data-for="${r.dataset.ri}"]`); if (d) body.appendChild(d); });
    }));
  });
  $$('input[data-t]', root).forEach(inp => { if (inp.dataset.wired) return; inp.dataset.wired = 1; inp.addEventListener('input', () => filterTable(inp.dataset.t, inp.value)); });
  $$('[data-csv]', root).forEach(b => { if (b.dataset.wired) return; b.dataset.wired = 1; b.onclick = () => csv(b.dataset.csv); });
  tightCols(root);
}
function filterTable(id, q) {
  const tb = document.getElementById(id); if (!tb) return; q = q.trim().toLowerCase(); let sec = null, secHit = false;
  const rows = [...tb.tBodies[0].rows];
  rows.forEach(r => {
    if (r.classList.contains('sec')) { if (sec) sec.hidden = !secHit && !!q; sec = r; secHit = false; return; }
    if (r.classList.contains('xdetail')) { if (q) r.hidden = true; return; }
    const hit = !q || r.innerText.toLowerCase().includes(q); r.hidden = !hit; if (hit) secHit = true; if (!hit) r.classList.remove('open');
  });
  if (sec) sec.hidden = !secHit && !!q;
  const n = document.getElementById(id + '-n'); if (n) { const d = rows.filter(r => !r.classList.contains('sec') && !r.classList.contains('xdetail')); const v = d.filter(r => !r.hidden).length; n.textContent = v === d.length ? tl(`${d.length} rows`, `共 ${d.length} 行`) : tl(`${v} of ${d.length} rows`, `显示 ${v} / 共 ${d.length} 行`); }
}
function csv(id) {
  const tb = document.getElementById(id); if (!tb) return;
  const q = s => { s = String(s).replace(/\s+/g, ' ').replace(/^[▸▾]\s*/, '').trim(); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const lines = [[...tb.tHead.rows[0].cells].map(c => q(c.innerText))];
  [...tb.tBodies[0].rows].filter(r => !r.hidden && r.style.display !== 'none' && !r.classList.contains('xdetail')).forEach(r => lines.push([...r.cells].map(c => q(c.innerText))));
  const blob = new Blob(['\ufeff' + lines.map(l => l.join(',')).join('\n')], {type: 'text/csv;charset=utf-8'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'SPCX_' + (tb.dataset.title || id).replace(/[^\w]+/g, '_').replace(/^_|_$/g, '').slice(0, 60) + '.csv'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
/* narrow short-code columns; dates never wrap */
const CODE_HDR = /^(form|code|ticker|symbol|type|d\/i|10b5-1|role|rating|quarter|q)$/i;
const DATE_RES = [/^\d{4}-\d{2}-\d{2}$/, /^\d{1,2}\s[A-Z][a-z]{2,8}\s\d{4}$/, /^~?Q[1-4]\s?'?\d{2,4}$/, /^Q[1-4] \d{4}$/, /^[A-Z][a-z]{2,8}[- ]\d{4}$/];
function tightCols(root) {
  $$('table', root).forEach(tb => { const head = tb.tHead && tb.tHead.rows[0]; if (!head) return; const n = head.cells.length; const rows = [...tb.tBodies[0].rows].filter(r => r.cells.length === n);
    rows.forEach(r => [...r.cells].forEach(c => { if (DATE_RES.some(re => re.test(c.textContent.trim()))) c.classList.add('dt'); }));
    [...head.cells].forEach(c => { if (DATE_RES.some(re => re.test(c.textContent.trim()))) c.classList.add('dt'); });
    for (let i = 0; i < n; i++) { const vals = rows.map(r => r.cells[i].textContent.trim()).filter(v => v && !/^n\/a$/i.test(v)); const hdr = head.cells[i].textContent.trim();
      let code = CODE_HDR.test(hdr); if (!code && vals.length) { const mx = Math.max(...vals.map(v => v.length)); code = mx <= 6 && vals.every(v => /^[A-Za-z][A-Za-z.]*$/.test(v)); }
      if (!code) continue; head.cells[i].classList.add('code'); rows.forEach(r => r.cells[i].classList.add('code')); if (i === 0) tb.classList.add('c0tight'); } });
}
function details(title, body, sm = '', open = false) { return `<details class="x"${open ? ' open' : ''}><summary><span>${title}${sm ? ` <span class="sm">${sm}</span>` : ''}</span></summary><div class="xb">${body}</div></details>`; }
function xallBtns() { return `<div class="xall"><button class="lnk" data-xall="1">Expand all</button><button class="lnk" data-xall="0">Collapse all</button></div>`; }
function wireXall(root) { $$('[data-xall]', root).forEach(b => b.onclick = () => { const scope = b.closest('.xscope') || root; $$('details.x', scope).forEach(d => d.open = b.dataset.xall === '1'); }); }
/* ---------------- TradingView (keyless free widgets, delayed quote) ---------------- */
const TV_SYM = 'NASDAQ:SPCX';
function tvEmbed(el, widget, cfg, onFail) {
  if (!el) return; el.innerHTML = '';
  const box = document.createElement('div'); box.className = 'tradingview-widget-container'; box.style.height = '100%';
  const inner = document.createElement('div'); inner.className = 'tradingview-widget-container__widget'; inner.style.height = '100%'; box.appendChild(inner);
  const sc = document.createElement('script'); sc.type = 'text/javascript'; sc.async = true; sc.src = 'https://s3.tradingview.com/external-embedding/embed-widget-' + widget + '.js'; sc.textContent = JSON.stringify(cfg);
  let failed = false; const fail = why => { if (failed) return; failed = true; onFail && onFail(why); };
  sc.onerror = () => fail('script blocked or offline'); box.appendChild(sc); el.appendChild(box);
  setTimeout(() => { if (!el.querySelector('iframe')) fail('widget did not load within 12 s'); }, 12000);
}
const tvTheme = () => isDark() ? 'dark' : 'light';
/* ---------- real-time quote (Micron method): own quote endpoint polled every 15 s while visible; TradingView delayed widget when it is empty or failing ---------- */
const QUOTE_API = (new URLSearchParams(location.search).get('quoteapi')) || 'https://micron-dashboard.cashcache.workers.dev/api/quote?symbol=SPCX';  /* shared Cloudflare Worker (Robinhood real-time, Nasdaq.com backup) */
const LQ = {timer: null, fails: 0, ok: false, last: null, tv: false, prev: null, vis: false};
const usd = v => v == null ? 'n/a' : '$' + fmt(v, 2);
const sgn = (v, d = 2) => (v >= 0 ? '+' : '−') + fmt(Math.abs(v), d);
const mdy = d => { if (!d) return ''; const t = new Date(String(d).slice(0, 10) + 'T12:00:00Z'); return t.toLocaleDateString('en-US', {month: 'short', day: 'numeric', timeZone: 'UTC'}); };
const tET = ms => new Date(ms).toLocaleTimeString('en-US', {timeZone: 'America/New_York', hour12: false});
const tSG = ms => new Date(ms).toLocaleTimeString('en-GB', {timeZone: 'Asia/Singapore', hour12: false});
function tvFallback(on) {
  const w = $('#tvwrap'), lq = $('#lq'); if (!w || !lq) return;
  w.style.display = on ? 'flex' : 'none'; lq.style.display = on ? 'none' : 'block';
  if (on && !LQ.tv) { LQ.tv = true; const el = $('#tvq'); const P = D.price;
    tvEmbed(el, 'single-quote', {symbol: TV_SYM, width: '100%', isTransparent: true, colorTheme: tvTheme(), locale: I18N.tvLocale()}, why => {
      el.style.height = 'auto'; el.innerHTML = `<div class="tvfail" title="${esc(why)}">${tl('Live quote unavailable', '实时报价不可用')}</div><div class="snap"><span class="snapv">$${fmt(P.close, 2)}</span><span class="snaps">${tl('Build-time snapshot · close', '构建时快照 · 收盘')} ${esc(tl(dlong(P.close_date), I18N.zhTok(dlong(P.close_date))))} · ${tl('not live', '非实时')}</span></div>`;
      const c = $('#tvqcap'); if (c) c.textContent = tl('Static snapshot (not live)', '静态快照（非实时）'); }); }
}
function renderQuote(q) {
  const m = q.main || {}, ref = q.ref_close || {}, reg = q.session === 'regular';
  const box = $('#lq'); if (!box) return; box.classList.toggle('reg', reg); box.classList.toggle('stale', !!q.stale);
  const SESS = {premarket: '盘前', pre: '盘前', 'pre-market': '盘前', afterhours: '盘后', after: '盘后', 'after-hours': '盘后', post: '盘后', overnight: '夜盘', closed: '休市'};
  const sessZh = x => SESS[String(x || '').toLowerCase()] || SESS[String(q.session || '').toLowerCase()] || String(x || '');
  $('#lq-sl').textContent = reg ? tl('Live · regular session', '实时 · 常规交易时段') : (q.session === 'closed' ? tl('Market closed', '休市') : tl(`${q.session_label || q.session} session`, `${sessZh(q.session_label || q.session)}时段`)) + (q.session === 'overnight' ? tl(' (8 PM–4 AM ET)', '（美东 20–4 时）') : '');
  $('#lq-k').textContent = m.kind === 'regular' ? '' : tl(m.label || '', m.kind === 'close' ? '收盘价' : sessZh(m.label || m.kind));
  const px = $('#lq-px'); px.textContent = m.price != null ? usd(m.price) : 'n/a';
  if (LQ.prev != null && m.price != null && m.price !== LQ.prev) { px.classList.remove('up', 'dn'); void px.offsetWidth; px.classList.add(m.price > LQ.prev ? 'up' : 'dn'); }
  LQ.prev = m.price;
  const ch = $('#lq-ch');
  if (m.change != null) { ch.className = 'lq-ch ' + (m.change >= 0 ? 'pos' : 'neg'); ch.textContent = `${sgn(m.change)} (${sgn(m.pct)}%)${reg ? '' : tl(' vs close', ' 较收盘')}`; }
  else { ch.className = 'lq-ch mut'; ch.textContent = ''; }
  const pc = (reg ? q.prev_close : ref) || {};
  let sub = `${tl('Prev close', '前收盘')} ${usd(pc.price)}${pc.date ? ` · ${tl(mdy(pc.date), I18N.zhTok(mdy(pc.date)))}` : ''}`;
  if (!reg && q.ext && m.kind === 'close') sub += ` · ${tl(q.ext.label, sessZh(q.ext.label))} ${usd(q.ext.price)} (${sgn(q.ext.pct)}%)`;
  if (reg && q.bid && q.ask) sub += ` · ${tl('Bid', '买价')} ${usd(q.bid)} / ${tl('Ask', '卖价')} ${usd(q.ask)}`;
  $('#lq-sub').textContent = sub;
  const RH = q.source === 'Robinhood public quote';
  const venue = m.kind === 'regular' ? (RH ? tl('Nasdaq last sale via Robinhood', 'Nasdaq 最新成交价（经 Robinhood）') : q.source) : ((q.ext && q.ext.venue) ? tl(`${q.ext.venue} via Robinhood 24-hour feed`, `${q.ext.venue}（经 Robinhood 24 小时行情）`) : (RH ? tl('Robinhood extended-hours feed', 'Robinhood 延长时段行情') : q.source));
  const fresh = q.source === 'Nasdaq.com quote API' && !/real-time/i.test(q.source_note || '') ? tl('may be delayed', '可能有延迟') : tl('real-time', '实时');
  $('#lq-cap').textContent = (m.time ? tl(`as of ${tET(m.time)} ET (${tSG(m.time)} SGT)`, `截至美东时间 ${tET(m.time)}（新加坡时间 ${tSG(m.time)}）`) : '') + ` · ${venue} · ${fresh}` + (q.stale ? tl(' · last good update, retrying', ' · 最近一次有效更新，正在重试') : tl(' · refreshes every 15 s', ' · 每 15 秒刷新'));
  /* vs-IPO box follows the live regular-session price */
  const rp = q.regular && q.regular.price; if (rp) { const p2 = (rp / D.meta.ipo_price - 1) * 100; const v = $('#ipo-v'); if (v) { v.className = 'v ' + pcls(p2); v.textContent = pct(p2); }
    const s1 = $('#ipo-s1'); if (s1) s1.textContent = tl(`${usd(rp)} (${reg ? 'live' : 'last regular close'}) vs US$135.00 IPO price (11 Jun 2026)`, `${usd(rp)}（${reg ? '实时' : '最近常规收盘'}）对比 IPO 价 US$135.00（2026年6月11日）`); }
}
async function pollQuote() {
  if (document.visibilityState === 'hidden') return;
  try {
    const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 8000);
    const r = await fetch(QUOTE_API + (QUOTE_API.includes('?') ? '&' : '?') + 't=' + Date.now(), {cache: 'no-store', signal: ctl.signal}); clearTimeout(to);
    const q = await r.json(); if (!q || !q.ok || !q.main) throw new Error('bad quote');
    LQ.fails = 0; LQ.ok = true; LQ.last = q; tvFallback(false); renderQuote(q); { const e = document.getElementById('lfstat'); if (e) e.textContent = tl(`Last tick $${Number((q.main || {}).price).toFixed(2)} at ${(q.main || {}).time_et || ''} · ${q.session_label || q.session || ''}`, `最新报价 $${Number((q.main || {}).price).toFixed(2)}，时间 ${(q.main || {}).time_et || ''} · ${q.session_label || q.session || ''}`); }
  } catch (e) {
    LQ.fails++;
    if (!LQ.ok || LQ.fails >= 4) tvFallback(true);
    else if (LQ.last) renderQuote({...LQ.last, stale: true});
  }
}
function liveQuote() {
  LQ.tv = false; clearTimeout(LQ.timer);
  if (!QUOTE_API) { tvFallback(true); return; }  /* no endpoint yet: TradingView delayed widget */
  if (LQ.last) { tvFallback(false); renderQuote(LQ.last); }
  /* 15 s while the endpoint answers; back off to 30–60 s while it is unreachable (TradingView fallback shown meanwhile) */
  const loop = async () => { await pollQuote(); const d = LQ.fails === 0 ? 15000 : Math.min(60000, 15000 * 2 ** Math.min(LQ.fails, 2)); LQ.timer = setTimeout(loop, d); };
  loop();
  if (!LQ.vis) { LQ.vis = true; document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { clearTimeout(LQ.timer); loop(); } }); }
}
/* ---------------- palette & charts ---------------- */
let C = {};
function palette() {
  C = isDark() ? {acc: '#4aa3e8', acc3: 'rgba(74,163,232,.18)', g: '#d1d1d6', g2: '#636366', g3: '#3a3a3c', up: '#30d158', dn: '#ff453a', grid: 'rgba(255,255,255,.06)', txt: '#8e8e93'}
               : {acc: '#005288', acc3: 'rgba(0,82,136,.10)', g: '#1d1d1f', g2: '#8e8e93', g3: '#d1d1d6', up: '#1d8a3a', dn: '#d70015', grid: 'rgba(0,0,0,.05)', txt: '#86868b'};
  const d = Chart.defaults; d.font.family = '-apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",Arial,sans-serif'; d.font.size = 11; d.color = C.txt; d.borderColor = C.grid;
  d.elements.bar.borderRadius = 5; d.elements.bar.borderSkipped = false; d.datasets.bar.maxBarThickness = 34; d.elements.line.tension = .3;
  Object.assign(d.plugins.legend.labels, {usePointStyle: true, pointStyle: 'circle', boxWidth: 6, boxHeight: 6, padding: 14});
  Object.assign(d.plugins.tooltip, {backgroundColor: isDark() ? 'rgba(58,58,60,.97)' : 'rgba(29,29,31,.93)', cornerRadius: 10, padding: 10, usePointStyle: true});
  d.scale.border = {display: false}; d.scales.category.grid = {display: false}; d.scales.linear.grid = {color: C.grid, drawTicks: false}; d.scales.linear.ticks = {maxTicksLimit: 6, padding: 8};
}
const charts = {}; window.__charts = charts;
function chart(id, cfg) { const el = document.getElementById(id); if (!el) return null; if (charts[id]) charts[id].destroy(); cfg.options = Object.assign({responsive: true, maintainAspectRatio: false, plugins: {legend: {position: 'bottom'}}}, cfg.options || {}); charts[id] = new Chart(el, I18N.chartCfg(cfg)); return charts[id]; }
const ccard = (id, title, sub = '', h = 290) => `<div class="card ccard"><div class="chead"><div class="ct">${esc(title)}</div>${sub ? `<div class="mut" style="font-size:11.5px">${sub}</div>` : ''}</div><div class="chartbox" style="height:${h}px"><canvas id="${id}" role="img" aria-label="${esc(title)}"></canvas></div></div>`;
const bn = v => v == null ? 'n/a' : (v < 0 ? '−' : '') + 'US$' + fmt(Math.abs(v) / 1000, 2) + 'bn';
const mm = v => v == null ? 'n/a' : (v < 0 ? '−' : '') + 'US$' + fmt(Math.abs(v), 0) + 'm';
const row = (arr, name) => (arr.find(r => Array.isArray(r) && r[0] === name) || []).slice(1);
const ext = (u, t = 'source') => u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>` : '';
const kpi = (l, v, s, u) => `<div class="card kpi"><div class="l">${esc(l)}</div><div class="v">${v}</div><div class="s">${s}${u ? ' · ' + ext(u) : ''}</div></div>`;

/* ---------------- lock-up release calendar ---------------- */
const relTime = r => r.et ? new Date(r.et) : r.date ? new Date(r.date + 'T09:30:00-04:00') : null;
function relStatus(r, now = new Date()) {
  if (r.cond) return {k: 'na', t: 'Not met (per Chief)'};
  const t = relTime(r); if (!t) return {k: 'upcoming', t: 'Upcoming · date TBA'};
  return now >= t ? {k: 'passed', t: 'Released'} : {k: 'upcoming', t: 'Upcoming'};
}
function nextRelease(now = new Date()) { return D.releases.filter(r => !r.cond && relTime(r) && relTime(r) > now).sort((a, b) => relTime(a) - relTime(b))[0]; }
function cdText(t) { let s = Math.max(0, Math.floor((t - new Date()) / 1000)); const d = Math.floor(s / 86400); s -= d * 86400; const h = Math.floor(s / 3600); s -= h * 3600; const m = Math.floor(s / 60); s -= m * 60;
  const u = LANG === 'zh' ? ['天', '时', '分', '秒'] : ['d', 'h', 'm', 's'];
  return `${d}<small>${u[0]}</small>${String(h).padStart(2, '0')}<small>${u[1]}</small>${String(m).padStart(2, '0')}<small>${u[2]}</small>${String(s).padStart(2, '0')}<small>${u[3]}</small>`; }
let CDT = null;
function tickCountdowns() { const n = nextRelease(); $$('[data-cd]').forEach(el => { if (!n) { el.innerHTML = 'n/a'; return; } el.innerHTML = cdText(relTime(n)); }); }
const pctOut = m => m == null ? 'n/a' : fmt(m / D.price.shares_m * 100, 1) + '%';

/* ---------------- hero ---------------- */
function hero() {
  const P = D.price, n = nextRelease();
  $('#updated').innerHTML = `© 2026 Hugo Tian. All rights reserved.`;
  const q2 = row(D.is, 'Revenue')[6], q2y = row(D.is, 'Revenue')[4];
  $('#hero4').innerHTML = [
    `<div class="hcard live"><div id="lq" class="lq" aria-live="polite" style="display:none"><div class="lq-top"><span class="lq-sess"><i class="lq-dot"></i><span id="lq-sl">Connecting to live quote…</span></span><span class="lq-sym">SPCX · Nasdaq</span></div>
       <div class="lq-row"><span class="lq-k" id="lq-k"></span><span class="lq-px" id="lq-px">—</span><span class="lq-ch" id="lq-ch"></span></div><div class="lq-sub" id="lq-sub"></div><div class="lq-cap" id="lq-cap"></div></div>
     <div id="tvwrap" class="tvwrap" style="display:none"><div class="l" style="padding:2px 4px 0"><i class="livedot"></i> Live stock price ${info('Live price', 'Real-time box via the Robinhood quote relay, refreshed every 15 s; if it fails, TradingView\'s delayed (~15 min) quote is shown instead.')}</div><div class="tvq" id="tvq"></div><div class="cap" id="tvqcap" style="padding:0 4px">Nasdaq: SPCX · delayed ~15 min · TradingView</div></div></div>`,
    `<div class="hcard"><div class="l">Next lock-up release ${info('Lock-up', 'Countdown to the next dated release in the 424(b)(4) prospectus schedule, measured to the 9:30 ET open of the first trading session on or after the release date.')}</div>
       <div class="cdv" data-cd="1">—</div><div class="ch" style="color:var(--acc)">${n ? 'Up to ' + fmt(n.shares_m, 1) + 'm shares' : 'n/a'}</div><div class="s">${n ? esc(n.label) + ' · ' + pctOut(n.shares_m) + ' of shares outstanding (calc.)' : ''}</div><div class="asof"><a href="#ipo">Full IPO & lock-up calendar →</a></div></div>`,
    `<div class="hcard"><div class="l">Market cap</div><div class="v">US$${fmt(P.mcap_m / 1e6, 2)}tn</div><div class="ch mut">EV US$${fmt(P.ev_m / 1e6, 2)}tn</div><div class="s">${fmt(P.shares_m)}m Class A+B shares × US$${fmt(P.close, 2)} (calculated)</div><div class="asof">Close ${esc(dlong(P.close_date))}</div></div>`,
    `<div class="hcard"><div class="l">Q2 2026 revenue</div><div class="v">${bn(q2)}</div><div class="ch pos">${pct((q2 / q2y - 1) * 100, 0)} YoY</div><div class="s">Net loss ${mm(row(D.is, 'Net income (loss)')[6])} · adj. EBITDA ${bn(row(D.is, 'Adjusted EBITDA (non-GAAP, company-defined)')[6])}</div><div class="asof">10-Q · quarter ended 30 Jun 2026</div></div>`].join('');
  $('#hero2').innerHTML = [
    `<div class="mini"><div class="l">SPCX vs IPO price</div><div class="v ${pcls((P.close / 135 - 1) * 100)}" id="ipo-v">${pct((P.close / 135 - 1) * 100)}</div><div class="s" id="ipo-s1">US$${fmt(P.close, 2)} close ${esc(dlong(P.close_date))} vs US$135.00 IPO (11 Jun 2026)</div></div>`,
    `<div class="mini"><div class="l">Elon Musk voting power</div><div class="v">≈82.4%</div><div class="s">Class B = 10 votes · locked up until 12 Jun 2027 · <a href="#musk">Musk tab</a></div></div>`,
    `<div class="mini"><div class="l">Cash & securities / debt + leases</div><div class="v">${bn(D.debt.cash_m)} / ${bn(D.debt.items[3][1])}</div><div class="s">30 Jun 2026 · 10-Q</div></div>`,
    `<div class="mini"><div class="l">Next earnings</div><div class="v">Nov 2026</div><div class="s">Q3 2026 date not announced · triggers up to 1.3bn-share release 2 trading days later</div></div>`].join('');
  try { I18N.apply($('#hero4')); I18N.apply($('#hero2')); } catch (e) { console.error('i18n hero', e); }
  tickCountdowns(); clearInterval(CDT); CDT = setInterval(tickCountdowns, 1000);
  liveQuote();
}

/* ---------------- overview ---------------- */
function overview() {
  const P = D.price, S = D.street;
  const keyRows = [
    ['Share price / market cap / EV', `US$${fmt(P.close, 2)} / US$${fmt(P.mcap_m)}m / US$${fmt(P.ev_m)}m`, `Close ${dlong(P.close_date)}`],
    ['Q2 2026 revenue / net loss / adj. EBITDA', `${mm(7814)} (+92% y/y) / ${mm(-541)} / ${mm(3538)}`, 'Q2 2026 (10-Q, 8-K)'],
    ['H1 2026 capex / free cash flow (calc.)', `${mm(28476)} / ${mm(-25010)}`, 'H1 2026'],
    ['Cash & securities vs debt + leases', `${mm(D.debt.cash_m)} vs ${mm(39512)}`, '30 Jun 2026'],
    ['Starlink subscribers / ARPU', '12.0m / US$66 per month', 'Q2 2026'],
    ['EV / LTM revenue · P/E', `${P.ev_rev_ltm}x · not meaningful (LTM net loss ${mm(P.ltm_ni_m)})`, `Close ${dlong(P.close_date)}`],
    ['Analysts (MarketBeat, third-party)', `${S.rating} · avg target US$${fmt(S.avg, 2)} (US$${S.lo}–${S.hi})`, '8 Oct 2026'],
    ['Next lock-up release', nextRelease() ? `${nextRelease().label}: up to ${fmt(nextRelease().shares_m, 1)}m shares` : 'n/a', '424(b)(4)'],
    ['Elon Musk', '≈82.4% of votes; 6.42bn shares beneficially owned; locked until 12 Jun 2027', '424(b)(4) · 13G']];
  $('#s-overview').innerHTML = `<h2>Overview</h2>
  <p class="lead">SpaceX listed on Nasdaq on <b>11 Jun 2026</b> at US$135. It now reports three segments: <b>Space</b> (launch), <b>Connectivity</b> (Starlink) and <b>AI</b> (xAI, Grok and X). Revenue is growing fast, Starlink makes the profits, and AI capex is driving large cash outflows.</p>
  <div class="grid g2" style="margin-bottom:16px">
    <div class="card"><h3>Key numbers (with dates)</h3>${tableBlock({columns: ['Metric', 'Value', 'As of'], rows: keyRows}, {id: 'tKey', csvname: 'Key numbers', wrap: true, cls: 'keyt'})}</div>
    <div class="card"><h3>Key takeaways</h3><ul class="lst">${D.takeaways.map(t => `<li>${esc(t)}</li>`).join('')}</ul><div class="mut" style="font-size:11.5px;margin-top:8px">Source: SEC filings via ${esc('Chief\'s analysis, data as at 9 Oct 2026')}.</div></div></div>
  <div class="grid g2" style="margin-bottom:16px">${ccard('ovMix', 'Revenue by segment (US$m)', '424(b)(4) · 10-Q')}${ccard('ovRel', 'Upcoming lock-up releases (m shares)', '424(b)(4) schedule · dated tranches')}</div>
  <div class="card"><h3 style="margin-top:0">SPCX live chart <span class="mut" style="font-size:12px;font-weight:400">${TV_SYM} · TradingView</span></h3><div class="tvchart" id="tvchart"></div></div>`;
  mixChart('ovMix');
  const up = D.releases.filter(r => !r.cond && relStatus(r).k !== 'passed').sort((a, b) => (a.date || a.sort).localeCompare(b.date || b.sort));
  chart('ovRel', {type: 'bar', data: {labels: up.map(r => r.date ? dlong(r.date).replace(' 20', " '") : 'After ' + (r.label.match(/Q\d \d{4}/) || ['TBA'])[0]), datasets: [{label: 'Shares (m)', data: up.map(r => r.shares_m), backgroundColor: up.map(r => r.pool === 'Musk' ? C.g2 : C.acc)}]},
    options: {plugins: {legend: {display: false}, tooltip: {callbacks: {title: i => up[i[0].dataIndex].label, label: c => `Up to ${fmt(c.raw, 1)}m shares (${up[c.dataIndex].pool})`}}}, scales: {y: {type: 'logarithmic', ticks: {callback: v => [50, 100, 300, 1000, 3000, 6000].includes(v) ? fmt(v) : ''}}}}});
  tvEmbed($('#tvchart'), 'advanced-chart', {autosize: true, symbol: TV_SYM, interval: 'D', range: '6M', timezone: 'Asia/Singapore', theme: tvTheme(), style: '1', locale: I18N.tvLocale(),
    backgroundColor: isDark() ? 'rgba(22,22,23,1)' : 'rgba(255,255,255,1)', gridColor: isDark() ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.035)', allow_symbol_change: false, hide_side_toolbar: true, calendar: false, support_host: 'https://www.tradingview.com'},
    why => { $('#tvchart').innerHTML = `<div class="tvfail">Live chart unavailable (${esc(why)}).</div><div class="mut" style="font-size:12px">Snapshot: close US$${fmt(D.price.close, 2)} on ${esc(dlong(D.price.close_date))} · not live</div>`; $('#tvchart').style.height = 'auto'; });
}
function mixChart(id) {
  const g = n => row(D.mix, n);
  chart(id, {type: 'bar', data: {labels: D.cols, datasets: [{label: 'Space', data: g('Space revenue'), backgroundColor: C.g3}, {label: 'Connectivity (Starlink)', data: g('Connectivity revenue'), backgroundColor: C.acc}, {label: 'AI (xAI / X)', data: g('AI revenue'), backgroundColor: C.g2}]},
    options: {scales: {x: {stacked: true}, y: {stacked: true}}, plugins: {legend: {position: 'bottom'}, tooltip: {callbacks: {label: c => `${c.dataset.label}: ${mm(c.raw)}`}}}}});
}

/* ---------------- IPO & lock-up ---------------- */
function ipoTab() {
  const now = new Date(), n = nextRelease(now), E = D.emp;
  const rels = [...D.releases].sort((a, b) => (b.date || b.sort).localeCompare(a.date || a.sort) || (b.pool === 'Musk') - (a.pool === 'Musk'));  /* newest first */
  const tl = rels.map(r => { const st = relStatus(r, now); const isN = n && r === n; const cls = isN ? 'st-next' : st.k === 'passed' ? 'st-passed' : st.k === 'na' ? 'st-passed' : 'st-up';
    return `<li class="${cls}"><div class="h"><b>${esc(r.label)}</b><span class="pill ${isN ? 'next' : st.k}">${isN ? 'Next' : st.t}</span><span class="sz">Up to ${fmt(r.shares_m, 1)}m shares</span><span class="mut" style="font-size:12px">${esc(r.pool)} pool · ${esc(r.what)} · ${pctOut(r.shares_m)} of shares outstanding (calc.)</span></div>
      <div class="q">${esc(r.q)}</div>
      <div class="mut" style="font-size:12px;margin-top:4px">Employee equity in this tranche: <b>n/a (not disclosed)</b> · Tax-driven selling from RSU vesting: <b>≈0 if RSUs stay net-settled</b> <span class="est">estimate</span></div></li>`; }).join('');
  const trows = rels.flatMap(r => { const st = relStatus(r, now), stt = n && r === n ? 'Next' : st.t;
    const main = [r.label, 'All holders', r.pool, r.cond ? `${fmt(r.shares_m, 1)} (conditional)` : fmt(r.shares_m, 1), pctOut(r.shares_m), 'n/a', stt];
    if (r.pool === 'Musk') return [main];
    return [main, ['↳ ' + r.label, 'Employee equity (within)', r.pool, 'n/a', 'n/a', 'RSU ≈0 (est.)', stt]]; });
  const rule = x => { const st = x.kind === 'na' ? ['na', 'Not in filing'] : x.kind === 'control' || x.kind === 'tax' || x.kind === 'risk' ? ['active', 'Active'] : x.kind === 'plan' ? ['active', 'Active'] : x.date ? (new Date(x.date + 'T16:00:00-04:00') < now ? (x.id === 'pool180' || x.id === 'company' || x.id === 'dated' ? ['active', 'Active'] : ['passed', 'Passed']) : ['upcoming', 'Upcoming']) : ['upcoming', 'Upcoming'];
    const st2 = x.id === 'price' ? ['na', 'Appears not met'] : x.id === 'dated' && new Date('2026-10-24T16:00:00-04:00') > now ? ['active', 'Active · 2 of 5 left'] : x.id === 'earn1' ? ['passed', 'Passed'] : st;
    return `<div class="rule"><div class="h" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center"><b>${esc(x.title)}</b><span class="pill ${st2[0]}">${esc(st2[1])}</span><span class="mut" style="font-size:12px">${x.date ? esc(dlong(x.date)) : esc(x.date_label || '')}</span></div>
      ${x.quote ? `<blockquote>${esc(x.quote)}</blockquote>` : ''}${x.quote2 ? `<blockquote>${esc(x.quote2)}</blockquote>` : ''}
      ${x.status_note ? `<div style="font-size:12.5px;margin:4px 0">${esc(x.status_note)}</div>` : ''}<div class="w">${esc(x.where)} · ${ext(x.url || 'https://www.sec.gov/Archives/edgar/data/1181412/000162828026042639/spaceexplorationtechnologi.htm', 'open filing')}</div></div>`; };
  const facts = E.facts.map(f => [f.k, f.v, f.q ? '“' + f.q + '”' : '—', f.src + (f.url ? ' ' + f.url : '')]);
  $('#s-ipo').innerHTML = `<h2>IPO & Lock-up <span class="mut">Every rule quoted from the 424(b)(4) prospectus (12 Jun 2026), with its date and status</span></h2>
  <div class="grid g4" style="margin-bottom:16px">
    <div class="card kpi"><div class="l">Next release</div><div class="cdv" data-cd="1">—</div><div class="s">${n ? esc(n.label) + ' · up to ' + fmt(n.shares_m, 1) + 'm shares' : 'n/a'}</div></div>
    <div class="card kpi"><div class="l">Biggest 2026 tranche</div><div class="v">≈1.3bn</div><div class="s">2nd full trading day after Q3 results (Nov 2026, date TBA) · 28% of 180-day pool</div></div>
    <div class="card kpi"><div class="l">180-day expiry</div><div class="v">8 Dec 2026</div><div class="s">Up to 797.6m (price trigger appears not met)</div></div>
    <div class="card kpi"><div class="l">Elon Musk unlock</div><div class="v">12 Jun 2027</div><div class="s">Up to 6.4bn shares · no early release</div></div></div>
  <div class="grid g2" style="margin-bottom:16px">
    <div class="card"><h3>Release timeline <span class="mut">newest first · status as of your clock</span></h3><ul class="lt">${tl}</ul>
      <ul class="notes"><li>Share amounts are the prospectus maximums (“Up to…”) from the “Shares Eligible for Future Sale” table (p. 259–260); actual sales are unknown.</li><li>% of shares outstanding uses 13,573m Class A+B shares (calculated).</li><li>Dates tied to earnings are “the second full trading day on Nasdaq immediately following” the results; Q3 2026 results date is not announced.</li><li>Chief's PDF lists the 9 Oct, 24 Oct, post-Q3 and 8 Dec amounts as 328.4m, 328.4m, up to 1.3bn and up to 797.6m: all match the filing.</li></ul></div>
    <div><div class="card" style="margin-bottom:16px"><h3>Rules from the prospectus</h3>${RULESORDER().map(rule).join('')}</div></div></div>
  <h3>Tranche table: investor releases vs employee equity <span class="mut">employee rows kept separate; estimates marked</span></h3>
  ${tableBlock({columns: ['Release', 'Row', 'Pool', 'Shares (m, max)', '% of shares out (calc.)', 'Tax-driven open-market supply', 'Status'], rows: trows}, {id: 'tRel', csvname: 'Lock-up releases', notes: ['Each release has its own employee-equity row (↳). Employee shares per tranche are not disclosed in the prospectus, S-8s or 10-Q, so they are n/a; the S-8 reoffer covers 136,949,657 employee shares in total (all pools). Musk’s release has no separate employee row. Tax-driven column: RSU ≈0 is an estimate assuming continued net settlement; option sell-to-cover amounts are not disclosed (n/a); “All holders” rows are not split between voluntary and tax-driven selling (n/a).', 'Tax-driven supply ≈0 is an ESTIMATE that assumes SpaceX keeps net-settling RSUs (it withholds shares and pays the tax in cash, per the prospectus). Option exercisers may still “sell to cover” (allowed by the lock-up); that amount is not disclosed.']})}
  ${siPanel()}
  ${demandPanel()}
  <h3>Employee equity & tax overhang</h3>
  <div class="grid g4" style="margin-bottom:12px">
    <div class="card kpi"><div class="l">RSUs outstanding (31 Mar 2026)</div><div class="v">128.5m + 0.9m B</div><div class="s">+23.8m granted after · none vest at the IPO</div></div>
    <div class="card kpi"><div class="l">Withholding method</div><div class="v" style="font-size:20px">Net settlement</div><div class="s">≈US$460m cash paid for RSU taxes after 31 Mar 2026</div></div>
    <div class="card kpi"><div class="l">Implied withholding rate <span class="est">estimate</span></div><div class="v">≈${E.withhold_rate_est}%</div><div class="s">4.32m withheld ÷ 17.09m vested (calc.)</div></div>
    <div class="card kpi"><div class="l">Employee shares registered for resale</div><div class="v">136.9m</div><div class="s">S-8 reoffer, 4 Aug 2026 · subject to lock-ups</div></div></div>
  ${tableBlock({columns: ['Item', 'Value', 'Exact wording', 'Source'], rows: facts}, {id: 'tEmp', csvname: 'Employee equity', wrap: true})}
  <div class="card" style="margin-top:12px"><h4 style="margin:0 0 6px">Estimate assumptions <span class="est">estimate</span></h4><ul class="lst">${E.assumptions.map(a => `<li>${esc(a)}</li>`).join('')}</ul></div>`;
  siCharts();
}
const RULESORDER = () => { const o = ['vote', 'controlled', 'musk', 'pool180', 'earn1', 'price', 'dated', 'earn3', 'd180', 'ext', 'company', 'gs', 'sell2cover', 'tbp', 'quiet']; return o.map(k => D.rules.find(r => r.id === k)).filter(Boolean); };

/* ---------------- financials ---------------- */
function finTab() {
  const C7 = ['US$m', ...D.cols];
  const fcf = row(D.cf, 'Free cash flow (OCF − capex; calculated)');
  $('#s-fin').innerHTML = `<h2>Financials <span class="mut">424(b)(4) for FY2023–25 and Q1; 10-Q for Q2 2026. Q3/Q4 2025 were not disclosed separately (n/a).</span></h2>
  <div class="grid g2" style="margin-bottom:16px">${ccard('fRev', 'Revenue, net income & adj. EBITDA (US$m)')}${ccard('fCf', 'Operating cash flow vs capex vs FCF (US$m)')}</div>
  ${tableBlock({title: 'Income statement', columns: C7, rows: D.is}, {id: 'tIS', colorLatest: true, notes: ['Q1 2025 and Q1 2026 line items are H1 minus Q2 (derivation in Chief\'s analysis, reconciled to reported totals). FY2024 diluted EPS rounds to US$0.00.', 'Adjusted EBITDA is a company-defined non-GAAP measure.']})}
  ${tableBlock({title: 'Cash flow', columns: C7, rows: D.cf}, {id: 'tCF', notes: ['Free cash flow = operating cash flow − purchases of PP&E (calculated, not company-reported).']})}
  ${tableBlock({title: 'Balance sheet', columns: ['US$m', ...D.bs_cols], rows: D.bs}, {id: 'tBS', notes: ['31 Mar 2026 from the prospectus summary table only (n/a = not in summary). Preferred stock converted to common at the IPO (15 Jun 2026).']})}
  <h3>Debt & capital return <span class="mut">30 Jun 2026</span></h3>
  ${tableBlock({columns: ['Item', 'US$m'], rows: D.debt.items}, {id: 'tDebt', notes: [`Related-party debt (carrying value): ${mm(D.debt.related_m)}.`, D.debt.capital_return, 'A reported ~US$40bn Nvidia-chip debt raise (Financial Times, 6 Oct 2026) is unconfirmed: no SEC filing or company statement.']})}
  <h3>XBRL cross-check <span class="mut">10-Q tagged values vs the figures shown</span></h3>
  ${tableBlock({columns: ['Item', 'SEC XBRL (US$m)', 'Shown (US$m)', 'Match'], rows: D.xbrl.map(x => [x.item, x.xbrl, x.pdf, x.match ? '✓' : '✗'])}, {id: 'tX'})}
  <h3>Company statements on the outlook <span class="mut">Q2 call, 4 Aug 2026</span></h3><ul class="lst">${D.guidance.map(g => `<li>${esc(g)}</li>`).join('')}</ul>`;
  chart('fRev', {data: {labels: D.cols, datasets: [{type: 'bar', label: 'Revenue', data: row(D.is, 'Revenue'), backgroundColor: C.acc}, {type: 'bar', label: 'Adj. EBITDA', data: row(D.is, 'Adjusted EBITDA (non-GAAP, company-defined)'), backgroundColor: C.g3}, {type: 'bar', label: 'Net income (loss)', data: row(D.is, 'Net income (loss)'), backgroundColor: C.g2}]}, options: {plugins: {tooltip: {callbacks: {label: c => `${c.dataset.label}: ${mm(c.raw)}`}}}}});
  chart('fCf', {type: 'bar', data: {labels: D.cols, datasets: [{label: 'Operating cash flow', data: row(D.cf, 'Net cash from operating activities'), backgroundColor: C.g3}, {label: 'Capex', data: row(D.cf, 'Purchases of PP&E (capex)'), backgroundColor: C.g2}, {label: 'FCF (calc.)', data: fcf, backgroundColor: C.acc}]}, options: {plugins: {tooltip: {callbacks: {label: c => `${c.dataset.label}: ${mm(c.raw)}`}}}}});
}

/* ---------------- business: segments, Starlink, compute ---------------- */
function bizTab() {
  $('#s-biz').innerHTML = `<h2>Segments & Starlink <span class="mut">Space · Connectivity · AI</span></h2>
  <div class="grid g2" style="margin-bottom:16px">${ccard('bMix', 'Revenue by segment (US$m)')}${ccard('bSubs', 'Starlink subscribers (m) & ARPU (US$/month)', 'ARPU only where stated')}</div>
  <div class="grid g2" style="margin-bottom:16px">${ccard('bGw', 'AI nameplate compute (GW)', 'End-2026 = ">2 GW" guidance')}${ccard('bCapex', 'Quarterly capex (US$m)', 'Q3/Q4 2026 guided "very similar" to Q2 — not shown as actuals')}</div>
  ${tableBlock({title: 'Revenue mix (US$m)', columns: ['US$m', ...D.cols], rows: D.mix}, {id: 'tMix', notes: ['Starlink Mobile (direct-to-cell) revenue sits inside Enterprise & government and is not disclosed separately; there is no consumer/enterprise/mobile/government four-way split, and launch revenue is not split commercial vs NASA/DoD.', 'Customer A (all segments) = 18.3% and Customer B (AI) = 19.5% of Q2 2026 revenue (10-Q).', D.subs.note, D.compute.note]})}`;
  mixChart('bMix');
  chart('bSubs', {data: {labels: D.subs.labels, datasets: [{type: 'bar', label: 'Subscribers (m)', data: D.subs.subs_m, backgroundColor: C.acc, yAxisID: 'y'}, {type: 'line', label: 'ARPU (US$/mo)', data: D.subs.arpu, borderColor: C.g2, backgroundColor: C.g2, pointRadius: 5, spanGaps: false, yAxisID: 'y1'}]},
    options: {scales: {y1: {position: 'right', grid: {drawOnChartArea: false}, min: 0}}}});
  chart('bGw', {type: 'bar', data: {labels: D.compute.labels, datasets: [{label: 'GW', data: D.compute.gw, backgroundColor: D.compute.gw.map((_, i) => i === 3 ? C.g3 : C.acc)}]}, options: {plugins: {legend: {display: false}}}});
  const cx = row(D.cf, 'Purchases of PP&E (capex)').slice(3).map(v => -v);
  chart('bCapex', {type: 'bar', data: {labels: D.cols.slice(3), datasets: [{label: 'Capex', data: cx, backgroundColor: C.acc}]}, options: {plugins: {legend: {display: false}, tooltip: {callbacks: {label: c => mm(c.raw)}}}}});
}

/* ---------------- operations ---------------- */
function opsTab() {
  const O = D.ops;
  const ss = O.starship.map(s => `<li class="${s.cls === 'up' ? 'st-next' : ''}"><div class="h"><b>Flight ${s.n}</b><span class="mut" style="font-size:12px">${s.date ? esc(dlong(s.date)) : esc(s.dl)}</span><span class="pill ${s.cls === 'up' ? 'upcoming' : 'passed'}"><span class="${s.cls === 'ok' ? 'ok' : s.cls === 'bad' ? 'bad' : ''}">${esc(s.res)}</span></span><span class="mut" style="font-size:12px">${esc(s.veh)}</span></div><div style="font-size:13px;margin-top:3px">${esc(s.note)} ${ext(s.src)}</div></li>`).join('');
  const done = O.starship.filter(s => s.date), y26 = done.filter(s => s.date >= '2026');
  $('#s-ops').innerHTML = `<h2>Operations <span class="mut">Launch cadence, Starship, Starlink and government contracts</span></h2>
  <div class="grid g4" style="margin-bottom:8px">${O.launch.map(k => kpi(k.l, esc(k.v), esc(k.s), k.url)).join('')}</div>
  ${aiPanel()}
  <div style="margin-top:16px">
    <div class="card" style="margin-bottom:16px"><h3 style="margin-top:0">Starship test flights <span class="mut">newest first · ${done.length} flown, ${y26.length} in 2026</span></h3><ul class="lt">${ss}</ul></div>
    <div class="card"><h3 style="margin-top:0">Major government contracts & missions <span class="mut">newest first</span></h3>
      ${tableBlock({columns: ['Date', 'Customer', 'What', 'Value', 'Source'], rows: O.contracts.map(c => [c.dl || dlong(c.date), c.who, c.what, c.val, c.src + ' ' + c.url])}, {id: 'tCon', wrap: true, notes: [O.gov_note, 'Values are as reported by the sources; contract values are not revenue and are not split by year.']})}</div></div>`;
  aiCharts();
}

/* ---------------- AI compute: GPUs & data centres (Operations) ---------------- */
function aiPanel() {
  const A = window.SPCX_AI; if (!A) return '';
  const est = '<span class="est">estimate · illustration, not guidance</span>', tp = '<span class="est">third-party</span>';
  const b = v => typeof v === 'number' ? 'US$' + fmt(v, 1) + 'bn' : v;
  return `<div class="card" id="aic" style="margin:16px 0"><h3 style="margin-top:0">AI compute: GPUs &amp; data centres <span class="mut">newest first · as of ${esc(A.asof)}</span></h3>
  <div class="grid g4" style="margin-bottom:12px">${A.kpis.map(k => kpi(k[0], esc(k[1]), esc(k[2]), k[3])).join('')}</div>
  <h3>GPUs by type <span class="mut">filings first, then company statements</span></h3>
  ${tableBlock({columns: ['As of', 'Site', 'GPU type', 'Count', 'Power (MW)', 'Basis', 'Source'], rows: A.gpus}, {id: 'tAiG', wrap: true, notes: ['CEO posts on X are company statements but are not filings. Post dates are in SGT. Counts the filings give as “approximately” are shown with ~.']})}
  <h3>Data-centre sites</h3>
  ${tableBlock({columns: ['Site', 'Location', 'What', 'Status', 'Basis', 'Source'], rows: A.sites}, {id: 'tAiS', wrap: true})}
  <h3>Power: online, under construction, planned</h3>
  ${tableBlock({columns: ['Date', 'Status', 'Capacity', 'What', 'Basis', 'Source'], rows: A.power}, {id: 'tAiP', wrap: true, notes: ['Nameplate compute draw = GPUs installed × their all-in power draw. It is not actual consumption or utilisation and excludes cooling, power-distribution losses and facility overhead (10-Q definition).', 'MW for future GB300 tranches = 220,000 × 2.0 kW (the per-GPU figure implied by the 424B4: 220 MW for 110,000 GB300). Calculated, not company-stated.']})}
  <div class="grid g2" style="margin:12px 0">${ccard('aiGw', 'Compute capacity: actual vs forecasts (GW)', 'Actual = nameplate compute draw (filings). Elon = 1.5 GW in Apr 2026. Company = >2 GW end-2026 guidance, shown as 2.0. Street = low and high of named analysts (third-party).', 290)}${ccard('aiCap', 'Revenue capacity at 100% utilisation (US$bn, base case)', 'Estimate, not guidance. Bars: capacity × base GPU-hour price × 8,760 h. Line: Street revenue forecast for the same period (third-party).', 290)}</div>
  <h3>Elon’s forecasts vs actual <span class="mut">verbatim quotes · newest first</span></h3>
  ${tableBlock({columns: ['Said (SGT)', 'Elon said (verbatim)', 'Target', 'Deadline', 'Actual so far', 'Status', 'Source'], rows: A.forecasts}, {id: 'tAiF', wrap: true, notes: ['Only figures he stated are shown; nothing is converted into a number he did not say. “Actual” comes from filings or later company statements; n/a where nothing is disclosed.']})}
  <h3>Company targets in filings and guidance</h3>
  ${tableBlock({columns: ['Date', 'Statement', 'Target', 'Deadline', 'Actual so far', 'Status', 'Source'], rows: A.company}, {id: 'tAiC', wrap: true})}
  <h3>Elon vs the Street <span class="mut">side by side</span> ${tp}</h3>
  ${tableBlock({columns: ['Metric', 'Actual today', 'Elon / company forecast', 'Street low', 'Street average', 'Street high', 'Deadline'], rows: A.sbs}, {id: 'tAiX', wrap: true, notes: ['Street figures are third-party analyst forecasts as reported in the news; see the table below for each note, its date and link. No full consensus range was available, so low and high are the lowest and highest named analyst figures; n/a where no Street figure exists.']})}
  <h3>Street forecasts <span class="mut">named analysts, newest first</span> ${tp}</h3>
  ${tableBlock({columns: ['Analyst', 'Date', 'Metric', '2026', '2027', '2028', 'Note', 'Source'], rows: A.street}, {id: 'tAiSt', wrap: true, notes: ['Dates are when the note was published or reported. Analyst metrics differ (AI segment vs leasing only; year-end vs average capacity), so figures are not strictly comparable.']})}
  <h3>Revenue capacity at 100% utilisation ${est}</h3>
  <p class="mut" style="font-size:13px;margin:4px 0 8px">Formula: GPU count × rental price per GPU-hour × 8,760 hours. For capacity given in MW: MW ÷ all-in kW per GPU × price × 8,760. Market prices are third-party, dated rental rates; low = spot, base = reserved, high = on-demand. Real revenue would be lower (utilisation, internal Grok training, discounts, contract pricing).</p>
  ${tableBlock({columns: ['GPU', 'Low $/GPU-h', 'Base $/GPU-h', 'High $/GPU-h', 'All-in kW per GPU', 'Low US$m per MW-yr', 'Base US$m per MW-yr', 'High US$m per MW-yr', 'Price source'], rows: A.prices}, {id: 'tAiPr', wrap: true, notes: [...A.price_notes, 'kW per GPU: H100, GB200 and GB300 are implied by the 424B4 cluster figures (130 MW / 100k H100; 210 MW / 110k GB200; 220 MW / 110k GB300). H200: assumed equal to H100 (no filing figure).', ...A.ref.map(r => `${r[0]}: ${r[1]} per GPU-hour. ${r[2]}. ${r[3]}`)]})}
  ${tableBlock({columns: ['GPU', 'Count (CEO, 25 Sep 2026)', 'Low US$bn', 'Base US$bn', 'High US$bn'], rows: A.calc}, {id: 'tAiCa', notes: [`The 25 Sep 2026 fleet at the per-GPU kW above is about ${fmt(A.fleet_mw)} MW (calculated), close to the 1.4 GW nameplate in the 10-Q at 30 Jun 2026.`, `AI Solutions & Infrastructure revenue Q2 2026: US$2,194m × 4 = US$${fmt(A.ann_si)}m annualised, ${A.mon[1]}% of base-case capacity (${A.mon[2]}% on the high case, ${A.mon[0]}% on the low case). Whole AI segment Q2 2026: US$2,561m × 4 = US$${fmt(A.ann_ai)}m, which also includes X advertising and subscriptions.`, `Reported revenue per MW: US$${fmt(A.ann_si)}m ÷ 1,400 MW ≈ US$${A.si_per_mw}m per MW-year, against US$${A.gb300_mw[0]}m–${A.gb300_mw[2]}m per MW-year for GB300 at market rental rates (US$${A.gb300_mw[1]}m base).`]})}
  <h3>Same calculation on Elon’s and the Street’s capacity forecasts ${est}</h3>
  ${tableBlock({columns: ['Scenario', 'Whose forecast', 'Capacity', 'Low US$bn', 'Base US$bn', 'High US$bn', 'Street revenue forecast', 'Street ÷ base capacity %'], rows: A.cap}, {id: 'tAiFc', wrap: true, notes: ['MW-based rows use GB300 economics (2.0 kW per GPU; low/base/high GB300 rental prices). The 50m H100-equivalent row uses H100 prices. The orbital row is one year of launches at today’s terrestrial GB300 prices; no orbital rental price exists (n/a).', 'Street revenue is for the full year while capacity is year-end (or 2028 average for Morgan Stanley), so the % is a rough implied monetisation, not a utilisation rate. TD Cowen’s figures are compute leasing only.']})}
  </div>`;
}
function aiCharts() {
  const A = window.SPCX_AI; if (!A || !$('#aiGw')) return; const G = A.gwchart;
  chart('aiGw', {type: 'line', data: {labels: G.labels, datasets: [
    {label: 'Actual (nameplate)', data: G.actual, borderColor: C.acc, backgroundColor: C.acc, spanGaps: true, pointRadius: 4},
    {label: 'Elon target', data: G.elon, borderColor: C.dn, backgroundColor: C.dn, showLine: false, pointRadius: 7, pointStyle: 'triangle'},
    {label: 'Company guidance', data: G.company, borderColor: C.g, backgroundColor: C.g, showLine: false, pointRadius: 7, pointStyle: 'rectRot'},
    {label: 'Street low', data: G.street_lo, borderColor: C.g2, backgroundColor: C.g2, spanGaps: true, borderDash: [4, 4], pointRadius: 4},
    {label: 'Street high', data: G.street_hi, borderColor: C.g3, backgroundColor: C.g3, spanGaps: true, borderDash: [4, 4], pointRadius: 4}]},
    options: {scales: {y: {beginAtZero: true, title: {display: true, text: 'GW'}}}}});
  const rows = A.cap.filter(r => !/H100|orbit/.test(r[0]));
  chart('aiCap', {data: {labels: rows.map(r => r[2]), datasets: [
    {type: 'bar', label: 'Capacity revenue at 100% (base)', data: rows.map(r => r[4]), backgroundColor: C.acc},
    {type: 'line', label: 'Street revenue forecast', data: rows.map(r => ({'Fleet today': A.ann_si / 1000})[r[0]] ?? (r[6] === 'n/a' ? null : parseFloat(String(r[6]).replace(/.*US\$|bn.*/g, '')))), borderColor: C.dn, backgroundColor: C.dn, showLine: false, pointRadius: 6}]},
    options: {scales: {y: {beginAtZero: true, title: {display: true, text: 'US$bn'}}}}});
}

/* ---------------- Elon Musk ---------------- */
function muskTab() {
  const X = window.XFEED || {posts: []}, M = D.musk;
  const topics = ['All', ...new Set(X.posts.map(p => p.topic))];
  const mf = D.form4.filter(f => /musk/i.test(f.insider));
  $('#s-musk').innerHTML = `<h2>Elon Musk <span class="mut">What he says on X, and what he does with his shares</span></h2>
  <div class="grid g3" style="margin-bottom:16px">${M.kpis.map(k => kpi(k.l, esc(k.v), esc(k.s), k.url)).join('')}</div>
  <div class="grid g2">
    <div class="card"><h3 style="margin-top:0">Recent X posts on SpaceX <span class="mut">newest first · SGT · ${X.posts.length} posts</span></h3>
      <div class="chips" id="xchips">${topics.map((t, i) => `<button class="btn ${i ? '' : 'on'}" data-x="${esc(t)}">${esc(t)}</button>`).join('')}</div>
      <div id="xlist" style="max-height:900px;overflow:auto">${X.posts.map(p => `<div class="xpost" data-topic="${esc(p.topic)}"><div class="t">${esc(p.text)}</div><div class="m notr">${LANG === 'zh' ? `${esc(I18N.zhTok(dlong(p.sgt)))} ${esc(p.sgt.slice(11))} 新加坡时间 · ${esc(({post: '发帖', reply: '回复', quote: '引用', repost: '转发'})[p.kind] || p.kind)} · ${esc(I18N.s(p.topic))}${p.likes != null ? ' · ' + fmt(p.likes) + ' 赞' : ''} · <a href="${esc(p.url)}" target="_blank" rel="noopener">在 X 上打开</a>` : `${esc(dlong(p.sgt))} ${esc(p.sgt.slice(11))} SGT · ${esc(p.kind)} · ${esc(p.topic)}${p.likes != null ? ' · ' + fmt(p.likes) + ' likes' : ''} · <a href="${esc(p.url)}" target="_blank" rel="noopener">open on X</a>`}</div></div>`).join('') || '<div class="na">n/a — X feed not loaded</div>'}</div>
      <ul class="notes"><li>${esc(X.source || '')} · window ${esc(X.window || '')} · fetched ${esc(X.fetched_sgt || 'n/a')}. Text is verbatim (links trimmed); greetings and emoji-only replies are left out. Refresh with build_x.py.</li></ul></div>
    <div><div class="card" style="margin-bottom:16px"><h3 style="margin-top:0">Control & lock-up</h3>${RULESORDER().filter(r => ['vote', 'musk'].includes(r.id)).map(r => `<div class="rule"><b>${esc(r.title)}</b><blockquote>${esc(r.quote)}</blockquote><div class="w">${esc(r.where)}</div></div>`).join('')}
      <div style="font-size:13px">Lock-up status: <span class="pill active">Locked</span> until 12 Jun 2027 (a Saturday; first session Mon 14 Jun) · <span class="cdv" style="font-size:18px" id="muskcd"></span></div></div>
     <div class="card"><h3 style="margin-top:0">Form 4 transactions <span class="mut">only Musk filing, 17 Jun 2026 · all pre-IPO or IPO conversions</span></h3>
      ${tableBlock({columns: ['Date', 'Code', 'Type', 'Shares', 'Price', 'Held after', 'Held by'], rows: mf.map(f => [f.date, f.code, f.type, f.shares, f.price == null ? '—' : f.price, f.after, f.own])}, {id: 'tMF', notes: [M.note, 'Source: ' + 'https://www.sec.gov/Archives/edgar/data/1181412/000162828026044069/xslF345X06/wk-form4_1781740812.xml']})}</div></div></div>`;
  $$('#xchips button').forEach(b => b.onclick = () => { $$('#xchips button').forEach(x => x.classList.toggle('on', x === b)); $$('#xlist .xpost').forEach(p => p.hidden = b.dataset.x !== 'All' && p.dataset.topic !== b.dataset.x); });
  const t = new Date('2027-06-14T09:30:00-04:00'); const d = Math.ceil((t - new Date()) / 864e5); $('#muskcd').textContent = d > 0 ? tl(`${d} days to go`, `还有 ${d} 天`) : tl('released', '已解禁');
}

/* ---------------- valuation & street ---------------- */
function valTab() {
  const P = D.price, S = D.street;
  const vr = [['Market capitalisation', `US$${fmt(P.mcap_m)}m`], ['Enterprise value (net cash at 30 Jun 2026)', `US$${fmt(P.ev_m)}m`], [`EV / LTM revenue (US$${fmt(P.ltm_rev_m)}m)`, P.ev_rev_ltm + 'x'], ['EV / Q2 2026 annualised revenue', P.ev_rev_q2ann + 'x'], ['EV / LTM adjusted EBITDA (non-GAAP)', P.ev_ebitda + 'x'], ['P/E', `Not meaningful (LTM net loss US$${fmt(P.ltm_ni_m)}m)`], ['Price / book', P.pb + 'x']];
  $('#s-val').innerHTML = `<h2>Valuation & Street <span class="mut">At US$${fmt(P.close, 2)}, Nasdaq close ${esc(dlong(P.close_date))}</span></h2>
  <div class="grid g2"><div class="card"><h3 style="margin-top:0">Valuation (calculated)</h3>${tableBlock({columns: ['Metric', 'Value'], rows: vr}, {id: 'tVal', notes: [P.src, ...P.notes]})}</div>
  <div class="card"><h3 style="margin-top:0">Wall Street estimates <span class="est">third-party, unverified</span></h3>
    <div class="grid g3" style="margin-bottom:10px">${kpi('Analysts', S.n, esc(S.rating))}${kpi('Avg 12-m target', 'US$' + fmt(S.avg, 2), `US$${S.lo}–${S.hi} · was US$${S.avg_3m_ago} 3 months ago`)}${kpi('Split', '<span style="font-size:15px">' + esc(S.split) + '</span>', '')}</div>
    ${tableBlock({columns: ['Firm', 'Rating', 'Target'], rows: S.actions}, {id: 'tSt', notes: [S.src, S.note, 'See Sources → Bulls / Bears for what individual analysts said.']})}</div></div>`;
}

/* ---------------- Board of Directors (Insiders) ---------------- */
function boardHtml() {
  const B = window.SPCX_BOARD; if (!B) return '';
  const n = v => v == null || v === 0 ? '—' : v;
  const row = (r, exec) => { const c = r.cur, p = r.pro;
    return [r.name, r.role,
      c ? n(c.A) : 'n/a', c ? n(c.B) : 'n/a', c ? n(c.opt) : 'n/a', c ? n(c.rsu) : 'n/a', c ? dlong(c.asof) : 'n/a', c ? `Form ${c.form} filed ${dlong(c.filed)} ${c.url}` : 'n/a',
      p ? n(p[0]) : 'n/a', p ? p[1] : 'n/a', p ? n(p[2]) : 'n/a', p ? p[3] : 'n/a', p ? p[4] : 'n/a', ...(exec ? [] : [r.dtype, r.ind, r.com]), r.joined, r.other, r.src]; };
  const hold = ['Class A (latest filing)', 'Class B (latest filing)', 'Options (underlying shares)', 'RSUs', 'Holdings as of', 'Latest Form 3/4', 'Prospectus Class A', '% of Class A', 'Prospectus Class B', '% of Class B', 'Voting power', 'Source (role)'];
  const ex = list => (r, i) => list[i].note ? `<div style="font-size:12.5px;white-space:normal">${esc(list[i].note)}</div>` : '';
  const notes = ['Holdings are rebuilt from every Form 3, 4 and 5 (and amendment) filed with SpaceX as issuer since 1 Jun 2026: each later filing’s “owned following transaction” figure replaces the earlier one for the same security and holder; an amendment replaces the filing it amends. Direct and indirect (trusts, LLCs, funds) holdings are added together. “—” means none reported.',
    'Class B shares carry 10 votes each and convert one-for-one into Class A. Class B rows on Form 3 are reported as derivative securities convertible into Class A.',
    B.pro_basis + ' Percentages and voting power are as disclosed in the prospectus (“<1%” = less than 1%); they include options exercisable within 60 days, so they differ from the Form 3/4 columns.',
    `Prospectus “Management” and beneficial-ownership sections: ${B.p424}`, `Built ${B.built} from ${B.nfil} Forms 3/4/5 on EDGAR.`];
  return `<div class="card" id="board" style="margin:16px 0"><h3 style="margin-top:0">Board of Directors <span class="mut">9 directors · holdings from the latest Form 3/4 · click a row for notes</span></h3>
  ${tableBlock({columns: ['Name', 'Role', ...hold.slice(0, -1), 'Seat', 'Independent', 'Committees', 'Joined board', 'Primary other role', 'Source (role)'], rows: B.board.map(r => row(r))}, {id: 'tBoard', wrap: true, expand: ex(B.board), notes})}
  <h3>Executive officers who are not directors</h3>
  ${tableBlock({columns: ['Name', 'Role', ...hold.slice(0, -1), 'Joined board', 'Primary other role', 'Source (role)'], rows: B.execs.map(r => row(r, true))}, {id: 'tExec', wrap: true, expand: ex(B.execs), notes: ['Gwynne Shotwell (President and COO) is also a director and is listed in the board table. Elon Musk is CEO, CTO and Chairman.']})}</div>`;
}

/* ---------------- insiders ---------------- */
const CATL = {tax: 'Tax-driven (withholding / sell-to-cover)', planned: 'Planned sale (10b5-1)', voluntary: 'Voluntary open-market sale', buy: 'Open-market purchase', other: 'Grants, exercises, conversions, gifts, distributions'};
function insTab() {
  const F = D.form4; const by = k => F.filter(f => f.cat === k);
  const tbl = (k, id) => tableBlock({columns: ['Date', 'Insider', 'Role', 'Code', 'Type', 'Shares', 'Price (US$)', 'Held after', 'Filing'], rows: by(k).map(f => [f.date, f.insider, f.role, f.code, f.type, f.shares, f.price == null ? '—' : f.price, f.after, `Form ${f.amend} filed ${f.filed} ${f.url}`])}, {id, expand: r => { const f = by(k).find(x => x.date === r[0] && x.shares === r[5]); return f && f.fn ? `<span class="mut">Footnotes: ${esc(f.fn)}</span>` : null; }});
  $('#s-ins').innerHTML = `<h2>Insiders <span class="mut">SEC Form 4 since the IPO, parsed from EDGAR XML · newest first</span></h2>
  <p class="lead sm">Sales are split by reason so tax-driven selling is not read as insiders losing confidence. <b>No Form 4 code F (shares withheld for tax) or footnoted sell-to-cover sales have been filed for SPCX so far.</b> No open-market insider purchases were found.</p>
  ${boardHtml()}
  <h3>${CATL.tax}</h3>${by('tax').length ? tbl('tax', 'tTax') : '<div class="card na">None filed (as of 9 Oct 2026).</div>'}
  <h3>${CATL.planned}</h3>${by('planned').length ? tbl('planned', 'tPl') : '<div class="card na">None</div>'}
  <ul class="notes"><li>Gwynne Shotwell's 22 Sep sales (342,170 shares) followed same-day exercises of the same number of options (US$8.40–19.40 strikes) and were made under a Rule 10b5-1 plan adopted 23 Jun 2026 (Form 4 footnote F1). The footnotes do not say the sales were to cover tax.</li></ul>
  <h3>${CATL.voluntary}</h3>${by('voluntary').length ? tbl('voluntary', 'tVol') : '<div class="card na">None outside 10b5-1 plans.</div>'}
  <h3>${CATL.other}</h3>${tbl('other', 'tOth')}
  <h3>Disclosed trading plans <span class="mut">10-Q Item 5</span></h3>
  ${tableBlock({columns: ['Adopted', 'Who', 'Plan', 'Up to (shares)', 'Expires'], rows: [['2026-06-23', 'Gwynne Shotwell (President & COO)', 'Rule 10b5-1 sales', 585605, '2027-06-30'], ['2026-06-16', 'Bret Johnsen (CFO)', 'Rule 10b5-1 sales; no sales before 2027', 919497, '2027-06-17'], ['2026-06-12', 'Valor entities (director A. Gracias)', 'Rule 10b5-1 in-kind distribution to fund partners (not a sale)', 225857490, '2027-09-30']]}, {id: 'tPlans', notes: ['Source: Form 10-Q for Q2 2026, Part II Item 5.']})}`;
}

/* ---------------- risks & news ---------------- */
function riskTab() {
  $('#s-risks').innerHTML = `<h2>Risks & News <span class="mut">Risk factors from the prospectus and 10-Q · news newest first</span></h2>
  <div class="grid g2"><div class="xscope">${xallBtns()}${D.risks.map(([h, b], i) => details(esc(h), esc(b), '', i < 2)).join('')}</div>
  <div class="card"><h3 style="margin-top:0">Recent news & filings</h3>${D.news.map(([d, k, t]) => `<div class="cat"><div class="when">${esc(dlong(d))}</div><div style="flex:1"><span class="pill other">${esc(k)}</span> ${esc(t)}</div></div>`).join('')}<div class="mut" style="font-size:11.5px;margin-top:8px">Source: Chief's analysis (news feed with links in its workbook) and SEC EDGAR.</div></div></div>`;
}

/* ---------------- sources & live feed (bulls / bears) ---------------- */
const SRCSUB = [['feed', 'Sources & Live feed'], ['bull', 'Bulls'], ['bear', 'Bears']];
function voicesHtml(side) {
  const L = D.voices[side];
  return `<p class="mut" style="margin:4px 0 14px">${side === 'bull' ? 'Public bull cases on SpaceX' : 'Public bear and cautious cases on SpaceX, including sell-side ratings'}: only what each person or firm said, with a dated link on every point. Compiled 9 Oct 2026. Analyst forecasts are their estimates. Not investment advice.</p>
   <div class="grid g2">${L.map(v => `<div class="card voice"><h3 style="margin:0 0 2px">${esc(v.n)} <span class="vtag ${side}">${side === 'bull' ? 'Bull' : 'Bear'}</span></h3><div class="mut" style="font-size:12.5px">${esc(v.who)}${v.links.length ? ' · ' + v.links.map(([l, u]) => ext(u, l)).join(' · ') : ''}</div>
     <ul class="lst" style="margin-top:10px">${v.pts.map(([t, u, d]) => `<li>${esc(t)} <span class="mut">· ${ext(u)}, ${esc(d)}</span></li>`).join('')}</ul></div>`).join('')}</div>`;
}
function srcShow(id) { if (!SRCSUB.some(s => s[0] === id)) id = 'feed'; $$('#srcsub button').forEach(b => b.classList.toggle('on', b.dataset.v === id)); SRCSUB.forEach(([k]) => { const e = $('#src-' + k); if (e) e.hidden = k !== id; }); }
function sources() {
  const FD = window.FEED || {filings: [], fetched_sgt: 'n/a', status: 'not loaded'};
  const key = /^(4|4\/A|144|S-8|8-K|10-Q|10-K|424B4|S-1|S-1\/A|SCHEDULE 13G|SCHEDULE 13G\/A|3)$/;
  const ft = FD.filings.filter(f => key.test(f.form)).map(f => `<tr><td><b>${esc(f.form)}</b></td><td>${esc(f.date)}</td><td>${esc(f.report || '')}</td><td style="white-space:normal">${esc(f.desc)}${f.items ? ` <span class="mut">items ${esc(f.items)}</span>` : ''}</td><td>${ext(f.url, 'doc')} · ${ext(f.index, 'index')}</td></tr>`).join('');
  $('#s-sources').innerHTML = `<h2>Sources &amp; Live feed</h2><div class="subtabs" id="srcsub" role="tablist">${SRCSUB.map(([k, l]) => `<button role="tab" data-v="${k}">${esc(l)}</button>`).join('')}</div>
   <div id="src-bull" hidden>${voicesHtml('bull')}</div><div id="src-bear" hidden>${voicesHtml('bear')}</div><div id="src-feed">
   <div class="card"><h3>Live price feed</h3><ul class="lst">
    <li><b>Price box:</b> Nasdaq last sale via Robinhood, real-time, refreshed every 15 seconds through ${ext(QUOTE_API, QUOTE_API.replace(/^https?:\/\//, ''))} (Micron's quote relay; Nasdaq.com backup).</li>
    <li><b>Backup:</b> if the real-time feed fails, the box switches to TradingView's delayed quote widget.</li>
    <li><b>Chart:</b> TradingView advanced chart (NASDAQ:SPCX).</li><li><b>Status:</b> <span id="lfstat">${tl('Waiting for the first tick…', '等待首个报价…')}</span></li></ul></div>
   <div class="card" style="margin-top:16px"><h3>Latest SEC filings (CIK ${esc(FD.cik || '1181412')}) <span class="mut">newest first</span></h3><div class="mut" style="font-size:12px">Form 4, 144, S-8, 8-K, 10-Q, 424B4, S-1, 13G and Form 3 · data.sec.gov submissions API, fetched ${esc(FD.fetched_sgt)} (status: ${esc(FD.status)}).</div>
    <div class="tblwrap" style="max-height:460px;overflow:auto"><table class="feedt"><thead><tr><th>Form</th><th>Filed</th><th>Report date</th><th>Description / items</th><th>Link</th></tr></thead><tbody>${ft}</tbody></table></div></div>
   <h3>Source documents</h3><div class="card"><ul class="lst">${D.sources.map(([t, u]) => `<li>${esc(t)}${u ? ' — ' + ext(u, u.replace(/^https?:\/\//, '').slice(0, 70)) : ''}</li>`).join('')}</ul>
   <ul class="notes"><li>Built ${esc(D.meta.built_sgt)} by build_data.py; SEC feed by build_feed.py; X posts by build_x.py. Unavailable figures are shown as n/a; estimates are labelled.</li></ul></div></div>`;
  $$('#srcsub button').forEach(b => b.onclick = () => { location.replace('#sources/' + b.dataset.v); srcShow(b.dataset.v); });
  srcShow(location.hash.split('/')[1] || 'feed');
}

/* ---------------- router & theme ---------------- */
const TABS = [['overview', 'Overview', overview], ['ipo', 'IPO & Lock-up', ipoTab], ['fin', 'Financials', finTab], ['biz', 'Segments & Starlink', bizTab], ['ops', 'Operations', opsTab],
  ['musk', 'Elon Musk', muskTab], ['val', 'Valuation & Street', valTab], ['ins', 'Insiders', insTab], ['risks', 'Risks & News', riskTab], ['sources', 'Sources & Live feed', sources]];
const NAVL = {overview: 'Overview', ipo: 'IPO & Lock-up', fin: 'Financials', biz: 'Segments', ops: 'Operations', musk: 'Elon Musk', val: 'Valuation', ins: 'Insiders', risks: 'Risks & News', sources: 'Sources & Live feed'};
const done = {};
function route() {
  let id = (location.hash || '#overview').slice(1).split('/')[0]; if (!TABS.some(t => t[0] === id)) id = 'overview';
  if (id === 'sources' && done.sources) srcShow(location.hash.split('/')[1] || 'feed');
  $$('#nav a').forEach(a => { const on = a.dataset.t === id; a.classList.toggle('on', on); if (on) a.scrollIntoView({block: 'nearest', inline: 'center'}); });
  $$('main section').forEach(s => s.classList.toggle('on', s.id === 's-' + id));
  const t = TABS.find(t => t[0] === id);
  if (!done[id]) { try { t[2](); } catch (e) { console.error('render ' + id, e); $('#s-' + id).insertAdjacentHTML('beforeend', `<div class="tvfail">This tab could not render: ${esc(e.message)}</div>`); } done[id] = 1; wireTables($('#s-' + id)); wireXall($('#s-' + id)); tickCountdowns(); try { I18N.apply($('#s-' + id)); } catch (e) { console.error('i18n ' + id, e); } }
  document.title = tl(`${t[1]} · SpaceX (SPCX) Dashboard · © 2026 Hugo Tian`, `${I18N.s(t[1])} · SpaceX (SPCX) 看板 · © 2026 Hugo Tian`);
}
function buildNav() { $('#nav').innerHTML = TABS.map(([id, l]) => `<a href="#${id}" data-t="${id}" title="${esc(l)}">${esc(NAVL[id] || l)}</a>`).join(''); $('#main').innerHTML = TABS.map(([id]) => `<section id="s-${id}"></section>`).join(''); I18N.apply($('#nav')); chrome(); }
function chrome() { /* static header text, language pill */
  $('.hero h1').innerHTML = tl('SpaceX <span class="tk">$SPCX</span> Dashboard', 'SpaceX <span class="tk">$SPCX</span> 看板'); $('.brand .bn').textContent = tl('Dashboard', '看板');
  $('.brand').setAttribute('aria-label', tl('SpaceX dashboard home', 'SpaceX 看板首页'));
  $('#flag-en').classList.toggle('on', LANG !== 'zh'); $('#flag-zh').classList.toggle('on', LANG === 'zh');
  $('#langbtn').title = tl('Language: English · click for 中文', '语言：中文 · 点击切换为 English'); $('#langbtn').setAttribute('aria-label', tl('Switch language to Chinese', '切换语言为英文'));
  $('#themebtn').title = tl('Theme: follows your system until you pick one', '主题：默认跟随系统，点击可切换'); }
function applyTheme(rerender) {
  const t = document.documentElement.dataset.theme || 'auto';
  $('#themelbl').textContent = t === 'auto' ? tl('Auto', '自动') : t === 'dark' ? tl('Dark', '深色') : tl('Light', '浅色'); $('#themeic').textContent = t === 'auto' ? '◐' : t === 'dark' ? '☾' : '☀';
  if (!rerender) return; palette(); Object.keys(charts).forEach(k => { try { charts[k].destroy(); } catch (e) {} delete charts[k]; }); for (const k in done) delete done[k]; buildNav(); hero(); route();
}
$('#themebtn').onclick = () => { const cur = document.documentElement.dataset.theme || 'auto'; const nx = cur === 'auto' ? (isDark() ? 'light' : 'dark') : cur === 'dark' ? 'light' : 'auto';
  if (nx === 'auto') { delete document.documentElement.dataset.theme; try { localStorage.removeItem('spcx-theme'); } catch (e) {} } else { document.documentElement.dataset.theme = nx; try { localStorage.setItem('spcx-theme', nx); } catch (e) {} } applyTheme(true); };
$('#langbtn').onclick = () => { LANG = LANG === 'zh' ? 'en' : 'zh'; const h = document.documentElement; h.dataset.lang = LANG; h.lang = LANG === 'zh' ? 'zh-CN' : 'en';
  try { localStorage.setItem('spcx-lang', LANG); } catch (e) {} LQ.tv = false; applyTheme(true); };
if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (!document.documentElement.dataset.theme) applyTheme(true); });
$('#foot').innerHTML = `© 2026 Hugo Tian. All rights reserved.`;
palette(); buildNav(); applyTheme(false); hero(); route(); addEventListener('hashchange', route);

/* ---------------- short interest (FINRA; si.js from build_si.py) ---------------- */
function siPanel() {
  const S = window.SPCX_SI; if (!S) return '<h3 id="short">Short interest</h3><div class="card na">Short-interest data did not load (n/a).</div>';
  const H = S.hist, L = H[0], P = H[1], nx = S.pending[0], today = new Date().toISOString().slice(0, 10);
  const pubTxt = p => `settlement ${dlong(p.settle)} → FINRA publication ${dlong(p.pub)}${p.pub <= today ? ' (due today/overdue, after the US close; not yet in FINRA’s API at build time)' : ''}`;
  const head = `<h3 id="short">Short interest <span class="mut">FINRA exchange short interest · twice-monthly settlement dates, published 7 business days later · data built ${esc(S.built_sgt)}</span></h3>`;
  if (!L) return head + `<div class="card na">No FINRA short-interest report for SpaceX since the IPO is available yet: n/a. Next: ${esc(nx ? pubTxt(nx) : 'n/a')}. ${ext(S.src.cal, 'FINRA schedule')}</div>`;
  const pct = (a, b) => b ? (a / b * 100) : null;
  const latestRel = S.float_steps.filter(s => s.date && s.date <= L.settle).slice(-1)[0];
  const cards = `<div class="grid g4" style="margin-bottom:12px">
    ${kpi('Short interest · settlement ' + dlong(L.settle), fmt(L.si / 1e6, 1) + 'm shares', `${fmt(L.si)} shares · published ${dlong(L.pub)}`, S.src.si_page)}
    ${kpi('% of unlocked float (calc.)', fmt(L.pct_float, 1) + '%', `÷ ${fmt(L.float_m, 1)}m unlocked float at ${dlong(L.settle)} · ${fmt(L.pct_out, 1)}% of all 13,573m shares outstanding`)}
    ${kpi('Days to cover', fmt(L.dtc, 2), `FINRA: SI ÷ ADV of ${fmt(L.adv)} shares (avg daily volume over the reporting period)`)}
    ${kpi('Change vs ' + (P ? dlong(P.settle) : 'previous'), `${L.chg < 0 ? '−' : '+'}${fmt(Math.abs(L.chg) / 1e6, 1)}m`, `${(L.chg_pct < 0 ? '−' : '+') + fmt(Math.abs(L.chg_pct), 2)}% · previous ${fmt(L.prev)} shares (FINRA)`)}</div>
    <p class="mut" style="font-size:12.5px;margin:0 0 12px">Next report: ${esc(nx ? pubTxt(nx) : 'n/a')}${S.pending[1] ? `; then ${esc(dlong(S.pending[1].settle))} → ${esc(dlong(S.pending[1].pub))}` : ''} (US dates; publication lands in the SGT evening/night). ${ext(S.src.cal, 'FINRA schedule')}</p>`;
  const sg = (v, d) => (v < 0 ? '−' : '+') + fmt(Math.abs(v), d);
  const hrows = H.map(h => [dlong(h.settle) + (h.rev === 'R' ? ' (revised)' : ''), fmt(h.si), `${sg(h.chg)} (${sg(h.chg_pct, 2)}%)`, fmt(h.adv), fmt(h.dtc, 2), fmt(h.float_m, 1), fmt(h.pct_float, 2) + '%', fmt(h.pct_out, 2) + '%', h.pub ? dlong(h.pub) : 'n/a']);
  const fsteps = [...S.float_steps].sort((a, b) => (b.sort || b.date).localeCompare(a.sort || a.date) || b.float_m - a.float_m);
  const frows = fsteps.map(s => [s.date ? dlong(s.date) : 'TBA', s.label, '+' + fmt(s.add_m, 1), fmt(s.float_m, 1), fmt(pct(L.si / 1e6, s.float_m), 2) + '%', (s.date && s.date <= today) ? 'Unlocked' : 'Upcoming']);
  const D7 = S.daily, agg = D7.reduce((a, d) => [a[0] + d.short_vol, a[1] + d.total_vol], [0, 0]);
  const drows = D7.map(d => [dlong(d.date), fmt(d.short_vol), fmt(d.exempt), fmt(d.total_vol), fmt(d.ratio, 1) + '%']);
  return head + cards + `<div class="grid g2" style="margin-bottom:12px">${ccard('siHist', 'Short interest since the IPO (m shares) and % of unlocked float', 'FINRA · settlement dates', 280)}${ccard('siFloat', 'Unlocked float as tranches release (m shares, calc.)', 'latest SI as % of each step, line', 280)}</div>
  ${tableBlock({title: 'All FINRA reports since the IPO (newest first)', columns: ['Settlement', 'Short interest', 'Change (%)', 'ADV used', 'Days to cover', 'Unlocked float (m, calc.)', '% of unl. float', '% of shares out', 'Published'], rows: hrows}, {id: 'tSI', csvname: 'SPCX short interest', notes: [
    'Source: FINRA consolidated equity short interest (Rule 4560; exchange-listed incl. Nasdaq), via FINRA’s public Query API ' + S.src.si + ' . Short interest, ADV, days to cover, change and change % are FINRA’s figures; float and % columns are calculated.',
    'The ticker SPCX was previously used by “The SPAC and New Issue ETF”; only records for Space Exploration Technologies settled on or after the 11 Jun 2026 IPO are shown.',
    '15 Jun 2026 was reported as 23,341,117 shares; the next report lists the previous figure as 23,331,117. 30 Jun 2026 carries FINRA’s revision flag (R).']})}
  ${tableBlock({title: 'Which float: unlocked float by lock-up step (newest first)', columns: ['Date', 'Step', 'Added (m)', 'Unlocked float (m, calc.)', 'Latest SI as % (illustrative)', 'Status'], rows: frows}, {id: 'tSIF', csvname: 'SPCX unlocked float', notes: [
    'Float used = unlocked (tradable) float, NOT total shares outstanding: 638,888,888 Class A shares sold in the IPO incl. the full over-allotment (10-Q, Q2 2026: ' + S.src.ipo + ') plus each lock-up release on its date, from the 424(b)(4) “Shares Eligible for Future Sale” schedule.',
    'Releases are the prospectus maximums (“up to”), so this is an upper bound for the tradable float and the % of float is a lower bound. The conditional 455.8m price-trigger release (not met per Chief) is excluded. Earnings-linked dates (TBA) are placed at an assumed month. Affiliate, employee (S-8) and Rule 144 nuances are not modelled.',
    '“Latest SI as % (illustrative)” holds the latest FINRA short interest (' + fmt(L.si) + ' shares, ' + dlong(L.settle) + ') constant to show how the same position dilutes as more shares unlock; it is not a forecast.']})}
  <h4 style="margin:18px 0 6px">FINRA daily short-sale volume <span class="est">not short interest</span></h4>
  ${tableBlock({columns: ['Date', 'Short-sale volume', 'Short-exempt', 'FINRA-reported total volume', 'Short-sale ratio'], rows: drows}, {id: 'tSSV', csvname: 'SPCX FINRA daily short sale volume', notes: [
    `Last ${D7.length} trading days: ${fmt(agg[0])} short-sale shares of ${fmt(agg[1])} FINRA-reported shares (${fmt(pct(agg[0], agg[1]), 1)}%).`,
    'Source: FINRA Reg SHO daily short-sale volume files (CNMS, consolidated NMS), ' + S.src.daily + ' . These count trades marked short that were reported to FINRA facilities (mostly off-exchange); they exclude exchange-executed volume and include market-maker hedging, so they are a flow measure, not open short positions.',
    'Borrow fee and utilisation: not shown — no official source; no third-party vendor figure is used.']})}`;
}
function siCharts() {
  const S = window.SPCX_SI; if (!S || !S.hist.length) return;
  const H = [...S.hist].reverse();
  chart('siHist', {data: {labels: H.map(h => dlong(h.settle).replace(' 20', " '")), datasets: [
    {type: 'bar', label: 'Short interest (m)', data: H.map(h => +(h.si / 1e6).toFixed(1)), backgroundColor: C.acc, yAxisID: 'y'},
    {type: 'line', label: '% of unlocked float', data: H.map(h => h.pct_float), borderColor: C.g2, backgroundColor: C.g2, yAxisID: 'y1', tension: .2}]},
    options: {scales: {y: {title: {display: true, text: 'm shares'}}, y1: {position: 'right', grid: {display: false}, ticks: {callback: v => v + '%'}}}}});
  const L = S.hist[0], F = [...S.float_steps].sort((a, b) => (a.sort || a.date).localeCompare(b.sort || b.date) || a.float_m - b.float_m), today = new Date().toISOString().slice(0, 10);
  chart('siFloat', {data: {labels: F.map(s => s.date ? dlong(s.date).replace(' 20', " '") : (s.label.match(/Q\d \d{4}/) || ['TBA'])[0]), datasets: [
    {type: 'bar', label: 'Unlocked float (m, calc.)', data: F.map(s => s.float_m), backgroundColor: F.map(s => s.date && s.date <= today ? C.acc : C.g3), yAxisID: 'y'},
    {type: 'line', label: 'Latest SI as % (illustrative)', data: F.map(s => +(L.si / 1e6 / s.float_m * 100).toFixed(2)), borderColor: C.g2, backgroundColor: C.g2, yAxisID: 'y1', tension: .2}]},
    options: {scales: {y: {title: {display: true, text: 'm shares'}}, y1: {position: 'right', grid: {display: false}, ticks: {callback: v => v + '%'}}}}});
}

/* ---------------- index, ETF & real-money demand (demand.js from build_demand.py) ---------------- */
function demandPanel() {
  const M = window.SPCX_DEMAND, head = `<h3 id="demand">Index, ETF & real-money demand <span class="mut">buyers that offset unlock supply · data built ${M ? esc(M.built_sgt) : 'n/a'}</span></h3>`;
  if (!M) return head + '<div class="card na">Demand data did not load (n/a).</div>';
  const pill = s => s === 'included' ? '<span class="pill passed">Included</span>' : s === 'announced' ? '<span class="pill upcoming">Announced</span>' : s === 'eligible' ? '<span class="pill upcoming">Eligible – pending</span>' : '<span class="pill na">Not eligible</span>';
  const idx = M.index.map(x => `<div class="rule"><div class="h"><b>${esc(x.name)}</b> ${pill(x.status)} <span class="mut" style="font-size:12px">${x.date ? esc(dlong(x.date)) : 'date n/a'}</span></div>
    <div style="font-size:13px;margin:3px 0">${esc(x.status_txt)}</div>
    ${x.quote ? `<blockquote>${esc(x.quote)}</blockquote>` : `<div class="mut" style="font-size:12.5px;margin:4px 0">${esc(x.noquote || 'No provider announcement found.')}</div>`}
    <div class="w">${esc(x.src)} · ${ext(x.url, 'open')}${x.live ? ' · ' + esc(x.live) : ''}</div>
    <div style="font-size:12.5px;margin-top:4px"><b>Passive position:</b> ${esc(x.passive)} ${(x.links || []).map(l => ext(l[1], l[0])).join(' · ')}</div></div>`).join('');
  const per = Object.keys(M.f13).sort().reverse(), P = per.length ? M.f13[per[0]] : null, asof = per.length ? dlong(per[0]) : 'n/a';
  const nf = M.nport || [], PS = M.passive || {sh: 0, funds: 0}, nfTot = PS.sh;
  const frows = nf.map(f => [f.series || f.trust, f.type === 'index' ? 'Index fund/ETF' : 'Active/other', dlong(f.date), fmt(f.sh), mm(f.val / 1e6), fmt(f.pct, 2) + '%', dlong(f.filed), f.url]);
  const trows = P ? P.top.map((t, i) => [t.name, fmt(t.sh), mm(t.val / 1e6), fmt(t.pct_out, 2) + '%', t.chg == null ? 'n/a' : (t.chg < 0 ? '−' : '+') + fmt(Math.abs(t.chg)), t.pre ? 'Pre-IPO (13G)' : '—', `${dlong(t.filed)} ${t.url}`]) : [];
  const grows = (M.g13 || []).map(g => [dlong(g.filed), g.form, g.who, g.top_person && g.top_person !== g.who ? g.top_person : '—', g.shares == null ? 'n/a' : fmt(g.shares), g.pct == null ? 'n/a' : fmt(g.pct, 1) + '%', g.event ? dlong(g.event) : 'n/a', g.rule || 'n/a', g.url]);
  /* illustration */
  const now = new Date().toISOString().slice(0, 10), rel = D.releases.filter(r => !r.cond && r.pool !== 'Musk' && (r.date || r.sort) >= now && (r.date || r.sort) <= '2026-12-08');
  const sup = rel.reduce((a, r) => a + r.shares_m, 0), F0 = 638.888888, share = nfTot / 1e6 / F0;
  const preSh = P ? P.top.filter(t => t.pre).reduce((a, t) => a + t.sh, 0) : 0;
  const illus = `<div class="card" style="margin:12px 0;border-left:3px solid var(--acc)"><b>Supply vs identified demand</b> <span class="est">illustration</span>
    <p style="margin:6px 0 0;font-size:13.5px">Releases from today to 8 Dec 2026 add up to at most <b>${fmt(sup, 1)}m shares</b> (${rel.length} tranches, prospectus maximums). The ${PS.funds} index funds/ETFs identified in N-PORT filings held <b>${fmt(nfTot / 1e6, 1)}m shares</b> on 30 Jun 2026, ${fmt(share * 100, 1)}% of the then 638.9m-share float. If those float-weighted index funds keep the same share of the float as it grows, they would absorb about <b>${fmt(share * sup, 1)}m</b> of those ${fmt(sup, 1)}m shares (${fmt(share * 100, 1)}%), mostly at their next float/rebalance dates rather than on unlock day. Not included: QQQ/Nasdaq-100 trackers (holding n/a), index funds whose N-PORT is not public yet or reports a later date, and active buyers (all 30 Jun N-PORT funds together held ${fmt(PS.all_30jun_sh / 1e6, 1)}m shares, but active funds such as Baron include pre-IPO stakes).</p>
    <p class="mut" style="margin:6px 0 0;font-size:12.5px">13F managers reported ${P ? fmt(P.total_sh / 1e6, 1) + 'm shares as of ' + asof : 'n/a'}, but that total includes pre-IPO stakes (at least ${fmt(preSh / 1e6, 1)}m shares are matched to pre-IPO Schedule 13G holders) that are themselves part of the lock-up supply, so it is not new demand. Illustration only; not a forecast.</p></div>`;
  return head + illus + `<h4 style="margin:14px 0 6px">Index inclusions <span class="mut">provider wording, quoted</span></h4><div class="card rules">${idx}</div>
  ${tableBlock({title: 'Index funds and ETFs holding SPCX (SEC N-PORT, largest first)', columns: ['Fund (all share classes)', 'Type (by name)', 'As of', 'Shares', 'Value', '% of fund', 'Filed', 'Filing'], rows: frows}, {id: 'tNP', csvname: 'SPCX fund holdings N-PORT', notes: [
    `Source: SEC N-PORT-P filings found by EDGAR full-text search for SpaceX’s CUSIP ${M.cusip} (${M.nport_count} fund series with a position; shown: the 30 largest plus the largest index funds). “Type” is assigned from the fund name (index/tracker vs active/other) and is a heuristic. Holdings are as of each report date (mostly 30 Jun 2026), not current. Vanguard N-PORTs are per fund, covering the ETF share class (VTI, VUG, VXF) and mutual-fund classes together.`,
    'QQQ (Invesco QQQ Trust) is a unit investment trust and files no N-PORT; Invesco’s holdings file/API did not respond (HTTP 503/406), so its SPCX holding is n/a here. Third-party: Morningstar (14 Jul 2026) reported a 1.3% Nasdaq-100 weight at the 7 Jul add.']})}
  <h4 style="margin:14px 0 6px">Real money: 13F holdings as of 30 Jun 2026 <span class="mut">quarter-end positions, not current holdings</span></h4>
  <div class="grid g4" style="margin-bottom:12px">
    ${kpi('13F filers with SPCX · as of ' + asof, P ? fmt(P.filers) : 'n/a', P ? `${fmt(P.long_filers)} with long share positions` : '', M.src.f13)}
    ${kpi('13F long shares · as of ' + asof, P ? fmt(P.total_sh / 1e6, 1) + 'm' : 'n/a', P ? `${fmt(P.total_sh / 1e6 / D.price.shares_m * 100, 1)}% of 13,573m shares out (calc.) · includes pre-IPO stakes` : '')}
    ${kpi('13F options · as of ' + asof, P ? fmt(P.calls / 1e6, 1) + 'm calls / ' + fmt(P.puts / 1e6, 1) + 'm puts' : 'n/a', 'underlying shares, excluded from the long total')}
    ${kpi('Next 13F (quarter to 30 Sep 2026)', 'due 14 Nov 2026', M.f13_next.early_filers != null ? `${fmt(M.f13_next.early_filers)} early filings with SPCX already on EDGAR (not aggregated)` : 'early filings: n/a')}</div>
  ${tableBlock({title: 'Top 13F holders · as of 30 Jun 2026', columns: ['Manager', 'Shares (30 Jun 2026)', 'Value (30 Jun 2026)', '% of shares out', 'QoQ change', 'Pre-IPO flag', 'Filed · filing'], rows: trows}, {id: 'tF13', csvname: 'SPCX 13F holders 30 Jun 2026', notes: [
    'Source: SEC Form 13F data set (1 Jun–31 Aug 2026 filings), information-table rows for CUSIP ' + M.cusip + ', period of report 30 Jun 2026. Long share positions only (put/call rows excluded). Where a manager filed a restatement (13F-HR/A), the latest restatement replaces the original; “new holdings” amendments are added. ' + M.src.f13,
    'All positions are as of 30 Jun 2026 (quarter end); managers may have bought or sold since. SpaceX was private before 11 Jun 2026, so there is no prior-quarter 13F position to compare (change n/a).',
    '13F holdings include shares bought before the IPO, many still under lock-up. “Pre-IPO flag” is set only where the 13F share count exactly matches a Schedule 13G filed under Rule 13d-1(d) (holders that owned before the stock was registered); other holders are not classified. Flagged: ' + (P ? P.top.filter(t => t.pre).map(t => t.name + ' — ' + t.pre).join('; ') : 'none') + '.']})}
  ${tableBlock({title: 'Schedule 13G / 13D filed since the IPO (newest first)', columns: ['Filed', 'Form', 'Reporting person', 'Largest reporting entity', 'Shares', '% of Class A', 'Event date', 'Rule', 'Filing'], rows: grows}, {id: 'tG13', csvname: 'SPCX 13G 13D', notes: ['Source: SpaceX’s EDGAR submissions (CIK 1181412). No Schedule 13D was found. All 13Gs so far are under Rule 13d-1(d), i.e. holders that owned the shares before registration.']})}`;
}
