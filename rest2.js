function setCategory(id) {
  userTouched = true;
  applyState({ cat: id, source: "chip" });
}

function chipHtml(c) {
  return `<button type="button" class="chip" role="tab" data-id="${c.id}" aria-selected="${
    c.id === activeCategory.id ? "true" : "false"
  }">${iconSvg(c.id)}<span>${c.name}</span></button>`;
}

function renderCategories(filter = "") {
  const q = filter.trim().toLowerCase();
  const match = (c) => !q || c.name.toLowerCase().includes(q) || c.id.includes(q);
  const byId = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
  const html = BUCKETS.map((bucket) => {
    const items = bucket.ids.map((id) => byId[id]).filter((c) => c && match(c));
    if (!items.length) return "";
    return `<div class="bucket">\n      <p class="bucket-label">${bucket.name}</p>\n      <div class="bucket-chips">${items.map(chipHtml).join("")}</div>\n    </div>`;
  }).join("");
  els.categoryList.innerHTML = html || `<p class="bucket-empty">No matching units</p>`;
}

function pairChip(p, kind) {
  const current = p.cat === activeCategory.id && p.from === els.fromUnit.value && p.to === els.toUnit.value;
  const cls = current ? "chip rail-chip is-current" : "chip rail-chip";
  return `<button type="button" class="${cls}" data-kind="${kind}" data-cat="${p.cat}" data-from="${escapeAttr(p.from)}" data-to="${escapeAttr(p.to)}" aria-current="${current ? "true" : "false"}">${iconSvg(p.cat)}<span>${shortUnit(p.from)} \u2192 ${shortUnit(p.to)}</span></button>`;
}

function highlightRail() {
  const cat = activeCategory.id;
  const from = els.fromUnit.value;
  const to = els.toUnit.value;
  els.shortcutRow.querySelectorAll(".rail-chip").forEach((btn) => {
    const on = btn.dataset.cat === cat && btn.dataset.from === from && btn.dataset.to === to;
    btn.classList.toggle("is-current", on);
    btn.setAttribute("aria-current", on ? "true" : "false");
  });
}

function renderShortcuts() {
  const pins = Store.pins;
  const freq = Store.frequent(5);
  if (!pins.length && !freq.length) {
    els.shortcutRow.hidden = true;
    els.shortcutRow.innerHTML = "";
    return;
  }
  let html = "";
  if (pins.length) {
    html += `<div class="bucket"><p class="bucket-label">Pinned</p><div class="bucket-chips">${pins.map((p) => pairChip(p, "pin")).join("")}</div></div>`;
  }
  if (freq.length) {
    html += `<div class="bucket"><p class="bucket-label">Frequent</p><div class="bucket-chips">${freq.map((p) => pairChip(p, "freq")).join("")}</div></div>`;
  }
  els.shortcutRow.innerHTML = html;
  els.shortcutRow.hidden = false;
}

function swapUnits() {
  userTouched = true;
  const a = els.fromUnit.value;
  const b = els.toUnit.value;
  els.fromUnit.value = b;
  els.toUnit.value = a;
  if (editingSide === "from" && els.toValue.value) els.fromValue.value = els.toValue.value;
  else if (els.fromValue.value) els.toValue.value = els.fromValue.value;
  convert();
}

const FX_MAX_AGE = 60 * 60 * 1000;
const FX_SOFT_AGE = 5 * 60 * 1000;
const FX_URL = "https://api.coinbase.com/v2/exchange-rates?currency=USD";
const FRANKFURTER_CODES = new Set([
  "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR", "KRW", "MXN", "BRL",
  "SEK", "NOK", "DKK", "SGD", "HKD", "NZD", "ZAR", "TRY", "PLN",
]);
let fxTimer = null;
let fxFetching = false;

function fxAgeMs() {
  return Date.now() - (fx.fetchedAt || 0);
}

function formatFxAge() {
  if (!fx.fetchedAt) return "cached";
  const m = Math.max(0, Math.round(fxAgeMs() / 60000));
  if (m < 1) return "just now";
  if (m === 1) return "1 min ago";
  if (m < 60) return m + " min ago";
  const h = Math.round(m / 60);
  return h === 1 ? "1h ago" : h + "h ago";
}

function fxMetaLine(extra) {
  const stale = fx.fetchedAt && fxAgeMs() > FX_MAX_AGE;
  const bits = ["FX", "Coinbase", formatFxAge()];
  if (stale) bits.push("refreshing");
  if (extra) bits.push(extra);
  els.rateMeta.textContent = bits.join(" \u00b7 ");
}

function currencyAllowlist() {
  return (UNIT_GROUPS.currency || []).flatMap((g) => g.units);
}

