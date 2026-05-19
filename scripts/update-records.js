// ============================================================
// update-records.js — Race Control Dashboard rekord + standings frissítő
// Futtatás: node scripts/update-records.js
// ============================================================

import fetch from 'node-fetch';
import pdf   from 'pdf-parse';
import fs    from 'fs';
import path  from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RECORDS_PATH = path.join(__dirname, '..', 'records.js');
const WSBK_PATH    = path.join(__dirname, '..', 'wsbk.js');

const WSBK_PROXY   = process.env.WSBK_PROXY   || 'https://motogp-proxy.porkolab-jozsef.workers.dev/wsbk-pdf/';
const MOTOGP_PROXY = process.env.MOTOGP_PROXY  || 'https://motogp-proxy.porkolab-jozsef.workers.dev/';

const WSBK_EVENTS = {
  '2026': [
    {code:'AUS', series:['SBK','SSP'],                  dateEnd:'2026-02-22'},
    {code:'POR', series:['SBK','SSP','WCR','SPB'],       dateEnd:'2026-03-29'},
    {code:'NED', series:['SBK','SSP','WCR','SPB'],       dateEnd:'2026-04-19'},
    {code:'HUN', series:['SBK','SSP','WCR','R3'],        dateEnd:'2026-05-03'},
    {code:'CZE', series:['SBK','SSP','SPB'],             dateEnd:'2026-05-17'},
    {code:'ARA', series:['SBK','SSP','SPB','R3'],        dateEnd:'2026-05-31'},
    {code:'ITA', series:['SBK','SSP','WCR','SPB'],       dateEnd:'2026-06-14'},
    {code:'GBR', series:['SBK','SSP','WCR','R3'],        dateEnd:'2026-07-12'},
    {code:'FRA', series:['SBK','SSP','WCR','SPB','R3'],  dateEnd:'2026-09-06'},
    {code:'CRE', series:['SBK','SSP','SPB','R3'],        dateEnd:'2026-09-20'},
    {code:'EST', series:['SBK','SSP','WCR','SPB','R3'],  dateEnd:'2026-10-11'},
    {code:'JER', series:['SBK','SSP','WCR','SPB'],       dateEnd:'2026-10-18'},
  ],
  '2025': [
    {code:'AUS', series:['SBK','SSP','R3'],              dateEnd:'2025-02-23'},
    {code:'POR', series:['SBK','SSP','R3'],              dateEnd:'2025-03-30'},
    {code:'NED', series:['SBK','SSP','WCR','R3'],        dateEnd:'2025-04-13'},
    {code:'ITA', series:['SBK','SSP','WCR','R3'],        dateEnd:'2025-05-04'},
    {code:'MOS', series:['SBK','SSP','R3'],              dateEnd:'2025-05-18'},
    {code:'RSM', series:['SBK','SSP','WCR','R3'],        dateEnd:'2025-06-15'},
    {code:'GBR', series:['SBK','SSP','WCR','R3'],        dateEnd:'2025-07-13'},
    {code:'HUN', series:['SBK','SSP','WCR','R3'],        dateEnd:'2025-07-27'},
    {code:'FRA', series:['SBK','SSP','WCR','R3'],        dateEnd:'2025-09-07'},
    {code:'ARA', series:['SBK','SSP','R3'],              dateEnd:'2025-09-28'},
    {code:'EST', series:['SBK','SSP','R3'],              dateEnd:'2025-10-12'},
    {code:'ESP', series:['SBK','SSP','WCR','R3'],        dateEnd:'2025-10-19'},
  ]
};

const WSBK_SERIES_URL = { SBK:'SBK', SSP:'SSP', WCR:'WCR', SPB:'SPB', R3:'YR3EC' };

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

function timeToSec(t) {
  const m = /(\d+)'(\d{2})\.(\d{3})/.exec(t);
  if (!m) return Infinity;
  return parseInt(m[1]) * 60 + parseInt(m[2]) + parseInt(m[3]) / 1000;
}

function isFinished(dateEnd) {
  if (!dateEnd) return true;
  return new Date(dateEnd + 'T23:59:00Z') < new Date();
}

