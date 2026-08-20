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
    base: "kg/m3",
    units: {
      "kg/m3": 1, "g/cm3": 1000, "g/mL": 1000, "kg/L": 1000,
      "lb/ft3": 16.01846337396, "lb/in3": 27679.904710203, "oz/in3": 1729.9940443865,
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
      USD: null, CAD: null, MXN: null, BRL: null, ARS: null, CLP: null, COP: null, PEN: null, UYU: null, CRC: null, DOP: null, GTQ: null, BOB: null,
      EUR: null, GBP: null, CHF: null, SEK: null, NOK: null, DKK: null, PLN: null, CZK: null, HUF: null, RON: null, BGN: null, ISK: null, UAH: null, TRY: null,
      JPY: null, CNY: null, INR: null, KRW: null, NTD: null, TWD: null, HKD: null, SGD: null, AUD: null, NZD: null, THB: null, PHP: null, IDR: null, VND: null, MYR: null, PKR: null, BDT: null, LKR: null,
      AED: null, SAR: null, ILS: null, QAR: null, KWD: null, BHD: null, OMR: null, EGP: null, MAD: null, TND: null, JOD: null, ZAR: null, NGN: null, KES: null, GHS: null, UGX: null,
      BTC: null, ETH: null, USDT: null, USDC: null, SOL: null,
    },
  },
];

const BUCKETS = [
  { name: "Everyday", ids: ["length", "weight", "temperature", "volume", "area", "cooking", "currency"] },
  { name: "Motion", ids: ["speed", "time", "fuel", "data"] },
  { name: "Science", ids: ["energy", "power", "pressure", "force", "density", "angle", "frequency", "illuminance"] },
];

const UNIT_GROUPS = {
  length: [
    { label: "Metric", units: ["nanometer", "micrometer", "millimeter", "centimeter", "meter", "kilometer"] },
    { label: "Imperial", units: ["inch", "foot", "yard", "mile"] },
    { label: "Other", units: ["nautical mile", "lightyear"] },
  ],
  weight: [
    { label: "Metric", units: ["microgram", "milligram", "gram", "kilogram", "tonne"] },
    { label: "Imperial", units: ["ounce", "pound", "stone", "US ton", "imperial ton"] },
  ],
  volume: [
    { label: "Metric", units: ["milliliter", "liter", "cubic meter"] },
    { label: "US", units: ["teaspoon", "tablespoon", "fluid ounce (US)", "cup", "pint", "quart", "gallon", "cubic inch", "cubic foot"] },
    { label: "Imperial", units: ["imperial gallon"] },
  ],
  area: [
    { label: "Metric", units: ["square millimeter", "square centimeter", "square meter", "hectare", "square kilometer"] },
    { label: "Imperial", units: ["square inch", "square foot", "square yard", "acre", "square mile"] },
  ],
  speed: [
    { label: "Everyday", units: ["kilometer/hour", "mile/hour", "meter/second", "foot/second"] },
    { label: "Other", units: ["knot", "mach", "speed of light"] },
  ],
  time: [
    { label: "Clock", units: ["nanosecond", "microsecond", "millisecond", "second", "minute", "hour"] },
    { label: "Calendar", units: ["day", "week", "month", "year", "decade", "century"] },
  ],
  data: [
    { label: "Decimal", units: ["bit", "byte", "kilobyte", "megabyte", "gigabyte", "terabyte", "petabyte"] },
    { label: "Binary", units: ["kibibyte", "mebibyte", "gibibyte", "tebibyte"] },
  ],
  cooking: [
    { label: "Metric", units: ["milliliter", "liter", "drop"] },
    { label: "Kitchen", units: ["teaspoon", "tablespoon", "fluid ounce", "cup", "pint", "quart", "gallon", "stick"] },
  ],
  currency: [
    { label: "Americas", units: ["USD", "CAD", "MXN", "BRL", "ARS", "CLP", "COP", "PEN", "UYU", "CRC", "DOP", "GTQ", "BOB"] },
    { label: "Europe", units: ["EUR", "GBP", "CHF", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RON", "BGN", "ISK", "UAH", "TRY"] },
    { label: "Asia-Pacific", units: ["JPY", "CNY", "INR", "KRW", "NTD", "TWD", "HKD", "SGD", "AUD", "NZD", "THB", "PHP", "IDR", "VND", "MYR", "PKR", "BDT", "LKR"] },
    { label: "Middle East & Africa", units: ["AED", "SAR", "ILS", "QAR", "KWD", "BHD", "OMR", "EGP", "MAD", "TND", "JOD", "ZAR", "NGN", "KES", "GHS", "UGX"] },
    { label: "Crypto", units: ["BTC", "ETH", "USDT", "USDC", "SOL"] },
  ],
  energy: [
    { label: "SI", units: ["joule", "kilojoule", "watt hour", "kilowatt hour", "electronvolt"] },
    { label: "Food & heat", units: ["calorie", "kilocalorie", "British thermal unit", "therm", "foot-pound"] },
  ],
  pressure: [
    { label: "SI", units: ["pascal", "kilopascal", "megapascal", "bar", "millibar"] },
    { label: "Common", units: ["atmosphere", "psi", "torr", "mmHg", "inHg"] },
  ],
};

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
  density: ["g/cm3", "kg/m3"],
  cooking: ["cup", "milliliter"],
  illuminance: ["lux", "foot-candle"],
  currency: ["USD", "NTD"],
};