function applyMarketRates(raw, fetchedAt) {
  const allow = new Set(currencyAllowlist());
  const rates = { USD: 1 };
  allow.forEach((code) => {
    const n = Number(raw[code]);
    if (Number.isFinite(n) && n > 0) rates[code] = n;
  });
  if (rates.TWD) rates.NTD = rates.TWD;
  fx = { base: "USD", fetchedAt: fetchedAt || Date.now(), source: "Coinbase", rates };
  fxReady = true;
  Store.saveFx(fx);
  const cat = CATEGORIES.find((c) => c.id === "currency");
  if (cat) {
    cat.units = {};
    Object.keys(rates).forEach((code) => { cat.units[code] = null; });
  }
  if (activeCategory.id === "currency") {
    fillUnitSelects(els.fromUnit.value, els.toUnit.value);
    els.categoryMeta.textContent = "Currency \u00b7 " + Object.keys(rates).length + " units";
  }
}

function startFxClock() {
  clearInterval(fxTimer);
  fxTimer = setInterval(() => {
    if (activeCategory.custom === "currency") loadRates();
    else clearInterval(fxTimer);
  }, FX_SOFT_AGE);
}

async function fetchMarketRates() {
  if (fxFetching) return false;
  fxFetching = true;
  try {
    const res = await fetch(FX_URL);
    if (!res.ok) throw new Error("rate fetch failed");
    const data = await res.json();
    const raw = (data.data && data.data.rates) || {};
    applyMarketRates(raw, Date.now());
    fxMetaLine();
    convert();
    return true;
  } catch {
    return false;
  } finally {
    fxFetching = false;
  }
}

async function loadRates() {
  startFxClock();
  if (!fxReady && Store.fxCache && Store.fxCache.rates) {
    applyMarketRates(Store.fxCache.rates, Store.fxCache.fetchedAt || 0);
    convert();
  }
  const age = fx.fetchedAt ? fxAgeMs() : Infinity;
  if (fxReady && age < FX_MAX_AGE) {
    fxMetaLine();
    if (age >= FX_SOFT_AGE) fetchMarketRates();
    return;
  }
  els.rateMeta.textContent = "Fetching live FX\u2026";
  const ok = await fetchMarketRates();
  if (ok) return;
  if (fxReady && fx.rates) {
    fxMetaLine("offline");
    convert();
  } else {
    els.rateMeta.textContent = "FX unavailable \u2014 try again later";
  }
}

async function drawSpark() {
  const from = els.fromUnit.value;
  const to = els.toUnit.value;
  if (from === to || !FRANKFURTER_CODES.has(from) || !FRANKFURTER_CODES.has(to)) {
    els.spark.hidden = true;
    return;
  }
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 30);
  const iso = (d) => d.toISOString().slice(0, 10);
  try {
    const res = await fetch(`https://api.frankfurter.dev/v1/${iso(start)}..${iso(end)}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    if (!res.ok) throw new Error("spark");
    const data = await res.json();
    const points = Object.keys(data.rates).sort().map((day) => data.rates[day][to]).filter((n) => Number.isFinite(n));
    if (points.length < 2) {
      els.spark.hidden = true;
      return;
    }
    const min = Math.min(...points);
    const max = Math.max(...points);
    const span = max - min || 1;
    const w = 220;
    const h = 28;
    const path = points.map((y, i) => {
      const x = (i / (points.length - 1)) * w;
      const py = h - 3 - ((y - min) / span) * (h - 6);
      return `${i ? "L" : "M"}${x.toFixed(1)} ${py.toFixed(1)}`;
    }).join(" ");
    const last = points[points.length - 1];
    const first = points[0];
    const delta = ((last - first) / first) * 100;
    const deltaLabel = `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}% \u00b7 30d`;
    els.spark.innerHTML = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" aria-hidden="true"><path d="${path}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${deltaLabel}</span>`;
    els.spark.hidden = false;
  } catch {
    els.spark.hidden = true;
  }
}

function applyTheme(theme) {
  const next = theme || localStorage.getItem("convert.theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", next);
  document.querySelector('meta[name="theme-color"]').setAttribute("content", next === "dark" ? "#12110f" : "#f3efe6");
  localStorage.setItem("convert.theme", next);
}

function showHint(parsed) {
  if (!parsed || (!parsed.from && !parsed.to && parsed.value == null)) {
    els.searchHint.hidden = true;
    return;
  }
  els.searchHint.hidden = false;
  els.searchHint.textContent = `${parsed.label}  \u21b5`;
}

function runCommand(raw) {
  const parsed = parseCommand(raw, activeCategory.id);
  if (!parsed) return false;
  userTouched = true;
  applyState({
    cat: parsed.cat,
    from: parsed.from,
    to: parsed.to,
    value: parsed.value,
    source: "command",
  });
  els.search.value = "";
  els.searchHint.hidden = true;
  renderCategories("");
  return true;
}
