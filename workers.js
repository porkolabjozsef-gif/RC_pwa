addEventListener('fetch', e => {
  e.respondWith(handle(e.request))
})

async function handle(req) {
  const u = new URL(req.url)
  const path = u.pathname.slice(1) + u.search

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders() })
  }

  // WSBK SCHEDULE JSON — /wsbk-schedule/{event}/{year}
  // Lekéri a worldsbk.com/en/event/{event}/{year} oldalt és
  // parse-olja a session időpontokat (data_ini, data_end)
  if (path.startsWith('wsbk-schedule/')) {
    const parts     = path.slice(14).split('/')
    const eventCode = parts[0] || 'CZE'
    const year      = parts[1] || '2026'
    try {
      const wsbkUrl = 'https://www.worldsbk.com/en/event/' + eventCode + '/' + year
      const resp = await fetch(wsbkUrl, { headers: wsbkHeaders() })
      if (!resp.ok) return jsonResp({ error: 'worldsbk.com returned ' + resp.status }, 404)
      const html = await resp.text()
      const sessions = parseWsbkSchedule(html, eventCode, year)
      if (!sessions || !sessions.length) return jsonResp({ error: 'No sessions found' }, 422)
      return jsonResp({ eventCode: eventCode, year: year, sessions: sessions })
    } catch (err) {
      return jsonResp({ error: err.message }, 500)
    }
  }

  // WSBK STANDINGS JSON — /wsbk-std/{year}/{event}/{series}
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
      const text   = extractPdfText(await pdfResp.arrayBuffer())
      const riders = parseStandings(text)
      if (!riders || riders.length < 3) return jsonResp({ error: 'Parse failed', raw: text.slice(0, 300) }, 422)
      return jsonResp({ year: year, event: event, series: series, riders: riders })
    } catch (err) {
      return jsonResp({ error: err.message }, 500)
    }
  }

  // WSBK SESSION JSON — /wsbk-ses/{year}/{event}/{series}/{sessCode}
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
      return jsonResp({ year: year, event: event, series: series, sessCode: sessCode, rows: rows })
    } catch (err) {
      return jsonResp({ error: err.message }, 500)
    }
  }

  // WSBK PDF PROXY
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
    headers: Object.assign(corsHeaders(), { 'Content-Type': r.headers.get('Content-Type') || 'text/html' })
  })
}

