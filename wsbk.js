// ============================================================
// WSBK MODULE - Race Control Dashboard
// ============================================================

var WSBK_PROXY = 'https://motogp-proxy.porkolab-jozsef.workers.dev/wsbk-pdf/';

var WSBK_SERIES_LABELS = {
  SBK: 'WorldSBK', SSP: 'WorldSSP', WCR: 'WorldWCR',
  R3: 'R3 bLU cRU', SPB: 'WorldSPB'
};

var WSBK_SERIES_URL = {
  SBK: 'SBK', SSP: 'SSP', WCR: 'WCR', SPB: 'SPB', R3: 'YR3EC'
};

var WSBK_SESSIONS_BY_SERIES = {
  SBK: [
    {code:'L1A',label:'FP1'},{code:'L2A',label:'FP2'},{code:'L3A',label:'FP3'},
    {code:'Q1A',label:'SUP'},{code:'W1A',label:'WUP'},
    {code:'001',label:'R1'},{code:'002',label:'SPR'},{code:'003',label:'R2'},
    {code:'STD',label:'STD'}
  ],
  SSP: [
    {code:'L1A',label:'FP'},{code:'Q1A',label:'SUP'},{code:'W1A',label:'WUP'},
    {code:'001',label:'R1'},{code:'002',label:'R2'},{code:'STD',label:'STD'}
  ],
  WCR: [
    {code:'L1A',label:'FP'},{code:'Q1A',label:'SUP'},{code:'W1A',label:'WUP'},
    {code:'001',label:'R1'},{code:'002',label:'R2'},{code:'STD',label:'STD'}
  ],
  SPB: [
    {code:'L1A',label:'FP'},{code:'Q1A',label:'SUP'},{code:'W1A',label:'WUP'},
    {code:'001',label:'R1'},{code:'002',label:'R2'},{code:'STD',label:'STD'}
  ],
  R3: [
    {code:'L1A',label:'FP'},{code:'Q1A',label:'SUP'},
    {code:'001',label:'R1'},{code:'002',label:'R2'},{code:'STD',label:'STD'}
  ]
};