async function fetchWithTimeout(url, timeoutMs = 20000) {
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

async function apiGet(path) {
  const r = await fetchWithTimeout(MOTOGP_PROXY + path);
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${path}`);
  return r.json();
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchPdfText(url) {
  const r = await fetchWithTimeout(url, 25000);
  if (!r.ok) return null;
  const buf  = Buffer.from(await r.arrayBuffer());
  const data = await pdf(buf);
  return data.text;
}

async function fetchWsbkBestLap(year, eventCode, series) {
  const seriesUrl = WSBK_SERIES_URL[series];
  if (!seriesUrl) return null;
  const url = `${WSBK_PROXY}${year}/${eventCode}/${seriesUrl}/Q1A/CLA/Results.pdf`;
  try {
    const text = await fetchPdfText(url);
    if (!text) return null;

    // Legjobb körös keresése (max 5 perc = 300 sec)
    const timeRe = /\b(\d'\d{2}\.\d{3})\b/g;
    const times = [];
    let m;
    while ((m = timeRe.exec(text)) !== null) times.push(m[1]);
    if (!times.length) return null;

    const valid = times.filter(t => timeToSec(t) < 300);
    if (!valid.length) return null;
    const best = valid.reduce((a, b) => timeToSec(a) < timeToSec(b) ? a : b);

    // A legjobb körös pozíciója a szövegben
    const bestPos = text.indexOf(best);
    const prefix  = text.slice(0, bestPos + best.length);

    // Csupa nagybetűs név keresése visszafelé: "N. BULEGA"
    const NOISE = new Set(['ITA','ESP','GBR','USA','AUS','POR','FRA','GER','NED',
      'BEL','JPN','THA','INA','MAL','TUR','BRA','DOM','AUT','ARG','SUI','RSA',
      'CAN','FIN','SWE','NOR','KOR','CHI','MEX','POL','CZE','DEN','IND','SBK',
      'SSP','WCR','SPB','FIM','BMW','VDS','HRC','RR','ELF','GRT','CLA','STD',
      'SUP','NAT','POS','GRID','LAP','GAP','CLASS','BIKE','TEAM','RIDER','LAPS',
      'TIME','RACE','BEST','SPEED','FASTEST','QUALIFYING']);

    const nameRe2 = /([A-Z])\.\s+([A-Z]{2,}(?:-[A-Z]{2,})?)/g;
    const namesWithPos = [];
    while ((m = nameRe2.exec(prefix)) !== null) {
      if (!NOISE.has(m[2]) && m[2].length >= 3) {
        namesWithPos.push({ pos: m.index, first: m[1], last: m[2] });
      }
    }

    let riderName = '?';
    if (namesWithPos.length) {
      // A legjobb körhoz legközelebb lévő (utolsó a prefix-ben)
      const closest = namesWithPos[namesWithPos.length - 1];
      // Formázás: "N. Bulega" (kezdőbetű nagybetű, többi kisbetű)
      const lastName = closest.last.charAt(0) + closest.last.slice(1).toLowerCase();
      riderName = `${closest.first}. ${lastName}`;
    }

    return { time: best, rider: riderName, year: parseInt(year) };
  } catch(e) {
    console.log(`  ⚠ WSBK PDF hiba (${year}/${eventCode}/${series}): ${e.message}`);
    return null;
  }
}

async function fetchMotogpBestLap(year, eventCode, category) {
  try {
    const seasonUuid = SEASON_UUIDS[year];
    if (!seasonUuid) return null;

    const events = await apiGet(`events?seasonUuid=${seasonUuid}&isFinished=true`);
    const ev = events.find(e =>
      (e.short_name || '').toUpperCase() === eventCode.toUpperCase() ||
      (e.additional_name || '').toUpperCase() === eventCode.toUpperCase() ||
      (e.country?.iso || '').toUpperCase() === eventCode.toUpperCase()
    );
    if (!ev) return null;

    const sessions = await apiGet(`sessions?eventUuid=${ev.id}&categoryUuid=${CAT_UUIDS[category]}`);
    const qSessions = sessions.filter(s =>
      (s.type || '').toUpperCase().includes('Q') ||
      (s.type || '').toUpperCase() === 'SPR'
    );
    const q2 = qSessions.find(s => (s.type||'').toUpperCase() === 'Q2');
    const q1 = qSessions.find(s => (s.type||'').toUpperCase() === 'Q1');
    const sess = q2 || q1 || qSessions[qSessions.length-1];
    if (!sess) return null;

    const cls = await apiGet(`session/${sess.id}/classification?test=false`);
    const riders = cls.classification || cls;
    if (!riders || !riders.length) return null;

    const p1 = riders[0];
    const lapTime = p1.best_lap?.time || p1.time || p1.gap_to_first;
    if (!lapTime || !lapTime.includes("'")) return null;

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

async function fetchWsbkStandings(year, eventCode, series) {
  const seriesUrl = WSBK_SERIES_URL[series];
  if (!seriesUrl) return null;
  const url = `${WSBK_PROXY}${year}/${eventCode}/${seriesUrl}/003/STD/ChampionshipStandings.pdf`;
  try {
    const text = await fetchPdfText(url);
    if (!text) return null;
    return parseStandingsPdf(text);
  } catch(e) {
    console.log(`  ⚠ Standings PDF hiba (${year}/${eventCode}/${series}): ${e.message}`);
    return null;
  }
}

function parseStandingsPdf(text) {
  const riders = [];
  const seen   = {};
  const NOISE = ['ITA','ESP','GBR','USA','AUS','POR','FRA','GER','NED','BEL',
    'JPN','THA','INA','MAL','TUR','BRA','DOM','AUT','ARG','SUI','RSA','CAN',
    'FIN','SWE','NOR','KOR','CHI','MEX','POL','CZE','DEN','IND','SBK','SSP',
    'WCR','SPB','FIM','BMW','VDS','HRC','RR','ELF','GRT','CLA','STD','SUP'];
  const re = /(\d{1,2})\s+([A-Z][A-Z\-]{1,20})\s+(\d{1,3})/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const pos  = parseInt(m[1]);
    const last = m[2];
    const pts  = parseInt(m[3]);
    if (pos < 1 || pos > 60 || pts < 1 || pts > 1200) continue;
    if (NOISE.indexOf(last) >= 0) continue;
    if (seen[pos]) continue;
    seen[pos] = 1;
    const after = text.slice(m.index + m[0].length, m.index + m[0].length + 100);
    const nm = after.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+\([A-Z]{2,3}\)/);
    const first = nm ? nm[1] : '';
    const name  = first
      ? first + ' ' + last.charAt(0) + last.slice(1).toLowerCase()
      : last.charAt(0) + last.slice(1).toLowerCase();
    riders.push({ pos, n: name, pts });
  }
  riders.sort((a, b) => a.pos - b.pos);
  const clean = [];
  for (let i = 0; i < riders.length; i++) {
    if (riders[i].pos === i + 1) clean.push(riders[i]);
    else break;
  }
  const result = clean.length >= 3 ? clean : riders.slice(0, 30);
  return result.length >= 3 ? result : null;
}

function loadWsbkJs() {
  return fs.readFileSync(WSBK_PATH, 'utf8');
}

function updateStandingsInWsbkJs(src, series, riders, eventCode, year) {
  const escapedSeries = series.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const blockRe = new RegExp(
    `(${escapedSeries}\\s*:\\s*\\[)([^\\[\\]]*?)(\\])`,
    's'
  );
  const embStart = src.indexOf('var WSBK_STANDINGS_EMBEDDED');
  if (embStart === -1) { console.log(`  ⚠ WSBK_STANDINGS_EMBEDDED nem található`); return src; }
  const before = src.slice(0, embStart);
  const after  = src.slice(embStart);
  const newItems = riders.map(r => `    {n:'${r.n}', pts:${r.pts}}`).join(',\n');
  const updated  = after.replace(blockRe, (full, open, _old, close) => open + '\n' + newItems + '\n  ' + close);
  if (updated === after) { console.log(`  ⚠ Standings update sikertelen: ${series}`); return src; }
  return before + updated;
}

function updateStandingsComment(src, eventCode, year) {
  return src.replace(
    /\/\/ Forrás:.*?ChampionshipStandings\.pdf[^\n]*/,
    `// Forrás: worldsbk.com ChampionshipStandings.pdf — ${eventCode} ${year} R2 után`
  );
}

