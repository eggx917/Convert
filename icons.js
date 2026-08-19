const ICONS = {
  length:
    '<path d="M3 12h18"/><path d="M4 8v8"/><path d="M20 8v8"/>',
  weight:
    '<circle cx="6" cy="12" r="3"/><circle cx="18" cy="12" r="3"/><path d="M9 12h6"/>',
  temperature:
    '<path d="M10.5 14.2V7a1.5 1.5 0 0 1 3 0v7.2"/><circle cx="12" cy="17.2" r="3.2"/>',
  volume:
    '<path d="M7 4h10l-1.5 16H8.5L7 4z"/><path d="M9 11h6"/>',
  area:
    '<rect x="4.5" y="4.5" width="15" height="15" rx="1"/><path d="M4.5 12h15M12 4.5v15"/>',
  cooking:
    '<path d="M8 3v8M12 3v8M16 3v8M8 11h8M12 11v10"/>',
  currency:
    '<circle cx="9.5" cy="13" r="5.5"/><circle cx="14.5" cy="11" r="5.5"/>',
  speed:
    '<path d="M4.5 17a8.5 8.5 0 0 1 15 0"/><path d="M12 17l4.2-6"/>',
  time:
    '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/>',
  fuel:
    '<path d="M12 3s6.2 7 6.2 12.1A6.2 6.2 0 1 1 5.8 15.1C5.8 10 12 3 12 3z"/>',
  data:
    '<rect x="4" y="11" width="4.2" height="9" rx="1"/><rect x="10" y="5" width="4.2" height="15" rx="1"/><rect x="16" y="8.5" width="4.2" height="11.5" rx="1"/>',
  energy:
    '<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(50 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(-50 12 12)"/>',
  power:
    '<path d="M13 2 5.5 13H12l-1.2 9 8.2-12H12.2L13 2z"/>',
  pressure:
    '<path d="M12 3v12"/><path d="M8 11l4 4 4-4"/><path d="M5 20h14"/>',
  force:
    '<path d="M3 12h13"/><path d="M12 8l4 4-4 4"/><path d="M20 5v14"/>',
  density:
    '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="6.4"/><circle cx="12" cy="12" r="9.6"/>',
  angle:
    '<path d="M5 19h15"/><path d="M5 19V5"/><path d="M5 19a11 11 0 0 1 9-10.5"/>',
  frequency:
    '<path d="M3 12c1.7-7 3.3 7 5 0s3.3 7 5 0 3.3-7 5 0 3.3 7 5 0"/>',
  illuminance:
    '<circle cx="12" cy="12" r="3.4"/><path d="M12 3.2v2.3M12 18.5v2.3M4.5 4.5l1.7 1.7M17.8 17.8l1.7 1.7M3.2 12h2.3M18.5 12h2.3M4.5 19.5l1.7-1.7M17.8 6.2l1.7-1.7"/>',
};

function iconSvg(id) {
  const inner = ICONS[id];
  if (!inner) return "";
  return `<svg class="chip-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