// ============================================================
// WSBK SCHEDULE PARSER
// Parse-olja a worldsbk.com event oldal HTML-jét
// és visszaadja a session-öket időpontokkal
// ============================================================
function parseWsbkSchedule(html, eventCode, year) {
  const sessions = []

  // Minden timeIso blokkot megkeresünk
  const blockRe = /<div class="timeIso">([\s\S]*?)(?=<div class="timeIso"|<\/div>\s*<nav)/g
  let match

  while ((match = blockRe.exec(html)) !== null) {
    const block = match[1]

    // Kezdési és befejezési idő
    const iniMatch = block.match(/data_ini=["']([^"']*)["']/)
    const endMatch = block.match(/data_end=["']([^"']*)["']/)
    if (!iniMatch || !iniMatch[1].trim()) continue

    const startIso = iniMatch[1].trim()
    const endIso   = endMatch && endMatch[1].trim() ? endMatch[1].trim() : null

    // Session neve (Live Video span-ok eltávolítása)
    const catMatch = block.match(/cat-session[^>]*>([\s\S]*?)<\/div>/)
    if (!catMatch) continue
    const rawName = catMatch[1].replace(/<[^>]+>/g, '').trim()
    if (!rawName) continue

    // Series és session kód
    const sc = guessSeriesAndCode(rawName)

    // PDF URL ha már van eredmény
    const pdfMatch = block.match(/resources\.worldsbk\.com\/files\/results\/([^"'?]+)/)
    const pdfPath  = pdfMatch ? pdfMatch[1] : null

    sessions.push({
      start:     startIso,
      end:       endIso,
      name:      rawName,
      series:    sc.series,
      sessCode:  sc.code,
      eventCode: eventCode,
      year:      year,
      pdfPath:   pdfPath,
      finished:  !!endIso
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
  if      (/race 2|race two/.test(n))                   code = series === 'SBK' ? '003' : '002'
  else if (/superpole race|spr|sprint/.test(n))         code = '002'
  else if (/race 1|race one/.test(n))                   code = '001'
  else if (/\brace\b/.test(n) && !/practice|superpole/.test(n)) code = '001'
  else if (/warm.?up 2|wup 2|wup2/.test(n))             code = 'W2A'
  else if (/warm.?up|wup/.test(n))                      code = 'W1A'
  else if (/superpole|tissot sup|qualifying/.test(n) && !/race/.test(n)) code = 'Q1A'
  else if (/fp3|free practice 3|practice 3/.test(n))    code = 'L3A'
  else if (/fp2|free practice 2|practice 2/.test(n))    code = 'L2A'
  else if (/fp1|free practice 1|free practice|practice/.test(n)) code = 'L1A'

  return { series, code }
}

// ============================================================
// SEGÉDFÜGGVÉNYEK
// ============================================================
function wsbkHeaders() {
  return {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36',
    'Accept': '*/*',
    'Referer': 'https://www.worldsbk.com/'
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
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

function extractPdfText(buf) {
  const raw = new TextDecoder('latin1').decode(new Uint8Array(buf))
  var out = ''
  var reTj = /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*Tj/g
  var reTJ = /\[([^\]]*)\]\s*TJ/g
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

function parseStandings(text) {
  var noise = ['ITA','ESP','GBR','USA','AUS','POR','FRA','GER','NED','BEL','JPN','THA',
    'INA','MAL','TUR','CHI','MEX','POL','CZE','DEN','SUI','AND','IND','BRA',
    'DOM','AUT','ARG','RSA','FIN','SWE','NOR','CAN','KOR',
    'SBK','SSP','WCR','SPB','CLA','STD','SUP','WUP','FIM','BMW','REVISED']

  var reName = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+\(?([A-Z]{2,3})\)?/g
  var names = []
  var nm
  while ((nm = reName.exec(text)) !== null) names.push({ idx: nm.index, first: nm[1] })

  var riders = []
  var seen = {}
  var re = /\b(\d{1,2})\s+([A-Z]{2,})\s+(\d{1,3})\b/g
  var m
  while ((m = re.exec(text)) !== null) {
    var pos = parseInt(m[1])
    var last = m[2]
    var pts = parseInt(m[3])
    if (pos < 1 || pos > 60) continue
    if (pts < 1 || pts > 900) continue
    if (noise.indexOf(last) >= 0) continue
    if (seen[pos]) continue
    var afterIdx = m.index + m[0].length
    var nm2 = null
    for (var i = 0; i < names.length; i++) {
      if (names[i].idx >= afterIdx && names[i].idx < afterIdx + 120) { nm2 = names[i]; break }
    }
    var name = nm2 ? nm2.first + ' ' + last[0] + last.slice(1).toLowerCase()
                   : last[0] + last.slice(1).toLowerCase()
    seen[pos] = 1
    riders.push({ pos: pos, name: name, pts: pts })
  }

  riders.sort(function(a, b) { return a.pos - b.pos })

  var clean = []
  for (var i = 0; i < riders.length; i++) {
    if (riders[i].pos === i + 1) clean.push(riders[i])
    else break
  }

  if (clean.length >= 3) {
    for (var i = 1; i < Math.min(clean.length, 5); i++) {
      if (clean[i].pts > clean[i-1].pts) return null
    }
  }

  return clean.length >= 3 ? clean : null
}

function parseSession(text) {
  var rows = []
  var seen = {}

  var reLap = /\d'\d{2}\.\d{3}/g
  var times = []
  var tl
  while ((tl = reLap.exec(text)) !== null) times.push({ idx: tl.index, val: tl[0] })

  function firstTimeAfter(idx) {
    for (var i = 0; i < times.length; i++) {
      if (times[i].idx >= idx) return times[i]
    }
    return null
  }

  function addRow(pos, num, init, sur, nat, afterIdx) {
    if (pos < 1 || pos > 99) return
    var key = num + '_' + pos
    if (seen[key]) return
    var lt = firstTimeAfter(afterIdx)
    if (!lt) return
    var between = text.slice(afterIdx, lt.idx)
    var gm = between.match(/\d{1,2}'\d{2}\.\d+|\d+\.\d{3}/g)
    var gap = gm ? gm[gm.length - 1] : ''
    var name = init + '. ' + sur[0] + sur.slice(1).toLowerCase()
    seen[key] = 1
    rows.push({ pos: pos, num: num, name: name, nat: nat, lap: lt.val, gap: gap })
  }

  var reRace = /\b(\d{1,2})\s+(\d{1,2})\s+(\d{1,3})\s+([A-Z])\.\s+([A-Z][A-Z\-]+)\s+([A-Z]{3})\b/g
  var m
  while ((m = reRace.exec(text)) !== null) {
    addRow(parseInt(m[1]), parseInt(m[3]), m[4], m[5], m[6], m.index + m[0].length)
  }

  var reSess = /\b(\d{1,2})\s+(\d{1,3})\s+([A-Z])\.\s+([A-Z][A-Z\-]+)\s+([A-Z]{3})\b/g
  while ((m = reSess.exec(text)) !== null) {
    addRow(parseInt(m[1]), parseInt(m[2]), m[3], m[4], m[5], m.index + m[0].length)
  }

  var reRet = /\bRET\s+(?:\d+\s+)?(\d{1,3})\s+([A-Z])\.\s+([A-Z][A-Z\-]+)\s+([A-Z]{3})\b/g
  while ((m = reRet.exec(text)) !== null) {
    var num = parseInt(m[1])
    var key = 'RET_' + num
    if (seen[key]) continue
    seen[key] = 1
    rows.push({ pos: 'RET', num: num, name: m[2] + '. ' + m[3][0] + m[3].slice(1).toLowerCase(), nat: m[4], lap: '', gap: 'DNF' })
  }

  rows.sort(function(a, b) {
    if (a.pos === 'RET') return 1
    if (b.pos === 'RET') return -1
    return Number(a.pos) - Number(b.pos)
  })

  var deduped = []
  var seenPos = {}
  for (var i = 0; i < rows.length; i++) {
    var k = rows[i].pos === 'RET' ? 'RET_' + rows[i].num : rows[i].pos
    if (seenPos[k]) continue
    seenPos[k] = 1
    deduped.push(rows[i])
  }
  return deduped
}
