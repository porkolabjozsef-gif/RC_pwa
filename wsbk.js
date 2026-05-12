// ============================================================
// WSBK MODULE - Race Control Dashboard
// ============================================================

var WSBK_PROXY = 'https://motogp-proxy.porkolab-jozsef.workers.dev/wsbk-pdf/';

var WSBK_SERIES_LABELS = { SBK:'WorldSBK', SSP:'WorldSSP', WCR:'WorldWCR', R3:'R3 bLU cRU', SPB:'WorldSPB' };
var WSBK_SERIES_URL    = { SBK:'SBK', SSP:'SSP', WCR:'WCR', SPB:'SPB', R3:'YR3EC' };

var WSBK_SESSIONS_BY_SERIES = {
  SBK: [{code:'L1A',label:'FP1'},{code:'L2A',label:'FP2'},{code:'L3A',label:'FP3'},
        {code:'Q1A',label:'SUP'},{code:'W1A',label:'WUP'},
        {code:'001',label:'R1'},{code:'002',label:'SPR'},{code:'003',label:'R2'},{code:'STD',label:'STD'}],
  SSP: [{code:'L1A',label:'FP'},{code:'Q1A',label:'SUP'},{code:'W1A',label:'WUP'},
        {code:'001',label:'R1'},{code:'002',label:'R2'},{code:'STD',label:'STD'}],
  WCR: [{code:'L1A',label:'FP'},{code:'Q1A',label:'SUP'},{code:'W1A',label:'WUP'},
        {code:'001',label:'R1'},{code:'002',label:'R2'},{code:'STD',label:'STD'}],
  SPB: [{code:'L1A',label:'FP'},{code:'Q1A',label:'SUP'},{code:'W1A',label:'WUP'},
        {code:'001',label:'R1'},{code:'002',label:'R2'},{code:'STD',label:'STD'}],
  R3:  [{code:'L1A',label:'FP'},{code:'Q1A',label:'SUP'},
        {code:'001',label:'R1'},{code:'002',label:'R2'},{code:'STD',label:'STD'}]
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
var wsbkYear         = '2026';
var wsbkEvent        = 'HUN';
var wsbkSeries       = 'SBK';
var wsbkSession      = '001';
var wsbkSessionLabel = 'R1';

// ============================================================
// CACHE
// ============================================================
function wsbkCacheKey(type) {
  return 'wsbk2_'+type+'_'+wsbkYear+'_'+wsbkEvent+'_'+wsbkSeries+'_'+wsbkSession;
}
function wsbkCacheGet(type) {
  try { var r=sessionStorage.getItem(wsbkCacheKey(type)); return r?JSON.parse(r):null; } catch(e){return null;}
}
function wsbkCacheSet(type,data) {
  try { sessionStorage.setItem(wsbkCacheKey(type),JSON.stringify(data)); } catch(e){}
}

// ============================================================
// HELPERS
// ============================================================
function getWsbkSessions()   { return WSBK_SESSIONS_BY_SERIES[wsbkSeries]||WSBK_SESSIONS_BY_SERIES.SBK; }
function getWsbkSeriesList() {
  var ev=(WSBK_EVENTS[wsbkYear]||[]).find(function(e){return e.code===wsbkEvent;});
  return ev&&ev.series?ev.series:['SBK','SSP','WCR','SPB','R3'];
}
function getWsbkUrlCode() { return WSBK_SERIES_URL[wsbkSeries]||wsbkSeries; }
function getWsbkProxyUrl(sessCode) {
  if(!sessCode)
    return WSBK_PROXY+wsbkYear+'/'+wsbkEvent+'/'+getWsbkUrlCode()+'/001/STD/ChampionshipStandings.pdf';
  return WSBK_PROXY+wsbkYear+'/'+wsbkEvent+'/'+getWsbkUrlCode()+'/'+sessCode+'/CLA/Results.pdf';
}

// ============================================================
// SWITCH CHAMPIONSHIP
// ============================================================
function switchChampionship(champ) {
  activeChampionship=champ;
  var panel=document.getElementById('logoPanel'); if(!panel) return;
  var tp=document.getElementById('timingPanel');
  if(!tp){tp=document.createElement('div');tp.id='timingPanel';panel.appendChild(tp);}
  tp.style.cssText='width:100%;flex:1;min-height:0;box-sizing:border-box;display:flex;flex-direction:column;overflow:hidden;';
  var img=document.getElementById('logoPanelImg'); var ph=document.getElementById('logoPlaceholder');
  if(img) img.style.display='none'; if(ph) ph.style.display='none';
  if(champ==='wsbk'){renderWsbkPanel(tp);}else{renderPanel();doFetch();}
}

// ============================================================
// RENDER WSBK PANEL
// ============================================================
function renderWsbkPanel(panelEl) {
  var evList=WSBK_EVENTS[wsbkYear]||[];
  var seriesList=getWsbkSeriesList();
  var sessions=getWsbkSessions();
  var h='';

  h+='<div style="display:flex;flex-shrink:0;border-bottom:1px solid var(--border);">';
  h+='<button onclick="switchChampionship(\'motogp\')" style="flex:1;font-family:Oswald,sans-serif;font-size:10px;letter-spacing:2px;padding:7px 4px;cursor:pointer;border:none;border-bottom:3px solid transparent;background:transparent;color:var(--text-dim);">MotoGP</button>';
  h+='<button onclick="switchChampionship(\'wsbk\')" style="flex:1;font-family:Oswald,sans-serif;font-size:10px;letter-spacing:2px;padding:7px 4px;cursor:pointer;border:none;border-bottom:3px solid var(--red);background:rgba(255,50,50,0.15);color:var(--red);">WSBK</button>';
  h+='</div>';

  h+='<div style="display:flex;align-items:stretch;flex-shrink:0;border-bottom:1px solid var(--border);">';
  h+='<div style="display:flex;flex-direction:column;flex-shrink:0;border-right:1px solid var(--border);">';
  h+='<select onchange="wsbkYear=this.value;wsbkEvent=(WSBK_EVENTS[this.value]||[])[0].code;wsbkSeries=\'SBK\';wsbkSession=\'001\';wsbkSessionLabel=\'R1\';renderWsbkPanel(document.getElementById(\'timingPanel\'));" style="font-family:Oswald,sans-serif;font-size:10px;background:#1a1a1a;color:var(--red);border:none;border-bottom:1px solid var(--border);padding:4px 6px;cursor:pointer;width:90px;">';
  ['2026','2025'].forEach(function(y){h+='<option value="'+y+'"'+(y===wsbkYear?' selected':'')+'>'+y+'</option>';});
  h+='</select>';
  h+='<select onchange="wsbkEvent=this.value;if(!getWsbkSeriesList().includes(wsbkSeries))wsbkSeries=getWsbkSeriesList()[0];renderWsbkPanel(document.getElementById(\'timingPanel\'));" style="font-family:Oswald,sans-serif;font-size:10px;background:#1a1a1a;color:var(--off-white);border:none;padding:4px 6px;cursor:pointer;width:90px;flex:1;">';
  evList.forEach(function(e){h+='<option value="'+e.code+'"'+(e.code===wsbkEvent?' selected':'')+'>'+e.name+'</option>';});
  h+='</select></div>';

  seriesList.forEach(function(s){
    var active=s===wsbkSeries;
    var logo=typeof getLogoUrl==='function'?(getLogoUrl(WSBK_SERIES_LABELS[s])||getLogoUrl(s)||''):'';
    h+='<button onclick="wsbkSeries=\''+s+'\';wsbkSession=getWsbkSessions()[0].code;wsbkSessionLabel=getWsbkSessions()[0].label;renderWsbkPanel(document.getElementById(\'timingPanel\'));" style="flex:1;cursor:pointer;border:none;border-left:1px solid var(--border);background:'+(active?'rgba(29,185,84,0.1)':'transparent')+';padding:4px 2px;display:flex;align-items:center;justify-content:center;outline:'+(active?'2px solid rgba(29,185,84,0.7)':'2px solid transparent')+';outline-offset:-2px;">';
    if(logo) h+='<img src="'+logo+'" style="max-height:24px;max-width:90%;object-fit:contain;opacity:'+(active?'1':'0.5')+';" onerror="this.style.display=\'none\'">';
    else h+='<span style="font-family:Oswald,sans-serif;font-size:8px;color:'+(active?'var(--green)':'var(--text-dim)')+'">'+( WSBK_SERIES_LABELS[s]||s)+'</span>';
    h+='</button>';
  });
  h+='</div>';

  h+='<div style="display:flex;flex-shrink:0;border-bottom:1px solid var(--border);">';
  sessions.forEach(function(sess){
    var active=sess.label===wsbkSessionLabel;
    var isStd=sess.label==='STD';
    var ac=isStd?'var(--green)':'var(--yellow)';
    var ab=isStd?'rgba(29,185,84,0.2)':'rgba(245,196,0,0.2)';
    h+='<button onclick="wsbkSession=\''+sess.code+'\';wsbkSessionLabel=\''+sess.label+'\';renderWsbkPanel(document.getElementById(\'timingPanel\'));" style="flex:1;font-family:Oswald,sans-serif;font-size:9px;padding:8px 2px;cursor:pointer;border:none;border-bottom:'+(active?'3px solid '+ac:'3px solid transparent')+';background:'+(active?ab:'transparent')+';color:'+(active?ac:'var(--text-dim)')+';">'+sess.label+'</button>';
  });
  h+='</div>';

  h+='<div id="wsbkResults" style="flex:1;overflow:auto;padding:8px;"><div style="font-family:Oswald,sans-serif;font-size:9px;color:var(--text-dim);">\u23f3 BET\u00d6LT\u00c9S...</div></div>';
  panelEl.innerHTML=h;

  var evInfo=(WSBK_EVENTS[wsbkYear]||[]).find(function(e){return e.code===wsbkEvent;});
  var rd=document.getElementById('wsbkResults');
  if(evInfo&&evInfo.dateEnd&&new Date(evInfo.dateEnd)>new Date()){
    rd.innerHTML='<div style="text-align:center;padding:16px;">'
      +'<div style="font-family:Oswald,sans-serif;font-size:11px;color:var(--text-mid);letter-spacing:2px;margin-bottom:8px;">'+evInfo.name.toUpperCase()+'</div>'
      +'<div style="font-family:Oswald,sans-serif;font-size:16px;color:var(--yellow);">'+evInfo.date.replace(/-/g,'.')+' \u2013 '+evInfo.dateEnd.replace(/-/g,'.')+'</div>'
      +'<div style="font-size:9px;color:var(--text-dim);margin-top:6px;">MEG NEM ZAJLOTT LE</div></div>';
    return;
  }

  if(wsbkSessionLabel==='STD') loadWsbkStandings(rd);
  else loadWsbkSession(rd);
}

// ============================================================
// PDF FETCH — teljes szöveg kinyerése egyetlen stringbe
// A pdf.js pozíció-alapú szövegkinyerésnél az elemek
// NINCS garantált sorrendben — ezért X+Y koordináta alapján
// rendezzük és szavakra bontjuk, majd a parsernekátadjuk.
// ============================================================
function wsbkFetchPdfText(url, maxPages, onText, onError) {
  if(typeof pdfjsLib==='undefined'){onError('pdf.js N/A');return;}
  pdfjsLib.getDocument(url).promise.then(function(pdf){
    var count=Math.min(pdf.numPages,maxPages||1);
    var nums=[]; for(var i=1;i<=count;i++) nums.push(i);
    return nums.reduce(function(p,num){
      return p.then(function(acc){
        return pdf.getPage(num).then(function(page){
          return page.getTextContent();
        }).then(function(tc){
          // Eredeti sorrend megtartása — a pdf.js bal->jobb, fent->le sorrendben adja
          var words=tc.items.map(function(it){return it.str;}).filter(function(s){return s.trim();});
          acc.push(words.join(' '));
          return acc;
        });
      });
    },Promise.resolve([]));
  }).then(function(pages){onText(pages.join(' '));})
    .catch(function(e){onError(e&&e.message?e.message:'fetch error');});
}

// ============================================================
// SESSION BETÖLTÉSE
// ============================================================
function loadWsbkSession(rd) {
  var cached=wsbkCacheGet('ses');
  if(cached&&cached.length>=3){renderSessionTable(rd,cached);return;}
  rd.innerHTML=wsbkLoadingHtml();
  wsbkFetchPdfText(getWsbkProxyUrl(wsbkSession),1,function(text){
    var rows=parseSessionText(text);
    if(rows&&rows.length>=3){wsbkCacheSet('ses',rows);renderSessionTable(rd,rows);}
    else{rd.innerHTML=wsbkNoDataHtml();}
  },function(){rd.innerHTML=wsbkNoDataHtml();});
}

// ============================================================
// SESSION PARSER — a tényleges szöveg alapján
//
// Rendezett szövegben minden sor:
//   WUP/SUP/FP: "1 11 N. BULEGA ITA ... 1'38.215 5 149,366 279,1"
//   RACE:       "1 1 11 N. BULEGA ITA ... 21 1'38.783 275,5 1'38.094 281,3"
//
// Kulcsminta: SZÁM SZÁM [SZÁM] BETŰ. NAGYBETŰS NAT
// ahol BETŰ. = "N." "I." "S." stb. (kezdőbetű pont)
// ============================================================
function parseSessionText(text) {
  var rows = [];
  var seen = {};

  // Minta: "N. BULEGA ITA" után keresünk laptime-ot (X'XX.XXX)
  // Előtte van: pos [grid] num
  // A laptime az első ilyen formátumú szám a sorban
  var reRider = /(\d{1,2})\s+(?:(\d{1,2})\s+)?(\d{1,3})\s+([A-Z])\.\s+([A-Z][A-Z\-]+)\s+([A-Z]{3})/g;
  var reTime  = /\d'\d{2}\.\d{3}/g;

  // Gyűjtsük össze az összes laptime pozícióját
  var times = [];
  var tm;
  reTime.lastIndex = 0;
  while((tm = reTime.exec(text)) !== null) {
    times.push({idx: tm.index, val: tm[0]});
  }

  var m;
  reRider.lastIndex = 0;
  while((m = reRider.exec(text)) !== null) {
    var pos = parseInt(m[1]);
    var num = parseInt(m[3]);
    var init = m[4];
    var sur  = m[5];
    var nat  = m[6];
    if(pos < 1 || pos > 60) continue;
    var key = num + '_' + pos;
    if(seen[key]) continue;
    seen[key] = 1;

    // Első laptime ami a rider neve után jön
    var afterIdx = m.index + m[0].length;
    var lap = '';
    for(var t = 0; t < times.length; t++) {
      if(times[t].idx >= afterIdx) { lap = times[t].val; break; }
    }
    if(!lap) continue;

    // Gap: a laptime előtti szövegből (a rider match vége és a laptime között)
    var between = text.slice(afterIdx, times[t] ? times[t].idx : afterIdx);
    var gm = between.match(/\d{1,2}'\d{2}\.\d+|\d+\.\d{3}/g);
    var gap = (gm && gm.length > 0) ? gm[gm.length-1] : '';

    var name = init + '. ' + sur.charAt(0) + sur.slice(1).toLowerCase();
    rows.push({pos:pos, num:num, name:name, nat:nat, lap:lap, gap:gap});
  }

  // RET sorok
  var reRet = /RET\s+(?:\d+\s+)?(\d{1,3})\s+([A-Z])\.\s+([A-Z][A-Z\-]+)\s+([A-Z]{3})/g;
  while((m = reRet.exec(text)) !== null) {
    var num = parseInt(m[1]);
    var key = 'RET_' + num;
    if(seen[key]) continue;
    seen[key] = 1;
    rows.push({pos:'RET', num:num, name:m[2]+'. '+m[3].charAt(0)+m[3].slice(1).toLowerCase(), nat:m[4], lap:'', gap:'DNF'});
  }

  rows.sort(function(a,b){
    if(a.pos==='RET') return 1; if(b.pos==='RET') return -1; return a.pos - b.pos;
  });
  return rows;
}
// ============================================================
// SESSION TÁBLÁZAT
// ============================================================
function renderSessionTable(rd,rows){
  var label=WSBK_SERIES_LABELS[wsbkSeries]||wsbkSeries;
  var isRace=wsbkSessionLabel==='R1'||wsbkSessionLabel==='R2'||wsbkSessionLabel==='SPR';
  var out='<div style="font-family:Oswald,sans-serif;font-size:9px;color:var(--text-mid);margin-bottom:5px;letter-spacing:1px;">'
    +'<span style="color:var(--yellow);">'+label+'</span> '+wsbkSessionLabel+' \u00b7 '+wsbkEvent+' '+wsbkYear+'</div>';
  out+='<table style="width:100%;border-collapse:collapse;font-size:10px;">';
  rows.forEach(function(r,i){
    var isRet=r.pos==='RET';
    var pc=isRet?'var(--text-dim)':i===0?'#f5c400':i===1?'#bbb':i===2?'#cd7f32':'var(--off-white)';
    out+='<tr style="background:'+(i%2?'transparent':'rgba(255,255,255,0.025)')+';">'
      +'<td style="padding:2px 3px;color:'+pc+';width:22px;font-family:Oswald,sans-serif;font-weight:'+(i<3&&!isRet?'700':'400')+';">'+r.pos+'</td>'
      +'<td style="padding:2px 2px;color:var(--text-dim);width:22px;font-size:9px;">'+r.num+'</td>'
      +'<td style="padding:2px 3px;color:var(--white);">'+r.name+'</td>'
      +'<td style="padding:2px 2px;color:var(--text-dim);font-size:8px;width:24px;">'+r.nat+'</td>'
      +'<td style="padding:2px 3px;text-align:right;color:'+(i===0&&!isRet?'#f5c400':'var(--green)')+';font-size:9px;white-space:nowrap;">'+r.lap+'</td>'
      +(isRace?'<td style="padding:2px 3px;text-align:right;color:var(--text-dim);font-size:9px;width:44px;white-space:nowrap;">'+(i===0?'':r.gap)+'</td>':'')
      +'</tr>';
  });
  out+='</table>';
  rd.innerHTML=out;
}

// ============================================================
// STANDINGS BETÖLTÉSE
// ============================================================
// ============================================================
// STANDINGS — automatikus frissítés az utolsó lezajlott futam alapján
// ============================================================
function getLatestFinishedEvent() {
  var now = new Date();
  var evList = WSBK_EVENTS[wsbkYear] || [];
  var latest = null;
  evList.forEach(function(ev) {
    if(ev.series && ev.series.indexOf(wsbkSeries) === -1) return;
    if(new Date(ev.dateEnd) < now) latest = ev;
  });
  return latest;
}

function getStdProxyUrlForEvent(ev) {
  return WSBK_PROXY + wsbkYear + '/' + ev.code + '/'
    + (WSBK_SERIES_URL[wsbkSeries] || wsbkSeries)
    + '/001/STD/ChampionshipStandings.pdf';
}

function loadWsbkStandings(rd) {
  // Azonnal embedded adat
  renderEmbeddedStandings(rd);

  // Háttérben: Worker JSON végpont
  var latest = getLatestFinishedEvent();
  if(!latest) return;

  var jsonUrl = 'https://motogp-proxy.porkolab-jozsef.workers.dev/wsbk-std/'
    + wsbkYear + '/' + latest.code + '/' + wsbkSeries;

  fetch(jsonUrl)
    .then(function(r){ return r.json(); })
    .then(function(data){
      if(!data.riders || data.riders.length < 3) return;
      // Validáció
      var riders = data.riders;
      if(riders[0].pts < riders[riders.length-1].pts) return;
      renderStandingsTable(rd, riders, latest.code);
    })
    .catch(function(){
      // Marad az embedded
    });
}

function getLatestFinishedEvent() {
  var now = new Date();
  var evList = WSBK_EVENTS[wsbkYear] || [];
  var latest = null;
  evList.forEach(function(ev) {
    if(ev.series && ev.series.indexOf(wsbkSeries) === -1) return;
    if(new Date(ev.dateEnd) < now) latest = ev;
  });
  return latest;
}



// ============================================================
// STANDINGS PARSER
//
// Rendezett szövegben:
//   "... 1 BULEGA 211 2 LECUONA 137 74 3 LOWES 89 122 48 ..."
// és párhuzamosan a keresztnevekhez:
//   "... Nicolo (ITA) ... Iker (ESP) ..."
//
// Legmegbízhatóbb: a sorrendből kinyerjük a
// "SZÁM NAGYBETŰS_SZÓVAL SZÁM" mintát
// ahol a SZÁM = pozíció (1..60) és a rákövetkező SZÁM = pontszám
// ============================================================
function parseStandingsText(text) {
  var riders=[];
  var seen={};

  // Minta a standings PDF rendezett szövegéből:
  // pozíció NAGY_VEZÉKNÉV pontszám [lemaradás...]
  // pl: "1 BULEGA 211" "2 LECUONA 137 74"
  // A rendezés után ezek sorban jönnek, de közéjük kerül más szöveg is.
  // Ezért: keressük a "(\d{1,2}) ([A-Z]{2,}) (\d{1,3})" mintát
  // ahol az első szám 1-60 közt van, a harmadik szám > 0
  var re=/\b(\d{1,2})\s+([A-Z][A-Z\-]{1,20})\s+(\d{1,3})\b/g;
  var m;
  while((m=re.exec(text))!==null){
    var pos=parseInt(m[1]);
    var last=m[2];
    var pts=parseInt(m[3]);
    if(pos<1||pos>60||pts<1||pts>900) continue;
    // Kizárjuk a zajos találatokat: ha a "szó" ismert zaj-szó
    var noiseWords=['ITA','ESP','GBR','USA','AUS','POR','FRA','GER','NED','BEL','JPN','THA','INA','MAL',
                    'SUP','WUP','IND','SBK','SSP','WCR','SPB','CLA','STD'];
    if(noiseWords.indexOf(last)>=0) continue;
    if(seen[pos]) continue;
    seen[pos]=1;

    // Keresztnév keresése a közelben (következő "Szó (NAT)" minta)
    var after=text.slice(m.index+m[0].length,m.index+m[0].length+80);
    var nm=after.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+\([A-Z]{2,3}\)/);
    var first=nm?nm[1]:'';
    var name=first?first+' '+last.charAt(0)+last.slice(1).toLowerCase()
                  :last.charAt(0)+last.slice(1).toLowerCase();
    riders.push({pos:pos,name:name,pts:pts});
  }

  // Szanity: legyen folyamatos pozíciósorrend (1,2,3...)
  riders.sort(function(a,b){return a.pos-b.pos;});
  // Csak az első összefüggő sorozatot tartjuk meg (1-től N-ig hiányok nélkül)
  var clean=[];
  for(var i=0;i<riders.length;i++){
    if(riders[i].pos===i+1) clean.push(riders[i]);
    else break;
  }
  return clean.length>=3?clean:riders.slice(0,30);
}

// ============================================================
// STANDINGS TÁBLÁZAT
// ============================================================
function renderStandingsTable(rd, riders, eventCode){
  var label=WSBK_SERIES_LABELS[wsbkSeries]||wsbkSeries;
  var leader=riders[0].pts;
  var evCode = eventCode || wsbkEvent;
  var out='<div style="font-family:Oswald,sans-serif;font-size:9px;color:var(--text-mid);margin-bottom:5px;letter-spacing:1px;">'
    +'<span style="color:var(--yellow);">'+label+'</span>'
    +' STANDINGS \u00b7 '+wsbkYear+' \u00b7 '+evCode
    +' <span style="font-size:7px;color:var(--green);">\u25cf AUTO</span></div>';
  out+='<table style="width:100%;border-collapse:collapse;font-size:10px;">';
  riders.forEach(function(r,i){
    var pc=i===0?'#f5c400':i===1?'#bbb':i===2?'#cd7f32':'var(--off-white)';
    var gap=i===0?'':('\u2212'+(leader-r.pts));
    out+='<tr style="background:'+(i%2?'transparent':'rgba(255,255,255,0.025)')+';">'
      +'<td style="padding:2px 4px;color:'+pc+';width:22px;font-weight:'+(i<3?'700':'400')+';font-family:Oswald,sans-serif;">'+r.pos+'</td>'
      +'<td style="padding:2px 3px;color:var(--white);">'+r.name+'</td>'
      +'<td style="padding:2px 4px;text-align:right;color:'+(i===0?'#f5c400':'var(--green)')+';font-weight:700;">'+r.pts+'</td>'
      +'<td style="padding:2px 4px;text-align:right;color:var(--text-dim);font-size:9px;width:32px;">'+gap+'</td>'
      +'</tr>';
  });
  out+='</table>';
  rd.innerHTML=out;
}

// ============================================================
// EMBEDDED FALLBACK
// ============================================================
function renderEmbeddedStandings(rd){
  var data=WSBK_STANDINGS_EMBEDDED[wsbkSeries]||[];
  var label=WSBK_SERIES_LABELS[wsbkSeries]||wsbkSeries;
  if(!data.length){rd.innerHTML=wsbkNoDataHtml();return;}
  var leader=data[0].pts;
  var out='<div style="font-family:Oswald,sans-serif;font-size:9px;color:var(--text-mid);margin-bottom:5px;letter-spacing:1px;">'
    +'<span style="color:var(--yellow);">'+label+'</span>'
    +' STANDINGS \u00b7 '+wsbkYear
    +' <span style="font-size:7px;color:var(--text-dim);">(HUN ut\u00e1n)</span></div>';
  out+='<table style="width:100%;border-collapse:collapse;font-size:10px;">';
  data.forEach(function(r,i){
    var pc=i===0?'#f5c400':i===1?'#bbb':i===2?'#cd7f32':'var(--off-white)';
    var gap=i===0?'':('\u2212'+(leader-r.pts));
    out+='<tr style="background:'+(i%2?'transparent':'rgba(255,255,255,0.025)')+';">'
      +'<td style="padding:2px 4px;color:'+pc+';width:22px;font-weight:'+(i<3?'700':'400')+';font-family:Oswald,sans-serif;">'+(i+1)+'</td>'
      +'<td style="padding:2px 3px;color:var(--white);">'+r.n+'</td>'
      +'<td style="padding:2px 4px;text-align:right;color:'+(i===0?'#f5c400':'var(--green)')+';font-weight:700;">'+r.pts+'</td>'
      +'<td style="padding:2px 4px;text-align:right;color:var(--text-dim);font-size:9px;width:32px;">'+gap+'</td>'
      +'</tr>';
  });
  out+='</table>';
  rd.innerHTML=out;
}

function wsbkLoadingHtml(){return '<div style="font-family:Oswald,sans-serif;font-size:9px;color:var(--text-dim);letter-spacing:2px;padding:8px;">\u23f3 BET\u00d6LT\u00c9S...</div>';}
function wsbkNoDataHtml() {return '<div style="font-family:Oswald,sans-serif;font-size:9px;color:var(--text-dim);padding:8px;">Nincs adat</div>';}

// ============================================================
// EMBEDDED STANDINGS — HUN 2026 UTÁN
// ============================================================
var WSBK_STANDINGS_EMBEDDED = {
  // Forrás: worldsbk.com ChampionshipStandings.pdf — HUN 2026 után (2026-05-03)
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
    {n:'David Salvador',      pts:69},
    {n:'Jeffrey Buis',        pts:64},
    {n:'Ferre Fleerackers',   pts:59},
    {n:'Xavi Artigas',        pts:54},
    {n:'Antonio Torres',      pts:53},
    {n:'Matteo Vannucci',     pts:41},
    {n:'Loris Veneman',       pts:40},
    {n:'Bruno Ieraci',        pts:35},
    {n:'Elia Bartolini',      pts:22},
    {n:'Kas Beekmans',        pts:19},
    {n:'Diego Poncet',        pts:18},
    {n:'Carter Thompson',     pts:16},
    {n:'Marco Gaggi',         pts:16},
    {n:'Alvaro Fuertes',      pts:13},
    {n:'Benat Fernandez',     pts:12},
    {n:'Harrison Dessoy',     pts:7},
    {n:'Mirko Gennai',        pts:6},
    {n:'Alessandro Di Persio',pts:5},
    {n:'Jose Osuna',          pts:4},
    {n:'Thomas Benetti',      pts:3},
    {n:'Mattia Sorrenti',     pts:2},
    {n:'Gonzalo Sanchez',     pts:1},
    {n:'Juan Risueno',        pts:1}
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

document.addEventListener('DOMContentLoaded',function(){
  if(typeof pdfjsLib!=='undefined'){
    pdfjsLib.GlobalWorkerOptions.workerSrc=
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
});
