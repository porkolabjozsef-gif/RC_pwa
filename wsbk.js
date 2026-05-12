// ============================================================
// WSBK MODULE - Race Control Dashboard
// ============================================================

var WSBK_PROXY = 'https://motogp-proxy.porkolab-jozsef.workers.dev/wsbk/';

var WSBK_SERIES_LABELS = {
  SBK: 'WorldSBK', SSP: 'WorldSSP', WCR: 'WorldWCR',
  R3: 'R3 Cup', SPB: 'WorldSPB'
};

// Session listak sorozatonkent
// SBK: FP1, FP2, FP3, SUP, WUP, R1, SPR, R2
// SSP: FP, SUP, WUP, R1, R2
// WCR: FP, SUP, WUP, R1, R2
// SPB: FP, SUP, WUP, R1, R2  
// R3:  R1, R2
var WSBK_SESSIONS_BY_SERIES = {
  SBK: [
    {code:'L1A',label:'FP1',sub:'CLA',file:'Results.pdf'},
    {code:'L2A',label:'FP2',sub:'CLA',file:'Results.pdf'},
    {code:'L3A',label:'FP3',sub:'CLA',file:'Results.pdf'},
    {code:'Q1A',label:'SUP',sub:'CLA',file:'Results.pdf'},
    {code:'W1A',label:'WUP',sub:'CLA',file:'Results.pdf'},
    {code:'001',label:'R1', sub:'CLA',file:'Results.pdf'},
    {code:'002',label:'SPR',sub:'CLA',file:'Results.pdf'},
    {code:'003',label:'R2', sub:'CLA',file:'Results.pdf'},
    {code:'STD',label:'STD',sub:'STD',file:'ChampionshipStandings.pdf'}
  ],
  SSP: [
    {code:'L1A',label:'FP', sub:'CLA',file:'Results.pdf'},
    {code:'Q1A',label:'SUP',sub:'CLA',file:'Results.pdf'},
    {code:'W1A',label:'WUP',sub:'CLA',file:'Results.pdf'},
    {code:'001',label:'R1', sub:'CLA',file:'Results.pdf'},
    {code:'002',label:'R2', sub:'CLA',file:'Results.pdf'},
    {code:'STD',label:'STD',sub:'STD',file:'ChampionshipStandings.pdf'}
  ],
  WCR: [
    {code:'L1A',label:'FP', sub:'CLA',file:'Results.pdf'},
    {code:'Q1A',label:'SUP',sub:'CLA',file:'Results.pdf'},
    {code:'W1A',label:'WUP',sub:'CLA',file:'Results.pdf'},
    {code:'001',label:'R1', sub:'CLA',file:'Results.pdf'},
    {code:'002',label:'R2', sub:'CLA',file:'Results.pdf'},
    {code:'STD',label:'STD',sub:'STD',file:'ChampionshipStandings.pdf'}
  ],
  SPB: [
    {code:'L1A',label:'FP', sub:'CLA',file:'Results.pdf'},
    {code:'Q1A',label:'SUP',sub:'CLA',file:'Results.pdf'},
    {code:'W1A',label:'WUP',sub:'CLA',file:'Results.pdf'},
    {code:'001',label:'R1', sub:'CLA',file:'Results.pdf'},
    {code:'002',label:'R2', sub:'CLA',file:'Results.pdf'},
    {code:'STD',label:'STD',sub:'STD',file:'ChampionshipStandings.pdf'}
  ],
  R3: [
    {code:'L1A',label:'FP', sub:'CLA',file:'Results.pdf'},
    {code:'Q1A',label:'SUP',sub:'CLA',file:'Results.pdf'},
    {code:'001',label:'R1', sub:'CLA',file:'Results.pdf'},
    {code:'002',label:'R2', sub:'CLA',file:'Results.pdf'},
    {code:'STD',label:'STD',sub:'STD',file:'ChampionshipStandings.pdf'}
  ]
};
function getWsbkSessions() {
  return WSBK_SESSIONS_BY_SERIES[wsbkSeries] || WSBK_SESSIONS_BY_SERIES.SBK;
}

