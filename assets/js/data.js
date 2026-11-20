/* ==========================================================================
   SRV Logistics and Shipping Corporation Pvt Ltd — master data
   Single source of truth for site content. Verify office addresses, phone
   numbers and contacts before go-live. Port names, UN/LOCODEs and coordinates
   are real; throughput volumes are approximate.
   ========================================================================== */
(function () {
  'use strict';

  const SITE = {
    name: 'SRV Logistics and Shipping Corporation Pvt Ltd',
    short: 'SRV Logistics & Shipping',
    brand: 'SRV',
    domain: 'srvlogistics.com',
    founded: 2008,
    tagline: 'Connecting the Gulf, India and the world — one container at a time.',
    hq: {
      label: 'Global Headquarters',
      city: 'Dubai, UAE',
      address: 'Office 1407, JAFZA One – Tower B, Jebel Ali Free Zone (Gate 5), Jebel Ali Port, P.O. Box 263511, Dubai, United Arab Emirates',
      phone: '+971 4 887 2600',
      email: 'hq@srvlogistics.com',
      hours: 'Sun–Thu 08:00–18:00 GST',
      lat: 25.0112, lon: 55.0620
    },
    omc: {
      label: 'Operations & Management Centre',
      city: 'Chennai, India',
      address: 'SRV Operations & Management Centre, 4th Floor, Port Users’ Complex, No. 1 Rajaji Salai, Chennai Port, Chennai – 600 001, Tamil Nadu, India',
      phone: '+91 44 2536 7800',
      email: 'omc@srvlogistics.com',
      hours: '24 × 7 × 365 (Global Operations Desk)',
      lat: 13.0980, lon: 80.2930
    },
    support: { phone: '+971 4 887 2699', email: 'support@srvlogistics.com', whatsapp: '+91 44 2536 7899' },
    social: { linkedin: '#', x: '#', youtube: '#', instagram: '#' }
  };

  /* ---------------- Leadership ---------------- */
  const LEADERSHIP = {
    founder: {
      name: 'K Ramachandran', title: 'Director', role: 'Founding Director & Chairman of the Board',
      location: 'Dubai, UAE', initials: 'KR',
      bio: 'Founded SRV in 2008 with a single chartered feeder vessel between Jebel Ali and Chennai. With more than three decades in liner shipping, port agency and freight forwarding across the Gulf and South Asia, K Ramachandran sets the long-term vision of the group, chairs the Board and leads relationships with port authorities, governments and strategic partners.',
      focus: ['Group strategy & vision', 'Board governance', 'Port authority & government relations', 'Strategic alliances']
    },
    ceo: {
      name: 'R Anand Muthusamy', title: 'Chief Executive Officer', role: 'Chief Executive Officer & Executive Director',
      location: 'Dubai, UAE / Chennai, India', initials: 'AM',
      bio: 'R Anand Muthusamy leads SRV’s global business across 32 countries — from the Dubai headquarters to the Operations & Management Centre at Chennai Port. Under this leadership SRV expanded from a regional feeder operator into an integrated container shipping and logistics group with its own liner services, inland network and digital platform.',
      focus: ['Global P&L and commercial growth', 'Network & liner service design', 'Digital transformation', 'Decarbonisation roadmap']
    },
    board: [
      { name: 'R Divya', title: 'Director', role: 'Director — Finance, Risk & Corporate Strategy', location: 'Chennai, India', initials: 'RD', country: 'India',
        bio: 'Oversees group finance, treasury, risk management and corporate strategy, including fleet investment decisions and the group’s capital allocation framework.' },
      { name: 'R Vivek', title: 'Director', role: 'Director — Operations, Fleet & Technology', location: 'Chennai, India', initials: 'RV', country: 'India',
        bio: 'Leads the Chennai Operations & Management Centre, vessel operations, equipment control and the SRV digital platform that powers tracking, booking and documentation.' },
      { name: 'Pooja', title: 'Director', role: 'Director — Commercial & Customer Experience', location: 'Dubai, UAE', initials: 'P', country: 'India',
        bio: 'Responsible for global sales, key accounts, pricing and the customer experience programme spanning every SRV office and agency worldwide.' },
      { name: 'Khalid Al Mansoori', title: 'Independent Director', role: 'Independent Director — Gulf & Middle East Affairs', location: 'Abu Dhabi, UAE', initials: 'KM', country: 'United Arab Emirates',
        bio: 'Brings extensive experience in Gulf port development, free-zone regulation and maritime policy. Chairs the Board’s Governance & Compliance Committee.' },
      { name: 'Hendrik van der Berg', title: 'Independent Director', role: 'Independent Director — Europe & Sustainability', location: 'Rotterdam, Netherlands', initials: 'HB', country: 'Netherlands',
        bio: 'A veteran of North European terminal operations and green-corridor programmes. Chairs the Board’s Sustainability & Safety Committee.' },
      { name: 'Mei Ling Tan', title: 'Independent Director', role: 'Independent Director — Asia-Pacific & Audit', location: 'Singapore', initials: 'MT', country: 'Singapore',
        bio: 'A chartered accountant with a background in maritime finance and trade digitalisation across ASEAN. Chairs the Board’s Audit Committee.' }
    ],
    committees: [
      { name: 'Audit Committee', chair: 'Mei Ling Tan', members: ['R Divya', 'Khalid Al Mansoori'] },
      { name: 'Governance & Compliance Committee', chair: 'Khalid Al Mansoori', members: ['K Ramachandran', 'Mei Ling Tan'] },
      { name: 'Sustainability & Safety Committee', chair: 'Hendrik van der Berg', members: ['R Vivek', 'R Anand Muthusamy'] },
      { name: 'Nomination & Remuneration Committee', chair: 'K Ramachandran', members: ['Pooja', 'Hendrik van der Berg'] }
    ]
  };

  /* ---------------- Sea-lane waypoints (for routing & map lines) ---------------- */
  const WAYPOINTS = {
    KHOR: [26.4, 51.6], HORMUZ: [26.5, 56.4], HADD: [22.7, 60.2], MASIRAH: [20.0, 59.2], MADRAKAH: [17.5, 56.5], SAL_E: [16.8, 56.0],
    GUARDAFUI: [12.4, 52.0], BAB: [12.6, 43.4], REDN: [27.3, 34.3], SUEZ: [29.8, 32.6], DELTA: [31.75, 31.0], CYPRUS_E: [34.3, 35.0],
    SICILY: [37.4, 11.6], ALGERIA: [37.6, 6.5], GATA: [36.6, -2.1], PALOS: [37.5, -0.5], NAO: [38.7, 0.6], STRAIT_W: [35.95, -6.1],
    STVINCENT: [36.7, -9.6], FINISTERRE: [43.4, -10.0], USHANT: [48.5, -5.6], COTENTIN: [49.9, -2.2], DOVER: [51.0, 1.5], FORELAND: [51.4, 1.65], LIZARD: [49.7, -5.5],
    NL_N: [53.5, 4.6], HELGOLAND: [54.0, 8.0], CUXHAVEN: [53.88, 8.7], SCHELDT: [51.42, 3.6], ZEEL: [51.6, 3.3],
    MALEA: [36.3, 23.4], MATAPAN: [36.1, 22.4], MALTA: [35.6, 14.3], SARD_S: [38.5, 9.0], TYRRH1: [39.0, 10.1], TYRRH2: [41.5, 10.1], LIGURIAN: [43.4, 9.7],
    SARONIC: [37.65, 23.75], KEA: [37.6, 24.4], CAFIREAS: [38.4, 25.2], LESBOS_W: [39.6, 25.6], DARDANELLES: [40.03, 26.18], GALLIPOLI: [40.4, 26.7], MARMARA: [40.75, 27.9],
    NANTUCKET: [40.3, -69.5], AMBROSE: [40.45, -73.8], HATTERAS: [35.0, -74.8], FL_E: [26.5, -79.6], FL_KEYS: [24.2, -82.5], GALV: [28.9, -94.5],
    MOR1: [33.5, -9.5], CANARY: [28.0, -13.3], SAHARA: [24.0, -16.6], CBLANC: [20.5, -17.6], DAKAR: [14.6, -17.9], GUINEA: [10.0, -16.5], SLEONE: [7.5, -14.0], PALMAS: [4.0, -7.5], GHANA: [4.5, -1.5],
    NATAL: [-5.0, -34.6], RECIFE: [-9.0, -34.5], ARACAJU: [-13.5, -38.0], ABROLHOS: [-18.0, -38.5], CFRIO: [-23.2, -42.0],
    KUTCH: [22.7, 68.8], SAUR1: [21.3, 68.8], SAUR2: [20.4, 70.8], GOA: [15.0, 73.4], KANNUR: [12.0, 74.6], COMORIN: [7.6, 77.0], MANNAR: [8.2, 78.4],
    LK_SW: [6.3, 79.75], LK_S: [5.65, 80.4], LK_SE: [5.9, 81.9], LK_E: [8.0, 82.0], ACEH: [6.3, 94.8], SAGAR: [21.3, 88.1],
    SCS: [11.0, 110.0], TWS: [25.0, 120.2], CAMAU: [8.0, 104.6], VN_E: [12.5, 109.9], VN_C: [16.5, 108.9], QZ1: [20.15, 110.0], QZ2: [20.3, 110.9],
    KR_S: [33.0, 127.8], JP1: [29.6, 131.0], JP2: [33.0, 136.2], JP3: [34.4, 139.4], URAGA: [35.2, 139.75], TSUGARU_W: [41.3, 139.8], TSUGARU_E: [41.45, 141.6],
    BANGKA: [-2.4, 107.0], SUNDA1: [-5.85, 105.8], SUNDA2: [-6.6, 105.0], IO_W: [-22.0, 111.5], LEEUWIN: [-35.4, 114.8], OTWAY: [-39.2, 143.5], PHILLIP: [-38.35, 144.65], WILSON: [-39.4, 146.4], GABO: [-37.6, 150.5],
    MOZ_N: [-11.5, 42.5], MOZ_S: [-26.0, 34.0], CAPE: [-35.2, 19.0], MADA_S: [-27.0, 46.0]
  };

  /* ---------------- Liner services ----------------
     rotation: port LOCODEs, or '~KEY' for a sea-lane waypoint. Services sail both directions. */
  const SERVICES = [
    { code: 'GIX', name: 'Gulf–India Express', day: 0, color: '#0FA3B1', ships: 4,
      desc: 'Weekly fixed-day loop linking the UAE and Oman with every major Indian gateway, Colombo and Chennai.',
      rotation: ['AEKHL', 'AEJEA', '~HORMUZ', 'OMSOH', '~HADD', '~KUTCH', 'INMUN', '~KUTCH', '~SAUR1', '~SAUR2', 'INNSA', '~GOA', '~KANNUR', 'INCOK', '~COMORIN', '~MANNAR', 'INTUT', '~MANNAR', '~LK_SW', 'LKCMB', '~LK_SW', '~LK_S', '~LK_SE', '~LK_E', 'INMAA', 'INENR'] },
    { code: 'BBX', name: 'Bay of Bengal Express', day: 2, color: '#7C5CFF', ships: 3,
      desc: 'East-coast India and Bangladesh connected to the Straits hubs of Port Klang and Singapore.',
      rotation: ['INMAA', 'INVTZ', '~SAGAR', 'INCCU', '~SAGAR', 'BDCGP', '~ACEH', 'MYPKG', 'SGSIN'] },
    { code: 'CSX', name: 'Chennai–Straits–China', day: 3, color: '#F28C28', ships: 5,
      desc: 'Direct Chennai connection to Malaysia, Singapore, Vietnam, South China, Ningbo, Shanghai and Busan.',
      rotation: ['INMAA', '~ACEH', 'MYPKG', 'MYTPP', 'SGSIN', 'VNCMT', '~SCS', 'CNYTN', '~TWS', 'CNNGB', 'CNSHA', 'KRPUS'] },
    { code: 'AEX', name: 'Asia–Europe Express', day: 1, color: '#0E4C92', ships: 12,
      desc: 'Our flagship Far East – North Europe loop via the Indian subcontinent hub of Colombo and the Suez Canal.',
      rotation: ['CNSHA', 'CNNGB', '~TWS', 'CNYTN', '~SCS', 'SGSIN', 'MYTPP', 'MYPKG', '~ACEH', '~LK_SE', '~LK_S', '~LK_SW', 'LKCMB', '~GUARDAFUI', '~BAB', 'SAJED', '~REDN', '~SUEZ', 'EGPSD', '~SICILY', '~ALGERIA', '~GATA', 'MAPTM', '~STRAIT_W', '~STVINCENT', '~FINISTERRE', '~USHANT', '~COTENTIN', 'FRLEH', '~DOVER', 'NLRTM', '~NL_N', '~HELGOLAND', '~CUXHAVEN', 'DEHAM', '~CUXHAVEN', '~HELGOLAND', '~NL_N', '~ZEEL', '~SCHELDT', 'BEANR', '~SCHELDT', 'GBFXT'] },
    { code: 'MEX', name: 'Middle East–Mediterranean', day: 4, color: '#C2410C', ships: 7,
      desc: 'Arabian Gulf, Oman and the Red Sea connected to the Eastern and Western Mediterranean.',
      rotation: ['AEJEA', 'QAHMD', '~KHOR', 'SADMM', '~KHOR', '~HORMUZ', '~HADD', '~MASIRAH', '~MADRAKAH', '~SAL_E', 'OMSLL', '~BAB', 'SAJED', '~REDN', '~SUEZ', 'EGPSD', '~CYPRUS_E', 'TRMER', '~CYPRUS_E', 'EGPSD', 'GRPIR', '~MALEA', '~MATAPAN', '~MALTA', '~SARD_S', '~TYRRH1', '~TYRRH2', '~LIGURIAN', 'ITGOA', 'ESVLC', '~NAO', '~PALOS', '~GATA', 'ESALG'] },
    { code: 'BSF', name: 'Aegean–Marmara Feeder', day: 5, color: '#9333EA', ships: 2,
      desc: 'Piraeus hub feeder to Istanbul (Ambarli) through the Dardanelles.',
      rotation: ['GRPIR', '~SARONIC', '~KEA', '~CAFIREAS', '~LESBOS_W', '~DARDANELLES', '~GALLIPOLI', '~MARMARA', 'TRAMR'] },
    { code: 'IUX', name: 'India–US East Coast', day: 6, color: '#DC2626', ships: 8,
      desc: 'West India to the US East Coast and US Gulf via the Red Sea, Suez and the Mediterranean.',
      rotation: ['INNSA', '~GUARDAFUI', '~BAB', 'SAJED', '~REDN', '~SUEZ', 'EGPSD', '~DELTA', 'EGALY', '~SICILY', '~ALGERIA', '~GATA', 'ESALG', '~STRAIT_W', '~NANTUCKET', '~AMBROSE', 'USNYC', '~AMBROSE', '~HATTERAS', '~FL_E', '~FL_KEYS', '~GALV', 'USHOU'] },
    { code: 'ATX', name: 'Transatlantic Express', day: 2, color: '#2563EB', ships: 6,
      desc: 'North Europe to New York / New Jersey and Houston.',
      rotation: ['DEHAM', '~CUXHAVEN', '~HELGOLAND', '~NL_N', 'NLRTM', '~ZEEL', '~SCHELDT', 'BEANR', '~SCHELDT', 'GBLGP', '~FORELAND', '~DOVER', 'FRLEH', '~COTENTIN', '~LIZARD', '~NANTUCKET', '~AMBROSE', 'USNYC', '~AMBROSE', '~HATTERAS', '~FL_E', '~FL_KEYS', '~GALV', 'USHOU'] },
    { code: 'TPX', name: 'Trans-Pacific Express', day: 5, color: '#059669', ships: 6,
      desc: 'Central China and Korea to the US West Coast gateways of Los Angeles and Long Beach.',
      rotation: ['CNSHA', 'CNNGB', 'KRPUS', '~TSUGARU_W', '~TSUGARU_E', 'USLAX', 'USLGB'] },
    { code: 'JKX', name: 'China–Korea–Japan Shuttle', day: 3, color: '#0891B2', ships: 2,
      desc: 'Short-sea shuttle connecting Shanghai and Busan with Yokohama and Tokyo.',
      rotation: ['CNSHA', 'KRPUS', '~KR_S', '~JP1', '~JP2', '~JP3', '~URAGA', 'JPYOK', 'JPTYO'] },
    { code: 'SEA', name: 'Intra-Asia Express', day: 1, color: '#65A30D', ships: 4,
      desc: 'South China, Vietnam, Thailand, Singapore and Indonesia in one weekly loop.',
      rotation: ['CNYTN', '~QZ2', '~QZ1', 'VNHPH', '~VN_C', '~VN_E', 'VNCMT', '~CAMAU', 'THLCH', '~CAMAU', 'SGSIN', '~BANGKA', 'IDTPP'] },
    { code: 'OCX', name: 'Oceania Express', day: 0, color: '#B45309', ships: 5,
      desc: 'Straits and Java to South-East Australia (Melbourne & Sydney).',
      rotation: ['MYPKG', 'SGSIN', '~BANGKA', 'IDTPP', '~SUNDA1', '~SUNDA2', '~IO_W', '~LEEUWIN', '~OTWAY', '~PHILLIP', 'AUMEL', '~PHILLIP', '~WILSON', '~GABO', 'AUSYD'] },
    { code: 'IAX', name: 'India–Africa Express', day: 4, color: '#BE185D', ships: 6,
      desc: 'West India to East, South and West Africa via Mombasa, Durban and Lagos.',
      rotation: ['INMUN', '~KUTCH', '~SAUR1', '~SAUR2', 'INNSA', 'KEMBA', '~MOZ_N', '~MOZ_S', 'ZADUR', '~CAPE', 'NGAPP'] },
    { code: 'WAX', name: 'West Africa Med Link', day: 6, color: '#A16207', ships: 3,
      desc: 'Algeciras and Tanger Med hubs to Lagos (Apapa).',
      rotation: ['ESALG', 'MAPTM', '~STRAIT_W', '~MOR1', '~CANARY', '~SAHARA', '~CBLANC', '~DAKAR', '~GUINEA', '~SLEONE', '~PALMAS', '~GHANA', 'NGAPP'] },
    { code: 'SAX', name: 'Asia–South America', day: 2, color: '#16A34A', ships: 8,
      desc: 'Singapore, Port Klang and Colombo to Durban and Santos via the Cape of Good Hope.',
      rotation: ['SGSIN', 'MYPKG', '~ACEH', '~LK_SE', '~LK_S', '~LK_SW', 'LKCMB', '~MADA_S', 'ZADUR', '~CAPE', '~CFRIO', 'BRSSZ'] },
    { code: 'ESX', name: 'Europe–South America', day: 0, color: '#4F46E5', ships: 5,
      desc: 'Algeciras hub to the east coast of South America (Santos).',
      rotation: ['ESALG', '~STRAIT_W', '~MOR1', '~CANARY', '~SAHARA', '~CBLANC', '~NATAL', '~RECIFE', '~ARACAJU', '~ABROLHOS', '~CFRIO', 'BRSSZ'] }
  ];

  /* ---------------- 32 countries, offices & ports ---------------- */
  // port: [locode, name, city, lat, lon, annual TEU (millions, approx.), max draft (m), terminals, note]
  const P = (locode, name, city, lat, lon, teu, depth, terminals, note) => ({ locode, name, city, lat, lon, teu, depth, terminals, note });

  const COUNTRIES = [
    { code: 'AE', name: 'United Arab Emirates', region: 'Middle East', tz: 'GST (UTC+4)', currency: 'AED',
      offices: [
        { type: 'Global Headquarters', city: 'Dubai', name: 'SRV Global Headquarters – Jebel Ali', address: SITE.hq.address, phone: SITE.hq.phone, email: 'hq@srvlogistics.com', hours: SITE.hq.hours, head: 'Sanjay Menon', headTitle: 'General Manager – Global HQ', lat: 25.0112, lon: 55.0620 },
        { type: 'Branch Office', city: 'Abu Dhabi', name: 'SRV Abu Dhabi – Khalifa Port', address: 'Unit 210, KEZAD Business Centre, Khalifa Port, Taweelah, Abu Dhabi, United Arab Emirates', phone: '+971 2 615 4410', email: 'abudhabi@srvlogistics.com', hours: 'Sun–Thu 08:00–17:00 GST', head: 'Fatima Al Hammadi', headTitle: 'Branch Manager', lat: 24.82, lon: 54.66 }
      ],
      ports: [
        P('AEJEA', 'Jebel Ali Port', 'Dubai', 25.011, 55.061, 14.5, 17.0, 'Terminals 1, 2 & 3 (DP World)', 'Largest port in the Middle East and SRV’s home hub; gateway to JAFZA free zone.'),
        P('AEKHL', 'Khalifa Port', 'Abu Dhabi', 24.810, 54.650, 5.0, 16.5, 'Khalifa Container Terminals', 'Semi-automated deep-water port adjacent to KEZAD industrial zone.')
      ] },
    { code: 'IN', name: 'India', region: 'South Asia', tz: 'IST (UTC+5:30)', currency: 'INR',
      offices: [
        { type: 'Operations & Management Centre', city: 'Chennai', name: 'SRV Operations & Management Centre – Chennai Port', address: SITE.omc.address, phone: SITE.omc.phone, email: 'omc@srvlogistics.com', hours: SITE.omc.hours, head: 'S. Karthikeyan', headTitle: 'Head – Operations & Management Centre', lat: 13.0980, lon: 80.2930 },
        { type: 'Branch Office', city: 'Navi Mumbai', name: 'SRV Mumbai – JNPA Nhava Sheva', address: '702, Seawoods Grand Central Tower 2, Sector 40, Nerul Node, Navi Mumbai – 400 706, Maharashtra, India', phone: '+91 22 6128 4500', email: 'mumbai@srvlogistics.com', hours: 'Mon–Sat 09:00–18:30 IST', head: 'Rohan Deshpande', headTitle: 'Branch Manager – West India', lat: 19.02, lon: 73.02 },
        { type: 'Branch Office', city: 'Mundra', name: 'SRV Mundra', address: 'Office 18, Port User Building, Mundra SEZ, Mundra, Kutch – 370 421, Gujarat, India', phone: '+91 2838 266 410', email: 'mundra@srvlogistics.com', hours: 'Mon–Sat 09:00–18:00 IST', head: 'Hitesh Patel', headTitle: 'Branch Manager', lat: 22.76, lon: 69.70 },
        { type: 'Branch Office', city: 'Kochi', name: 'SRV Kochi', address: '3rd Floor, Marine Drive Business Centre, Willingdon Island, Kochi – 682 003, Kerala, India', phone: '+91 484 266 7120', email: 'kochi@srvlogistics.com', hours: 'Mon–Sat 09:30–18:00 IST', head: 'Anil Varghese', headTitle: 'Branch Manager', lat: 9.96, lon: 76.27 }
      ],
      ports: [
        P('INMAA', 'Chennai Port', 'Chennai', 13.100, 80.300, 1.6, 15.5, 'Chennai Container Terminal, Chennai International Terminals', 'Home of SRV’s global Operations & Management Centre; oldest major port on India’s east coast.'),
        P('INENR', 'Kamarajar Port (Ennore)', 'Chennai', 13.260, 80.330, 0.8, 16.0, 'Kamarajar Container Terminal', 'Corporatised major port north of Chennai serving the automotive corridor.'),
        P('INNSA', 'Jawaharlal Nehru Port (Nhava Sheva)', 'Navi Mumbai', 18.950, 72.950, 6.4, 15.0, 'JNPCT, NSICT, GTI, BMCT, NSIGT', 'India’s busiest container gateway serving Mumbai and the northern hinterland.'),
        P('INMUN', 'Mundra Port', 'Kutch, Gujarat', 22.740, 69.700, 7.4, 17.5, 'CT-1 to CT-4', 'India’s largest commercial port with direct rail to the National Capital Region.'),
        P('INCOK', 'Cochin Port (ICTT Vallarpadam)', 'Kochi', 9.970, 76.260, 0.8, 14.5, 'International Container Transhipment Terminal', 'Transhipment-capable terminal on India’s south-west coast.'),
        P('INTUT', 'V.O. Chidambaranar Port', 'Thoothukudi', 8.750, 78.200, 0.8, 14.2, 'TICT, DBGT', 'Southern gateway for Tamil Nadu textiles, salt and agro exports.'),
        P('INVTZ', 'Visakhapatnam Port', 'Visakhapatnam', 17.690, 83.290, 0.6, 16.5, 'Visakha Container Terminal', 'Natural deep-water harbour on the east coast.'),
        P('INCCU', 'Syama Prasad Mookerjee Port', 'Kolkata', 22.540, 88.310, 0.8, 8.5, 'Kolkata Dock System, Haldia Dock Complex', 'Riverine port serving eastern India, Nepal and Bhutan.')
      ] },
    { code: 'SA', name: 'Saudi Arabia', region: 'Middle East', tz: 'AST (UTC+3)', currency: 'SAR',
      offices: [{ type: 'Country Office', city: 'Jeddah', name: 'SRV Saudi Arabia', address: 'Jeddah Islamic Port Business Gate, Office 3-14, Al Mina District, Jeddah 22312, Saudi Arabia', phone: '+966 12 647 3300', email: 'saudi@srvlogistics.com', hours: 'Sun–Thu 08:00–17:00 AST', head: 'Faisal Al Harbi', headTitle: 'Country Manager', lat: 21.48, lon: 39.17 }],
      ports: [
        P('SAJED', 'Jeddah Islamic Port', 'Jeddah', 21.470, 39.160, 5.0, 18.0, 'North Container Terminal, South Container Terminal', 'Red Sea transhipment hub and main gateway to Makkah region.'),
        P('SADMM', 'King Abdulaziz Port', 'Dammam', 26.500, 50.200, 2.5, 16.0, 'Dammam Container Terminals', 'Primary Arabian Gulf gateway for Saudi Arabia’s Eastern Province and Riyadh.')
      ] },
    { code: 'OM', name: 'Oman', region: 'Middle East', tz: 'GST (UTC+4)', currency: 'OMR',
      offices: [{ type: 'Country Office', city: 'Salalah', name: 'SRV Oman', address: 'Building 21, Port of Salalah Free Zone, Raysut, Salalah 211, Sultanate of Oman', phone: '+968 2321 9840', email: 'oman@srvlogistics.com', hours: 'Sun–Thu 08:00–17:00 GST', head: 'Said Al Balushi', headTitle: 'Country Manager', lat: 16.95, lon: 54.01 }],
      ports: [
        P('OMSLL', 'Port of Salalah', 'Salalah', 16.940, 54.000, 4.5, 18.0, 'Salalah Container Terminal', 'Arabian Sea transhipment hub outside the Strait of Hormuz.'),
        P('OMSOH', 'Sohar Port', 'Sohar', 24.500, 56.620, 0.8, 16.0, 'Hutchison Ports Sohar', 'Industrial port and freezone on the Gulf of Oman.')
      ] },
    { code: 'QA', name: 'Qatar', region: 'Middle East', tz: 'AST (UTC+3)', currency: 'QAR',
      offices: [{ type: 'Country Office', city: 'Doha', name: 'SRV Qatar', address: 'Office 905, Mesaimeer Logistics Tower, Hamad Port Road, Umm Al Houl, Doha, Qatar', phone: '+974 4412 7750', email: 'qatar@srvlogistics.com', hours: 'Sun–Thu 07:30–16:30 AST', head: 'Hamad Al Kuwari', headTitle: 'Country Manager', lat: 25.05, lon: 51.58 }],
      ports: [P('QAHMD', 'Hamad Port', 'Doha', 25.010, 51.620, 1.5, 17.0, 'Container Terminal 1 & 2 (QTerminals)', 'Qatar’s principal gateway and one of the largest greenfield ports in the Gulf.')] },
    { code: 'LK', name: 'Sri Lanka', region: 'South Asia', tz: 'SLST (UTC+5:30)', currency: 'LKR',
      offices: [{ type: 'Regional Transhipment Desk', city: 'Colombo', name: 'SRV Sri Lanka', address: 'Level 8, Harbour View Towers, 22 Church Street, Colombo 01, Sri Lanka', phone: '+94 11 247 6620', email: 'srilanka@srvlogistics.com', hours: 'Mon–Fri 08:30–17:30, Sat 08:30–13:00 SLST', head: 'Dilshan Perera', headTitle: 'Country Manager', lat: 6.94, lon: 79.85 }],
      ports: [P('LKCMB', 'Port of Colombo', 'Colombo', 6.950, 79.840, 6.9, 18.0, 'JCT, SAGT, CICT, ECT', 'South Asia’s leading transhipment hub on the East–West mainline.')] },
    { code: 'BD', name: 'Bangladesh', region: 'South Asia', tz: 'BST (UTC+6)', currency: 'BDT',
      offices: [{ type: 'Country Office', city: 'Chattogram', name: 'SRV Bangladesh', address: 'SRV House, 1040 Sheikh Mujib Road, Agrabad C/A, Chattogram 4100, Bangladesh', phone: '+880 31 271 4480', email: 'bangladesh@srvlogistics.com', hours: 'Sun–Thu 09:00–18:00 BST', head: 'Tanvir Rahman', headTitle: 'Country Manager', lat: 22.32, lon: 91.81 }],
      ports: [P('BDCGP', 'Chittagong Port', 'Chattogram', 22.300, 91.800, 3.0, 9.5, 'CCT, NCT, PCT', 'Bangladesh’s main seaport handling over 90% of the country’s container trade.')] },
    { code: 'SG', name: 'Singapore', region: 'Southeast Asia', tz: 'SGT (UTC+8)', currency: 'SGD',
      offices: [{ type: 'Regional Hub – Asia Pacific', city: 'Singapore', name: 'SRV Asia Pacific Regional Hub', address: '18 Keppel Road, #12-04 Harbourfront Logistics Centre, Singapore 089064', phone: '+65 6278 4410', email: 'singapore@srvlogistics.com', hours: 'Mon–Fri 08:30–18:00 SGT', head: 'Daniel Lim', headTitle: 'Regional Managing Director – APAC', lat: 1.27, lon: 103.83 }],
      ports: [P('SGSIN', 'Port of Singapore', 'Singapore', 1.270, 103.800, 39.0, 18.0, 'Pasir Panjang, Tuas, Keppel, Brani', 'World’s busiest transhipment hub; SRV’s Asia-Pacific relay port.')] },
    { code: 'MY', name: 'Malaysia', region: 'Southeast Asia', tz: 'MYT (UTC+8)', currency: 'MYR',
      offices: [{ type: 'Country Office', city: 'Port Klang', name: 'SRV Malaysia', address: 'Lot 3A-12, Wisma Westport Business Suites, Jalan Pelabuhan Utara, 42000 Port Klang, Selangor, Malaysia', phone: '+60 3 3168 2290', email: 'malaysia@srvlogistics.com', hours: 'Mon–Fri 08:30–17:30 MYT', head: 'Nurul Aisyah Rahman', headTitle: 'Country Manager', lat: 3.00, lon: 101.40 }],
      ports: [
        P('MYPKG', 'Port Klang', 'Klang', 3.000, 101.390, 14.0, 17.0, 'Westports, Northport', 'Malaysia’s premier port and Strait of Malacca hub.'),
        P('MYTPP', 'Port of Tanjung Pelepas', 'Johor', 1.360, 103.550, 10.5, 19.0, 'PTP Container Terminal', 'Major transhipment port at the southern tip of the Malay Peninsula.')
      ] },
    { code: 'CN', name: 'China', region: 'East Asia', tz: 'CST (UTC+8)', currency: 'CNY',
      offices: [{ type: 'Country Office', city: 'Shanghai', name: 'SRV China', address: 'Room 2208, Harbour Plaza, 1218 Dong Daming Road, Hongkou District, Shanghai 200080, China', phone: '+86 21 6595 7720', email: 'china@srvlogistics.com', hours: 'Mon–Fri 09:00–18:00 CST', head: 'Chen Wei', headTitle: 'Country Manager', lat: 31.25, lon: 121.50 }],
      ports: [
        P('CNSHA', 'Port of Shanghai (Yangshan)', 'Shanghai', 30.620, 122.060, 49.0, 16.0, 'Yangshan Phases I–IV, Waigaoqiao', 'The world’s busiest container port.'),
        P('CNNGB', 'Port of Ningbo-Zhoushan', 'Ningbo', 29.930, 121.850, 35.0, 17.5, 'Beilun, Chuanshan, Meishan', 'World’s largest port by cargo tonnage.'),
        P('CNYTN', 'Yantian Port (Shenzhen)', 'Shenzhen', 22.570, 114.270, 14.0, 17.4, 'Yantian International Container Terminals', 'Deep-water gateway for the Pearl River Delta manufacturing belt.')
      ] },
    { code: 'VN', name: 'Vietnam', region: 'Southeast Asia', tz: 'ICT (UTC+7)', currency: 'VND',
      offices: [{ type: 'Country Office', city: 'Ho Chi Minh City', name: 'SRV Vietnam', address: 'Floor 11, Harbour Tower, 39 Ton Duc Thang Street, Ben Nghe Ward, District 1, Ho Chi Minh City, Vietnam', phone: '+84 28 3822 6650', email: 'vietnam@srvlogistics.com', hours: 'Mon–Fri 08:00–17:30, Sat 08:00–12:00 ICT', head: 'Nguyen Thanh Hai', headTitle: 'Country Manager', lat: 10.78, lon: 106.71 }],
      ports: [
        P('VNCMT', 'Cai Mep–Thi Vai Port', 'Ba Ria–Vung Tau', 10.530, 107.030, 5.0, 16.5, 'CMIT, TCIT, SSIT, Gemalink', 'Deep-water cluster for direct mainline calls to Europe and America.'),
        P('VNHPH', 'Port of Haiphong', 'Haiphong', 20.850, 106.750, 6.0, 14.0, 'Lach Huyen (HICT), Dinh Vu', 'Northern Vietnam’s main gateway serving Hanoi.')
      ] },
    { code: 'TH', name: 'Thailand', region: 'Southeast Asia', tz: 'ICT (UTC+7)', currency: 'THB',
      offices: [{ type: 'Country Office', city: 'Laem Chabang', name: 'SRV Thailand', address: '88/12 Moo 3, Sukhumvit Road, Thung Sukhla, Si Racha, Chonburi 20230, Thailand', phone: '+66 38 401 552', email: 'thailand@srvlogistics.com', hours: 'Mon–Fri 08:30–17:30 ICT', head: 'Somchai Wongsakul', headTitle: 'Country Manager', lat: 13.10, lon: 100.90 }],
      ports: [P('THLCH', 'Laem Chabang Port', 'Chonburi', 13.080, 100.880, 8.9, 16.0, 'Basins A, B & C', 'Thailand’s principal deep-sea port on the Eastern Economic Corridor.')] },
    { code: 'ID', name: 'Indonesia', region: 'Southeast Asia', tz: 'WIB (UTC+7)', currency: 'IDR',
      offices: [{ type: 'Country Office', city: 'Jakarta', name: 'SRV Indonesia', address: 'Menara Pelabuhan Lt. 15, Jl. Enggano No. 5, Tanjung Priok, Jakarta Utara 14310, Indonesia', phone: '+62 21 4393 7710', email: 'indonesia@srvlogistics.com', hours: 'Mon–Fri 08:00–17:00 WIB', head: 'Ratna Sari Wijaya', headTitle: 'Country Manager', lat: -6.11, lon: 106.88 }],
      ports: [P('IDTPP', 'Tanjung Priok Port', 'Jakarta', -6.100, 106.880, 7.0, 16.0, 'JICT, Koja, NPCT1', 'Indonesia’s busiest port, handling over half of national container trade.')] },
    { code: 'KR', name: 'South Korea', region: 'East Asia', tz: 'KST (UTC+9)', currency: 'KRW',
      offices: [{ type: 'Country Office', city: 'Busan', name: 'SRV Korea', address: '14F, Busan Port Tower, 63 Jungang-daero, Jung-gu, Busan 48939, Republic of Korea', phone: '+82 51 463 7720', email: 'korea@srvlogistics.com', hours: 'Mon–Fri 09:00–18:00 KST', head: 'Park Ji-hoon', headTitle: 'Country Manager', lat: 35.10, lon: 129.04 }],
      ports: [P('KRPUS', 'Port of Busan', 'Busan', 35.080, 128.830, 23.0, 17.0, 'Busan New Port (PNC, HJNC, BNCT), North Port', 'Northeast Asia’s key transhipment hub.')] },
    { code: 'JP', name: 'Japan', region: 'East Asia', tz: 'JST (UTC+9)', currency: 'JPY',
      offices: [{ type: 'Country Office', city: 'Yokohama', name: 'SRV Japan', address: '9F Yokohama Port Square Bldg, 2-1 Kaigan-dori, Naka-ku, Yokohama 231-0002, Japan', phone: '+81 45 211 6640', email: 'japan@srvlogistics.com', hours: 'Mon–Fri 09:00–17:30 JST', head: 'Kenji Watanabe', headTitle: 'Country Manager', lat: 35.45, lon: 139.64 }],
      ports: [
        P('JPYOK', 'Port of Yokohama', 'Yokohama', 35.450, 139.660, 2.9, 18.0, 'Minami Honmoku, Honmoku, Daikoku', 'Keihin hub port serving the Greater Tokyo region.'),
        P('JPTYO', 'Port of Tokyo', 'Tokyo', 35.620, 139.780, 4.3, 15.0, 'Oi, Aomi, Shinagawa', 'Japan’s busiest container port.')
      ] },
    { code: 'AU', name: 'Australia', region: 'Oceania', tz: 'AEST (UTC+10)', currency: 'AUD',
      offices: [{ type: 'Country Office', city: 'Melbourne', name: 'SRV Australia', address: 'Suite 4.02, 90 Lorimer Street, Docklands VIC 3008, Australia', phone: '+61 3 9645 2230', email: 'australia@srvlogistics.com', hours: 'Mon–Fri 08:30–17:00 AEST', head: 'Olivia Bennett', headTitle: 'Country Manager', lat: -37.82, lon: 144.94 }],
      ports: [
        P('AUMEL', 'Port of Melbourne', 'Melbourne', -37.830, 144.920, 3.2, 14.0, 'Swanson Dock East & West, Webb Dock East', 'Australia’s largest container port.'),
        P('AUSYD', 'Port Botany', 'Sydney', -33.970, 151.210, 2.8, 15.0, 'Patrick, DP World, Hutchison', 'Sydney’s container gateway on Botany Bay.')
      ] },
    { code: 'EG', name: 'Egypt', region: 'Africa', tz: 'EET (UTC+2)', currency: 'EGP',
      offices: [{ type: 'Country Office', city: 'Port Said', name: 'SRV Egypt & Suez Canal Agency', address: 'Office 7, Port Said Business Tower, El Gomhoreya Street, Port Said 42511, Egypt', phone: '+20 66 334 5580', email: 'egypt@srvlogistics.com', hours: 'Sun–Thu 09:00–17:00 EET (Canal desk 24×7)', head: 'Ahmed Mostafa', headTitle: 'Country Manager', lat: 31.26, lon: 32.30 }],
      ports: [
        P('EGPSD', 'East Port Said', 'Port Said', 31.250, 32.350, 3.8, 17.5, 'Suez Canal Container Terminal (SCCT)', 'Transhipment hub at the northern entrance of the Suez Canal.'),
        P('EGALY', 'Port of Alexandria', 'Alexandria', 31.190, 29.870, 1.8, 14.0, 'Alexandria International Container Terminals', 'Egypt’s oldest and busiest general port.')
      ] },
    { code: 'KE', name: 'Kenya', region: 'Africa', tz: 'EAT (UTC+3)', currency: 'KES',
      offices: [{ type: 'Country Office', city: 'Mombasa', name: 'SRV East Africa', address: '4th Floor, Bandari Plaza, Moi Avenue, Mombasa 80100, Kenya', phone: '+254 41 222 6640', email: 'kenya@srvlogistics.com', hours: 'Mon–Fri 08:00–17:00 EAT', head: 'Grace Wanjiru', headTitle: 'Country Manager', lat: -4.06, lon: 39.67 }],
      ports: [P('KEMBA', 'Port of Mombasa', 'Mombasa', -4.050, 39.650, 1.6, 15.0, 'Kilindini CT, Second Container Terminal', 'Gateway for Kenya, Uganda, Rwanda and South Sudan.')] },
    { code: 'ZA', name: 'South Africa', region: 'Africa', tz: 'SAST (UTC+2)', currency: 'ZAR',
      offices: [{ type: 'Country Office', city: 'Durban', name: 'SRV Southern Africa', address: 'Suite 301, Maritime House, 1 Margaret Mncadi Avenue, Durban 4001, South Africa', phone: '+27 31 301 4470', email: 'southafrica@srvlogistics.com', hours: 'Mon–Fri 08:00–16:30 SAST', head: 'Thabo Nkosi', headTitle: 'Country Manager', lat: -29.86, lon: 31.03 }],
      ports: [P('ZADUR', 'Port of Durban', 'Durban', -29.870, 31.030, 2.7, 12.8, 'Durban Container Terminal Piers 1 & 2', 'Africa’s busiest container port in the Southern hemisphere.')] },
    { code: 'NG', name: 'Nigeria', region: 'Africa', tz: 'WAT (UTC+1)', currency: 'NGN',
      offices: [{ type: 'Country Office', city: 'Lagos', name: 'SRV West Africa', address: 'Plot 18, Warehouse Road, Apapa, Lagos 102272, Nigeria', phone: '+234 1 280 6650', email: 'nigeria@srvlogistics.com', hours: 'Mon–Fri 08:00–17:00 WAT', head: 'Chinedu Okafor', headTitle: 'Country Manager', lat: 6.45, lon: 3.37 }],
      ports: [P('NGAPP', 'Apapa Port', 'Lagos', 6.440, 3.360, 1.0, 13.5, 'APM Terminals Apapa, ENL', 'Nigeria’s largest and busiest port complex.')] },
    { code: 'MA', name: 'Morocco', region: 'Africa', tz: 'WET (UTC+1)', currency: 'MAD',
      offices: [{ type: 'Country Office', city: 'Tangier', name: 'SRV Morocco', address: 'Zone Franche Logistique Tanger Med, Lot 22, Ksar Sghir 90000, Morocco', phone: '+212 539 33 4480', email: 'morocco@srvlogistics.com', hours: 'Mon–Fri 08:30–17:30 WET', head: 'Youssef El Amrani', headTitle: 'Country Manager', lat: 35.88, lon: -5.51 }],
      ports: [P('MAPTM', 'Tanger Med Port', 'Tangier', 35.890, -5.500, 8.6, 18.0, 'TC1, TC2, TC3, TC4', 'Mediterranean’s largest container port at the Strait of Gibraltar.')] },
    { code: 'NL', name: 'Netherlands', region: 'Europe', tz: 'CET (UTC+1)', currency: 'EUR',
      offices: [{ type: 'Regional Hub – Europe', city: 'Rotterdam', name: 'SRV Europe Regional Hub', address: 'Waalhaven Zuidzijde 21, 3089 JH Rotterdam, Netherlands', phone: '+31 10 428 6670', email: 'europe@srvlogistics.com', hours: 'Mon–Fri 08:30–17:30 CET', head: 'Sanne de Vries', headTitle: 'Regional Managing Director – Europe', lat: 51.89, lon: 4.44 }],
      ports: [P('NLRTM', 'Port of Rotterdam (Maasvlakte)', 'Rotterdam', 51.950, 4.050, 13.4, 20.0, 'ECT Delta, APMT MV2, RWG, Euromax', 'Europe’s largest port and SRV’s North European hub.')] },
    { code: 'BE', name: 'Belgium', region: 'Europe', tz: 'CET (UTC+1)', currency: 'EUR',
      offices: [{ type: 'Country Office', city: 'Antwerp', name: 'SRV Belgium', address: 'Noorderlaan 147, Bus 9, 2030 Antwerpen, Belgium', phone: '+32 3 545 2290', email: 'belgium@srvlogistics.com', hours: 'Mon–Fri 08:30–17:30 CET', head: 'Pieter Claes', headTitle: 'Country Manager', lat: 51.25, lon: 4.40 }],
      ports: [P('BEANR', 'Port of Antwerp-Bruges', 'Antwerp', 51.270, 4.330, 12.5, 16.0, 'MPET, PSA Europa, Antwerp Gateway', 'Europe’s second-largest container port and chemical cluster.')] },
    { code: 'DE', name: 'Germany', region: 'Europe', tz: 'CET (UTC+1)', currency: 'EUR',
      offices: [{ type: 'Country Office', city: 'Hamburg', name: 'SRV Germany', address: 'Am Sandtorkai 41, 20457 Hamburg, Germany', phone: '+49 40 3290 7740', email: 'germany@srvlogistics.com', hours: 'Mon–Fri 08:00–17:00 CET', head: 'Lukas Becker', headTitle: 'Country Manager', lat: 53.54, lon: 9.99 }],
      ports: [P('DEHAM', 'Port of Hamburg', 'Hamburg', 53.540, 9.930, 7.7, 15.1, 'CTA Altenwerder, CTB Burchardkai, Eurogate', 'Germany’s largest seaport and rail hub to Central & Eastern Europe.')] },
    { code: 'GB', name: 'United Kingdom', region: 'Europe', tz: 'GMT (UTC+0)', currency: 'GBP',
      offices: [{ type: 'Country Office', city: 'Felixstowe', name: 'SRV United Kingdom', address: 'Unit 5, Dock Gate Business Park, Walton Avenue, Felixstowe IP11 3HF, United Kingdom', phone: '+44 1394 604 220', email: 'uk@srvlogistics.com', hours: 'Mon–Fri 08:30–17:30 GMT', head: 'James Whitfield', headTitle: 'Country Manager', lat: 51.96, lon: 1.33 }],
      ports: [
        P('GBFXT', 'Port of Felixstowe', 'Felixstowe', 51.950, 1.320, 3.8, 16.0, 'Trinity Terminal, Berths 8 & 9', 'Britain’s busiest container port.'),
        P('GBLGP', 'London Gateway', 'Stanford-le-Hope', 51.500, 0.480, 2.0, 17.0, 'DP World London Gateway', 'Deep-sea port and logistics park on the Thames estuary.')
      ] },
    { code: 'FR', name: 'France', region: 'Europe', tz: 'CET (UTC+1)', currency: 'EUR',
      offices: [{ type: 'Country Office', city: 'Le Havre', name: 'SRV France', address: 'Quai de Southampton, Immeuble Les Docks, 76600 Le Havre, France', phone: '+33 2 35 19 6640', email: 'france@srvlogistics.com', hours: 'Mon–Fri 08:30–17:30 CET', head: 'Camille Laurent', headTitle: 'Country Manager', lat: 49.49, lon: 0.11 }],
      ports: [P('FRLEH', 'Port of Le Havre (HAROPA)', 'Le Havre', 49.470, 0.170, 2.9, 15.5, 'Port 2000 (TNMSC, GMP)', 'France’s leading container port on the Seine axis to Paris.')] },
    { code: 'ES', name: 'Spain', region: 'Europe', tz: 'CET (UTC+1)', currency: 'EUR',
      offices: [{ type: 'Country Office', city: 'Valencia', name: 'SRV Spain', address: 'Avenida del Puerto 332, Planta 4, 46024 Valencia, Spain', phone: '+34 963 24 7780', email: 'spain@srvlogistics.com', hours: 'Mon–Fri 08:30–17:30 CET', head: 'Javier Morales', headTitle: 'Country Manager', lat: 39.46, lon: -0.34 }],
      ports: [
        P('ESVLC', 'Port of Valencia', 'Valencia', 39.440, -0.320, 4.8, 16.0, 'CSP Valencia, MSC Valencia, APM Valencia', 'Spain’s busiest container port, gateway to Madrid.'),
        P('ESALG', 'Port of Algeciras', 'Algeciras', 36.130, -5.430, 4.7, 18.5, 'APM Algeciras, TTI Algeciras', 'Gibraltar Strait hub linking Europe, Africa and the Americas.')
      ] },
    { code: 'IT', name: 'Italy', region: 'Europe', tz: 'CET (UTC+1)', currency: 'EUR',
      offices: [{ type: 'Country Office', city: 'Genoa', name: 'SRV Italy', address: 'Via Ponte Reale 2, Piano 5, 16124 Genova, Italy', phone: '+39 010 247 6630', email: 'italy@srvlogistics.com', hours: 'Mon–Fri 09:00–18:00 CET', head: 'Giulia Romano', headTitle: 'Country Manager', lat: 44.41, lon: 8.93 }],
      ports: [P('ITGOA', 'Port of Genoa', 'Genoa', 44.400, 8.900, 2.6, 15.0, 'PSA Genova Pra’, Spinelli, SECH', 'Italy’s largest port serving the industrial north.')] },
    { code: 'GR', name: 'Greece', region: 'Europe', tz: 'EET (UTC+2)', currency: 'EUR',
      offices: [{ type: 'Country Office', city: 'Piraeus', name: 'SRV Greece', address: 'Akti Miaouli 85, 185 38 Piraeus, Greece', phone: '+30 210 429 7750', email: 'greece@srvlogistics.com', hours: 'Mon–Fri 09:00–17:00 EET', head: 'Nikos Papadakis', headTitle: 'Country Manager', lat: 37.94, lon: 23.64 }],
      ports: [P('GRPIR', 'Port of Piraeus', 'Piraeus', 37.940, 23.600, 5.0, 18.0, 'Piraeus Container Terminal Piers I–III', 'Eastern Mediterranean transhipment gateway.')] },
    { code: 'TR', name: 'Türkiye', region: 'Europe', tz: 'TRT (UTC+3)', currency: 'TRY',
      offices: [{ type: 'Country Office', city: 'Istanbul', name: 'SRV Türkiye', address: 'Ambarli Liman Cad. No. 14, Avcilar, 34310 Istanbul, Türkiye', phone: '+90 212 690 4470', email: 'turkiye@srvlogistics.com', hours: 'Mon–Fri 09:00–18:00 TRT', head: 'Emre Yilmaz', headTitle: 'Country Manager', lat: 40.98, lon: 28.70 }],
      ports: [
        P('TRAMR', 'Ambarli Port', 'Istanbul', 40.970, 28.690, 3.0, 16.0, 'Marport, Kumport, Mardas', 'Istanbul’s container gateway on the Sea of Marmara.'),
        P('TRMER', 'Port of Mersin', 'Mersin', 36.790, 34.630, 2.0, 15.5, 'Mersin International Port (MIP)', 'Türkiye’s leading Mediterranean port with access to the Middle East.')
      ] },
    { code: 'US', name: 'United States', region: 'Americas', tz: 'ET (UTC−5) / PT (UTC−8)', currency: 'USD',
      offices: [
        { type: 'Regional Hub – Americas', city: 'Newark, NJ', name: 'SRV Americas Regional Hub', address: 'Suite 1450, 50 Harbor Plaza Drive, Newark, NJ 07114, United States', phone: '+1 973 555 0148', email: 'americas@srvlogistics.com', hours: 'Mon–Fri 08:30–17:30 ET', head: 'Michael Turner', headTitle: 'Regional Managing Director – Americas', lat: 40.69, lon: -74.16 },
        { type: 'Branch Office', city: 'Long Beach, CA', name: 'SRV US West Coast', address: 'Suite 620, 245 Harbor Gateway Blvd, Long Beach, CA 90802, United States', phone: '+1 562 555 0172', email: 'uswest@srvlogistics.com', hours: 'Mon–Fri 08:00–17:00 PT', head: 'Jessica Alvarez', headTitle: 'Branch Manager', lat: 33.77, lon: -118.20 }
      ],
      ports: [
        P('USLAX', 'Port of Los Angeles', 'Los Angeles', 33.730, -118.260, 8.6, 16.2, 'Fenix, TraPac, Yusen, APMT Pier 400', 'Busiest container port in the Western Hemisphere.'),
        P('USLGB', 'Port of Long Beach', 'Long Beach', 33.750, -118.210, 8.0, 16.8, 'LBCT, TTI, ITS, SSA Pier J', 'San Pedro Bay twin port, gateway to US intermodal rail.'),
        P('USNYC', 'Port of New York & New Jersey', 'Newark / Elizabeth', 40.680, -74.150, 7.8, 15.2, 'Maher, APMT Elizabeth, GCT Bayonne, PNCT', 'Largest port on the US East Coast.'),
        P('USHOU', 'Port Houston', 'Houston', 29.680, -95.000, 3.8, 14.0, 'Barbours Cut, Bayport', 'Leading US Gulf Coast container gateway.')
      ] },
    { code: 'BR', name: 'Brazil', region: 'Americas', tz: 'BRT (UTC−3)', currency: 'BRL',
      offices: [{ type: 'Country Office', city: 'Santos', name: 'SRV Brazil', address: 'Rua Augusto Severo 34, Sala 1201, Valongo, Santos – SP, 11010-060, Brazil', phone: '+55 13 3219 4470', email: 'brazil@srvlogistics.com', hours: 'Mon–Fri 08:30–17:30 BRT', head: 'Rafael Costa', headTitle: 'Country Manager', lat: -23.93, lon: -46.33 }],
      ports: [P('BRSSZ', 'Port of Santos', 'Santos', -23.980, -46.300, 4.8, 15.0, 'Santos Brasil (Tecon), BTP, DP World Santos', 'Latin America’s busiest container port.')] }
  ];

  const REGIONS = ['Middle East', 'South Asia', 'Southeast Asia', 'East Asia', 'Oceania', 'Africa', 'Europe', 'Americas'];

  /* ---------------- Fleet (mock) ---------------- */
  const FLEET = [
    { name: 'SRV Chennai Star', teu: 4250, built: 2016, flag: 'India', loa: 260, beam: 32.3, reefer: 600, speed: 21, type: 'Panamax Container', service: 'CSX', owned: true },
    { name: 'SRV Jebel Ali', teu: 8500, built: 2019, flag: 'Marshall Islands', loa: 300, beam: 48.2, reefer: 800, speed: 22, type: 'Neo-Panamax Container', service: 'AEX', owned: true },
    { name: 'SRV Kaveri', teu: 2700, built: 2014, flag: 'India', loa: 210, beam: 30.0, reefer: 450, speed: 19, type: 'Sub-Panamax Container', service: 'GIX', owned: true },
    { name: 'SRV Arabian Pearl', teu: 6600, built: 2018, flag: 'Liberia', loa: 285, beam: 40.0, reefer: 700, speed: 21.5, type: 'Post-Panamax Container', service: 'MEX', owned: true },
    { name: 'SRV Coromandel', teu: 2500, built: 2013, flag: 'Panama', loa: 208, beam: 29.8, reefer: 400, speed: 19, type: 'Sub-Panamax Container', service: 'BBX', owned: false },
    { name: 'SRV Marina Bay', teu: 11000, built: 2021, flag: 'Singapore', loa: 336, beam: 48.4, reefer: 1000, speed: 22, type: 'Neo-Panamax Container (LNG-ready)', service: 'AEX', owned: true },
    { name: 'SRV Meenakshi', teu: 5000, built: 2017, flag: 'India', loa: 275, beam: 37.3, reefer: 650, speed: 21, type: 'Post-Panamax Container', service: 'IAX', owned: true },
    { name: 'SRV Gulf Spirit', teu: 3500, built: 2015, flag: 'Marshall Islands', loa: 231, beam: 32.2, reefer: 500, speed: 20, type: 'Panamax Container', service: 'GIX', owned: false },
    { name: 'SRV Vaigai', teu: 1800, built: 2012, flag: 'India', loa: 175, beam: 27.6, reefer: 300, speed: 18.5, type: 'Feeder Max', service: 'BSF', owned: true },
    { name: 'SRV Palk Strait', teu: 1700, built: 2011, flag: 'Panama', loa: 172, beam: 27.4, reefer: 280, speed: 18, type: 'Feeder Max', service: 'JKX', owned: false },
    { name: 'SRV Indus Crest', teu: 7200, built: 2020, flag: 'Liberia', loa: 294, beam: 42.8, reefer: 750, speed: 22, type: 'Post-Panamax Container', service: 'IUX', owned: true },
    { name: 'SRV Thamirabarani', teu: 4800, built: 2016, flag: 'India', loa: 268, beam: 35.2, reefer: 620, speed: 21, type: 'Panamax Container', service: 'SAX', owned: true },
    { name: 'SRV Desert Rose', teu: 6400, built: 2018, flag: 'Marshall Islands', loa: 280, beam: 40.0, reefer: 700, speed: 21.5, type: 'Post-Panamax Container', service: 'MEX', owned: false },
    { name: 'SRV Malabar', teu: 3100, built: 2014, flag: 'Panama', loa: 220, beam: 32.2, reefer: 480, speed: 20, type: 'Panamax Container', service: 'SEA', owned: false },
    { name: 'SRV Konark', teu: 5300, built: 2017, flag: 'Singapore', loa: 277, beam: 37.4, reefer: 650, speed: 21, type: 'Post-Panamax Container', service: 'OCX', owned: true },
    { name: 'SRV Pacific Dawn', teu: 9400, built: 2020, flag: 'Singapore', loa: 316, beam: 48.2, reefer: 900, speed: 22.5, type: 'Neo-Panamax Container', service: 'TPX', owned: true },
    { name: 'SRV Atlantic Bridge', teu: 6800, built: 2019, flag: 'Liberia', loa: 287, beam: 42.8, reefer: 760, speed: 22, type: 'Post-Panamax Container', service: 'ATX', owned: false },
    { name: 'SRV Cape Comorin', teu: 5600, built: 2018, flag: 'India', loa: 279, beam: 40.0, reefer: 680, speed: 21.5, type: 'Post-Panamax Container', service: 'ESX', owned: true },
    { name: 'SRV Nilgiri', teu: 2900, built: 2013, flag: 'India', loa: 215, beam: 30.6, reefer: 420, speed: 19.5, type: 'Sub-Panamax Container', service: 'WAX', owned: true },
    { name: 'SRV Horizon', teu: 13200, built: 2023, flag: 'Marshall Islands', loa: 366, beam: 51.0, reefer: 1200, speed: 22, type: 'Neo-Panamax Container (Methanol dual-fuel)', service: 'AEX', owned: true }
  ];

  /* ---------------- Careers (mock) ---------------- */
  const JOBS = [
    { id: 'J-2611', title: 'Senior Operations Executive – Vessel Planning', dept: 'Operations', location: 'Chennai, India', type: 'Full-time', exp: '4–7 years', posted: '2026-11-12', desc: 'Plan stowage and coordinate port calls for GIX and CSX services from the Chennai OMC. Liaise with terminals, agents and the marine team to deliver schedule reliability.' },
    { id: 'J-2612', title: 'Equipment Control Analyst', dept: 'Operations', location: 'Chennai, India', type: 'Full-time', exp: '2–4 years', posted: '2026-11-10', desc: 'Manage container repositioning, empty evacuation and lease on/off-hire decisions across the Indian subcontinent.' },
    { id: 'J-2613', title: 'Key Account Manager – Gulf', dept: 'Sales & Commercial', location: 'Dubai, UAE', type: 'Full-time', exp: '6+ years', posted: '2026-11-08', desc: 'Own and grow a portfolio of BCO and freight-forwarder accounts across the GCC. Drive annual tenders and contract negotiations.' },
    { id: 'J-2614', title: 'Pricing Analyst – Asia–Europe Trade', dept: 'Sales & Commercial', location: 'Singapore', type: 'Full-time', exp: '3–5 years', posted: '2026-11-05', desc: 'Build spot and contract pricing for AEX, monitor market indices and support yield-management decisions.' },
    { id: 'J-2615', title: 'Full-Stack Engineer – Digital Platform', dept: 'Technology', location: 'Chennai, India', type: 'Full-time', exp: '3–6 years', posted: '2026-11-14', desc: 'Build the next generation of SRV’s booking, tracking and documentation platform. TypeScript, Node.js, PostgreSQL, cloud-native.' },
    { id: 'J-2616', title: 'Data Engineer – Network Analytics', dept: 'Technology', location: 'Dubai, UAE', type: 'Full-time', exp: '3–5 years', posted: '2026-10-30', desc: 'Design data pipelines for vessel positions, terminal events and commercial KPIs powering the global control tower.' },
    { id: 'J-2617', title: 'Customer Service Representative – Export', dept: 'Customer Experience', location: 'Navi Mumbai, India', type: 'Full-time', exp: '1–3 years', posted: '2026-11-11', desc: 'Handle bookings, documentation and shipment updates for West India exporters on GIX, IAX and IUX.' },
    { id: 'J-2618', title: 'Customs & Compliance Specialist', dept: 'Finance & Compliance', location: 'Rotterdam, Netherlands', type: 'Full-time', exp: '4+ years', posted: '2026-10-28', desc: 'Ensure ICS2, AEO and EU customs compliance for all European discharges and transhipments.' },
    { id: 'J-2619', title: 'Marine Superintendent', dept: 'Fleet & Marine', location: 'Singapore', type: 'Full-time', exp: '8+ years (Chief Engineer / Master)', posted: '2026-11-02', desc: 'Technical oversight of the owned fleet: dry-docking, class surveys, energy efficiency (CII/EEXI) and crew safety.' },
    { id: 'J-2620', title: 'Logistics Coordinator – Project Cargo', dept: 'Logistics Solutions', location: 'Houston, United States', type: 'Full-time', exp: '3–5 years', posted: '2026-11-09', desc: 'Coordinate break-bulk and out-of-gauge moves for energy-sector customers, from survey to final delivery.' },
    { id: 'J-2621', title: 'Sustainability Analyst', dept: 'Strategy & Sustainability', location: 'Rotterdam, Netherlands', type: 'Full-time', exp: '2–4 years', posted: '2026-11-13', desc: 'Model fleet emissions, support EU ETS reporting and develop green-corridor customer offerings.' },
    { id: 'J-2622', title: 'Graduate Trainee – Shipping & Logistics (2027 Intake)', dept: 'Graduate Programme', location: 'Chennai, India', type: 'Graduate', exp: 'Freshers', posted: '2026-11-15', desc: 'An 18-month rotational programme across operations, commercial, finance and technology at the Chennai OMC and Dubai HQ.' },
    { id: 'J-2623', title: 'Branch Accountant', dept: 'Finance & Compliance', location: 'Durban, South Africa', type: 'Full-time', exp: '3+ years', posted: '2026-10-25', desc: 'Manage local accounting, freight invoicing, collections and month-end close for Southern Africa.' },
    { id: 'J-2624', title: 'Reefer Cargo Specialist', dept: 'Operations', location: 'Santos, Brazil', type: 'Full-time', exp: '3–5 years', posted: '2026-11-06', desc: 'Oversee temperature-controlled exports (fruit, meat, coffee) including pre-trip inspection and cold-treatment protocols.' }
  ];

  /* ---------------- News (mock) ---------------- */
  const NEWS = [
    { date: '2026-11-18', tag: 'Network', title: 'SRV launches weekly Bay of Bengal Express linking Chennai, Kolkata and Chattogram with Singapore', excerpt: 'The new BBX loop adds fixed-day capacity for east-coast India and Bangladesh exporters with a 9-day transit to Singapore.' },
    { date: '2026-10-29', tag: 'Fleet', title: 'SRV Horizon, the group’s first methanol dual-fuel vessel, joins the Asia–Europe Express', excerpt: 'The 13,200 TEU vessel cuts well-to-wake emissions by up to 65% when operating on green methanol.' },
    { date: '2026-09-15', tag: 'Digital', title: 'Chennai Operations & Management Centre goes live with 24×7 global control tower', excerpt: 'Real-time visibility across 20 vessels, 50+ ports and 180,000 containers — managed from Chennai Port.' },
    { date: '2026-08-02', tag: 'Corporate', title: 'Board welcomes three independent directors from the UAE, Netherlands and Singapore', excerpt: 'Khalid Al Mansoori, Hendrik van der Berg and Mei Ling Tan join the SRV Board to strengthen governance and global reach.' }
  ];

  const CONTAINERS = [
    { code: '20GP', name: '20′ Dry Standard', factor: 1.0, teu: 1, maxKg: 28200, cbm: 33.2 },
    { code: '40GP', name: '40′ Dry Standard', factor: 1.6, teu: 2, maxKg: 26700, cbm: 67.7 },
    { code: '40HC', name: '40′ High Cube', factor: 1.7, teu: 2, maxKg: 26500, cbm: 76.3 },
    { code: '45HC', name: '45′ High Cube', factor: 1.9, teu: 2.25, maxKg: 27700, cbm: 86.0 },
    { code: '20RF', name: '20′ Reefer', factor: 2.0, teu: 1, maxKg: 27400, cbm: 28.3, reefer: true },
    { code: '40RH', name: '40′ Reefer High Cube', factor: 2.4, teu: 2, maxKg: 29000, cbm: 67.3, reefer: true },
    { code: '20OT', name: '20′ Open Top', factor: 1.35, teu: 1, maxKg: 28100, cbm: 32.0 },
    { code: '40FR', name: '40′ Flat Rack', factor: 2.1, teu: 2, maxKg: 40000, cbm: 0 }
  ];

  window.SRV_DATA = { SITE, LEADERSHIP, WAYPOINTS, SERVICES, COUNTRIES, REGIONS, FLEET, JOBS, NEWS, CONTAINERS };
})();
