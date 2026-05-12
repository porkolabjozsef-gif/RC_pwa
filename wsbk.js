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
    {code:'AUS',name:'Australian Round',          date:'2026-02-20',dateEnd:'2026-02-22',series:['SBK','SSP']},
    {code:'POR',name:'Pirelli Portuguese Round',  date:'2026-03-27',dateEnd:'2026-03-29',series:['SBK','SSP','WCR','SPB']},
    {code:'NED',name:'Pirelli Dutch Round',       date:'2026-04-17',dateEnd:'2026-04-19',series:['SBK','SSP','WCR','SPB']},
    {code:'HUN',name:'Motul Hungarian Round',     date:'2026-05-01',dateEnd:'2026-05-03',series:['SBK','SSP','WCR','R3']},
    {code:'CZE',name:'Czech Round',               date:'2026-05-15',dateEnd:'2026-05-17',series:['SBK','SSP','SPB']},
    {code:'ARA',name:'Aragon Round',              date:'2026-05-29',dateEnd:'2026-05-31',series:['SBK','SSP','SPB','R3']},
    {code:'ITA',name:'Pirelli Emilia Romagna Round',date:'2026-06-12',dateEnd:'2026-06-14',series:['SBK','SSP','WCR','SPB']},
    {code:'GBR',name:'Prosecco DOC UK Round',     date:'2026-07-10',dateEnd:'2026-07-12',series:['SBK','SSP','WCR','R3']},
    {code:'FRA',name:'Acerbis French Round',      date:'2026-09-04',dateEnd:'2026-09-06',series:['SBK','SSP','WCR','SPB','R3']},
    {code:'CRE',name:'Italian Round',             date:'2026-09-18',dateEnd:'2026-09-20',series:['SBK','SSP','SPB','R3']},
    {code:'EST',name:'Tissot Estoril Round',      date:'2026-10-09',dateEnd:'2026-10-11',series:['SBK','SSP','WCR','SPB','R3']},
    {code:'JER',name:'Pirelli Spanish Round',     date:'2026-10-16',dateEnd:'2026-10-18',series:['SBK','SSP','WCR','SPB']}
  ],
  '2025': [
    {code:'AUS',name:'Australian Round',          date:'2025-02-21',dateEnd:'2025-02-23',series:['SBK','SSP','R3']},
    {code:'POR',name:'Portuguese Round',          date:'2025-03-28',dateEnd:'2025-03-30',series:['SBK','SSP','R3']},
    {code:'NED',name:'Dutch Round',               date:'2025-04-11',dateEnd:'2025-04-13',series:['SBK','SSP','WCR','R3']},
    {code:'ITA',name:'Italian Round',             date:'2025-05-02',dateEnd:'2025-05-04',series:['SBK','SSP','WCR','R3']},
    {code:'MOS',name:'Czech Round',               date:'2025-05-16',dateEnd:'2025-05-18',series:['SBK','SSP','R3']},
    {code:'RSM',name:'Emilia Romagna Round',      date:'2025-06-13',dateEnd:'2025-06-15',series:['SBK','SSP','WCR','R3']},
    {code:'GBR',name:'UK Round',                  date:'2025-07-11',dateEnd:'2025-07-13',series:['SBK','SSP','WCR','R3']},
    {code:'HUN',name:'Hungarian Round',           date:'2025-07-25',dateEnd:'2025-07-27',series:['SBK','SSP','WCR','R3']},
    {code:'FRA',name:'French Round',              date:'2025-09-05',dateEnd:'2025-09-07',series:['SBK','SSP','WCR','R3']},
    {code:'ARA',name:'Aragon Round',              date:'2025-09-26',dateEnd:'2025-09-28',series:['SBK','SSP','R3']},
    {code:'EST',name:'Estoril Round',             date:'2025-10-10',dateEnd:'2025-10-12',series:['SBK','SSP','R3']},
    {code:'ESP',name:'Spanish Round',             date:'2025-10-17',dateEnd:'2025-10-19',series:['SBK','SSP','WCR','R3']}
  ]
};

