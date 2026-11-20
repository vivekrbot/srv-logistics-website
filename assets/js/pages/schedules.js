/* Sailing schedules page */
SRV.init = function () {
  const { $, esc, icon } = SRV;
  const form = $('#schedForm');
  const p = { from: SRV.qs('from') || 'INMAA', to: SRV.qs('to') || '', date: SRV.qs('date') || SRV.isoDate(new Date()), weeks: SRV.qs('weeks') || '6' };
  $('#from').innerHTML = SRV.portOptions(p.from);
  $('#to').innerHTML = SRV.portOptions(p.to);
  $('#date').value = p.date; $('#weeks').value = p.weeks;
  let map = null, layer = null, current = [];

  $('#swap').addEventListener('click', () => { const a = $('#from').value; $('#from').value = $('#to').value; $('#to').value = a; renderDirect(); });
  $('#from').addEventListener('change', renderDirect);

  function renderDirect() {
    const o = $('#from').value; if (!o) { $('#directFrom').innerHTML = ''; return; }
    const dests = new Set(); SRV.servicesAtPort(o).forEach((s) => s.rotation.forEach((k) => { if (k[0] !== '~' && k !== o) dests.add(k); }));
    const port = SRV.port(o);
    $('#directFrom').innerHTML = `<div class="small muted" style="margin-bottom:8px">Direct (no transhipment) destinations from <strong>${esc(port.name)}</strong> on ${SRV.servicesAtPort(o).map((s) => s.code).join(', ')}:</div>
      <div class="chips">${[...dests].sort((a, b) => SRV.port(a).city.localeCompare(SRV.port(b).city)).map((d) => `<button type="button" class="chip${d === $('#to').value ? ' active' : ''}" data-to="${d}">${esc(SRV.port(d).city)} <span class="muted">${d}</span></button>`).join('')}</div>`;
  }
  $('#directFrom').addEventListener('click', (e) => { const b = e.target.closest('[data-to]'); if (!b) return; $('#to').value = b.dataset.to; form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable: true })); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!SRV.validate(form)) return;
    const o = $('#from').value, d = $('#to').value;
    if (o === d) { SRV.toast('Port of loading and discharge must differ.', 'error'); return; }
    history.replaceState(null, '', `?from=${o}&to=${d}&date=${$('#date').value}&weeks=${$('#weeks').value}`);
    search(o, d, SRV.parseISO($('#date').value), Number($('#weeks').value));
    renderDirect();
  });

  function legLine(l) {
    const s = SRV.service(l.service);
    return `<tr><td><span class="badge" style="background:${s.color};color:#fff">${s.code}</span><div class="tiny muted">${esc(s.name)}</div></td>
      <td><strong>${esc(SRV.port(l.seg.from).name)}</strong><div class="tiny muted">${SRV.fmtDay(l.dep)}</div></td>
      <td><strong>${esc(SRV.port(l.seg.to).name)}</strong><div class="tiny muted">${SRV.fmtDay(l.arr)}</div></td>
      <td>${esc(l.vessel)}<div class="tiny muted mono">Voy. ${l.voyage}</div></td>
      <td class="small">${l.seg.calls.length ? l.seg.calls.map((c) => SRV.port(c).city).join(', ') : '<span class="muted">Direct</span>'}</td></tr>`;
  }

  function search(o, d, from, weeks) {
    const res = SRV.sailings(o, d, from, weeks);
    current = res;
    const out = $('#results');
    if (!res.length) { out.innerHTML = `<div class="alert warn">${icon('alert')}<div>No routing found between these ports. Please <a href="contact">contact our sales team</a> for a tailored solution.</div></div>`; $('#routeMapWrap').style.display = 'none'; return; }
    const r = res[0].route; const O = SRV.port(o), Dp = SRV.port(d);
    out.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin-bottom:16px">
        <div><h2 style="font-size:1.5rem;margin:0">${esc(O.city)} → ${esc(Dp.city)}</h2><div class="muted small">${res.length} sailings · ${r.direct ? 'Direct service' : `Transhipment via ${r.tranship.map((t) => SRV.port(t).city).join(', ')}`} · ~${SRV.num(r.nm)} nautical miles</div></div>
        <div class="no-print" style="display:flex;gap:8px"><button class="btn btn-outline btn-sm" id="csv">${icon('doc')}Download CSV</button><button class="btn btn-outline btn-sm" onclick="window.print()">${icon('printer')}Print</button></div></div>` +
      res.map((s, i) => `<div class="result-card">
        <div>
          <div class="route-line">
            <div class="route-pt"><strong>${SRV.fmtDay(s.etd)}</strong><span>ETD ${esc(O.city)} (${o})</span></div>
            <div class="route-mid">${s.transit} days · ${s.legs.map((l) => l.service).join(' + ')}${s.legs.length > 1 ? `<br>via ${s.legs.slice(1).map((l) => SRV.port(l.seg.from).city).join(', ')}` : '<br>Direct'}</div>
            <div class="route-pt" style="text-align:right"><strong>${SRV.fmtDay(s.eta)}</strong><span>ETA ${esc(Dp.city)} (${d})</span></div>
          </div>
          <div class="kv" style="margin-top:16px">
            <div><span>Vessel / Voyage</span><strong>${esc(s.legs[0].vessel)}</strong> <span class="mono tiny">${s.legs[0].voyage}</span></div>
            <div><span>Doc cut-off</span><strong>${SRV.fmtDay(s.cutoffDoc)} 12:00</strong></div>
            <div><span>CY / VGM cut-off</span><strong>${SRV.fmtDay(s.cutoffCY)} 18:00</strong></div>
          </div>
          <details style="margin-top:14px"><summary class="small" style="cursor:pointer;color:var(--blue-600);font-weight:600">Leg details (${s.legs.length})</summary>
            <div class="table-wrap" style="margin-top:10px"><table class="table"><thead><tr><th>Service</th><th>Load</th><th>Discharge</th><th>Vessel</th><th>Calls en route</th></tr></thead><tbody>${s.legs.map(legLine).join('')}</tbody></table></div></details>
        </div>
        <div class="no-print" style="display:flex;flex-direction:column;gap:8px;min-width:150px">
          ${s.cutoffDoc < SRV.today() ? '<span class="badge red">Closed for booking</span>' : `<a class="btn btn-primary btn-sm" href="quote?from=${o}&to=${d}&date=${SRV.isoDate(s.etd)}">Book this sailing</a>`}
          ${i === 0 ? '<span class="badge green" style="align-self:flex-start">Earliest</span>' : ''}${s.transit === Math.min(...res.map((x) => x.transit)) ? '<span class="badge teal" style="align-self:flex-start">Fastest</span>' : ''}
        </div></div>`).join('') +
      `<p class="tiny muted" style="margin-top:16px">Schedules are indicative and subject to change due to weather, port congestion or operational requirements. Cut-off times are local to the port of loading.</p>`;
    $('#csv').addEventListener('click', downloadCSV);
    drawMap(r);
  }

  function drawMap(r) {
    $('#routeMapWrap').style.display = 'block';
    $('#routeInfo').textContent = r.legs.map((l) => l.service).join(' → ');
    if (!map) map = SRV.makeMap($('#routeMap'), { center: [20, 60], zoom: 2 });
    if (!map) return;
    if (layer) layer.remove();
    layer = L.featureGroup().addTo(map);
    const legPts = SRV.routeCoords(r);
    r.legs.forEach((l, li) => {
      const s = SRV.service(l.service); const u = legPts[li];
      L.polyline(u, { color: s.color, weight: 4, opacity: .9 }).addTo(layer).bindTooltip(`${s.code} · ${s.name}`);
      l.keys.forEach((k, ki) => { if (l.calls.includes(k)) L.circleMarker(u[ki], { radius: 4, color: s.color, fillColor: '#fff', fillOpacity: 1, weight: 2 }).addTo(layer).bindTooltip(SRV.port(k).name); });
      if (li > 0) L.marker(u[0], { icon: SRV.pinIcon() }).addTo(layer).bindTooltip('Transhipment: ' + SRV.port(l.from).name);
    });
    const lastLeg = legPts[legPts.length - 1];
    L.marker(legPts[0][0], { icon: SRV.pinIcon('office') }).addTo(layer).bindTooltip('Origin: ' + SRV.port(r.origin).name);
    L.marker(lastLeg[lastLeg.length - 1], { icon: SRV.pinIcon('hq') }).addTo(layer).bindTooltip('Destination: ' + SRV.port(r.destination).name);
    setTimeout(() => { map.invalidateSize(); map.fitBounds(layer.getBounds(), { padding: [30, 30] }); }, 50);
  }

  function downloadCSV() {
    const rows = [['ETD', 'ETA', 'Transit days', 'Port of loading', 'Port of discharge', 'Services', 'Vessel', 'Voyage', 'Transhipment', 'Doc cut-off', 'CY cut-off']];
    current.forEach((s) => rows.push([SRV.isoDate(s.etd), SRV.isoDate(s.eta), s.transit, s.route.origin, s.route.destination, s.legs.map((l) => l.service).join('+'), s.legs[0].vessel, s.legs[0].voyage, s.route.tranship.join('+'), SRV.isoDate(s.cutoffDoc), SRV.isoDate(s.cutoffCY)]));
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `SRV-schedule-${current[0].route.origin}-${current[0].route.destination}.csv`; document.body.appendChild(a); a.click(); a.remove();
    SRV.toast('Schedule downloaded.');
  }

  renderDirect();
  if (p.from && p.to && p.from !== p.to) search(p.from, p.to, SRV.parseISO(p.date), Number(p.weeks));
};
