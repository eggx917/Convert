const UNIT_ALIASES = {
  km: ["length", "kilometer"], kilometer: ["length", "kilometer"], kilometres: ["length", "kilometer"],
  kilometers: ["length", "kilometer"], kilometre: ["length", "kilometer"],
  m: ["length", "meter"], meter: ["length", "meter"], meters: ["length", "meter"],
  metre: ["length", "meter"], metres: ["length", "meter"],
  cm: ["length", "centimeter"], centimeter: ["length", "centimeter"], centimetre: ["length", "centimeter"],
  millimeters: ["length", "millimeter"], millimetre: ["length", "millimeter"], mm: ["length", "millimeter"],
  nm: ["length", "nanometer"], um: ["length", "micrometer"], µm: ["length", "micrometer"],
  in: ["length", "inch"], inch: ["length", "inch"], inches: ["length", "inch"],
  ft: ["length", "foot"], foot: ["length", "foot"], feet: ["length", "foot"],
  yd: ["length", "yard"], yard: ["length", "yard"], yards: ["length", "yard"],
  mi: ["length", "mile"], mile: ["length", "mile"], miles: ["length", "mile"],
  nmi: ["length", "nautical mile"], ly: ["length", "lightyear"],

  kg: ["weight", "kilogram"], kilo: ["weight", "kilogram"], kilos: ["weight", "kilogram"],
  g: ["weight", "gram"], gram: ["weight", "gram"], grams: ["weight", "gram"],
  mg: ["weight", "milligram"], mcg: ["weight", "microgram"],
  lb: ["weight", "pound"], lbs: ["weight", "pound"], oz: ["weight", "ounce"],
  tonne: ["weight", "tonne"], tonnes: ["weight", "tonne"],

  c: ["temperature", "celsius"], f: ["temperature", "fahrenheit"], k: ["temperature", "kelvin"],
  celsius: ["temperature", "celsius"], celcius: ["temperature", "celsius"], centigrade: ["temperature", "celsius"],
  fahrenheit: ["temperature", "fahrenheit"], kelvin: ["temperature", "kelvin"],

  ml: ["volume", "milliliter"], millilitre: ["volume", "milliliter"],
  l: ["volume", "liter"], litre: ["volume", "liter"], litres: ["volume", "liter"], liters: ["volume", "liter"],
  tsp: ["cooking", "teaspoon"], tbsp: ["cooking", "tablespoon"],
  cup: ["cooking", "cup"], cups: ["cooking", "cup"],
  gal: ["volume", "gallon"], gallon: ["volume", "gallon"],

  kph: ["speed", "kilometer/hour"], kmh: ["speed", "kilometer/hour"], "km/h": ["speed", "kilometer/hour"],
  mph: ["speed", "mile/hour"], "m/s": ["speed", "meter/second"], mps: ["speed", "meter/second"],
  fps: ["speed", "foot/second"],

  sec: ["time", "second"], seconds: ["time", "second"], min: ["time", "minute"], minutes: ["time", "minute"],
  hr: ["time", "hour"], hrs: ["time", "hour"], hours: ["time", "hour"],
  days: ["time", "day"], weeks: ["time", "week"], years: ["time", "year"],

  kb: ["data", "kilobyte"], mb: ["data", "megabyte"], gb: ["data", "gigabyte"], tb: ["data", "terabyte"],
  kib: ["data", "kibibyte"], mib: ["data", "mebibyte"], gib: ["data", "gibibyte"],

  wh: ["energy", "watt hour"], kwh: ["energy", "kilowatt hour"], cal: ["energy", "calorie"],
  kcal: ["energy", "kilocalorie"], btu: ["energy", "British thermal unit"],
  hp: ["power", "horsepower"], w: ["power", "watt"], kw: ["power", "kilowatt"],
  pa: ["pressure", "pascal"], kpa: ["pressure", "kilopascal"], atm: ["pressure", "atmosphere"],
  hz: ["frequency", "hertz"], rpm: ["frequency", "rpm"], n: ["force", "newton"],
  deg: ["angle", "degree"], degrees: ["angle", "degree"], rad: ["angle", "radian"],

  usd: ["currency", "USD"], eur: ["currency", "EUR"], gbp: ["currency", "GBP"],
  jpy: ["currency", "JPY"], cad: ["currency", "CAD"], aud: ["currency", "AUD"],
  chf: ["currency", "CHF"], cny: ["currency", "CNY"], inr: ["currency", "INR"],
  krw: ["currency", "KRW"], mxn: ["currency", "MXN"], brl: ["currency", "BRL"],
  dollar: ["currency", "USD"], dollars: ["currency", "USD"], euro: ["currency", "EUR"],
  euros: ["currency", "EUR"], yen: ["currency", "JPY"], yuan: ["currency", "CNY"],
  rupee: ["currency", "INR"], won: ["currency", "KRW"],
};

