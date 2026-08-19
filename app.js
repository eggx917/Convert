const CATEGORIES = [
  {
    id: "length",
    name: "Length",
    base: "meter",
    units: {
      nanometer: 1e-9, micrometer: 1e-6, millimeter: 0.001, centimeter: 0.01, meter: 1,
      kilometer: 1000, inch: 0.0254, foot: 0.3048, yard: 0.9144, mile: 1609.344,
      "nautical mile": 1852, lightyear: 9.4607304725808e15,
    },
  },
  {
    id: "weight",
    name: "Weight",
    base: "kilogram",
    units: {
      microgram: 1e-9, milligram: 1e-6, gram: 0.001, kilogram: 1, tonne: 1000,
      ounce: 0.028349523125, pound: 0.45359237, stone: 6.35029318,
      "US ton": 907.18474, "imperial ton": 1016.0469088,
    },
  },
  {
    id: "temperature",
    name: "Temperature",
    custom: "temperature",
    units: { celsius: null, fahrenheit: null, kelvin: null, rankine: null },
  },
  {
    id: "volume",
    name: "Volume",
    base: "liter",
    units: {
      milliliter: 0.001, liter: 1, "cubic meter": 1000, teaspoon: 0.00492892159375,
      tablespoon: 0.01478676478125, "fluid ounce (US)": 0.0295735295625, cup: 0.2365882365,
      pint: 0.473176473, quart: 0.946352946, gallon: 3.785411784,
      "imperial gallon": 4.54609, "cubic inch": 0.016387064, "cubic foot": 28.316846592,
    },
  },
  {
    id: "area",
    name: "Area",
    base: "square meter",
    units: {
      "square millimeter": 1e-6, "square centimeter": 0.0001, "square meter": 1,
      hectare: 10000, "square kilometer": 1e6, "square inch": 0.00064516,
      "square foot": 0.09290304, "square yard": 0.83612736, acre: 4046.8564224,
      "square mile": 2589988.110336,
    },
  },
  {
    id: "speed",
    name: "Speed",
    base: "meter/second",
    units: {
      "meter/second": 1, "kilometer/hour": 1 / 3.6, "mile/hour": 0.44704,
      knot: 0.514444444, "foot/second": 0.3048, mach: 340.29, "speed of light": 299792458,
    },
  },
  {
    id: "time",
    name: "Time",
    base: "second",
    units: {
      nanosecond: 1e-9, microsecond: 1e-6, millisecond: 0.001, second: 1, minute: 60,
      hour: 3600, day: 86400, week: 604800, month: 2629746, year: 31556952,
      decade: 315569520, century: 3155695200,
    },
  },
  {
    id: "energy",
    name: "Energy",
    base: "joule",
    units: {
      joule: 1, kilojoule: 1000, calorie: 4.184, kilocalorie: 4184, "watt hour": 3600,
      "kilowatt hour": 3.6e6, electronvolt: 1.602176634e-19,
      "British thermal unit": 1055.05585262, therm: 105505585.262, "foot-pound": 1.3558179483314004,
    },
  },
  {
    id: "power",
    name: "Power",
    base: "watt",
    units: {
      milliwatt: 0.001, watt: 1, kilowatt: 1000, megawatt: 1e6,
      horsepower: 745.6998715822702, "metric horsepower": 735.49875,
      "BTU/hour": 0.29307107, "foot-pound/second": 1.3558179483314004,
    },
  },
  {
    id: "pressure",
    name: "Pressure",
    base: "pascal",
    units: {
      pascal: 1, kilopascal: 1000, megapascal: 1e6, bar: 1e5, millibar: 100,
      atmosphere: 101325, torr: 133.322368421, psi: 6894.757293168,
      mmHg: 133.322387415, inHg: 3386.389,
    },
  },
  {
    id: "data",
    name: "Data",
    base: "byte",
    units: {
      bit: 0.125, byte: 1, kilobyte: 1000, megabyte: 1e6, gigabyte: 1e9, terabyte: 1e12,
      petabyte: 1e15, kibibyte: 1024, mebibyte: 1048576, gibibyte: 1073741824,
      tebibyte: 1099511627776,
    },
  },
  {
    id: "angle",
    name: "Angle",
    base: "radian",
    units: {
      degree: Math.PI / 180, radian: 1, gradian: Math.PI / 200,
      arcminute: Math.PI / 10800, arcsecond: Math.PI / 648000, turn: Math.PI * 2,
    },
  },
  {
    id: "frequency",
    name: "Frequency",
    base: "hertz",
    units: {
      hertz: 1, kilohertz: 1000, megahertz: 1e6, gigahertz: 1e9, rpm: 1 / 60,
      "radian/second": 1 / (2 * Math.PI),
    },
  },
  {
    id: "force",
    name: "Force",
    base: "newton",
    units: {
      newton: 1, kilonewton: 1000, dyne: 1e-5, "pound-force": 4.4482216152605,
      "kilogram-force": 9.80665, "ounce-force": 0.2780138509537812,
    },
  },
  {
    id: "fuel",
    name: "Fuel",
    custom: "fuel",
    units: { "km/L": null, "L/100km": null, mpg: null, "mpg (UK)": null },
  },
  {
    id: "density",
    name: "Density",
    base: "kg/m³",
    units: {
      "kg/m³": 1, "g/cm³": 1000, "g/mL": 1000, "kg/L": 1000,
      "lb/ft³": 16.01846337396, "lb/in³": 27679.904710203, "oz/in³": 1729.9940443865,
    },
  },
  {
    id: "cooking",
    name: "Cooking",
    base: "milliliter",
    units: {
      milliliter: 1, liter: 1000, teaspoon: 4.92892159375, tablespoon: 14.78676478125,
      "fluid ounce": 29.5735295625, cup: 236.5882365, pint: 473.176473, quart: 946.352946,
      gallon: 3785.411784, stick: 118.29411825, drop: 0.05,
    },
  },
  {
    id: "illuminance",
    name: "Light",
    base: "lux",
    units: { lux: 1, "foot-candle": 10.76391041671, phot: 10000, nox: 0.001 },
  },
  {
    id: "currency",
    name: "Currency",
    custom: "currency",
    units: {
      USD: null, EUR: null, GBP: null, JPY: null, CAD: null, AUD: null, CHF: null,
      CNY: null, INR: null, KRW: null, MXN: null, BRL: null, SEK: null, NOK: null,
      DKK: null, SGD: null, HKD: null, NZD: null, ZAR: null, TRY: null, PLN: null,
    },
  },
];

