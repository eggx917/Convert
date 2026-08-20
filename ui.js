function ago(ts) {
  const s = (Date.now() - ts) / 1000;
  if (s < 45) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 172800) return "yesterday";
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function dayTitle(ts) {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const y = new Date(today);
  y.setDate(y.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function renderHistory() {
  const rows = Store.history;
  if (!rows.length) {
    return `<p class="board-empty">Conversions you finish stay here for 30 days, on this device only.</p>`;
  }
  const groups = [];
  for (const row of rows) {
    const title = dayTitle(row.ts);
    if (!groups.length || groups[groups.length - 1].title !== title) groups.push({ title, rows: [] });
    groups[groups.length - 1].rows.push(row);
  }
  return groups
    .map((g) => {
      const items = g.rows
        .map((r) => `<button type="button" class="hist-item" data-id="${r.id}" data-cat="${r.cat}" data-from="${escapeAttr(r.from)}" data-to="${escapeAttr(r.to)}" data-value="${escapeAttr(formatNumber(r.fromVal))}">
          <span class="hist-main">${formatDisplay(r.fromVal)} ${shortUnit(r.from)} \u2192 ${formatDisplay(r.toVal)} ${shortUnit(r.to)}</span>
          <span class="hist-meta">${ago(r.ts)}</span>
          <span class="hist-del" data-del="${r.id}" title="Remove" aria-label="Remove">\u00d7</span>
        </button>`);
      return `<p class="bucket-label">${g.title}</p>${items.join("")}`;
    })
    .join("");
}

function renderPulse() {
  const p = Store.pulse();
  if (!p.count) {
    return `<p class="board-empty">Use Convert for a bit and Pulse will show your last 30 days \u2014 on this device, no accounts.</p>`;
  }
  const max = Math.max(...p.activity.map((a) => a.n), 1);
  const bars = p.activity
    .map((a) => {
      const h = a.n ? Math.max(3, Math.round((a.n / max) * 28)) : 2;
      return `<i class="pulse-bar${a.n ? " on" : ""}" style="height:${h}px" title="${a.date.toLocaleDateString()} \u00b7 ${a.n}"></i>`;
    })
    .join("");
  const top = p.top.length
    ? `<div class="pulse-top">${p.top.map((t) => `<div><span>${shortUnit(t.from)} \u2192 ${shortUnit(t.to)}</span><span>${t.n}</span></div>`).join("")}</div>`
    : "";
  return `<p class="pulse-kicker">${p.count} conversion${p.count === 1 ? "" : "s"} \u00b7 ${p.activeDays} day${p.activeDays === 1 ? "" : "s"} active</p>
    <div class="pulse-bars" aria-hidden="true">${bars}</div>
    ${top}`;
}

function renderBoard() {
  if (!openBoard) {
    els.board.hidden = true;
    els.board.innerHTML = "";
    els.historyBtn.setAttribute("aria-pressed", "false");
    els.pulseBtn.setAttribute("aria-pressed", "false");
    return;
  }
  const title = openBoard === "history" ? "History" : "Pulse";
  const extra = openBoard === "history" && Store.history.length
    ? `<button type="button" class="text-btn" id="clearHistory">Clear</button>`
    : `<span class="board-note">Last 30 days \u00b7 this device</span>`;
  const body = openBoard === "history" ? renderHistory() : renderPulse();
  els.board.innerHTML = `<div class="board-head"><h2>${title}</h2>${extra}</div>${body}`;
  els.board.hidden = false;
  els.historyBtn.setAttribute("aria-pressed", openBoard === "history" ? "true" : "false");
  els.pulseBtn.setAttribute("aria-pressed", openBoard === "pulse" ? "true" : "false");
}

function toggleBoard(name) {
  openBoard = openBoard === name ? null : name;
  renderBoard();
  if (openBoard) els.board.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function typingTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || el.isContentEditable;
}

async function copyText(text) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

els.categoryList.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (btn) setCategory(btn.dataset.id);
});

els.shortcutRow.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  userTouched = true;
  applyState({ cat: btn.dataset.cat, from: btn.dataset.from, to: btn.dataset.to, source: "shortcut" });
});

