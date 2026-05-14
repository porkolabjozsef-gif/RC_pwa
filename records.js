// ============================================================
// TRACK RECORDS — csak ellenőrzött adatok!
// Utolsó frissítés: 2026-05-14
// ============================================================
// Ellenőrzött SBK: mind (12 pálya)
// Ellenőrzött SSP: mind (12 pálya)
// WCR naptár (2024-2026): POR, NED, HUN, ITA, GBR, FRA, CRE, ARA, EST, JER
//   WCR soha nem fut: AUS, CZE
// SPB naptár (2026-tól): POR, NED, CZE, ARA, ITA, FRA, CRE, JER
//   SPB soha nem fut: AUS, HUN, GBR, EST
// R3 naptár (2024-2026): POR, ITA, GBR, HUN, ARA, EST, FRA, CRE
//   R3 soha nem fut: AUS, NED, CZE, JER
// Ellenőrzött R3: ITA (1'53.515 Yamane SP 2024), GBR (1'44.682 Yamane SP 2024)
//   POR (2'00.061 Sovicka RC2 2025), HUN (1'58.122 Di Persio SP 2025)
//   ARA (2'12.240 Vich RC1 2024), EST (1'54.861 Di Persio SP 2025)
//   Üres (nem volt verseny): AUS, CZE, CRE, JER
//   Üres (nincs PDF): NED (2024 nedves), FRA (2024)
// MotoGP: TODO
// ============================================================
// Megjegyzések az SSP rekordokhoz:
//   AUS: Manzi 1'31.249 WUP1 2024 (jobb mint SP Huertas 1'31.407)
//   POR: Oncu 1'42.643 WUP2 2025 (jobb mint SP Oncu 1'42.670 2026)
//   GBR: Montella 1'28.907 FP1 2024 (jobb mint SP Manzi 1'29.450 2025)
//   ARA: Casadei 1'52.257 SP 2025 (jobb mint korábbi Bulega 2023 rekord)
//   JER: Casadei 1'41.959 SP 2025
//   CRE: Huertas 1'31.478 SP 2024 (jobb mint Caricasulo 1'31.728 2025)
// Megjegyzések a WCR rekordokhoz:
//   GBR: Neila 1'38.964 Race1 2025 (jobb mint SP Neila 1'39.687)
//   HUN: Herrera 1'52.264 SP 2026 (törte Jones korábbi rekordját)
//   NED: Herrera 1'47.031 SP 2026 (törte saját 1'47.613 2025 rekordját)
//   FRA: Jones 1'51.414 Race2 2025 (new lap record Race 2-ben)
// ============================================================
var TRACK_RECORDS = {
  'AUS': { name:'Phillip Island', len:'4.448 km', wsbk:{
    SBK: {time:"1'27.916", rider:'N. Bulega',         year:2024},
    SSP: {time:"1'31.249", rider:'S. Manzi',           year:2024},
  }, motogp:{
    MotoGP:{time:"1'27.246", rider:'J. Martin',  year:2023},
    Moto2: {time:'\u2014', rider:'\u2014', year:null},
    Moto3: {time:'\u2014', rider:'\u2014', year:null}
  }},
  'POR': { name:'Portim\u00e3o', len:'4.592 km', wsbk:{
    SBK: {time:"1'38.495", rider:'N. Bulega',         year:2026},
    SSP: {time:"1'42.643", rider:'C. Oncu',            year:2025},
    WCR: {time:"1'52.572", rider:'M. Herrera',         year:2025},
    SPB: {time:'\u2014',   rider:'\u2014',             year:null},
    R3:  {time:"2'00.061", rider:'T. Sovicka',         year:2025}
  }, motogp:{
    MotoGP:{time:"1'37.226", rider:'M. Marquez', year:2023},
    Moto2: {time:'\u2014', rider:'\u2014', year:null},
    Moto3: {time:'\u2014', rider:'\u2014', year:null}
  }},
  'NED': { name:'TT Circuit Assen', len:'4.542 km', wsbk:{
    SBK: {time:"1'32.144", rider:'N. Bulega',         year:2026},
    SSP: {time:"1'36.184", rider:'C. Oncu',            year:2025},
    WCR: {time:"1'47.031", rider:'M. Herrera',         year:2026},
    SPB: {time:'\u2014',   rider:'\u2014',             year:null}
  }, motogp:{
    MotoGP:{time:"1'30.540", rider:'F. Bagnaia',  year:2024},
    Moto2: {time:'\u2014', rider:'\u2014', year:null},
    Moto3: {time:'\u2014', rider:'\u2014', year:null}
  }},
  'HUN': { name:'Balaton Park Circuit', len:'4.075 km', wsbk:{
    SBK: {time:"1'38.094", rider:'N. Bulega',         year:2026},
    SSP: {time:"1'42.050", rider:'A. Arenas',          year:2026},
    WCR: {time:"1'51.935", rider:'P. Ramos',           year:2026},
    R3:  {time:"1'58.122", rider:'A. Di Persio',       year:2025}
  }, motogp:{
    MotoGP:{time:"1'36.518", rider:'M. Marquez', year:2025},
    Moto2: {time:"1'40.964", rider:'D. Alonso',  year:2025},
    Moto3: {time:"1'45.700", rider:'D. Munoz',   year:2025}
  }},
  'CZE': { name:'Autodrom Most', len:'4.212 km', wsbk:{
    SBK: {time:"1'30.064", rider:'T. Razgatlioglu',   year:2024},
    SSP: {time:"1'34.126", rider:'Y. Montella',         year:2024},
    SPB: {time:'\u2014',   rider:'\u2014',             year:null}
  }, motogp:{
    MotoGP:{time:"1'52.303", rider:'F. Bagnaia',  year:2025},
    Moto2: {time:'\u2014', rider:'\u2014', year:null},
    Moto3: {time:"2'05.019",rider:'G. Pini',     year:2025}
  }},
  'ARA': { name:'Motorland Arag\u00f3n', len:'5.077 km', wsbk:{
    SBK: {time:"1'47.332", rider:'N. Bulega',         year:2025},
    SSP: {time:"1'52.097", rider:'C. Oncu',             year:2025},
    WCR: {time:'\u2014',   rider:'\u2014',             year:null},
    SPB: {time:'\u2014',   rider:'\u2014',             year:null},
    R3:  {time:"2'12.240", rider:'M. Vich',            year:2024}
  }, motogp:{
    MotoGP:{time:"1'45.704", rider:'M. Marquez', year:2025},
    Moto2: {time:'\u2014', rider:'\u2014', year:null},
    Moto3: {time:'\u2014', rider:'\u2014', year:null}
  }},
  'ITA': { name:'Misano World Circuit', len:'4.226 km', wsbk:{
    SBK: {time:"1'31.618", rider:'N. Bulega',           year:2025},
    SSP: {time:"1'36.495", rider:'N. Bulega',           year:2023},
    WCR: {time:'\u2014',   rider:'\u2014',             year:null},
    SPB: {time:'\u2014',   rider:'\u2014',             year:null},
    R3:  {time:"1'53.515", rider:'S. Yamane',          year:2024}
  }, motogp:{
    MotoGP:{time:'\u2014', rider:'\u2014', year:null},
    Moto2: {time:'\u2014', rider:'\u2014', year:null},
    Moto3: {time:'\u2014', rider:'\u2014', year:null}
  }},
  'GBR': { name:'Donington Park', len:'4.023 km', wsbk:{
    SBK: {time:"1'24.629", rider:'T. Razgatlioglu',   year:2024},
    SSP: {time:"1'28.322", rider:'A. Huertas',          year:2024},
    WCR: {time:"1'38.964", rider:'B. Neila',           year:2025},
    R3:  {time:"1'44.682", rider:'S. Yamane',          year:2024}
  }, motogp:{
    MotoGP:{time:'\u2014', rider:'\u2014', year:null},
    Moto2: {time:'\u2014', rider:'\u2014', year:null},
    Moto3: {time:'\u2014', rider:'\u2014', year:null}
  }},
  'FRA': { name:'Magny-Cours', len:'4.411 km', wsbk:{
    SBK: {time:"1'34.930", rider:'T. Razgatlioglu',   year:2025},
    SSP: {time:"1'39.442", rider:'C. Oncu',            year:2025},
    WCR: {time:"1'51.414", rider:'C. Jones',           year:2025},
    SPB: {time:'\u2014',   rider:'\u2014',             year:null},
    R3:  {time:'\u2014',   rider:'\u2014',             year:null}
  }, motogp:{
    MotoGP:{time:"1'29.288", rider:'M. Marquez', year:2026},
    Moto2: {time:"1'33.910", rider:'I. Guevara',  year:2026},
    Moto3: {time:"1'39.885", rider:'J. Kelso',    year:2025}
  }},
  'CRE': { name:'Cremona Circuit', len:'3.768 km', wsbk:{
    SBK: {time:"1'27.866", rider:'N. Bulega',           year:2025},
    SSP: {time:"1'31.478", rider:'A. Huertas',         year:2024},
    WCR: {time:"1'40.468", rider:'M. Herrera',         year:2025},
    SPB: {time:'\u2014',   rider:'\u2014',             year:null},
    R3:  {time:'\u2014',   rider:'\u2014',             year:null}
  }, motogp:null},
  'EST': { name:'Estoril', len:'4.182 km', wsbk:{
    SBK: {time:"1'34.203", rider:'T. Razgatlioglu',   year:2025},
    SSP: {time:"1'39.046", rider:'D. Aegerter',        year:2022},
    WCR: {time:'\u2014',   rider:'\u2014',             year:null},
    R3:  {time:"1'54.861", rider:'A. Di Persio',       year:2025}
  }, motogp:null},
  'JER': { name:'Circuito de Jerez', len:'4.423 km', wsbk:{
    SBK: {time:"1'36.629", rider:'N. Bulega',         year:2025},
    SSP: {time:"1'41.775", rider:'R. Krummenacher',    year:2019},
    WCR: {time:"1'51.303", rider:'P. Ramos',           year:2025},
    SPB: {time:'\u2014',   rider:'\u2014',             year:null}
  }, motogp:null},
  'THA':{name:'Chang International Circuit',     len:'4.554 km', wsbk:null, motogp:{MotoGP:{time:"1'28.526",rider:'M. Bezzecchi',year:2026},Moto2:{time:"1'34.501",rider:'M. Gonzalez',year:2026},Moto3:{time:"1'40.088",rider:'D. Almansa',year:2026}}},
  'BRA':{name:'Aut. Internacional Ayrton Senna', len:'3.834 km', wsbk:null, motogp:{MotoGP:{time:"1'17.408",rider:'M. Bezzecchi',year:2026},Moto2:{time:"1'20.711",rider:'D. Holgado',year:2026},Moto3:{time:"1'26.241",rider:'J. Esteban',year:2026}}},
  'USA':{name:'Circuit of The Americas',         len:'5.513 km', wsbk:null, motogp:{MotoGP:{time:"2'00.136",rider:'F. Di Giannantonio',year:2026},Moto2:{time:"2'05.347",rider:'B. Baltus',year:2026},Moto3:{time:"2'12.107",rider:'A. Carpe',year:2026}}},
  'QAT':{name:'Losail International Circuit',    len:'5.380 km', wsbk:null, motogp:{MotoGP:{time:"1'50.499",rider:'M. Marquez', year:2025},Moto2:{time:'\u2014',rider:'\u2014',year:null},Moto3:{time:'\u2014',rider:'\u2014',year:null}}},
  'SPA':{name:'Circuito de Jerez',               len:'4.423 km', wsbk:null, motogp:{MotoGP:{time:"1'35.610",rider:'F. Quartararo',year:2025},Moto2:{time:"1'38.973",rider:'S. Agius',year:2026},Moto3:{time:"1'43.710",rider:'D. Alonso',year:2024}}},
  'CAT':{name:'Circuit de Barcelona-Catalunya',  len:'4.657 km', wsbk:null, motogp:{MotoGP:{time:"1'37.536",rider:'A. Marquez', year:2025},Moto2:{time:"1'41.549",rider:'D. Holgado', year:2025},Moto3:{time:"1'45.905",rider:'D. Alonso',  year:2024}}},
  'GER':{name:'Sachsenring',                     len:'3.671 km', wsbk:null, motogp:{MotoGP:{time:"1'19.071",rider:'F. Di Giannantonio',year:2025},Moto2:{time:"1'22.698",rider:'S. Chantra',  year:2024},Moto3:{time:"1'24.767",rider:'D. Munoz',   year:2025}}},
  'RSM':{name:'Misano World Circuit',            len:'4.226 km', wsbk:null, motogp:{MotoGP:{time:"1'30.031",rider:'F. Bagnaia',  year:2024},Moto2:{time:"1'34.650",rider:'C. Vietti',   year:2025},Moto3:{time:'\u2014',rider:'\u2014',year:null}}},
  'AUT':{name:'Red Bull Ring',                   len:'4.318 km', wsbk:null, motogp:{MotoGP:{time:"1'27.748",rider:'J. Martin',   year:2024},Moto2:{time:'\u2014',rider:'\u2014',year:null},Moto3:{time:"1'39.918",rider:'A. Piqueras', year:2025}}},
  'JPN':{name:'Mobility Resort Motegi',          len:'4.801 km', wsbk:null, motogp:{MotoGP:{time:"1'43.018",rider:'P. Acosta',   year:2024},Moto2:{time:'\u2014',rider:'\u2014',year:null},Moto3:{time:'\u2014',rider:'\u2014',year:null}}},
  'INA':{name:'Pertamina Mandalika Circuit',     len:'4.031 km', wsbk:null, motogp:{MotoGP:{time:"1'29.088",rider:'J. Martin',   year:2024},Moto2:{time:'\u2014',rider:'\u2014',year:null},Moto3:{time:'\u2014',rider:'\u2014',year:null}}},
  'MAL':{name:'Sepang International Circuit',    len:'5.543 km', wsbk:null, motogp:{MotoGP:{time:"1'56.337",rider:'F. Bagnaia',  year:2024},Moto2:{time:'\u2014',rider:'\u2014',year:null},Moto3:{time:'\u2014',rider:'\u2014',year:null}}},
  'VAL':{name:'Circuit Ricardo Tormo',           len:'4.005 km', wsbk:null, motogp:{MotoGP:{time:"1'28.809",rider:'M. Bezzecchi',year:2025},Moto2:{time:'\u2014',rider:'\u2014',year:null},Moto3:{time:'\u2014',rider:'\u2014',year:null}}},
  'ARG':{name:'Termas de Rio Hondo',             len:'4.806 km', wsbk:null, motogp:{MotoGP:{time:"1'36.917",rider:'M. Marquez', year:2025},Moto2:{time:'\u2014',rider:'\u2014',year:null},Moto3:{time:'\u2014',rider:'\u2014',year:null}}}
};

