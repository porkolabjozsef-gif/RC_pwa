// ============================================================
// WSBK MODULE - Race Control Dashboard
// ============================================================

var WSBK_PROXY = 'https://motogp-proxy.porkolab-jozsef.workers.dev/wsbk/';

var WSBK_SERIES_LABELS = {
  SBK: 'WorldSBK', SSP: 'WorldSSP', WCR: 'WorldWCR',
  R3: 'R3 Cup', SPB: 'WorldSPB'
};

var WSBK_SESSIONS = [
  {code:'L1A', label:'FP1', sub:'CLA', file:'Results.pdf'},
  {code:'L2A', label:'FP2', sub:'CLA', file:'Results.pdf'},
  {code:'L3A', label:'FP3', sub:'CLA', file:'Results.pdf'},
  {code:'Q1A', label:'SUP', sub:'CLA', file:'Results.pdf'},
  {code:'W1A', label:'WUP', sub:'CLA', file:'Results.pdf'},
  {code:'001', label:'R1',  sub:'CLA', file:'Results.pdf'},
  {code:'002', label:'SPR', sub:'CLA', file:'Results.pdf'},
  {code:'003', label:'R2',  sub:'CLA', file:'Results.pdf'},
  {code:'001', label:'STD', sub:'STD', file:'ChampionshipStandings.pdf'}
];

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
  var mainSessions = WSBK_SESSIONS.filter(function(s) { return s.label !== 'STD'; });
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

  rd.innerHTML = '<div style="color:var(--text-mid);font-size:10px;padding:4px;">PDF betoltese...</div>';

  var url = WSBK_PROXY + wsbkYear + '/' + wsbkEvent + '/' + wsbkSeries
    + '/' + wsbkSession + '/' + wsbkSessionSub + '/' + wsbkSessionFile;

  if (typeof pdfjsLib === 'undefined') {
    rd.innerHTML = '<div style="color:var(--red);font-size:9px;padding:4px;">PDF.js nem elerheto</div>';
    return;
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
    parseWsbkPdf(rd, texts.join(' '));
  }).catch(function(e) {
    rd.innerHTML = '<div style="color:var(--red);font-size:9px;padding:4px;">Hiba: ' + e.message + '</div>';
  });
}

function parseWsbkPdf(rd, text) {
  // Detect if this is a standings PDF
  var isStandings = wsbkSessionLabel === 'STD' || 
    text.indexOf('Riders Standings') > -1 || 
    text.indexOf('Championship Standing') > -1;

  if (isStandings) {
    parseWsbkStandings(rd, text);
  } else {
    parseWsbkResults(rd, text);
  }
}

function parseWsbkStandings(rd, text) {
  // Structure: NAME (NAT) total_pts round_pts round_pts...
  // e.g. "NEILA 2... 115  20 25  20 25 20"
  // or "1 Maria (ESP) 18 97  16 16  20 25 20 NEILA"
  
  var riders = [];
  
  // Pattern: UPPERCASE surname followed by numbers
  // From raw: "1 Maria (ESP) 18 97 16 16 20 25 20 NEILA 2..."
  // Better pattern: find pos + name + points
  
  // Try: number + name + (nat) + number (points)
  var pattern = /(\d{1,2})\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+\(([A-Z]{3})\)\s+(\d{1,3})/g;
  var m;
  while ((m = pattern.exec(text)) !== null) {
    var pos = parseInt(m[1]);
    if (pos >= 1 && pos <= 30) {
      riders.push({pos: pos, name: m[2], nat: m[3], pts: m[4]});
    }
  }
  
  // Fallback: UPPERCASE names with points
  if (!riders.length) {
    var pattern2 = /([A-Z]{3,}(?:\s[A-Z]{2,})?)\s+(\d{2,3})\s/g;
    var idx = 1;
    while ((m = pattern2.exec(text)) !== null) {
      var pts = parseInt(m[2]);
      if (pts > 0 && pts <= 999 && m[1].length > 2) {
        riders.push({pos: idx++, name: m[1], nat: '', pts: m[2]});
      }
      if (riders.length >= 20) break;
    }
  }

  if (!riders.length) {
    rd.innerHTML = '<div style="font-size:7px;color:var(--text-mid);padding:4px;white-space:pre-wrap;font-family:monospace;overflow:auto;">'
      + text.substring(0, 800).replace(/</g,'&lt;') + '</div>';
    return;
  }

  var label = WSBK_SERIES_LABELS[wsbkSeries] || wsbkSeries;
  var html = '<div style="font-family:Oswald,sans-serif;font-size:9px;color:var(--text-mid);margin-bottom:3px;">'
    + '<span style="color:var(--yellow);">' + label + '</span> STANDINGS - ' + wsbkEvent + ' ' + wsbkYear + '</div>';
  html += '<table style="width:100%;border-collapse:collapse;font-size:10px;">';
  var leader = riders[0] ? parseInt(riders[0].pts) : 0;
  riders.slice(0,20).forEach(function(r, i) {
    var pc = r.pos==1?'#f5c400':r.pos==2?'#aaa':r.pos==3?'#cd7f32':'var(--off-white)';
    var gap = i===0 ? '' : '-'+(leader-parseInt(r.pts));
    html += '<tr style="background:' + (i%2?'transparent':'rgba(255,255,255,0.02)') + '">'
      + '<td style="padding:2px 3px;color:'+pc+';width:20px;">' + r.pos + '</td>'
      + '<td style="padding:2px 3px;color:var(--text-mid);width:24px;font-size:8px;">' + r.nat + '</td>'
      + '<td style="padding:2px 3px;color:var(--white)">' + r.name + '</td>'
      + '<td style="padding:2px 3px;text-align:right;color:'+(i===0?'#f5c400':'var(--green)')+';font-weight:bold;">' + r.pts + '</td>'
      + '<td style="padding:2px 3px;text-align:right;color:var(--text-dim);font-size:9px;">' + gap + '</td>'
      + '</tr>';
  });
  rd.innerHTML = html + '</table>';
}

