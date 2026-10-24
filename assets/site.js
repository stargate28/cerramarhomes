(function () {
  var C = window.CERRAMAR || {};
  var es = document.documentElement.lang === "es";

  // language picker: English and Spanish are our own pages; every other language is translated by Google
  var LANGS = [["af", "Afrikaans"], ["sq", "Shqip"], ["am", "አማርኛ"], ["ar", "العربية"], ["hy", "Հայերեն"], ["as", "অসমীয়া"], ["ay", "Aymar"], ["az", "Azərbaycan"], ["bm", "Bamanankan"], ["eu", "Euskara"], ["be", "Беларуская"], ["bn", "বাংলা"], ["bho", "भोजपुरी"], ["bs", "Bosanski"], ["bg", "Български"], ["ca", "Català"], ["ceb", "Cebuano"], ["ny", "Chichewa"], ["zh-CN", "中文 (简体)"], ["zh-TW", "中文 (繁體)"], ["co", "Corsu"], ["hr", "Hrvatski"], ["cs", "Čeština"], ["da", "Dansk"], ["dv", "ދިވެހި"], ["doi", "डोगरी"], ["nl", "Nederlands"], ["eo", "Esperanto"], ["et", "Eesti"], ["ee", "Eʋegbe"], ["tl", "Filipino"], ["fi", "Suomi"], ["fr", "Français"], ["fy", "Frysk"], ["gl", "Galego"], ["ka", "ქართული"], ["de", "Deutsch"], ["el", "Ελληνικά"], ["gn", "Avañe’ẽ"], ["gu", "ગુજરાતી"], ["ht", "Kreyòl ayisyen"], ["ha", "Hausa"], ["haw", "ʻŌlelo Hawaiʻi"], ["iw", "עברית"], ["hi", "हिन्दी"], ["hmn", "Hmoob"], ["hu", "Magyar"], ["is", "Íslenska"], ["ig", "Igbo"], ["ilo", "Ilokano"], ["id", "Bahasa Indonesia"], ["ga", "Gaeilge"], ["it", "Italiano"], ["ja", "日本語"], ["jw", "Basa Jawa"], ["kn", "ಕನ್ನಡ"], ["kk", "Қазақ"], ["km", "ខ្មែរ"], ["rw", "Kinyarwanda"], ["gom", "कोंकणी"], ["ko", "한국어"], ["kri", "Krio"], ["ku", "Kurdî"], ["ckb", "کوردی"], ["ky", "Кыргызча"], ["lo", "ລາວ"], ["la", "Latina"], ["lv", "Latviešu"], ["ln", "Lingála"], ["lt", "Lietuvių"], ["lg", "Luganda"], ["lb", "Lëtzebuergesch"], ["mk", "Македонски"], ["mai", "मैथिली"], ["mg", "Malagasy"], ["ms", "Bahasa Melayu"], ["ml", "മലയാളം"], ["mt", "Malti"], ["mi", "Māori"], ["mr", "मराठी"], ["mni-Mtei", "ꯃꯤꯇꯩꯂꯣꯟ"], ["lus", "Mizo"], ["mn", "Монгол"], ["my", "မြန်မာ"], ["ne", "नेपाली"], ["no", "Norsk"], ["or", "ଓଡ଼ିଆ"], ["om", "Oromoo"], ["ps", "پښتو"], ["fa", "فارسی"], ["pl", "Polski"], ["pt", "Português"], ["pa", "ਪੰਜਾਬੀ"], ["qu", "Runasimi"], ["ro", "Română"], ["ru", "Русский"], ["sm", "Gagana Sāmoa"], ["sa", "संस्कृतम्"], ["gd", "Gàidhlig"], ["nso", "Sepedi"], ["sr", "Српски"], ["st", "Sesotho"], ["sn", "chiShona"], ["sd", "سنڌي"], ["si", "සිංහල"], ["sk", "Slovenčina"], ["sl", "Slovenščina"], ["so", "Soomaali"], ["su", "Basa Sunda"], ["sw", "Kiswahili"], ["sv", "Svenska"], ["tg", "Тоҷикӣ"], ["ta", "தமிழ்"], ["tt", "Татар"], ["te", "తెలుగు"], ["th", "ไทย"], ["ti", "ትግርኛ"], ["ts", "Xitsonga"], ["tr", "Türkçe"], ["tk", "Türkmen"], ["ak", "Twi"], ["uk", "Українська"], ["ur", "اردو"], ["ug", "ئۇيغۇرچە"], ["uz", "Oʻzbek"], ["vi", "Tiếng Việt"], ["cy", "Cymraeg"], ["xh", "isiXhosa"], ["yi", "ייִדיש"], ["yo", "Yorùbá"], ["zu", "isiZulu"]];
  var sel = document.getElementById("lang-select");
  if (sel) {
    LANGS.forEach(function (l) { var o = document.createElement("option"); o.value = l[0]; o.textContent = l[1]; sel.appendChild(o); });
    var onProxy = /\.translate\.goog$/.test(location.hostname);
    var params = new URLSearchParams(location.search);
    sel.value = onProxy ? (params.get("_x_tr_tl") || "en") : sel.getAttribute("data-current");
    if (onProxy) {   // tell visitors this is a machine translation (Google translates this note too)
      var note = document.createElement("p"); note.className = "lang-note";
      note.textContent = "This page was translated automatically by Google Translate. The English version is the official one.";
      var foot = document.querySelector("footer.site .wrap"); if (foot) foot.appendChild(note);
    }
    var SITE = "https://cerramarhomes.com";
    var pagePath = function () {   // path of this page on the real site, without the Spanish folder
      var p = location.pathname.replace(/^\/es\//, "/");
      return p === "/es" ? "/" : p;
    };
    sel.addEventListener("change", function () {
      var v = sel.value, path = pagePath();
      if (v === "en") { location.href = SITE + path; return; }
      if (v === "es" && (path === "/" || path === "/index.html")) { location.href = SITE + "/es/"; return; }  // our own Spanish home page
      location.href = "https://cerramarhomes-com.translate.goog" + path + "?_x_tr_sl=en&_x_tr_tl=" + encodeURIComponent(v) + "&_x_tr_hl=" + encodeURIComponent(v) + "&_x_tr_pto=wapp";
    });
  }

  // mobile menu
  var btn = document.querySelector(".menu-btn"), nav = document.querySelector("nav.main");
  if (btn && nav) btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // links to the MLS search
  document.querySelectorAll("[data-mls]").forEach(function (a) { a.href = C.MLS_SEARCH_URL; });
  var frame = document.querySelector(".search-frame");
  if (frame) frame.src = C.MLS_SEARCH_URL;

  // hero quick search: go to the search page
  var hs = document.querySelector(".hero-search");
  if (hs) hs.addEventListener("submit", function (e) {
    e.preventDefault();
    var area = hs.querySelector("select[name=area]").value;
    var base = es ? "../search.html" : "search.html";
    location.href = base + (area ? "?area=" + encodeURIComponent(area) : "");
  });
  var areaNote = document.querySelector("[data-area-note]");
  if (areaNote) {
    var a = new URLSearchParams(location.search).get("area");
    if (a) areaNote.textContent = "Tip: in the search below, open Location and enter \"" + a + "\" as the City.";
  }

  // lead forms -> CRM
  document.querySelectorAll("form.lead-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.querySelector(".form-msg");
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.consent = !!form.querySelector("input[name=consent]:checked");
      data.language = es ? "Spanish" : (data.language || "");
      var fallback = (es ? "No pudimos enviar el formulario. Llámenos al " : "We couldn't send the form. Please call ")
        + C.PHONE + (es ? " o escriba a " : " or email ") + C.EMAIL + ".";
      function show(text, ok) { msg.hidden = false; msg.textContent = text; msg.className = "form-msg " + (ok ? "ok" : "err"); }
      if (!C.CRM_URL || !C.CRM_KEY) { show(fallback, false); return; }
      var b = form.querySelector("button[type=submit]"); b.disabled = true;
      fetch(C.CRM_URL.replace(/\/$/, "") + "/api/widget/" + encodeURIComponent(C.CRM_KEY) + "/lead", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.reset();
        show(es ? "¡Gracias! Un agente de Cerramar se comunicará con usted pronto." :
          "Thank you! A Cerramar agent will be in touch shortly.", true);
      }).catch(function () { show(fallback, false); })
        .then(function () { b.disabled = false; });
    });
  });

  // investment calculator (simple, assumptions shown on the page)
  var calc = document.querySelector(".calc");
  if (calc) {
    var money = function (n) { return (n < 0 ? "-$" : "$") + Math.round(Math.abs(n)).toLocaleString("en-US"); };
    var run = function () {
      var v = function (n) { return parseFloat(calc.querySelector("[name=" + n + "]").value) || 0; };
      var price = v("price"), rent = v("rent"), vac = v("vacancy") / 100, exp = v("expenses"), down = v("down") / 100,
        rate = v("rate") / 100 / 12, years = 30;
      var income = rent * 12 * (1 - vac), noi = income - exp * 12;
      var loan = price * (1 - down), n = years * 12;
      var pmt = loan > 0 ? (rate > 0 ? loan * rate / (1 - Math.pow(1 + rate, -n)) : loan / n) : 0;
      var cash = noi - pmt * 12, invested = price * down;
      calc.querySelector("[data-o=noi]").textContent = money(noi);
      calc.querySelector("[data-o=cap]").textContent = price ? (noi / price * 100).toFixed(2) + "%" : "–";
      calc.querySelector("[data-o=pmt]").textContent = money(pmt);
      calc.querySelector("[data-o=cash]").textContent = money(cash);
      calc.querySelector("[data-o=coc]").textContent = invested ? (cash / invested * 100).toFixed(2) + "%" : "–";
      calc.querySelector("[data-o=dscr]").textContent = pmt ? (noi / (pmt * 12)).toFixed(2) : "–";
    };
    calc.addEventListener("input", run); run();
  }

  // Maia chat (loads from the CRM once it's online)
  if (C.CRM_URL && C.CRM_KEY) {
    document.querySelectorAll(".ai-live").forEach(function (el) { el.hidden = false; });
    var s = document.createElement("script");
    s.src = C.CRM_URL.replace(/\/$/, "") + "/widget.js";
    s.setAttribute("data-key", C.CRM_KEY);
    s.setAttribute("data-color", "#1d6fa5");
    s.defer = true;
    document.body.appendChild(s);
  }
  var y = document.querySelector("[data-year]"); if (y) y.textContent = new Date().getFullYear();
})();
