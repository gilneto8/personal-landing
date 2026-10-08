/* Homepage scenes: the vault (constellation, stack, conversation) and the finance pieces (flow, Koa, Kelaro, Cashew).
   Each canvas draws only while on screen and starts its clock the first time it is seen.
   All rows, amounts, names and chat lines are illustrative samples; the four stats are real (vault, 2026-10-08). */


const P = { bg:'#161f35', panel:'#1f2a46', line:'#2e3b5e', dim:'#8a97b8', text:'#dbe2f2', bright:'#f5f7fc', pink:'#ff5d8f', amber:'#ffb547', teal:'#2ec4b6', blue:'#7aa2ff', lav:'#c792ea' };
P.s = [P.pink, P.amber, P.teal, P.blue, P.lav];
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const ease = t => 1 - Math.pow(1 - t, 3), clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mono = (c, px = 12) => c.font = `400 ${px}px Geist Mono, monospace`;
const sans = (c, px = 14, wt = 500) => c.font = `${wt} ${px}px Geist, system-ui`;
const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };
const fmt = v => (v < 0 ? '−' : '') + Math.abs(v).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
let rng = 7; const rand = () => (rng = (rng * 16807) % 2147483647) / 2147483647;
const gauss = () => { let u = 0, v = 0; while (!u) u = rand(); while (!v) v = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
let CAP = null; // the caption element of the scene being drawn
const setCap = (a, b) => { const html = b === undefined ? a : b; if (CAP && CAP.dataset.v !== html) { CAP.dataset.v = html; CAP.innerHTML = html; } };

function counters() {
  document.querySelectorAll('[data-n]').forEach((b, i) => {
    const n = +b.dataset.n, s = b.dataset.s || '', t0 = performance.now() + i * 120;
    (function f(now) { const k = Math.min(1, Math.max(0, (now - t0) / 1400)); b.textContent = Math.round(ease(k) * n).toLocaleString('en') + s; if (k < 1) requestAnimationFrame(f); })(t0);
  });
}
counters();

const CL = [
  { name: 'Work', n: 260, c: 3, x: 0.30, y: 0.34 },
  { name: 'Life', n: 170, c: 0, x: 0.72, y: 0.30 },
  { name: 'Sessions', n: 230, c: 4, x: 0.66, y: 0.72 },
  { name: 'Tasks', n: 90, c: 1, x: 0.24, y: 0.72 },
  { name: 'Ideas', n: 110, c: 2, x: 0.50, y: 0.52 },
  { name: 'Tools & rules', n: 91, c: 4, x: 0.88, y: 0.55 },
];
const graph = { nodes: [], edges: [], adj: [] };
CL.forEach((cl, ci) => { for (let i = 0; i < cl.n; i++) { const r = Math.abs(gauss()) * 0.09 + 0.01, a = rand() * 7; graph.nodes.push({ ci, fx: cl.x + Math.cos(a) * r * 1.2, fy: cl.y + Math.sin(a) * r, d: rand() }); } });
graph.adj = graph.nodes.map(() => []);
graph.nodes.forEach((n, i) => {
  const k = 2 + Math.floor(rand() * 2);
  for (let j = 0; j < k; j++) {
    let m = Math.floor(rand() * graph.nodes.length);
    if (rand() < 0.85) { let best = -1, bd = 9; for (let t = 0; t < 30; t++) { const q = Math.floor(rand() * graph.nodes.length); const o = graph.nodes[q]; if (o.ci !== n.ci || q === i) continue; const dd = (o.fx - n.fx) ** 2 + (o.fy - n.fy) ** 2; if (dd < bd) { bd = dd; best = q; } } if (best >= 0) m = best; }
    if (m !== i) { graph.edges.push([i, m]); graph.adj[i].push(m); graph.adj[m].push(i); }
  }
});
let query = null;
function newQuery(t) {
  const a = Math.floor(rand() * graph.nodes.length); const prev = new Map([[a, -1]]); let frontier = [a], depth = 0, end = a;
  while (depth < 4 && frontier.length) { const nx = []; for (const f of frontier) for (const g of graph.adj[f]) if (!prev.has(g)) { prev.set(g, f); nx.push(g); } frontier = nx; depth++; if (nx.length) end = nx[Math.floor(rand() * nx.length)]; }
  const path = []; for (let v = end; v !== -1; v = prev.get(v)) path.unshift(v);
  const Q = ['what did we decide on rates?', 'when is the pilot call?', 'which bank formats break Koa?', 'what did I learn about bonds?', 'who replied about the contract?'];
  query = { path, t0: t, q: Q[Math.floor(rand() * Q.length)] };
}
function graphScene(c, w, h, e) {
  const t = e;
  const appear = ease(Math.min(1, e / 1.8));
  const pos = graph.nodes.map(n => ({ x: w * (0.5 + (n.fx - 0.5) * appear) + Math.sin(t * 0.3 + n.d * 9) * 2, y: h * (0.5 + (n.fy - 0.5) * appear) + Math.cos(t * 0.27 + n.d * 7) * 2 }));
  c.lineWidth = 0.6;
  for (let i = 0; i < graph.edges.length; i += 1) { const [a, b] = graph.edges[i]; const same = graph.nodes[a].ci === graph.nodes[b].ci; c.strokeStyle = same ? rgba(P.s[CL[graph.nodes[a].ci].c], 0.08) : rgba(P.dim, 0.05); c.beginPath(); c.moveTo(pos[a].x, pos[a].y); c.lineTo(pos[b].x, pos[b].y); c.stroke(); }
  graph.nodes.forEach((n, i) => { c.fillStyle = rgba(P.s[CL[n.ci].c], 0.35 + 0.4 * n.d); c.beginPath(); c.arc(pos[i].x, pos[i].y, 1 + n.d * 1.4, 0, 7); c.fill(); });
  CL.forEach(cl => { c.font = '500 12px Geist, system-ui'; c.fillStyle = rgba(P.bright, 0.8 * appear); c.textAlign = 'center'; c.fillText(cl.name, w * cl.x, h * cl.y - h * 0.12); });
  if (!query || t - query.t0 > 5) newQuery(t);
  const qe = t - query.t0, steps = query.path.length - 1, k = Math.min(steps, qe / 0.55);
  c.strokeStyle = P.bright; c.lineWidth = 1.6; c.beginPath();
  for (let i = 0; i <= Math.floor(k); i++) { const p = pos[query.path[i]]; i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y); }
  if (k < steps) { const a = pos[query.path[Math.floor(k)]], b = pos[query.path[Math.floor(k) + 1]], f = k % 1; c.lineTo(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f); }
  c.stroke();
  query.path.forEach((v, i) => { if (i <= k) { c.fillStyle = i === steps && k >= steps ? P.s[0] : P.bright; c.beginPath(); c.arc(pos[v].x, pos[v].y, i === steps && k >= steps ? 5 : 3, 0, 7); c.fill(); } });
  setCap(`<b>“${query.q}”</b> → ${k >= steps ? `found in ${steps} hops, with sources` : 'following links…'}`);
}