var WSBK_EVENTS = {
  '2026': [
    {code:'AUS',name:'Australian Round',            date:'2026-02-20',dateEnd:'2026-02-22',series:['SBK','SSP']},
    {code:'POR',name:'Pirelli Portuguese Round',    date:'2026-03-27',dateEnd:'2026-03-29',series:['SBK','SSP','WCR','SPB']},
    {code:'NED',name:'Pirelli Dutch Round',         date:'2026-04-17',dateEnd:'2026-04-19',series:['SBK','SSP','WCR','SPB']},
    {code:'HUN',name:'Motul Hungarian Round',       date:'2026-05-01',dateEnd:'2026-05-03',series:['SBK','SSP','WCR','R3']},
    {code:'CZE',name:'Czech Round',                 date:'2026-05-15',dateEnd:'2026-05-17',series:['SBK','SSP','SPB']},
    {code:'ARA',name:'Aragon Round',                date:'2026-05-29',dateEnd:'2026-05-31',series:['SBK','SSP','SPB','R3']},
    {code:'ITA',name:'Pirelli Emilia Romagna Round',date:'2026-06-12',dateEnd:'2026-06-14',series:['SBK','SSP','WCR','SPB']},
    {code:'GBR',name:'Prosecco DOC UK Round',       date:'2026-07-10',dateEnd:'2026-07-12',series:['SBK','SSP','WCR','R3']},
    {code:'FRA',name:'Acerbis French Round',        date:'2026-09-04',dateEnd:'2026-09-06',series:['SBK','SSP','WCR','SPB','R3']},
    {code:'CRE',name:'Italian Round',               date:'2026-09-18',dateEnd:'2026-09-20',series:['SBK','SSP','SPB','R3']},
    {code:'EST',name:'Tissot Estoril Round',        date:'2026-10-09',dateEnd:'2026-10-11',series:['SBK','SSP','WCR','SPB','R3']},
    {code:'JER',name:'Pirelli Spanish Round',       date:'2026-10-16',dateEnd:'2026-10-18',series:['SBK','SSP','WCR','SPB']}
  ],
  '2025': [
    {code:'AUS',name:'Australian Round',    date:'2025-02-21',dateEnd:'2025-02-23',series:['SBK','SSP','R3']},
    {code:'POR',name:'Portuguese Round',    date:'2025-03-28',dateEnd:'2025-03-30',series:['SBK','SSP','R3']},
    {code:'NED',name:'Dutch Round',         date:'2025-04-11',dateEnd:'2025-04-13',series:['SBK','SSP','WCR','R3']},
    {code:'ITA',name:'Italian Round',       date:'2025-05-02',dateEnd:'2025-05-04',series:['SBK','SSP','WCR','R3']},
    {code:'MOS',name:'Czech Round',         date:'2025-05-16',dateEnd:'2025-05-18',series:['SBK','SSP','R3']},
    {code:'RSM',name:'Emilia Romagna Round',date:'2025-06-13',dateEnd:'2025-06-15',series:['SBK','SSP','WCR','R3']},
    {code:'GBR',name:'UK Round',            date:'2025-07-11',dateEnd:'2025-07-13',series:['SBK','SSP','WCR','R3']},
    {code:'HUN',name:'Hungarian Round',     date:'2025-07-25',dateEnd:'2025-07-27',series:['SBK','SSP','WCR','R3']},
    {code:'FRA',name:'French Round',        date:'2025-09-05',dateEnd:'2025-09-07',series:['SBK','SSP','WCR','R3']},
    {code:'ARA',name:'Aragon Round',        date:'2025-09-26',dateEnd:'2025-09-28',series:['SBK','SSP','R3']},
    {code:'EST',name:'Estoril Round',       date:'2025-10-10',dateEnd:'2025-10-12',series:['SBK','SSP','R3']},
    {code:'ESP',name:'Spanish Round',       date:'2025-10-17',dateEnd:'2025-10-19',series:['SBK','SSP','WCR','R3']}
  ]
};

var activeChampionship = 'motogp';
var wsbkYear    = '2026';
var wsbkEvent   = 'HUN';
var wsbkSeries  = 'SBK';
var wsbkSession = '001';
var wsbkSessionLabel = 'R1';

// ============================================================
// CACHE — sessionStorage, kulcs: év+helyszín+sorozat
// ============================================================
function wsbkCacheKey() {
  return 'wsbk_std_' + wsbkYear + '_' + wsbkEvent + '_' + wsbkSeries;
}
function wsbkCacheGet() {
  try { var r = sessionStorage.getItem(wsbkCacheKey()); return r ? JSON.parse(r) : null; }
  catch(e) { return null; }
}
function wsbkCacheSet(data) {
  try { sessionStorage.setItem(wsbkCacheKey(), JSON.stringify(data)); } catch(e) {}
}

// ============================================================
// HELPERS
// ============================================================
function getWsbkSessions() {
  return WSBK_SESSIONS_BY_SERIES[wsbkSeries] || WSBK_SESSIONS_BY_SERIES.SBK;
}
function getWsbkSeriesList() {
  var evList = WSBK_EVENTS[wsbkYear] || [];
  var ev = evList.find(function(e) { return e.code === wsbkEvent; });
  return ev && ev.series ? ev.series : ['SBK','SSP','WCR','SPB','R3'];
}
function getWsbkUrlCode() {
  return WSBK_SERIES_URL[wsbkSeries] || wsbkSeries;
}
function getWsbkPdfUrl(sessionCode) {
  return 'https://resources.worldsbk.com/files/results/'
    + wsbkYear + '/' + wsbkEvent + '/' + getWsbkUrlCode()
    + '/' + sessionCode + '/CLA/Results.pdf';
}
function getWsbkStdProxyUrl() {
  return WSBK_PROXY + wsbkYear + '/' + wsbkEvent + '/' + getWsbkUrlCode()
    + '/001/STD/ChampionshipStandings.pdf';
}

