// ============================================================
// TRACK RECORDS — Race Control Dashboard
// Utolsó frissítés: 2026-05-18
// ============================================================
// WSBK_RECORDS   — WSBK pályák rekordjai (wsbkEvent kód alapján)
// MOTOGP_RECORDS — MotoGP pályák rekordjai (selectedEventCode alapján)
//
// Ahol az ország két sorozatban különböző pályán fut,
// mindkét objektum a saját pályájának adatait tárolja — nincs átfedés.
// Pl: CZE → WSBK: Autodrom Most / MotoGP: Automotodrom Brno
//     ITA → WSBK: Misano        / MotoGP: Mugello
//     GBR → WSBK: Donington     / MotoGP: Silverstone
//     FRA → WSBK: Magny-Cours   / MotoGP: Le Mans
// ============================================================
// WSBK 2025-ös eseménykód aliasok:
//   MOS = Autodrom Most (Czech Round 2025)
//   ESP = Circuito de Jerez (Spanish Round 2025)
//   RSM = Misano (Emilia Romagna Round 2025)
// ============================================================
// Ellenőrzött WSBK rekordok:
//   SBK: mind 12 pálya ✅
//   SSP: mind 12 pálya ✅
//   WCR: ITA,GBR,CRE,FRA,EST,JER,NED,HUN,POR ✅ (AUS,CZE,ARA soha nem fut)
//   SPB: POR,NED ✅ (2026 első szezon; CZE máj.15-17 zajlik)
//   R3:  ITA,GBR,HUN,ARA,POR,EST ✅ | FRA,NED ⏳ | CRE ⏳ (2026 szept.)
// Ellenőrzött MotoGP rekordok:
//   MotoGP: mind 22 pálya ✅
//   Moto2:  mind 22 pálya ✅ (ITA/Mugello, NED/Assen, GBR/Silverstone, CZE/Brno, ARA, POR ⏳ = üres)
//   Moto3:  mind 22 pálya ✅ (ITA, NED, GBR, ARA, POR ⏳ = üres)
// ============================================================

