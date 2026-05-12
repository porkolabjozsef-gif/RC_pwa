addEventListener('fetch', e => {
  e.respondWith(handle(e.request))
})

async function handle(req) {
  const u = new URL(req.url)
  const path = u.pathname.slice(1) + u.search

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders() })
  }

  // ── WSBK STANDINGS JSON ──────────────────────────────────────
  // GET /wsbk-std/{year}/{event}/{series}
  if (path.startsWith('wsbk-std/')) {
    const parts    = path.slice(9).split('/')
    const year     = parts[0] || '2026'
    const event    = parts[1] || 'HUN'
    const series   = parts[2] || 'SBK'
    const seriesUrl = { SBK:'SBK', SSP:'SSP', WCR:'WCR', SPB:'SPB', R3:'YR3EC' }[series] || series
    const pdfUrl   = `https://resources.worldsbk.com/files/results/${year}/${event}/${seriesUrl}/001/STD/ChampionshipStandings.pdf`

    try {
      const pdfResp = await fetch(pdfUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36',
          'Accept': '*/*',
          'Referer': 'https://www.worldsbk.com/'
        }
      })
      if (!pdfResp.ok) return jsonResp({ error: 'PDF not found', status: pdfResp.status }, 404)

      const buf    = await pdfResp.arrayBuffer()
      const text   = extractPdfText(buf)
      const riders = parseStandings(text, series)

      if (!riders || riders.length < 3) {
        return jsonResp({ error: 'Parse failed', raw: text.slice(0, 300) }, 422)
      }
      return jsonResp({ year, event, series, riders })

    } catch (err) {
      return jsonResp({ error: err.message }, 500)
    }
  }

  // ── WSBK PDF PROXY ──────────────────────────────────────────
  let target
  if (path.startsWith('wsbk-pdf/')) {
    target = 'https://resources.worldsbk.com/files/results/' + path.slice(9)
  } else if (path.startsWith('wsbk-standings/')) {
    const parts = path.slice(15).split('/')
    const cat   = parts[0].toLowerCase()
    const year  = parts[1] || '2026'
    target = 'https://www.worldsbk.com/en/results%20statistics/' + cat + '?year=' + year
  } else {
    target = 'https://api.motogp.pulselive.com/motogp/v1/results/' + path
  }

  const r = await fetch(target, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36',
      'Accept': '*/*',
      'Referer': 'https://www.worldsbk.com/'
    }
  })
  const d = await r.arrayBuffer()
  return new Response(d, {
    headers: { ...corsHeaders(), 'Content-Type': r.headers.get('Content-Type') || 'text/html' }
  })
}

// ── CORS ────────────────────────────────────────────────────────
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
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
  })
}

// ── PDF SZÖVEG KINYERÉSE ─────────────────────────────────────────
// Nyers PDF binárisból kinyerjük a (string)Tj és [(string)]TJ elemeket
function extractPdfText(buf) {
  const bytes   = new Uint8Array(buf)
  const decoder = new TextDecoder('latin1')
  const raw     = decoder.decode(bytes)

  let out = ''

  // (szöveg)Tj
  const reTj = /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*Tj/g
  let m
  while ((m = reTj.exec(raw)) !== null) {
    out += decodePdfStr(m[1]) + ' '
  }

  // [(szöveg...)]TJ
  const reTJ = /\[([^\]]*)\]\s*TJ/g
  while ((m = reTJ.exec(raw)) !== null) {
    const inner = m[1]
    const rePart = /\(([^)\\]*(?:\\.[^)\\]*)*)\)/g
    let pm
    while ((pm = rePart.exec(inner)) !== null) {
      out += decodePdfStr(pm[1]) + ' '
    }
  }

  return out.replace(/\s+/g, ' ').trim()
}

function decodePdfStr(s) {
  return s
    .replace(/\\n/g, ' ').replace(/\\r/g, ' ').replace(/\\t/g, ' ')
    .replace(/\\\(/g, '(').replace(/\\\)/g, ')').replace(/\\\\/g, '\\')
}

// ── STANDINGS PARSER ─────────────────────────────────────────────
// Minden sorozatnál (SBK, SSP, WCR, SPB, R3) azonos PDF struktúra:
//
//   SBK/SSP/WCR/SPB:
//     "1 BULEGA 211 2 LECUONA 137 74 Iker ESP ..."
//     → POS VEZÉKNÉV PTS [lemaradás...] Keresztnév NAT
//
//   R3:
//     "1 BOCANEGRA 25 25 Aymon BRA 1 2 MENDEZ 20 5 20 Xarly DOM 2 ..."
//     → POS VEZÉKNÉV PTS [pontok_előző_futamtól...] Keresztnév NAT POS
//
// Megoldás: egyszerű "POS VEZÉKNÉV PTS" minta, seen[pos] duplikáció-szűrővel.
// Az első találatot tartjuk meg minden pozícióhoz — ez mindig helyes.
function parseStandings(text, series) {
  const riders = []
  const seen   = {}

  // Zajszavak — NAT kódok és technikai szavak
  const noise = new Set([
    'ITA','ESP','GBR','USA','AUS','POR','FRA','GER','NED','BEL','JPN','THA',
    'INA','MAL','TUR','CHI','MEX','POL','CZE','DEN','SUI','AND','IND','BRA',
    'DOM','AUT','ARG','RSA','FIN','SWE','NOR','CAN','KOR','NED','AND',
    'SBK','SSP','WCR','SPB','CLA','STD','SUP','WUP','FIM','BMW','TJ',
    'BT','ET','PDF','RGB','REVISED','TJP','CMY','BDC'
  ])

  // Keresztnév keresése: "Aymon BRA" vagy "Nicolo ITA" vagy "Aymon (BRA)"
  const reName = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+(?:\()?([A-Z]{2,3})(?:\))?/g
  const names = []
  let nm
  while ((nm = reName.exec(text)) !== null) {
    names.push({ idx: nm.index, first: nm[1] })
  }

  // Fő minta: POS VEZÉKNÉV PTS
  const re = /\b(\d{1,2})\s+([A-Z]{2,})\s+(\d{1,3})\b/g
  let m
  while ((m = re.exec(text)) !== null) {
    const pos  = parseInt(m[1])
    const last = m[2]
    const pts  = parseInt(m[3])

    if (pos < 1 || pos > 60) continue
    if (pts < 1 || pts > 900) continue
    if (noise.has(last)) continue
    if (seen[pos]) continue

    // Keresztnév keresése a match után (max 100 kar)
    const afterIdx = m.index + m[0].length
    const nm2 = names.find(n => n.idx >= afterIdx && n.idx < afterIdx + 100)
    const first = nm2 ? nm2.first : ''
    const name  = first
      ? first + ' ' + last[0] + last.slice(1).toLowerCase()
      : last[0] + last.slice(1).toLowerCase()

    seen[pos] = 1
    riders.push({ pos, name, pts })
  }

  // Rendezés pozíció szerint
  riders.sort((a, b) => a.pos - b.pos)

  // Csak az első összefüggő sorozat (1, 2, 3, ...)
  const clean = []
  for (let i = 0; i < riders.length; i++) {
    if (riders[i].pos === i + 1) clean.push(riders[i])
    else break
  }

  // Validáció: első 3 helyen csökkenő pontok
  if (clean.length >= 3) {
    for (let i = 1; i < Math.min(clean.length, 5); i++) {
      if (clean[i].pts > clean[i - 1].pts) return null
    }
  }

  return clean.length >= 3 ? clean : null
}