const LAYERS = [
  ['Inputs', 'mail · calendar · chat, both accounts', 4],
  ['Inbox', 'every fact captured the turn it is said', 0],
  ['Vault', '951 markdown notes, git-versioned', 3],
  ['Indexes + vectors', 'state from indexes, facts from search', 2],
  ['Skills', 'tutor · voice · brief · research · pipeline', 1],
  ['Night jobs', 'route · lint · eval · audit · digest', 4],
];
function stackScene(c, w, h, e) {
  const open = ease(Math.min(1, e / 1.6)) * (0.75 + 0.25 * Math.sin(e * 0.8));
  const cx = w * 0.26, base = h * 0.84, s = Math.min(w, h) * 0.2, gap = 18 + open * 58;
  const hl = Math.floor(e / 2.2) % LAYERS.length;
  LAYERS.forEach((L, i) => {
    const y = base - i * gap, col = P.s[L[2]], on = i === hl;
    c.beginPath(); c.moveTo(cx, y - s * 0.5); c.lineTo(cx + s, y); c.lineTo(cx, y + s * 0.5); c.lineTo(cx - s, y); c.closePath();
    c.fillStyle = rgba(col, on ? 0.30 : 0.12); c.fill(); c.strokeStyle = rgba(col, on ? 1 : 0.55); c.lineWidth = on ? 1.6 : 1; c.stroke();
    // inner detail per layer
    c.strokeStyle = rgba(col, 0.35); c.lineWidth = 1;
    for (let k = 1; k < 4; k++) { const f = k / 4; c.beginPath(); c.moveTo(cx - s + s * f, y - s * 0.5 * f); c.lineTo(cx + s * f, y + s * 0.5 * (1 - f)); c.stroke(); }
    // label + leader
    const lx = cx + s + 30;
    c.strokeStyle = rgba(P.dim, on ? 0.9 : 0.35); c.beginPath(); c.moveTo(cx + s, y); c.lineTo(lx - 6, y); c.stroke();
    c.textAlign = 'left'; c.font = '500 14px Geist, system-ui'; c.fillStyle = on ? P.bright : P.text; c.fillText(L[0], lx, y + 1);
    c.font = '400 12px Geist Mono, monospace'; c.fillStyle = on ? col : P.dim; c.fillText(L[1], lx, y + 18);
  });
  // particles rising through the stack
  for (let i = 0; i < 14; i++) { const p = ((e * 0.25 + i / 14) % 1), y = base - p * (LAYERS.length - 1) * gap, x = cx + Math.sin(i * 3.1 + e) * s * 0.3; c.fillStyle = rgba(P.bright, 0.7 * Math.sin(p * Math.PI)); c.beginPath(); c.arc(x, y, 1.6, 0, 7); c.fill(); }
  setCap(`<b>${LAYERS[hl][0]}</b> — ${LAYERS[hl][1]}`);
}

const CHAT = [
  ['q', 'what\'s on today?'],
  ['a', 'Three tasks due, one call at 15:00. The Kelaro pilot is still waiting on a reply.', 'sources', 'ok', 'brief'],
  ['q', 'teach me how bonds are priced'],
  ['a', 'New course: four parts. Lesson 1 is ready as a 9-minute video with subtitles.', '', '', 'tutor'],
  ['q', 'draft a reply to the recruiter, as me'],
  ['a', 'Draft saved in Gmail, in your voice. Not sent — say the word.', '', '', 'voice'],
  ['q', 'are you sure the invoice is due on the 30th?'],
  ['a', 'Yes. It came in with the client\'s email on 2 Oct.', 'sources', 'ok', 'memory'],
  ['q', 'who founded that startup that emailed me?'],
  ['a', 'I don\'t know. It\'s not in the vault, and a matching name isn\'t proof.', 'no sources → no claim', 'no', 'memory'],
];
const feed = document.querySelector('.feed');
let chatTimer;
function runChat() {
  clearTimeout(chatTimer); feed.innerHTML = ''; let i = 0;
  const tagCol = { brief: P.s[1], tutor: P.s[2], voice: P.s[3], memory: P.s[0] };
  const step = () => {
    if (i >= CHAT.length) { chatTimer = setTimeout(runChat, 3500); return; }
    const m = CHAT[i++];
    if (m[0] === 'a') {
      const ty = document.createElement('div'); ty.className = 'typing'; ty.innerHTML = '<i></i><i></i><i></i>'; feed.append(ty);
      chatTimer = setTimeout(() => { ty.remove(); add(m); chatTimer = setTimeout(step, 1300); }, 900);
    } else { add(m); chatTimer = setTimeout(step, 700); }
  };
  const add = m => {
    const d = document.createElement('div'); d.className = 'm ' + m[0];
    d.innerHTML = m[0] === 'q' ? m[1] : `<span class="tag" style="color:${tagCol[m[4]]}">${m[4]}</span><br>${m[1]}${m[2] ? `<span class="src ${m[3]}">${m[3] === 'ok' ? '↳ ' : '✕ '}${m[2]}</span>` : ''}`;
    feed.append(d); requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('in')));
    while (feed.children.length > 7) feed.firstChild.remove();
  };
  step();
}