// ------------------------------------------------------------
// WSBK_RECORDS
// ------------------------------------------------------------
var WSBK_RECORDS = {
  'AUS': { name:'Phillip Island',        len:'4.448 km',
    SBK: {time:"1'27.916", rider:'N. Bulega',        year:2024},
    SSP: {time:"1'31.249", rider:'S. Manzi',          year:2024}
  },
  'POR': { name:'Portim\u00e3o',         len:'4.592 km',
    SBK: {time:"1'38.495", rider:'N. Bulega',        year:2026},
    SSP: {time:"1'42.643", rider:'C. Oncu',           year:2025},
    WCR: {time:"1'52.572", rider:'M. Herrera',        year:2025},
    SPB: {time:"1'48.553", rider:'M. Vannucci',       year:2026},
    R3:  {time:"2'00.061", rider:'T. Sovicka',        year:2025}
  },
  'NED': { name:'TT Circuit Assen',      len:'4.542 km',
    SBK: {time:"1'32.144", rider:'N. Bulega',        year:2026},
    SSP: {time:"1'36.184", rider:'C. Oncu',           year:2025},
    WCR: {time:"1'47.031", rider:'M. Herrera',        year:2026},
    SPB: {time:"1'42.499", rider:'L. Veneman',        year:2026},
    R3:  {time:"1'52.567", rider:'J. Giral',          year:2021}
  },
  'HUN': { name:'Balaton Park Circuit',  len:'4.075 km',
    SBK: {time:"1'38.094", rider:'N. Bulega',        year:2026},
    SSP: {time:"1'42.050", rider:'A. Arenas',         year:2026},
    WCR: {time:"1'51.935", rider:'P. Ramos',          year:2026},
    R3:  {time:"1'58.122", rider:'A. Di Persio',      year:2025}
  },
  'CZE': { name:'Autodrom Most',         len:'4.212 km',
    SBK: {time:"1'29.616", rider:'?', year:2026},
    SSP: {time:"1'33.802", rider:'?', year:2026},
    SPB: {time:"1'39.473", rider:'D. Clerk', year:2026}
  },
  'ARA': { name:'Motorland Arag\u00f3n', len:'5.077 km',
    SBK: {time:"1'47.332", rider:'N. Bulega',        year:2025},
    SSP: {time:"1'52.097", rider:'C. Oncu',           year:2025},
    SPB: {time:'\u2014',   rider:'\u2014',            year:null},
    R3:  {time:"2'12.240", rider:'M. Vich',           year:2024}
  },
  'ITA': { name:'Misano World Circuit',  len:'4.226 km',
    SBK: {time:"1'31.618", rider:'N. Bulega',        year:2025},
    SSP: {time:"1'36.495", rider:'N. Bulega',         year:2023},
    WCR: {time:"1'47.961", rider:'B. Neila',          year:2024},
    SPB: {time:'\u2014',   rider:'\u2014',            year:null},
    R3:  {time:"1'53.515", rider:'S. Yamane',         year:2024}
  },
  'GBR': { name:'Donington Park',        len:'4.023 km',
    SBK: {time:"1'24.629", rider:'T. Razgatlioglu',  year:2024},
    SSP: {time:"1'28.322", rider:'A. Huertas',        year:2024},
    WCR: {time:"1'38.964", rider:'B. Neila',          year:2025},
    R3:  {time:"1'44.682", rider:'S. Yamane',         year:2024}
  },
  'FRA': { name:'Magny-Cours',           len:'4.411 km',
    SBK: {time:"1'34.930", rider:'T. Razgatlioglu',  year:2025},
    SSP: {time:"1'39.442", rider:'C. Oncu',           year:2025},
    WCR: {time:"1'51.414", rider:'C. Jones',          year:2025},
    SPB: {time:'\u2014',   rider:'\u2014',            year:null},
    R3:  {time:"1'57.147", rider:'A. Mahendra',       year:2023}
  },
  'CRE': { name:'Cremona Circuit',       len:'3.768 km',
    SBK: {time:"1'27.866", rider:'N. Bulega',        year:2025},
    SSP: {time:"1'31.478", rider:'A. Huertas',        year:2024},
    WCR: {time:"1'40.468", rider:'M. Herrera',        year:2025},
    SPB: {time:'\u2014',   rider:'\u2014',            year:null},
    R3:  {time:'\u2014',   rider:'\u2014',            year:null}
  },
  'EST': { name:'Estoril',               len:'4.182 km',
    SBK: {time:"1'34.203", rider:'T. Razgatlioglu',  year:2025},
    SSP: {time:"1'39.046", rider:'D. Aegerter',       year:2022},
    WCR: {time:"1'49.872", rider:'A. Carrasco',       year:2024},
    SPB: {time:'\u2014',   rider:'\u2014',            year:null},
    R3:  {time:"1'54.861", rider:'A. Di Persio',      year:2025}
  },
  'JER': { name:'Circuito de Jerez',     len:'4.423 km',
    SBK: {time:"1'36.629", rider:'N. Bulega',        year:2025},
    SSP: {time:"1'41.775", rider:'R. Krummenacher',   year:2019},
    WCR: {time:"1'51.303", rider:'P. Ramos',          year:2025},
    SPB: {time:'\u2014',   rider:'\u2014',            year:null}
  },
  // 2025-ös WSBK eseménykód aliasok
  'MOS': { name:'Autodrom Most',         len:'4.212 km',
    SBK: {time:"1'30.064", rider:'T. Razgatlioglu',  year:2024},
    SSP: {time:"1'34.126", rider:'Y. Montella',       year:2024},
    R3:  {time:'\u2014',   rider:'\u2014',            year:null}
  },
  'ESP': { name:'Circuito de Jerez',     len:'4.423 km',
    SBK: {time:"1'36.629", rider:'N. Bulega',        year:2025},
    SSP: {time:"1'41.775", rider:'R. Krummenacher',   year:2019},
    WCR: {time:"1'51.303", rider:'P. Ramos',          year:2025},
    R3:  {time:'\u2014',   rider:'\u2014',            year:null}
  },
  'RSM': { name:'Misano World Circuit',  len:'4.226 km',
    SBK: {time:"1'31.618", rider:'N. Bulega',        year:2025},
    SSP: {time:"1'36.495", rider:'N. Bulega',         year:2023},
    WCR: {time:"1'47.961", rider:'B. Neila',          year:2024},
    R3:  {time:"1'53.515", rider:'S. Yamane',         year:2024}
  }
};

