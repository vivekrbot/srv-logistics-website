/* ==========================================================================
   Shipment model: deterministic journeys for any container / B/L number,
   plus real bookings created in this browser via the Quote & Booking page.
   ========================================================================== */
(function () {
  'use strict';
  const D = SRV_DATA;
  const COMMODITIES = ['Cotton yarn', 'Auto components', 'Frozen shrimp', 'Basmati rice', 'Pharmaceuticals', 'Granite slabs', 'Electrical machinery', 'Ready-made garments', 'Spices', 'Ceramic tiles', 'Steel coils', 'Polymer granules', 'Fresh grapes', 'Furniture', 'Tea', 'Leather goods'];

  SRV.classifyId = (raw) => {
    const id = String(raw || '').toUpperCase().replace(/[\s-]/g, '');
    if (/^[A-Z]{3}[UJZ]\d{7}$/.test(id)) {
      const cd = SRV.checkDigit(id.slice(0, 10));
      return { id, kind: 'container', valid: cd === Number(id[10]), suggestion: id.slice(0, 10) + cd };
    }
    if (/^SRVB\d{8}$/.test(id)) return { id, kind: 'booking', valid: true };
    if (/^SRVL\d{6,10}$/.test(id) || /^SRV[A-Z]{0,2}\d{8,10}$/.test(id)) return { id, kind: 'bl', valid: true };
    return { id, kind: 'unknown', valid: false };
  };

  function events(sail, origin, dest, r) {
    const ev = []; const h = (d, hrs) => { const x = new Date(d); x.setHours(hrs, Math.floor(r() * 59), 0, 0); return x; };
    const O = SRV.port(origin), Dp = SRV.port(dest);
    ev.push({ t: h(SRV.addDays(sail.etd, -5), 9 + Math.floor(r() * 6)), loc: `${O.city} depot`, title: 'Empty container released to shipper', icon: 'box' });
    ev.push({ t: h(SRV.addDays(sail.etd, -2), 8 + Math.floor(r() * 10)), loc: `${O.name}`, title: 'Gate in (full) at terminal', icon: 'truck' });
    sail.legs.forEach((l, i) => {
      const P = SRV.port(l.seg.from);
      if (i > 0) ev.push({ t: h(sail.legs[i - 1].arr, 6 + Math.floor(r() * 12)), loc: P.name, title: `Discharged for transhipment`, icon: 'crane' });
      ev.push({ t: h(l.dep, 2 + Math.floor(r() * 8)), loc: P.name, title: `Loaded on ${l.vessel} (Voy. ${l.voyage})`, icon: 'crane' });
      ev.push({ t: h(l.dep, 14 + Math.floor(r() * 8)), loc: P.name, title: `Vessel departed — ${l.service} ${SRV.service(l.service).name}`, icon: 'ship', leg: i });
    });
    const last = sail.legs[sail.legs.length - 1];
    ev.push({ t: h(sail.eta, 1 + Math.floor(r() * 8)), loc: Dp.name, title: `Vessel arrived — ${last.vessel}`, icon: 'anchor', arrive: true });
    ev.push({ t: h(SRV.addDays(sail.eta, 1), 3 + Math.floor(r() * 10)), loc: Dp.name, title: 'Discharged from vessel', icon: 'crane' });
    ev.push({ t: h(SRV.addDays(sail.eta, 2), 10 + Math.floor(r() * 6)), loc: Dp.city, title: 'Import customs released', icon: 'doc' });
    ev.push({ t: h(SRV.addDays(sail.eta, 3), 8 + Math.floor(r() * 9)), loc: Dp.name, title: 'Gate out (full) for delivery', icon: 'truck' });
    ev.push({ t: h(SRV.addDays(sail.eta, 6), 9 + Math.floor(r() * 8)), loc: `${Dp.city} depot`, title: 'Empty container returned', icon: 'checkCircle', final: true });
    return ev;
  }

  function status(ev, now, sail) {
    const done = ev.filter((e) => e.t <= now);
    const lastDone = done[done.length - 1];
    const start = ev[0].t, end = ev[ev.length - 1].t;
    const pct = Math.max(0, Math.min(100, Math.round(((now - start) / (end - start)) * 100)));
    let label = 'Booking confirmed — awaiting cargo', tone = 'gray', leg = null, frac = 0;
    if (lastDone) {
      const t = lastDone.title;
      if (lastDone.final) { label = 'Delivered — empty returned'; tone = 'green'; }
      else if (/Gate out/.test(t)) { label = 'Out for delivery'; tone = 'green'; }
      else if (/customs/.test(t) || /Discharged from vessel/.test(t)) { label = 'At destination port'; tone = 'teal'; }
      else if (lastDone.arrive) { label = 'Arrived at destination'; tone = 'teal'; }
      else if (/departed/.test(t)) {
        label = 'In transit'; tone = 'blue'; leg = lastDone.leg; const l = sail.legs[leg];
        frac = Math.max(0, Math.min(1, (now - lastDone.t) / (l.arr - lastDone.t + 864e5)));
      } else if (/transhipment/.test(t) || (/Loaded/.test(t) && done.some((e) => /transhipment/.test(e.title)))) { label = 'At transhipment port'; tone = 'amber'; }
      else if (/Loaded/.test(t) || /Gate in/.test(t)) { label = 'At origin terminal'; tone = 'amber'; }
      else { label = 'Empty released — cargo being stuffed'; tone = 'gray'; }
    }
    return { label, tone, pct, current: lastDone || null, leg, frac };
  }

  /** Online bookings move to "Confirmed" 10 minutes after submission until a booking back-end supplies real status. */
  SRV.bookingStatus = (b) => {
    if (b.status === 'Cancelled') return 'Cancelled';
    if (b.etd && SRV.parseISO(b.etd) < SRV.today()) return 'Sailed';
    return Date.now() - b.createdAt > 10 * 60 * 1000 ? 'Confirmed' : 'Pending confirmation';
  };

  /** Interpolate a position along leg coordinates. */
  SRV.alongPath = (pts, frac) => {
    const seg = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const d = SRV.nm(pts[i - 1], pts[i]); seg.push(d); tot += d; }
    let target = tot * frac;
    for (let i = 0; i < seg.length; i++) {
      if (target <= seg[i]) { const f = seg[i] ? target / seg[i] : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; }
      target -= seg[i];
    }
    return pts[pts.length - 1];
  };

  /** Build a shipment for any id. Returns null for unrecognised ids. */
  SRV.shipment = (raw) => {
    const c = SRV.classifyId(raw);
    if (c.kind === 'unknown' || !c.valid) return { error: c };
    const now = new Date();

    if (c.kind === 'booking') {
      const b = (SRV.store.get('bookings', []) || []).find((x) => x.ref === c.id);
      if (b) {
        const route = SRV.route(b.from, b.to);
        const sail = route ? SRV.sailing(route, SRV.parseISO(b.etd || b.date)) : null;
        return { kind: 'booking', id: c.id, booking: b, route, sail, local: true };
      }
    }

    const r = SRV.rng(SRV.hash(c.id));
    const pool = SRV.PORT_LIST;
    let o, d, route;
    for (let tries = 0; tries < 30; tries++) {
      o = SRV.pick(r, pool); d = SRV.pick(r, pool);
      if (o.cc === d.cc) continue;
      route = SRV.route(o.locode, d.locode); if (route) break;
    }
    const span = route.days + 16;
    const offset = Math.floor(r() * (span + 10)) - 8; // days since departure (negative = upcoming)
    const sail = SRV.sailing(route, SRV.addDays(SRV.today(), -offset));
    const ev = events(sail, o.locode, d.locode, r);
    const st = status(ev, now, sail);
    const typeIdx = Math.floor(r() * 4); const ctype = D.CONTAINERS[[0, 1, 2, r() > .5 ? 4 : 5][typeIdx]];
    const nCont = c.kind === 'bl' ? 1 + Math.floor(r() * 3) : 1;
    const containers = [];
    for (let i = 0; i < nCont; i++) {
      const no = c.kind === 'container' && i === 0 ? c.id : SRV.makeContainerNo(SRV.pick(r, ['SRVU', 'TGHU', 'TCLU', 'SRVU']), Math.floor(r() * 999999));
      containers.push({ no, type: ctype, seal: 'SL' + String(Math.floor(r() * 1e7)).padStart(7, '0'), weight: Math.round((ctype.maxKg * (0.45 + r() * 0.45)) / 10) * 10 });
    }
    const bl = c.kind === 'bl' ? c.id : 'SRVL' + String(SRV.hash(c.id + 'bl') % 1e8).padStart(8, '0');
    return {
      kind: c.kind, id: c.id, route, sail, events: ev, status: st, containers, bl,
      booking: 'SRVB' + String(SRV.hash(c.id + 'bk') % 1e8).padStart(8, '0'),
      commodity: SRV.pick(r, COMMODITIES), packages: 200 + Math.floor(r() * 1800),
      shipper: SRV.pick(r, ['Coromandel Textiles Pvt Ltd', 'Gulf Star Trading LLC', 'Kaveri Agro Exports', 'Harbour Line Industries', 'Malabar Spice Co.', 'Sunrise Auto Parts', 'Deccan Granite Works']),
      consignee: 'To order of notify party'
    };
  };
})();
