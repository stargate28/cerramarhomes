/* Home value calculator: address lookup from county records, then an estimate from the Cerramar CRM. */
(function () {
  var C = window.CERRAMAR || {}, form = document.getElementById("hv-form");
  if (!form) return;
  var api = (C.CRM_URL || "").replace(/\/$/, "") + "/api/widget/" + encodeURIComponent(C.CRM_KEY || "");
  var es = document.documentElement.lang === "es";
  var T = es ? {
    looking: "Calculando su estimado con ventas recientes y registros del condado...",
    need: "Escriba la dirección, su nombre y un teléfono o correo electrónico.",
    phone: "Escriba un teléfono de 10 dígitos.", email: "Revise el correo electrónico.",
    notFound: "No encontramos esa dirección en los registros del condado. Revise la dirección (o elija una de la lista). Un agente también le preparará un análisis gratis.",
    loading: "Estamos actualizando los datos. Un agente le enviará su estimado en breve.",
    failed: "No pudimos calcularlo ahora. Un agente le preparará su análisis gratis y le contactará.",
    offline: "No se pudo conectar. Llame o escriba al " + (C.PHONE || "") + ".",
    conf: { high: "Confianza alta", medium: "Confianza media", low: "Confianza baja" },
    sold: "Vendida", sqft: "pies²", built: "Construida", same: "mismo vecindario"
  } : {
    looking: "Working out your estimate from recent sales and county records...",
    need: "Please enter the address, your name and a phone number or email.",
    phone: "Please enter a 10-digit phone number.", email: "Please check the email address.",
    notFound: "We couldn't find that address in county records. Please check it (or pick one from the list). An agent will still prepare a free analysis for you.",
    loading: "We're refreshing our data right now. An agent will send you your estimate shortly.",
    failed: "We couldn't calculate it right now. An agent will prepare your free analysis and reach out.",
    offline: "We couldn't connect. Please call or text " + (C.PHONE || "") + ".",
    conf: { high: "High confidence", medium: "Medium confidence", low: "Low confidence" },
    sold: "Sold", sqft: "sq ft", built: "Built", same: "same neighborhood"
  };
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var money = function (n) { return "$" + Math.round(n).toLocaleString("en-US"); };
  var esc = function (s) { var d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; };

  // ---- address suggestions while typing ----
  var addr = $("#hv-address"), list = $("#hv-suggest"), timer = null, lastQ = "";
  function hide() { list.hidden = true; list.innerHTML = ""; addr.setAttribute("aria-expanded", "false"); }
  addr.addEventListener("input", function () {
    clearTimeout(timer);
    var q = addr.value.trim();
    if (q.length < 5 || !C.CRM_URL) { hide(); return; }
    timer = setTimeout(function () {
      lastQ = q;
      fetch(api + "/value/suggest?q=" + encodeURIComponent(q)).then(function (r) { return r.json(); }).then(function (d) {
        if (q !== lastQ) return;
        var rs = (d && d.results) || [];
        if (!rs.length) { hide(); return; }
        list.innerHTML = rs.map(function (x, i) {
          return '<li role="option" id="hv-opt-' + i + '" tabindex="-1" data-a="' + esc(x.address) + '">' + esc(x.address) +
            (x.type ? ' <span>' + esc(x.type) + "</span>" : "") + "</li>";
        }).join("");
        list.hidden = false; addr.setAttribute("aria-expanded", "true");
      }).catch(hide);
    }, 250);
  });
  list.addEventListener("mousedown", function (e) {
    var li = e.target.closest("li"); if (!li) return;
    e.preventDefault(); addr.value = li.getAttribute("data-a"); hide();
  });
  addr.addEventListener("keydown", function (e) {
    var items = list.querySelectorAll("li"); if (list.hidden || !items.length) return;
    var cur = list.querySelector("li.on"), i = Array.prototype.indexOf.call(items, cur);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault(); if (cur) cur.classList.remove("on");
      i = e.key === "ArrowDown" ? Math.min(items.length - 1, i + 1) : Math.max(0, i - 1);
      items[i].classList.add("on"); addr.setAttribute("aria-activedescendant", items[i].id);
    } else if (e.key === "Enter" && cur) { e.preventDefault(); addr.value = cur.getAttribute("data-a"); hide(); }
    else if (e.key === "Escape") hide();
  });
  addr.addEventListener("blur", function () { setTimeout(hide, 150); });

  // ---- estimate ----
  var msg = $("#hv-msg"), out = $("#hv-result"), btn = form.querySelector("button[type=submit]");
  function say(t, bad) { msg.hidden = !t; msg.textContent = t || ""; msg.className = "form-msg" + (bad ? " err" : ""); }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = new FormData(form), d = {};
    f.forEach(function (v, k) { d[k] = typeof v === "string" ? v.trim() : v; });
    var digits = (d.phone || "").replace(/\D/g, "");
    if (!d.address || !d.name || (!digits && !d.email)) { say(T.need, true); return; }
    if (digits && !(digits.length === 10 || (digits.length === 11 && digits[0] === "1"))) { say(T.phone, true); return; }
    if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) { say(T.email, true); return; }
    d.consent = !!d.consent; d.language = es ? "Spanish" : "English";
    if (!C.CRM_URL) { say(T.offline, true); return; }
    btn.disabled = true; say(T.looking); out.hidden = true;
    fetch(api + "/value", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (x) {
        btn.disabled = false;
        if (!x.ok) { say((x.j && x.j.detail) || T.failed, true); return; }
        var j = x.j;
        if (j.error) { say(j.error === "not_found" ? T.notFound : j.error === "loading" ? T.loading : T.failed, j.error === "not_found"); return; }
        say(""); show(j, d.address);
      })
      .catch(function () { btn.disabled = false; say(T.offline, true); });
  });

  function show(j, address) {
    var p = j.property || {}, facts = [];
    if (p.type) facts.push(p.type === "house" ? (es ? "Casa" : "House") : p.type === "condo" ? (es ? "Condominio" : "Condo") : p.type);
    if (p.sqft) facts.push(p.sqft.toLocaleString("en-US") + " " + T.sqft);
    if (p.year_built) facts.push(T.built + " " + p.year_built);
    if (p.lot_sqft) facts.push((es ? "Terreno " : "Lot ") + p.lot_sqft.toLocaleString("en-US") + " " + T.sqft);
    if (p.county) facts.push((es ? "Condado de " : "") + p.county + (es ? "" : " County"));
    var z = (j.market || {}).zillow, rf = (j.market || {}).redfin, market = "";
    if (z && z.change_12m != null) market += "<li>" + (es ? "Valor típico en el código postal " : "Typical home value in ZIP ") + esc(p.zip || "") + ": <b>" +
      money(z.typical_value) + "</b> (" + (z.change_12m > 0 ? "+" : "") + z.change_12m + "% " + (es ? "en 12 meses" : "over 12 months") + ")</li>";
    if (rf && rf.median_sale_price) market += "<li>" + (es ? "Precio mediano de venta reciente" : "Recent median sale price") + ": <b>" + money(rf.median_sale_price) + "</b>" +
      (rf.median_dom != null ? " · " + rf.median_dom + (es ? " días en el mercado" : " days on market") : "") + "</li>";
    var comps = (j.comparables || []).map(function (c) {
      return "<tr><td>" + esc(c.address) + (c.same_neighborhood ? ' <span class="tag">' + T.same + "</span>" : "") + "</td><td>" + esc(c.sold) +
        "</td><td>" + money(c.price) + "</td><td>" + (c.sqft ? c.sqft.toLocaleString("en-US") : "") + "</td><td>" + (c.year_built || "") + "</td></tr>";
    }).join("");
    out.innerHTML =
      '<p class="hv-label">' + (es ? "Valor estimado para" : "Estimated value for") + " " + esc(j.address || address) + "</p>" +
      '<p class="hv-value">' + money(j.value) + "</p>" +
      '<p class="hv-range">' + (es ? "Rango probable" : "Likely range") + ": <b>" + money(j.low) + " – " + money(j.high) + "</b>" +
      ' <span class="hv-conf hv-' + esc(j.confidence) + '">' + esc(T.conf[j.confidence] || j.confidence) + "</span></p>" +
      (facts.length ? '<p class="hv-facts">' + esc(facts.join(" · ")) + "</p>" : "") +
      (market ? '<ul class="hv-market">' + market + "</ul>" : "") +
      (comps ? "<h3>" + (es ? "Ventas comparables cercanas" : "Comparable sales nearby") + '</h3><div class="hv-table"><table><thead><tr><th>' +
        (es ? "Dirección" : "Address") + "</th><th>" + T.sold + "</th><th>" + (es ? "Precio" : "Price") + "</th><th>" + T.sqft + "</th><th>" +
        (es ? "Año" : "Built") + "</th></tr></thead><tbody>" + comps + "</tbody></table></div>" : "") +
      '<div class="hv-next"><b>' + (es ? "¿Quiere un número más preciso?" : "Want a more precise number?") + "</b> " +
      (es ? "Magda Cerra, nuestra corredora, revisará su casa en persona (mejoras, condición, vista) y le enviará un análisis comparativo de mercado gratis. Ya recibió su solicitud."
          : "Our broker, Magda Cerra, will look at what a computer can't see (upgrades, condition, view) and send you a free comparative market analysis. She already has your request.") +
      ' <a href="tel:' + esc((C.PHONE || "").replace(/\D/g, "")) + '">' + esc(C.PHONE || "") + "</a></div>" +
      '<p class="hv-fine">' + (es
        ? "Estimado automático basado en ventas registradas y datos del tasador del condado (Departamento de Ingresos de la Florida), con tendencias de mercado de Zillow Research y Redfin. No es una tasación ni una opinión de precio de un corredor."
        : "Automated estimate from recorded sales and county property appraiser data (Florida Department of Revenue), with market trends from Zillow Research and Redfin Data Center. It is not an appraisal or a broker price opinion.") +
      "</p>";
    out.hidden = false;
    out.scrollIntoView({ behavior: "smooth", block: "start" });
  }
})();
