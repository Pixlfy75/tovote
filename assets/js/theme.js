/* TO VOTE · Envol — ambiance du ciel : jour, aube ou crépuscule, nuit ; bouton Auto / Jour / Nuit dans le menu.
   Chargé dans le <head> de chaque page, sans defer : l'ambiance est posée avant l'affichage, sans éclair.

   En automatique, l'ambiance suit la hauteur du soleil là où se trouve l'appareil :
   - position exacte si le site a déjà l'autorisation de localisation (elle n'est jamais demandée) ;
   - sinon, position estimée d'après le fuseau horaire de l'appareil : un téléphone passé à l'heure de Lisbonne
     voit le soleil de Lisbonne.
   Soleil à plus de 8° : jour. De 8° à −5° : aube ou crépuscule, le fond se réchauffe peu à peu (--tw de 0 à 1),
   textes et cartes restent en version jour. Sous −5° : nuit (mode nuit complet, night.css).
   La page ouverte se met à jour toute seule, chaque minute.

   Résultat : <html data-theme="light|dark" data-sky="day|dawn|dusk|night" style="--tw:0…1">
   Choix mémorisé sur l'appareil : localStorage tv_ambiance = auto | jour | nuit */
(function () {
  var root = document.documentElement, KEY = 'tv_ambiance', POS = 'tv_pos';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Où est l'appareil ? ---------- */
  /* Fuseaux du réseau Transavia et grandes villes : latitude, longitude */
  var TZ = {
    'Europe/Paris': [48.86, 2.35], 'Europe/Amsterdam': [52.37, 4.9], 'Europe/Brussels': [50.85, 4.35], 'Europe/Luxembourg': [49.61, 6.13],
    'Europe/Zurich': [47.37, 8.54], 'Europe/Monaco': [43.73, 7.42], 'Europe/London': [51.51, -0.13], 'Europe/Dublin': [53.35, -6.26],
    'Europe/Lisbon': [38.72, -9.14], 'Atlantic/Madeira': [32.65, -16.91], 'Atlantic/Azores': [37.74, -25.67], 'Atlantic/Canary': [28.12, -15.43],
    'Europe/Madrid': [40.42, -3.7], 'Africa/Ceuta': [35.89, -5.32], 'Europe/Rome': [41.9, 12.5], 'Europe/Malta': [35.9, 14.51],
    'Europe/Berlin': [52.52, 13.4], 'Europe/Vienna': [48.21, 16.37], 'Europe/Prague': [50.08, 14.44], 'Europe/Budapest': [47.5, 19.04],
    'Europe/Warsaw': [52.23, 21.01], 'Europe/Copenhagen': [55.68, 12.57], 'Europe/Stockholm': [59.33, 18.07], 'Europe/Oslo': [59.91, 10.75],
    'Europe/Helsinki': [60.17, 24.94], 'Europe/Athens': [37.98, 23.73], 'Europe/Istanbul': [41.01, 28.98], 'Europe/Sofia': [42.7, 23.32],
    'Europe/Bucharest': [44.43, 26.1], 'Europe/Belgrade': [44.79, 20.45], 'Europe/Zagreb': [45.81, 15.98], 'Europe/Ljubljana': [46.06, 14.51],
    'Europe/Sarajevo': [43.86, 18.41], 'Europe/Podgorica': [42.44, 19.26], 'Europe/Tirane': [41.33, 19.82], 'Europe/Skopje': [42, 21.43],
    'Europe/Kyiv': [50.45, 30.52], 'Asia/Nicosia': [35.17, 33.36], 'Asia/Famagusta': [35.12, 33.94],
    'Africa/Casablanca': [33.57, -7.59], 'Africa/Algiers': [36.75, 3.06], 'Africa/Tunis': [36.81, 10.18], 'Africa/Tripoli': [32.89, 13.19],
    'Africa/Cairo': [30.04, 31.24], 'Africa/Dakar': [14.72, -17.47], 'Asia/Jerusalem': [31.77, 35.21], 'Asia/Amman': [31.95, 35.93],
    'Asia/Beirut': [33.89, 35.5], 'Asia/Dubai': [25.2, 55.27], 'Asia/Qatar': [25.29, 51.53],
    'America/Martinique': [14.6, -61.07], 'America/Guadeloupe': [16.24, -61.53], 'America/Cayenne': [4.92, -52.31],
    'Indian/Reunion': [-20.88, 55.45], 'Indian/Mayotte': [-12.78, 45.23], 'Pacific/Tahiti': [-17.53, -149.57],
    'America/New_York': [40.71, -74], 'America/Toronto': [43.65, -79.38], 'America/Montreal': [45.5, -73.57], 'America/Chicago': [41.88, -87.63],
    'America/Los_Angeles': [34.05, -118.24], 'Asia/Tokyo': [35.68, 139.69], 'Asia/Shanghai': [31.23, 121.47], 'Asia/Bangkok': [13.76, 100.5],
    'Australia/Sydney': [-33.87, 151.21]
  };
  function zone() { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; } }
  function where() {
    var z = zone();
    try { var p = JSON.parse(localStorage.getItem(POS)); if (p && p.tz === z && Date.now() - p.t < 3 * 864e5) return [p.lat, p.lon]; } catch (e) {}
    if (TZ[z]) return TZ[z];
    /* fuseau inconnu : longitude d'après le décalage horaire d'hiver, latitude moyenne de la région */
    var y = new Date().getFullYear(), off = Math.max(new Date(y, 0, 1).getTimezoneOffset(), new Date(y, 6, 1).getTimezoneOffset());
    var lat = { Europe: 48, Africa: 10, America: 35, Asia: 30, Australia: -30, Pacific: -15, Indian: -15, Atlantic: 35 }[z.split('/')[0]];
    return [lat == null ? 45 : lat, -off / 4];
  }

  /* ---------- Hauteur du soleil, en degrés (formules simplifiées de la NOAA, précises à quelques minutes près) ---------- */
  function elevation(d, lat, lon) {
    var r = Math.PI / 180, n = d.getTime() / 864e5 - 10957.5; /* jours depuis le 1er janvier 2000 à midi UTC */
    var L = 280.46 + .9856474 * n, g = (357.528 + .9856003 * n) * r;
    var lam = (L + 1.915 * Math.sin(g) + .02 * Math.sin(2 * g)) * r, eps = (23.439 - 4e-7 * n) * r;
    var dec = Math.asin(Math.sin(eps) * Math.sin(lam)), ra = Math.atan2(Math.cos(eps) * Math.sin(lam), Math.cos(lam));
    var ha = (280.46061837 + 360.98564736629 * n + lon) * r - ra;
    return Math.asin(Math.sin(lat * r) * Math.sin(dec) + Math.cos(lat * r) * Math.cos(dec) * Math.cos(ha)) / r;
  }

  /* ---------- Ambiance du moment ---------- */
  var mem = null; /* choix gardé en mémoire si le navigateur refuse le stockage (navigation privée…) */
  function choice() { var c = mem; try { c = localStorage.getItem(KEY) || mem; } catch (e) {} return c === 'jour' || c === 'nuit' ? c : 'auto'; }
  function ambiance() {
    var c = choice();
    if (c === 'jour') return { theme: 'light', sky: 'day', tw: 0 };
    if (c === 'nuit') return { theme: 'dark', sky: 'night', tw: 0 };
    var p = where(), now = new Date(), e = elevation(now, p[0], p[1]);
    if (e <= -5) return { theme: 'dark', sky: 'night', tw: 0 };
    if (e >= 8) return { theme: 'light', sky: 'day', tw: 0 };
    var rising = elevation(new Date(now.getTime() + 6e5), p[0], p[1]) > e;
    return { theme: 'light', sky: rising ? 'dawn' : 'dusk', tw: Math.min(1, (8 - e) / 7) };
  }
  var cur = {};
  function set(a) {
    root.setAttribute('data-theme', a.theme);
    root.setAttribute('data-sky', a.sky);
    root.style.setProperty('--tw', a.tw.toFixed(3));
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = a.theme === 'dark' ? '#0B0830' : a.tw > .5 ? '#FFD3C4' : '#FFE3D8';
    cur = a; paint();
  }
  /* changement d'ambiance (jour, aube, nuit…) : fondu enchaîné de toute la page quand le navigateur le permet */
  function update() {
    var a = ambiance();
    if (a.theme === cur.theme && a.sky === cur.sky) { set(a); return; }
    if (document.startViewTransition && !reduce && document.body) document.startViewTransition(function () { set(a); });
    else set(a);
  }
  set(ambiance());
  setInterval(update, 60000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) update(); });

  /* position exacte, seulement si l'autorisation a déjà été donnée au site */
  try {
    navigator.permissions.query({ name: 'geolocation' }).then(function (s) {
      if (s.state !== 'granted') return;
      navigator.geolocation.getCurrentPosition(function (g) {
        try { localStorage.setItem(POS, JSON.stringify({ lat: g.coords.latitude, lon: g.coords.longitude, tz: zone(), t: Date.now() })); } catch (e) {}
        update();
      }, function () {}, { maximumAge: 36e5, timeout: 10000 });
    }, function () {});
  } catch (e) {}

  /* ---------- Bouton Auto / Jour / Nuit ---------- */
  var ICON = {
    auto: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17a5 5 0 0 1 10 0z" fill="currentColor"/><path d="M2.5 17h19M12 6.5V9M5.6 9.6l1.7 1.7M18.4 9.6l-1.7 1.7M3 13.5h2.2M18.8 13.5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    jour: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    nuit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="currentColor"/></svg>'
  };
  var NAME = { auto: 'automatique, selon le soleil', jour: 'jour', nuit: 'nuit' };
  var TIP = { auto: 'Auto · selon le soleil', jour: 'Jour', nuit: 'Nuit' };
  var NEXT = { auto: 'jour', jour: 'nuit', nuit: 'auto' };
  var btn = null;
  function paint() {
    if (!btn) return;
    var c = choice();
    btn.innerHTML = ICON[c] + '<span class="theme-tip" aria-hidden="true">' + TIP[c] + '</span>';
    btn.setAttribute('data-mode', c);
    btn.setAttribute('aria-label', 'Ambiance : ' + NAME[c] + '. Passer en ' + NAME[NEXT[c]]);
    btn.title = 'Ambiance : ' + NAME[c];
  }
  function mount() {
    var nav = document.querySelector('.nav'); if (!nav || btn) return;
    btn = document.createElement('button'); btn.type = 'button'; btn.className = 'theme-btn';
    nav.insertBefore(btn, nav.querySelector('.btn-ruby'));
    btn.onclick = function () {
      mem = NEXT[choice()];
      try { localStorage.setItem(KEY, mem); } catch (e) {}
      update(); paint();
      btn.classList.remove('tip'); void btn.offsetWidth; btn.classList.add('tip');
      clearTimeout(btn._t); btn._t = setTimeout(function () { btn.classList.remove('tip'); }, 1800);
    };
    paint();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();

  window.tvAmbiance = { elevation: elevation, where: where, update: update };
})();
