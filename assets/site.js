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

  // lead forms: go to the CRM when it's online; until then they're emailed to the office (FormSubmit)
  var LABELS = { form: "Form", name: "Name", phone: "Phone", email: "Email", lead_type: "Interested in",
    language: "Preferred language", message: "Message", address: "Property address", area: "Area",
    budget: "Budget", timeline: "Timeline", consent: "OK to call/text" };
  document.querySelectorAll("form.lead-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.querySelector(".form-msg");
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = typeof v === "string" ? v.trim() : v; });
      data.consent = !!form.querySelector("input[name=consent]:checked");
      data.language = es ? "Spanish" : (data.language || "");
      function show(text, ok) { msg.hidden = false; msg.textContent = text; msg.className = "form-msg " + (ok ? "ok" : "err"); }
      var fallback = (es ? "No pudimos enviar el formulario. Llámenos al " : "We couldn't send the form. Please call ")
        + C.PHONE + (es ? " o escriba a " : " or email ") + C.EMAIL + ".";

      // check the basics before sending
      var digits = (data.phone || "").replace(/\D/g, "");
      if (!data.name) { show(es ? "Por favor escriba su nombre." : "Please enter your name.", false); return; }
      if (data.phone && digits.length < 10) { show(es ? "Escriba un teléfono válido de 10 dígitos." : "Please enter a valid 10-digit phone number.", false); return; }
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { show(es ? "Escriba un correo electrónico válido." : "Please enter a valid email address.", false); return; }
      if (!data.phone && !data.email) { show(es ? "Déjenos un teléfono o correo electrónico para contactarle." : "Please give us a phone number or email so we can reach you.", false); return; }
      if (data.website) { show(es ? "¡Gracias!" : "Thank you!", true); return; }  // bot trap

      // email copy for the office (also the backup if the CRM can't be reached)
      var mail = { _subject: "New website lead: " + (data.form || "form") + " - " + data.name, _template: "table", _captcha: "false" };
      if (data.email) mail._replyto = data.email;
      Object.keys(data).forEach(function (k) { if (k !== "website" && data[k] !== "") mail[LABELS[k] || k] = k === "consent" ? (data[k] ? "Yes" : "No") : data[k]; });
      mail["Page"] = location.href;
      var post = function (url, body) {
        return fetch(url, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(body) })
          .then(function (r) { if (!r.ok) throw new Error(r.status); return r; });
      };
      var sendMail = function () { return post("https://formsubmit.co/ajax/" + (C.FORM_EMAIL || C.EMAIL), mail); };
      var send;
      if (C.CRM_URL && C.CRM_KEY) {
        var crm = post(C.CRM_URL.replace(/\/$/, "") + "/api/widget/" + encodeURIComponent(C.CRM_KEY) + "/lead", data);
        var em = sendMail();
        send = crm.catch(function () { return em; });   // succeed if either one gets through
      } else {
        send = sendMail();
      }
      var b = form.querySelector("button[type=submit]"); b.disabled = true;
      send.then(function () { form.reset();
          show(es ? "¡Gracias! Un agente de Cerramar se comunicará con usted pronto." : "Thank you! A Cerramar agent will be in touch shortly.", true); })
        .catch(function () { show(fallback, false); })
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
    if (C.PHONE_AI) document.querySelectorAll(".ai-phone").forEach(function (el) { el.hidden = false; });
    var s = document.createElement("script");
    s.src = C.CRM_URL.replace(/\/$/, "") + "/widget.js";
    s.setAttribute("data-key", C.CRM_KEY);
    s.setAttribute("data-color", "#1d6fa5");
    s.defer = true;
    document.body.appendChild(s);
  }

  // ---- welcome slideshow: scenic clips that cross-fade behind the homepage headline ----
  (function () {
    var box = document.querySelector(".hero-media"); if (!box) return;
    var clips = []; try { clips = JSON.parse(box.getAttribute("data-clips")); } catch (e) { return; }
    var root = box.getAttribute("data-root"), vids = box.querySelectorAll(".hv"), cap = box.querySelector(".hc-text");
    var dots = box.querySelector(".hero-dots"), btn = box.querySelector(".hero-pause");
    var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    var i = 0, cur = 0, paused = still, timer = null;
    clips.forEach(function () { dots.appendChild(document.createElement("i")); });
    function mark() {
      [].forEach.call(dots.children, function (d, k) { d.className = k === i ? "on" : ""; });
      cap.style.opacity = 0; setTimeout(function () { cap.textContent = clips[i].c; cap.style.opacity = 1; }, 250);
    }
    function load(v, k) {
      var ver = box.getAttribute("data-ver") ? "?v=" + box.getAttribute("data-ver") : "";
      v.poster = root + clips[k].f + ".jpg" + ver;
      if (!saveData) { v.src = root + clips[k].f + ".mp4" + ver; v.preload = "auto"; v.load(); }
    }
    function show(k) {
      var nextV = vids[1 - cur], curV = vids[cur];
      i = k; load(nextV, k);
      var go = function () {
        nextV.classList.add("on"); curV.classList.remove("on"); cur = 1 - cur; mark();
        if (!saveData && !paused) { var p = nextV.play(); if (p && p.catch) p.catch(function () {}); }
        setTimeout(function () { try { curV.pause(); } catch (e) {} }, 1300);
      };
      if (saveData || nextV.readyState >= 2) go();
      else { var done = false; var once = function () { if (!done) { done = true; go(); } };
        nextV.addEventListener("loadeddata", once, { once: true }); setTimeout(once, 2500); }
    }
    function schedule() { clearTimeout(timer); if (!paused) timer = setTimeout(function () { show((i + 1) % clips.length); schedule(); }, 6800); }
    // first clip
    load(vids[0], 0); mark();
    if (!saveData && !still) { var p0 = vids[0].play(); if (p0 && p0.catch) p0.catch(function () {}); }
    schedule();
    btn.addEventListener("click", function () {
      paused = !paused;
      btn.textContent = paused ? "▶" : "❚❚";
      btn.setAttribute("aria-label", box.getAttribute(paused ? "data-play" : "data-pause"));
      var v = vids[cur];
      if (paused) { try { v.pause(); } catch (e) {} clearTimeout(timer); }
      else { var p = v.play(); if (p && p.catch) p.catch(function () {}); schedule(); }
    });
    if (still) { btn.textContent = "▶"; btn.setAttribute("aria-label", box.getAttribute("data-play")); }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { clearTimeout(timer); try { vids[cur].pause(); } catch (e) {} }
      else if (!paused) { var p = vids[cur].play(); if (p && p.catch) p.catch(function () {}); schedule(); }
    });
  })();
  var y = document.querySelector("[data-year]"); if (y) y.textContent = new Date().getFullYear();
})();
