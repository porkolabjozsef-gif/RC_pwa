addEventListener('fetch', e => {
  e.respondWith(handle(e.request))
})

async function handle(req) {
  const u    = new URL(req.url)
  const path = u.pathname.slice(1) + u.search

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders() })
  }

  // ── WSBK SCHEDULE JSON — /wsbk-schedule/{event}/{year} ─────────────────
  if (path.startsWith('wsbk-schedule/')) {
    const parts     = path.slice(14).split('/')
    const eventCode = parts[0] || 'HUN'
    const year      = parts[1] || '2026'
    try {
      const wsbkUrl = 'https://www.worldsbk.com/en/event/' + eventCode + '/' + year
      const resp    = await fetch(wsbkUrl, { headers: wsbkHeaders() })
      if (!resp.ok) return jsonResp({ error: 'worldsbk.com returned ' + resp.status }, 404)
      const html    = await resp.text()
      const sessions = parseWsbkSchedule(html, eventCode, year)
      if (!sessions || !sessions.length) return jsonResp({ error: 'No sessions found' }, 422)
      return jsonResp({ eventCode, year, sessions })
    } catch (err) {
      return jsonResp({ error: err.message }, 500)
    }
  }

  // ── WSBK STANDINGS JSON — /wsbk-std/{year}/{event}/{series} ────────────
  if (path.startsWith('wsbk-std/')) {
    const parts     = path.slice(9).split('/')
    const year      = parts[0] || '2026'
    const event     = parts[1] || 'HUN'
    const series    = parts[2] || 'SBK'
    const seriesUrl = { SBK:'SBK', SSP:'SSP', WCR:'WCR', SPB:'SPB', R3:'YR3EC' }[series] || series
    const pdfUrl    = 'https://resources.worldsbk.com/files/results/' + year + '/' + event + '/' + seriesUrl + '/001/STD/ChampionshipStandings.pdf'
    try {
      const pdfResp = await fetch(pdfUrl, { headers: wsbkHeaders() })
      if (!pdfResp.ok) return jsonResp({ error: 'PDF not found', status: pdfResp.status }, 404)
      const text    = extractPdfText(await pdfResp.arrayBuffer())
      const riders  = parseStandings(text)
      if (!riders || riders.length < 3) return jsonResp({ error: 'Parse failed', raw: text.slice(0, 300) }, 422)
      return jsonResp({ year, event, series, riders })
    } catch (err) {
      return jsonResp({ error: err.message }, 500)
    }
  }

  // ── WSBK SESSION JSON — /wsbk-ses/{year}/{event}/{series}/{sessCode} ───
  if (path.startsWith('wsbk-ses/')) {
    const parts     = path.slice(9).split('/')
    const year      = parts[0] || '2026'
    const event     = parts[1] || 'HUN'
    const series    = parts[2] || 'SBK'
    const sessCode  = parts[3] || '001'
    const seriesUrl = { SBK:'SBK', SSP:'SSP', WCR:'WCR', SPB:'SPB', R3:'YR3EC' }[series] || series
    const pdfUrl    = 'https://resources.worldsbk.com/files/results/' + year + '/' + event + '/' + seriesUrl + '/' + sessCode + '/CLA/Results.pdf'
    try {
      const pdfResp = await fetch(pdfUrl, { headers: wsbkHeaders() })
      if (!pdfResp.ok) return jsonResp({ error: 'PDF not found', status: pdfResp.status }, 404)
      const text = extractPdfText(await pdfResp.arrayBuffer())
      const rows = parseSession(text)
      if (!rows || rows.length < 3) return jsonResp({ error: 'Parse failed', raw: text.slice(0, 300) }, 422)
      return jsonResp({ year, event, series, sessCode, rows })
    } catch (err) {
      return jsonResp({ error: err.message }, 500)
    }
  }

  // ── M4NC RESULTS — /m4nc/{year}/{circuit}/{day}/{session} ───────────────
  // day:     FRI | SAT | SUN
  // session: FP1 | FP2 | RAC1 | RAC2
  // circuit: SAC (Sachsenring) | BAL (Balaton Park) | ASS (Assen)
  //          BRN (Brno) | OSC (Oschersleben)
  //
  // PDF URL: https://www.moto4northerncup.com/wp-content/uploads/{year}/{month}/
  //          M4N_{year}_{circuit}_{day}_{session}_FULL-RESULTS.pdf
  if (path.startsWith('m4nc/')) {
    const parts   = path.slice(5).split('/')
    const year    = parts[0] || '2026'
    const circuit = (parts[1] || 'BAL').toUpperCase()
    const session = (parts[2] || 'FP1').toUpperCase()

    // Nap automatikusan a szesszió típusból
    const M4NC_SESS_DAYS = {
      'FP1': 'FRI', 'FP2': 'FRI', 'QUA': 'FRI', 'QUAL': 'FRI', 'Q': 'FRI',
      'RAC1': 'SAT', 'RACE1': 'SAT',
      'RAC2': 'SUN', 'RACE2': 'SUN'
    }
    const day = M4NC_SESS_DAYS[session] || 'SAT'

    // Qualifying fájlnév variánsok
    const sessVariants = session === 'QUA'  ? ['QUA', 'QUAL', 'Q', 'Q1']
                       : session === 'RAC1' ? ['RAC1', 'R1', 'RACE1']
                       : session === 'RAC2' ? ['RAC2', 'R2', 'RACE2']
                       : [session]

    // Circuit → upload month candidates (based on race calendar)
    const monthMap = {
      'ASS': ['04', '09'],   // April (WorldSBK) + September (BSB)
      'SAC': ['05', '07'],   // May (IDM) + July (MotoGP)
      'BAL': ['06'],         // June (MotoGP Balaton)
      'BRN': ['06'],         // June (MotoGP Brno)
      'OSC': ['07', '08'],   // July/August (IDM Oschersleben)
    }
    const candidates = monthMap[circuit] || ['06','05','07','04','08','09','10','11','12','03','02','01']
    // Also try previous year's November for preseason tests
    const extraCandidates = [
      { year: year, month: null },            // placeholder — will be filled from candidates
      { year: String(parseInt(year) - 1), month: '11' },
      { year: String(parseInt(year) - 1), month: '12' },
    ]

    let found = null

    // Try each candidate month
    outer: for (const month of candidates) {
      for (const sessVar of sessVariants) {
        const pdfUrl = 'https://www.moto4northerncup.com/wp-content/uploads/'
          + year + '/' + month + '/M4N_'
          + year + '_' + circuit + '_' + day + '_' + sessVar + '_FULL-RESULTS.pdf'
        try {
          const resp = await fetch(pdfUrl, { headers: m4ncHeaders() })
          if (!resp.ok) continue
          const buf  = await resp.arrayBuffer()
          if (buf.byteLength < 1000) continue
          const text = extractPdfText(buf)
          const rows = parseM4ncResults(text)
          if (rows && rows.length >= 3) {
            found = { year, circuit, day, session: sessVar, month, rows }
            break outer
          }
        } catch (e) { continue }
      }
    }

    // Also try previous-year uploads (preseason tests)
    if (!found) {
      for (const cand of [
        { year: String(parseInt(year) - 1), month: '11' },
        { year: String(parseInt(year) - 1), month: '12' },
      ]) {
        const pdfUrl = 'https://www.moto4northerncup.com/wp-content/uploads/'
          + cand.year + '/' + cand.month + '/M4N_'
          + year + '_' + circuit + '_' + day + '_' + (sessVariants[0]||session) + '_FULL-RESULTS.pdf'
        try {
          const resp = await fetch(pdfUrl, { headers: m4ncHeaders() })
          if (!resp.ok) continue
          const buf  = await resp.arrayBuffer()
          if (buf.byteLength < 1000) continue
          const text = extractPdfText(buf)
          const rows = parseM4ncResults(text)
          if (rows && rows.length >= 3) {
            found = { year, circuit, day, session: (sessVariants[0]||session), month: cand.month, uploadYear: cand.year, rows }
            break
          }
        } catch (e) { continue }
      }
    }

    if (found) return jsonResp(found)
    return jsonResp({
      error: 'Results not found',
      tried: 'M4N_' + year + '_' + circuit + '_' + day + '_' + session + '_FULL-RESULTS.pdf'
    }, 404)
  }

  // ── WSBK PDF PROXY + MotoGP API pass-through ───────────────────────────
  var target
  if (path.startsWith('wsbk-pdf/')) {
    target = 'https://resources.worldsbk.com/files/results/' + path.slice(9)
  } else if (path.startsWith('wsbk-standings/')) {
    const parts = path.slice(15).split('/')
    target = 'https://www.worldsbk.com/en/results%20statistics/' + parts[0].toLowerCase() + '?year=' + (parts[1] || '2026')
  } else {
    target = 'https://api.motogp.pulselive.com/motogp/v1/results/' + path
  }

  const r = await fetch(target, { headers: wsbkHeaders() })
  const d = await r.arrayBuffer()
  return new Response(d, {
    headers: Object.assign(corsHeaders(), {
      'Content-Type': r.headers.get('Content-Type') || 'text/html'
    })
  })
}