function parseWsbkResults(rd, text) {
  var riders = [];

  // Known team name fragments to skip
  var teamWords = ['GRT','PATA','ARUBA','BONOVO','GMT94','ROKiT','KLINT','PONS','AMPITO',
    'CRESCENT','RACING','TEAM','MOTOCORSA','BARNI','PEDERCINI','ORELAC','MOTOIN',
    'FIMLA','ITALIKA','EAB','MIE','WILLI','NOLAN','XBOW'];

  // Find all lap times
  var times = [];
  var tm;
  var timeRe = /(\d{1,3}'\d{2}\.\d{3})/g;
  while ((tm = timeRe.exec(text)) !== null) {
    times.push({time: tm[1], index: tm.index});
  }

  // Find names before bike brands
  var brands = 'Yamaha|Ducati|Kawasaki|BMW|Honda|Triumph|Aprilia|Bimota|Panigale|YZF|CBR|ZX|S1000';
  var nameRe = new RegExp('([A-Z]{2,}(?:\\s[A-Z]{2,}){0,2})\\s+(?:' + brands + ')', 'g');
  var nm;
  var pos = 1;
  while ((nm = nameRe.exec(text)) !== null) {
    var name = nm[1].trim();
    
    // Skip if it's a team name fragment
    var isTeam = false;
    teamWords.forEach(function(tw) {
      if (name.indexOf(tw) > -1) isTeam = true;
    });
    // Skip nation codes
    if (/^[A-Z]{3}$/.test(name)) isTeam = true;
    // Skip short fragments
    if (name.length < 3) isTeam = true;
    
    if (!isTeam) {
      var nearTime = times.find(function(t) {
        return t.index > nm.index - 100 && t.index < nm.index + 300;
      });
      riders.push({pos: pos++, num: '', name: name, time: nearTime ? nearTime.time : ''});
    }
    if (riders.length >= 25) break;
  }

  // Deduplicate
  var seen = {};
  riders = riders.filter(function(r) {
    if (seen[r.name]) return false;
    seen[r.name] = true;
    return true;
  });

  if (!riders.length) {
    rd.innerHTML = '<div style="font-size:7px;color:var(--text-mid);padding:4px;white-space:pre-wrap;font-family:monospace;overflow:auto;">'
      + text.substring(0, 800).replace(/</g,'&lt;') + '</div>';
    return;
  }

  var label = WSBK_SERIES_LABELS[wsbkSeries] || wsbkSeries;
  var html = '<div style="font-family:Oswald,sans-serif;font-size:9px;color:var(--text-mid);margin-bottom:3px;">'
    + '<span style="color:var(--green);">' + label + '</span> - ' + wsbkEvent + ' - ' + wsbkSessionLabel + '</div>';
  html += '<table style="width:100%;border-collapse:collapse;font-size:10px;">';
  riders.slice(0,25).forEach(function(r, i) {
    var pc = r.pos==1?'#f5c400':r.pos==2?'#aaa':r.pos==3?'#cd7f32':'var(--off-white)';
    html += '<tr style="background:' + (i%2?'transparent':'rgba(255,255,255,0.02)') + '">'
      + '<td style="padding:2px 3px;color:'+pc+';width:20px;">' + r.pos + '</td>'
      + '<td style="padding:2px 3px;color:var(--text-mid);width:22px;">' + r.num + '</td>'
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