// ------------------------------------------------------------
// MOTOGP_RECORDS
// ------------------------------------------------------------
var MOTOGP_RECORDS = {
  'THA': { name:'Chang International Circuit',         len:'4.554 km',
    MotoGP: {time:"1'28.526", rider:'M. Bezzecchi',       year:2026},
    Moto2:  {time:"1'34.501", rider:'M. Gonzalez',        year:2026},
    Moto3:  {time:"1'40.088", rider:'D. Almansa',         year:2026}
  },
  'BRA': { name:'Aut. Internacional Ayrton Senna',     len:'3.834 km',
    MotoGP: {time:"1'17.408", rider:'M. Bezzecchi',       year:2026},
    Moto2:  {time:"1'20.711", rider:'D. Holgado',         year:2026},
    Moto3:  {time:"1'26.241", rider:'J. Esteban',         year:2026}
  },
  'USA': { name:'Circuit of The Americas',             len:'5.513 km',
    MotoGP: {time:"2'00.136", rider:'F. Di Giannantonio', year:2026},
    Moto2:  {time:"2'05.347", rider:'B. Baltus',          year:2026},
    Moto3:  {time:"2'12.107", rider:'A. Carpe',           year:2026}
  },
  'QAT': { name:'Losail International Circuit',        len:'5.380 km',
    MotoGP: {time:"1'50.499", rider:'M. Marquez',         year:2025},
    Moto2:  {time:"1'56.301", rider:'M. Gonzalez',        year:2025},
    Moto3:  {time:"2'02.276", rider:'D. Holgado',         year:2024}
  },
  'SPA': { name:'Circuito de Jerez',                   len:'4.423 km',
    MotoGP: {time:"1'35.610", rider:'F. Quartararo',      year:2025},
    Moto2:  {time:"1'38.973", rider:'S. Agius',           year:2026},
    Moto3:  {time:"1'43.710", rider:'D. Alonso',          year:2024}
  },
  'FRA': { name:'Le Mans \u2014 Circuit de la Sarthe', len:'4.185 km',
    MotoGP: {time:"1'29.288", rider:'M. Marquez',         year:2026},
    Moto2:  {time:"1'33.910", rider:'I. Guevara',         year:2026},
    Moto3:  {time:"1'39.885", rider:'J. Kelso',           year:2025}
  },
  'CAT': { name:'Circuit de Barcelona-Catalunya',      len:'4.657 km',
    MotoGP: {time:"1'37.536", rider:'A. Marquez',         year:2025},
    Moto2:  {time:"1'41.549", rider:'D. Holgado',         year:2025},
    Moto3:  {time:"1'45.905", rider:'D. Alonso',          year:2024}
  },
  'ITA': { name:'Autodromo del Mugello',               len:'5.245 km',
    MotoGP: {time:"1'44.169", rider:'M. Marquez',         year:2025},
    Moto2:  {time:"1'49.877", rider:'J. Roberts',         year:2024},
    Moto3:  {time:"1'54.194", rider:'D. Alonso',          year:2024}
  },
  'HUN': { name:'Balaton Park Circuit',                len:'4.075 km',
    MotoGP: {time:"1'36.518", rider:'M. Marquez',         year:2025},
    Moto2:  {time:"1'40.964", rider:'D. Alonso',          year:2025},
    Moto3:  {time:"1'45.700", rider:'D. Munoz',           year:2025}
  },
  'CZE': { name:'Automotodrom Brno',                   len:'5.403 km',
    MotoGP: {time:"1'52.303", rider:'F. Bagnaia',         year:2025},
    Moto2:  {time:"1'58.322", rider:'B. Baltus',          year:2025},
    Moto3:  {time:"2'05.019", rider:'G. Pini',            year:2025}
  },
  'NED': { name:'TT Circuit Assen',                    len:'4.542 km',
    MotoGP: {time:"1'30.540", rider:'F. Bagnaia',         year:2024},
    Moto2:  {time:"1'34.777", rider:'D. Moreira',         year:2025},
    Moto3:  {time:"1'39.746", rider:'A. Piqueras',        year:2024}
  },
  'GER': { name:'Sachsenring',                         len:'3.671 km',
    MotoGP: {time:"1'19.071", rider:'F. Di Giannantonio', year:2025},
    Moto2:  {time:"1'22.698", rider:'S. Chantra',         year:2024},
    Moto3:  {time:"1'24.767", rider:'D. Munoz',           year:2025}
  },
  'GBR': { name:'Silverstone Circuit',                 len:'5.900 km',
    MotoGP: {time:"1'57.233", rider:'F. Quartararo',      year:2025},
    Moto2:  {time:"2'02.482", rider:'A. Canet',           year:2025},
    Moto3:  {time:"2'09.270", rider:'I. Ortola',          year:2024}
  },
  'ARA': { name:'Motorland Arag\u00f3n',               len:'5.077 km',
    MotoGP: {time:"1'45.704", rider:'M. Marquez',         year:2025},
    Moto2:  {time:"1'49.940", rider:'D. Moreira',         year:2025},
    Moto3:  {time:"1'56.361", rider:'J.A. Rueda',         year:2025}
  },
  'RSM': { name:'Misano World Circuit',                len:'4.226 km',
    MotoGP: {time:"1'30.031", rider:'F. Bagnaia',         year:2024},
    Moto2:  {time:"1'34.216", rider:'D. Holgado',         year:2025},
    Moto3:  {time:"1'40.184", rider:'D. Alonso',          year:2024}
  },
  'AUT': { name:'Red Bull Ring',                       len:'4.318 km',
    MotoGP: {time:"1'27.748", rider:'J. Martin',          year:2024},
    Moto2:  {time:"1'32.779", rider:'M. Gonzalez',        year:2025},
    Moto3:  {time:"1'39.918", rider:'A. Piqueras',        year:2025}
  },
  'JPN': { name:'Mobility Resort Motegi',              len:'4.801 km',
    MotoGP: {time:"1'43.018", rider:'P. Acosta',          year:2024},
    Moto2:  {time:"1'47.925", rider:'M. Gonzalez',        year:2025},
    Moto3:  {time:"1'54.826", rider:'J.A. Rueda',         year:2025}
  },
  'INA': { name:'Pertamina Mandalika Circuit',         len:'4.031 km',
    MotoGP: {time:"1'29.088", rider:'J. Martin',          year:2024},
    Moto2:  {time:"1'32.341", rider:'D. Moreira',         year:2025},
    Moto3:  {time:"1'37.022", rider:'A. Fernandez',       year:2025}
  },
  'AUS': { name:'Phillip Island Circuit',              len:'4.448 km',
    MotoGP: {time:"1'27.246", rider:'J. Martin',          year:2023},
    Moto2:  {time:"1'29.817", rider:'D. Moreira',         year:2025},
    Moto3:  {time:"1'34.056", rider:'J. Kelso',           year:2025}
  },
  'MAL': { name:'Sepang International Circuit',        len:'5.543 km',
    MotoGP: {time:"1'56.337", rider:'F. Bagnaia',         year:2024},
    Moto2:  {time:"2'02.858", rider:'D. Holgado',         year:2025},
    Moto3:  {time:"2'09.542", rider:'A. Fernandez',       year:2024}
  },
  'POR': { name:'Portim\u00e3o',                       len:'4.592 km',
    MotoGP: {time:"1'37.226", rider:'M. Marquez',         year:2023},
    Moto2:  {time:"1'41.168", rider:'D. Moreira',         year:2025},
    Moto3:  {time:"1'46.379", rider:'J.A. Rueda',         year:2024}
  },
  'VAL': { name:'Circuit Ricardo Tormo',               len:'4.005 km',
    MotoGP: {time:"1'28.809", rider:'M. Bezzecchi',       year:2025},
    Moto2:  {time:"1'31.715", rider:'D. Holgado',         year:2025},
    Moto3:  {time:"1'36.990", rider:'A. Fernandez',       year:2025}
  },
  'ARG': { name:'Termas de Rio Hondo',                 len:'4.806 km',
    MotoGP: {time:"1'36.917", rider:'M. Marquez',         year:2025},
    Moto2:  {time:"1'40.870", rider:'M. Gonzalez',        year:2025},
    Moto3:  {time:"1'46.303", rider:'M. Bertelle',        year:2025}
  }
};