// ============================================================
// SWITCH CHAMPIONSHIP
// ============================================================
function switchChampionship(champ) {
  activeChampionship = champ;
  var panel = document.getElementById('logoPanel');
  if (!panel) return;
  var tp = document.getElementById('timingPanel');
  if (!tp) {
    tp = document.createElement('div');
    tp.id = 'timingPanel';
    panel.appendChild(tp);
  }
  tp.style.cssText = 'width:100%;height:100%;box-sizing:border-box;display:flex;flex-direction:column;overflow:hidden;';
  var img = document.getElementById('logoPanelImg');
  var ph  = document.getElementById('logoPlaceholder');
  if (img) img.style.display = 'none';
  if (ph)  ph.style.display  = 'none';

  if (champ === 'wsbk') {
    renderWsbkPanel(tp);
  } else {
    renderPanel();
    doFetch();
  }
}

// ============================================================
// RENDER WSBK PANEL
// ============================================================
function renderWsbkPanel(panelEl) {
  var evList     = WSBK_EVENTS[wsbkYear] || [];
  var seriesList = getWsbkSeriesList();
  var sessions   = getWsbkSessions();
  var html = '';

  // Row 0: Championship switcher
  html += '<div style="display:flex;flex-shrink:0;border-bottom:1px solid var(--border);">';
  html += '<button onclick="switchChampionship(\'motogp\')" style="flex:1;font-family:Oswald,sans-serif;font-size:10px;letter-spacing:2px;padding:7px 4px;cursor:pointer;border:none;border-bottom:3px solid transparent;background:transparent;color:var(--text-dim);">MotoGP</button>';
  html += '<button onclick="switchChampionship(\'wsbk\')"  style="flex:1;font-family:Oswald,sans-serif;font-size:10px;letter-spacing:2px;padding:7px 4px;cursor:pointer;border:none;border-bottom:3px solid var(--red);background:rgba(255,50,50,0.15);color:var(--red);">WSBK</button>';
  html += '</div>';

  // Row 1: Year + Event selectors + Series logo buttons
  html += '<div style="display:flex;align-items:stretch;flex-shrink:0;border-bottom:1px solid var(--border);">';
  html += '<div style="display:flex;flex-direction:column;flex-shrink:0;border-right:1px solid var(--border);">';
  html += '<select onchange="wsbkYear=this.value;wsbkEvent=(WSBK_EVENTS[this.value]||[])[0].code;wsbkSeries=\'SBK\';wsbkSessionLabel=\'R1\';renderWsbkPanel(document.getElementById(\'timingPanel\'));" style="font-family:Oswald,sans-serif;font-size:10px;background:#1a1a1a;color:var(--red);border:none;border-bottom:1px solid var(--border);padding:4px 6px;cursor:pointer;width:90px;">';
  Object.keys(WSBK_EVENTS).sort().reverse().forEach(function(y) {
    html += '<option value="' + y + '"' + (y===wsbkYear?' selected':'') + '>' + y + '</option>';
  });
  html += '</select>';
  html += '<select onchange="wsbkEvent=this.value;if(!getWsbkSeriesList().includes(wsbkSeries))wsbkSeries=getWsbkSeriesList()[0];renderWsbkPanel(document.getElementById(\'timingPanel\'));" style="font-family:Oswald,sans-serif;font-size:10px;background:#1a1a1a;color:var(--off-white);border:none;padding:4px 6px;cursor:pointer;width:90px;flex:1;">';
  evList.forEach(function(e) {
    html += '<option value="' + e.code + '"' + (e.code===wsbkEvent?' selected':'') + '>' + e.name + '</option>';
  });
  html += '</select>';
  html += '</div>';

  // Series logo buttons
  seriesList.forEach(function(s) {
    var active = s === wsbkSeries;
    var logo = typeof getLogoUrl === 'function' ? (getLogoUrl(WSBK_SERIES_LABELS[s]) || getLogoUrl(s) || '') : '';
    html += '<button onclick="wsbkSeries=\'' + s + '\';wsbkSession=getWsbkSessions()[0].code;wsbkSessionLabel=getWsbkSessions()[0].label;renderWsbkPanel(document.getElementById(\'timingPanel\'));"'
      + ' style="flex:1;cursor:pointer;border:none;border-left:1px solid var(--border);'
      + 'background:' + (active?'rgba(29,185,84,0.1)':'transparent') + ';'
      + 'padding:4px 2px;display:flex;align-items:center;justify-content:center;'
      + 'outline:' + (active?'2px solid rgba(29,185,84,0.7)':'2px solid transparent') + ';outline-offset:-2px;">';
    if (logo) {
      html += '<img src="' + logo + '" style="max-height:24px;max-width:90%;object-fit:contain;opacity:' + (active?'1':'0.5') + ';" onerror="this.style.display=\'none\'">';
    } else {
      html += '<span style="font-family:Oswald,sans-serif;font-size:8px;color:' + (active?'var(--green)':'var(--text-dim)') + '">' + (WSBK_SERIES_LABELS[s]||s) + '</span>';
    }
    html += '</button>';
  });
  html += '</div>';

  // Row 2: Session buttons
  html += '<div style="display:flex;flex-shrink:0;border-bottom:1px solid var(--border);">';
  sessions.forEach(function(sess) {
    var active      = sess.label === wsbkSessionLabel;
    var isStd       = sess.label === 'STD';
    var activeColor = isStd ? 'var(--green)' : 'var(--yellow)';
    var activeBg    = isStd ? 'rgba(29,185,84,0.2)' : 'rgba(245,196,0,0.2)';
    html += '<button onclick="wsbkSession=\'' + sess.code + '\';wsbkSessionLabel=\'' + sess.label + '\';renderWsbkPanel(document.getElementById(\'timingPanel\'));"'
      + ' style="flex:1;font-family:Oswald,sans-serif;font-size:9px;padding:8px 2px;cursor:pointer;border:none;'
      + 'border-bottom:' + (active ? '3px solid '+activeColor : '3px solid transparent') + ';'
      + 'background:' + (active ? activeBg : 'transparent') + ';'
      + 'color:' + (active ? activeColor : 'var(--text-dim)') + ';">' + sess.label + '</button>';
  });
  html += '</div>';

  // Results area
  html += '<div id="wsbkResults" style="flex:1;overflow:auto;padding:8px;">';

  var evInfo = evList.find(function(e) { return e.code === wsbkEvent; });
  if (evInfo && evInfo.dateEnd && new Date(evInfo.dateEnd) > new Date()) {
    // Jövőbeli futam
    var d1 = evInfo.date.replace(/-/g,'.');
    var d2 = evInfo.dateEnd.replace(/-/g,'.');
    html += '<div style="text-align:center;padding:16px;">'
      + '<div style="font-family:Oswald,sans-serif;font-size:11px;color:var(--text-mid);letter-spacing:2px;margin-bottom:8px;">' + evInfo.name.toUpperCase() + '</div>'
      + '<div style="font-family:Oswald,sans-serif;font-size:16px;color:var(--yellow);">' + d1 + ' \u2013 ' + d2 + '</div>'
      + '<div style="font-size:9px;color:var(--text-dim);margin-top:6px;">MEG NEM ZAJLOTT LE</div>'
      + '</div>';
  } else if (wsbkSessionLabel === 'STD') {
    html += '<div style="font-family:Oswald,sans-serif;font-size:9px;color:var(--text-dim);padding:4px;">\u23f3 Bet\u00f6lt\u00e9s...</div>';
  } else {
    // PDF gomb egyéb sessionökhöz
    var sess = sessions.find(function(s) { return s.label === wsbkSessionLabel; });
    if (sess) {
      var pdfUrl = getWsbkPdfUrl(sess.code);
      var seriesLabel = WSBK_SERIES_LABELS[wsbkSeries] || wsbkSeries;
      html += '<div style="text-align:center;padding:20px 10px;">'
        + '<div style="font-family:Oswald,sans-serif;font-size:10px;color:var(--text-mid);margin-bottom:12px;letter-spacing:1px;">'
        + seriesLabel + ' &middot; ' + wsbkEvent + ' &middot; ' + wsbkSessionLabel + '</div>'
        + '<a href="' + pdfUrl + '" target="_blank" style="display:inline-block;font-family:Oswald,sans-serif;font-size:11px;letter-spacing:2px;padding:10px 20px;border:1px solid var(--green);background:rgba(29,185,84,0.1);color:var(--green);text-decoration:none;">&#128196; EREDM\u00c9NYEK PDF</a>'
        + '</div>';
    }
  }

  html += '</div>';
  panelEl.innerHTML = html;

  // STD: standings betöltése
  if (wsbkSessionLabel === 'STD') {
    var rd = document.getElementById('wsbkResults');
    if (rd) loadWsbkStandings(rd);
  }
}

