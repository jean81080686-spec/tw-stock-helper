// Sample market data and the holdings store shared by all three pages.
// All prices are sample data for 2026/10/23; replace with a real quote feed later.

const AS_OF = '2026/10/23';
const LIMIT_UP_UPDATED = '2026/10/23 14:45';

// code -> [name, close, previous close]
const QUOTES = {
  '2330': ['台積電', 1085, 1070], '2317': ['鴻海', 212, 214.5], '2454': ['聯發科', 1265, 1250],
  '0050': ['元大台灣50', 196.35, 195.1], '2882': ['國泰金', 61.2, 61.5], '2881': ['富邦金', 88.4, 88],
  '2412': ['中華電', 128.5, 128.5], '2308': ['台達電', 412, 405.5], '3406': ['玉晶光', 528, 480],
  '6213': ['聯茂', 98.5, 89.6], '6278': ['台表科', 132, 120], '2492': ['華新科', 118.5, 107.75],
  '4720': ['德淵', 45.65, 41.5], '0056': ['元大高股息', 37.82, 37.9]
};

const MARKET = {
  taiex: { value: 23456.78, change: 182.35, percent: 0.78, prev: 23274.43, trend: [23274, 23310, 23288, 23352, 23401, 23376, 23420, 23398, 23441, 23457] },
  otc: { value: 251.34, change: -1.12, percent: -0.44, prev: 252.46, trend: [252.46, 252.8, 252.1, 251.7, 251.9, 251.2, 250.9, 251.4, 251.1, 251.34] }
};

const LIMIT_UP_CATS = [
  { key: 'news', label: '主角新聞', tone: 'accent' },
  { key: 'exec', label: '高層發言・營收財報', tone: 'info' },
  { key: 'infer', label: '查不到新聞屬推論', tone: 'warning' }
];

// `short` is the one-line reason on the homepage; `reason` is the full text on 今日漲停股.
const LIMIT_UPS = [
  { code: '3406', name: '玉晶光', price: 528, change: 48, pct: 10.00, cat: 'news',
    short: '新款旗艦手機潛望式鏡頭擴大採用，第四季出貨可望放量。',
    reason: '外電報導新款旗艦手機潛望式鏡頭擴大採用，玉晶光被點名為主要鏡頭模組供應商，市場預期第四季出貨將明顯放量。' },
  { code: '6213', name: '聯茂', price: 98.5, change: 8.9, pct: 9.93, cat: 'exec',
    short: '9 月營收年增 32% 創新高，AI 伺服器板材訂單排至明年。',
    reason: '公布 9 月營收年增 32%，創單月新高。董事長於法說會表示 AI 伺服器用高速銅箔基板訂單已排至明年第一季。' },
  { code: '6278', name: '台表科', price: 132, change: 12, pct: 10.00, cat: 'news',
    short: '擴建高雄 SMT 新產線，承接 AI 伺服器與車用訂單。',
    reason: '宣布擴建高雄 SMT 新產線，主要承接 AI 伺服器與車用電子訂單，預計明年上半年投產。' },
  { code: '2492', name: '華新科', price: 118.5, change: 10.75, pct: 9.98, cat: 'infer',
    short: '無個股新聞，推論受被動元件族群走強帶動。',
    reason: '當日無個股新聞。推論受被動元件族群走強帶動，市場預期 MLCC 報價止跌回升，資金同步湧入同族群個股。' },
  { code: '4720', name: '德淵', price: 45.65, change: 4.15, pct: 10.00, cat: 'infer',
    short: '查無新聞，量增 4 倍，推論為短線資金拉抬。',
    reason: '查無相關新聞。股本小、籌碼集中，當日成交量放大至近月均量 4 倍，推論為短線資金拉抬。' }
];

// ---------- Holdings store (localStorage) ----------

const HOLDINGS_KEY = 'twhelper.holdings.v1';
const SAMPLE_HOLDINGS = [
  { id: 1, code: '2330', shares: 1000, cost: 820 },
  { id: 2, code: '2317', shares: 2000, cost: 168.5 },
  { id: 3, code: '2454', shares: 200, cost: 1320 },
  { id: 4, code: '0050', shares: 3000, cost: 168.2 },
  { id: 5, code: '2882', shares: 5000, cost: 64.8 }
];

// Returns { list, nextId }. Falls back to the sample holdings when nothing is stored
// or storage is unavailable (private mode, blocked site data).
function loadHoldings() {
  try {
    const raw = localStorage.getItem(HOLDINGS_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      const list = (saved.list || []).filter(h => QUOTES[h.code] && h.shares > 0 && h.cost > 0);
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
    const [name, price, prev] = QUOTES[h.code];
    const rowMv = h.shares * price, base = h.shares * h.cost, pnl = rowMv - base;
    mv += rowMv; cost += base; prevMv += h.shares * prev;
    return { ...h, name, price, mv: rowMv, pnl, ret: base ? pnl / base * 100 : 0 };
  });
  const pnl = mv - cost, today = mv - prevMv;
  return {
    rows,
    totals: { count: rows.length, mv, cost, pnl, ret: cost ? pnl / cost * 100 : 0, today, todayPct: prevMv ? today / prevMv * 100 : 0 }
  };
}
