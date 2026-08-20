const HISTORY_DAYS = 30;
const PIN_MAX = 5;
const LS = {
  pins: "convert.pins",
  last: "convert.lastPairs",
  fx: "convert.fx",
  category: "convert.category",
  theme: "convert.theme",
  history: "convert.history",
};

const Store = {
  pins: [],
  lastPairs: {},
  history: [],
  fxCache: null,
  ready: Promise.resolve(),
};

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function pruneHistory(rows) {
  const cut = Date.now() - HISTORY_DAYS * 86400000;
  return rows.filter((r) => r.ts >= cut).sort((a, b) => b.ts - a.ts);
}

function openDb() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("no idb"));
      return;
    }
    const req = indexedDB.open("convert", 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("history")) db.createObjectStore("history", { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

Store.init = function init() {
  Store.pins = readJson(LS.pins, []);
  Store.lastPairs = readJson(LS.last, {});
  Store.fxCache = readJson(LS.fx, null);
  Store.ready = (async () => {
    try {
      const db = await openDb();
      const rows = await new Promise((resolve, reject) => {
        const tx = db.transaction("history", "readonly");
        const req = tx.objectStore("history").getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
      Store.history = pruneHistory(rows);
      const stale = rows.filter((r) => !Store.history.some((h) => h.id === r.id));
      if (stale.length) {
        const tx = db.transaction("history", "readwrite");
        stale.forEach((r) => tx.objectStore("history").delete(r.id));
      }
    } catch {
      Store.history = pruneHistory(readJson(LS.history, []));
    }
  })();
  return Store.ready;
};

Store.savePins = function savePins() {
  writeJson(LS.pins, Store.pins);
};

Store.saveLast = function saveLast() {
  writeJson(LS.last, Store.lastPairs);
};

Store.saveFx = function saveFx(fx) {
  Store.fxCache = fx;
  writeJson(LS.fx, fx);
};

Store.rememberPair = function rememberPair(cat, from, to) {
  Store.lastPairs[cat] = [from, to];
  Store.saveLast();
};

Store.isPinned = function isPinned(cat, from, to) {
  return Store.pins.some((p) => p.cat === cat && p.from === from && p.to === to);
};

Store.togglePin = function togglePin(cat, from, to) {
  const i = Store.pins.findIndex((p) => p.cat === cat && p.from === from && p.to === to);
  if (i >= 0) Store.pins.splice(i, 1);
  else {
    Store.pins.unshift({ cat, from, to });
    if (Store.pins.length > PIN_MAX) Store.pins.length = PIN_MAX;
  }
  Store.savePins();
  return Store.isPinned(cat, from, to);
};

async function persistHistory() {
  try {
    const db = await openDb();
    const tx = db.transaction("history", "readwrite");
    const store = tx.objectStore("history");
    store.clear();
    Store.history.forEach((row) => store.put(row));
  } catch {
    writeJson(LS.history, Store.history);
  }
}

Store.log = function log(entry) {
  const prev = Store.history[0];
  if (
    prev &&
    prev.cat === entry.cat &&
    prev.from === entry.from &&
    prev.to === entry.to &&
    prev.fromVal === entry.fromVal &&
    Date.now() - prev.ts < 60000
  ) {
    prev.ts = Date.now();
    prev.toVal = entry.toVal;
    persistHistory();
    return;
  }
  Store.history.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ts: Date.now(),
    ...entry,
  });
  Store.history = pruneHistory(Store.history);
  persistHistory();
};

Store.remove = function remove(id) {
  Store.history = Store.history.filter((r) => r.id !== id);
  persistHistory();
};

Store.clearHistory = function clearHistory() {
  Store.history = [];
  persistHistory();
};

Store.frequent = function frequent(limit) {
  const counts = new Map();
  for (const row of Store.history) {
    const key = `${row.cat}\t${row.from}\t${row.to}`;
    const cur = counts.get(key) || { cat: row.cat, from: row.from, to: row.to, n: 0 };
    cur.n += 1;
    counts.set(key, cur);
  }
  return [...counts.values()]
    .filter((p) => !Store.isPinned(p.cat, p.from, p.to))
    .sort((a, b) => b.n - a.n)
    .slice(0, limit || 5);
};

Store.pulse = function pulse() {
  const rows = Store.history;
  const days = new Set(rows.map((r) => new Date(r.ts).toDateString()));
  const counts = new Map();
  for (const row of rows) {
    const key = `${row.cat}\t${row.from}\t${row.to}`;
    const cur = counts.get(key) || { cat: row.cat, from: row.from, to: row.to, n: 0 };
    cur.n += 1;
    counts.set(key, cur);
  }
  const top = [...counts.values()].sort((a, b) => b.n - a.n).slice(0, 5);
  const cats = {};
  rows.forEach((r) => {
    cats[r.cat] = (cats[r.cat] || 0) + 1;
  });
  const activity = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  for (let i = HISTORY_DAYS - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = d.toDateString();
    activity.push({
      date: d,
      n: rows.filter((r) => new Date(r.ts).toDateString() === label).length,
    });
  }
  return { count: rows.length, activeDays: days.size, top, cats, activity };
};
