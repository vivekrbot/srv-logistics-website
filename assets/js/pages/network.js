/* Global network page */
SRV.init = function () {
  const { $, $$, esc, icon } = SRV; const D = SRV_DATA;
  let region = 'All', query = '', selected = null;

  $('#regions').innerHTML = ['All'].concat(D.REGIONS).map((r) => `<button class="chip${r === 'All' ? ' active' : ''}" data-r="${r}">${r}</button>`).join('');

  const matches = (c) => {
    if (region !== 'All' && c.region !== region) return false;
    if (!query) return true;
    const hay = [c.name, c.code, c.region, ...c.offices.map((o) => o.city + ' ' + o.name), ...c.ports.map((p) => `${p.name} ${p.city} ${p.locode}`)].join(' ').toLowerCase();
    return hay.includes(query);
  };

  /* Map */
  const map = SRV.makeMap($('#netMap'), { center: [20, 40], zoom: 2 });
  const markers = {};
  if (map) {
    D.COUNTRIES.forEach((c) => {
      markers[c.code] = [];
      c.ports.forEach((p) => markers[c.code].push(L.marker([p.lat, p.lon], { icon: SRV.pinIcon() }).addTo(map)
        .bindTooltip(`${esc(p.name)} (${p.locode})`).on('click', () => select(c.code, true))));
      c.offices.forEach((o) => {
        const hq = /Headquarters|Operations & Management/.test(o.type);
        markers[c.code].push(L.marker([o.lat, o.lon], { icon: SRV.pinIcon(hq ? 'hq' : 'office'), zIndexOffset: 800 }).addTo(map)
          .bindTooltip(`${esc(o.name)}`).on('click', () => select(c.code, true)));
      });
    });
  }

  function renderList() {
    const list = D.COUNTRIES.filter(matches).sort((a, b) => a.name.localeCompare(b.name));
    $('#countLbl').textContent = `${list.length} ${list.length === 1 ? 'country' : 'countries'}`;
    $('#list').innerHTML = list.length ? list.map((c) => `<button class="net-item${selected === c.code ? ' active' : ''}" data-cc="${c.code}">
        <span class="cc">${c.code}</span><span class="ni-main"><strong>${esc(c.name)}</strong><span>${esc(c.offices.map((o) => o.city).join(' · '))}</span></span>
        <span class="small muted nowrap">${c.offices.length} · ${c.ports.length}</span></button>`).join('')
      : `<div class="empty">${icon('search')}<div>No matches for “${esc(query)}”.</div></div>`;
    if (map) Object.entries(markers).forEach(([cc, ms]) => { const show = list.some((c) => c.code === cc); ms.forEach((m) => m.setOpacity(show ? 1 : 0.15)); });
    renderPorts();
  }

  function renderPorts() {
    const rows = SRV.PORT_LIST.filter((p) => matches(SRV.country(p.cc)) || (query && `${p.name} ${p.locode} ${p.city}`.toLowerCase().includes(query)));
    $('#portTable').innerHTML = rows.map((p) => `<tr><td><strong>${esc(p.name)}</strong><div class="small muted">${esc(p.city)}</div></td><td class="mono">${p.locode}</td><td><span class="cc">${p.cc}</span> ${esc(p.country)}</td><td class="nowrap">~${p.teu}M TEU</td><td>${p.depth} m</td><td>${SRV.servicesAtPort(p.locode).map((s) => `<span class="badge" style="background:${s.color};color:#fff;margin:1px">${s.code}</span>`).join('')}</td><td class="nowrap"><a href="schedules?from=${p.locode}" class="small">Sailings →</a></td></tr>`).join('')
      || '<tr><td colspan="7" class="muted">No ports match your search.</td></tr>';
  }

  function select(cc, fromMap) {
    const c = SRV.country(cc); if (!c) return;
    selected = cc; history.replaceState(null, '', '#' + cc);
    $$('.net-item').forEach((b) => b.classList.toggle('active', b.dataset.cc === cc));
    const svcs = [...new Set(c.ports.flatMap((p) => SRV.servicesAtPort(p.locode)))];
    $('#detail').innerHTML = `<div class="panel">
      <div class="panel-head"><div style="display:flex;gap:12px;align-items:center"><span class="cc" style="height:30px;min-width:40px;font-size:.85rem">${c.code}</span><div><h3>${esc(c.name)}</h3><div class="small muted">${esc(c.region)} · ${esc(c.tz)} · Currency ${c.currency}</div></div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn btn-sm btn-outline" href="schedules?from=${c.ports[0].locode}">${icon('calendar')}Sailings</a><a class="btn btn-sm btn-primary" href="quote?from=${c.ports[0].locode}">Quote</a></div></div>
      <div class="panel-body">
        <h4>SRV offices in ${esc(c.name)}</h4>
        <div class="grid ${c.offices.length > 1 ? 'g-2' : ''}" style="margin-bottom:28px">${c.offices.map((o) => SRV.officeCard(o, /Headquarters|Operations & Management/.test(o.type))).join('')}</div>
        <h4>Ports served</h4>
        <div class="grid" style="gap:14px;margin-bottom:24px">${c.ports.map((p) => `<div class="card" style="padding:20px">
          <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><div><h4 style="margin:0">${esc(p.name)} <span class="badge gray mono">${p.locode}</span></h4><div class="small muted">${esc(p.city)} · ${p.lat.toFixed(2)}°, ${p.lon.toFixed(2)}°</div></div>
          <a class="small" href="schedules?from=${p.locode}">Sailings from ${esc(p.city)} →</a></div>
          <p class="small" style="margin:10px 0">${esc(p.note)}</p>
          <div class="kv"><div><span>Annual throughput</span><strong>~${p.teu}M TEU</strong></div><div><span>Max draft</span><strong>${p.depth} m</strong></div><div style="grid-column:span 2"><span>Main terminals</span><strong>${esc(p.terminals)}</strong></div></div>
          <div style="margin-top:12px">${SRV.servicesAtPort(p.locode).map((s) => `<span class="badge" style="background:${s.color};color:#fff;margin:2px" title="${esc(s.name)}">${s.code} · ${esc(s.name)}</span>`).join('')}</div></div>`).join('')}</div>
        <h4>Liner services calling ${esc(c.name)}</h4>
        <div class="chips">${svcs.map((s) => `<a class="chip" href="services#liner">${s.code} — ${esc(s.name)}</a>`).join('')}</div>
      </div></div>`;
    if (map) {
      const pts = c.ports.map((p) => [p.lat, p.lon]).concat(c.offices.map((o) => [o.lat, o.lon]));
      map.fitBounds(L.latLngBounds(pts).pad(0.6), { maxZoom: 7 });
    }
    if (!fromMap && window.innerWidth < 1000) $('#netMap').scrollIntoView({ behavior: 'smooth' });
  }

  $('#list').addEventListener('click', (e) => { const b = e.target.closest('[data-cc]'); if (b) select(b.dataset.cc); });
  $('#regions').addEventListener('click', (e) => { const b = e.target.closest('[data-r]'); if (!b) return; region = b.dataset.r; $$('#regions .chip').forEach((x) => x.classList.toggle('active', x === b)); renderList(); });
  let t; $('#q').addEventListener('input', (e) => { clearTimeout(t); t = setTimeout(() => { query = e.target.value.trim().toLowerCase(); renderList(); }, 120); });

  renderList();
  const initial = (location.hash.slice(1) || '').toUpperCase();
  select(SRV.country(initial) ? initial : 'AE', true);
};
