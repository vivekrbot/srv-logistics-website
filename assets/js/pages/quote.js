/* Instant quote & booking */
SRV.init = function () {
  const { $, $$, esc, icon } = SRV; const D = SRV_DATA;
  const form = $('#qForm');
  let mode = 'FCL', last = null;

  $('#from').innerHTML = SRV.portOptions(SRV.qs('from') || 'INMAA');
  $('#to').innerHTML = SRV.portOptions(SRV.qs('to') || 'AEJEA');
  $('#type').innerHTML = D.CONTAINERS.map((c) => `<option value="${c.code}">${c.code} — ${c.name}</option>`).join('');
  if (SRV.qs('type')) $('#type').value = SRV.qs('type');
  const minDate = SRV.isoDate(new Date());
  $('#date').min = minDate;
  $('#date').value = SRV.qs('date') && SRV.qs('date') >= minDate ? SRV.qs('date') : SRV.isoDate(SRV.addDays(new Date(), 3));

  $$('[data-mode]').forEach((b) => b.addEventListener('click', () => {
    mode = b.dataset.mode; $$('[data-mode]').forEach((x) => { x.classList.toggle('active', x === b); x.setAttribute('aria-checked', x === b); });
    $$('.fcl').forEach((e) => (e.hidden = mode !== 'FCL')); $$('.lcl').forEach((e) => (e.hidden = mode !== 'LCL'));
    $('#qty').toggleAttribute('data-req', mode === 'FCL'); calc();
  }));

  const THC = { 'Middle East': 180, 'South Asia': 120, 'Southeast Asia': 130, 'East Asia': 140, 'Oceania': 300, 'Africa': 220, 'Europe': 260, 'Americas': 380 };

  function calc() {
    const o = $('#from').value, d = $('#to').value;
    const out = $('#summary');
    if (!o || !d || o === d) { last = null; out.innerHTML = `<div class="empty" style="padding:24px">${icon('route')}<div>${o && o === d ? 'Origin and destination must be different.' : 'Select origin and destination to see a price.'}</div></div>`; return; }
    const route = SRV.route(o, d); if (!route) { last = null; out.innerHTML = '<div class="alert warn">No routing available. <a href="contact.html">Contact sales</a>.</div>'; return; }
    const sail = SRV.sailing(route, SRV.parseISO($('#date').value || minDate));
    const O = SRV.port(o), Dp = SRV.port(d);
    const nm = route.nm, legsF = 1 + 0.08 * (route.legs.length - 1);
    const lvl = $('#level').value, lvlF = lvl === 'priority' ? 1.15 : lvl === 'eco' ? 1.06 : 1;
    const haz = $('#haz').checked;
    const lines = []; let qty, unit, desc;
    if (mode === 'FCL') {
      const ct = D.CONTAINERS.find((c) => c.code === $('#type').value); qty = Math.max(1, Math.min(99, Number($('#qty').value) || 1));
      unit = ct.code; desc = `${qty} × ${ct.name}`;
      const ocean = Math.round((250 + nm * 0.115) * ct.factor * legsF * lvlF);
      const baf = Math.round(nm * 0.032 * ct.teu);
      const big = ct.teu > 1 ? 1.5 : 1;
      lines.push(['Ocean freight', ocean * qty, `${SRV.money(ocean)} / box`]);
      lines.push(['Bunker adjustment factor (BAF)', baf * qty, `${SRV.money(baf)} / box`]);
      if (ct.reefer) lines.push(['Reefer power & monitoring', 95 * qty, '']);
      lines.push([`Terminal handling — origin (${O.city})`, Math.round(THC[O.region] * big) * qty, '']);
      lines.push([`Terminal handling — destination (${Dp.city})`, Math.round(THC[Dp.region] * big) * qty, '']);
      lines.push(['ISPS & security', 15 * qty, '']);
      if (haz) lines.push(['Hazardous cargo surcharge', Math.round(ocean * 0.35) * qty, '']);
      if ($('#pickup').checked) lines.push(['Origin pick-up (trucking)', 220 * qty, '']);
      if ($('#delivery').checked) lines.push(['Destination delivery (trucking)', 260 * qty, '']);
      if ($('#free').checked) lines.push(['Extended free time (+7 days)', 85 * qty, '']);
    } else {
      const cbm = Math.max(0.5, Number($('#cbm').value) || 1), t = Math.max(0.001, (Number($('#kg').value) || 0) / 1000);
      const wm = Math.max(1, Math.round(Math.max(cbm, t) * 100) / 100); qty = wm; unit = 'LCL'; desc = `LCL ${cbm} m³ / ${SRV.num(Math.round(t * 1000))} kg (${wm} W/M)`;
      const rate = Math.round((18 + nm * 0.009) * legsF * lvlF * 100) / 100;
      lines.push(['Ocean freight (per W/M)', Math.round(rate * wm), `${SRV.money(rate)} × ${wm} W/M`]);
      lines.push(['CFS charges — origin', Math.round(22 * wm), '']);
      lines.push(['CFS charges — destination', Math.round(28 * wm), '']);
      if (haz) lines.push(['Hazardous cargo surcharge', Math.round(rate * wm * 0.35), '']);
      if ($('#pickup').checked) lines.push(['Origin pick-up', 120, '']);
      if ($('#delivery').checked) lines.push(['Destination delivery', 150, '']);
    }
    lines.push(['Documentation (B/L)', mode === 'FCL' ? 75 : 60, '']);
    if ($('#expcc').checked) lines.push(['Export customs clearance', 90, '']);
    if ($('#impcc').checked) lines.push(['Import customs clearance', 140, '']);
    if ($('#ins').checked) lines.push(['Cargo insurance (0.35%)', Math.max(35, Math.round((Number($('#value').value) || 0) * 0.0035)), '']);
    const total = lines.reduce((s, l) => s + l[1], 0);
    const co2 = Math.round(nm * 1.852 * (mode === 'FCL' ? D.CONTAINERS.find((c) => c.code === $('#type').value).teu * qty * 10 : qty * 0.6) * 0.0081 * (lvl === 'eco' ? 0.35 : 1));
    last = { from: o, to: d, date: $('#date').value, etd: SRV.isoDate(sail.etd), eta: SRV.isoDate(sail.eta), transit: sail.transit, vessel: sail.legs[0].vessel, voyage: sail.legs[0].voyage,
      services: route.legs.map((l) => l.service).join(' → '), mode, type: unit, qty, desc, level: lvl, haz, commodity: $('#commodity').value.trim(), lines, total, co2 };
    out.innerHTML = `
      <div class="route-line" style="margin-bottom:14px"><div class="route-pt"><strong>${esc(O.city)}</strong><span>${o}</span></div><div class="route-mid">${sail.transit} days<br>${route.direct ? 'Direct' : 'via ' + route.tranship.map((t) => SRV.port(t).city).join(', ')}</div><div class="route-pt" style="text-align:right"><strong>${esc(Dp.city)}</strong><span>${d}</span></div></div>
      <div class="kv" style="margin-bottom:12px"><div><span>Next sailing</span><strong>${SRV.fmtDay(sail.etd)}</strong></div><div><span>ETA</span><strong>${SRV.fmtDay(sail.eta)}</strong></div><div><span>Vessel</span><strong>${esc(sail.legs[0].vessel)}</strong></div><div><span>Service</span><strong>${last.services}</strong></div></div>
      <div class="small muted" style="margin-bottom:6px">${esc(desc)}</div>
      ${lines.map(([k, v, n]) => `<div class="price-row"><span>${esc(k)}${n ? `<br><span class="tiny muted">${n}</span>` : ''}</span><strong>${SRV.money(v)}</strong></div>`).join('')}
      <div class="price-total"><span>Total</span><span>${SRV.money(total)}</span></div>
      <div class="tiny muted" style="margin-bottom:16px">Estimated CO₂e: ${SRV.num(co2)} kg (well-to-wake)${lvl === 'eco' ? ' · GreenShip low-carbon fuel applied' : ''}</div>
      <div style="display:grid;gap:10px"><button class="btn btn-primary btn-block" id="book" type="button">${icon('send')}Book now</button><button class="btn btn-outline btn-block" id="save" type="button">Save quote</button></div>`;
    $('#book').addEventListener('click', book);
    $('#save').addEventListener('click', save);
  }

  function valid() {
    if (!SRV.validate(form)) { SRV.toast('Please complete the highlighted fields.', 'error'); return false; }
    if (!last) { SRV.toast('Please choose a valid route.', 'error'); return false; }
    return true;
  }

  function save() {
    if (!valid()) return;
    const q = Object.assign({ ref: SRV.refNo('Q-', 7), createdAt: Date.now(), validUntil: SRV.isoDate(SRV.addDays(new Date(), 14)) }, last);
    SRV.store.push('quotes', q); renderSaved();
    SRV.toast(`Quote ${q.ref} saved. Valid until ${SRV.fmtDate(SRV.parseISO(q.validUntil))}.`);
  }

  function book() {
    if (!valid()) return;
    const prof = SRV.store.get('profile', {}) || {};
    const m = SRV.modal('Confirm your booking', `
      <div class="alert info" style="margin-bottom:18px">${icon('ship')}<div><strong>${esc(SRV.port(last.from).name)} → ${esc(SRV.port(last.to).name)}</strong><br>${esc(last.desc)} · ETD ${SRV.fmtDate(SRV.parseISO(last.etd))} on ${esc(last.vessel)} · <strong>${SRV.money(last.total)}</strong></div></div>
      <form id="bForm" class="form-grid" novalidate>
        <div class="field"><label for="bName">Contact name</label><input id="bName" name="contact" class="input" data-req value="${esc(prof.name || '')}"></div>
        <div class="field"><label for="bCo">Company</label><input id="bCo" name="company" class="input" data-req value="${esc(prof.company || '')}"></div>
        <div class="field"><label for="bEmail">Email</label><input id="bEmail" name="email" type="email" class="input" data-req value="${esc(prof.email || '')}"></div>
        <div class="field"><label for="bPhone">Phone</label><input id="bPhone" name="phone" class="input" data-req data-pattern="^[+0-9 ()-]{7,20}$" data-msg="Enter a valid phone number." value="${esc(prof.phone || '')}"></div>
        <div class="field full"><label for="bNotes">Shipper / consignee details &amp; special instructions</label><textarea id="bNotes" name="notes" class="input" style="min-height:90px"></textarea></div>
        <div class="field full"><label class="check"><input type="checkbox" name="terms" data-req> I accept the SRV <a href="legal.html#bl-terms" target="_blank">bill of lading terms</a> and <a href="legal.html#terms" target="_blank">booking conditions</a>.</label></div>
        <div class="full" style="display:flex;gap:10px;justify-content:flex-end"><button type="button" class="btn btn-outline" onclick="SRV.closeModal()">Cancel</button><button class="btn btn-primary" type="submit">Submit booking</button></div>
      </form>`);
    m.querySelector('#bForm').addEventListener('submit', (e) => {
      e.preventDefault(); const f = e.target; if (!SRV.validate(f)) return;
      const data = SRV.formData(f);
      const b = Object.assign({}, last, { ref: SRV.refNo('SRVB'), status: 'Pending confirmation', createdAt: Date.now(), contact: data.contact, company: data.company, email: data.email, phone: data.phone, notes: data.notes });
      SRV.store.push('bookings', b);
      SRV.store.set('profile', Object.assign(prof, { name: data.contact, company: data.company, email: data.email, phone: data.phone }));
      m.querySelector('.modal-body').innerHTML = `<div style="text-align:center;padding:12px 0">
        <div class="icon-badge teal" style="width:72px;height:72px;margin:0 auto 16px">${icon('checkCircle')}</div>
        <h2 style="font-size:1.6rem">Booking request received</h2>
        <p class="muted">Your booking reference is</p><div class="mono" style="font-size:1.8rem;font-weight:800;color:var(--blue-600);margin-bottom:12px">${b.ref}</div>
        <p class="small muted">Confirmation and the equipment release order will be emailed to <strong>${esc(b.email)}</strong> within 4 working hours by the Chennai Operations &amp; Management Centre.</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:18px"><a class="btn btn-blue" href="tracking.html?id=${b.ref}">Track booking</a><a class="btn btn-outline" href="portal.html">Go to portal</a></div></div>`;
    });
  }

  function renderSaved() {
    const qs = SRV.store.get('quotes', []).slice(0, 4);
    $('#saved').innerHTML = qs.length ? qs.map((q) => `<div class="price-row" style="align-items:center"><span><strong class="mono">${q.ref}</strong><br><span class="tiny muted">${esc(SRV.port(q.from).city)} → ${esc(SRV.port(q.to).city)} · ${esc(q.desc)}</span></span><span style="text-align:right"><strong>${SRV.money(q.total)}</strong><br><a class="tiny" href="quote.html?from=${q.from}&to=${q.to}&date=${q.date}${q.mode === 'FCL' ? '&type=' + q.type : ''}">Re-quote</a></span></div>`).join('')
      : '<p class="small muted" style="margin:12px 0">No saved quotes yet.</p>';
  }

  form.addEventListener('input', calc); form.addEventListener('change', calc);
  calc(); renderSaved();
};
