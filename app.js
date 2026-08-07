/**
 * Convert — multi-category unit converter
 * Linear units use base factors relative to a canonical unit.
 * Temperature, fuel economy, and a few others use custom converters.
 */

const CATEGORIES = [
  {
    id: "length",
    name: "Length",
    base: "meter",
    units: {
      nanometer: 1e-9,
      micrometer: 1e-6,
      millimeter: 0.001,
      centimeter: 0.01,
      meter: 1,
      kilometer: 1000,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.344,
      "nautical mile": 1852,
      lightyear: 9.4607304725808e15,
    },
  },
  {
    id: "weight",
    name: "Weight",
    base: "kilogram",
    units: {
      microgram: 1e-9,
      milligram: 1e-6,
      gram: 0.001,
      kilogram: 1,
      tonne: 1000,
      ounce: 0.028349523125,
      pound: 0.45359237,
      stone: 6.35029318,
      "US ton": 907.18474,
      "imperial ton": 1016.0469088,
    },
  },
  {
    id: "temperature",
    name: "Temperature",
    custom: "temperature",
    units: {
      celsius: null,
      fahrenheit: null,
      kelvin: null,
      rankine: null,
    },
  },
  {
    id: "volume",
    name: "Volume",
    base: "liter",
    units: {
      milliliter: 0.001,
      liter: 1,
      "cubic meter": 1000,
      teaspoon: 0.00492892159375,
      tablespoon: 0.01478676478125,
      "fluid ounce (US)": 0.0295735295625,
      cup: 0.2365882365,
      pint: 0.473176473,
      quart: 0.946352946,
      gallon: 3.785411784,
      "imperial gallon": 4.54609,
      "cubic inch": 0.016387064,
      "cubic foot": 28.316846592,
    },
  },
  {
    id: "area",
    name: "Area",
    base: "square meter",
    units: {
      "square millimeter": 1e-6,
      "square centimeter": 0.0001,
      "square meter": 1,
      hectare: 10000,
      "square kilometer": 1e6,
      "square inch": 0.00064516,
      "square foot": 0.09290304,
      "square yard": 0.83612736,
      acre: 4046.8564224,
      "square mile": 2589988.110336,
    },
  },
  {
    id: "speed",
    name: "Speed",
    base: "meter/second",
    units: {
      "meter/second": 1,
      "kilometer/hour": 1 / 3.6,
      "mile/hour": 0.44704,
      knot: 0.514444444,
      "foot/second": 0.3048,
      mach: 340.29,
      "speed of light": 299792458,
    },
  },
  {
    id: "time",
    name: "Time",
    base: "second",
    units: {
      nanosecond: 1e-9,
      microsecond: 1e-6,
      millisecond: 0.001,
      second: 1,
      minute: 60,
      hour: 3600,
      day: 86400,
      week: 604800,
      month: 2629746,
      year: 31556952,
      decade: 315569520,
      century: 3155695200,
    },
  },
  {
    id: "energy",
    name: "Energy",
    base: "joule",
    units: {
      joule: 1,
      kilojoule: 1000,
      calorie: 4.184,
      kilocalorie: 4184,
      "watt hour": 3600,
      "kilowatt hour": 3.6e6,
      "electronvolt": 1.602176634e-19,
      "British thermal unit": 1055.05585262,
      therm: 105505585.262,
      "foot-pound": 1.3558179483314004,
    },
  },
  {
    id: "power",
    name: "Power",
    base: "watt",
    units: {
      milliwatt: 0.001,
      watt: 1,
      kilowatt: 1000,
      megawatt: 1e6,
      horsepower: 745.6998715822702,
      "metric horsepower": 735.49875,
      "BTU/hour": 0.29307107,
      "foot-pound/second": 1.3558179483314004,
    },
  },
  {
    id: "pressure",
    name: "Pressure",
    base: "pascal",
    units: {
      pascal: 1,
      kilopascal: 1000,
      megapascal: 1e6,
      bar: 1e5,
      millibar: 100,
      atmosphere: 101325,
      torr: 133.322368421,
      "psi": 6894.757293168,
      "mmHg": 133.322387415,
      "inHg": 3386.389,
    },
  },
  {
    id: "data",
    name: "Data",
    base: "byte",
    units: {
      bit: 0.125,
      byte: 1,
      kilobyte: 1000,
      megabyte: 1e6,
      gigabyte: 1e9,
      terabyte: 1e12,
      petabyte: 1e15,
      kibibyte: 1024,
      mebibyte: 1048576,
      gibibyte: 1073741824,
      tebibyte: 1099511627776,
    },
  },
  {
    id: "angle",
    name: "Angle",
    base: "radian",
    units: {
      degree: Math.PI / 180,
      radian: 1,
      gradian: Math.PI / 200,
      arcminute: Math.PI / 10800,
      arcsecond: Math.PI / 648000,
      turn: Math.PI * 2,
    },
  },
  {
    id: "frequency",
    name: "Frequency",
    base: "hertz",
    units: {
      hertz: 1,
      kilohertz: 1000,
      megahertz: 1e6,
      gigahertz: 1e9,
      rpm: 1 / 60,
      "radian/second": 1 / (2 * Math.PI),
    },
  },
  {
    id: "force",
    name: "Force",
    base: "newton",
    units: {
      newton: 1,
      kilonewton: 1000,
      dyne: 1e-5,
      "pound-force": 4.4482216152605,
      "kilogram-force": 9.80665,
      "ounce-force": 0.2780138509537812,
    },
  },
  {
    id: "fuel",
    name: "Fuel economy",
    custom: "fuel",
    units: {
      "km/L": null,
      "L/100km": null,
      mpg: null,
      "mpg (UK)": null,
    },
  },
  {
    id: "density",
    name: "Density",
    base: "kg/m³",
    units: {
      "kg/m³": 1,
      "g/cm³": 1000,
      "g/mL": 1000,
      "kg/L": 1000,
      "lb/ft³": 16.01846337396,
      "lb/in³": 27679.904710203,
      "oz/in³": 1729.9940443865,
    },
  },
  {
    id: "cooking",
    name: "Cooking",
    base: "milliliter",
    units: {
      milliliter: 1,
      liter: 1000,
      teaspoon: 4.92892159375,
      tablespoon: 14.78676478125,
      "fluid ounce": 29.5735295625,
      cup: 236.5882365,
      pint: 473.176473,
      quart: 946.352946,
      gallon: 3785.411784,
      stick: 118.29411825,
      "drop": 0.05,
    },
  },
  {
    id: "illuminance",
    name: "Illuminance",
    base: "lux",
    units: {
      lux: 1,
      "foot-candle": 10.76391041671,
      phot: 10000,
      nox: 0.001,
    },
  },
];

