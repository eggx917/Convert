const ICONS = {
  length:
    '<path d="M3 12h18"/><path d="M4 8v8"/><path d="M20 8v8"/><path d="M9 9.5v5"/><path d="M15 9.5v5"/>',
  weight:
    '<rect x="2" y="8" width="5.2" height="8" rx="0.9"/><rect x="16.8" y="8" width="5.2" height="8" rx="0.9"/><path d="M7.2 12h9.6"/>',
  temperature:
    '<path d="M10.5 14.2V6.6a1.5 1.5 0 0 1 3 0v7.6"/><circle cx="12" cy="17.2" r="3.2"/><path d="M12 10v4"/>',
  volume:
    '<path d="M8 4h8l-1.3 16H9.3L8 4z"/><path d="M9.6 11h4.8"/>',
  area:
    '<rect x="4.5" y="4.5" width="15" height="15" rx="1"/><path d="M4.5 12h15M12 4.5v15"/>',
  cooking:
    '<path d="M8 3v8M12 3v8M16 3v8M8 11h8M12 11v10"/>',
  currency:
    '<path d="M12 4.2v15.6"/><path d="M16.3 7.8c-.7-1.6-2.1-2.5-4.3-2.5-2.5 0-4.2 1.4-4.2 3.3 0 4.2 8.4 1.9 8.4 6.2 0 2-1.8 3.5-4.2 3.5-2.1 0-3.7-1.1-4.3-2.8"/>',
  speed:
    '<path d="M3 8h8.5"/><path d="M3 12h11"/><path d="M3 16h8.5"/><path d="M14.5 6.5 21 12l-6.5 5.5"/>',
  time:
    '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/>',
  fuel:
    '<path d="M12 3s6.2 7 6.2 12.1A6.2 6.2 0 1 1 5.8 15.1C5.8 10 12 3 12 3z"/>',
  data:
    '<path d="M4 8.2 12 4.6l8 3.6-8 3.6z"/><path d="M4 12.4l8 3.6 8-3.6"/><path d="M4 16.6l8 3.6 8-3.6"/>',
  energy:
    '<rect x="3" y="8" width="15" height="8" rx="1.6"/><path d="M20 10.4v3.2"/><path d="M7 12h6"/>',
  power:
    '<path d="M13 2 5.5 13H12l-1.2 9 8.2-12H12.2L13 2z"/>',
  pressure:
    '<path d="M12 4v11"/><path d="M8 11.5l4 4 4-4"/><path d="M5 20h14"/>',
  force:
    '<path d="M3 12h11"/><path d="M10 8l4 4-4 4"/><rect x="17.2" y="5.5" width="3.6" height="13" rx="0.6"/>',
  density:
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none"/>',
  angle:
    '<path d="M5 19h15"/><path d="M5 19V5"/><path d="M5 19a10 10 0 0 1 8.6-9.9"/>',
  frequency:
    '<path d="M3 12c1.7-7 3.3 7 5 0s3.3 7 5 0 3.3-7 5 0 3.3 7 5 0"/>',
  illuminance:
    '<circle cx="12" cy="12" r="3.4"/><path d="M12 3.2v2.3M12 18.5v2.3M4.5 4.5l1.7 1.7M17.8 17.8l1.7 1.7M3.2 12h2.3M18.5 12h2.3M4.5 19.5l1.7-1.7M17.8 6.2l1.7-1.7"/>',
};

function iconSvg(id) {
  const inner = ICONS[id];
  if (!inner) return "";
  return `<svg class="chip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
