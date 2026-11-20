# SRV Logistics and Shipping Corporation Pvt Ltd — Website

Corporate website and digital tools for **SRV Logistics and Shipping Corporation Pvt Ltd**.

- **Global Headquarters:** Jebel Ali Free Zone, Jebel Ali Port, Dubai, UAE
- **Operations & Management Centre:** Chennai Port, Rajaji Salai, Chennai, Tamil Nadu, India
- **Network:** 32 countries, 55 ports, 16 weekly liner services, 20 vessels

## Running it

It is a static site with no build step and no dependencies to install.

- **Quickest:** double-click `index.html`.
- **Recommended (local web server):**
  ```bash
  npx serve .            # or
  python -m http.server 8080
  ```
  Then open http://localhost:8080.

Maps (Leaflet + Esri basemaps) and web fonts load from CDNs, so they need an internet connection. Everything else works offline, and the pages show a fallback message where a map would be.

## Pages

| Page | What it does |
|---|---|
| `index.html` | Home: hero, quick Track / Schedule / Quote tools, stats, services, HQ & OMC, live network map, leadership, news |
| `about.html` | Company story, Dubai HQ & Chennai OMC, mission and values, milestones, sustainability, certifications |
| `leadership.html` | Director, CEO, full Board (incl. 3 international independent directors), committees, regional heads |
| `services.html` | FCL, LCL, reefer, project cargo, sea-air, inland, customs, warehousing, digital; liner services; equipment specs |
| `network.html` | 32-country directory: searchable, filterable by region, map, office cards, port details, port directory |
| `schedules.html` | Point-to-point schedules with transhipment routing, vessels, voyages, cut-offs, route map, CSV export |
| `tracking.html` | Track & Trace for containers (ISO 6346 check-digit validation), B/Ls and bookings; milestones and live vessel position |
| `quote.html` | Instant all-in pricing for FCL and LCL with add-ons; save quotes; book online (generates an `SRVB…` reference) |
| `fleet.html` | Vessel particulars, filters, and estimated live fleet positions |
| `careers.html` | Job search and filters, with an application form |
| `contact.html` | HQ and OMC, contact form (generates a ticket), FAQs, full office directory |
| `portal.html` | Customer portal: bookings (cancel / track), saved quotes, tracked shipments, enquiries, profile |
| `legal.html` | Privacy, terms, B/L terms summary, cookies, compliance |

## Project structure

```
assets/
  css/style.css          Design system (tokens, components, responsive rules)
  img/favicon.svg
  js/data.js             ALL company content: site info, leadership, countries/offices/ports,
                         liner services, sea-lane waypoints, fleet, jobs, news, equipment
  js/core.js             Shared header/footer, icons, utilities, storage, sea-routing engine, maps
  js/shipment.js         Tracking model (deterministic demo journeys + local bookings)
  js/pages/*.js          Page-specific logic
*.html                   Pages
```

### Editing content

Almost everything lives in `assets/js/data.js`:

- **Company / HQ / OMC details:** `SITE`
- **Directors and Board:** `LEADERSHIP`
- **Countries, offices and ports:** `COUNTRIES` (each port: UN/LOCODE, coordinates, approximate TEU, draft, terminals)
- **Liner services:** `SERVICES`. A `rotation` lists port LOCODEs plus `~WAYPOINT` keys, which keep routes at sea (Suez, Cape, Malacca, …). Schedules, quotes and tracking all derive from these rotations automatically.
- **Fleet, jobs, news, equipment:** `FLEET`, `JOBS`, `NEWS`, `CONTAINERS`

## How the "live" features work

There is no backend. All functionality runs in the browser:

- **Routing:** a shortest-path search over the service rotations (up to 4 legs, with a 3-day transhipment dwell) gives the route, distance and transit time. Every pair of the 55 ports is routable.
- **Schedules:** each service sails weekly on a fixed day. Departure days, vessels and voyage numbers are derived from the rotation.
- **Tracking:** any valid container or B/L number produces a deterministic, realistic journey (the same number always gives the same result). Bookings made on `quote.html` are tracked from local data. Test numbers covering every shipment status are listed in `SAMPLE-TRACKING-NUMBERS.txt`. This is an internal QA file: **do not upload it to the live server**.
- **Storage:** quotes, bookings, watch-lists, enquiries, applications and the portal profile are stored in `localStorage` (prefix `srv_`). They can be cleared from *myPortal → Profile*.

To go live, connect forms and bookings to real back-office systems (e.g., a booking API, CRM or email service) by replacing the `SRV.store` calls in the page scripts.

## Data disclaimer

- **Real:** port names, UN/LOCODEs, coordinates, and the general characteristics of ports and terminals. Throughput figures are approximate.
- **Mock / placeholder:** all office addresses, phone numbers, email addresses, managers, vessel names, IMO numbers, voyages, prices, jobs, news, certifications and statistics. Verify and replace them before publishing. US numbers use the fictional 555-01xx range.
- The texts in `legal.html` are templates and need review by counsel.