// ============================================================
// STANDINGS BETÖLTÉSE
// 1. sessionStorage cache  2. PDF fetch+parse  3. embedded fallback
// ============================================================
function loadWsbkStandings(rd) {
  var cached = wsbkCacheGet();
  if (cached && cached.length >= 3) {
    renderStandingsTable(rd, cached);
    return;
  }
  fetchAndParseStandings(rd);
}

// ============================================================
// FETCH + PARSE — Cloudflare Worker proxyn keresztül
// ============================================================
function fetchAndParseStandings(rd) {
  if (typeof pdfjsLib === 'undefined') {
    renderEmbeddedStandings(rd);
    return;
  }

  rd.innerHTML = '<div style="font-family:Oswald,sans-serif;font-size:9px;color:var(--text-dim);'
    + 'letter-spacing:2px;padding:8px;text-align:center;">\u23f3 STANDINGS BET\u00d6LT\u00c9SE...</div>';

  pdfjsLib.getDocument(getWsbkStdProxyUrl()).promise
    .then(function(pdf) {
      var pageNums = [];
      for (var i = 1; i <= pdf.numPages; i++) pageNums.push(i);
      return pageNums.reduce(function(p, num) {
        return p.then(function(acc) {
          return pdf.getPage(num).then(function(page) {
            return page.getTextContent();
          }).then(function(tc) {
            // Soronkénti összerakás Y koordináta alapján
            var lines  = [];
            var lastY  = null;
            tc.items.forEach(function(item) {
              var y = Math.round(item.transform[5]);
              if (lastY === null || Math.abs(y - lastY) > 3) {
                lines.push(item.str.trim());
                lastY = y;
              } else {
                lines[lines.length - 1] += ' ' + item.str.trim();
              }
            });
            acc.push(lines.filter(Boolean).join('\n'));
            return acc;
          });
        });
      }, Promise.resolve([]));
    })
    .then(function(pages) {
      var riders = parseStandingsPdf(pages.join('\n'));
      if (riders && riders.length >= 3) {
        wsbkCacheSet(riders);
        renderStandingsTable(rd, riders);
      } else {
        renderEmbeddedStandings(rd);
      }
    })
    .catch(function() {
      renderEmbeddedStandings(rd);
    });
}

