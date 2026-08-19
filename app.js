const els = {
  categoryList: document.getElementById("categoryList"),
  fromValue: document.getElementById("fromValue"),
  toValue: document.getElementById("toValue"),
  fromUnit: document.getElementById("fromUnit"),
  toUnit: document.getElementById("toUnit"),
  formula: document.getElementById("formula"),
  categoryMeta: document.getElementById("categoryMeta"),
  rateMeta: document.getElementById("rateMeta"),
  swapBtn: document.getElementById("swapBtn"),
  copyBtn: document.getElementById("copyBtn"),
  alsoList: document.getElementById("alsoList"),
  search: document.getElementById("search"),
  themeBtn: document.getElementById("themeBtn"),
};

let activeCategory = CATEGORIES[0];
let editingSide = "from";
let fx = { base: "USD", date: "", rates: { USD: 1 } };
let fxReady = false;

function unitNames(category) {
  return Object.keys(category.units);
}

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function parseNumber(raw) {
  const cleaned = String(raw ?? "").trim().replace(/,/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === "." || cleaned === "-.") return NaN;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

function formatNumber(n) {
  if (!Number.isFinite(n)) return "—";
  if (Object.is(n, -0)) n = 0;
  const abs = Math.abs(n);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return n.toExponential(6).replace(/\.?0+e/, "e").replace(/e\+/, "e");
  }
  let s = n.toPrecision(12);
  if (/[eE]/.test(s)) return Number(s).toString();
  if (s.includes(".")) s = s.replace(/\.?0+$/, "");
  return s;
}

function celsiusFrom(value, unit) {
  if (unit === "celsius") return value;
  if (unit === "fahrenheit") return ((value - 32) * 5) / 9;
  if (unit === "kelvin") return value - 273.15;
  if (unit === "rankine") return ((value - 491.67) * 5) / 9;
  return NaN;
}

function celsiusTo(celsius, unit) {
  if (unit === "celsius") return celsius;
  if (unit === "fahrenheit") return (celsius * 9) / 5 + 32;
  if (unit === "kelvin") return celsius + 273.15;
  if (unit === "rankine") return ((celsius + 273.15) * 9) / 5;
  return NaN;
}

function fuelToKmPerL(value, unit) {
  if (unit === "km/L") return value;
  if (unit === "L/100km") return value === 0 ? NaN : 100 / value;
  if (unit === "mpg") return value * 0.425143707;
  if (unit === "mpg (UK)") return value * 0.35400619;
  return NaN;
}

function fuelFromKmPerL(kmPerL, unit) {
  if (unit === "km/L") return kmPerL;
  if (unit === "L/100km") return kmPerL === 0 ? NaN : 100 / kmPerL;
  if (unit === "mpg") return kmPerL / 0.425143707;
  if (unit === "mpg (UK)") return kmPerL / 0.35400619;
  return NaN;
}

function toUsd(value, unit) {
  if (unit === "USD") return value;
  const rate = fx.rates[unit];
  return rate ? value / rate : NaN;
}

function fromUsd(usd, unit) {
  if (unit === "USD") return usd;
  const rate = fx.rates[unit];
  return rate ? usd * rate : NaN;
}

function convertValue(value, from, to, category) {
  if (!Number.isFinite(value)) return NaN;
  if (from === to) return value;
  if (category.custom === "temperature") return celsiusTo(celsiusFrom(value, from), to);
  if (category.custom === "fuel") return fuelFromKmPerL(fuelToKmPerL(value, from), to);
  if (category.custom === "currency") return fromUsd(toUsd(value, from), to);
  const fromF = category.units[from];
  const toF = category.units[to];
  if (fromF == null || toF == null || toF === 0) return NaN;
  return (value * fromF) / toF;
}

function convert() {
  const from = els.fromUnit.value;
  const to = els.toUnit.value;
  if (editingSide === "from") {
    const value = parseNumber(els.fromValue.value);
    const out = convertValue(value, from, to, activeCategory);
    els.toValue.value = Number.isFinite(out) ? formatNumber(out) : "";
    updateFormula(value, out, from, to);
    renderAlso(value, from);
  } else {
    const value = parseNumber(els.toValue.value);
    const out = convertValue(value, to, from, activeCategory);
    els.fromValue.value = Number.isFinite(out) ? formatNumber(out) : "";
    updateFormula(out, value, from, to);
    renderAlso(out, from);
  }
}

function updateFormula(fromVal, toVal, fromUnit, toUnit) {
  if (!Number.isFinite(fromVal) || !Number.isFinite(toVal)) {
    els.formula.textContent = "";
    return;
  }
  els.formula.textContent = `${formatNumber(fromVal)} ${fromUnit} = ${formatNumber(toVal)} ${toUnit}`;
}