const COPY = {
  koa: { st: ['Engine', P.blue], h: 'Koa reads bank statements, and refuses when they don\'t add up.', p: 'A deterministic engine that turns statement PDFs into rows. Every result must tie out: opening balance plus every movement equals the closing balance. If it doesn\'t, Koa says so instead of guessing.', li: [['No model', 'in the extraction path'], ['Tie-out', 'or it\'s marked partial'], ['Statements', 'never leave the machine']] },
  kelaro: { st: ['Closed beta', P.pink], h: 'Kelaro syncs every client\'s bank into the sheet they already use.', p: 'Each client\'s accounts sync on a schedule, each from exactly where it stopped. New movements are appended to the practice\'s own Excel or Sheets file and tied to the bank balance. An expired bank consent is skipped and flagged, never guessed around.', li: [['Scheduled', 'per account, from the last cursor'], ['Their file', 'appended, not migrated'], ['Tied out', 'or flagged for a human']] },
  cashew: { st: ['In development', P.amber], h: 'Cashew lets me try a plan before I live it.', p: 'A personal finance manager, one user, self-hosted. A scenario is a plan drawn over my real accounts. It never edits them. Each lever says what it frees up, and every change shows against reality. The assistant can set the levers and argue with the plan, but only I can save it.', li: [['Current state', 'is just the scenario with no levers'], ['Levers', 'each states its own consequence'], ['Save', 'stays a human\'s button']] },
  flow: { st: ['How they fit', P.teal], h: 'One rule across three pieces: the numbers are computed, never generated.', p: 'Bank data comes in two ways. Koa reads statements and ties them out. Kelaro hands verified rows to accountants. Cashew runs the same machinery for one person, and it\'s where the ledger and the AI boundary were proven first.', li: [['Koa', 'the trust engine'], ['Kelaro', 'the accountant\'s surface'], ['Cashew', 'the proving ground']] },
  puzzle: { st: ['How they fit', P.teal], h: 'Three pieces of the same puzzle.', p: 'Each one stands on its own. Together they make one claim: verified numbers, where people already work, with AI kept to explaining and proposing.', li: [['Koa', 'extract and tie out'], ['Kelaro', 'into the accountant\'s sheet'], ['Cashew', 'personal ledger and scenarios']] },
};
/* ---------- Koa: scan a statement, rebuild the rows, tie out — then a cycle where it refuses ---------- */
const TX = [['02 Sep', 'Rent — September', -850.00], ['04 Sep', 'Client payment #2214', 1320.00], ['07 Sep', 'Card — groceries', -64.35], ['11 Sep', 'Insurance quarterly', -48.20], ['15 Sep', 'Transfer to savings', -300.00], ['21 Sep', 'Client payment #2219', 480.00], ['28 Sep', 'Electricity', -71.90]];
const OPEN = 1240.00, CLOSE = OPEN + TX.reduce((s, t) => s + t[2], 0);
function koa(c, w, h, e) {
  const cyc = Math.floor(e / 10) % 2, t = e % 10, bad = cyc === 1, N = w < 560, fs = N ? 10 : 11;
  // statement page (left on desktop, top on phones)
  const px = 0, py = 20, pw = N ? w : w * 0.42, ph = N ? 70 + 7 * 26 + 40 : h - 90;
  c.fillStyle = rgba(P.panel, 0.9); rr(c, px, py, pw, ph, 6); c.fill(); c.strokeStyle = P.line; c.stroke();
  sans(c, 13); c.fillStyle = P.bright; c.textAlign = 'left'; c.fillText('Statement · September', px + 18, py + 30);
  mono(c, fs); c.fillStyle = P.dim; c.fillText('opening balance', px + 18, py + (N ? 50 : 58)); c.textAlign = 'right'; c.fillText(fmt(OPEN), px + pw - 18, py + (N ? 50 : 58));
  const rowY = i => N ? py + 74 + i * 26 : py + 88 + i * 34;
  const scanY = py + 40 + clamp(t / 4.2) * (ph - 60);
  TX.forEach((r, i) => {
    const y = rowY(i), passed = scanY > y;
    c.textAlign = 'left'; mono(c, fs); c.fillStyle = passed ? P.text : rgba(P.dim, 0.6);
    c.fillText(r[0], px + 18, y); c.fillText(r[1].slice(0, N ? 15 : 17), px + (N ? 64 : 72), y);
    c.textAlign = 'right'; c.fillText(fmt(r[2]), px + pw - 18, y);
  });
  c.textAlign = 'left'; c.fillStyle = P.dim; c.fillText('closing balance', px + 18, rowY(TX.length) + 10); c.textAlign = 'right'; c.fillText(fmt(CLOSE), px + pw - 18, rowY(TX.length) + 10);
  if (t < 4.4) { c.fillStyle = P.blue; c.fillRect(px - 6, scanY, pw + 12, 1.5); c.fillStyle = rgba(P.blue, 0.07); c.fillRect(px, py, pw, scanY - py); }
  // extracted rows (right), each rises into place as the scan passes it
  const tx0 = N ? 0 : pw + 36, tw = w - tx0, ty = N ? py + ph + 24 : py, cols = N ? [0, 46, tw - 74, tw] : [0, 70, tw - 100, tw];
  const tRow = i => N ? ty + 58 + i * 26 : rowY(i);
  sans(c, 12); c.fillStyle = P.dim; c.textAlign = 'left';
  ['date', 'description', 'amount', 'balance'].forEach((hd, k) => { c.textAlign = k > 1 ? 'right' : 'left'; c.fillText(hd, tx0 + cols[k], ty + 30); });
  c.strokeStyle = P.line; c.beginPath(); c.moveTo(tx0, ty + 42); c.lineTo(tx0 + tw, ty + 42); c.stroke();
  let bal = OPEN, sum = 0;
  TX.forEach((r, i) => {
    const y = rowY(i), k = ease(clamp((scanY - y) / 60));
    let amt = r[2]; const wrong = bad && i === 3; if (wrong) amt = -4.82;
    bal += amt; sum += amt;
    if (k <= 0) return;
    c.globalAlpha = k; const yy = tRow(i) + (1 - k) * 12;
    if (wrong) { c.fillStyle = rgba(P.amber, 0.14); c.fillRect(tx0 - 8, yy - 16, tw + 16, 24); }
    mono(c, fs); c.fillStyle = P.text; c.textAlign = 'left'; c.fillText(r[0], tx0, yy); c.fillText(r[1].slice(0, N ? 12 : 18), tx0 + cols[1], yy);
    c.textAlign = 'right'; c.fillStyle = wrong ? P.amber : P.text; c.fillText(fmt(amt), tx0 + cols[2], yy);
    c.fillStyle = P.dim; c.fillText(fmt(bal), tx0 + tw, yy); c.globalAlpha = 1;
  });
  // tie-out
  const k2 = ease(clamp((t - 4.8) / 0.8));
  if (k2 > 0) {
    const y = h - 50; c.globalAlpha = k2;
    mono(c, N ? 10 : 12); c.textAlign = 'left'; c.fillStyle = P.dim;
    const ok = !bad, eq = N ? `${fmt(OPEN)} + (${fmt(sum)}) ${ok ? '=' : '≠'} ${fmt(CLOSE)} closing` : `${fmt(OPEN)} + (${fmt(sum)}) = ${fmt(OPEN + sum)}   ${ok ? '=' : '≠'} closing ${fmt(CLOSE)}`;
    c.fillText(eq, tx0, y - 28);
    const lbl = ok ? 'SUCCESS · tied out' : N ? 'PARTIAL · row 4 flagged' : 'PARTIAL · not verified, row 4 flagged';
    sans(c, 13); const bw = c.measureText(lbl).width + 28;
    c.fillStyle = rgba(ok ? P.teal : P.amber, 0.15); rr(c, tx0, y - 12, bw, 30, 15); c.fill();
    c.strokeStyle = ok ? P.teal : P.amber; c.stroke(); c.fillStyle = ok ? P.teal : P.amber; c.fillText(lbl, tx0 + 14, y + 8);
    c.globalAlpha = 1;
  }
  setCap(t < 4.4 ? '<b>reading</b> statement, row by row' : bad ? '<b>refused to guess</b>: the balances don\'t tie out, so the result is partial' : '<b>tie-out</b>: opening + movements = closing');
}