var activeChampionship = 'motogp';
var wsbkYear = '2026';
var wsbkEvent = 'HUN';
var wsbkSeries = 'SBK';
var wsbkSession = '001';
var wsbkSessionLabel = 'R1';

// ============================================================
// STANDINGS CACHE — sessionStorage kulcs per sorozat+év+helyszín
// ============================================================
function wsbkStdCacheKey() {
  return 'wsbk_std_' + wsbkYear + '_' + wsbkEvent + '_' + wsbkSeries;
}

function wsbkStdCacheGet() {
  try {
    var raw = sessionStorage.getItem(wsbkStdCacheKey());
    if (!raw) return null;
    return JSON.parse(raw);
  } catch(e) { return null; }
}

function wsbkStdCacheSet(riders) {
  try {
    sessionStorage.setItem(wsbkStdCacheKey(), JSON.stringify(riders));
  } catch(e) {}
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

// Championship Standings PDF URL — mindig az R1 (001) utáni STD
function getWsbkStdPdfUrl() {
  return 'https://resources.worldsbk.com/files/results/'
    + wsbkYear + '/' + wsbkEvent + '/' + getWsbkUrlCode()
    + '/001/STD/ChampionshipStandings.pdf';
}

// Proxy URL (Cloudflare Worker-en keresztül)
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
  var ph = document.getElementById('logoPlaceholder');
  if (img) img.style.display = 'none';
  if (ph) ph.style.display = 'none';

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
  var evList = WSBK_EVENTS[wsbkYear] || [];
  var seriesList = getWsbkSeriesList();
  var sessions = getWsbkSessions();
  var html = '';

  // Row 0: Championship switcher
  html += '<div style="display:flex;flex-shrink:0;border-bottom:1px solid var(--border);">';
  html += '<button onclick="switchChampionship(\'motogp\')" style="flex:1;font-family:Oswald,sans-serif;font-size:10px;letter-spacing:2px;padding:7px 4px;cursor:pointer;border:none;border-bottom:3px solid transparent;background:transparent;color:var(--text-dim);">MotoGP</button>';
  html += '<button onclick="switchChampionship(\'wsbk\')" style="flex:1;font-family:Oswald,sans-serif;font-size:10px;letter-spacing:2px;padding:7px 4px;cursor:pointer;border:none;border-bottom:3px solid var(--red);background:rgba(255,50,50,0.15);color:var(--red);">WSBK</button>';
  html += '</div>';

  // Row 1: Year + Event + Series logos
  html += '<div style="display:flex;align-items:stretch;gap:0;flex-shrink:0;border-bottom:1px solid var(--border);">';
  html += '<div style="display:flex;flex-direction:column;gap:0;flex-shrink:0;border-right:1px solid var(--border);">';
  html += '<select onchange="wsbkYear=this.value;wsbkEvent=(WSBK_EVENTS[this.value]||[])[0].code;wsbkSeries=\'SBK\';wsbkSessionLabel=\'R1\';var tp=document.getElementById(\'timingPanel\');renderWsbkPanel(tp);" style="font-family:Oswald,sans-serif;font-size:10px;background:#1a1a1a;color:var(--red);border:none;border-bottom:1px solid var(--border);padding:4px 6px;cursor:pointer;width:90px;">';
  Object.keys(WSBK_EVENTS).sort().reverse().forEach(function(y) {
    html += '<option value="' + y + '"' + (y === wsbkYear ? ' selected' : '') + '>' + y + '</option>';
  });
  html += '</select>';
  html += '<select onchange="wsbkEvent=this.value;if(!getWsbkSeriesList().includes(wsbkSeries))wsbkSeries=getWsbkSeriesList()[0];var tp=document.getElementById(\'timingPanel\');renderWsbkPanel(tp);" style="font-family:Oswald,sans-serif;font-size:10px;background:#1a1a1a;color:var(--off-white);border:none;padding:4px 6px;cursor:pointer;width:90px;flex:1;">';
  evList.forEach(function(e) {
    html += '<option value="' + e.code + '"' + (e.code === wsbkEvent ? ' selected' : '') + '>' + e.name + '</option>';
  });
  html += '</select>';
  html += '</div>';

  // Series logos
  seriesList.forEach(function(s) {
    var active = s === wsbkSeries;
    var logo = typeof getLogoUrl === 'function' ? (getLogoUrl(WSBK_SERIES_LABELS[s]) || getLogoUrl(s) || '') : '';
    html += '<button onclick="wsbkSeries=\'' + s + '\';wsbkSession=getWsbkSessions()[0].code;wsbkSessionLabel=getWsbkSessions()[0].label;var tp=document.getElementById(\'timingPanel\');renderWsbkPanel(tp);" style="flex:1;cursor:pointer;border:none;border-left:1px solid var(--border);background:' + (active ? 'rgba(29,185,84,0.1)' : 'transparent') + ';padding:4px 2px;display:flex;align-items:center;justify-content:center;outline:' + (active ? '2px solid rgba(29,185,84,0.7)' : '2px solid transparent') + ';outline-offset:-2px;">';
    if (logo) {
      html += '<img src="' + logo + '" style="max-height:24px;max-width:90%;object-fit:contain;opacity:' + (active ? '1' : '0.5') + ';" onerror="this.style.display=\'none\'">';
    } else {
      html += '<span style="font-family:Oswald,sans-serif;font-size:8px;color:' + (active ? 'var(--green)' : 'var(--text-mid)') + '">' + (WSBK_SERIES_LABELS[s] || s) + '</span>';
    }
    html += '</button>';
  });
  html += '</div>';

  // Row 2: Session buttons
  html += '<div style="display:flex;flex-shrink:0;border-bottom:1px solid var(--border);">';
  sessions.forEach(function(sess) {
    var active = sess.label === wsbkSessionLabel;
    var isStd = sess.label === 'STD';
    var activeColor = isStd ? 'var(--green)' : 'var(--yellow)';
    var activeBg = isStd ? 'rgba(29,185,84,0.2)' : 'rgba(245,196,0,0.2)';
    html += '<button onclick="wsbkSession=\'' + sess.code + '\';wsbkSessionLabel=\'' + sess.label + '\';var tp=document.getElementById(\'timingPanel\');renderWsbkPanel(tp);" style="flex:1;font-family:Oswald,sans-serif;font-size:9px;padding:8px 2px;cursor:pointer;border:none;border-bottom:' + (active ? '3px solid ' + activeColor : '3px solid transparent') + ';background:' + (active ? activeBg : 'transparent') + ';color:' + (active ? activeColor : 'var(--text-dim)') + ';">' + sess.label + '</button>';
  });
  html += '</div>';

  // Results area
  html += '<div id="wsbkResults" style="flex:1;overflow:auto;padding:8px;">';

  var evInfo = evList.find(function(e) { return e.code === wsbkEvent; });
  if (evInfo && evInfo.dateEnd && new Date(evInfo.dateEnd) > new Date()) {
    // Future event
    var d1 = evInfo.date.replace(/-/g, '.');
    var d2 = evInfo.dateEnd.replace(/-/g, '.');
    html += '<div style="text-align:center;padding:16px;">'
      + '<div style="font-family:Oswald,sans-serif;font-size:11px;color:var(--text-mid);letter-spacing:2px;margin-bottom:8px;">' + evInfo.name.toUpperCase() + '</div>'
      + '<div style="font-family:Oswald,sans-serif;font-size:16px;color:var(--yellow);">' + d1 + ' - ' + d2 + '</div>'
      + '<div style="font-size:9px;color:var(--text-dim);margin-top:6px;">MEG NEM ZAJLOTT LE</div>'
      + '</div>';
  } else if (wsbkSessionLabel === 'STD') {
    // Standings placeholder — töltés indul a renderWsbkPanel után
    html += '<div id="wsbkStdLoading" style="text-align:center;padding:12px;">'
      + '<div style="font-family:Oswald,sans-serif;font-size:9px;color:var(--text-dim);letter-spacing:2px;margin-bottom:6px;">STANDINGS BETÖLTÉSE...</div>'
      + '<div style="font-size:18px;">⏳</div>'
      + '</div>';
  } else {
    // PDF open button
    var sess = sessions.find(function(s) { return s.label === wsbkSessionLabel; });
    if (sess) {
      var pdfUrl = getWsbkPdfUrl(sess.code);
      var label = WSBK_SERIES_LABELS[wsbkSeries] || wsbkSeries;
      html += '<div style="text-align:center;padding:20px 10px;">'
        + '<div style="font-family:Oswald,sans-serif;font-size:10px;color:var(--text-mid);margin-bottom:12px;letter-spacing:1px;">'
        + label + ' &middot; ' + wsbkEvent + ' &middot; ' + wsbkSessionLabel + '</div>'
        + '<a href="' + pdfUrl + '" target="_blank" style="display:inline-block;font-family:Oswald,sans-serif;font-size:11px;letter-spacing:2px;padding:10px 20px;cursor:pointer;border:1px solid var(--green);background:rgba(29,185,84,0.1);color:var(--green);text-decoration:none;">&#128196; EREDMÉNYEK PDF</a>'
        + '</div>';
    }
  }
  html += '</div>';

  panelEl.innerHTML = html;

  // STD esetén indítjuk a fetch-et
  if (wsbkSessionLabel === 'STD') {
    var rd = document.getElementById('wsbkResults');
    if (rd) loadWsbkStandings(rd);
  }
}