// Map display series code to URL series code
var WSBK_SERIES_URL_CODE = {
  SBK: 'SBK', SSP: 'SSP', WCR: 'WCR', SPB: 'SPB', R3: 'YR3EC'
};
function getWsbkSeriesUrlCode() {
  return WSBK_SERIES_URL_CODE[wsbkSeries] || wsbkSeries;
}

var WSBK_EVENTS = {
  '2026': [
    {code:'AUS',name:'Australian Round',           date:'2026-02-20',dateEnd:'2026-02-22',series:['SBK','SSP']},
    {code:'POR',name:'Pirelli Portuguese Round',   date:'2026-03-27',dateEnd:'2026-03-29',series:['SBK','SSP','WCR','SPB']},
    {code:'NED',name:'Pirelli Dutch Round',        date:'2026-04-17',dateEnd:'2026-04-19',series:['SBK','SSP','WCR','SPB']},
    {code:'HUN',name:'Motul Hungarian Round',      date:'2026-05-01',dateEnd:'2026-05-03',series:['SBK','SSP','WCR','R3']},
    {code:'CZE',name:'Czech Round',                date:'2026-05-15',dateEnd:'2026-05-17',series:['SBK','SSP','SPB']},
    {code:'ARA',name:'Aragon Round',               date:'2026-05-29',dateEnd:'2026-05-31',series:['SBK','SSP','SPB','R3']},
    {code:'ITA',name:'Pirelli Emilia Romagna Round',date:'2026-06-12',dateEnd:'2026-06-14',series:['SBK','SSP','WCR','SPB']},
    {code:'GBR',name:'Prosecco DOC UK Round',      date:'2026-07-10',dateEnd:'2026-07-12',series:['SBK','SSP','WCR','R3']},
    {code:'FRA',name:'Acerbis French Round',       date:'2026-09-04',dateEnd:'2026-09-06',series:['SBK','SSP','WCR','SPB','R3']},
    {code:'CRE',name:'Italian Round',              date:'2026-09-18',dateEnd:'2026-09-20',series:['SBK','SSP','SPB','R3']},
    {code:'EST',name:'Tissot Estoril Round',       date:'2026-10-09',dateEnd:'2026-10-11',series:['SBK','SSP','WCR','SPB','R3']},
    {code:'JER',name:'Pirelli Spanish Round',      date:'2026-10-16',dateEnd:'2026-10-18',series:['SBK','SSP','WCR','SPB']}
  ],
  '2025': [
    {code:'AUS',name:'Australian Round',           date:'2025-02-21',dateEnd:'2025-02-23',series:['SBK','SSP','R3']},
    {code:'POR',name:'Portuguese Round',           date:'2025-03-28',dateEnd:'2025-03-30',series:['SBK','SSP','R3']},
    {code:'NED',name:'Dutch Round',                date:'2025-04-11',dateEnd:'2025-04-13',series:['SBK','SSP','WCR','R3']},
    {code:'ITA',name:'Italian Round',              date:'2025-05-02',dateEnd:'2025-05-04',series:['SBK','SSP','WCR','R3']},
    {code:'MOS',name:'Czech Round',                date:'2025-05-16',dateEnd:'2025-05-18',series:['SBK','SSP','R3']},
    {code:'RSM',name:'Emilia Romagna Round',       date:'2025-06-13',dateEnd:'2025-06-15',series:['SBK','SSP','WCR','R3']},
    {code:'GBR',name:'UK Round',                   date:'2025-07-11',dateEnd:'2025-07-13',series:['SBK','SSP','WCR','R3']},
    {code:'HUN',name:'Hungarian Round',            date:'2025-07-25',dateEnd:'2025-07-27',series:['SBK','SSP','WCR','R3']},
    {code:'FRA',name:'French Round',               date:'2025-09-05',dateEnd:'2025-09-07',series:['SBK','SSP','WCR','R3']},
    {code:'ARA',name:'Aragon Round',               date:'2025-09-26',dateEnd:'2025-09-28',series:['SBK','SSP','R3']},
    {code:'EST',name:'Estoril Round',              date:'2025-10-10',dateEnd:'2025-10-12',series:['SBK','SSP','R3']},
    {code:'ESP',name:'Spanish Round',              date:'2025-10-17',dateEnd:'2025-10-19',series:['SBK','SSP','WCR','R3']}
  ]
};