function renderRecordPanel() {
  var el     = document.getElementById('recordContent');
  var header = document.getElementById('recordHeader');
  if(!el) return;

  var isWsbk    = (typeof activeChampionship !== 'undefined' && activeChampionship === 'wsbk');
  var trackCode = isWsbk
    ? (typeof wsbkEvent !== 'undefined' ? wsbkEvent : null)
    : (typeof selectedEventCode !== 'undefined' ? selectedEventCode : null);
  var trackData = trackCode ? TRACK_RECORDS[trackCode] : null;
  var activeSer = isWsbk
    ? (typeof wsbkSeries !== 'undefined' ? wsbkSeries : 'SBK')
    : (typeof selectedCat !== 'undefined' ? selectedCat : 'MotoGP');

  if(!trackData) {
    if(header) header.textContent = '\u2b1b TRACK RECORD';
    el.innerHTML = '<div style="font-size:9px;color:var(--text-dim);">Nincs adat</div>';
    return;
  }

  var recs = isWsbk ? trackData.wsbk : trackData.motogp;
  var rec  = recs ? recs[activeSer] : null;

  if(header) header.innerHTML = '\u2b1b <span style="color:var(--off-white);font-size:9px;">'
    + trackData.name + '</span>'
    + '&nbsp;<span style="color:var(--text-dim);font-size:7px;">' + trackData.len + '</span>';

  if(!rec || rec.time === '\u2014') {
    el.innerHTML = '<div style="font-size:9px;color:var(--text-dim);">LAP RECORD \u2014 ' + activeSer + '<br>'
      + '<span style="font-size:11px;">\u2014</span></div>';
    return;
  }

  el.innerHTML =
    '<div style="font-family:Oswald,sans-serif;font-size:8px;color:var(--text-dim);letter-spacing:2px;margin-bottom:2px;">LAP RECORD \u2014 ' + activeSer + '</div>'
    + '<div style="font-size:12px;font-family:Oswald,sans-serif;color:#f5c400;letter-spacing:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'
      + rec.time
      + ' &nbsp; ' + rec.rider
      + (rec.year ? ' &nbsp; ' + String(rec.year) : '')
    + '</div>';
}