// ============================================================
// STANDINGS — főfüggvény
// Sorrend: 1) sessionStorage cache, 2) PDF fetch+parse, 3) embedded fallback
// ============================================================
function loadWsbkStandings(rd) {
  // 1. Cache check
  var cached = wsbkStdCacheGet();
  if (cached && cached.length) {
    renderStandingsTable(rd, cached, wsbkEvent, '(cache)');
    return;
  }

  // 2. PDF fetch
  fetchWsbkStandings(rd);
}

// ============================================================
// FETCH + PARSE — Cloudflare Worker proxyn keresztül
// ============================================================
function fetchWsbkStandings(rd) {
  if (typeof pdfjsLib === 'undefined') {
    // pdf.js nem elérhető — fallback
    renderEmbeddedStandings(rd, 'pdf.js N/A');
    return;
  }

  var proxyUrl = getWsbkStdProxyUrl();
  var directUrl = getWsbkStdPdfUrl();
  var label = WSBK_SERIES_LABELS[wsbkSeries] || wsbkSeries;

  // Loading UI
  rd.innerHTML = '<div style="text-align:center;padding:12px;">'
    + '<div style="font-family:Oswald,sans-serif;font-size:9px;color:var(--yellow);letter-spacing:2px;margin-bottom:6px;">&#9203; ' + label + ' STANDINGS...</div>'
    + '<div style="font-size:9px;color:var(--text-dim);">' + wsbkYear + ' / ' + wsbkEvent + '</div>'
    + '</div>';

  var loadingTask = pdfjsLib.getDocument(proxyUrl);
  loadingTask.promise.then(function(pdf) {
    return extractTextFromPdf(pdf);
  }).then(function(text) {
    var riders = parseStandingsPdfText(text);
    if (riders && riders.length >= 3) {
      wsbkStdCacheSet(riders);
      renderStandingsTable(rd, riders, wsbkEvent, wsbkYear);
    } else {
      // Parse sikertelen — embedded + PDF gomb
      renderEmbeddedStandings(rd, 'parse hiba');
    }
  }).catch(function(err) {
    // 404 vagy hálózati hiba — embedded + PDF gomb
    var reason = (err && err.message) ? err.message : 'fetch hiba';
    renderEmbeddedStandings(rd, reason);
  });
}

