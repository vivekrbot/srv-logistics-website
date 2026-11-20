/* Home page */
SRV.init = function () {
  const { $, $$, esc, icon } = SRV;
  const D = SRV_DATA;

  /* Hero ship illustration (generated SVG) */
  (function ship() {
    const r = SRV.rng(7); const colors = ['#F28C28', '#0FA3B1', '#1A63B8', '#E2E8F0', '#C2410C', '#0B2545', '#F2B544', '#2F855A'];
    let boxes = '';
    for (let col = 0; col < 11; col++) {
      const h = 3 + Math.floor(r() * 3);
      for (let row = 0; row < h; row++) {
        const x = 120 + col * 46, y = 178 - (row + 1) * 26;
        const c = SRV.pick(r, colors);
        boxes += `<rect x="${x}" y="${y}" width="44" height="24" rx="2" fill="${c}"/><path d="M${x + 6} ${y + 4}v16M${x + 14} ${y + 4}v16M${x + 22} ${y + 4}v16M${x + 30} ${y + 4}v16M${x + 38} ${y + 4}v16" stroke="rgba(0,0,0,.15)" stroke-width="1.5"/>`;
      }
    }
    $('#heroArt').innerHTML = `<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 180 H770 L735 262 H95 Z" fill="#0B2545"/>
      <path d="M58 222 H752 L735 262 H95 Z" fill="#C2410C"/>
      <path d="M40 180 H770" stroke="#F28C28" stroke-width="4"/>
      <text x="560" y="210" font-family="Plus Jakarta Sans, Arial" font-weight="800" font-size="22" fill="#fff" letter-spacing="3">SRV</text>
      ${boxes}
      <rect x="640" y="70" width="70" height="110" fill="#F1F5F9"/><rect x="630" y="64" width="90" height="12" fill="#E2E8F0"/>
      <rect x="648" y="84" width="54" height="8" fill="#0B2545" opacity=".7"/><rect x="648" y="100" width="54" height="6" fill="#0B2545" opacity=".35"/><rect x="648" y="114" width="54" height="6" fill="#0B2545" opacity=".35"/>
      <rect x="690" y="36" width="18" height="30" fill="#0B2545"/><rect x="690" y="40" width="18" height="6" fill="#F28C28"/>
    </svg>`;
  })();

  /* Quick tools tabs */
  $$('.qt-tabs button').forEach((b) => b.addEventListener('click', () => {
    $$('.qt-tabs button').forEach((x) => { x.classList.toggle('active', x === b); x.setAttribute('aria-selected', x === b); });
    $$('.qt-panel').forEach((p) => p.classList.toggle('active', p.id === 'qt-' + b.dataset.tab));
  }));
  ['#qsFrom', '#qqFrom'].forEach((s) => ($(s).innerHTML = SRV.portOptions('INMAA')));
  ['#qsTo', '#qqTo'].forEach((s) => ($(s).innerHTML = SRV.portOptions('AEJEA')));
  $('#qsDate').value = SRV.isoDate(new Date());
  $('#qqType').innerHTML = D.CONTAINERS.map((c) => `<option value="${c.code}">${c.code} — ${c.name}</option>`).join('');
  $$('.qt-panel').forEach((f) => f.addEventListener('submit', (e) => {
    if (!SRV.validate(f)) { e.preventDefault(); return; }
    const from = f.querySelector('[name=from]'), to = f.querySelector('[name=to]');
    if (from && to && from.value === to.value) { e.preventDefault(); SRV.toast('Origin and destination must be different ports.', 'error'); }
  }));

  /* Services */
  const svcs = [
    ['ship', 'Ocean Freight – FCL', 'Full-container-load on 16 weekly services with dry, high-cube, reefer and special equipment.', 'fcl', ''],
    ['layers', 'LCL Consolidation', 'Weekly consolidation boxes from our CFS hubs in Chennai, Jebel Ali, Singapore and Rotterdam.', 'lcl', 'teal'],
    ['snow', 'Reefer & Cold Chain', 'Pharma, seafood, fruit and frozen cargo with live remote monitoring of temperature and humidity.', 'reefer', 'orange'],
    ['crane', 'Project & Break-bulk', 'Out-of-gauge, heavy-lift and turnkey project logistics for energy, infrastructure and mining.', 'project', ''],
    ['truck', 'Inland, Rail & Last Mile', 'Door-to-door haulage, double-stack rail and bonded trucking from port to plant.', 'inland', 'teal'],
    ['doc', 'Customs & Trade Compliance', 'Licensed brokerage, pre-filing and duty optimisation in every SRV country.', 'customs', 'orange']
  ];
  $('#svcGrid').innerHTML = svcs.map(([ic, t, d, id, c]) => `<a class="card hover card-link" href="services.html#${id}"><div class="icon-badge ${c}">${icon(ic)}</div><h3>${t}</h3><p class="muted">${d}</p><span class="link-arrow">Learn more</span></a>`).join('');

  /* HQ & OMC */
  const ae = SRV.country('AE').offices[0], ind = SRV.country('IN').offices[0];
  $('#hubCards').innerHTML = SRV.officeCard(ae, true) + SRV.officeCard(ind, false);

  /* Map */
  const map = SRV.makeMap($('#homeMap'), { dark: true, center: [18, 60], zoom: 2 });
  const legend = $('#svcLegend');
  const lines = {};
  if (map) {
    D.SERVICES.forEach((s) => {
      const pl = L.polyline(SRV.unwrap(SRV.coordsOf(s.rotation)), { color: s.color, weight: 2.5, opacity: .75 }).addTo(map).bindTooltip(`${s.code} · ${s.name}`, { sticky: true });
      lines[s.code] = pl;
    });
    SRV.PORT_LIST.forEach((p) => L.marker([p.lat, p.lon], { icon: SRV.pinIcon() }).addTo(map)
      .bindPopup(`<h4>${esc(p.name)}</h4><div>${esc(p.city)}, ${esc(p.country)} · <b>${p.locode}</b></div><div>~${p.teu}M TEU/yr · Draft ${p.depth} m</div><div style="margin-top:6px">Services: ${SRV.servicesAtPort(p.locode).map((s) => s.code).join(', ')}</div><a href="schedules.html?from=${p.locode}">Sailings from here →</a>`));
    SRV.allOffices().forEach((o) => {
      const hq = /Headquarters|Operations & Management/.test(o.type);
      L.marker([o.lat, o.lon], { icon: SRV.pinIcon(hq ? 'hq' : 'office'), zIndexOffset: hq ? 1000 : 500 }).addTo(map)
        .bindPopup(`<h4>${esc(o.name)}</h4><div><b>${esc(o.type)}</b></div><div>${esc(o.address)}</div><div>${esc(o.phone)}</div>`);
    });
  }
  legend.innerHTML = D.SERVICES.map((s) => `<button class="chip" data-svc="${s.code}" style="background:transparent;color:#cfe0f5;border-color:#1f3a63"><span class="dot" style="background:${s.color};margin-right:6px"></span>${s.code}</button>`).join('');
  legend.addEventListener('click', (e) => {
    const b = e.target.closest('[data-svc]'); if (!b || !map) return;
    const on = !b.classList.contains('active');
    $$('[data-svc]', legend).forEach((x) => x.classList.remove('active'));
    Object.entries(lines).forEach(([k, l]) => l.setStyle({ opacity: !on || k === b.dataset.svc ? .8 : .08, weight: on && k === b.dataset.svc ? 4 : 2.5 }));
    if (on) { b.classList.add('active'); map.fitBounds(lines[b.dataset.svc].getBounds(), { padding: [30, 30] }); }
  });

  /* Leadership teaser */
  const L1 = D.LEADERSHIP;
  $('#leaderTeaser').innerHTML = [L1.founder, L1.ceo].map((p, i) => `<div class="card person" style="flex-direction:row;gap:24px;align-items:flex-start">
      <div class="avatar ${i ? 'navy' : 'orange'}" style="flex-shrink:0">${esc(p.initials)}</div>
      <div><h3 style="margin-bottom:2px">${esc(p.name)}</h3><div class="role">${esc(p.role)}</div><div class="loc">${esc(p.location)}</div><p class="muted small" style="margin:0">${esc(p.bio.split('. ')[0])}.</p></div></div>`).join('');

  /* News */
  $('#newsGrid').innerHTML = D.NEWS.map((n) => `<article class="card news-card"><div class="news-thumb">${icon(n.tag === 'Fleet' ? 'ship' : n.tag === 'Digital' ? 'gauge' : n.tag === 'Corporate' ? 'users' : 'route')}</div><span class="badge">${esc(n.tag)}</span> <span class="date">${SRV.fmtDate(SRV.parseISO(n.date))}</span><h3>${esc(n.title)}</h3><p class="muted small">${esc(n.excerpt)}</p></article>`).join('');
  $$('.news-thumb svg').forEach((s) => { s.setAttribute('stroke', '#ffffff'); s.style.opacity = '.35'; });
};