// ============================================================
// WSBK SCHEDULE PARSER
// ============================================================
function parseWsbkSchedule(html, eventCode, year) {
  const sessions = []
  const blockRe  = /<div class="timeIso">([\s\S]*?)(?=<div class="timeIso"|<\/div>\s*<nav)/g
  let match

  while ((match = blockRe.exec(html)) !== null) {
    const block    = match[1]
    const iniMatch = block.match(/data_ini=["']([^"']*)["']/)
    const endMatch = block.match(/data_end=["']([^"']*)["']/)
    if (!iniMatch || !iniMatch[1].trim()) continue

    const startIso = iniMatch[1].trim()
    const endIso   = endMatch && endMatch[1].trim() ? endMatch[1].trim() : null
    const catMatch = block.match(/cat-session[^>]*>([\s\S]*?)<\/div>/)
    if (!catMatch) continue
    const rawName  = catMatch[1].replace(/<[^>]+>/g, '').trim()
    if (!rawName) continue

    const sc      = guessSeriesAndCode(rawName)
    const pdfMatch = block.match(/resources\.worldsbk\.com\/files\/results\/([^"'?]+)/)
    const pdfPath  = pdfMatch ? pdfMatch[1] : null

    sessions.push({
      start: startIso, end: endIso, name: rawName,
      series: sc.series, sessCode: sc.code,
      eventCode, year, pdfPath, finished: !!endIso
    })
  }
  return sessions
}

function guessSeriesAndCode(name) {
  const n = name.toLowerCase()
  let series = 'SBK'
  if      (n.includes('worldssp') || n.includes('ssp')) series = 'SSP'
  else if (n.includes('worldspb') || n.includes('spb')) series = 'SPB'
  else if (n.includes('worldwcr') || n.includes('wcr')) series = 'WCR'
  else if (n.includes('r3') || n.includes('yr3'))       series = 'R3'
  else if (n.includes('worldsbk') || n.includes('sbk')) series = 'SBK'

  let code = 'L1A'
  if      (/race 2|race two/.test(n))                           code = series === 'SBK' ? '003' : '002'
  else if (/superpole race|spr|sprint/.test(n))                 code = '002'
  else if (/race 1|race one/.test(n))                           code = '001'
  else if (/\brace\b/.test(n) && !/practice|superpole/.test(n)) code = '001'
  else if (/warm.?up 2|wup 2|wup2/.test(n))                    code = 'W2A'
  else if (/warm.?up|wup/.test(n))                              code = 'W1A'
  else if (/superpole|tissot sup|qualifying/.test(n) && !/race/.test(n)) code = 'Q1A'
  else if (/fp3|free practice 3|practice 3/.test(n))            code = 'L3A'
  else if (/fp2|free practice 2|practice 2/.test(n))            code = 'L2A'
  else if (/fp1|free practice 1|free practice|practice/.test(n)) code = 'L1A'

  return { series, code }
}


// ============================================================
// M4NC RESULT PARSER
// Forrás: moto4northerncup.com — Orbits/mylaps PDF
// Formátum: Pos No. FirstName LASTNAME NAT Honda NSF250R Laps M:SS.mmm
// ============================================================
function parseM4ncResults(text) {
  const rows = []
  const seen = {}

  // M4NC time format: M:SS.mmm  (pl. 1:42.379)
  var reTime = /\b(\d:\d{2}\.\d{3})\b/g
  var times  = []
  var tm
  while ((tm = reTime.exec(text)) !== null) {
    times.push({ idx: tm.index, val: tm[0] })
  }

  if (times.length < 3) return null   // no times found → wrong PDF

  // Rider row pattern:
  // pos(1-2d)  num(1-3d)  FirstName(s)  LASTNAME  NAT(3caps)  Honda
  // Example: "1 21 Anina URLASS DEU Honda NSF250R 15 1:42.379"
  // Note: first name(s) = one or more title-case words
  //       last name     = all-caps word (2-15 chars)
  var reRow = /\b(\d{1,2})\s+(\d{1,3})\s+((?:[A-Z][a-z]+\s+)+)([A-Z]{2,15})\s+([A-Z]{3})\s+Honda/g
  var m

  while ((m = reRow.exec(text)) !== null) {
    var pos  = parseInt(m[1])
    var num  = parseInt(m[2])
    var first = m[3].trim()        // e.g. "Anina" or "Tommy Junior"
    var last  = m[4]               // e.g. "URLASS"
    var nat   = m[5]               // e.g. "DEU"

    if (pos < 1 || pos > 99) continue
    if (seen[pos]) continue

    var name = first + ' ' + last[0] + last.slice(1).toLowerCase()

    // Best time: first time token after the match
    var afterIdx = m.index + m[0].length
    var bestT    = null
    for (var i = 0; i < times.length; i++) {
      if (times[i].idx >= afterIdx && times[i].idx < afterIdx + 250) {
        bestT = times[i]
        break
      }
    }
    if (!bestT) continue

    // Gap: decimal after best time (e.g. "0.182")
    var snippet  = text.slice(bestT.idx + bestT.val.length, bestT.idx + bestT.val.length + 30)
    var gapMatch = snippet.match(/\s+(\d+\.\d{3})/)
    var gap      = gapMatch ? '+' + gapMatch[1] : ''

    seen[pos] = 1
    rows.push({ pos, num, name, nat, lap: bestT.val, gap })
  }

  // Fallback: try without "Honda" anchor (in case PDF encoding differs)
  if (rows.length < 3) {
    rows.length = 0
    for (var k in seen) delete seen[k]

    var reRow2 = /\b(\d{1,2})\s+(\d{1,3})\s+((?:[A-Z][a-z]+\s+)+)([A-Z]{2,15})\s+(DEU|NLD|BEL|FRA|FIN|DNK|CZE|ITA|AUT|SWE|NOR|HUN|POL|EST|LAT|LTU|GBR|IRL|SVK|ROU)\b/g
    while ((m = reRow2.exec(text)) !== null) {
      var pos  = parseInt(m[1])
      var num  = parseInt(m[2])
      var first = m[3].trim()
      var last  = m[4]
      var nat   = m[5]
      if (pos < 1 || pos > 99 || seen[pos]) continue

      var name = first + ' ' + last[0] + last.slice(1).toLowerCase()
      var afterIdx = m.index + m[0].length
      var bestT    = null
      for (var i = 0; i < times.length; i++) {
        if (times[i].idx >= afterIdx && times[i].idx < afterIdx + 250) {
          bestT = times[i]; break
        }
      }
      if (!bestT) continue

      var snippet  = text.slice(bestT.idx + bestT.val.length, bestT.idx + bestT.val.length + 30)
      var gapMatch = snippet.match(/\s+(\d+\.\d{3})/)
      var gap      = gapMatch ? '+' + gapMatch[1] : ''

      seen[pos] = 1
      rows.push({ pos, num, name, nat, lap: bestT.val, gap })
    }
  }

  rows.sort(function(a, b) { return a.pos - b.pos })

  // Deduplicate
  var clean  = []
  var seenP  = {}
  for (var i = 0; i < rows.length; i++) {
    if (seenP[rows[i].pos]) continue
    seenP[rows[i].pos] = 1
    clean.push(rows[i])
  }

  return clean.length >= 3 ? clean : null
}


// ============================================================
// PDF TEXT EXTRACTOR  (used by WSBK + M4NC)
// ============================================================
function extractPdfText(buf) {
  const raw  = new TextDecoder('latin1').decode(new Uint8Array(buf))
  var out    = ''
  var reTj   = /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*Tj/g
  var reTJ   = /\[([^\]]*)\]\s*TJ/g
  var m, pm
  while ((m = reTj.exec(raw)) !== null) {
    out += m[1].replace(/\\n/g,' ').replace(/\\r/g,' ').replace(/\\t/g,' ')
               .replace(/\\\(/g,'(').replace(/\\\)/g,')').replace(/\\\\/g,'\\') + ' '
  }
  while ((m = reTJ.exec(raw)) !== null) {
    var rePart = /\(([^)\\]*(?:\\.[^)\\]*)*)\)/g
    while ((pm = rePart.exec(m[1])) !== null) out += pm[1] + ' '
  }
  return out.replace(/\s+/g, ' ').trim()
}


