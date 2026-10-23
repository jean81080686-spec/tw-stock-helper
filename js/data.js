// Market data and the holdings store shared by all three pages.
// Prices are the 2026/10/22 close, entered by hand: 10/23 was a typhoon (薔琵) market holiday,
// so 10/22 is the latest trading day. Update this file after each close.

const AS_OF = '2026/10/22';
const AS_OF_NOTE = '10/23 颱風休市';
const LIMIT_UP_UPDATED = '2026/10/22 14:57';

// code -> [name, close, previous close, as-of date if older than AS_OF]
// 0056 went ex-dividend on 10/22; its previous close is the ex-dividend reference price.
// 6278 and 4720: no verified 10/22 close was found, so they show the 10/21 close with no change.
const QUOTES = {
  '2330': ['台積電', 2385, 2420], '2317': ['鴻海', 245, 250], '2454': ['聯發科', 4010, 4140],
  '0050': ['元大台灣50', 106.9, 108.15], '2882': ['國泰金', 113.5, 114], '2881': ['富邦金', 158.5, 158.5],
  '2412': ['中華電', 158, 154], '2308': ['台達電', 1560, 1625], '3406': ['玉晶光', 1160, 1140],
  '6213': ['聯茂', 777, 823], '6278': ['台表科', 316.5, 316.5, '2026/10/21'], '2492': ['華新科', 368, 405.5],
  '4720': ['德淵', 29.25, 29.25, '2026/10/21'], '0056': ['元大高股息', 56.3, 57.05], '2468': ['華經', 55, 50]
};

const MARKET = {
  taiex: { value: 46041.43, change: -846.34, percent: -1.81 },
  otc: { value: 381.69, change: -13.73, percent: -3.47 }
};

const LIMIT_UP_CATS = [
  { key: 'news', label: '主角新聞', tone: 'accent' },
  { key: 'exec', label: '高層發言・營收財報', tone: 'info' },
  { key: 'infer', label: '查不到新聞屬推論', tone: 'warning' }
];

// From the 「20261022 漲停股新聞摘要」 email. `short` is the one-line reason on the homepage;
// `reason` is the full text on 今日漲停股.
const LIMIT_UPS = [
  { code: '2468', name: '華經', price: 55, change: 5, pct: 10.00, cat: 'infer',
    short: 'AI 資安族群題材帶動，公司本身無新消息，屬推論。',
    reason: '創一年新高，9 個交易日漲逾 35%。當天新聞都是族群綜述：PHP 爆出由 AI 發現的重大漏洞「PHP2Shell」，多國網站緊急下架修補，資安與系統整合股（驊宏資、晉泰、東捷資訊、大世科）集體漲停，華經名列其中。基本面支撐是 9 月營收 3.08 億元、年增 68.8%，創 3 年多新高（公司 10/16 指出來自大型專案驗收），但前三季累計仍年減 4%；10/17–10/22 期間查無高層發言，也沒有新產品、新訂單。' }
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