/* ---------- Kelaro: a scheduled sync across client workspaces, appending into each client's own sheet ---------- */
const CLIENTS = [
  { n: 'Silva & Filhos, Lda', acc: [['Conta à ordem', 'linked', 12], ['Conta poupança', 'linked', 2]] },
  { n: 'Café Aurora', acc: [['Conta à ordem', 'linked', 31], ['Cartão empresa', 'expired', 0]] },
  { n: 'Atelier Marques', acc: [['Conta à ordem', 'linked', 7]] },
];
const NEWROWS = [['06/10', 'TPA — vendas dia', '', '412,30'], ['06/10', 'Fornecedor café', '186,00', ''], ['07/10', 'EDP', '94,12', ''], ['07/10', 'TPA — vendas dia', '', '388,90'], ['07/10', 'Renda loja', '900,00', '']];
function kelaro(c, w, h, e) {
  const t = e % 13, N = w < 560;
  // schedule clock
  const lw = N ? w : w * 0.44, ch = N ? 38 : 44, gap = N ? 44 : 52;
  sans(c, 12); c.fillStyle = P.dim; c.textAlign = 'left'; c.fillText('Scheduled sync', 0, 18);
  mono(c, 12); c.fillStyle = t > 0.8 ? P.bright : P.dim; c.fillText('every day · 06:00', 0, 38);
  const pulse = t > 0.8 && t < 1.6; if (pulse) { c.fillStyle = rgba(P.pink, 0.2 * (1.6 - t) / 0.8 * 2); c.beginPath(); c.arc(lw - 12, 30, 14 + (t - 0.8) * 20, 0, 7); c.fill(); }
  c.fillStyle = t > 0.8 ? P.pink : P.line; c.beginPath(); c.arc(lw - 12, 30, 6, 0, 7); c.fill();
  // workspaces with their bank accounts
  let y = 70, idx = 0, total = 0;
  CLIENTS.forEach((cl, ci) => {
    sans(c, 14); c.fillStyle = P.bright; c.textAlign = 'left'; c.fillText(cl.n, 0, y + 14);
    y += 26;
    cl.acc.forEach(([an, st, n]) => {
      const start = 1.2 + idx * 0.7, k = clamp((t - start) / 1.1), done = k >= 1, ex = st === 'expired';
      c.strokeStyle = P.line; rr(c, 0, y, lw, ch, 8); c.stroke();
      if (ci === 1 && t > 4.5) { c.fillStyle = rgba(P.pink, 0.05); c.fill(); }
      const dot = ex ? P.amber : done ? P.teal : k > 0 ? P.blue : P.dim;
      c.fillStyle = dot; c.beginPath(); c.arc(16, y + ch / 2, 4, 0, 7); c.fill();
      sans(c, 13, 400); c.fillStyle = P.text; c.fillText(an, 30, y + (N ? 16 : 19));
      mono(c, 10); c.fillStyle = P.dim;
      let status = ex ? 'consent expired · skipped, flagged' : k <= 0 ? 'since 05/10 06:00' : !done ? 'fetching…' : `+${n} new · ties out ✓`;
      if (ex && k <= 0) status = 'since 05/10 06:00';
      c.fillStyle = ex && k > 0 ? P.amber : done ? P.teal : P.dim; c.fillText(status, 30, y + (N ? 30 : 35));
      if (k > 0 && !done && !ex) { c.fillStyle = rgba(P.blue, 0.8); c.fillRect(lw - 70, y + 20, 56 * k, 3); c.fillStyle = P.line; c.fillRect(lw - 70 + 56 * k, y + 20, 56 * (1 - k), 3); }
      if (done && !ex) total += n;
      y += gap; idx++;
    });
    y += 10;
  });
  // destination: this client's own spreadsheet, rows appended at the bottom
  const sx = N ? 0 : lw + 36, sw = w - sx, top = N ? y + 10 : 0, sy = top + 70;
  sans(c, 12); c.fillStyle = P.dim; c.textAlign = 'left'; c.fillText('Café Aurora · their own spreadsheet', sx, top + 18);
  mono(c, 10); c.fillStyle = P.dim; c.fillText('mode: append to client file', sx, top + 38);
  const cw = [0.17, 0.43, 0.2, 0.2], cx = [sx]; cw.forEach(f => cx.push(cx[cx.length - 1] + sw * f));
  const rh = N ? 26 : 30, old = 6;
  c.fillStyle = rgba(P.panel, 0.85); c.fillRect(sx, sy, sw, rh * 13); c.strokeStyle = P.line;
  for (let r = 0; r <= 13; r++) { c.beginPath(); c.moveTo(sx, sy + r * rh); c.lineTo(sx + sw, sy + r * rh); c.stroke(); }
  cx.forEach(x => { c.beginPath(); c.moveTo(x, sy); c.lineTo(x, sy + rh * 13); c.stroke(); });
  sans(c, 12); c.fillStyle = P.bright; ['Data', 'Descritivo', 'Débito', 'Crédito'].forEach((hd, k) => { c.textAlign = 'left'; c.fillText(hd, cx[k] + 8, sy + 20); });
  const OLD = [['01/10', 'TPA — vendas dia', '', '356,10'], ['02/10', 'Fornecedor pão', '74,20', ''], ['02/10', 'TPA — vendas dia', '', '402,75'], ['03/10', 'Seguro', '48,20', ''], ['04/10', 'TPA — vendas dia', '', '371,40'], ['05/10', 'Água', '38,60', '']];
  const drawRow = (r, i, a, hi) => { const yy = sy + (i + 1) * rh + (N ? 17 : 20); c.globalAlpha = a; if (hi) { c.fillStyle = rgba(P.pink, 0.12 * hi); c.fillRect(cx[0] + 1, sy + (i + 1) * rh + 1, sw - 2, rh - 2); } mono(c, N ? 10 : 11); c.fillStyle = P.text; c.textAlign = 'left'; c.fillText(r[0], cx[0] + 6, yy); c.fillText(N ? r[1].slice(0, 13) : r[1], cx[1] + 6, yy); c.textAlign = 'right'; c.fillText(r[2], cx[3] - 8, yy); c.fillText(r[3], cx[4] - 8, yy); c.globalAlpha = 1; };
  OLD.forEach((r, i) => drawRow(r, i, 0.55, 0));
  const app0 = 3.4;
  NEWROWS.forEach((r, i) => { const k = ease(clamp((t - app0 - i * 0.35) / 0.45)); if (k > 0) drawRow(r, old + i, k, 1 - clamp((t - app0 - 2.5 - i * 0.35) / 1.5)); });
  // footer: tie-out + cursor
  const k3 = ease(clamp((t - 6.2) / 0.6));
  if (k3 > 0) {
    const fy = sy + rh * 12; c.globalAlpha = k3; c.fillStyle = rgba(P.teal, 0.1); c.fillRect(sx + 1, fy + 1, sw - 2, rh - 2);
    sans(c, 12); c.fillStyle = P.teal; c.textAlign = 'left'; c.fillText(N ? '+5 rows · ties to the bank ✓' : '+5 rows appended · balance ties to the bank ✓', sx + 8, fy + (N ? 17 : 20)); c.globalAlpha = 1;
    mono(c, 10); c.fillStyle = P.dim; c.fillText(N ? 'next sync from 07/10 06:00' : 'next sync from 07/10 06:00 · nothing fetched twice', sx, sy + rh * 13 + 22);
  }
  setCap(t < 0.8 ? '<b>06:00</b> scheduled sync' : t < 3.4 ? '<b>syncing</b> each account from where it stopped' : t < 6.2 ? '<b>appending</b> new movements to the client\'s own sheet' : t < 9 ? '<b>tied out</b>. One expired consent skipped and flagged, nothing guessed.' : `<b>${total || 52} new movements</b> across three clients, before the accountant opens the laptop`);
}