var wsbkYear = '2026';
var wsbkEvent = 'HUN';
var wsbkSeries = 'SBK';
var wsbkSession = '001';
var wsbkSessionLabel = 'R1';
var wsbkSessionSub = 'CLA';
var wsbkSessionFile = 'Results.pdf';

function getWsbkSeries() {
  var evList = WSBK_EVENTS[wsbkYear] || [];
  var ev = evList.find(function(e) { return e.code === wsbkEvent; });
  return ev && ev.series ? ev.series : ['SBK','SSP','WCR','SPB','R3'];
}

function switchChampionship(champ) {
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
    loadWsbkPdf(tp);
  } else {
    renderPanel();
    doFetch();
  }
}

function renderWsbkPanel(panelEl) {
  var evList = WSBK_EVENTS[wsbkYear] || [];
  var seriesList = getWsbkSeries();
  var html = '';

  // Row 0: Bajnoksag valto
  html += '<div style="display:flex;flex-shrink:0;border-bottom:1px solid var(--border);">';
  html += '<button onclick="switchChampionship(\'motogp\')" style="flex:1;font-family:Oswald,sans-serif;font-size:10px;letter-spacing:2px;padding:7px 4px;cursor:pointer;border:none;border-bottom:3px solid transparent;background:transparent;color:var(--text-dim);">MotoGP</button>';
  html += '<button onclick="switchChampionship(\'wsbk\')" style="flex:1;font-family:Oswald,sans-serif;font-size:10px;letter-spacing:2px;padding:7px 4px;cursor:pointer;border:none;border-bottom:3px solid var(--red);background:rgba(255,50,50,0.15);color:var(--red);">WSBK</button>';
  html += '</div>';

  // Row 1: Ev + helyszin + sorozat logok
  html += '<div style="display:flex;align-items:stretch;gap:0;flex-shrink:0;border-bottom:1px solid var(--border);">';
  html += '<div style="display:flex;flex-direction:column;gap:0;flex-shrink:0;border-right:1px solid var(--border);">';
  html += '<select onchange="wsbkYear=this.value;wsbkEvent=(WSBK_EVENTS[this.value]||[])[0].code;wsbkSeries=\'SBK\';var tp=document.getElementById(\'timingPanel\');renderWsbkPanel(tp);loadWsbkPdf(tp);" style="font-family:Oswald,sans-serif;font-size:10px;background:#1a1a1a;color:var(--red);border:none;border-bottom:1px solid var(--border);padding:4px 6px;cursor:pointer;width:90px;">';
  Object.keys(WSBK_EVENTS).sort().reverse().forEach(function(y) {
    html += '<option value="' + y + '"' + (y === wsbkYear ? ' selected' : '') + '>' + y + '</option>';
  });
  html += '</select>';
  html += '<select onchange="wsbkEvent=this.value;if(!getWsbkSeries().includes(wsbkSeries))wsbkSeries=getWsbkSeries()[0];var tp=document.getElementById(\'timingPanel\');renderWsbkPanel(tp);loadWsbkPdf(tp);" style="font-family:Oswald,sans-serif;font-size:10px;background:#1a1a1a;color:var(--off-white);border:none;padding:4px 6px;cursor:pointer;width:90px;flex:1;">';
  evList.forEach(function(e) {
    html += '<option value="' + e.code + '"' + (e.code === wsbkEvent ? ' selected' : '') + '>' + e.name + '</option>';
  });
  html += '</select>';
  html += '</div>';

  seriesList.forEach(function(s) {
    var active = s === wsbkSeries;
    var logo = typeof getLogoUrl === 'function' ? (getLogoUrl(s) || getLogoUrl(WSBK_SERIES_LABELS[s]) || '') : '';
    html += '<button onclick="wsbkSeries=\'' + s + '\';var tp=document.getElementById(\'timingPanel\');renderWsbkPanel(tp);loadWsbkPdf(tp);" style="flex:1;cursor:pointer;border:none;border-left:1px solid var(--border);background:' + (active ? 'rgba(29,185,84,0.1)' : 'transparent') + ';padding:4px 2px;display:flex;align-items:center;justify-content:center;outline:' + (active ? '2px solid rgba(29,185,84,0.7)' : '2px solid transparent') + ';outline-offset:-2px;">';
    if (logo) {
      html += '<img src="' + logo + '" style="max-height:24px;max-width:90%;object-fit:contain;opacity:' + (active ? '1' : '0.5') + ';" onerror="this.style.display=\'none\'">';
    } else {
      html += '<span style="font-family:Oswald,sans-serif;font-size:8px;color:' + (active ? 'var(--green)' : 'var(--text-mid)') + '">' + (WSBK_SERIES_LABELS[s] || s) + '</span>';
    }
    html += '</button>';
  });
  html += '</div>';

  // Row 2: Session gombok
  var mainSessions = getWsbkSessions().filter(function(s) { return s.label !== 'STD'; });
  html += '<div style="display:flex;flex-shrink:0;border-bottom:1px solid var(--border);">';
  mainSessions.forEach(function(sess) {
    var active = sess.label === wsbkSessionLabel;
    html += '<button onclick="wsbkSession=\'' + sess.code + '\';wsbkSessionLabel=\'' + sess.label + '\';wsbkSessionSub=\'' + sess.sub + '\';wsbkSessionFile=\'' + sess.file + '\';var tp=document.getElementById(\'timingPanel\');renderWsbkPanel(tp);loadWsbkPdf(tp);" style="flex:1;font-family:Oswald,sans-serif;font-size:9px;padding:8px 2px;cursor:pointer;border:none;border-bottom:' + (active ? '3px solid var(--yellow)' : '3px solid transparent') + ';background:' + (active ? 'rgba(245,196,0,0.2)' : 'transparent') + ';color:' + (active ? 'var(--yellow)' : 'var(--text-dim)') + ';">' + sess.label + '</button>';
  });
  var stdActive = wsbkSessionLabel === 'STD';
  html += '<button onclick="wsbkSession=\'001\';wsbkSessionLabel=\'STD\';wsbkSessionSub=\'STD\';wsbkSessionFile=\'ChampionshipStandings.pdf\';var tp=document.getElementById(\'timingPanel\');renderWsbkPanel(tp);loadWsbkPdf(tp);" style="flex:1;font-family:Oswald,sans-serif;font-size:9px;padding:8px 2px;cursor:pointer;border:none;border-bottom:' + (stdActive ? '3px solid var(--green)' : '3px solid transparent') + ';background:' + (stdActive ? 'rgba(29,185,84,0.2)' : 'transparent') + ';color:' + (stdActive ? 'var(--green)' : 'var(--text-dim)') + ';">STD</button>';
  html += '</div>';

  html += '<div id="wsbkResults" style="flex:1;overflow:auto;padding:4px 8px;"><div style="color:var(--text-mid);font-size:10px;padding:4px;">Betoltes...</div></div>';
  panelEl.innerHTML = html;
}

