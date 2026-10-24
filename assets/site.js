(function () {
  var C = window.CERRAMAR || {};
  var es = document.documentElement.lang === "es";

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
    var s = document.createElement("script");
    s.src = C.CRM_URL.replace(/\/$/, "") + "/widget.js";
    s.setAttribute("data-key", C.CRM_KEY);
    s.setAttribute("data-color", "#1d6fa5");
    s.defer = true;
    document.body.appendChild(s);
  }
  var y = document.querySelector("[data-year]"); if (y) y.textContent = new Date().getFullYear();
})();