/* ---------- Cashew: scenarios. A plan drawn over real accounts, compared to reality, saved by a human ---------- */
const LEVERS = [['Food delivery', P.pink, 40, 25], ['Rides', P.lav, 25, 15], ['Shopping', P.blue, 20, 12]]; // name, colour, baseline %, scenario %
const MONTHS = ['Apr', 'May', 'Jun', 'Jul'];
const BASE = [70, 75, 60, 75]; // saved per month on the current path
const REL = [0, 80, 80, 80];   // released by the levers
function cashew(c, w, h, e) {
  const t = e % 17;
  const onPlan = t > 1 && t < 11.2 || t > 13.6;          // which scenario is selected
  const goalK = ease(clamp((t - 1.6) / 1));                  // agent raises the true cost
  const resolve = clamp((t - 4.2) / 2.6);                    // levers move one by one
  const lev = i => onPlan ? ease(clamp(resolve * 3 - i)) : 0;
  const diverged = onPlan && resolve > 0.05;
  const saved = t > 9.4 && t < 11.2 || t > 13.6;
  // scenario selector
  const N = w < 560, tabs = N ? ['Current state', 'Festival in July'] : ['Current state', 'Festival in July', 'New laptop'];
  let tx = 0; sans(c, 13);
  tabs.forEach((s, i) => { const bw = c.measureText(s).width + 26, on = (i === 0 && !onPlan) || (i === 1 && onPlan); c.fillStyle = on ? rgba(P.amber, 0.16) : 'transparent'; rr(c, tx, 0, bw, 30, 15); c.fill(); c.strokeStyle = on ? P.amber : P.line; c.stroke(); c.fillStyle = on ? P.bright : P.dim; c.textAlign = 'left'; c.fillText(s, tx + 13, 20); tx += bw + 8; });
  mono(c, 10); c.fillStyle = P.dim; c.textAlign = N ? 'left' : 'right'; c.fillText('REAL DATA · 2 ASSUMED', N ? 0 : w, N ? 52 : 20); c.textAlign = 'left';
  // levers (left)
  const lw = N ? w : w * 0.42; let y = N ? 82 : 62;
  sans(c, 12); c.fillStyle = P.dim; c.textAlign = 'left'; c.fillText('Levers', 0, y); y += 16;
  LEVERS.forEach(([n, col, b, s], i) => {
    const k = lev(i), v = b + (s - b) * k, engaged = k > 0.02;
    c.strokeStyle = engaged ? rgba(P.amber, 0.9) : P.line; rr(c, 0, y, lw, 74, 8); c.stroke();
    sans(c, 13); c.fillStyle = P.text; c.fillText(n, 14, y + 22);
    if (engaged) { mono(c, 9); const bw = c.measureText('AGENT SET').width + 12; c.fillStyle = rgba(P.amber, 0.15); rr(c, lw - bw - 12, y + 10, bw, 16, 8); c.fill(); c.fillStyle = P.amber; c.fillText('AGENT SET', lw - bw - 6, y + 22); }
    const sx = 14, sw = lw - 90; c.fillStyle = P.line; c.fillRect(sx, y + 40, sw, 3); c.fillStyle = col; c.fillRect(sx, y + 40, sw * v / 50, 3);
    if (engaged) { c.strokeStyle = rgba(col, 0.5); c.setLineDash([2, 3]); c.beginPath(); c.arc(sx + sw * b / 50, y + 41.5, 7, 0, 7); c.stroke(); c.setLineDash([]); }
    c.fillStyle = P.bg; c.beginPath(); c.arc(sx + sw * v / 50, y + 41.5, 7, 0, 7); c.fill(); c.strokeStyle = col; c.lineWidth = 2; c.stroke(); c.lineWidth = 1;
    mono(c, 11); c.fillStyle = P.dim; c.textAlign = 'right'; c.fillText(Math.round(v) + '%', lw - 14, y + 45); c.textAlign = 'left';
    mono(c, 10); c.fillStyle = engaged ? P.teal : P.dim; c.fillText(engaged ? `+€${Math.round([35, 25, 20][i] * k)} / month released` : 'not engaged', sx, y + 63);
    y += 84;
  });
  // the agent's read, which argues back
  const readY = y + 6;
  c.strokeStyle = P.line; rr(c, 0, readY, lw, 116, 8); c.stroke();
  mono(c, 10); c.fillStyle = P.lav; c.fillText('AGENT READ', 14, readY + 20);
  const read = !onPlan ? ['Current state. No lever engaged.', 'This is reality: nothing here', 'has been changed by any plan.']
    : t < 2.6 ? ['€200 is only the ticket. With', 'travel and on-site spend, the', 'real total is about €480.']
    : resolve <= 0 ? ['On the current path you reach', '€280 by July. Short by €200.', 'Start with delivery: least pain.']
    : resolve < 1 ? ['Moving levers…', '', '']
    : ['Covered by July, €40 to spare.', 'It leans on June, which is thin.', 'This buys margin, not slack.'];
  sans(c, 13, 400); c.fillStyle = P.text; read.forEach((l, i) => c.fillText(l, 14, readY + 44 + i * 20));
  // chart (right): saved per month, real solid vs released dashed, goal lines
  const gx = N ? 0 : lw + 32, gw = N ? w : w - gx, gy = N ? readY + 150 : 62, gh = N ? 230 : 300;
  sans(c, 12); c.fillStyle = P.dim; c.fillText('Saved toward the festival', gx, gy);
  const base = gy + gh, scale = (gh - 40) / 560, bgw = gw - 120, bw = bgw / 4 - 18;
  let cumB = 0, cumR = 0;
  MONTHS.forEach((m, i) => {
    cumB += BASE[i]; const r = REL[i] * (onPlan ? clamp(resolve * 1.6 - i * 0.15) : 0); cumR += r;
    const x = gx + 6 + i * (bgw / 4), hb = cumB * scale, hr = cumR * scale;
    c.fillStyle = rgba(P.blue, 0.75); c.fillRect(x, base - hb, bw, hb);
    if (hr > 0.5) { c.strokeStyle = P.amber; c.setLineDash([4, 3]); c.strokeRect(x + 0.5, base - hb - hr, bw - 1, hr); c.setLineDash([]); c.fillStyle = rgba(P.amber, 0.12); c.fillRect(x, base - hb - hr, bw, hr); }
    mono(c, 11); c.fillStyle = P.dim; c.textAlign = 'center'; c.fillText(m, x + bw / 2, base + 18);
    c.fillStyle = P.text; c.fillText(Math.round(cumB + cumR), x + bw / 2, base - hb - hr - 22);
    if (hr > 0.5) { c.fillStyle = P.amber; c.fillText('+' + Math.round(cumR), x + bw / 2, base - hb - hr - 8); }
    c.textAlign = 'left';
  });
  const line = (v, col, l1, l2, dash, a) => { const yy = base - v * scale; c.globalAlpha = a; c.strokeStyle = col; c.setLineDash(dash); c.beginPath(); c.moveTo(gx, yy); c.lineTo(gx + bgw + 10, yy); c.stroke(); c.setLineDash([]); mono(c, 10); c.fillStyle = col; c.textAlign = 'left'; c.fillText(l1, gx + bgw + 18, yy + 3); c.fillStyle = P.dim; c.fillText(l2, gx + bgw + 18, yy + 17); c.globalAlpha = 1; };
  line(200, P.dim, '€200', 'ticket only', [2, 4], onPlan ? 0.7 : 1);
  if (onPlan) line(200 + 280 * goalK, P.amber, '€480', 'real total', [6, 4], goalK);
  // actions
  const ay = h - 44;
  sans(c, 13); let ax = 0;
  (N ? [['Agent Resolve', t > 3.8 && t < 4.6 && onPlan]] : [['Ask Agent', false], ['Agent Resolve', t > 3.8 && t < 4.6 && onPlan], ['Reset', false]]).forEach(([s, hot]) => { const bw2 = c.measureText(s).width + 26; c.fillStyle = hot ? rgba(P.lav, 0.25) : 'transparent'; rr(c, ax, ay, bw2, 32, 16); c.fill(); c.strokeStyle = hot ? P.lav : P.line; c.stroke(); c.fillStyle = P.text; c.fillText(s, ax + 13, ay + 21); ax += bw2 + 8; });
  const sv = 'Save Scenario', bw3 = c.measureText(sv).width + 26, sxp = w - bw3, press = t > 8.8 && t < 9.4;
  c.globalAlpha = diverged ? 1 : 0.35; c.fillStyle = press || saved ? P.amber : rgba(P.amber, 0.12); rr(c, sxp, ay, bw3, 32, 16); c.fill(); c.strokeStyle = P.amber; c.stroke();
  c.fillStyle = press || saved ? P.bg : P.amber; c.fillText(saved && onPlan ? 'Saved ✓' : sv, sxp + 13, ay + 21); c.globalAlpha = 1;
  if (t > 7.8 && t < 9.4) { const f = 1 - ease(clamp((t - 7.8) / 0.9)), mx = sxp + bw3 / 2 + f * 60, my = ay + 18 + f * 40; c.fillStyle = P.bright; c.beginPath(); c.moveTo(mx, my); c.lineTo(mx + 11, my + 4); c.lineTo(mx + 5, my + 6); c.lineTo(mx + 3, my + 12); c.closePath(); c.fill(); }
  setCap(t < 1 ? '<b>Current state</b>: reality is the baseline' : t < 2.6 ? '<b>new scenario</b>: the agent corrects the goal before planning' : t < 4.2 ? '<b>agent read</b>: on the current path, it doesn\'t fit' : t < 7 ? '<b>Agent Resolve</b>: levers move, each saying what it releases' : t < 8.8 ? '<b>the plan, drawn over reality</b>. Dashed = released by levers.' : t < 11.2 ? '<b>I press save</b>. The agent never does.' : t < 13.6 ? '<b>back to Current state</b>: nothing was mutated' : '<b>Festival in July</b>, saved beside reality');
}

