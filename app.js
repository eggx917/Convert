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
  alsoMore: document.getElementById("alsoMore"),
  search: document.getElementById("search"),
  searchHint: document.getElementById("searchHint"),
  themeBtn: document.getElementById("themeBtn"),
  shortcutRow: document.getElementById("shortcutRow"),
  pinBtn: document.getElementById("pinBtn"),
  shareBtn: document.getElementById("shareBtn"),
  spark: document.getElementById("spark"),
  board: document.getElementById("board"),
  historyBtn: document.getElementById("historyBtn"),
  pulseBtn: document.getElementById("pulseBtn"),
};

let activeCategory = CATEGORIES[0];
let editingSide = "from";
let fx = { base: "USD", date: "", rates: { USD: 1 } };
let fxReady = false;
let userTouched = false;
let alsoExpanded = false;
let openBoard = null;
let logTimer = null;
let applying = false;
let sparkKey = "";

function unitNames(category) {
  return Object.keys(category.units);
}

function escapeAttr(s) {
  return String(s).replace(/&/g, "\u0026amp;").replace(/\"/g, "\u0026quot;").replace(/</g, "\u0026lt;");
}

function formatNumber(n) {
  if (!Number.isFinite(n)) return "\u2014";
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