// ============================================================
// PDF szöveg kinyerése — összes oldal, soronként
// ============================================================
function extractTextFromPdf(pdf) {
  var pages = [];
  for (var i = 1; i <= pdf.numPages; i++) {
    pages.push(i);
  }
  return pages.reduce(function(promise, pageNum) {
    return promise.then(function(acc) {
      return pdf.getPage(pageNum).then(function(page) {
        return page.getTextContent();
      }).then(function(content) {
        var pageText = content.items.map(function(item) {
          return item.str;
        }).join(' ');
        acc.push(pageText);
        return acc;
      });
    });
  }, Promise.resolve([])).then(function(pages) {
    return pages.join(' ');
  });
}

// ============================================================
// STANDINGS PDF PARSE — Championship Standings formátum
// A ChampionshipStandings.pdf jellemző szerkezete:
//   Pos  No  Rider  Nat  Team  Bike  R1  SPR  R2  ...  Tot
// ============================================================
function parseStandingsPdfText(text) {
  var riders = [];
  // Normalizálás
  var plain = text.replace(/\s+/g, ' ').trim();

  if (wsbkSeries === 'R3') {
    // R3: eltérő formátum
    var reR3 = /(\d{1,3})\s+\d{1,3}\s+([A-Z]{2,}(?:\s+[A-Z][a-z]*)*)\s+[A-Z]{3}\s+(?:\S+\s+){1,6}(\d{1,3})(?:\s|$)/g;
    var mR3;
    while ((mR3 = reR3.exec(plain)) !== null) {
      var posR3 = parseInt(mR3[1]);
      var ptsR3 = parseInt(mR3[3]);
      if (posR3 >= 1 && posR3 <= 50 && ptsR3 <= 600) {
        var nameParts = mR3[2].trim().split(/\s+/);
        var nameR3 = nameParts.map(function(p) {
          return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
        }).join(' ');
        riders.push({pos: posR3, name: nameR3, pts: ptsR3});
      }
      if (riders.length >= 25) break;
    }
  } else {
    // SBK / SSP / WCR / SPB
    // Standings PDF jellemző mintája:
    // "1 11 Bulega Nicolo ITA Aruba Racing ... 248"
    // vagy "1  N. Bulega  ITA  ...  248"
    // Próbálkozás 1: Pos + No + Rider (Keresztnév Vezéknév) + NAT + ... + Pts (utolsó szám a sorban)
    var re1 = /(?:^|\s)(\d{1,2})\s+\d{1,3}\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s+[A-Z]{3}\s+(?:.*?)(\d{1,3})(?=\s+\d{1,2}\s+\d{1,3}\s+[A-Z]|$)/g;
    var m1;
    while ((m1 = re1.exec(plain)) !== null) {
      var pos1 = parseInt(m1[1]);
      var pts1 = parseInt(m1[3]);
      if (pos1 >= 1 && pos1 <= 50 && pts1 >= 1 && pts1 <= 700) {
        riders.push({pos: pos1, name: m1[2].trim(), pts: pts1});
      }
      if (riders.length >= 30) break;
    }

    // Próbálkozás 2: egyszerűbb minta — Pos + Rider + NAT + Pts
    if (riders.length < 3) {
      riders = [];
      var re2 = /(?:^|\s)(\d{1,2})\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s+[A-Z]{3}\s+(\d{1,3})(?:\s|$)/g;
      var m2;
      while ((m2 = re2.exec(plain)) !== null) {
        var pos2 = parseInt(m2[1]);
        var pts2 = parseInt(m2[3]);
        if (pos2 >= 1 && pos2 <= 50 && pts2 >= 1 && pts2 <= 700) {
          riders.push({pos: pos2, name: m2[2].trim(), pts: pts2});
        }
        if (riders.length >= 30) break;
      }
    }

    // Próbálkozás 3: NAGYBETŰS nevek (egyes PDF-ek így exportálnak)
    if (riders.length < 3) {
      riders = [];
      var re3 = /(?:^|\s)(\d{1,2})\s+([A-Z]{2,}(?:\s+[A-Z]{2,})+)\s+[A-Z]{3}\s+(\d{1,3})(?:\s|$)/g;
      var m3;
      while ((m3 = re3.exec(plain)) !== null) {
        var pos3 = parseInt(m3[1]);
        var pts3 = parseInt(m3[3]);
        if (pos3 >= 1 && pos3 <= 50 && pts3 >= 1 && pts3 <= 700) {
          // Konvertálás Title Case-be
          var name3 = m3[2].trim().split(/\s+/).map(function(w) {
            return w.charAt(0) + w.slice(1).toLowerCase();
          }).join(' ');
          riders.push({pos: pos3, name: name3, pts: pts3});
        }
        if (riders.length >= 30) break;
      }
    }
  }

  // Deduplikáció és rendezés pozíció szerint
  riders.sort(function(a, b) { return a.pos - b.pos; });
  var seen = {};
  riders = riders.filter(function(r) {
    if (seen[r.pos]) return false;
    seen[r.pos] = true;
    return true;
  });

  return riders;
}