function normalizeUnit(s) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[._]/g, " ")
    .replace(/\s+/g, " ");
}

let unitIndex = null;

function getUnitIndex() {
  if (unitIndex) return unitIndex;
  const rows = [];
  for (const cat of CATEGORIES) {
    for (const unit of Object.keys(cat.units)) {
      const keys = new Set();
      const add = (k) => {
        const n = normalizeUnit(k);
        if (n) keys.add(n);
        if (n) keys.add(n.replace(/\s+/g, ""));
      };
      add(unit);
      add(unit.replace(/s\b/g, ""));
      rows.push({ cat: cat.id, unit, keys });
    }
  }
  for (const [alias, pair] of Object.entries(UNIT_ALIASES)) {
    const n = normalizeUnit(alias);
    const compact = n.replace(/\s+/g, "");
    for (const row of rows) {
      if (row.unit === pair[1] || (row.cat === pair[0] && row.unit === pair[1])) {
        row.keys.add(n);
        row.keys.add(compact);
      }
    }
  }
  unitIndex = rows;
  return rows;
}

function lookupUnit(phrase, preferCat) {
  const n = normalizeUnit(phrase);
  if (!n) return [];
  const compact = n.replace(/\s+/g, "");
  const rows = getUnitIndex();
  const exact = rows.filter((r) => r.keys.has(n) || r.keys.has(compact));
  if (exact.length) {
    if (preferCat) {
      const preferred = exact.filter((r) => r.cat === preferCat);
      if (preferred.length) return preferred;
    }
    return exact;
  }
  if (n.length < 2) return [];
  const prefix = rows.filter((r) => [...r.keys].some((k) => k.startsWith(n) || n.startsWith(k) && k.length >= 2));
  return prefix;
}

function parseFraction(s) {
  const m = String(s).trim().match(/^(-?)(?:(\d+)\s+)?(\d+)\s*\/\s*(\d+)$/);
  if (!m) return null;
  const sign = m[1] === "-" ? -1 : 1;
  const whole = m[2] ? Number(m[2]) : 0;
  const den = Number(m[4]);
  if (!den) return null;
  return sign * (whole + Number(m[3]) / den);
}

