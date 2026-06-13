/* ============================================================
   Fotoabenteuer – Cookie-Consent (DSGVO/Opt-in)
   - Lädt Google-Ads-Tracking ERST nach "Alle akzeptieren"
   - "Nur notwendige" lädt nichts Zusätzliches
   - Auswahl wird lokal gespeichert (kein Tracking)
   ============================================================ */
(function () {
  "use strict";

  // >>> HIER deine Google-Ads-ID eintragen, z. B. "AW-123456789".
  //     Solange leer, wird KEIN Google-Tracking geladen (Banner funktioniert trotzdem).
  var GADS_ID = "";

  var STORE_KEY = "fa_cookie_consent";   // 'all' | 'necessary'
  var MIDNIGHT = "#0B1120", FLASH = "#F59E0B", ELECTRIC = "#3B82F6";

  function getConsent() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(STORE_KEY, v); localStorage.setItem(STORE_KEY + "_ts", String(Date.now())); } catch (e) {} }

  // ---- Google Ads erst nach Einwilligung laden ----
  function loadMarketing() {
    if (!GADS_ID) return;                 // keine ID hinterlegt -> nichts laden
    if (window._faGtagLoaded) return;
    window._faGtagLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GADS_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GADS_ID);
  }

  // ---- Styles ----
  function injectStyles() {
    if (document.getElementById("fa-cookie-style")) return;
    var css =
      "#fa-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;" +
      "background:" + MIDNIGHT + ";color:#fff;border:1px solid #1E293B;border-radius:16px;" +
      "padding:20px 22px;box-shadow:0 18px 50px -12px rgba(0,0,0,.5);font-family:'Inter',system-ui,sans-serif;" +
      "transform:translateY(120%);transition:transform .45s cubic-bezier(.2,.8,.2,1)}" +
      "#fa-cookie.show{transform:translateY(0)}" +
      "#fa-cookie h4{font-family:'Syne','Inter',sans-serif;font-size:1.05rem;margin:0 0 6px}" +
      "#fa-cookie p{font-size:.875rem;line-height:1.55;color:#CBD5E1;margin:0 0 16px}" +
      "#fa-cookie a{color:" + ELECTRIC + ";text-decoration:underline}" +
      "#fa-cookie .fa-btns{display:flex;gap:10px;flex-wrap:wrap}" +
      "#fa-cookie button{flex:1 1 auto;min-width:140px;font-family:'Syne','Inter',sans-serif;font-weight:700;" +
      "font-size:.9rem;padding:12px 18px;border-radius:999px;border:2px solid transparent;cursor:pointer;transition:transform .15s,background .15s}" +
      "#fa-cookie button:hover{transform:translateY(-2px)}" +
      "#fa-cookie .fa-accept{background:" + FLASH + ";color:" + MIDNIGHT + "}" +
      "#fa-cookie .fa-accept:hover{background:#e69009}" +
      "#fa-cookie .fa-necessary{background:transparent;color:#fff;border-color:#334155}" +
      "#fa-cookie .fa-necessary:hover{border-color:#fff}" +
      ".fa-cookie-link{cursor:pointer;color:rgba(255,255,255,.6);text-decoration:underline}" +
      "@media(prefers-reduced-motion:reduce){#fa-cookie{transition:none}}";
    var st = document.createElement("style");
    st.id = "fa-cookie-style";
    st.textContent = css;
    document.head.appendChild(st);
  }

  // ---- Banner ----
  function showBanner() {
    if (document.getElementById("fa-cookie")) return;
    injectStyles();
    var box = document.createElement("div");
    box.id = "fa-cookie";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Cookie-Einstellungen");
    box.innerHTML =
      '<h4>Cookies &amp; Datenschutz</h4>' +
      '<p>Wir verwenden notwendige Cookies f\u00fcr den Betrieb der Seite. Mit deiner Zustimmung setzen wir zus\u00e4tzlich Cookies f\u00fcr Google Ads (Conversion-Messung). Mehr in der <a href="/datenschutz.html">Datenschutzerkl\u00e4rung</a>.</p>' +
      '<div class="fa-btns">' +
      '<button type="button" class="fa-necessary">Nur notwendige</button>' +
      '<button type="button" class="fa-accept">Alle akzeptieren</button>' +
      '</div>';
    document.body.appendChild(box);
    requestAnimationFrame(function () { box.classList.add("show"); });

    box.querySelector(".fa-accept").addEventListener("click", function () {
      setConsent("all"); loadMarketing(); hideBanner(box); addSettingsLink();
    });
    box.querySelector(".fa-necessary").addEventListener("click", function () {
      setConsent("necessary"); hideBanner(box); addSettingsLink();
    });
  }

  function hideBanner(box) {
    box = box || document.getElementById("fa-cookie");
    if (!box) return;
    box.classList.remove("show");
    setTimeout(function () { if (box && box.parentNode) box.parentNode.removeChild(box); }, 450);
  }

  // ---- "Cookie-Einstellungen"-Link im Footer (Widerruf jederzeit) ----
  function addSettingsLink() {
    var footer = document.querySelector("footer");
    if (!footer || document.getElementById("fa-cookie-settings")) return;
    var sep = document.createTextNode(" \u00b7 ");
    var a = document.createElement("a");
    a.id = "fa-cookie-settings";
    a.className = "fa-cookie-link";
    a.textContent = "Cookie-Einstellungen";
    a.href = "javascript:void(0)";
    a.addEventListener("click", function () { window.faCookieSettings(); });
    footer.appendChild(sep);
    footer.appendChild(a);
  }

  // global: Einstellungen erneut öffnen (Widerruf)
  window.faCookieSettings = function () { showBanner(); };

  // ---- Init ----
  function init() {
    var consent = getConsent();
    if (consent === "all") { loadMarketing(); addSettingsLink(); }
    else if (consent === "necessary") { addSettingsLink(); }
    else { showBanner(); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
