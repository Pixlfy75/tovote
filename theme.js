/* TO VOTE · Envol — mode nuit. Le thème est appliqué dès le <head> (petit script en ligne dans chaque page)
   pour éviter un flash ; ce fichier ajoute le bouton lune / soleil dans le menu et mémorise le choix. */
(function () {
  var root = document.documentElement;
  var MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="currentColor"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  function saved() { try { return localStorage.getItem('tv_theme'); } catch (e) { return null; } }
  function apply(t) {
    root.setAttribute('data-theme', t);
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = t === 'dark' ? '#0B0830' : '#FFE3D8';
    var b = document.querySelector('.theme-btn');
    if (b) { b.innerHTML = t === 'dark' ? SUN : MOON; b.setAttribute('aria-pressed', t === 'dark'); b.setAttribute('aria-label', t === 'dark' ? 'Passer en mode jour' : 'Passer en mode nuit'); b.title = b.getAttribute('aria-label'); }
  }
  var nav = document.querySelector('.nav'), cta = nav && nav.querySelector('.btn-ruby');
  if (nav) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'theme-btn';
    nav.insertBefore(b, cta || null);
    b.onclick = function () { var t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('tv_theme', t); } catch (e) {} apply(t); };
  }
  apply(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  /* sans choix mémorisé, on suit le réglage de l'appareil s'il change */
  if (window.matchMedia) {
    var mq = matchMedia('(prefers-color-scheme: dark)');
    var on = function (e) { if (!saved()) apply(e.matches ? 'dark' : 'light'); };
    mq.addEventListener ? mq.addEventListener('change', on) : mq.addListener && mq.addListener(on);
  }
})();
