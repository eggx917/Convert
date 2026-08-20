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
    return `<div class="bucket">
      <p class="bucket-label">${bucket.name}</p>
      <div class="bucket-chips">${items.map(chipHtml).join("")}</div>
    </div>`;
  }).join("");
  els.categoryList.innerHTML = html || `<p class="bucket-empty">No matching units</p>`;
}

function pairChip(p, kind) {
  return `<button type="button" class="chip" data-kind="${kind}" data-cat="${p.cat}" data-from="${escapeAttr(p.from)}" data-to="${escapeAttr(p.to)}">${iconSvg(p.cat)}<span>${shortUnit(p.from)} \u2192 ${shortUnit(p.to)}</span></button>`;
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

async function loadRates() {
  els.rateMeta.textContent = "Fetching live FX\u2026";
  try {
    const res = await fetch("https://api.frankfurter.dev/v1/latest?from=USD");
    if (!res.ok) throw new Error("rate fetch failed");
    const data = await res.json();
    fx = { base: "USD", date: data.date, rates: { USD: 1, ...data.rates } };
    fxReady = true;
    Store.saveFx(fx);
    els.rateMeta.textContent = `FX \u00b7 ECB ${data.date}`;
    convert();
  } catch {
    if (Store.fxCache && Store.fxCache.rates) {
      fx = Store.fxCache;
      fxReady = true;
      els.rateMeta.textContent = `FX \u00b7 ECB ${fx.date} \u00b7 cached`;
      convert();
    } else {
      els.rateMeta.textContent = "FX unavailable \u2014 try again later";
    }
  }
}

async function drawSpark() {
  const from = els.fromUnit.value;
  const to = els.toUnit.value;
  if (from === to) {
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
