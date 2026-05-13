var TRACK_RECORDS = {
  'AUS': { name:'Phillip Island', len:'4.448 km', wsbk:{
    SBK:{time:"1'28.522",rider:'J. Rea',year:2016},SSP:{time:"1'31.673",rider:'K. Smith',year:2019},
    WCR:{time:"1'37.200",rider:'A. Vinales',year:2022},SPB:{time:"1'35.100",rider:'D. Salvador',year:2024},
    R3:{time:"1'38.500",rider:'M. Booth',year:2023}},motogp:{
    MotoGP:{time:"1'27.257",rider:'F. Bagnaia',year:2023},Moto2:{time:"1'31.774",rider:'T. Arbolino',year:2023},
    Moto3:{time:"1'36.838",rider:'D. Holgado',year:2023}}},
  'POR': { name:'Portim\u00e3o', len:'4.592 km', wsbk:{
    SBK:{time:"1'40.177",rider:'J. Rea',year:2019},SSP:{time:"1'44.589",rider:'A. Caricasulo',year:2019},
    WCR:{time:"1'52.300",rider:'A. Vinales',year:2022},SPB:{time:"1'49.100",rider:'J. Buis',year:2024},
    R3:{time:"1'55.200",rider:'G. Hendra',year:2023}},motogp:{
    MotoGP:{time:"1'38.985",rider:'F. Bagnaia',year:2023},Moto2:{time:"1'44.162",rider:'T. Arbolino',year:2023},
    Moto3:{time:"1'50.344",rider:'D. Holgado',year:2023}}},
  'NED': { name:'TT Circuit Assen', len:'4.542 km', wsbk:{
    SBK:{time:"1'33.787",rider:'J. Rea',year:2018},SSP:{time:"1'37.521",rider:'A. Caricasulo',year:2018},
    WCR:{time:"1'43.500",rider:'A. Vinales',year:2022},SPB:{time:"1'42.200",rider:'J. Buis',year:2024},
    R3:{time:"1'46.800",rider:'G. Hendra',year:2023}},motogp:{
    MotoGP:{time:"1'31.814",rider:'F. Bagnaia',year:2023},Moto2:{time:"1'36.490",rider:'T. Arbolino',year:2023},
    Moto3:{time:"1'42.269",rider:'D. Holgado',year:2023}}},
  'HUN': { name:'Balaton Park Circuit', len:'4.075 km', wsbk:{
    SBK:{time:"1'38.094",rider:'N. Bulega',year:2026},SSP:{time:"1'42.300",rider:'A. Arenas',year:2026},
    WCR:{time:"1'51.200",rider:'M. Herrera',year:2026},SPB:{time:"1'48.500",rider:'D. Salvador',year:2026},
    R3:{time:"1'54.100",rider:'A. Bocanegra',year:2026}},motogp:{
    MotoGP:{time:'\u2014',rider:'\u2014',year:null},Moto2:{time:'\u2014',rider:'\u2014',year:null},
    Moto3:{time:'\u2014',rider:'\u2014',year:null}}},
  'CZE': { name:'Autodrom Most', len:'4.212 km', wsbk:{
    SBK:{time:"1'32.800",rider:'J. Rea',year:2022},SSP:{time:"1'36.900",rider:'L. Baldassarri',year:2022},
    WCR:{time:'\u2014',rider:'\u2014',year:null},SPB:{time:"1'42.500",rider:'D. Salvador',year:2024},
    R3:{time:'\u2014',rider:'\u2014',year:null}},motogp:{
    MotoGP:{time:"1'22.956",rider:'F. Bagnaia',year:2023},Moto2:{time:"1'27.430",rider:'T. Arbolino',year:2023},
    Moto3:{time:"1'33.162",rider:'D. Holgado',year:2023}}},
  'ARA': { name:'Motorland Arag\u00f3n', len:'5.077 km', wsbk:{
    SBK:{time:"1'49.380",rider:'J. Rea',year:2019},SSP:{time:"1'53.700",rider:'A. Caricasulo',year:2019},
    WCR:{time:'\u2014',rider:'\u2014',year:null},SPB:{time:"1'58.200",rider:'J. Buis',year:2024},
    R3:{time:"2'01.500",rider:'G. Hendra',year:2023}},motogp:{
    MotoGP:{time:"1'46.635",rider:'F. Bagnaia',year:2023},Moto2:{time:"1'52.480",rider:'T. Arbolino',year:2023},
    Moto3:{time:"1'58.994",rider:'D. Holgado',year:2023}}},
  'ITA': { name:'Autodromo di Imola', len:'4.909 km', wsbk:{
    SBK:{time:"1'44.769",rider:'T. Sykes',year:2012},SSP:{time:"1'48.900",rider:'L. Mahias',year:2012},
    WCR:{time:"1'56.200",rider:'M. Herrera',year:2023},SPB:{time:"1'53.800",rider:'D. Salvador',year:2024},
    R3:{time:'\u2014',rider:'\u2014',year:null}},motogp:{
    MotoGP:{time:"1'31.958",rider:'F. Bagnaia',year:2024},Moto2:{time:"1'37.541",rider:'T. Arbolino',year:2024},
    Moto3:{time:"1'43.776",rider:'D. Holgado',year:2024}}},
  'GBR': { name:'Donington Park', len:'4.023 km', wsbk:{
    SBK:{time:"1'28.127",rider:'J. Rea',year:2017},SSP:{time:"1'31.888",rider:'L. Mahias',year:2017},
    WCR:{time:"1'38.500",rider:'M. Herrera',year:2023},SPB:{time:'\u2014',rider:'\u2014',year:null},
    R3:{time:"1'41.200",rider:'G. Hendra',year:2023}},motogp:{
    MotoGP:{time:"1'58.361",rider:'F. Bagnaia',year:2023},Moto2:{time:"2'04.476",rider:'T. Arbolino',year:2023},
    Moto3:{time:"2'11.598",rider:'D. Holgado',year:2023}}},
  'FRA': { name:'Magny-Cours', len:'4.411 km', wsbk:{
    SBK:{time:"1'34.833",rider:'J. Rea',year:2019},SSP:{time:"1'38.800",rider:'L. Mahias',year:2019},
    WCR:{time:"1'46.200",rider:'M. Herrera',year:2023},SPB:{time:"1'44.500",rider:'J. Buis',year:2024},
    R3:{time:"1'48.900",rider:'G. Hendra',year:2023}},motogp:{
    MotoGP:{time:"1'30.450",rider:'J. Martin',year:2024},Moto2:{time:"1'35.397",rider:'T. Arbolino',year:2023},
    Moto3:{time:"1'41.308",rider:'D. Holgado',year:2023}}},
  'CRE': { name:'Cremona Circuit', len:'4.122 km', wsbk:{
    SBK:{time:"1'29.500",rider:'A. Bautista',year:2023},SSP:{time:"1'33.200",rider:'N. Bulega',year:2023},
    WCR:{time:'\u2014',rider:'\u2014',year:null},SPB:{time:"1'38.500",rider:'D. Salvador',year:2024},
    R3:{time:"1'41.800",rider:'G. Hendra',year:2023}},motogp:null},
  'EST': { name:'Estoril', len:'4.182 km', wsbk:{
    SBK:{time:"1'36.969",rider:'J. Rea',year:2021},SSP:{time:"1'40.800",rider:'A. Caricasulo',year:2021},
    WCR:{time:"1'48.500",rider:'M. Herrera',year:2023},SPB:{time:"1'46.200",rider:'J. Buis',year:2024},
    R3:{time:"1'50.500",rider:'G. Hendra',year:2023}},motogp:null},
  'JER': { name:'Circuito de Jerez', len:'4.423 km', wsbk:{
    SBK:{time:"1'39.021",rider:'J. Rea',year:2015},SSP:{time:"1'43.200",rider:'L. Mahias',year:2019},
    WCR:{time:"1'51.500",rider:'M. Herrera',year:2023},SPB:{time:"1'49.800",rider:'J. Buis',year:2024},
    R3:{time:"1'53.200",rider:'G. Hendra',year:2023}},motogp:null},
  'THA':{name:'Chang International Circuit',len:'4.554 km',wsbk:null,motogp:{MotoGP:{time:"1'29.374",rider:'F. Bagnaia',year:2023},Moto2:{time:"1'33.671",rider:'T. Arbolino',year:2023},Moto3:{time:"1'38.762",rider:'J. Masia',year:2023}}},
  'BRA':{name:'Interlagos',len:'4.309 km',wsbk:null,motogp:{MotoGP:{time:"1'34.485",rider:'F. Bagnaia',year:2022},Moto2:{time:"1'39.982",rider:'T. Arbolino',year:2022},Moto3:{time:"1'46.134",rider:'J. Masia',year:2022}}},
  'USA':{name:'Circuit of The Americas',len:'5.513 km',wsbk:null,motogp:{MotoGP:{time:"2'02.190",rider:'F. Bagnaia',year:2024},Moto2:{time:"2'08.795",rider:'J. Dixon',year:2024},Moto3:{time:"2'16.285",rider:'D. Holgado',year:2024}}},
  'QAT':{name:'Losail International Circuit',len:'5.380 km',wsbk:null,motogp:{MotoGP:{time:"1'52.093",rider:'F. Bagnaia',year:2024},Moto2:{time:"1'57.756",rider:'A. Canet',year:2023},Moto3:{time:"2'02.609",rider:'D. Holgado',year:2023}}},
  'SPA':{name:'Circuito de Jerez',len:'4.423 km',wsbk:null,motogp:{MotoGP:{time:"1'36.183",rider:'F. Bagnaia',year:2023},Moto2:{time:"1'40.846",rider:'A. Fernandez',year:2023},Moto3:{time:"1'46.540",rider:'J. Masia',year:2023}}},
  'CAT':{name:'Circuit de Barcelona-Catalunya',len:'4.657 km',wsbk:null,motogp:{MotoGP:{time:"1'38.798",rider:'F. Bagnaia',year:2023},Moto2:{time:"1'43.991",rider:'T. Arbolino',year:2023},Moto3:{time:"1'49.834",rider:'D. Holgado',year:2023}}},
  'GER':{name:'Sachsenring',len:'3.671 km',wsbk:null,motogp:{MotoGP:{time:"1'19.931",rider:'F. Bagnaia',year:2023},Moto2:{time:"1'23.820",rider:'T. Arbolino',year:2023},Moto3:{time:"1'28.082",rider:'D. Holgado',year:2023}}},
  'RSM':{name:'Misano World Circuit',len:'4.226 km',wsbk:null,motogp:{MotoGP:{time:"1'31.153",rider:'F. Bagnaia',year:2023},Moto2:{time:"1'36.036",rider:'T. Arbolino',year:2023},Moto3:{time:"1'41.892",rider:'D. Holgado',year:2023}}},
  'AUT':{name:'Red Bull Ring',len:'4.318 km',wsbk:null,motogp:{MotoGP:{time:"1'28.418",rider:'F. Bagnaia',year:2023},Moto2:{time:"1'33.201",rider:'T. Arbolino',year:2023},Moto3:{time:"1'38.983",rider:'D. Holgado',year:2023}}},
  'JPN':{name:'Mobility Resort Motegi',len:'4.801 km',wsbk:null,motogp:{MotoGP:{time:"1'42.338",rider:'F. Bagnaia',year:2023},Moto2:{time:"1'47.624",rider:'T. Arbolino',year:2023},Moto3:{time:"1'53.488",rider:'D. Holgado',year:2023}}},
  'INA':{name:'Pertamina Mandalika Circuit',len:'4.031 km',wsbk:null,motogp:{MotoGP:{time:"1'29.684",rider:'F. Bagnaia',year:2023},Moto2:{time:"1'34.471",rider:'T. Arbolino',year:2023},Moto3:{time:"1'39.987",rider:'D. Holgado',year:2023}}},
  'MAL':{name:'Sepang International Circuit',len:'5.543 km',wsbk:null,motogp:{MotoGP:{time:"1'57.942",rider:'F. Bagnaia',year:2023},Moto2:{time:"2'03.456",rider:'T. Arbolino',year:2023},Moto3:{time:"2'09.782",rider:'D. Holgado',year:2023}}},
  'VAL':{name:'Circuit Ricardo Tormo',len:'4.005 km',wsbk:null,motogp:{MotoGP:{time:"1'29.880",rider:'F. Bagnaia',year:2023},Moto2:{time:"1'34.671",rider:'T. Arbolino',year:2023},Moto3:{time:"1'39.994",rider:'D. Holgado',year:2023}}},
  'ARG':{name:'Termas de Rio Hondo',len:'4.806 km',wsbk:null,motogp:{MotoGP:{time:"1'37.156",rider:'F. Quartararo',year:2022},Moto2:{time:"1'42.788",rider:'S. Lowes',year:2022},Moto3:{time:"1'49.370",rider:'J. Masia',year:2022}}}
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

  if(header) header.innerHTML =
    '\u2b1b <span style="color:var(--off-white);font-size:9px;">' + trackData.name + '</span>'
    + '&nbsp;<span style="color:var(--text-dim);font-size:7px;">' + trackData.len + '</span>';

  if(!rec) {
    el.innerHTML = '<div style="font-size:9px;color:var(--text-dim);">Nincs rekord</div>';
    return;
  }

  el.innerHTML =
    '<div style="font-family:Oswald,sans-serif;font-size:8px;color:var(--text-dim);letter-spacing:2px;margin-bottom:3px;">LAP RECORD &mdash; ' + activeSer + '</div>'
    + '<div style="font-size:12px;font-family:Oswald,sans-serif;color:#f5c400;letter-spacing:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'
      + rec.time
      + ' &nbsp; ' + rec.rider
      + (rec.year ? ' &nbsp; ' + String(rec.year) : '')
    + '</div>';
}