/* ---------- Together · flow: top to bottom, with the AI boundary drawn in ---------- */
function flow(c, w, h, e) {
  const box = (x, y, bw, bh, title, sub, col, lit) => {
    c.fillStyle = rgba(col, lit ? 0.16 : 0.08); rr(c, x, y, bw, bh, 10); c.fill(); c.strokeStyle = rgba(col, lit ? 1 : 0.55); c.lineWidth = lit ? 1.5 : 1; c.stroke(); c.lineWidth = 1;
    sans(c, 16); c.fillStyle = P.bright; c.textAlign = 'center'; c.fillText(title, x + bw / 2, y + bh / 2 - 2);
    mono(c, 11); c.fillStyle = P.dim; c.fillText(sub, x + bw / 2, y + bh / 2 + 18);
  };
  const N = {
    pdf: [w * 0.05, 20, w * 0.3, 60], ob: [w * 0.65, 20, w * 0.3, 60],
    koa: [w * 0.02, 170, w * 0.36, 80], kel: [w * 0.02, 360, w * 0.36, 80], cas: [w * 0.62, 360, w * 0.36, 80],
  };
  const mid = n => [n[0] + n[2] / 2, n[1] + n[3] / 2], top = n => [n[0] + n[2] / 2, n[1]], bot = n => [n[0] + n[2] / 2, n[1] + n[3]];
  const edges = [[bot(N.pdf), top(N.koa), P.lav], [bot(N.koa), top(N.kel), P.blue], [bot(N.ob), [N.kel[0] + N.kel[2] * 0.8, N.kel[1]], P.blue], [bot(N.ob), top(N.cas), P.amber]];
  edges.forEach(([a, b, col], i) => {
    c.strokeStyle = rgba(col, 0.35); c.beginPath(); c.moveTo(a[0], a[1]); c.bezierCurveTo(a[0], (a[1] + b[1]) / 2, b[0], (a[1] + b[1]) / 2, b[0], b[1]); c.stroke();
    for (let k = 0; k < 4; k++) { const f = ((e * 0.35 + k / 4 + i * 0.13) % 1), u = 1 - f; const my = (a[1] + b[1]) / 2; const x = u * u * u * a[0] + 3 * u * u * f * a[0] + 3 * u * f * f * b[0] + f * f * f * b[0], y = u * u * u * a[1] + 3 * u * u * f * my + 3 * u * f * f * my + f * f * f * b[1]; c.fillStyle = col; c.beginPath(); c.arc(x, y, 2.4, 0, 7); c.fill(); }
  });
  // donor link: Cashew proved what Kelaro inherits
  const a = [N.cas[0], N.cas[1] + N.cas[3] / 2], b = [N.kel[0] + N.kel[2], N.kel[1] + N.kel[3] / 2];
  c.setLineDash([3, 5]); c.strokeStyle = rgba(P.amber, 0.6); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.setLineDash([]);
  mono(c, 10); c.fillStyle = P.amber; c.textAlign = 'center'; c.fillText('proven here first:', (a[0] + b[0]) / 2, a[1] - 22); c.fillText('ledger · AI boundary', (a[0] + b[0]) / 2, a[1] - 8);
  const hl = Math.floor(e / 2.5) % 3;
  box(...N.pdf, 'Bank statements', 'PDF', P.lav, false); box(...N.ob, 'Open Banking', 'PSD2 feeds', P.blue, false);
  box(...N.koa, 'Koa', 'extract · tie out · or refuse', P.lav, hl === 0);
  box(...N.kel, 'Kelaro', 'into the accountant\'s sheet', P.pink, hl === 1);
  box(...N.cas, 'Cashew', 'one person\'s ledger · scenarios', P.amber, hl === 2);
  // AI boundary
  const by = 490; c.setLineDash([8, 6]); c.strokeStyle = rgba(P.teal, 0.8); c.beginPath(); c.moveTo(0, by); c.lineTo(w, by); c.stroke(); c.setLineDash([]);
  mono(c, 11); c.textAlign = 'left'; c.fillStyle = P.teal; c.fillText('AI BOUNDARY', 0, by - 10);
  c.textAlign = 'right'; c.fillStyle = P.dim; c.fillText('above: every number is computed', w, by - 10);
  sans(c, 13, 400); c.textAlign = 'center'; c.fillStyle = P.text;
  c.fillText('AI explains a line', N.kel[0] + N.kel[2] / 2, by + 34); c.fillText('AI proposes a change', N.cas[0] + N.cas[2] / 2, by + 34);
  mono(c, 10); c.fillStyle = P.dim; c.fillText('read-only', N.kel[0] + N.kel[2] / 2, by + 52); c.fillText('you press save', N.cas[0] + N.cas[2] / 2, by + 52);
  setCap(['<b>Koa</b> reads statements and ties them out, or refuses', '<b>Kelaro</b> delivers verified rows into the accountant\'s own template', '<b>Cashew</b> runs the same rules for one person, and proved them first'][hl]);
}