// ============================================================
// PARSER
//
// A ChampionshipStandings.pdf tényleges formátuma (pdf.js text layer):
//
//   " 1 BULEGA 211"          ← pozíció, VEZETÉKNÉV, pontszám
//   "Nicolo (ITA) 12 25 25…" ← keresztnév, NAT, körönkénti pontok
//
//   " 2 LECUONA 137 74"      ← a 74 a lemaradás az elsőtől
//   "Iker (ESP) 9 20 20…"
//
// Stratégia: soronként keressük a "POS NAGYBETŰS_NÉV SZÁM" mintát,
// majd a következő sorból a "Keresztnév (NAT)" részt.
// ============================================================
function parseStandingsPdf(text) {
  var riders = [];
  var lines  = text.split('\n').map(function(l) { return l.trim(); }).filter(Boolean);

  // 1. sor mintája: pozíció + VEZETÉKNÉV (lehet kötőjeles) + pontszám [+ lemaradások...]
  // pl. "1 BULEGA 211" vagy "1 BULEGA 211 74" vagy "10 BOOTH-AMOS 47 78 3"
  var reLine = /^(\d{1,2})\s+([A-Z][A-Z\-]{1,})\s+(\d{1,3})(?:\s[\d\s]*)?$/;

  // 2. sor mintája: Keresztnév (NAT)  pl. "Nicolo (ITA)" vagy "Sam (GBR)"
  var reName = /^([A-Z][a-zA-Z\-]+(?:\s[A-Z][a-zA-Z\-]+)?)\s+\([A-Z]{2,3}\)/;

  for (var i = 0; i < lines.length - 1; i++) {
    var m1 = reLine.exec(lines[i]);
    if (!m1) continue;

    var pos  = parseInt(m1[1]);
    var last = m1[2];
    var pts  = parseInt(m1[3]);

    if (pos < 1 || pos > 60 || pts < 1 || pts > 900) continue;

    // Keresztnév a következő sorból
    var m2        = reName.exec(lines[i + 1] || '');
    var firstName = m2 ? m2[1] : '';
    var fullName  = firstName
      ? firstName + ' ' + last.charAt(0) + last.slice(1).toLowerCase()
      : last.charAt(0) + last.slice(1).toLowerCase();

    // Duplikáció kizárása (Independent Riders szekció ugyanazokat megismétli)
    if (!riders.find(function(r) { return r.pos === pos; })) {
      riders.push({ pos: pos, name: fullName, pts: pts });
    }
  }

  riders.sort(function(a, b) { return a.pos - b.pos; });
  return riders;
}