const categoryListEl = document.getElementById("categoryList");
const fromValueEl = document.getElementById("fromValue");
const toValueEl = document.getElementById("toValue");
const fromUnitEl = document.getElementById("fromUnit");
const toUnitEl = document.getElementById("toUnit");
const formulaEl = document.getElementById("formula");
const categoryMetaEl = document.getElementById("categoryMeta");
const swapBtn = document.getElementById("swapBtn");

let activeCategory = CATEGORIES[0];
let editingSide = "from"; // which field the user last edited

function unitNames(category) {
  return Object.keys(category.units);
}

function fillUnitSelects(preferFrom, preferTo) {
  const names = unitNames(activeCategory);
  fromUnitEl.innerHTML = names
    .map((n) => `<option value="${escapeAttr(n)}">${n}</option>`)
    .join("");
  toUnitEl.innerHTML = names
    .map((n) => `<option value="${escapeAttr(n)}">${n}</option>`)
    .join("");

  fromUnitEl.value = names.includes(preferFrom) ? preferFrom : names[0];
  const defaultTo =
    preferTo && preferTo !== fromUnitEl.value && names.includes(preferTo)
      ? preferTo
      : names.find((n) => n !== fromUnitEl.value) || names[0];
  toUnitEl.value = defaultTo;
}

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function parseNumber(raw) {
  if (raw == null) return NaN;
  const cleaned = String(raw).trim().replace(/,/g, "");
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

  // Up to 12 significant digits, trim trailing zeros
  let s = n.toPrecision(12);
  if (s.includes("e") || s.includes("E")) {
    return Number(s).toString();
  }
  if (s.includes(".")) {
    s = s.replace(/\.?0+$/, "");
  }
  return s;
}

// --- custom converters ---

function celsiusFrom(value, unit) {
  switch (unit) {
    case "celsius":
      return value;
    case "fahrenheit":
      return ((value - 32) * 5) / 9;
    case "kelvin":
      return value - 273.15;
    case "rankine":
      return ((value - 491.67) * 5) / 9;
    default:
      return NaN;
  }
}

function celsiusTo(celsius, unit) {
  switch (unit) {
    case "celsius":
      return celsius;
    case "fahrenheit":
      return (celsius * 9) / 5 + 32;
    case "kelvin":
      return celsius + 273.15;
    case "rankine":
      return ((celsius + 273.15) * 9) / 5;
    default:
      return NaN;
  }
}