// ============================================================
// STANDINGS TÁBLÁZAT RENDERELÉSE — parsed adatból
// ============================================================
function renderStandingsTable(rd, riders, eventName, note) {
  var label = WSBK_SERIES_LABELS[wsbkSeries] || wsbkSeries;
  var leader = riders[0].pts;
  var directUrl = getWsbkStdPdfUrl();

  var out = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">';
  out += '<div style="font-family:Oswald,sans-serif;font-size:9px;color:var(--text-mid);">'
    + '<span style="color:var(--yellow);">' + label + '</span>'
    + ' STANDINGS ' + wsbkYear
    + ' <span style="font-size:7px;color:var(--text-dim);">(' + eventName + ')</span>'
    + '</div>';
  // PDF gomb
  out += '<a href="' + directUrl + '" target="_blank" title="Standings PDF megnyitása"'
    + ' style="font-family:Oswald,sans-serif;font-size:8px;letter-spacing:1px;padding:2px 6px;'
    + 'border:1px solid rgba(245,196,0,0.4);color:var(--yellow);background:rgba(245,196,0,0.07);'
    + 'text-decoration:none;flex-shrink:0;">&#128196; PDF</a>';
  out += '</div>';

  out += '<table style="width:100%;border-collapse:collapse;font-size:10px;">';
  riders.forEach(function(r, i) {
    var pc = i===0 ? '#f5c400' : i===1 ? '#aaa' : i===2 ? '#cd7f32' : 'var(--off-white)';
    var gap = i===0 ? '' : '-' + (leader - r.pts);
    out += '<tr style="background:' + (i%2 ? 'transparent' : 'rgba(255,255,255,0.02)') + '">'
      + '<td style="padding:2px 3px;color:' + pc + ';width:20px;font-weight:' + (i<3?'bold':'normal') + ';">' + r.pos + '</td>'
      + '<td style="padding:2px 3px;color:var(--white);">' + r.name + '</td>'
      + '<td style="padding:2px 3px;text-align:right;color:' + (i===0 ? '#f5c400' : 'var(--green)') + ';font-weight:bold;">' + r.pts + '</td>'
      + '<td style="padding:2px 3px;text-align:right;color:var(--text-dim);font-size:9px;">' + gap + '</td>'
      + '</tr>';
  });
  out += '</table>';

  if (note && note !== wsbkYear) {
    out += '<div style="font-size:7px;color:var(--text-dim);margin-top:4px;text-align:right;">'
      + (note === '(cache)' ? '&#128190; cached' : '&#128190; live PDF') + '</div>';
  }

  rd.innerHTML = out;
}