function renderAlso(fromVal, fromUnit) {
  const names = unitNames(activeCategory).filter((n) => n !== fromUnit && n !== els.toUnit.value);
  els.alsoList.innerHTML = names
    .map((n) => {
      const v = convertValue(fromVal, fromUnit, n, activeCategory);
      return `<button type="button" class="also-item" data-unit="${escapeAttr(n)}"><span class="u">${n}</span><span class="v">${formatNumber(v)}</span></button>`;
    })
    .join("");
}

function optionHtml(n) {
  return `<option value="${escapeAttr(n)}">${n}</option>`;
}

function unitSelectHtml(category) {
  const names = unitNames(category);
  const groups = UNIT_GROUPS[category.id];
  if (!groups) return names.map(optionHtml).join("");
  const grouped = new Set();
  const parts = groups.map((g) => {
    const items = g.units.filter((n) => names.includes(n));
    items.forEach((n) => grouped.add(n));
    if (!items.length) return "";
    return `<optgroup label="${escapeAttr(g.label)}">${items.map(optionHtml).join("")}</optgroup>`;
  });
  const rest = names.filter((n) => !grouped.has(n));
  if (rest.length) parts.push(rest.map(optionHtml).join(""));
  return parts.join("");
}

function fillUnitSelects(preferFrom, preferTo) {
  const names = unitNames(activeCategory);
  const options = unitSelectHtml(activeCategory);
  els.fromUnit.innerHTML = options;
  els.toUnit.innerHTML = options;
  els.fromUnit.value = names.includes(preferFrom) ? preferFrom : names[0];
  const defaultTo =
    preferTo && preferTo !== els.fromUnit.value && names.includes(preferTo)
      ? preferTo
      : names.find((n) => n !== els.fromUnit.value) || names[0];
  els.toUnit.value = defaultTo;
}

function setCategory(id) {
  const cat = CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
  activeCategory = cat;
  editingSide = "from";
  document.querySelectorAll(".chip").forEach((btn) => {
    btn.setAttribute("aria-selected", btn.dataset.id === cat.id ? "true" : "false");
  });
  const names = unitNames(cat);
  const [dFrom, dTo] = DEFAULTS[cat.id] || [names[0], names[1] || names[0]];
  fillUnitSelects(dFrom, dTo);
  if (!els.fromValue.value.trim()) els.fromValue.value = "1";
  convert();
  els.categoryMeta.textContent = `${cat.name} · ${names.length} units`;
  localStorage.setItem("convert.category", cat.id);
  if (cat.custom === "currency") loadRates();
  else els.rateMeta.textContent = "SI-accurate offline math";
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
    return `<div class="bucket">
      <p class="bucket-label">${bucket.name}</p>
      <div class="bucket-chips">${items.map(chipHtml).join("")}</div>
    </div>`;
  }).join("");
  els.categoryList.innerHTML = html || `<p class="bucket-empty">No matching units</p>`;
}

function swapUnits() {
  const a = els.fromUnit.value;
  const b = els.toUnit.value;
  els.fromUnit.value = b;
  els.toUnit.value = a;
  if (editingSide === "from" && els.toValue.value) els.fromValue.value = els.toValue.value;
  else if (els.fromValue.value) els.toValue.value = els.fromValue.value;
  convert();
}

async function loadRates() {
  els.rateMeta.textContent = "Fetching live FX…";
  try {
    const res = await fetch("https://api.frankfurter.dev/v1/latest?from=USD");
    if (!res.ok) throw new Error("rate fetch failed");
    const data = await res.json();
    fx = { base: "USD", date: data.date, rates: { USD: 1, ...data.rates } };
    fxReady = true;
    els.rateMeta.textContent = `FX · ECB ${data.date}`;
    convert();
  } catch {
    els.rateMeta.textContent = "FX unavailable — try again later";
  }
}

function applyTheme(theme) {
  const next = theme || localStorage.getItem("convert.theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", next);
  document.querySelector('meta[name="theme-color"]').setAttribute("content", next === "dark" ? "#12110f" : "#f3efe6");
  localStorage.setItem("convert.theme", next);
}

els.categoryList.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (btn) setCategory(btn.dataset.id);
});

els.alsoList.addEventListener("click", (e) => {
  const item = e.target.closest(".also-item");
  if (!item) return;
  els.toUnit.value = item.dataset.unit;
  convert();
});

els.fromValue.addEventListener("input", () => {
  editingSide = "from";
  convert();
});
els.toValue.addEventListener("input", () => {
  editingSide = "to";
  convert();
});
els.fromUnit.addEventListener("change", convert);
els.toUnit.addEventListener("change", convert);
els.swapBtn.addEventListener("click", swapUnits);
els.search.addEventListener("input", () => renderCategories(els.search.value));
els.themeBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(current);
});
els.copyBtn.addEventListener("click", async () => {
  const text = els.toValue.value;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    els.copyBtn.classList.add("copied");
    setTimeout(() => els.copyBtn.classList.remove("copied"), 900);
  } catch {}
});

applyTheme();
renderCategories();
setCategory(localStorage.getItem("convert.category") || "length");