function updateStandingsLabel(src, eventCode) {
  return src.replace(
    /\([A-Z]{2,3}\s*R\d?\s*ut\\u00e1n\)/,
    `(${eventCode} R2 ut\\u00e1n)`
  );
}

function loadRecords() {
  const src = fs.readFileSync(RECORDS_PATH, 'utf8');
  const fn  = new Function('module', 'exports', src + '\nmodule.exports={WSBK_RECORDS,MOTOGP_RECORDS};');
  const mod = { exports: {} };
  fn(mod, mod.exports);
  return { src, WSBK_RECORDS: mod.exports.WSBK_RECORDS, MOTOGP_RECORDS: mod.exports.MOTOGP_RECORDS };
}

function updateRecordInSrc(src, section, trackCode, series, newRec) {
  const escapedCode   = trackCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedSeries = series.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const sectionStart = src.indexOf(`var ${section}`);
  if (sectionStart === -1) return src;
  const blockRe = new RegExp(
    `('${escapedCode}'\\s*:\\s*\\{[^}]*?(?:\\{[^}]*\\}[^}]*)*?)` +
    `(${escapedSeries}\\s*:\\s*\\{time:[^}]+\\})`,
    's'
  );
  const newLine  = `${series}: {time:"${newRec.time}", rider:'${newRec.rider}', year:${newRec.year}}`;
  const before   = src.slice(0, sectionStart);
  const after    = src.slice(sectionStart);
  const updated  = after.replace(blockRe, (full, prefix, _old) => prefix + newLine);
  if (updated === after) { console.log(`  ⚠ Nem sikerült frissíteni: ${section}['${trackCode}'].${series}`); return src; }
  return before + updated;
}