function setCopyAll() { document.querySelectorAll('[data-copy]').forEach(el => { const k = COPY[el.dataset.copy]; el.innerHTML = `<span class="kicker" style="color:${k.st[1]}">${k.st[0]}</span><h2>${k.h}</h2><p>${k.p}</p><ul>${k.li.map(l => `<li><b>${l[0]}</b> · ${l[1]}</li>`).join('')}</ul>`; }); }
setCopyAll();
const FN = { graph: graphScene, stack: stackScene, flow, koa, kelaro, cashew };
const scenes = [...document.querySelectorAll('[data-scene]')].map(el => ({ el, k: el.dataset.scene, cv: el.querySelector('canvas'), cap: el.querySelector('.cap'), vis: false, t0: null }));
function fitScene(s) { if (!s.cv) return; const r = s.cv.parentElement.getBoundingClientRect(), d = devicePixelRatio || 1, phone = r.width < 560 && s.el.dataset.hm; const H = phone ? +s.el.dataset.hm : +s.el.dataset.h; const LW = phone ? r.width : Math.max(r.width, s.k === 'graph' ? 340 : 640), k = r.width / LW; s.cv.style.height = (H * k) + 'px'; s.cv.width = r.width * d; s.cv.height = H * k * d; const c = s.cv.getContext('2d'); c.setTransform(d * k, 0, 0, d * k, 0, 0); s.g = { c, w: LW, h: H }; }
scenes.forEach(fitScene); addEventListener('resize', () => scenes.forEach(fitScene));
const io = new IntersectionObserver(es => es.forEach(en => { const s = scenes.find(x => x.el === en.target); s.vis = en.isIntersecting; if (s.vis && s.t0 === null) { s.t0 = performance.now() / 1000; if (s.k === 'chat') runChat(); } }), { threshold: 0.25 });
scenes.forEach(s => io.observe(s.el));
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
requestAnimationFrame(function frame(now) {
  for (const s of scenes) { if (!s.vis || !s.cv) continue; const e = REDUCE ? 8 : now / 1000 - s.t0; CAP = s.cap; s.g.c.clearRect(0, 0, s.g.w, s.g.h); FN[s.k](s.g.c, s.g.w, s.g.h, Math.max(0, e)); }
  requestAnimationFrame(frame);
});
const rio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); } }), { threshold: 0.15 });
document.querySelectorAll('[data-reveal]').forEach((el, i) => { el.style.transitionDelay = (el.classList.contains('row') ? (i % 5) * 70 : 0) + 'ms'; rio.observe(el); });
addEventListener('scroll', () => document.getElementById('nav').classList.toggle('scrolled', scrollY > 20), { passive: true });