function parseFeetInches(s) {
  const m = String(s).trim().match(/^(\d+)\s*(?:'|\u2032|ft|feet|foot)\s*(\d+(?:\.\d+)?)\s*(?:"|\u2033|in|inch|inches)?$/i);
  if (!m) return null;
  return Number(m[1]) * 12 + Number(m[2]);
}

function parseLooseNumber(raw) {
  let t = String(raw ?? "").trim();
  if (t === "" || t === "-" || t === "." || t === "-.") return NaN;
  const frac = parseFraction(t);
  if (frac != null) return frac;
  const comma = t.lastIndexOf(",");
  const dot = t.lastIndexOf(".");
  if (comma !== -1 && dot !== -1) {
    t = comma > dot ? t.replace(/\./g, "").replace(",", ".") : t.replace(/,/g, "");
  } else if (comma !== -1) {
    const parts = t.split(",");
    t = parts.length === 2 && parts[1].length <= 4 ? t.replace(",", ".") : t.replace(/,/g, "");
  }
  const n = Number(t);
  return Number.isFinite(n) ? n : NaN;
}

function parseNumber(raw, unit, category) {
  const inches = parseFeetInches(raw);
  if (inches != null && category && category.id === "length") {
    if (!unit || unit === "inch") return inches;
    const inchF = category.units.inch;
    const unitF = category.units[unit];
    if (inchF && unitF) return (inches * inchF) / unitF;
  }
  return parseLooseNumber(raw);
}

function formatDisplay(n) {
  if (!Number.isFinite(n)) return "\u2014";
  if (Object.is(n, -0)) n = 0;
  const abs = Math.abs(n);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return n.toExponential(6).replace(/\.?0+e/, "e").replace(/e\+/, "e");
  }
  try {
    return n.toLocaleString(undefined, { maximumFractionDigits: 8 });
  } catch {
    return String(n);
  }
}

function pickPair(fromHits, toHits, activeId) {
  if (!fromHits.length && !toHits.length) return null;
  const fromCats = new Set(fromHits.map((h) => h.cat));
  const toCats = new Set(toHits.map((h) => h.cat));
  let cat = null;
  if (fromHits.length && toHits.length) {
    const both = [...fromCats].filter((c) => toCats.has(c));
    cat = both.includes(activeId) ? activeId : both[0] || null;
  } else {
    const cats = fromHits.length ? [...fromCats] : [...toCats];
    cat = cats.includes(activeId) ? activeId : cats[0];
  }
  if (!cat) return null;
  const from = fromHits.find((h) => h.cat === cat);
  const to = toHits.find((h) => h.cat === cat);
  return { cat, from: from && from.unit, to: to && to.unit };
}

function extractLeadingNumber(s) {
  const t = String(s || "").trim();
  const ft = t.match(/^(\d+\s*(?:'|\u2032|ft|feet|foot)\s*\d+(?:\.\d+)?\s*(?:"|\u2033|in|inch|inches)?)(?:\s+(.*))?$/i);
  if (ft) return { raw: ft[1], rest: (ft[2] || "").trim(), value: parseFeetInches(ft[1]) };
  const mixed = t.match(/^(-?(?:\d+\s+)?\d+\s*\/\s*\d+)(?:\s+(.*))?$/);
  if (mixed && parseFraction(mixed[1]) != null) {
    return { raw: mixed[1], rest: (mixed[2] || "").trim(), value: parseFraction(mixed[1]) };
  }
  const num = t.match(/^(-?(?:\d[\d,]*(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?)(?:\s+(.*))?$/);
  if (num) return { raw: num[1], rest: (num[2] || "").trim(), value: parseLooseNumber(num[1]) };
  return { raw: "", rest: t, value: null };
}

function parseCommand(raw, activeId) {
  let q = String(raw || "").trim();
  if (!q) return null;

  let impliedUsd = false;
  if (q[0] === "$") {
    impliedUsd = true;
    q = q.replace(/^\$\s*/, "");
  }

  const conn = q.match(/^(.*?)\s+(?:to|into|=|\u2192|->)\s+(.+)$/i) || q.match(/^(.*?)\s+in\s+(.+)$/i);
  if (conn) {
    const extracted = extractLeadingNumber(conn[1]);
    const fromPhrase = extracted.rest || (impliedUsd ? "usd" : "");
    const toPhrase = conn[2];
    const fromHits = fromPhrase ? lookupUnit(fromPhrase, activeId) : impliedUsd ? [{ cat: "currency", unit: "USD" }] : [];
    const toHits = lookupUnit(toPhrase, activeId);
    const pair = pickPair(fromHits, toHits, activeId);
    if (!pair) return null;
    if (impliedUsd && !pair.from) pair.from = "USD";
    const value = extracted.value;
    return {
      cat: pair.cat,
      from: pair.from,
      to: pair.to,
      value: Number.isFinite(value) ? value : null,
      label: `${extracted.raw ? extracted.raw + " " : ""}${pair.from || "?"} \u2192 ${pair.to || "?"}`,
    };
  }

  const inches = parseFeetInches(q);
  if (inches != null) {
    return { cat: "length", from: "inch", to: null, value: inches, label: `${q} \u2192 inch` };
  }

  const extracted = extractLeadingNumber(q);
  if (extracted.rest && Number.isFinite(extracted.value)) {
    const hits = lookupUnit(extracted.rest, activeId);
    if (hits.length) {
      const hit = hits.find((h) => h.cat === activeId) || hits[0];
      return { cat: hit.cat, from: hit.unit, to: null, value: extracted.value, label: `${extracted.raw} ${hit.unit}` };
    }
  }

  const catHit = CATEGORIES.find((c) => c.id === q.toLowerCase() || c.name.toLowerCase() === q.toLowerCase());
  if (catHit) return { cat: catHit.id, from: null, to: null, value: null, label: catHit.name };

  return null;
}