function getCurrentLeaderPts(src, series) {
  const embStart = src.indexOf('var WSBK_STANDINGS_EMBEDDED');
  if (embStart === -1) return -1;
  const escapedSeries = series.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const blockRe = new RegExp(`${escapedSeries}\\s*:\\s*\\[\\s*\\{n:'[^']+',\\s*pts:(\\d+)\\}`);
  const m = blockRe.exec(src.slice(embStart));
  return m ? parseInt(m[1]) : -1;
}

async function main() {
  console.log('=== Race Control Dashboard — Rekord + Standings frissítő ===');
  console.log(`Futás ideje: ${new Date().toISOString()}`);

  const { src: originalSrc, WSBK_RECORDS, MOTOGP_RECORDS } = loadRecords();
  let recordsSrc = originalSrc;
  let recordChanges = 0;
  let wsbkSrc = loadWsbkJs();
  let standingsChanges = 0;

  console.log('\n--- WSBK pályarekord ellenőrzés ---');
  for (const [year, events] of Object.entries(WSBK_EVENTS)) {
    for (const ev of events) {
      if (!isFinished(ev.dateEnd)) { console.log(`⏭ ${year}/${ev.code} — még nem zajlott le`); continue; }
      for (const series of ev.series) {
        const current = WSBK_RECORDS[ev.code]?.[series];
        if (!current) continue;
        const fetched = await fetchWsbkBestLap(year, ev.code, series);
        if (!fetched) continue;
        const currentSec = current.time === '\u2014' ? Infinity : timeToSec(current.time);
        const fetchedSec = timeToSec(fetched.time);
        if (fetchedSec < currentSec) {
          console.log(`✅ REKORD: WSBK_RECORDS['${ev.code}'].${series}`);
          console.log(`   ${current.time || '—'} → ${fetched.time} (${fetched.rider}, ${fetched.year})`);
          recordsSrc = updateRecordInSrc(recordsSrc, 'WSBK_RECORDS', ev.code, series, fetched);
          if (WSBK_RECORDS[ev.code]) WSBK_RECORDS[ev.code][series] = fetched;
          recordChanges++;
        } else {
          console.log(`  — ${year}/${ev.code}/${series}: nincs jobb (${current.time || '—'} ≤ ${fetched.time})`);
        }
        await sleep(500);
      }
    }
  }

  console.log('\n--- MotoGP pályarekord ellenőrzés ---');
  for (const [year, events] of Object.entries(MOTOGP_EVENTS)) {
    for (const ev of events) {
      if (!isFinished(ev.dateEnd)) { console.log(`⏭ ${year}/${ev.code} MotoGP — még nem zajlott le`); continue; }
      for (const cat of MOTOGP_CATEGORIES) {
        const current = MOTOGP_RECORDS[ev.code]?.[cat];
        if (!current) continue;
        const fetched = await fetchMotogpBestLap(year, ev.code, cat);
        if (!fetched) continue;
        const currentSec = current.time === '\u2014' ? Infinity : timeToSec(current.time);
        const fetchedSec = timeToSec(fetched.time);
        if (fetchedSec < currentSec) {
          console.log(`✅ REKORD: MOTOGP_RECORDS['${ev.code}'].${cat}`);
          console.log(`   ${current.time || '—'} → ${fetched.time} (${fetched.rider}, ${fetched.year})`);
          recordsSrc = updateRecordInSrc(recordsSrc, 'MOTOGP_RECORDS', ev.code, cat, fetched);
          if (MOTOGP_RECORDS[ev.code]) MOTOGP_RECORDS[ev.code][cat] = fetched;
          recordChanges++;
        } else {
          console.log(`  — ${year}/${ev.code}/${cat}: nincs jobb (${current.time || '—'} ≤ ${fetched.time})`);
        }
        await sleep(300);
      }
    }
  }

  console.log('\n--- WSBK bajnoki állás frissítés ---');
  const year2026  = '2026';
  const events26  = WSBK_EVENTS[year2026] || [];
  const finished  = events26.filter(ev => isFinished(ev.dateEnd));
  const lastEvent = finished[finished.length - 1];

  if (!lastEvent) {
    console.log('  Nincs lezajlott 2026-os forduló.');
  } else {
    console.log(`  Legutóbbi forduló: ${lastEvent.code} (${year2026})`);
    const allSeries = ['SBK', 'SSP', 'WCR', 'SPB', 'R3'];
    for (const series of allSeries) {
      if (!lastEvent.series.includes(series)) { console.log(`  ⏭ ${series}: nem futott ${lastEvent.code}-ban`); continue; }
      const riders = await fetchWsbkStandings(year2026, lastEvent.code, series);
      if (!riders || riders.length < 3) { console.log(`  ⚠ ${series}: nem sikerült a standings PDF parse (${lastEvent.code})`); await sleep(500); continue; }
      const currentLeaderPts = getCurrentLeaderPts(wsbkSrc, series);
      const newLeaderPts     = riders[0].pts;
      if (newLeaderPts !== currentLeaderPts) {
        console.log(`✅ STANDINGS: ${series} — ${riders[0].n} ${currentLeaderPts}→${newLeaderPts} pts`);
        wsbkSrc = updateStandingsInWsbkJs(wsbkSrc, series, riders, lastEvent.code, year2026);
        standingsChanges++;
      } else {
        console.log(`  — ${series}: standings nem változott (vezető: ${riders[0].n} ${newLeaderPts} pts)`);
      }
      await sleep(600);
    }
    if (standingsChanges > 0) {
      wsbkSrc = updateStandingsComment(wsbkSrc, lastEvent.code, year2026);
      wsbkSrc = updateStandingsLabel(wsbkSrc, lastEvent.code);
    }
  }

  const today = new Date().toISOString().split('T')[0];
  console.log(`\n=== Összesítés ===`);
  console.log(`  Rekord változások:   ${recordChanges}`);
  console.log(`  Standings változások: ${standingsChanges}`);

  if (recordChanges > 0) {
    recordsSrc = recordsSrc.replace(
      /\/\/ Utolsó frissítés: \d{4}-\d{2}-\d{2}/,
      `// Utolsó frissítés: ${today}`
    );
    fs.writeFileSync(RECORDS_PATH, recordsSrc, 'utf8');
    console.log(`✅ records.js mentve`);
  } else {
    console.log(`  records.js változatlan`);
  }

  if (standingsChanges > 0) {
    fs.writeFileSync(WSBK_PATH, wsbkSrc, 'utf8');
    console.log(`✅ wsbk.js mentve`);
  } else {
    console.log(`  wsbk.js változatlan`);
  }
}

main().catch(e => {
  console.error('Hiba a frissítő futása közben:', e);
  process.exit(1);
});