// ------------------------------------------------------------
// renderRecordPanel
// WSBK mód:   WSBK_RECORDS[wsbkEvent][wsbkSeries]
// MotoGP mód: MOTOGP_RECORDS[selectedEventCode][selectedCat]
// ------------------------------------------------------------
function renderRecordPanel() {
  var el     = document.getElementById('recordContent');
  var header = document.getElementById('recordHeader');
  if(!el) return;

  var isWsbk = (typeof activeChampionship !== 'undefined' && activeChampionship === 'wsbk');
  var data, rec, label;

  if(isWsbk) {
    var code = typeof wsbkEvent  !== 'undefined' ? wsbkEvent  : null;
    var ser  = typeof wsbkSeries !== 'undefined' ? wsbkSeries : 'SBK';
    data  = code ? WSBK_RECORDS[code] : null;
    rec   = data ? (data[ser] || null) : null;
    label = ser;
  } else {
    var code = typeof selectedEventCode !== 'undefined' ? selectedEventCode : null;
    var cat  = typeof selectedCat       !== 'undefined' ? selectedCat       : 'MotoGP';
    data  = code ? MOTOGP_RECORDS[code] : null;
    rec   = data ? (data[cat] || null) : null;
    label = cat;
  }

  if(header) header.innerHTML = data
    ? '\u2b1b <span style="color:var(--off-white);font-size:9px;">' + data.name + '</span>'
      + '&nbsp;<span style="color:var(--text-dim);font-size:7px;">' + data.len + '</span>'
    : '\u2b1b TRACK RECORD';

  if(!data) {
    el.innerHTML = '<div style="font-size:9px;color:var(--text-dim);">Nincs adat</div>';
    return;
  }

  if(!rec || rec.time === '\u2014') {
    el.innerHTML =
      '<div style="font-family:Oswald,sans-serif;font-size:8px;color:var(--text-dim);letter-spacing:2px;margin-bottom:2px;">LAP RECORD \u2014 ' + label + '</div>'
      + '<div style="font-size:11px;color:var(--text-dim);">\u2014</div>';
    return;
  }

  el.innerHTML =
    '<div style="font-family:Oswald,sans-serif;font-size:8px;color:var(--text-dim);letter-spacing:2px;margin-bottom:2px;">LAP RECORD \u2014 ' + label + '</div>'
    + '<div style="font-size:12px;font-family:Oswald,sans-serif;color:#f5c400;letter-spacing:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'
      + rec.time + ' &nbsp; ' + rec.rider
      + (rec.year ? ' &nbsp; ' + String(rec.year) : '')
    + '</div>';
}
