// Market data and the holdings store shared by all three pages.
// Prices are the 2026/10/29 close, entered by hand. Update this file after each close.

const AS_OF = '2026/10/29';
// Optional note shown after the date (e.g. a market holiday); '' shows nothing.
const AS_OF_NOTE = '';
const LIMIT_UP_UPDATED = '2026/10/29 15:00';

// code -> [name, close, previous close, as-of date if older than AS_OF]
// Stocks with a date in the 4th slot had no verified 10/29 close, so they keep that older close with no change.
const QUOTES = {
  '2330': ['台積電', 2415, 2425], '2317': ['鴻海', 248, 251.5], '2454': ['聯發科', 4045, 4235],
  '0050': ['元大台灣50', 107.25, 108.65], '2882': ['國泰金', 116.5, 115.5], '2881': ['富邦金', 162, 161],
  '2412': ['中華電', 158, 156.5], '2308': ['台達電', 1480, 1550], '3406': ['玉晶光', 1200, 1330],
  '6213': ['聯茂', 777, 777, '2026/10/22'], '6278': ['台表科', 316.5, 316.5, '2026/10/21'], '2492': ['華新科', 368, 368, '2026/10/22'],
  '4720': ['德淵', 29.25, 29.25, '2026/10/21'], '0056': ['元大高股息', 56.9, 57.25], '2468': ['華經', 55, 55, '2026/10/22'],
  '4526': ['東台', 49.65, 49.65, '2026/10/28'], '3105': ['穩懋', 594, 540], '3189': ['景碩', 959, 1035],
  '3605': ['宏致', 171.5, 171.5, '2026/10/28'], '6456': ['GIS-KY', 107.5, 107.5, '2026/10/28'], '4960': ['誠美材', 34.8, 34.8, '2026/10/28'],
  '3006': ['晶豪科', 275.5, 275.5, '2026/10/28'], '6415': ['矽力-KY', 525, 525, '2026/10/28'], '3443': ['創意', 8170, 8170, '2026/10/28'],
  '2368': ['金像電', 1185, 1185, '2026/10/28'], '3260': ['威剛', 363.5, 363.5, '2026/10/28'], '1815': ['富喬', 144, 144, '2026/10/28'],
  '2455': ['全新', 512, 512, '2026/10/28'], '3035': ['智原', 231.5, 210.5], '2352': ['佳世達', 32.8, 29.85]
};

const MARKET = {
  taiex: { value: 46368.33, change: -667.25, percent: -1.42 },
  otc: { value: 387.37, change: -7.24, percent: -1.83 }
};

const LIMIT_UP_CATS = [
  { key: 'news', label: '主角新聞', tone: 'accent' },
  { key: 'exec', label: '高層發言・營收財報', tone: 'info' },
  { key: 'infer', label: '查不到新聞屬推論', tone: 'warning' }
];

// From the 「20261029 漲停股新聞摘要」 email. `short` is the one-line reason on the homepage;
// `reason` is the full text on 今日漲停股.
const LIMIT_UPS = [
  { code: '3035', name: '智原', price: 231.5, change: 21.00, pct: 9.98, cat: 'news',
    short: '拿下美系2奈米AI ASIC大單，總經理稱明年營收雙位數成長',
    reason: '第二天漲停。10/27 法說拿下美系客戶 2 奈米 GAA 雲端 AI ASIC 專案，NRE 數千萬美元、公司史上最大，採三星代工並與聯電合作，2027 上半年開始認列。總經理王國雍：2027 年營收雙位數成長，明年上半年 4 個專案 Tape-out。Q3 EPS 1.07 元、IP 營收 4.5 億元創新高。今天聯電法說後跌停，智原逆勢續鎖漲停。' },
  { code: '2352', name: '佳世達', price: 32.8, change: 2.95, pct: 9.88, cat: 'news',
    short: '自研無人機接安防巡檢訂單，稱2027年單月有機會破千台',
    reason: '總經理柯淑芬 10/28 宣布自研無人機新接大型安防夥伴巡檢訂單、以 Qisda 品牌交貨，桃園廠產線已就緒，「2027 年單月非常有機會出貨突破千台」；AI 整櫃方案（1.6T 液冷交換器、AI 伺服器）Q4 出貨。今天爆量 8.7 萬張（前日 14 倍）收漲停。' },
  { code: '3105', name: '穩懋', price: 594, change: 54.00, pct: 10.00, cat: 'exec',
    short: 'Q3 EPS 4.55元六年最佳，稱Q4營收可望延續季增',
    reason: '第二天漲停。10/28 法說 Q3 EPS 4.55 元、六年來最佳，前三季 EPS 8.12 元已超越去年全年，毛利率 37.4%；永豐投顧目標價 395→714 元。管理總處總經理陳舜平：Q4 靠衛星新規格與光通產能到位，「營收可望延續季增態勢」（估季增 1–3%、毛利率 37–39%）。10/27 另有新創 PicoJool 宣布找穩懋代工 VCSEL、進軍 AI 光通訊（10/28 第一根漲停的主因）。' }
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
