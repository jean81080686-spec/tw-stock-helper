// Market data and the holdings store shared by all three pages.
// Prices are the 2026/10/27 close, entered by hand. Update this file after each close.

const AS_OF = '2026/10/27';
// Optional note shown after the date (e.g. a market holiday); '' shows nothing.
const AS_OF_NOTE = '';
const LIMIT_UP_UPDATED = '2026/10/27 14:58';

// code -> [name, close, previous close, as-of date if older than AS_OF]
// Stocks with a date in the 4th slot had no verified 10/27 close, so they keep that older close with no change.
const QUOTES = {
  '2330': ['台積電', 2400, 2385], '2317': ['鴻海', 247.5, 245], '2454': ['聯發科', 3960, 4010],
  '0050': ['元大台灣50', 106.6, 106.9], '2882': ['國泰金', 113.5, 113.5, '2026/10/22'], '2881': ['富邦金', 162, 158.5],
  '2412': ['中華電', 158, 158, '2026/10/22'], '2308': ['台達電', 1510, 1560], '3406': ['玉晶光', 1160, 1160, '2026/10/22'],
  '6213': ['聯茂', 777, 777, '2026/10/22'], '6278': ['台表科', 316.5, 316.5, '2026/10/21'], '2492': ['華新科', 368, 368, '2026/10/22'],
  '4720': ['德淵', 29.25, 29.25, '2026/10/21'], '0056': ['元大高股息', 56.3, 56.3, '2026/10/22'], '2468': ['華經', 55, 55, '2026/10/22'],
  '4526': ['東台', 45.15, 41.05]
};

const MARKET = {
  taiex: { value: 46096.23, change: 54.80, percent: 0.12 },
  otc: { value: 379.20, change: -2.49, percent: -0.65 }
};

const LIMIT_UP_CATS = [
  { key: 'news', label: '主角新聞', tone: 'accent' },
  { key: 'exec', label: '高層發言・營收財報', tone: 'info' },
  { key: 'infer', label: '查不到新聞屬推論', tone: 'warning' }
];

// From the 「20261027 漲停股新聞摘要」 email. `short` is the one-line reason on the homepage;
// `reason` is the full text on 今日漲停股.
const LIMIT_UPS = [
  { code: '4526', name: '東台', price: 45.15, change: 4.10, pct: 9.99, cat: 'news',
    short: 'PCB鑽孔機訂單看到2027年底，9月營收年增81%',
    reason: '公司自己說 PCB 鑽孔機訂單能見度「直達 2027 年底」，產能滿載、正在擴產；9 月營收 7.07 億元，年增 81%，創 36 個月新高。10/26 東京工具機展開幕，董事長嚴瑞雄說集團要跟著台積電去熊本搶日本半導體商機。今天和上銀等工具機股一起漲停，外資連 2 日買進約 1.1 萬張（成值、成量兩榜都有）。' }
];

// ---------- Holdings store (localStorage) ----------

const HOLDINGS_KEY = 'twhelper.holdings.v1';
// Costs sit near recent prices so the sample shows a realistic mix of gains and losses.
const SAMPLE_HOLDINGS = [
  { id: 1, code: '2330', shares: 1000, cost: 1980 },
  { id: 2, code: '2317', shares: 2000, cost: 228 },
  { id: 3, code: '2454', shares: 200, cost: 4280 },
  { id: 4, code: '0050', shares: 3000, cost: 98.5 },
  { id: 5, code: '2882', shares: 5000, cost: 118.2 }
];
// Costs of the first sample set; saved sample rows still at these costs are moved to the new ones.
const OLD_SAMPLE_COSTS = { 1: ['2330', 820], 2: ['2317', 168.5], 3: ['2454', 1320], 4: ['0050', 168.2], 5: ['2882', 64.8] };

function migrateSampleCost(h) {
  const old = OLD_SAMPLE_COSTS[h.id];
  if (!old || old[0] !== h.code || old[1] !== h.cost) return h;
  return { ...h, cost: SAMPLE_HOLDINGS.find(s => s.id === h.id).cost };
}

// Returns { list, nextId }. Falls back to the sample holdings when nothing is stored
// or storage is unavailable (private mode, blocked site data).
function loadHoldings() {
  try {
    const raw = localStorage.getItem(HOLDINGS_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      const list = (saved.list || []).filter(h => QUOTES[h.code] && h.shares > 0 && h.cost > 0).map(migrateSampleCost);
      const nextId = Math.max(saved.nextId || 1, ...list.map(h => h.id + 1));
      return { list, nextId };
    }
  } catch (e) { /* fall through to sample data */ }
  return { list: SAMPLE_HOLDINGS.slice(), nextId: SAMPLE_HOLDINGS.length + 1 };
}

function saveHoldings(state) {
  try { localStorage.setItem(HOLDINGS_KEY, JSON.stringify({ list: state.list, nextId: state.nextId })); } catch (e) { /* not persisted */ }
}

// Values each holding at the latest close and totals the portfolio.
function valueHoldings(list) {
  let mv = 0, cost = 0, prevMv = 0;
  const rows = list.map(h => {
    const [name, price, prev, priceDate] = QUOTES[h.code];
    const rowMv = h.shares * price, base = h.shares * h.cost, pnl = rowMv - base;
    mv += rowMv; cost += base; prevMv += h.shares * prev;
    return { ...h, name, price, priceDate, mv: rowMv, pnl, ret: base ? pnl / base * 100 : 0 };
  });
  const pnl = mv - cost, today = mv - prevMv;
  return {
    rows,
    totals: { count: rows.length, mv, cost, pnl, ret: cost ? pnl / cost * 100 : 0, today, todayPct: prevMv ? today / prevMv * 100 : 0 }
  };
}
