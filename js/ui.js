// Shared rendering helpers: formatting, icons, site chrome and the design-system components
// (StatCard, ChangeText) as HTML-string builders.

const f0 = n => Math.round(n).toLocaleString('en-US');
const f2 = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dirOf = n => n > 0 ? 'up' : n < 0 ? 'down' : 'flat';
// Explicit + on gains, true minus (−) on losses.
const signed = (n, s) => (n > 0 ? '+' : n < 0 ? '−' : '') + s;

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Lucide 0.460 outlines, inlined so pages work offline.
const ICONS = {
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  coins: '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>',
  'trending-up': '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>'
};

function icon(name, size = 18) {
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

// Fills every [data-icon] placeholder in static markup.
function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => {
    el.outerHTML = icon(el.dataset.icon, Number(el.dataset.size) || 18);
  });
}

// ---------- Site chrome ----------

const NAV = [
  { key: 'home', label: '首頁', href: 'index.html' },
  { key: 'limitup', label: '今日漲停股', href: 'limit-up.html' },
  { key: 'holdings', label: '我的持股', href: 'holdings.html' },
  { key: 'pnl', label: '損益總覽', href: '#pnl' },
  { key: 'about', label: '關於本站', href: '#about' }
];

function renderChrome(active) {
  document.getElementById('site-header').innerHTML = `
    <div class="topbar__inner">
      <a class="brand" href="index.html">台股投資小幫手</a>
      <nav class="nav" aria-label="主選單">
        ${NAV.map(n => `<a class="nav__link" href="${n.href}"${n.key === active ? ' aria-current="page"' : ''}>${n.label}</a>`).join('')}
      </nav>
    </div>`;
  document.getElementById('about').innerHTML = `
    <div class="footer__inner">
      <span>本站資料僅供參考，非投資建議。投資前請自行判斷並承擔風險。</span>
      <span>台股投資小幫手 · 收盤資料人工更新</span>
    </div>`;
}

// ---------- Components ----------

// The one way to render 漲跌: colour, sign and ▲▼.
function changeText({ value, percent, decimals = 0, arrow = true, size = 14 }) {
  const dir = dirOf(percent ?? value);
  const sign = dir === 'up' ? '+' : dir === 'down' ? '−' : '';
  const parts = [];
  if (value != null) parts.push(sign + Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }));
  if (percent != null) parts.push((arrow && dir !== 'flat' ? (dir === 'up' ? '▲ ' : '▼ ') : value != null ? '' : sign) + f2(Math.abs(percent)) + '%');
  return `<span class="chg is-${dir}" style="font-size:${size}px">${parts.map(p => `<span>${p}</span>`).join('')}</span>`;
}

function statCard({ label, iconName, unit, value, hint, dir = 'flat', colorValue = false, percent }) {
  return `
    <div class="card stat">
      <div class="stat__label">${icon(iconName, 15)}${esc(label)}</div>
      <div>
        <div class="stat__value${colorValue ? ` is-${dir}` : ''}">${unit ? `<span class="stat__unit">${esc(unit)}</span>` : ''}${esc(value)}</div>
        ${percent != null ? `<div class="stat__sub">${changeText({ percent, size: 13 })}</div>` : ''}
        ${hint ? `<div class="stat__hint">${esc(hint)}</div>` : ''}
      </div>
    </div>`;
}