/** Normalize fuel economy to km per liter */
function fuelToKmPerL(value, unit) {
  switch (unit) {
    case "km/L":
      return value;
    case "L/100km":
      return value === 0 ? NaN : 100 / value;
    case "mpg":
      return value * 0.425143707; // US mpg
    case "mpg (UK)":
      return value * 0.35400619;
    default:
      return NaN;
  }
}

function fuelFromKmPerL(kmPerL, unit) {
  switch (unit) {
    case "km/L":
      return kmPerL;
    case "L/100km":
      return kmPerL === 0 ? NaN : 100 / kmPerL;
    case "mpg":
      return kmPerL / 0.425143707;
    case "mpg (UK)":
      return kmPerL / 0.35400619;
    default:
      return NaN;
  }
}

function convertValue(value, from, to, category) {
  if (!Number.isFinite(value)) return NaN;
  if (from === to) return value;

  if (category.custom === "temperature") {
    const c = celsiusFrom(value, from);
    return celsiusTo(c, to);
  }

  if (category.custom === "fuel") {
    const base = fuelToKmPerL(value, from);
    return fuelFromKmPerL(base, to);
  }

  const factors = category.units;
  const fromF = factors[from];
  const toF = factors[to];
  if (fromF == null || toF == null || toF === 0) return NaN;
  return (value * fromF) / toF;
}

function convert() {
  const from = fromUnitEl.value;
  const to = toUnitEl.value;

  if (editingSide === "from") {
    const value = parseNumber(fromValueEl.value);
    const out = convertValue(value, from, to, activeCategory);
    toValueEl.value = Number.isFinite(out) ? formatNumber(out) : "";
    updateFormula(value, out, from, to);
  } else {
    const value = parseNumber(toValueEl.value);
    const out = convertValue(value, to, from, activeCategory);
    fromValueEl.value = Number.isFinite(out) ? formatNumber(out) : "";
    updateFormula(out, value, from, to);
  }
}

function updateFormula(fromVal, toVal, fromUnit, toUnit) {
  if (!Number.isFinite(fromVal) || !Number.isFinite(toVal)) {
    formulaEl.textContent = "";
    return;
  }
  formulaEl.textContent = `${formatNumber(fromVal)} ${fromUnit} = ${formatNumber(toVal)} ${toUnit}`;
}

function setCategory(id) {
  const cat = CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
  activeCategory = cat;
  editingSide = "from";

  document.querySelectorAll(".chip").forEach((btn) => {
    btn.setAttribute("aria-selected", btn.dataset.id === cat.id ? "true" : "false");
  });

  const names = unitNames(cat);
  // Sensible defaults per category
  const defaults = {
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
  };
  const [dFrom, dTo] = defaults[cat.id] || [names[0], names[1] || names[0]];
  fillUnitSelects(dFrom, dTo);

  if (!fromValueEl.value.trim()) fromValueEl.value = "1";
  convert();
  categoryMetaEl.textContent = `${cat.name} · ${names.length} units`;
}

function renderCategories() {
  categoryListEl.innerHTML = CATEGORIES.map(
    (c, i) =>
      `<button type="button" class="chip" role="tab" data-id="${c.id}" aria-selected="${
        i === 0 ? "true" : "false"
      }">${c.name}</button>`
  ).join("");

  categoryListEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    setCategory(btn.dataset.id);
  });
}

function swapUnits() {
  const a = fromUnitEl.value;
  const b = toUnitEl.value;
  fromUnitEl.value = b;
  toUnitEl.value = a;

  // Keep the "from" numeric value as what was previously "to" result if editing from
  if (editingSide === "from") {
    const prevTo = toValueEl.value;
    if (prevTo) fromValueEl.value = prevTo;
  } else {
    const prevFrom = fromValueEl.value;
    if (prevFrom) toValueEl.value = prevFrom;
  }
  convert();
}

// Events
fromValueEl.addEventListener("input", () => {
  editingSide = "from";
  toValueEl.removeAttribute("readonly");
  fromValueEl.removeAttribute("readonly");
  convert();
  toValueEl.setAttribute("readonly", "");
});

toValueEl.addEventListener("focus", () => {
  toValueEl.removeAttribute("readonly");
});

toValueEl.addEventListener("input", () => {
  editingSide = "to";
  convert();
});

fromUnitEl.addEventListener("change", convert);
toUnitEl.addEventListener("change", convert);
swapBtn.addEventListener("click", swapUnits);

// Allow reverse entry by clicking the "to" field
toValueEl.addEventListener("click", () => {
  toValueEl.removeAttribute("readonly");
  toValueEl.select();
});

renderCategories();
setCategory(CATEGORIES[0].id);
