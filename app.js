const UNITS = {
  Length: {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    mile: 1609.344,
    foot: 0.3048,
    inch: 0.0254,
  },
  Weight: {
    kilogram: 1,
    gram: 0.001,
    pound: 0.45359237,
    ounce: 0.028349523125,
  },
  Temperature: {
    celsius: "C",
    fahrenheit: "F",
    kelvin: "K",
  },
};

const categoryEl = document.getElementById("category");
const fromUnitEl = document.getElementById("fromUnit");
const toUnitEl = document.getElementById("toUnit");
const valueEl = document.getElementById("value");
const resultEl = document.getElementById("result");
const formulaEl = document.getElementById("formula");

function fillSelect(select, names) {
  select.innerHTML = names.map((n) => `<option value="${n}">${n}</option>`).join("");
}

function convertTemp(value, from, to) {
  let c;
  if (from === "celsius") c = value;
  else if (from === "fahrenheit") c = (value - 32) * (5 / 9);
  else c = value - 273.15;
  if (to === "celsius") return c;
  if (to === "fahrenheit") return c * (9 / 5) + 32;
  return c + 273.15;
}

function convert() {
  const cat = categoryEl.value;
  const from = fromUnitEl.value;
  const to = toUnitEl.value;
  const raw = parseFloat(valueEl.value);
  if (Number.isNaN(raw)) {
    resultEl.textContent = "—";
    formulaEl.textContent = "";
    return;
  }
  let out;
  if (cat === "Temperature") {
    out = convertTemp(raw, from, to);
    formulaEl.textContent = `${raw} ${from} → ${to}`;
  } else {
    const table = UNITS[cat];
    out = (raw * table[from]) / table[to];
    formulaEl.textContent = `${raw} ${from} = ${out} ${to}`;
  }
  resultEl.textContent = Number.isFinite(out)
    ? Number(out.toPrecision(10)).toString()
    : "—";
}

function onCategoryChange() {
  const names = Object.keys(UNITS[categoryEl.value]);
  fillSelect(fromUnitEl, names);
  fillSelect(toUnitEl, names);
  if (names.length > 1) toUnitEl.selectedIndex = 1;
  convert();
}

fillSelect(categoryEl, Object.keys(UNITS));
categoryEl.addEventListener("change", onCategoryChange);
fromUnitEl.addEventListener("change", convert);
toUnitEl.addEventListener("change", convert);
valueEl.addEventListener("input", convert);
onCategoryChange();