// ============================================================
// STANDINGS TÁBLÁZAT — parsed adatból
// ============================================================
function renderStandingsTable(rd, riders) {
  var label  = WSBK_SERIES_LABELS[wsbkSeries] || wsbkSeries;
  var leader = riders[0].pts;

  var out = '<div style="font-family:Oswald,sans-serif;font-size:9px;color:var(--text-mid);'
    + 'margin-bottom:5px;letter-spacing:1px;">'
    + '<span style="color:var(--yellow);">' + label + '</span>'
    + ' STANDINGS \u00b7 ' + wsbkYear + ' \u00b7 ' + wsbkEvent
    + ' <span style="font-size:7px;color:var(--green);">\u25cf LIVE</span>'
    + '</div>';

  out += '<table style="width:100%;border-collapse:collapse;font-size:10px;">';
  riders.forEach(function(r, i) {
    var pc  = i===0 ? '#f5c400' : i===1 ? '#bbb' : i===2 ? '#cd7f32' : 'var(--off-white)';
    var gap = i===0 ? '' : ('\u2212' + (leader - r.pts));
    out += '<tr style="background:' + (i%2 ? 'transparent' : 'rgba(255,255,255,0.025)') + ';">'
      + '<td style="padding:2px 4px;color:' + pc + ';width:22px;font-weight:' + (i<3?'700':'400') + ';font-family:Oswald,sans-serif;">' + r.pos + '</td>'
      + '<td style="padding:2px 3px;color:var(--white);">' + r.name + '</td>'
      + '<td style="padding:2px 4px;text-align:right;color:' + (i===0?'#f5c400':'var(--green)') + ';font-weight:700;">' + r.pts + '</td>'
      + '<td style="padding:2px 4px;text-align:right;color:var(--text-dim);font-size:9px;width:32px;">' + gap + '</td>'
      + '</tr>';
  });
  out += '</table>';
  rd.innerHTML = out;
}