// ============================================================
// EMBEDDED FALLBACK — beégetett adatok + PDF link
// ============================================================
function renderEmbeddedStandings(rd, reason) {
  var data = WSBK_STANDINGS_EMBEDDED[wsbkSeries] || [];
  var label = WSBK_SERIES_LABELS[wsbkSeries] || wsbkSeries;
  var directUrl = getWsbkStdPdfUrl();

  if (!data.length) {
    rd.innerHTML = '<div style="text-align:center;padding:12px;">'
      + '<div style="color:var(--text-dim);font-size:9px;margin-bottom:10px;">Nincs adat</div>'
      + '<a href="' + directUrl + '" target="_blank" style="font-family:Oswald,sans-serif;font-size:10px;'
      + 'letter-spacing:1px;padding:6px 12px;border:1px solid var(--yellow);color:var(--yellow);'
      + 'background:rgba(245,196,0,0.08);text-decoration:none;">&#128196; STANDINGS PDF</a>'
      + '</div>';
    return;
  }

  var leader = data[0].pts;
  var out = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">';
  out += '<div style="font-family:Oswald,sans-serif;font-size:9px;color:var(--text-mid);">'
    + '<span style="color:var(--yellow);">' + label + '</span>'
    + ' STANDINGS ' + wsbkYear
    + ' <span style="font-size:7px;color:var(--text-dim);">(NED után)</span>'
    + '</div>';
  // PDF gomb mindig látható
  out += '<a href="' + directUrl + '" target="_blank" title="Friss standings PDF"'
    + ' style="font-family:Oswald,sans-serif;font-size:8px;letter-spacing:1px;padding:2px 6px;'
    + 'border:1px solid rgba(245,196,0,0.4);color:var(--yellow);background:rgba(245,196,0,0.07);'
    + 'text-decoration:none;flex-shrink:0;">&#128196; PDF</a>';
  out += '</div>';

  out += '<table style="width:100%;border-collapse:collapse;font-size:10px;">';
  data.forEach(function(r, i) {
    var pc = i===0 ? '#f5c400' : i===1 ? '#aaa' : i===2 ? '#cd7f32' : 'var(--off-white)';
    var gap = i===0 ? '' : '-' + (leader - r.pts);
    out += '<tr style="background:' + (i%2 ? 'transparent' : 'rgba(255,255,255,0.02)') + '">'
      + '<td style="padding:2px 3px;color:' + pc + ';width:20px;font-weight:' + (i<3?'bold':'normal') + ';">' + (i+1) + '</td>'
      + '<td style="padding:2px 3px;color:var(--white);">' + r.n + '</td>'
      + '<td style="padding:2px 3px;text-align:right;color:' + (i===0 ? '#f5c400' : 'var(--green)') + ';font-weight:bold;">' + r.pts + '</td>'
      + '<td style="padding:2px 3px;text-align:right;color:var(--text-dim);font-size:9px;">' + gap + '</td>'
      + '</tr>';
  });
  out += '</table>';

  // Figyelmeztetés: ez NED utáni adat, HUN még nincs benne
  out += '<div style="margin-top:6px;padding:4px 6px;background:rgba(245,196,0,0.06);'
    + 'border:1px solid rgba(245,196,0,0.2);border-radius:2px;">'
    + '<span style="font-family:Oswald,sans-serif;font-size:8px;color:rgba(245,196,0,0.6);">'
    + '&#9888; Beégetett adat (NED után)'
    + (reason ? ' &mdash; live: ' + reason : '')
    + '</span></div>';

  rd.innerHTML = out;
}

