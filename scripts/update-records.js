// ============================================================
// update-records.js — Race Control Dashboard rekord frissítő
// Futtatás: node scripts/update-records.js
// ============================================================
// Működés:
//   1. Végigmegy a lezajlott WSBK fordulókon → Superpole PDF-ből
//      kinyeri a legjobb időt → ha jobb mint WSBK_RECORDS → frissít
//   2. Végigmegy a lezajlott MotoGP fordulókon → API-ból
//      kinyeri a Q2 legjobb időt → ha jobb mint MOTOGP_RECORDS → frissít
//   3. Ha volt változás → felülírja a records.js-t
// ============================================================

import fetch from 'node-fetch';
import pdf   from 'pdf-parse';
import fs    from 'fs';
import path  from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RECORDS_PATH = path.join(__dirname, '..', 'records.js');

// ============================================================
// KONFIGURÁCIÓ — proxy URL-ek
// ============================================================
const WSBK_PROXY   = process.env.WSBK_PROXY   || 'https://motogp-proxy.porkolab-jozsef.workers.dev/wsbk-pdf/';
const MOTOGP_PROXY = process.env.MOTOGP_PROXY  || 'https://motogp-proxy.porkolab-jozsef.workers.dev/';

// ============================================================
// WSBK NAPTÁR — az app wsbk.js-éből szinkronban tartandó!
// ============================================================
const WSBK_EVENTS = {
  '2026': [
    {code:'AUS',series:['SBK','SSP'],                             dateEnd:'2026-02-22'},
    {code:'POR',series:['SBK','SSP','WCR','SPB'],                 dateEnd:'2026-03-29'},
    {code:'NED',series:['SBK','SSP','WCR','SPB'],                 dateEnd:'2026-04-19'},
    {code:'HUN',series:['SBK','SSP','WCR','R3'],                  dateEnd:'2026-05-03'},
    {code:'CZE',series:['SBK','SSP','SPB'],                       dateEnd:'2026-05-17'},
    {code:'ARA',series:['SBK','SSP','SPB','R3'],                  dateEnd:'2026-05-31'},
    {code:'ITA',series:['SBK','SSP','WCR','SPB'],                 dateEnd:'2026-06-14'},
    {code:'GBR',series:['SBK','SSP','WCR','R3'],                  dateEnd:'2026-07-12'},
    {code:'FRA',series:['SBK','SSP','WCR','SPB','R3'],            dateEnd:'2026-09-06'},
    {code:'CRE',series:['SBK','SSP','SPB','R3'],                  dateEnd:'2026-09-20'},
    {code:'EST',series:['SBK','SSP','WCR','SPB','R3'],            dateEnd:'2026-10-11'},
    {code:'JER',series:['SBK','SSP','WCR','SPB'],                 dateEnd:'2026-10-18'},
  ],
  '2025': [
    {code:'AUS',series:['SBK','SSP','R3'],                        dateEnd:'2025-02-23'},
    {code:'POR',series:['SBK','SSP','R3'],                        dateEnd:'2025-03-30'},
    {code:'NED',series:['SBK','SSP','WCR','R3'],                  dateEnd:'2025-04-13'},
    {code:'ITA',series:['SBK','SSP','WCR','R3'],                  dateEnd:'2025-05-04'},
    {code:'MOS',series:['SBK','SSP','R3'],                        dateEnd:'2025-05-18'},
    {code:'RSM',series:['SBK','SSP','WCR','R3'],                  dateEnd:'2025-06-15'},
    {code:'GBR',series:['SBK','SSP','WCR','R3'],                  dateEnd:'2025-07-13'},
    {code:'HUN',series:['SBK','SSP','WCR','R3'],                  dateEnd:'2025-07-27'},
    {code:'FRA',series:['SBK','SSP','WCR','R3'],                  dateEnd:'2025-09-07'},
    {code:'ARA',series:['SBK','SSP','R3'],                        dateEnd:'2025-09-28'},
    {code:'EST',series:['SBK','SSP','R3'],                        dateEnd:'2025-10-12'},
    {code:'ESP',series:['SBK','SSP','WCR','R3'],                  dateEnd:'2025-10-19'},
  ]
};