// ============================================================
// EMBEDDED FALLBACK — HUN 2026 utáni beégetett adatok
// ============================================================
function renderEmbeddedStandings(rd) {
  var data   = WSBK_STANDINGS_EMBEDDED[wsbkSeries] || [];
  var label  = WSBK_SERIES_LABELS[wsbkSeries] || wsbkSeries;

  if (!data.length) {
    rd.innerHTML = '<div style="color:var(--text-dim);font-size:9px;padding:6px;">Nincs adat</div>';
    return;
  }

  var leader = data[0].pts;
  var out = '<div style="font-family:Oswald,sans-serif;font-size:9px;color:var(--text-mid);'
    + 'margin-bottom:5px;letter-spacing:1px;">'
    + '<span style="color:var(--yellow);">' + label + '</span>'
    + ' STANDINGS \u00b7 ' + wsbkYear
    + ' <span style="font-size:7px;color:var(--text-dim);">(HUN ut\u00e1n)</span>'
    + '</div>';

  out += '<table style="width:100%;border-collapse:collapse;font-size:10px;">';
  data.forEach(function(r, i) {
    var pc  = i===0 ? '#f5c400' : i===1 ? '#bbb' : i===2 ? '#cd7f32' : 'var(--off-white)';
    var gap = i===0 ? '' : ('\u2212' + (leader - r.pts));
    out += '<tr style="background:' + (i%2 ? 'transparent' : 'rgba(255,255,255,0.025)') + ';">'
      + '<td style="padding:2px 4px;color:' + pc + ';width:22px;font-weight:' + (i<3?'700':'400') + ';font-family:Oswald,sans-serif;">' + (i+1) + '</td>'
      + '<td style="padding:2px 3px;color:var(--white);">' + r.n + '</td>'
      + '<td style="padding:2px 4px;text-align:right;color:' + (i===0?'#f5c400':'var(--green)') + ';font-weight:700;">' + r.pts + '</td>'
      + '<td style="padding:2px 4px;text-align:right;color:var(--text-dim);font-size:9px;width:32px;">' + gap + '</td>'
      + '</tr>';
  });
  out += '</table>';
  rd.innerHTML = out;
}