function loadWsbkPdf(panelEl) {
  var rd = document.getElementById('wsbkResults');
  if (!rd) return;

  var evList = WSBK_EVENTS[wsbkYear] || [];
  var evInfo = evList.find(function(e) { return e.code === wsbkEvent; });
  if (evInfo && evInfo.dateEnd) {
    var evDate = new Date(evInfo.dateEnd);
    evDate.setHours(23, 59, 59);
    if (evDate > new Date()) {
      var d1 = evInfo.date.replace(/-/g, '.');
      var d2 = evInfo.dateEnd.replace(/-/g, '.');
      rd.innerHTML = '<div style="text-align:center;padding:16px;">'
        + '<div style="font-family:Oswald,sans-serif;font-size:11px;color:var(--text-mid);letter-spacing:2px;margin-bottom:8px;">' + evInfo.name.toUpperCase() + '</div>'
        + '<div style="font-family:Oswald,sans-serif;font-size:16px;color:var(--yellow);">' + d1 + ' - ' + d2 + '</div>'
        + '<div style="font-size:9px;color:var(--text-dim);margin-top:6px;letter-spacing:1px;">MEG NEM ZAJLOTT LE</div>'
        + '</div>';
      return;
    }
  }

  rd.innerHTML = '<div style="color:var(--text-mid);font-size:10px;padding:4px;">Betoltese...</div>';

  // STD: use worldsbk.com HTML standings for all series
  if (wsbkSessionLabel === 'STD') {
    loadWsbkStandings(rd);
    return;
  }

  var url = 'https://motogp-proxy.porkolab-jozsef.workers.dev/wsbk-pdf/' + wsbkYear + '/' + wsbkEvent + '/' + getWsbkSeriesUrlCode()
    + '/' + wsbkSession + '/' + wsbkSessionSub + '/' + wsbkSessionFile;

  if (typeof pdfjsLib === 'undefined') {
    // Retry after 1 second
    setTimeout(function() { loadWsbkPdf(panelEl); }, 1000);
    rd.innerHTML = '<div style="color:var(--text-mid);font-size:9px;padding:4px;">PDF.js betoltese...</div>';
    return;
  }
  
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  pdfjsLib.getDocument(url).promise.then(function(pdf) {
    var pages = [];
    for (var i = 1; i <= Math.min(pdf.numPages, 2); i++) {
      pages.push(pdf.getPage(i).then(function(page) {
        return page.getTextContent().then(function(tc) {
          return tc.items.map(function(item) { return item.str; }).join(' ');
        });
      }));
    }
    return Promise.all(pages);
  }).then(function(texts) {
    parseWsbkResults(rd, texts.join(' '));
  }).catch(function(e) {
    rd.innerHTML = '<div style="color:var(--red);font-size:9px;padding:4px;">Hiba: ' + e.message + '</div>';
  });
}

