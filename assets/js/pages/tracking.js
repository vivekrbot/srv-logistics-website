/* Track & Trace page */
SRV.init = function () {
  const { $, esc, icon } = SRV;
  const form = $('#trackForm'), input = $('#tid'), out = $('#out');
  let map = null;
  const tone = (t) => ({ blue: '', gray: 'gray', green: 'green', teal: 'teal', amber: 'amber' }[t] ?? '');

  function hints() {
    const recent = SRV.store.get('recent', []);
    $('#hints').innerHTML = recent.length ? `Recent searches: ${recent.map((d) => `<a href="#" data-id="${esc(d)}" class="mono">${esc(d)}</a>`).join(' · ')}` : '';
    $('#hints').hidden = !recent.length;
  }
  $('#hints').addEventListener('click', (e) => { const a = e.target.closest('[data-id]'); if (!a) return; e.preventDefault(); input.value = a.dataset.id; run(a.dataset.id); });

  form.addEventListener('submit', (e) => { e.preventDefault(); if (!SRV.validate(form)) return; run(input.value); });

  function run(raw) {
    const s = SRV.shipment(raw);
    history.replaceState(null, '', '?id=' + encodeURIComponent(String(raw).toUpperCase().trim()));
    if (s.error) return renderError(s.error);
    const recent = SRV.store.get('recent', []).filter((x) => x !== s.id); recent.unshift(s.id); SRV.store.set('recent', recent.slice(0, 5)); hints();
    if (s.kind === 'booking' && s.local) return renderBooking(s);
    render(s);
  }

  function renderError(c) {
    if (c.kind === 'container' && !c.valid) {
      out.innerHTML = `<div class="alert error">${icon('alert')}<div><strong>Check digit mismatch for ${esc(c.id)}.</strong> The last digit of an ISO 6346 container number is a check digit. Did you mean <a href="#" id="sugg" class="mono">${c.suggestion}</a>?</div></div>`;
      $('#sugg').addEventListener('click', (e) => { e.preventDefault(); input.value = c.suggestion; run(c.suggestion); });
    } else {
      out.innerHTML = `<div class="alert warn">${icon('info')}<div><strong>We couldn’t recognise “${esc(c.id || '')}”.</strong> Enter a container number (4 letters + 7 digits), an SRV bill of lading (starts with SRVL) or an SRV booking reference (starts with SRVB).</div></div>`;
    }
  }

  function header(s, title, badge) {
    const r = s.route, O = SRV.port(r.origin), Dp = SRV.port(r.destination);
    return `<div class="panel" style="margin-bottom:24px"><div class="panel-body">
      <div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:flex-start">
        <div><div class="small muted">${title}</div><h2 class="mono" style="margin:2px 0 8px;font-size:1.7rem">${esc(s.id)}</h2>${badge}</div>
        <div class="no-print" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-outline btn-sm" id="watch">${icon('star')}Add to my shipments</button><button class="btn btn-outline btn-sm" onclick="window.print()">${icon('printer')}Print</button></div>
      </div>
      <div class="route-line" style="margin-top:22px">
        <div class="route-pt"><span>Port of loading</span><strong>${esc(O.name)}</strong><span>${esc(O.country)} · ${O.locode}</span></div>
        <div class="route-mid">${s.sail.transit} days · ${r.legs.map((l) => l.service).join(' → ')}${r.tranship.length ? `<br>via ${r.tranship.map((t) => SRV.port(t).city).join(', ')}` : '<br>Direct service'}</div>
        <div class="route-pt" style="text-align:right"><span>Port of discharge</span><strong>${esc(Dp.name)}</strong><span>${esc(Dp.country)} · ${Dp.locode}</span></div>
      </div>
      ${s.status ? `<div class="progress" style="margin-top:18px"><span style="width:${s.status.pct}%"></span></div>` : ''}
      <div class="kv" style="margin-top:18px">
        <div><span>ETD</span><strong>${SRV.fmtDate(s.sail.etd)}</strong></div>
        <div><span>ETA</span><strong>${SRV.fmtDate(s.sail.eta)}</strong></div>
        <div><span>Vessel / Voyage</span><strong>${esc(s.sail.legs[s.status && s.status.leg != null ? s.status.leg : 0].vessel)}</strong></div>
        <div><span>Bill of lading</span><strong class="mono">${esc(s.bl || '—')}</strong></div>
      </div></div></div>`;
  }

  function watchBtn(id) {
    const b = $('#watch'); if (!b) return;
    const set = () => { const on = SRV.store.get('watch', []).includes(id); b.innerHTML = icon('star') + (on ? 'In my shipments' : 'Add to my shipments'); b.classList.toggle('btn-blue', on); b.classList.toggle('btn-outline', !on); };
    set();
    b.addEventListener('click', () => { let w = SRV.store.get('watch', []); if (w.includes(id)) w = w.filter((x) => x !== id); else w.unshift(id); SRV.store.set('watch', w); set(); SRV.toast(w.includes(id) ? 'Added to My Shipments in the Customer Portal.' : 'Removed from My Shipments.'); });
  }

  function render(s) {
    const st = s.status; const now = new Date();
    const evHtml = s.events.slice().reverse().map((e) => {
      const done = e.t <= now; const cur = st.current === e;
      return `<div class="tl-item ${cur ? 'current' : done ? 'done' : 'future'}"><div class="tl-time">${SRV.fmtDateTime(e.t)}${done ? '' : ' · estimated'}</div><div class="tl-title">${esc(e.title)}</div><div class="small muted">${esc(e.loc)}</div></div>`;
    }).join('');
    out.innerHTML = header(s, s.kind === 'bl' ? 'Bill of lading' : 'Container', `<span class="badge ${tone(st.tone)}" style="font-size:.85rem;padding:6px 12px">${esc(st.label)}</span>${st.current ? ` <span class="small muted">· Last update ${SRV.fmtDateTime(st.current.t)}, ${esc(st.current.loc)}</span>` : ''}`) +
      `<div class="grid two-col" id="trkGrid">
        <div class="panel"><div class="panel-head"><h3>Live route</h3><span class="small muted">${st.leg != null ? `Vessel ${Math.round(st.frac * 100)}% along leg ${st.leg + 1}` : ''}</span></div><div id="trkMap" class="map" style="height:380px;border:0;border-radius:0"></div>
          <div class="panel-body"><h4>Cargo details</h4><div class="table-wrap"><table class="table"><thead><tr><th>Container</th><th>Type</th><th>Seal</th><th>Gross weight</th></tr></thead><tbody>
          ${s.containers.map((c) => `<tr><td class="mono"><a href="tracking.html?id=${c.no}">${c.no}</a></td><td>${c.type.code}</td><td class="mono">${c.seal}</td><td>${SRV.num(c.weight)} kg</td></tr>`).join('')}</tbody></table></div>
          <div class="kv" style="margin-top:16px"><div><span>Commodity</span><strong>${esc(s.commodity)}</strong></div><div><span>Packages</span><strong>${SRV.num(s.packages)}</strong></div><div><span>Shipper</span><strong>${esc(s.shipper)}</strong></div><div><span>Booking</span><strong class="mono">${s.booking}</strong></div></div></div></div>
        <div class="panel"><div class="panel-head"><h3>Shipment milestones</h3><span class="small muted">Latest first</span></div><div class="panel-body"><div class="timeline">${evHtml}</div>
          <div class="divider" style="margin:8px 0 20px"></div>
          <form id="alertForm" class="no-print" novalidate><label class="small" for="alertEmail" style="font-weight:600">Email me milestone updates</label><div class="input-group" style="margin-top:6px"><input id="alertEmail" type="email" class="input" placeholder="you@company.com" data-req><button class="btn btn-blue" type="submit">Subscribe</button></div></form></div></div>
      </div>`;
    watchBtn(s.id);
    $('#alertForm').addEventListener('submit', (e) => { e.preventDefault(); if (!SRV.validate(e.target)) return; const subs = SRV.store.get('alerts', []); subs.unshift({ id: s.id, email: $('#alertEmail').value, at: Date.now() }); SRV.store.set('alerts', subs); SRV.toast(`Alerts for ${s.id} will be sent to ${esc($('#alertEmail').value)}.`); e.target.reset(); });
    drawMap(s);
  }

  function renderBooking(s) {
    const b = Object.assign({}, s.booking, { status: SRV.bookingStatus(s.booking) });
    const fake = { id: s.id, route: s.route, sail: s.sail, bl: 'Issued after loading', status: null };
    const steps = [['Booking request received', true, b.createdAt], ['Booking confirmed & equipment released', b.status === 'Confirmed' || b.status === 'Sailed', null], ['Gate in (full) at terminal', false, null], [`Loaded on ${s.sail.legs[0].vessel}`, false, s.sail.etd], ['Arrived at destination', false, s.sail.eta]];
    out.innerHTML = header(fake, 'SRV booking', `<span class="badge ${b.status === 'Cancelled' ? 'red' : b.status === 'Pending confirmation' ? 'amber' : 'green'}" style="font-size:.85rem;padding:6px 12px">${esc(b.status)}</span>`) +
      `<div class="grid g-2"><div class="panel"><div class="panel-head"><h3>Booking details</h3></div><div class="panel-body"><div class="kv">
        <div><span>Equipment</span><strong>${esc(b.desc || b.type)}</strong></div><div><span>Commodity</span><strong>${esc(b.commodity || '—')}</strong></div>
        <div><span>Cargo ready</span><strong>${SRV.fmtDate(SRV.parseISO(b.date))}</strong></div><div><span>Quoted total</span><strong>${SRV.money(b.total)}</strong></div>
        <div><span>Booked by</span><strong>${esc(b.contact || '—')}</strong></div><div><span>Company</span><strong>${esc(b.company || '—')}</strong></div></div>
        <p class="small muted" style="margin-top:16px">Our Chennai documentation team confirms online bookings within 4 working hours. Manage this booking in the <a href="portal.html">Customer Portal</a>.</p></div></div>
      <div class="panel"><div class="panel-head"><h3>Milestones</h3></div><div class="panel-body"><div class="timeline">${steps.map(([t, d, at]) => `<div class="tl-item ${d ? 'done' : 'future'}"><div class="tl-time">${at ? SRV.fmtDate(at) : 'Pending'}</div><div class="tl-title">${esc(t)}</div></div>`).join('')}</div></div></div></div>
      <div id="trkMap" class="map" style="height:360px;margin-top:24px"></div>`;
    watchBtn(s.id);
    drawMap(Object.assign({ status: { leg: null } }, s));
  }

  function drawMap(s) {
    if (map) { map.remove(); map = null; }
    map = SRV.makeMap($('#trkMap'), { center: [20, 60], zoom: 2 });
    if (!map) return;
    const g = L.featureGroup().addTo(map); const legPts = SRV.routeCoords(s.route);
    s.route.legs.forEach((l, i) => {
      const col = SRV.service(l.service).color; const pts = legPts[i];
      const st = s.status || {};
      const passed = st.leg != null ? i < st.leg : (s.events && s.events.some((e) => e.arrive && e.t <= new Date()));
      L.polyline(pts, { color: col, weight: 4, opacity: passed ? .45 : .9, dashArray: passed ? '6 8' : null }).addTo(g).bindTooltip(`${l.service} · ${SRV.service(l.service).name}`);
      if (i > 0) L.marker(pts[0], { icon: SRV.pinIcon() }).addTo(g).bindTooltip('Transhipment: ' + SRV.port(l.from).name);
      if (st.leg === i) {
        const pos = SRV.alongPath(pts, st.frac);
        L.marker(pos, { icon: SRV.pinIcon('ship'), zIndexOffset: 2000 }).addTo(g).bindPopup(`<h4>${esc(s.sail.legs[i].vessel)}</h4>Voyage ${s.sail.legs[i].voyage}<br>En route to ${esc(SRV.port(l.to).name)}<br>ETA ${SRV.fmtDate(s.sail.legs[i].arr)}`).openPopup();
      }
    });
    const last = legPts[legPts.length - 1];
    L.marker(legPts[0][0], { icon: SRV.pinIcon('office') }).addTo(g).bindTooltip('POL: ' + SRV.port(s.route.origin).name);
    L.marker(last[last.length - 1], { icon: SRV.pinIcon('hq') }).addTo(g).bindTooltip('POD: ' + SRV.port(s.route.destination).name);
    setTimeout(() => { map.invalidateSize(); map.fitBounds(g.getBounds(), { padding: [30, 30] }); }, 60);
  }

  hints();
  const q = SRV.qs('id');
  if (q) { input.value = q; run(q); }
};