els.alsoList.addEventListener("click", (e) => {
  const item = e.target.closest(".also-item");
  if (!item) return;
  userTouched = true;
  els.toUnit.value = item.dataset.unit;
  convert();
});

els.alsoMore.addEventListener("click", () => {
  alsoExpanded = !alsoExpanded;
  const fromVal = parseNumber(els.fromValue.value, els.fromUnit.value, activeCategory);
  renderAlso(fromVal, els.fromUnit.value, els.toUnit.value);
});

els.fromValue.addEventListener("input", () => {
  userTouched = true;
  editingSide = "from";
  convert();
});
els.toValue.addEventListener("input", () => {
  userTouched = true;
  editingSide = "to";
  convert();
});
els.fromUnit.addEventListener("change", () => {
  userTouched = true;
  convert();
});
els.toUnit.addEventListener("change", () => {
  userTouched = true;
  convert();
});
els.swapBtn.addEventListener("click", swapUnits);

els.search.addEventListener("input", () => {
  const q = els.search.value;
  const parsed = parseCommand(q, activeCategory.id);
  if (parsed && (parsed.from || parsed.value != null)) {
    renderCategories("");
    showHint(parsed);
  } else {
    els.searchHint.hidden = true;
    renderCategories(q);
  }
});
els.search.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  if (runCommand(els.search.value)) return;
  const first = els.categoryList.querySelector(".chip");
  if (first) setCategory(first.dataset.id);
});

els.themeBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(current);
});

els.copyBtn.addEventListener("click", async () => {
  const text = els.toValue.value;
  if (!text) return;
  const ok = await copyText(text);
  if (ok) {
    els.copyBtn.classList.add("copied");
    setTimeout(() => els.copyBtn.classList.remove("copied"), 900);
  }
});

els.shareBtn.addEventListener("click", async () => {
  writeHash();
  const ok = await copyText(location.href);
  if (ok) {
    els.shareBtn.classList.add("copied");
    setTimeout(() => els.shareBtn.classList.remove("copied"), 900);
  }
});

els.pinBtn.addEventListener("click", () => {
  Store.togglePin(activeCategory.id, els.fromUnit.value, els.toUnit.value);
  updatePin();
  renderShortcuts();
});

els.historyBtn.addEventListener("click", () => toggleBoard("history"));
els.pulseBtn.addEventListener("click", () => toggleBoard("pulse"));

els.board.addEventListener("click", (e) => {
  const del = e.target.closest("[data-del]");
  if (del) {
    e.preventDefault();
    e.stopPropagation();
    Store.remove(del.dataset.del);
    renderBoard();
    renderShortcuts();
    return;
  }
  if (e.target.id === "clearHistory") {
    Store.clearHistory();
    renderBoard();
    renderShortcuts();
    return;
  }
  const item = e.target.closest(".hist-item");
  if (!item) return;
  userTouched = true;
  applyState({
    cat: item.dataset.cat,
    from: item.dataset.from,
    to: item.dataset.to,
    value: item.dataset.value,
    source: "history",
  });
});

document.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === "/" && !typingTarget(e.target)) {
    e.preventDefault();
    els.search.focus();
    els.search.select();
    return;
  }
  if (e.key === "Escape") {
    if (openBoard) {
      openBoard = null;
      renderBoard();
      return;
    }
    if (document.activeElement === els.search) {
      els.search.value = "";
      els.searchHint.hidden = true;
      renderCategories("");
      els.search.blur();
    }
    return;
  }
  if (typingTarget(e.target)) {
    if (e.key === "Enter" && (e.target === els.fromValue || e.target === els.toValue)) {
      e.preventDefault();
      els.copyBtn.click();
    }
    return;
  }
  if (e.key === "s" || e.key === "S") swapUnits();
  if (e.key === "p" || e.key === "P") els.pinBtn.click();
});

window.addEventListener("hashchange", () => {
  const hashed = readHash();
  if (hashed) applyState({ ...hashed, source: "hash" });
});

applyTheme();
Store.init();
renderCategories();
const hashed = readHash();
if (hashed) applyState({ ...hashed, source: "hash" });
else applyState({ cat: localStorage.getItem("convert.category") || "length", source: "init" });
Store.ready.then(() => {
  renderShortcuts();
  if (openBoard) renderBoard();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
