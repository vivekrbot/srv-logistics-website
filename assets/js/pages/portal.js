/* Customer portal. Data is held in browser storage until a back-end account service is connected. */
SRV.init = function () {
  const { $, $$, esc, icon } = SRV;
  const app = $('#app');
  let tab = SRV.qs('tab') || 'bookings';

  const profile = () => SRV.store.get('profile', {}) || {};
  const signedIn = () => !!profile().signedIn;

  function signIn() {
    $('#hello').textContent = 'Sign in to myPortal';
    $('#heroActions').innerHTML = '';
    const p = profile();
    app.innerHTML = `<div class="grid two-col">
      <div class="panel"><div class="panel-head"><h3>Sign in</h3></div><div class="panel-body">
        <form id="siForm" class="form-grid" novalidate>
          <div class="field"><label for="sName">Full name</label><input id="sName" name="name" class="input" data-req value="${esc(p.name || '')}" autocomplete="name"></div>
          <div class="field"><label for="sCo">Company</label><input id="sCo" name="company" class="input" data-req value="${esc(p.company || '')}" autocomplete="organization"></div>
          <div class="field full"><label for="sEmail">Business email</label><input id="sEmail" name="email" type="email" class="input" data-req value="${esc(p.email || '')}" autocomplete="email"></div>
          <div class="field full"><label for="sPw">Password</label><input id="sPw" name="pw" type="password" class="input" data-req data-pattern="^.{6,}$" data-msg="Use at least 6 characters." autocomplete="current-password"></div>
          <div class="full"><button class="btn btn-primary btn-block" type="submit">Sign in</button></div>
        </form></div></div>
      <div class="card"><h3>What you can do in myPortal</h3><ul class="feature-list">
        <li>${icon('checkCircle')}<span>Manage online bookings and see their confirmation status</span></li>
        <li>${icon('checkCircle')}<span>Re-use saved quotes and convert them into bookings</span></li>
        <li>${icon('checkCircle')}<span>Follow your containers on a single dashboard</span></li>
        <li>${icon('checkCircle')}<span>Keep track of enquiries sent to SRV offices</span></li></ul>
        <a class="link-arrow" href="quote">Or get a quote without signing in</a></div></div>`;
    $('#siForm').addEventListener('submit', (e) => {
      e.preventDefault(); if (!SRV.validate(e.target)) return;
      const d = SRV.formData(e.target);
      SRV.store.set('profile', Object.assign(profile(), { name: d.name, company: d.company, email: d.email, signedIn: true }));
      SRV.toast(`Welcome, ${esc(d.name)}.`); render();
    });
  }

  function statusBadge(s) { return `<span class="badge ${s === 'Cancelled' ? 'red' : s === 'Pending confirmation' ? 'amber' : s === 'Sailed' ? 'teal' : 'green'}">${esc(s)}</span>`; }

  function dashboard() {
    const p = profile();
    const bookings = SRV.store.get('bookings', []); const quotes = SRV.store.get('quotes', []); const watch = SRV.store.get('watch', []);
    const enq = SRV.store.get('enquiries', []); const apps = SRV.store.get('applications', []);
    const active = bookings.filter((b) => !['Cancelled', 'Sailed'].includes(SRV.bookingStatus(b))).length;
    $('#hello').textContent = `Welcome, ${p.name.split(' ')[0]}`;
    $('#heroActions').innerHTML = `<a class="btn btn-primary" href="quote">${icon('send')}New booking</a>`;
    app.innerHTML = `
      <div class="grid g-4" style="margin-bottom:28px">
        <div class="kpi"><div class="v">${active}</div><div class="l">Active bookings</div></div>
        <div class="kpi"><div class="v">${quotes.length}</div><div class="l">Saved quotes</div></div>
        <div class="kpi"><div class="v">${watch.length}</div><div class="l">Tracked shipments</div></div>
        <div class="kpi"><div class="v">${SRV.money(bookings.filter((b) => SRV.bookingStatus(b) !== 'Cancelled').reduce((a, b) => a + b.total, 0))}</div><div class="l">Booked freight value</div></div>
      </div>
      <div class="tabs" role="tablist">${[['bookings', 'Bookings', bookings.length], ['quotes', 'Quotes', quotes.length], ['shipments', 'My shipments', watch.length], ['enquiries', 'Enquiries', enq.length + apps.length], ['profile', 'Profile']].map(([k, l, n]) => `<button role="tab" data-tab="${k}" class="${tab === k ? 'active' : ''}" aria-selected="${tab === k}">${l}${n != null ? ` <span class="badge gray">${n}</span>` : ''}</button>`).join('')}</div>
      <div id="tabBody"></div>`;
    $$('[data-tab]').forEach((b) => b.addEventListener('click', () => { tab = b.dataset.tab; history.replaceState(null, '', '?tab=' + tab); dashboard(); }));
    ({ bookings: tBookings, quotes: tQuotes, shipments: tShip, enquiries: tEnq, profile: tProfile })[tab]();
  }

  const empty = (ic, msg, cta) => `<div class="panel"><div class="empty">${icon(ic)}<div style="margin-bottom:14px">${msg}</div>${cta || ''}</div></div>`;
  const route = (o, d) => `${esc(SRV.port(o).city)} <span class="muted">→</span> ${esc(SRV.port(d).city)}<div class="tiny muted">${o} → ${d}</div>`;

  function tBookings() {
    const list = SRV.store.get('bookings', []);
    $('#tabBody').innerHTML = !list.length ? empty('calendar', 'No bookings yet.', '<a class="btn btn-primary" href="quote">Make your first booking</a>') :
      `<div class="table-wrap"><table class="table"><thead><tr><th>Reference</th><th>Route</th><th>Sailing</th><th>Cargo</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody>${list.map((b) => {
        const st = SRV.bookingStatus(b);
        return `<tr><td class="mono"><strong>${b.ref}</strong><div class="tiny muted">${SRV.fmtDate(b.createdAt)}</div></td><td>${route(b.from, b.to)}</td><td class="small">ETD ${SRV.fmtDate(SRV.parseISO(b.etd))}<br>${esc(b.vessel)} <span class="mono tiny">${b.voyage}</span></td><td class="small">${esc(b.desc)}<br><span class="muted">${esc(b.commodity)}</span></td><td><strong>${SRV.money(b.total)}</strong></td><td>${statusBadge(st)}</td>
          <td class="nowrap"><a class="btn btn-outline btn-sm" href="tracking?id=${b.ref}">Track</a> ${['Cancelled', 'Sailed'].includes(st) ? '' : `<button class="btn btn-sm" style="color:var(--red-600)" data-cancel="${b.ref}">Cancel</button>`}</td></tr>`;
      }).join('')}</tbody></table></div>`;
    $$('[data-cancel]').forEach((btn) => btn.addEventListener('click', () => {
      if (!confirm(`Cancel booking ${btn.dataset.cancel}? Cancellation fees may apply after equipment release.`)) return;
      SRV.store.set('bookings', SRV.store.get('bookings', []).map((b) => (b.ref === btn.dataset.cancel ? Object.assign(b, { status: 'Cancelled' }) : b)));
      SRV.toast(`Booking ${btn.dataset.cancel} cancelled.`); dashboard();
    }));
  }

  function tQuotes() {
    const list = SRV.store.get('quotes', []); const today = SRV.isoDate(new Date());
    $('#tabBody').innerHTML = !list.length ? empty('dollar', 'No saved quotes.', '<a class="btn btn-primary" href="quote">Get a quote</a>') :
      `<div class="table-wrap"><table class="table"><thead><tr><th>Quote</th><th>Route</th><th>Cargo</th><th>Transit</th><th>Total</th><th>Valid until</th><th></th></tr></thead><tbody>${list.map((q) => `<tr>
        <td class="mono"><strong>${q.ref}</strong></td><td>${route(q.from, q.to)}</td><td class="small">${esc(q.desc)}</td><td>${q.transit} days</td><td><strong>${SRV.money(q.total)}</strong></td>
        <td>${q.validUntil < today ? '<span class="badge red">Expired</span>' : SRV.fmtDate(SRV.parseISO(q.validUntil))}</td>
        <td class="nowrap"><a class="btn btn-primary btn-sm" href="quote?from=${q.from}&to=${q.to}&date=${q.date}${q.mode === 'FCL' ? '&type=' + q.type : ''}">${q.validUntil < today ? 'Re-quote' : 'Book'}</a> <button class="btn btn-sm" data-delq="${q.ref}" aria-label="Delete quote ${q.ref}">${icon('trash')}</button></td></tr>`).join('')}</tbody></table></div>`;
    $$('[data-delq]').forEach((b) => b.addEventListener('click', () => { SRV.store.set('quotes', SRV.store.get('quotes', []).filter((q) => q.ref !== b.dataset.delq)); SRV.toast('Quote deleted.'); dashboard(); }));
  }

  function tShip() {
    const w = SRV.store.get('watch', []);
    const rows = w.map((id) => ({ id, s: SRV.shipment(id) })).filter((x) => !x.s.error);
    $('#tabBody').innerHTML = `<form id="addW" class="panel" style="margin-bottom:18px" novalidate><div class="panel-body"><div class="qt-row two"><div class="field"><label for="wid">Add a container, B/L or booking to your dashboard</label><input id="wid" class="input mono" data-req placeholder="Container, B/L or booking number" style="text-transform:uppercase"></div><button class="btn btn-blue" type="submit">Add</button></div></div></form>` +
      (!rows.length ? empty('box', 'You are not tracking any shipments yet.') :
      `<div class="table-wrap"><table class="table"><thead><tr><th>Reference</th><th>Route</th><th>Status</th><th>ETA</th><th>Progress</th><th></th></tr></thead><tbody>${rows.map(({ id, s }) => {
        const label = s.status ? s.status.label : SRV.bookingStatus(s.booking); const pct = s.status ? s.status.pct : 5;
        return `<tr><td class="mono"><strong>${esc(id)}</strong></td><td>${route(s.route.origin, s.route.destination)}</td><td class="small">${esc(label)}</td><td>${SRV.fmtDate(s.sail.eta)}</td><td style="min-width:120px"><div class="progress"><span style="width:${pct}%"></span></div><div class="tiny muted">${pct}%</div></td>
          <td class="nowrap"><a class="btn btn-outline btn-sm" href="tracking?id=${encodeURIComponent(id)}">Details</a> <button class="btn btn-sm" data-delw="${esc(id)}" aria-label="Stop tracking ${esc(id)}">${icon('trash')}</button></td></tr>`;
      }).join('')}</tbody></table></div>`);
    $('#addW').addEventListener('submit', (e) => {
      e.preventDefault(); if (!SRV.validate(e.target)) return;
      const s = SRV.shipment($('#wid').value);
      if (s.error) { SRV.toast(s.error.kind === 'container' ? `Check digit mismatch. Did you mean ${s.error.suggestion}?` : 'Unrecognised reference format.', 'error'); return; }
      const list = SRV.store.get('watch', []); if (!list.includes(s.id)) list.unshift(s.id); SRV.store.set('watch', list); SRV.toast(`${s.id} added.`); dashboard();
    });
    $$('[data-delw]').forEach((b) => b.addEventListener('click', () => { SRV.store.set('watch', SRV.store.get('watch', []).filter((x) => x !== b.dataset.delw)); dashboard(); }));
  }

  function tEnq() {
    const enq = SRV.store.get('enquiries', []), apps = SRV.store.get('applications', []);
    $('#tabBody').innerHTML = `<div class="grid g-2">
      <div class="panel"><div class="panel-head"><h3>Enquiries</h3><a class="small" href="contact">New enquiry →</a></div><div class="panel-body">${enq.length ? enq.map((q) => `<div class="price-row"><span><strong class="mono">${q.ticket}</strong> · ${esc(q.type)}<br><span class="tiny muted">${esc(q.office)} · ${SRV.fmtDateTime(q.at)}</span></span><span class="badge amber">Open</span></div>`).join('') : '<p class="muted small">No enquiries yet.</p>'}</div></div>
      <div class="panel"><div class="panel-head"><h3>Job applications</h3><a class="small" href="careers">Careers →</a></div><div class="panel-body">${apps.length ? apps.map((a) => `<div class="price-row"><span><strong>${esc(a.title)}</strong><br><span class="tiny muted mono">${a.ref} · ${SRV.fmtDate(a.at)}</span></span><span class="badge">Under review</span></div>`).join('') : '<p class="muted small">No applications yet.</p>'}</div></div></div>`;
  }

  function tProfile() {
    const p = profile();
    $('#tabBody').innerHTML = `<div class="grid two-col"><div class="panel"><div class="panel-head"><h3>Company profile</h3></div><div class="panel-body"><form id="pForm" class="form-grid" novalidate>
        <div class="field"><label for="pName">Full name</label><input id="pName" name="name" class="input" data-req value="${esc(p.name || '')}"></div>
        <div class="field"><label for="pCo">Company</label><input id="pCo" name="company" class="input" data-req value="${esc(p.company || '')}"></div>
        <div class="field"><label for="pEmail">Email</label><input id="pEmail" name="email" type="email" class="input" data-req value="${esc(p.email || '')}"></div>
        <div class="field"><label for="pPhone">Phone</label><input id="pPhone" name="phone" class="input" value="${esc(p.phone || '')}" data-pattern="^[+0-9 ()-]{7,20}$" data-msg="Enter a valid phone number."></div>
        <div class="field full"><label for="pTax">Tax ID / GSTIN / TRN (optional)</label><input id="pTax" name="tax" class="input" value="${esc(p.tax || '')}"></div>
        <div class="full"><button class="btn btn-primary" type="submit">Save profile</button></div></form></div></div>
      <div class="panel"><div class="panel-head"><h3>Account</h3></div><div class="panel-body">
        <p class="small muted">Your data is stored only in this browser.</p>
        <div style="display:grid;gap:10px"><button class="btn btn-outline" id="so">${icon('logout')}Sign out</button><button class="btn" style="color:var(--red-600);border-color:var(--red-100)" id="wipe">${icon('trash')}Delete all my data from this browser</button></div></div></div></div>`;
    $('#pForm').addEventListener('submit', (e) => { e.preventDefault(); if (!SRV.validate(e.target)) return; SRV.store.set('profile', Object.assign(profile(), SRV.formData(e.target))); SRV.toast('Profile saved.'); dashboard(); });
    $('#so').addEventListener('click', () => { SRV.store.set('profile', Object.assign(profile(), { signedIn: false })); tab = 'bookings'; render(); });
    $('#wipe').addEventListener('click', () => {
      if (!confirm('Delete all bookings, quotes, tracked shipments, enquiries and your profile from this browser? This cannot be undone.')) return;
      ['profile', 'bookings', 'quotes', 'watch', 'enquiries', 'applications', 'recent', 'alerts'].forEach((k) => { try { localStorage.removeItem('srv_' + k); } catch (e) { /* storage unavailable */ } });
      SRV.toast('All data deleted.'); tab = 'bookings'; render();
    });
  }

  function render() { signedIn() ? dashboard() : signIn(); }
  render();
};