// ============================================================
// EMBEDDED STANDINGS — NED 2026 után (fallback)
// ============================================================
var WSBK_STANDINGS_EMBEDDED = {
  SBK: [
    {n:'Nicolo Bulega',pts:248},{n:'Iker Lecuona',pts:166},{n:'Sam Lowes',pts:99},
    {n:'Miguel Oliveira',pts:85},{n:'Yari Montella',pts:82},{n:'Alex Lowes',pts:82},
    {n:'Alvaro Bautista',pts:81},{n:'Lorenzo Baldassarri',pts:78},{n:'Axel Bassani',pts:67},
    {n:'Andrea Locatelli',pts:53},{n:'Danilo Petrucci',pts:46},{n:'Tarran Mackenzie',pts:45},
    {n:'Xavi Vierge',pts:44},{n:'Garrett Gerloff',pts:40},{n:'Alberto Surra',pts:34},
    {n:'Remy Gardner',pts:23},{n:'Stefano Manzi',pts:15},{n:'Thomas Bridewell',pts:8},
    {n:'Tetsuta Nagashima',pts:7},{n:'Jonathan Rea',pts:4},{n:'Bahattin Sofuoglu',pts:4},
    {n:'Mattia Rato',pts:2},{n:'Somkiat Chantra',pts:2},{n:'Ryan Vickers',pts:1}
  ],
  SSP: [
    {n:'Albert Arenas',pts:150},{n:'Jaume Masia',pts:117},{n:'Valentin Debise',pts:97},
    {n:'Philipp Oettl',pts:89},{n:'Can Oncu',pts:88},{n:'Lucas Mahias',pts:65},
    {n:'Jeremy Alcoba',pts:65},{n:'Roberto Garcia',pts:57},{n:'Tom Booth-Amos',pts:57},
    {n:'Matteo Ferrari',pts:56},{n:'Alessandro Zaccone',pts:53},{n:'Aldi Mahendra',pts:41},
    {n:'Simon Jespersen',pts:34},{n:'Mattia Casadei',pts:26},{n:'Dominique Aegerter',pts:21},
    {n:'Oli Bayliss',pts:20},{n:'Corentin Perolari',pts:16},{n:'Ondrej Vostatek',pts:16},
    {n:'Filippo Farioli',pts:14},{n:'Andrea Giombini',pts:13},{n:'Josh Whatley',pts:13},
    {n:'Federico Caricasulo',pts:10},{n:'Xavi Cardelus',pts:2}
  ],
  WCR: [
    {n:'Maria Herrera',pts:131},{n:'Beatriz Neila',pts:117},{n:'Paola Ramos',pts:86},
    {n:'Roberta Ponziani',pts:76},{n:'Muklada Sarapuech',pts:58},{n:'Natalia Rivera',pts:49},
    {n:'Lucie Boudesseul',pts:45},{n:'Chloe Jones',pts:45},{n:'Pakita Ruiz',pts:41},
    {n:'Astrid Madrigal',pts:34},{n:'Yvonne Cerpa',pts:32},{n:'Tayla Relph',pts:32},
    {n:'Sara Sanchez',pts:20},{n:'Karolina Danak',pts:18},{n:'Isis Carreno',pts:12},
    {n:'Denise Dal Zotto',pts:9},{n:'Line Vieillard',pts:8},{n:'Arianna Barale',pts:7},
    {n:'Mallory Dobbs',pts:6},{n:'Patrycja Sowa',pts:4},{n:'Lucy Michel',pts:3},
    {n:'Emily Bondi',pts:3},{n:'Katie Hand',pts:2},{n:'Adela Ourednickova',pts:2}
  ],
  SPB: [
    {n:'David Salvador',pts:69},{n:'Jeffrey Buis',pts:64},{n:'Ferre Fleerackers',pts:59},
    {n:'Xavi Artigas',pts:54},{n:'Antonio Torres',pts:53},{n:'Matteo Vannucci',pts:41},
    {n:'Loris Veneman',pts:40},{n:'Bruno Ieraci',pts:35},{n:'Elia Bartolini',pts:22},
    {n:'Kas Beekmans',pts:19},{n:'Diego Poncet',pts:18},{n:'Carter Thompson',pts:16},
    {n:'Marco Gaggi',pts:16},{n:'Alvaro Fuertes',pts:13},{n:'Benat Fernandez',pts:12},
    {n:'Harrison Dessoy',pts:7},{n:'Mirko Gennai',pts:6},{n:'Alessandro Di Persio',pts:5},
    {n:'Jose Osuna',pts:4},{n:'Thomas Benetti',pts:3},{n:'Mattia Sorrenti',pts:2},
    {n:'Gonzalo Sanchez',pts:1},{n:'Juan Risueno',pts:1}
  ],
  R3: []
};

// ============================================================
// DOMContentLoaded — pdf.js worker init
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
});