// WSBK sorozat → URL kód leképezés
const WSBK_SERIES_URL = { SBK:'SBK', SSP:'SSP', WCR:'WCR', SPB:'SPB', R3:'YR3EC' };

// ============================================================
// MOTOGP NAPTÁR — az app index.html SEASON_EVENTS-éből
// ============================================================
const MOTOGP_EVENTS = {
  '2026': [
    {code:'THA',dateEnd:'2026-03-01'},{code:'BRA',dateEnd:'2026-03-22'},
    {code:'USA',dateEnd:'2026-03-29'},{code:'SPA',dateEnd:'2026-04-26'},
    {code:'FRA',dateEnd:'2026-05-10'},{code:'CAT',dateEnd:'2026-05-17'},
    {code:'ITA',dateEnd:'2026-05-31'},{code:'HUN',dateEnd:'2026-06-07'},
    {code:'CZE',dateEnd:'2026-06-21'},{code:'NED',dateEnd:'2026-06-28'},
    {code:'GER',dateEnd:'2026-07-12'},{code:'GBR',dateEnd:'2026-08-09'},
    {code:'ARA',dateEnd:'2026-08-30'},{code:'RSM',dateEnd:'2026-09-13'},
    {code:'AUT',dateEnd:'2026-09-20'},{code:'JPN',dateEnd:'2026-10-04'},
    {code:'INA',dateEnd:'2026-10-11'},{code:'AUS',dateEnd:'2026-10-25'},
    {code:'MAL',dateEnd:'2026-11-01'},{code:'QAT',dateEnd:'2026-11-10'},
    {code:'POR',dateEnd:'2026-11-15'},{code:'VAL',dateEnd:'2026-11-22'},
    {code:'ARG',dateEnd:'2026-12-06'},
  ],
  '2025': [
    {code:'THA'},{code:'ARG'},{code:'USA'},{code:'QAT'},{code:'SPA'},
    {code:'FRA'},{code:'GBR'},{code:'ARA'},{code:'ITA'},{code:'NED'},
    {code:'GER'},{code:'CZE'},{code:'AUT'},{code:'HUN'},{code:'RSM'},
    {code:'INA'},{code:'JPN'},{code:'AUS'},{code:'MAL'},{code:'POR'},
    {code:'VAL'}
  ]
};

const MOTOGP_CATEGORIES = ['MotoGP','Moto2','Moto3'];
const SEASON_UUIDS = {
  '2026': 'e88b4e43-2209-47aa-8e83-0e0b1cedde6e',
  '2025': 'ae6c6f0d-c652-44f8-94aa-420fc5b3dab4',
};
const CAT_UUIDS = {
  'MotoGP': 'e8c110ad-64aa-4e8e-8a86-f2f152f6a942',
  'Moto2':  '549640b8-fd9c-4245-acfd-60e4bc38b25c',
  'Moto3':  '954f7e65-2ef2-4423-b949-4961cc603e45',
};

// ============================================================
// SEGÉDFÜGGVÉNYEK
// ============================================================

// Időstring → másodperc (pl. "1'32.144" → 92.144)
function timeToSec(t) {
  const m = /(\d+)'(\d{2})\.(\d{3})/.exec(t);
  if (!m) return Infinity;
  return parseInt(m[1]) * 60 + parseInt(m[2]) + parseInt(m[3]) / 1000;
}

// Másodperc → időstring (pl. 92.144 → "1'32.144")
function secToTime(s) {
  const mins = Math.floor(s / 60);
  const secs = s - mins * 60;
  const ms   = Math.round((secs % 1) * 1000);
  return `${mins}'${String(Math.floor(secs)).padStart(2,'0')}.${String(ms).padStart(3,'0')}`;
}

// Lezajlott-e a forduló?
function isFinished(dateEnd) {
  if (!dateEnd) return true; // 2025 fordulók dateEnd nélkül → mind lezajlott
  return new Date(dateEnd + 'T23:59:00Z') < new Date();
}