// ============================================================
// EMBEDDED STANDINGS — HUN 2026 UTÁN (2026-05-03)
// Forrás: worldsbk.com ChampionshipStandings.pdf
// ============================================================
var WSBK_STANDINGS_EMBEDDED = {
  SBK: [
    {n:'Nicolo Bulega',      pts:211},
    {n:'Iker Lecuona',       pts:137},
    {n:'Sam Lowes',          pts:89},
    {n:'Miguel Oliveira',    pts:85},
    {n:'Alex Lowes',         pts:79},
    {n:'Alvaro Bautista',    pts:70},
    {n:'Axel Bassani',       pts:67},
    {n:'Yari Montella',      pts:61},
    {n:'Lorenzo Baldassarri',pts:58},
    {n:'Andrea Locatelli',   pts:53},
    {n:'Danilo Petrucci',    pts:46},
    {n:'Xavi Vierge',        pts:40},
    {n:'Tarran Mackenzie',   pts:36},
    {n:'Garrett Gerloff',    pts:27},
    {n:'Alberto Surra',      pts:21},
    {n:'Remy Gardner',       pts:16},
    {n:'Stefano Manzi',      pts:9},
    {n:'Thomas Bridewell',   pts:8},
    {n:'Tetsuta Nagashima',  pts:7},
    {n:'Jonathan Rea',       pts:4},
    {n:'Somkiat Chantra',    pts:1},
    {n:'Bahattin Sofuoglu',  pts:1},
    {n:'Ryan Vickers',       pts:1}
  ],
  SSP: [
    {n:'Albert Arenas',      pts:125},
    {n:'Jaume Masia',        pts:106},
    {n:'Valentin Debise',    pts:97},
    {n:'Philipp Oettl',      pts:89},
    {n:'Can Oncu',           pts:68},
    {n:'Lucas Mahias',       pts:59},
    {n:'Jeremy Alcoba',      pts:56},
    {n:'Alessandro Zaccone', pts:50},
    {n:'Tom Booth-Amos',     pts:47},
    {n:'Matteo Ferrari',     pts:43},
    {n:'Roberto Garcia',     pts:41},
    {n:'Aldi Mahendra',      pts:33},
    {n:'Simon Jespersen',    pts:27},
    {n:'Mattia Casadei',     pts:21},
    {n:'Oli Bayliss',        pts:20},
    {n:'Dominique Aegerter', pts:20},
    {n:'Corentin Perolari',  pts:16},
    {n:'Filippo Farioli',    pts:14},
    {n:'Andrea Giombini',    pts:13},
    {n:'Ondrej Vostatek',    pts:12},
    {n:'Josh Whatley',       pts:11},
    {n:'Federico Caricasulo',pts:10},
    {n:'Xavi Cardelus',      pts:2}
  ],
  WCR: [
    {n:'Maria Herrera',      pts:115},
    {n:'Beatriz Neila',      pts:97},
    {n:'Roberta Ponziani',   pts:65},
    {n:'Paola Ramos',        pts:61},
    {n:'Muklada Sarapuech',  pts:45},
    {n:'Natalia Rivera',     pts:41},
    {n:'Chloe Jones',        pts:38},
    {n:'Lucie Boudesseul',   pts:36},
    {n:'Pakita Ruiz',        pts:35},
    {n:'Yvonne Cerpa',       pts:28},
    {n:'Tayla Relph',        pts:27},
    {n:'Astrid Madrigal',    pts:24},
    {n:'Sara Sanchez',       pts:20},
    {n:'Karolina Danak',     pts:18},
    {n:'Isis Carreno',       pts:9},
    {n:'Denise Dal Zotto',   pts:9},
    {n:'Arianna Barale',     pts:7},
    {n:'Line Vieillard',     pts:7},
    {n:'Mallory Dobbs',      pts:6},
    {n:'Patrycja Sowa',      pts:4},
    {n:'Lucy Michel',        pts:3},
    {n:'Katie Hand',         pts:2},
    {n:'Adela Ourednickova', pts:2},
    {n:'Emily Bondi',        pts:1}
  ],
  SPB: [
    {n:'David Salvador',     pts:69},
    {n:'Jeffrey Buis',       pts:64},
    {n:'Ferre Fleerackers',  pts:59},
    {n:'Xavi Artigas',       pts:54},
    {n:'Antonio Torres',     pts:53},
    {n:'Matteo Vannucci',    pts:41},
    {n:'Loris Veneman',      pts:40},
    {n:'Bruno Ieraci',       pts:35},
    {n:'Elia Bartolini',     pts:22},
    {n:'Kas Beekmans',       pts:19},
    {n:'Diego Poncet',       pts:18},
    {n:'Carter Thompson',    pts:16},
    {n:'Marco Gaggi',        pts:16},
    {n:'Alvaro Fuertes',     pts:13},
    {n:'Benat Fernandez',    pts:12},
    {n:'Harrison Dessoy',    pts:7},
    {n:'Mirko Gennai',       pts:6},
    {n:'Alessandro Di Persio',pts:5},
    {n:'Jose Osuna',         pts:4},
    {n:'Thomas Benetti',     pts:3},
    {n:'Mattia Sorrenti',    pts:2},
    {n:'Gonzalo Sanchez',    pts:1},
    {n:'Juan Risueno',       pts:1}
  ],
  R3: [
    {n:'Aymon Bocanegra',    pts:25},
    {n:'Xarly Mendez',       pts:20},
    {n:'Alessandro Binder',  pts:16},
    {n:'Emanuele Pastore',   pts:13},
    {n:'Christopher Clark',  pts:11},
    {n:'Mauro Gomez',        pts:10},
    {n:'Riichi Takahira',    pts:9},
    {n:'Rintaro Takemoto',   pts:8},
    {n:'Angelo Mottola',     pts:7},
    {n:'Heitor Santana',     pts:6},
    {n:'Salvatore Germano',  pts:5},
    {n:'Daniel Krabacher',   pts:4},
    {n:'Ruggero Berti',      pts:3},
    {n:'Nathan Bettencourt', pts:2},
    {n:'Charlie Huntingford',pts:1}
  ]
};

// ============================================================
// DOMContentLoaded — pdf.js worker init
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
});
