/* ==========================================================================
   SRV core: layout, icons, utilities, storage, sea-routing engine, maps
   ========================================================================== */
(function () {
  'use strict';
  const D = window.SRV_DATA;
  const SRV = (window.SRV = {});

  /* Clean URLs: show /about instead of /about.html (and / instead of /index.html) on the live site */
  if (/^https?:$/.test(location.protocol) && /\.html$/.test(location.pathname) && !/\/404\.html$/.test(location.pathname)) {
    const clean = location.pathname.replace(/index\.html$/, '').replace(/\.html$/, '');
    history.replaceState(null, '', clean + location.search + location.hash);
  }

  /* ---------------- DOM helpers ---------------- */
  SRV.$ = (s, r = document) => r.querySelector(s);
  SRV.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  SRV.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  SRV.qs = (k) => new URLSearchParams(location.search).get(k);

  /* ---------------- Icons ---------------- */
  const IC = {
    ship: '<path d="M2 20c2 1.2 4 1.2 6 0s4-1.2 6 0 4 1.2 6 0"/><path d="M4 17l-1-5h18l-2 5"/><path d="M6 12V7h8v5"/><path d="M14 9h4v3"/><path d="M9 7V4h3v3"/>',
    anchor: '<circle cx="12" cy="5" r="2.5"/><path d="M12 7.5V21"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><path d="M8 11h8"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    box: '<rect x="2" y="6" width="20" height="13" rx="1"/><path d="M6 6v13M10 6v13M14 6v13M18 6v13"/>',
    truck: '<path d="M1 4h14v12H1z"/><path d="M15 9h4l4 4v3h-8z"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/>',
    plane: '<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
    warehouse: '<path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35a2 2 0 0 1 1.26-1.86l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35z"/><path d="M6 18h12M6 14h12M6 10h12"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    checkCircle: '<path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="M22 4L12 14l-3-3"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    chevDown: '<path d="M6 9l6 6 6-6"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    arrowUp: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    alert: '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.2-6"/>',
    snow: '<path d="M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1L19.1 4.9"/>',
    crane: '<path d="M4 22V4l14 0"/><path d="M4 8h14"/><path d="M15 4v8"/><rect x="12" y="12" width="6" height="4"/><path d="M2 22h8"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    dollar: '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    trash: '<path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    printer: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
    xsocial: '<path d="M4 4l16 16M20 4L4 20"/>',
    youtube: '<path d="M22.5 6.4a2.8 2.8 0 0 0-2-2C18.9 4 12 4 12 4s-6.9 0-8.5.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 5.6 2.8 2.8 0 0 0 2 2c1.6.4 8.5.4 8.5.4s6.9 0 8.5-.4a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-5.6z"/><path d="M9.8 15.5l5.7-3.5-5.7-3.5z"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    layers: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
    gauge: '<path d="M12 14l4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
    send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>'
  };
  SRV.icon = (n, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ''}</svg>`;

  SRV.logo = () => `<svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true">
      <defs><linearGradient id="lg-srv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0E4C92"/><stop offset="1" stop-color="#0FA3B1"/></linearGradient></defs>
      <rect width="48" height="48" rx="12" fill="url(#lg-srv)"/>
      <path d="M10 30h28l-3.5 7h-21z" fill="#fff"/>
      <rect x="13" y="22" width="6" height="7" rx="1" fill="#F28C28"/><rect x="20" y="22" width="6" height="7" rx="1" fill="#fff" opacity=".9"/><rect x="27" y="22" width="6" height="7" rx="1" fill="#F28C28"/>
      <rect x="20" y="14" width="6" height="7" rx="1" fill="#F28C28"/><rect x="27" y="14" width="6" height="7" rx="1" fill="#fff" opacity=".9"/>
      <path d="M8 40c3 1.6 6 1.6 9 0s6-1.6 9 0 6 1.6 9 0 4-1.2 5-.6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
    </svg>`;

  /* ---------------- Formatting ---------------- */
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  SRV.DOW = DOW;
  SRV.today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  SRV.addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  SRV.fmtDate = (d) => { d = new Date(d); return `${String(d.getDate()).padStart(2, '0')} ${MON[d.getMonth()]} ${d.getFullYear()}`; };
  SRV.fmtDay = (d) => { d = new Date(d); return `${DOW[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')} ${MON[d.getMonth()]}`; };
  SRV.fmtDateTime = (d) => { d = new Date(d); return `${SRV.fmtDate(d)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  SRV.isoDate = (d) => { d = new Date(d); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  SRV.parseISO = (s) => { const [y, m, dd] = String(s).split('-').map(Number); const d = new Date(y, (m || 1) - 1, dd || 1); d.setHours(0, 0, 0, 0); return d; };
  SRV.money = (n, cur = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n);
  SRV.num = (n) => new Intl.NumberFormat('en-US').format(n);

  /* ---------------- Deterministic random ---------------- */
  SRV.hash = (str) => { let h = 2166136261 >>> 0; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  SRV.rng = (seed) => { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  SRV.pick = (r, arr) => arr[Math.floor(r() * arr.length)];

  /* ---------------- Storage (guarded) ---------------- */
  SRV.store = {
    get(k, def) { try { const v = localStorage.getItem('srv_' + k); return v == null ? def : JSON.parse(v); } catch (e) { return def; } },
    set(k, v) { try { localStorage.setItem('srv_' + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    push(k, item) { const a = SRV.store.get(k, []); a.unshift(item); SRV.store.set(k, a); return a; }
  };
  SRV.refNo = (prefix, digits = 8) => prefix + String(Math.floor(Math.random() * Math.pow(10, digits))).padStart(digits, '0');

  /* ---------------- ISO 6346 container check digit ---------------- */
  SRV.checkDigit = (ten) => {
    const map = {}; let v = 10;
    for (let c = 65; c <= 90; c++) { if (v % 11 === 0) v++; map[String.fromCharCode(c)] = v; v++; }
    let sum = 0;
    for (let i = 0; i < 10; i++) { const ch = ten[i]; const val = /[A-Z]/.test(ch) ? map[ch] : Number(ch); sum += val * Math.pow(2, i); }
    return (sum % 11) % 10;
  };
  SRV.makeContainerNo = (owner, serial) => { const ten = owner + String(serial).padStart(6, '0'); return ten + SRV.checkDigit(ten); };

  /* ---------------- Ports & countries index ---------------- */
  const PORTS = {}; const PORT_LIST = [];
  D.COUNTRIES.forEach((c) => c.ports.forEach((p) => { const pp = Object.assign({}, p, { country: c.name, cc: c.code, region: c.region }); PORTS[p.locode] = pp; PORT_LIST.push(pp); }));
  PORT_LIST.sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name));
  SRV.PORTS = PORTS; SRV.PORT_LIST = PORT_LIST;
  SRV.port = (l) => PORTS[l];
  SRV.country = (code) => D.COUNTRIES.find((c) => c.code === code);
  SRV.service = (code) => D.SERVICES.find((s) => s.code === code);
  SRV.portLabel = (l) => { const p = PORTS[l]; return p ? `${p.name}, ${p.country}` : l; };
  SRV.portOptions = (selected) => {
    let html = '<option value="">Select port…</option>'; let cur = '';
    PORT_LIST.forEach((p) => {
      if (p.country !== cur) { if (cur) html += '</optgroup>'; html += `<optgroup label="${SRV.esc(p.country)}">`; cur = p.country; }
      html += `<option value="${p.locode}"${p.locode === selected ? ' selected' : ''}>${SRV.esc(p.name)} (${p.locode})</option>`;
    });
    return html + '</optgroup>';
  };
  SRV.servicesAtPort = (l) => D.SERVICES.filter((s) => s.rotation.includes(l));

  /* ---------------- Sea routing engine ---------------- */
  const SPEED_KN = 17;            // service speed (knots)
  const PORT_STAY = 0.75;         // days per intermediate call
  const TRANSHIP = 3;             // days dwell when changing service
  const ROUTE_FACTOR = 1.08;      // lane deviation factor
  const pt = (k) => (k[0] === '~' ? D.WAYPOINTS[k.slice(1)] : [PORTS[k].lat, PORTS[k].lon]);
  const hav = (a, b) => {
    const R = 3440.065, toR = Math.PI / 180;
    const dLat = (b[0] - a[0]) * toR, dLon = (b[1] - a[1]) * toR;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * toR) * Math.cos(b[0] * toR) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h)) * ROUTE_FACTOR;
  };
  SRV.nm = hav;
  const seaDays = (nm) => nm / (SPEED_KN * 24);

  const SEG = {}; // origin -> [segments]
  const SVC_META = {};
  D.SERVICES.forEach((s) => {
    const rot = s.rotation, cum = [0];
    for (let i = 1; i < rot.length; i++) cum.push(cum[i - 1] + hav(pt(rot[i - 1]), pt(rot[i])));
    const portIdx = rot.map((k, i) => (k[0] === '~' ? -1 : i)).filter((i) => i >= 0);
    // day offset of each port call from the rotation start (forward & reverse)
    const fwdDay = {}, revDay = {};
    let calls = 0;
    portIdx.forEach((i) => { fwdDay[i] = seaDays(cum[i]) + calls * PORT_STAY; calls++; });
    calls = 0; const tot = cum[cum.length - 1];
    [...portIdx].reverse().forEach((i) => { revDay[i] = seaDays(tot - cum[i]) + calls * PORT_STAY; calls++; });
    SVC_META[s.code] = { cum, portIdx, fwdDay, revDay, totalNm: tot, roundDays: Math.ceil((seaDays(tot) + portIdx.length * PORT_STAY) * 2) };
    for (let a = 0; a < portIdx.length; a++) {
      for (let b = 0; b < portIdx.length; b++) {
        if (a === b) continue;
        const i = portIdx[a], j = portIdx[b];
        if (rot[i] === rot[j]) continue;
        const fwd = j > i;
        const lo = Math.min(i, j), hi = Math.max(i, j);
        const nm = cum[hi] - cum[lo];
        const between = rot.slice(lo + 1, hi).filter((k) => k[0] !== '~' && k !== rot[i] && k !== rot[j]);
        let keys = rot.slice(lo, hi + 1); if (!fwd) keys = keys.reverse();
        const seg = { from: rot[i], to: rot[j], service: s.code, nm, fwd, idxFrom: i, calls: [...new Set(between)], keys };
        seg.days = seaDays(nm) + seg.calls.length * PORT_STAY;
        const list = (SEG[seg.from] = SEG[seg.from] || []);
        const dupe = list.find((x) => x.to === seg.to && x.service === seg.service);
        if (!dupe) list.push(seg); else if (seg.nm < dupe.nm) Object.assign(dupe, seg);
      }
    }
  });
  SRV.SVC_META = SVC_META;
  SRV.coordsOf = (keys) => keys.map(pt);

  /** Find best route (min transit days) with up to 4 legs. */
  SRV.route = (o, d) => {
    if (!PORTS[o] || !PORTS[d] || o === d) return null;
    const best = new Map(); // key port|svc|legs -> cost
    const pq = [{ cost: 0, port: o, svc: null, legs: [] }];
    let result = null;
    while (pq.length) {
      pq.sort((a, b) => a.cost - b.cost);
      const cur = pq.shift();
      if (cur.port === d) { result = cur; break; }
      if (cur.legs.length >= 4) continue;
      const key = cur.port + '|' + cur.svc;
      if (best.has(key) && best.get(key) <= cur.cost) continue;
      best.set(key, cur.cost);
      (SEG[cur.port] || []).forEach((seg) => {
        if (seg.service === cur.svc) return; // continuing on the same service is already a direct segment
        const cost = cur.cost + seg.days + (cur.svc ? TRANSHIP : 0);
        pq.push({ cost, port: seg.to, svc: seg.service, legs: cur.legs.concat([seg]) });
      });
    }
    if (!result) return null;
    const legs = result.legs;
    return {
      origin: o, destination: d, legs,
      days: Math.ceil(result.cost),
      nm: Math.round(legs.reduce((s, l) => s + l.nm, 0)),
      tranship: legs.slice(1).map((l) => l.from),
      direct: legs.length === 1
    };
  };

  /** weekday a service calls at a port in the leg's direction */
  const callWeekday = (seg) => {
    const s = SRV.service(seg.service), m = SVC_META[seg.service];
    const off = seg.fwd ? m.fwdDay[seg.idxFrom] : m.revDay[seg.idxFrom] + 3;
    return (s.day + Math.floor(off)) % 7;
  };
  const nextWeekday = (from, wd) => { const d = new Date(from); d.setHours(0, 0, 0, 0); while (d.getDay() !== wd) d.setDate(d.getDate() + 1); return d; };

  const PARTNER_VESSELS = ['Northern Valour', 'Sea Lantern', 'Coral Bay', 'Aurora Tide', 'Silver Monsoon', 'Harbour Crest', 'Eastern Promise', 'Ocean Meridian', 'Blue Lagoon Trader', 'Pacific Lumen', 'Atlas Horizon', 'Cape Lumière'];
  SRV.vesselPool = (svc) => {
    const own = D.FLEET.filter((v) => v.service === svc).map((v) => v.name);
    const s = SRV.service(svc); const pool = own.slice();
    let k = SRV.hash(svc) % PARTNER_VESSELS.length;
    while (pool.length < Math.max(2, Math.min(s.ships, 6))) { pool.push(PARTNER_VESSELS[k % PARTNER_VESSELS.length]); k += 5; }
    return pool;
  };
  const weekIdx = (d) => Math.floor(new Date(d).getTime() / (7 * 864e5));
  const voyageNo = (d, fwdWest) => { const dt = new Date(d); const start = new Date(dt.getFullYear(), 0, 1); const wk = Math.ceil(((dt - start) / 864e5 + start.getDay() + 1) / 7); return `${String(dt.getFullYear()).slice(2)}${String(wk).padStart(2, '0')}${fwdWest ? 'W' : 'E'}`; };

  /** Build a dated sailing for a route starting on/after `from`. */
  SRV.sailing = (route, from) => {
    let ready = new Date(from); const legs = [];
    route.legs.forEach((seg, i) => {
      const dep = nextWeekday(i === 0 ? ready : SRV.addDays(ready, 1), callWeekday(seg));
      const arr = SRV.addDays(dep, Math.max(1, Math.round(seg.days)));
      const pool = SRV.vesselPool(seg.service);
      const vessel = pool[(weekIdx(dep) + SRV.hash(seg.from)) % pool.length];
      const west = PORTS[seg.to].lon < PORTS[seg.from].lon;
      legs.push({ seg, dep, arr, vessel, voyage: voyageNo(dep, west), service: seg.service });
      ready = arr;
    });
    const first = legs[0], last = legs[legs.length - 1];
    return { route, legs, etd: first.dep, eta: last.arr, transit: Math.round((last.arr - first.dep) / 864e5), cutoffDoc: SRV.addDays(first.dep, -2), cutoffCY: SRV.addDays(first.dep, -1) };
  };
  SRV.sailings = (o, d, from, count = 6) => {
    const r = SRV.route(o, d); if (!r) return [];
    const out = []; let start = new Date(from);
    for (let i = 0; i < count; i++) { const s = SRV.sailing(r, start); out.push(s); start = SRV.addDays(s.etd, 1); }
    return out;
  };

  /* ---------------- Maps (Leaflet, optional) ---------------- */
  SRV.unwrap = (coords) => { const out = []; let off = 0; coords.forEach((c, i) => { if (i) { const prev = out[i - 1][1]; let lon = c[1] + off; while (lon - prev > 180) { off -= 360; lon -= 360; } while (prev - lon > 180) { off += 360; lon += 360; } out.push([c[0], lon]); } else out.push([c[0], c[1]]); }); return out; };
  /** Per-leg coordinate arrays, unwrapped continuously across all legs of a route. */
  SRV.routeCoords = (r) => {
    let prev = null;
    return r.legs.map((l) => {
      const c = SRV.coordsOf(l.keys);
      let u = SRV.unwrap(prev ? [prev].concat(c) : c);
      if (prev) u = u.slice(1);
      prev = u[u.length - 1];
      return u;
    });
  };
  SRV.makeMap = (el, opts = {}) => {
    if (!el) return null;
    if (typeof window.L === 'undefined') { el.innerHTML = '<div class="map-fallback">Interactive map unavailable offline. All port and office information is listed on this page.</div>'; return null; }
    const map = L.map(el, { worldCopyJump: true, scrollWheelZoom: !!opts.scroll, zoomControl: true, minZoom: 1.5 }).setView(opts.center || [20, 50], opts.zoom || 2);
    // Esri basemaps: keyless tile access, with attribution
    const svc = opts.dark ? 'Canvas/World_Dark_Gray_Base' : 'Ocean/World_Ocean_Base';
    L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/${svc}/MapServer/tile/{z}/{y}/{x}`, {
      attribution: opts.dark ? 'Tiles &copy; Esri — Esri, DeLorme, NAVTEQ' : 'Tiles &copy; Esri — Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
      maxZoom: opts.dark ? 16 : 13
    }).addTo(map);
    return map;
  };
  SRV.pinIcon = (cls = '') => (window.L ? L.divIcon({ className: '', html: `<div class="pin ${cls}"></div>`, iconSize: [20, 20], iconAnchor: [10, 10] }) : null);

  /* ---------------- UI: toast & modal ---------------- */
  SRV.toast = (msg, type = 'success') => {
    let wrap = SRV.$('.toast-wrap'); if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('role', 'status'); document.body.appendChild(wrap); }
    const t = document.createElement('div'); t.className = 'toast ' + type; t.innerHTML = SRV.icon(type === 'error' ? 'alert' : 'checkCircle') + `<div>${msg}</div>`;
    wrap.appendChild(t); setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, 4200);
  };
  SRV.modal = (title, bodyHtml, { wide } = {}) => {
    SRV.closeModal();
    const bd = document.createElement('div'); bd.className = 'modal-backdrop open'; bd.id = 'srv-modal';
    bd.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="srv-modal-title" style="${wide ? 'max-width:960px' : ''}"><div class="modal-head"><h3 id="srv-modal-title">${title}</h3><button class="modal-close" aria-label="Close">${SRV.icon('x')}</button></div><div class="modal-body">${bodyHtml}</div></div>`;
    document.body.appendChild(bd); document.body.style.overflow = 'hidden';
    bd.addEventListener('click', (e) => { if (e.target === bd || e.target.closest('.modal-close')) SRV.closeModal(); });
    const f = bd.querySelector('input, select, textarea, button:not(.modal-close)'); if (f) setTimeout(() => f.focus(), 50);
    return bd;
  };
  SRV.closeModal = () => { const m = SRV.$('#srv-modal'); if (m) m.remove(); document.body.style.overflow = ''; };
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') SRV.closeModal(); });

  /* ---------------- Shared renderers ---------------- */
  SRV.tel = (p) => `<a href="tel:${p.replace(/[^\d+]/g, '')}">${SRV.esc(p)}</a>`;
  SRV.officeCard = (o, featured) => `<div class="office-card${featured ? ' featured' : ''}">
      <div class="ot">${SRV.esc(o.type)}</div>
      <h3 style="margin:6px 0 0">${SRV.esc(o.name)}</h3>
      <dl>
        <div><dt>Address</dt><dd>${SRV.esc(o.address)}</dd></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div><dt>Phone</dt><dd>${SRV.tel(o.phone)}</dd></div><div><dt>Email</dt><dd><a href="mailto:${o.email}">${SRV.esc(o.email)}</a></dd></div></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div><dt>Office hours</dt><dd>${SRV.esc(o.hours)}</dd></div>${o.head ? `<div><dt>Office head</dt><dd><strong>${SRV.esc(o.head)}</strong><br><span class="small" style="opacity:.8">${SRV.esc(o.headTitle)}</span></dd></div>` : ''}</div>
      </dl>
      <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-sm ${featured ? 'btn-primary' : 'btn-outline'}" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${o.lat},${o.lon}">${SRV.icon('pin')}Directions</a><a class="btn btn-sm ${featured ? 'btn-ghost-light' : 'btn-outline'}" href="contact?office=${encodeURIComponent(o.name)}">${SRV.icon('mail')}Contact office</a></div>
    </div>`;
  SRV.allOffices = () => D.COUNTRIES.flatMap((c) => c.offices.map((o) => Object.assign({ country: c.name, cc: c.code, region: c.region }, o)));

  /* ---------------- Form validation ---------------- */
  SRV.validate = (form) => {
    let ok = true; let first = null;
    SRV.$$('[data-req], [type=email], [data-pattern]', form).forEach((el) => {
      const v = (el.type === 'checkbox' ? (el.checked ? 'y' : '') : el.value).trim();
      let msg = '';
      if (el.hasAttribute('data-req') && !v) msg = el.type === 'checkbox' ? 'Please confirm to continue.' : 'This field is required.';
      else if (v && el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Enter a valid email address.';
      else if (v && el.dataset.pattern && !new RegExp(el.dataset.pattern).test(v)) msg = el.dataset.msg || 'Invalid format.';
      else if (v && el.type === 'number' && el.min !== '' && Number(v) < Number(el.min)) msg = `Minimum is ${el.min}.`;
      const field = el.closest('.field') || el.parentElement; let err = field.querySelector('.err');
      if (!err) { err = document.createElement('div'); err.className = 'err'; field.appendChild(err); }
      err.textContent = msg; el.classList.toggle('invalid', !!msg); el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg) { ok = false; if (!first) first = el; }
    });
    if (first) first.focus();
    return ok;
  };
  SRV.formData = (form) => Object.fromEntries(new FormData(form).entries());

  /* ---------------- Layout ---------------- */
  const NAV = [
    { href: './', label: 'Home', page: 'home' },
    { label: 'Company', page: ['about', 'leadership', 'fleet', 'careers'], items: [
      { href: 'about', label: 'About SRV', sub: 'Our story, HQ & Operations Centre' },
      { href: 'leadership', label: 'Leadership & Board', sub: 'Directors, CEO and governance' },
      { href: 'fleet', label: 'Our Fleet', sub: `${D.FLEET.length} container vessels` },
      { href: 'careers', label: 'Careers', sub: 'Join our global team' } ] },
    { href: 'services', label: 'Services', page: 'services' },
    { href: 'network', label: 'Global Network', page: 'network' },
    { label: 'Digital Tools', page: ['tracking', 'schedules', 'quote'], items: [
      { href: 'tracking', label: 'Track & Trace', sub: 'Container, B/L or booking' },
      { href: 'schedules', label: 'Sailing Schedules', sub: 'Point-to-point schedules' },
      { href: 'quote', label: 'Instant Quote & Booking', sub: 'Price and book online' } ] },
    { href: 'contact', label: 'Contact', page: 'contact' }
  ];

  function renderHeader() {
    const page = document.body.dataset.page;
    const S = D.SITE;
    const nav = NAV.map((n) => {
      if (n.items) {
        const act = n.page.includes(page) ? ' active' : '';
        return `<div class="nav-dd${act}"><button type="button" aria-expanded="false">${n.label}${SRV.icon('chevDown')}</button><div class="dd-menu">${n.items.map((i) => `<a href="${i.href}"><strong>${i.label}</strong><span>${i.sub}</span></a>`).join('')}</div></div>`;
      }
      return `<a href="${n.href}" class="${n.page === page ? 'active' : ''}">${n.label}</a>`;
    }).join('');
    const top = document.createElement('div');
    top.innerHTML = `<div class="topbar"><div class="container">
        <div class="tb-left"><span>${SRV.icon('building')}HQ Dubai: <a href="tel:${S.hq.phone.replace(/\s/g, '')}">${S.hq.phone}</a></span><span class="hide-sm">${SRV.icon('anchor')}OMC Chennai: <a href="tel:${S.omc.phone.replace(/\s/g, '')}">${S.omc.phone}</a></span></div>
        <div class="tb-right"><a href="mailto:${S.support.email}">${SRV.icon('mail')}${S.support.email}</a><a href="network">${SRV.icon('globe')}32 Countries</a></div>
      </div></div>
      <header class="site-header"><div class="container">
        <a class="brand" href="./" aria-label="${S.name} home">${SRV.logo()}<span class="brand-text"><strong>SRV</strong><span>Logistics &amp; Shipping</span></span></a>
        <button class="nav-toggle" aria-label="Open menu" aria-expanded="false">${SRV.icon('menu')}</button>
        <nav class="main-nav" aria-label="Main">${nav}
          <div class="mobile-cta"><a class="btn btn-outline" href="portal">${SRV.icon('user')}Customer Portal</a><a class="btn btn-primary" href="quote">Get a Quote</a></div>
        </nav>
        <div class="header-cta desktop"><a class="btn btn-outline btn-sm" href="portal">${SRV.icon('user')}myPortal</a><a class="btn btn-primary btn-sm" href="quote">Get a Quote</a></div>
      </div></header>`;
    document.body.prepend(...top.children);

    const toggle = SRV.$('.nav-toggle'), mnav = SRV.$('.main-nav');
    toggle.addEventListener('click', () => { const o = mnav.classList.toggle('open'); toggle.setAttribute('aria-expanded', o); toggle.innerHTML = SRV.icon(o ? 'x' : 'menu'); document.body.style.overflow = o ? 'hidden' : ''; });
    SRV.$$('.nav-dd > button').forEach((b) => b.addEventListener('click', (e) => {
      e.stopPropagation(); const dd = b.parentElement; const open = !dd.classList.contains('open');
      SRV.$$('.nav-dd.open').forEach((x) => { x.classList.remove('open'); x.firstElementChild.setAttribute('aria-expanded', 'false'); });
      if (open) { dd.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
    }));
    document.addEventListener('click', () => SRV.$$('.nav-dd.open').forEach((x) => { x.classList.remove('open'); x.firstElementChild.setAttribute('aria-expanded', 'false'); }));
  }

  function renderFooter() {
    const S = D.SITE;
    const f = document.createElement('footer'); f.className = 'site-footer';
    f.innerHTML = `<div class="container"><div class="f-grid">
        <div class="f-brand">
          <a class="brand" href="./">${SRV.logo()}<span class="brand-text"><strong>SRV</strong><span>Logistics &amp; Shipping</span></span></a>
          <p style="margin-top:18px;max-width:340px">${S.name} — an integrated container shipping and logistics group headquartered at Jebel Ali, Dubai, with its global Operations &amp; Management Centre at Chennai Port, India.</p>
          <div class="socials"><a href="${S.social.linkedin}" aria-label="LinkedIn">${SRV.icon('linkedin')}</a><a href="${S.social.x}" aria-label="X">${SRV.icon('xsocial')}</a><a href="${S.social.youtube}" aria-label="YouTube">${SRV.icon('youtube')}</a><a href="${S.social.instagram}" aria-label="Instagram">${SRV.icon('instagram')}</a></div>
        </div>
        <div><h5>Company</h5><ul><li><a href="about">About SRV</a></li><li><a href="leadership">Leadership &amp; Board</a></li><li><a href="fleet">Our Fleet</a></li><li><a href="about#sustainability">Sustainability</a></li><li><a href="careers">Careers</a></li><li><a href="./#news">News</a></li></ul></div>
        <div><h5>Services</h5><ul><li><a href="services#fcl">Ocean Freight FCL</a></li><li><a href="services#lcl">LCL Consolidation</a></li><li><a href="services#reefer">Reefer Cargo</a></li><li><a href="services#project">Project Cargo</a></li><li><a href="services#inland">Inland &amp; Rail</a></li><li><a href="services#customs">Customs Brokerage</a></li></ul></div>
        <div><h5>Digital Tools</h5><ul><li><a href="tracking">Track &amp; Trace</a></li><li><a href="schedules">Sailing Schedules</a></li><li><a href="quote">Instant Quote</a></li><li><a href="portal">Customer Portal</a></li><li><a href="network">Port &amp; Office Finder</a></li></ul></div>
        <div>
          <h5>Head Offices</h5>
          <div class="f-office"><strong>Global HQ — Dubai, UAE</strong>Jebel Ali Free Zone, Jebel Ali Port<br><a href="tel:${S.hq.phone.replace(/\s/g, '')}">${S.hq.phone}</a> · <a href="mailto:${S.hq.email}">${S.hq.email}</a></div>
          <div class="f-office"><strong>Operations &amp; Management Centre — Chennai, India</strong>Chennai Port, Rajaji Salai<br><a href="tel:${S.omc.phone.replace(/\s/g, '')}">${S.omc.phone}</a> · <a href="mailto:${S.omc.email}">${S.omc.email}</a></div>
        </div>
      </div>
      <div class="f-bottom"><span>© ${new Date().getFullYear()} ${S.name}. All rights reserved.</span><span><a href="legal#privacy">Privacy</a> · <a href="legal#terms">Terms of Use</a> · <a href="legal#bl-terms">B/L Terms</a> · <a href="legal#cookies">Cookies</a></span></div>
    </div>`;
    document.body.appendChild(f);

    const bt = document.createElement('button'); bt.className = 'back-top'; bt.setAttribute('aria-label', 'Back to top'); bt.innerHTML = SRV.icon('arrowUp');
    bt.addEventListener('click', () => window.scrollTo({ top: 0 })); document.body.appendChild(bt);
    window.addEventListener('scroll', () => bt.classList.toggle('show', window.scrollY > 700), { passive: true });

    if (!SRV.store.get('cookie', null)) {
      const c = document.createElement('div'); c.className = 'cookie-bar'; c.setAttribute('role', 'dialog'); c.setAttribute('aria-label', 'Cookie preferences');
      c.innerHTML = `<strong>We value your privacy</strong><p class="small muted" style="margin:6px 0 0">This site stores your quotes, bookings and preferences locally in your browser. See our <a href="legal#cookies">cookie policy</a>.</p><div class="actions"><button class="btn btn-blue btn-sm" data-c="all">Accept all</button><button class="btn btn-outline btn-sm" data-c="essential">Essential only</button></div>`;
      c.addEventListener('click', (e) => { const b = e.target.closest('[data-c]'); if (!b) return; SRV.store.set('cookie', b.dataset.c); c.remove(); });
      document.body.appendChild(c);
      // keep back-to-top from overlapping
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderHeader(); renderFooter();
    SRV.$$('[data-year]').forEach((e) => (e.textContent = new Date().getFullYear()));
    SRV.$$('[data-icon]').forEach((e) => { e.innerHTML = SRV.icon(e.dataset.icon) + e.innerHTML; });
    SRV.$$('[data-count]').forEach((e) => {
      const target = Number(e.dataset.count); const dec = Number(e.dataset.dec || 0); let started = false;
      const run = () => { if (started) return; started = true; const t0 = performance.now(); const step = (t) => { const p = Math.min(1, (t - t0) / 1400); const v = target * (1 - Math.pow(1 - p, 3)); e.firstChild.nodeValue = v.toFixed(dec); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
      if (!e.firstChild || e.firstChild.nodeType !== 3) e.prepend(document.createTextNode('0'));
      if ('IntersectionObserver' in window) { const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { run(); io.disconnect(); } }); io.observe(e); } else run();
    });
    if (typeof SRV.init === 'function') SRV.init();
    // content is rendered by JS, so re-apply deep-link scrolling once it exists
    if (location.hash.length > 1) { const t = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (t) setTimeout(() => t.scrollIntoView(), 80); }
  });
})();