function parseWsbkR3Standings(rd, text) {
  var riders = [];
  var plain = text.replace(/\s+/g, ' ').trim();
  
  // R3 standings: NAME points pattern
  var re = /([A-Z]{2,}(?:\s+[A-Z]{2,})+)\s+(\d+)/g;
  var m;
  var pos = 1;
  while ((m = re.exec(plain)) !== null) {
    var name = m[1].trim();
    var pts = parseInt(m[2]);
    if (name.length < 4 || pts > 500) continue;
    if (['CHAMPIONSHIP','STANDINGS','RESULTS','RIDERS','ROUND'].some(function(s) { return name.indexOf(s) > -1; })) continue;
    riders.push({pos: pos++, name: name, pts: pts});
    if (riders.length >= 25) break;
  }

  if (!riders.length) {
    rd.innerHTML = '<div style="font-size:7px;color:var(--text-mid);padding:4px;white-space:pre-wrap;">' + text.substring(0,400) + '</div>';
    return;
  }

  var leader = riders[0].pts;
  var out = '<div style="font-family:Oswald,sans-serif;font-size:9px;color:var(--text-mid);margin-bottom:3px;">'
    + '<span style="color:var(--yellow);">R3 bLU cRU</span> STANDINGS ' + wsbkYear + '</div>';
  out += '<table style="width:100%;border-collapse:collapse;font-size:10px;">';
  riders.forEach(function(r, i) {
    var pc = r.pos==1?'#f5c400':r.pos==2?'#aaa':r.pos==3?'#cd7f32':'var(--off-white)';
    var gap = i===0 ? '' : '-'+(leader-r.pts);
    out += '<tr style="background:' + (i%2?'transparent':'rgba(255,255,255,0.02)') + '">'
      + '<td style="padding:2px 3px;color:'+pc+';width:20px;">' + r.pos + '</td>'
      + '<td style="padding:2px 3px;color:var(--white)">' + r.name + '</td>'
      + '<td style="padding:2px 3px;text-align:right;color:'+(i===0?'#f5c400':'var(--green)')+';font-weight:bold;">' + r.pts + '</td>'
      + '<td style="padding:2px 3px;text-align:right;color:var(--text-dim);font-size:9px;">' + gap + '</td>'
      + '</tr>';
  });
  rd.innerHTML = out + '</table>';
}