// HTTP fetch timeout-tal
async function fetchWithTimeout(url, timeoutMs = 15000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    return r;
  } catch(e) {
    clearTimeout(t);
    throw e;
  }
}

// MotoGP API hívás
async function apiGet(path) {
  const r = await fetchWithTimeout(MOTOGP_PROXY + path);
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${path}`);
  return r.json();
}

// ============================================================
// WSBK PDF LEGJOBB IDŐ KINYERÉSE
// A Superpole PDF-ből kinyerjük a pole-idő + versenyző nevét
// ============================================================
async function fetchWsbkBestLap(year, eventCode, series) {
  const seriesUrl = WSBK_SERIES_URL[series];
  if (!seriesUrl) return null;

  const url = `${WSBK_PROXY}${year}/${eventCode}/${seriesUrl}/Q1A/CLA/Results.pdf`;
  try {
    const r = await fetchWithTimeout(url, 20000);
    if (!r.ok) return null;
    const buf  = Buffer.from(await r.arrayBuffer());
    const data = await pdf(buf);
    const text = data.text;

    // A Superpole PDF-ben a legjobb kör: az 1. helyezett ideje
    // Mintázat: "1 [SZÁM] I. VERSENYZO NAT ... 1'32.144 ..."
    const timeRe = /\b(\d'\d{2}\.\d{3})\b/g;
    const times = [];
    let m;
    while ((m = timeRe.exec(text)) !== null) {
      times.push(m[1]);
    }
    if (!times.length) return null;

    // Legkisebb idő = legjobb kör
    const best = times.reduce((a, b) => timeToSec(a) < timeToSec(b) ? a : b);

    // Versenyző neve: az 1. sor első nagybetűs "X. Nev" minta
    const nameRe = /\b([A-Z])\.\s+([A-Z][a-z][A-Za-z\-]+)\b/g;
    const names = [];
    while ((m = nameRe.exec(text)) !== null) {
      names.push(`${m[1]}. ${m[2]}`);
    }

    return { time: best, rider: names[0] || '?', year: parseInt(year) };
  } catch(e) {
    console.log(`  ⚠ WSBK PDF hiba (${year}/${eventCode}/${series}): ${e.message}`);
    return null;
  }
}

// ============================================================
// MOTOGP API: Q2 legjobb köridő kinyerése
// ============================================================
async function fetchMotogpBestLap(year, eventCode, category) {
  try {
    const seasonUuid = SEASON_UUIDS[year];
    if (!seasonUuid) return null;

    // Esemény keresése
    const events = await apiGet(`events?seasonUuid=${seasonUuid}&isFinished=true`);
    const ev = events.find(e =>
      (e.short_name || '').toUpperCase() === eventCode.toUpperCase() ||
      (e.additional_name || '').toUpperCase() === eventCode.toUpperCase() ||
      (e.country?.iso || '').toUpperCase() === eventCode.toUpperCase()
    );
    if (!ev) return null;

    // Sessionök lekérése
    const sessions = await apiGet(`sessions?eventUuid=${ev.id}&categoryUuid=${CAT_UUIDS[category]}`);

    // Q2 keresése (vagy legjobb elérhető qualifying)
    const qSessions = sessions.filter(s =>
      (s.type || '').toUpperCase().includes('Q') ||
      (s.type || '').toUpperCase() === 'SPR'
    );
    // Preferencia: Q2 > Q1 > bármi
    const q2 = qSessions.find(s => (s.type||'').toUpperCase() === 'Q2');
    const q1 = qSessions.find(s => (s.type||'').toUpperCase() === 'Q1');
    const sess = q2 || q1 || qSessions[qSessions.length-1];
    if (!sess) return null;

    // Klasszifikáció
    const cls = await apiGet(`session/${sess.id}/classification?test=false`);
    const riders = cls.classification || cls;
    if (!riders || !riders.length) return null;

    // P1 versenyző
    const p1 = riders[0];
    const lapTime = p1.best_lap?.time || p1.time || p1.gap_to_first;
    if (!lapTime || !lapTime.includes("'")) return null;

    // Versenyző neve: rövidített formátum
    const first = (p1.rider?.name || p1.name || '').split(' ');
    const lastName  = first[first.length-1] || '';
    const firstName = first[0] || '';
    const shortName = firstName ? `${firstName.charAt(0)}. ${lastName}` : lastName;

    return { time: lapTime, rider: shortName, year: parseInt(year) };
  } catch(e) {
    console.log(`  ⚠ MotoGP API hiba (${year}/${eventCode}/${category}): ${e.message}`);
    return null;
  }
}

// ============================================================
// RECORDS.JS BEOLVASÁSA ÉS ÍRÁSA
// A fájl két JS objektumot tartalmaz: WSBK_RECORDS és MOTOGP_RECORDS
// Ezeket eval-lal töltjük be, majd módosítjuk, majd visszaírjuk
// ============================================================

function loadRecords() {
  const src = fs.readFileSync(RECORDS_PATH, 'utf8');
  // Kiértékeljük a fájlt egy sandboxed kontextusban
  const sandbox = {};
  // Egyszerű eval — biztonságos, mert saját fájlunk
  const fn = new Function('module', 'exports', src + '\nmodule.exports={WSBK_RECORDS,MOTOGP_RECORDS};');
  const mod = { exports: {} };
  fn(mod, mod.exports);
  return { src, WSBK_RECORDS: mod.exports.WSBK_RECORDS, MOTOGP_RECORDS: mod.exports.MOTOGP_RECORDS };
}

// Egy rekord sor szöveges frissítése a records.js-ben
// Pl.: SBK: {time:"1'32.144", rider:'N. Bulega', year:2026}
function updateRecordInSrc(src, section, trackCode, series, newRec) {
  // Megtaláljuk a megfelelő blokkot:
  // 'CZE': { ... SBK: {time:"...", rider:'...', year:...}, ...
  // Rugalmas regex ami megtalálja a sor-t a megfelelő section-ben
  const escapedCode = trackCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedSeries = series.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Keressük a section-t (WSBK_RECORDS vagy MOTOGP_RECORDS)
  const sectionStart = src.indexOf(`var ${section}`);
  if (sectionStart === -1) {
    console.log(`  ⚠ Szekció nem található: ${section}`);
    return src;
  }

  // A pályakód blokkjában keressük a sorozat sorát
  // Minta: SBK: {time:"1'32.144", rider:'N. Bulega', year:2025}
  const blockRe = new RegExp(
    `('${escapedCode}'\\s*:\\s*\\{[^}]*?(?:\\{[^}]*\\}[^}]*)*?)` +  // pályakód blokk
    `(${escapedSeries}\\s*:\\s*\\{time:[^}]+\\})`,                    // sorozat sor
    's'
  );

  const newLine = `${series}: {time:"${newRec.time}", rider:'${newRec.rider}', year:${newRec.year}}`;

  // Csak a section utáni részben cseréljük
  const before = src.slice(0, sectionStart);
  const after  = src.slice(sectionStart);
  const updated = after.replace(blockRe, (full, prefix, oldLine) => {
    return prefix + newLine;
  });

  if (updated === after) {
    console.log(`  ⚠ Nem sikerült frissíteni: ${section}['${trackCode}'].${series}`);
    return src;
  }

  return before + updated;
}

// ============================================================
// FŐ LOGIKA
// ============================================================
async function main() {
  console.log('=== Race Control Dashboard — Rekord frissítő ===');
  console.log(`Futás ideje: ${new Date().toISOString()}`);

  const { src: originalSrc, WSBK_RECORDS, MOTOGP_RECORDS } = loadRecords();
  let src = originalSrc;
  let changes = 0;

  // ──────────────────────────────────────────────────────────
  // 1. WSBK fordulók
  // ──────────────────────────────────────────────────────────
  console.log('\n--- WSBK ellenőrzés ---');
  for (const [year, events] of Object.entries(WSBK_EVENTS)) {
    for (const ev of events) {
      if (!isFinished(ev.dateEnd)) {
        console.log(`⏭ ${year}/${ev.code} — még nem zajlott le`);
        continue;
      }

      for (const series of ev.series) {
        const current = WSBK_RECORDS[ev.code]?.[series];
        if (!current) continue; // nem releváns mező (pl. WCR Never pálya)

        // Üres mezőt is próbálunk feltölteni
        const fetched = await fetchWsbkBestLap(year, ev.code, series);
        if (!fetched) continue;

        const currentSec = current.time === '\u2014' ? Infinity : timeToSec(current.time);
        const fetchedSec = timeToSec(fetched.time);

        if (fetchedSec < currentSec) {
          console.log(`✅ FRISSÍTVE: WSBK_RECORDS['${ev.code}'].${series}`);
          console.log(`   ${current.time || '—'} → ${fetched.time} (${fetched.rider}, ${fetched.year})`);
          src = updateRecordInSrc(src, 'WSBK_RECORDS', ev.code, series, fetched);
          // Frissítjük az in-memory objektumot is (következő körök összehasonlításához)
          if (WSBK_RECORDS[ev.code]) {
            WSBK_RECORDS[ev.code][series] = fetched;
          }
          changes++;
        } else {
          console.log(`  — ${year}/${ev.code}/${series}: nincs jobb (${current.time || '—'} ≤ ${fetched.time})`);
        }

        // Rövid várakozás a szerver terhelés elkerülésére
        await sleep(500);
      }
    }
  }

  // ──────────────────────────────────────────────────────────
  // 2. MotoGP fordulók
  // ──────────────────────────────────────────────────────────
  console.log('\n--- MotoGP ellenőrzés ---');
  for (const [year, events] of Object.entries(MOTOGP_EVENTS)) {
    for (const ev of events) {
      if (!isFinished(ev.dateEnd)) {
        console.log(`⏭ ${year}/${ev.code} MotoGP — még nem zajlott le`);
        continue;
      }

      for (const cat of MOTOGP_CATEGORIES) {
        const current = MOTOGP_RECORDS[ev.code]?.[cat];
        if (!current) continue;

        const fetched = await fetchMotogpBestLap(year, ev.code, cat);
        if (!fetched) continue;

        const currentSec = current.time === '\u2014' ? Infinity : timeToSec(current.time);
        const fetchedSec = timeToSec(fetched.time);

        if (fetchedSec < currentSec) {
          console.log(`✅ FRISSÍTVE: MOTOGP_RECORDS['${ev.code}'].${cat}`);
          console.log(`   ${current.time || '—'} → ${fetched.time} (${fetched.rider}, ${fetched.year})`);
          src = updateRecordInSrc(src, 'MOTOGP_RECORDS', ev.code, cat, fetched);
          if (MOTOGP_RECORDS[ev.code]) {
            MOTOGP_RECORDS[ev.code][cat] = fetched;
          }
          changes++;
        } else {
          console.log(`  — ${year}/${ev.code}/${cat}: nincs jobb (${current.time || '—'} ≤ ${fetched.time})`);
        }

        await sleep(300);
      }
    }
  }

  // ──────────────────────────────────────────────────────────
  // 3. Eredmény
  // ──────────────────────────────────────────────────────────
  console.log(`\n=== Összesítés: ${changes} rekord frissítve ===`);

  if (changes > 0) {
    // Frissítjük a "Utolsó frissítés" dátumot is a fájl fejlécében
    const today = new Date().toISOString().split('T')[0];
    src = src.replace(
      /\/\/ Utolsó frissítés: \d{4}-\d{2}-\d{2}/,
      `// Utolsó frissítés: ${today}`
    );
    fs.writeFileSync(RECORDS_PATH, src, 'utf8');
    console.log(`records.js mentve: ${RECORDS_PATH}`);
  } else {
    console.log('Nincs változás, records.js érintetlen marad.');
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

main().catch(e => {
  console.error('Hiba a frissítő futása közben:', e);
  process.exit(1);
});
