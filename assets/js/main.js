// Menú en celular y año del pie de página
(function () {
  var btn = document.getElementById('menu-toggle');
  var menu = document.getElementById('menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// Google Analytics con aviso de cookies (el visitante puede rechazarlas)
(function () {
  var GA_ID = 'G-XXXXXXXXXX'; // ID de medición de Google Analytics
  var KEY = 'db-cookies';
  if (!/^G-[A-Z0-9]+$/.test(GA_ID) || GA_ID === 'G-XXXXXXXXXX') return;

  function getPref() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setPref(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGA() {
    if (window.gtag) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
  }

  function clearGACookies() {
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') === 0) {
        document.cookie = name + '=; Max-Age=0; path=/; domain=.' + location.hostname.replace(/^www\./, '');
        document.cookie = name + '=; Max-Age=0; path=/';
      }
    });
  }

  function showBanner() {
    if (document.getElementById('cookie-banner')) return;
    var b = document.createElement('div');
    b.id = 'cookie-banner';
    b.className = 'cookie-banner';
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'Aviso de cookies');
    b.innerHTML = '<p>Usamos cookies de Google Analytics para medir de forma estadística cómo se usa este sitio. ' +
      'Más información en el <a href="/aviso-de-privacidad.html#cookies">Aviso de privacidad</a>.</p>' +
      '<div class="cookie-actions"><button type="button" class="btn btn-small" data-cookie="ok">Entendido</button>' +
      '<button type="button" class="btn btn-small btn-ghost" data-cookie="no">Rechazar</button></div>';
    document.body.appendChild(b);
    b.addEventListener('click', function (e) {
      var v = e.target.getAttribute('data-cookie');
      if (!v) return;
      setPref(v);
      b.remove();
      if (v === 'no') { window['ga-disable-' + GA_ID] = true; clearGACookies(); }
    });
  }

  var pref = getPref();
  if (pref === 'no') {
    window['ga-disable-' + GA_ID] = true;
  } else {
    loadGA();
    if (!pref) showBanner();
  }

  document.addEventListener('click', function (e) {
    if (e.target.hasAttribute && e.target.hasAttribute('data-cookie-reset')) {
      try { localStorage.removeItem(KEY); } catch (err) {}
      showBanner();
    }
  });
})();