const DEFAULTS = {
  length: ["meter", "foot"],
  weight: ["kilogram", "pound"],
  temperature: ["celsius", "fahrenheit"],
  volume: ["liter", "gallon"],
  area: ["square meter", "square foot"],
  speed: ["kilometer/hour", "mile/hour"],
  time: ["hour", "day"],
  energy: ["kilocalorie", "kilojoule"],
  power: ["watt", "horsepower"],
  pressure: ["psi", "bar"],
  data: ["megabyte", "gibibyte"],
  angle: ["degree", "radian"],
  frequency: ["hertz", "rpm"],
  force: ["newton", "pound-force"],
  fuel: ["mpg", "L/100km"],
  density: ["g/cm³", "kg/m³"],
  cooking: ["cup", "milliliter"],
  illuminance: ["lux", "foot-candle"],
  currency: ["USD", "EUR"],
};

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

function fillUnitSelects(preferFrom, preferTo) {
  const names = unitNames(activeCategory);
  const options = names.map((n) => `<option value="${escapeAttr(n)}">${n}</option>`).join("");
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

function renderCategories(filter = "") {
  const q = filter.trim().toLowerCase();
  const list = CATEGORIES.filter((c) => !q || c.name.toLowerCase().includes(q) || c.id.includes(q));
  els.categoryList.innerHTML = list
    .map(
      (c) =>
        `<button type="button" class="chip" role="tab" data-id="${c.id}" aria-selected="${
          c.id === activeCategory.id ? "true" : "false"
        }">${c.name}</button>`
    )
    .join("");
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