function parseWsbkPdf(rd, text) {
  parseWsbkResults(rd, text);
}

function parseWsbkResults(rd, text) {
  var riders = [];
  var plain = text.replace(/\s+/g, ' ').trim();

  // Find all times with positions
  var timeRe = /(\d{1,3}'\d{2}\.\d{3})/g;
  var allTimes = [];
  var tm;
  while ((tm = timeRe.exec(plain)) !== null) {
    allTimes.push({time: tm[1], index: tm.index, used: false});
  }

  // Find rider entries: pos grid num Initial.SURNAME NAT
  var riderRe = /\b(\d{1,2})\s+\d{1,2}\s+(\d{1,3})\s+[A-Z]\.\s*([A-Z]{2,})\s+[A-Z]{3}\b/g;
  var m;
  while ((m = riderRe.exec(plain)) !== null) {
    var pos = parseInt(m[1]);
    if (pos < 1 || pos > 30) continue;
    var num = m[2];
    var surname = m[3];
    var afterIdx = m.index + m[0].length;

    // Find next unused time after this rider
    var bestLap = '';
    for (var i = 0; i < allTimes.length; i++) {
      if (allTimes[i].index > afterIdx && !allTimes[i].used) {
        // Skip the race time (first time), use second time (best lap)
        // Mark first as used, take second
        allTimes[i].used = true;
        // Look for next time (best lap)
        for (var j = i+1; j < allTimes.length; j++) {
          if (allTimes[j].index < afterIdx + 400 && !allTimes[j].used) {
            bestLap = allTimes[j].time;
            allTimes[j].used = true;
            break;
          }
        }
        if (!bestLap && allTimes[i]) bestLap = allTimes[i].time;
        break;
      }
    }

    riders.push({pos: pos, num: num, name: surname, time: bestLap});
    if (riders.length >= 25) break;
  }

  // Deduplicate by pos
  var seen = {};
  riders = riders.filter(function(r) {
    if (seen[r.pos]) return false;
    seen[r.pos] = true;
    return true;
  });
  riders.sort(function(a,b) { return a.pos - b.pos; });

  if (!riders.length) {
    rd.innerHTML = '<div style="font-size:7px;color:var(--text-mid);padding:4px;white-space:pre-wrap;font-family:monospace;">'
      + plain.substring(0, 400).replace(/</g,'&lt;') + '</div>';
    return;
  }

  var label = WSBK_SERIES_LABELS[wsbkSeries] || wsbkSeries;
  var html = '<div style="font-family:Oswald,sans-serif;font-size:9px;color:var(--text-mid);margin-bottom:3px;">'
    + '<span style="color:var(--green);">' + label + '</span> - ' + wsbkEvent + ' - ' + wsbkSessionLabel + '</div>';
  html += '<table style="width:100%;border-collapse:collapse;font-size:10px;">';
  riders.forEach(function(r, i) {
    var pc = r.pos==1?'#f5c400':r.pos==2?'#aaa':r.pos==3?'#cd7f32':'var(--off-white)';
    html += '<tr style="background:' + (i%2?'transparent':'rgba(255,255,255,0.02)') + '">'
      + '<td style="padding:2px 3px;color:'+pc+';width:20px;">' + r.pos + '</td>'
      + '<td style="padding:2px 3px;color:var(--text-mid);width:24px;">' + r.num + '</td>'
      + '<td style="padding:2px 3px;color:var(--white)">' + r.name + '</td>'
      + '<td style="padding:2px 3px;text-align:right;color:var(--green);font-size:9px;">' + r.time + '</td>'
      + '</tr>';
  });
  rd.innerHTML = html + '</table>';
}

// Init WSBK when page loads
document.addEventListener('DOMContentLoaded', function() {
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
});
