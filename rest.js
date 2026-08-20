function shortUnit(name) {
  const map = {
    kilometer: "km", meter: "m", centimeter: "cm", millimeter: "mm",
    inch: "in", foot: "ft", yard: "yd", mile: "mi",
    kilogram: "kg", gram: "g", pound: "lb", ounce: "oz",
    celsius: "\u00b0C", fahrenheit: "\u00b0F", kelvin: "K",
    milliliter: "ml", liter: "L", "kilometer/hour": "km/h", "mile/hour": "mph",
    megabyte: "MB", gibibyte: "GiB",
  };
  return map[name] || name;
}

function writeHash() {
  if (applying) return;
  const v = els.fromValue.value.trim();
  const next = `#${encodeURIComponent(activeCategory.id)}/${encodeURIComponent(els.fromUnit.value)}/${encodeURIComponent(els.toUnit.value)}/${encodeURIComponent(v)}`;
  if (location.hash !== next) history.replaceState(null, "", next);
}

function readHash() {
  const h = location.hash.replace(/^#/, "");
  if (!h) return null;
  const parts = h.split("/").map((p) => {
    try { return decodeURIComponent(p); } catch { return p; }
  });
  if (parts.length < 3) return null;
  if (!CATEGORIES.some((c) => c.id === parts[0])) return null;
  return { cat: parts[0], from: parts[1], to: parts[2], value: parts[3] };
}

function scheduleLog() {
  if (!userTouched) return;
  clearTimeout(logTimer);
  logTimer = setTimeout(() => {
    const fromVal = parseNumber(els.fromValue.value, els.fromUnit.value, activeCategory);
    const toVal = parseNumber(els.toValue.value, els.toUnit.value, activeCategory);
    if (!Number.isFinite(fromVal) || !Number.isFinite(toVal)) return;
    Store.log({
      cat: activeCategory.id,
      from: els.fromUnit.value,
      to: els.toUnit.value,
      fromVal,
      toVal,
    });
    renderShortcuts();
    if (openBoard) renderBoard();
  }, 900);
}

function convert() {
  const from = els.fromUnit.value;
  const to = els.toUnit.value;
  if (editingSide === "from") {
    const value = parseNumber(els.fromValue.value, from, activeCategory);
    const out = convertValue(value, from, to, activeCategory);
    els.toValue.value = Number.isFinite(out) ? formatNumber(out) : "";
    updateFormula(value, out, from, to);
    renderAlso(value, from, to);
  } else {
    const value = parseNumber(els.toValue.value, to, activeCategory);
    const out = convertValue(value, to, from, activeCategory);
    els.fromValue.value = Number.isFinite(out) ? formatNumber(out) : "";
    updateFormula(out, value, from, to);
    renderAlso(out, from, to);
  }
  Store.rememberPair(activeCategory.id, from, to);
  writeHash();
  updatePin();
  scheduleLog();
  refreshSpark();
}

function updateFormula(fromVal, toVal, fromUnit, toUnit) {
  if (!Number.isFinite(fromVal) || !Number.isFinite(toVal)) {
    els.formula.textContent = "";
    return;
  }
  els.formula.textContent = `${formatDisplay(fromVal)} ${fromUnit} = ${formatDisplay(toVal)} ${toUnit}`;
}

function alsoLead(category, from, to) {
  const names = unitNames(category).filter((n) => n !== from && n !== to);
  const preferred = [];
  const [dFrom, dTo] = DEFAULTS[category.id] || [];
  [dFrom, dTo].forEach((n) => {
    if (n && names.includes(n) && !preferred.includes(n)) preferred.push(n);
  });
  (UNIT_GROUPS[category.id] || []).forEach((g) => {
    g.units.forEach((n) => {
      if (names.includes(n) && !preferred.includes(n)) preferred.push(n);
    });
  });
  names.forEach((n) => {
    if (!preferred.includes(n)) preferred.push(n);
  });
  return preferred;
}

function renderAlso(fromVal, fromUnit, toUnit) {
  const lead = alsoLead(activeCategory, fromUnit, toUnit);
  const shown = alsoExpanded ? lead : lead.slice(0, 6);
  els.alsoList.innerHTML = shown.map((n) => {
    const v = convertValue(fromVal, fromUnit, n, activeCategory);
    return `<button type="button" class="also-item" data-unit="${escapeAttr(n)}"><span class="u">${n}</span><span class="v">${formatDisplay(v)}</span></button>`;
  }).join("");
  const extra = lead.length - 6;
  if (extra > 0 && !alsoExpanded) {
    els.alsoMore.hidden = false;
    els.alsoMore.textContent = `${extra} more`;
  } else if (alsoExpanded && lead.length > 6) {
    els.alsoMore.hidden = false;
    els.alsoMore.textContent = "Show less";
  } else {
    els.alsoMore.hidden = true;
  }
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
  const leftover = names.filter((n) => !grouped.has(n));
  if (leftover.length) parts.push(leftover.map(optionHtml).join(""));
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

function highlightChips() {
  document.querySelectorAll(".chip[data-id]").forEach((btn) => {
    btn.setAttribute("aria-selected", btn.dataset.id === activeCategory.id ? "true" : "false");
  });
}

function updatePin() {
  const on = Store.isPinned(activeCategory.id, els.fromUnit.value, els.toUnit.value);
  els.pinBtn.setAttribute("aria-pressed", on ? "true" : "false");
  els.pinBtn.title = on ? "Unpin pair" : "Pin this pair";
  els.pinBtn.setAttribute("aria-label", els.pinBtn.title);
}

function applyState({ cat, from, to, value, source }) {
  applying = true;
  const category = CATEGORIES.find((c) => c.id === cat) || CATEGORIES[0];
  activeCategory = category;
  editingSide = "from";
  alsoExpanded = false;
  const names = unitNames(category);
  const last = Store.lastPairs[category.id];
  const defaults = DEFAULTS[category.id] || [names[0], names[1] || names[0]];
  const fromU = names.includes(from) ? from : last?.[0] || defaults[0];
  const toU = [to, last?.[1], defaults[1], names.find((n) => n !== fromU)].find((n) => n && names.includes(n) && n !== fromU) || fromU;
  fillUnitSelects(fromU, toU);
  if (value != null && String(value).trim() !== "") els.fromValue.value = String(value);
  else if (!els.fromValue.value.trim()) els.fromValue.value = "1";
  convertingAfterApply();
  els.categoryMeta.textContent = `${category.name} \u00b7 ${names.length} units`;
  localStorage.setItem("convert.category", category.id);
  highlightChips();
  renderShortcuts();
  if (category.custom === "currency") loadRates();
  else {
    els.rateMeta.textContent = "SI-accurate offline math";
    els.spark.hidden = true;
  }
  applying = false;
  writeHash();
  if (source && source !== "init" && source !== "hash") userTouched = true;
  scheduleLog();
}

function convertingAfterApply() {
  const from = els.fromUnit.value;
  const to = els.toUnit.value;
  const value = parseNumber(els.fromValue.value, from, activeCategory);
  const out = convertValue(value, from, to, activeCategory);
  els.toValue.value = Number.isFinite(out) ? formatNumber(out) : "";
  updateFormula(value, out, from, to);
  renderAlso(value, from, to);
  Store.rememberPair(activeCategory.id, from, to);
  updatePin();
  refreshSpark();
}

function refreshSpark() {
  if (activeCategory.custom !== "currency") {
    sparkKey = "";
    els.spark.hidden = true;
    return;
  }
  const key = `${els.fromUnit.value}:${els.toUnit.value}`;
  if (key === sparkKey) return;
  sparkKey = key;
  drawSpark();
}