// ============================================================
// WSBK SESSION PARSER
// ============================================================
function parseSession(text) {
  var rows = []
  var seen = {}

  var reLap  = /\d'\d{2}\.\d{3}/g
  var times  = []
  var tl
  while ((tl = reLap.exec(text)) !== null) times.push({ idx: tl.index, val: tl[0] })

  function firstTimeAfter(idx) {
    for (var i = 0; i < times.length; i++) { if (times[i].idx >= idx) return times[i] }
    return null
  }

  function addRow(pos, num, init, sur, nat, afterIdx) {
    if (pos < 1 || pos > 99) return
    var key = num + '_' + pos
    if (seen[key]) return
    var lt = firstTimeAfter(afterIdx)
    if (!lt) return
    var between  = text.slice(afterIdx, lt.idx)
    var gm       = between.match(/\d{1,2}'\d{2}\.\d+|\d+\.\d{3}/g)
    var gap      = gm ? gm[gm.length - 1] : ''
    var name     = init + '. ' + sur[0] + sur.slice(1).toLowerCase()
    seen[key]    = 1
    rows.push({ pos, num, name, nat, lap: lt.val, gap })
  }

  var reRace = /\b(\d{1,2})\s+(\d{1,2})\s+(\d{1,3})\s+([A-Z])\.\s+([A-Z][A-Z\-]+)\s+([A-Z]{3})\b/g
  var m
  while ((m = reRace.exec(text)) !== null) addRow(parseInt(m[1]), parseInt(m[3]), m[4], m[5], m[6], m.index + m[0].length)

  var reSess = /\b(\d{1,2})\s+(\d{1,3})\s+([A-Z])\.\s+([A-Z][A-Z\-]+)\s+([A-Z]{3})\b/g
  while ((m = reSess.exec(text)) !== null) addRow(parseInt(m[1]), parseInt(m[2]), m[3], m[4], m[5], m.index + m[0].length)

  var reRet = /\bRET\s+(?:\d+\s+)?(\d{1,3})\s+([A-Z])\.\s+([A-Z][A-Z\-]+)\s+([A-Z]{3})\b/g
  while ((m = reRet.exec(text)) !== null) {
    var num = parseInt(m[1]); var key = 'RET_' + num
    if (seen[key]) continue
    seen[key] = 1
    rows.push({ pos: 'RET', num, name: m[2] + '. ' + m[3][0] + m[3].slice(1).toLowerCase(), nat: m[4], lap: '', gap: 'DNF' })
  }

  rows.sort(function(a,b) { if (a.pos==='RET') return 1; if (b.pos==='RET') return -1; return Number(a.pos)-Number(b.pos) })

  var deduped = []; var seenPos = {}
  for (var i = 0; i < rows.length; i++) {
    var k = rows[i].pos === 'RET' ? 'RET_' + rows[i].num : rows[i].pos
    if (seenPos[k]) continue; seenPos[k] = 1; deduped.push(rows[i])
  }
  return deduped
}


// ============================================================
// WSBK STANDINGS PARSER
// ============================================================
function parseStandings(text) {
  var noise  = ['ITA','ESP','GBR','USA','AUS','POR','FRA','GER','NED','BEL','JPN','THA',
    'INA','MAL','TUR','CHI','MEX','POL','CZE','DEN','SUI','AND','IND','BRA',
    'DOM','AUT','ARG','RSA','FIN','SWE','NOR','CAN','KOR',
    'SBK','SSP','WCR','SPB','CLA','STD','SUP','WUP','FIM','BMW','REVISED']

  var reName = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+\(?([A-Z]{2,3})\)?/g
  var names  = []; var nm
  while ((nm = reName.exec(text)) !== null) names.push({ idx: nm.index, first: nm[1] })

  var riders = []; var seen = {}
  var re = /\b(\d{1,2})\s+([A-Z]{2,})\s+(\d{1,3})\b/g
  var m
  while ((m = re.exec(text)) !== null) {
    var pos = parseInt(m[1]); var last = m[2]; var pts = parseInt(m[3])
    if (pos < 1 || pos > 60 || pts < 1 || pts > 900) continue
    if (noise.indexOf(last) >= 0 || seen[pos]) continue
    var afterIdx = m.index + m[0].length
    var nm2 = null
    for (var i = 0; i < names.length; i++) {
      if (names[i].idx >= afterIdx && names[i].idx < afterIdx + 120) { nm2 = names[i]; break }
    }
    var name = nm2 ? nm2.first + ' ' + last[0] + last.slice(1).toLowerCase()
                   : last[0] + last.slice(1).toLowerCase()
    seen[pos] = 1; riders.push({ pos, name, pts })
  }

  riders.sort(function(a,b) { return a.pos - b.pos })
  var clean = []
  for (var i = 0; i < riders.length; i++) {
    if (riders[i].pos === i + 1) clean.push(riders[i]); else break
  }
  if (clean.length >= 3) {
    for (var i = 1; i < Math.min(clean.length, 5); i++) { if (clean[i].pts > clean[i-1].pts) return null }
  }
  return clean.length >= 3 ? clean : null
}


// ============================================================
// SEGÉDFÜGGVÉNYEK
// ============================================================
function m4ncHeaders() {
  return {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36',
    'Accept':     'application/pdf,*/*',
    'Referer':    'https://www.moto4northerncup.com/'
  }
}

function wsbkHeaders() {
  return {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36',
    'Accept':     '*/*',
    'Referer':    'https://www.worldsbk.com/'
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
}

function jsonResp(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: Object.assign(corsHeaders(), { 'Content-Type': 'application/json' })
  })
}
