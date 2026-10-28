// Market data and the holdings store shared by all three pages.
// Prices are the 2026/10/28 close, entered by hand. Update this file after each close.

const AS_OF = '2026/10/28';
// Optional note shown after the date (e.g. a market holiday); '' shows nothing.
const AS_OF_NOTE = '';
const LIMIT_UP_UPDATED = '2026/10/28 15:11';

// code -> [name, close, previous close, as-of date if older than AS_OF]
// Stocks with a date in the 4th slot had no verified 10/28 close, so they keep that older close with no change.
const QUOTES = {
  '2330': ['台積電', 2425, 2400], '2317': ['鴻海', 251.5, 247.5], '2454': ['聯發科', 4235, 3960],
  '0050': ['元大台灣50', 106.6, 106.6, '2026/10/27'], '2882': ['國泰金', 115.5, 114], '2881': ['富邦金', 161, 162],
  '2412': ['中華電', 158, 158, '2026/10/22'], '2308': ['台達電', 1550, 1510], '3406': ['玉晶光', 1330, 1210],
  '6213': ['聯茂', 777, 777, '2026/10/22'], '6278': ['台表科', 316.5, 316.5, '2026/10/21'], '2492': ['華新科', 368, 368, '2026/10/22'],
  '4720': ['德淵', 29.25, 29.25, '2026/10/21'], '0056': ['元大高股息', 57.25, 56.55], '2468': ['華經', 55, 55, '2026/10/22'],
  '4526': ['東台', 49.65, 45.15], '3105': ['穩懋', 540, 491], '3189': ['景碩', 1035, 941],
  '3605': ['宏致', 171.5, 156], '6456': ['GIS-KY', 107.5, 97.8], '4960': ['誠美材', 34.8, 31.65],
  '3006': ['晶豪科', 275.5, 250.5], '6415': ['矽力-KY', 525, 478], '3443': ['創意', 8170, 7430],
  '2368': ['金像電', 1185, 1080], '3260': ['威剛', 363.5, 330.5], '1815': ['富喬', 144, 131],
  '2455': ['全新', 512, 466]
};

const MARKET = {
  taiex: { value: 47035.58, change: 939.35, percent: 2.04 },
  otc: { value: 394.61, change: 15.41, percent: 4.06 }
};

const LIMIT_UP_CATS = [
  { key: 'news', label: '主角新聞', tone: 'accent' },
  { key: 'exec', label: '高層發言・營收財報', tone: 'info' },
  { key: 'infer', label: '查不到新聞屬推論', tone: 'warning' }
];

// From the 「20261028 漲停股新聞摘要」 email. `short` is the one-line reason on the homepage;
// `reason` is the full text on 今日漲停股.
const LIMIT_UPS = [
  { code: '4526', name: '東台', price: 49.65, change: 4.50, pct: 9.97, cat: 'news',
    short: '接日韓PCB鑽孔機長單，Q4滿載，訂單看到2028上半年',
    reason: '董事長嚴瑞雄 10/27 在東京表示，接獲多家日、韓客戶高階 PCB 鑽孔機年度長單，Q4 接單已滿載；部分訂單看到 2028 上半年，在手訂單逾 32 億元。9 月營收 7.07 億元、年增 81%。連兩天漲停。' },
  { code: '3105', name: '穩懋', price: 540, change: 49.00, pct: 9.98, cat: 'news',
    short: '與PicoJool合作代工VCSEL，Q3 EPS六年新高',
    reason: '美國新創 PicoJool 宣布與穩懋合作代工 200G VCSEL，切入 AI 光通訊；當天法說公布 Q3 EPS 4.55 元、六年新高，前三季 EPS 8.12 元，公司預估 Q4 營收季增約 3–5%、毛利率 37–39%。' },
  { code: '3189', name: '景碩', price: 1035, change: 94.00, pct: 9.99, cat: 'news',
    short: '接輝達CPU載板大單，產能訂到2030年',
    reason: '接下輝達 CPU 載板大單、產能預訂到 2030 年；發言人穆顯爵稱缺料「一直到 2027 年的年底，你都看不到曙光」；公司稱明年 ABF/BT 報價漲幅可能超過今年（今年約漲 20%）。' },
  { code: '3406', name: '玉晶光', price: 1330, change: 120.00, pct: 9.92, cat: 'news',
    short: '引資3M合作EBO光通訊，美系外資目標價上調至1,380元',
    reason: '引資美商 3M（約 48 億元、持股 4.68%）合作 EBO 光通訊，3M 執行長稱將透過玉晶光擴產、EBO 營收明年翻倍；美系外資目標價上調至 1,380 元。' },
  { code: '3605', name: '宏致', price: 171.5, change: 15.50, pct: 9.94, cat: 'news',
    short: '擴大Bloom Energy高壓線布局，已打入AWS',
    reason: '擴大 Bloom Energy 高壓線布局（供貨量占逾 1/3），已打入 AWS、Meta ASIC 伺服器；Q4 AI 營收占比估 30%，明年連接器目標逾 5,000 萬顆。' },
  { code: '6456', name: 'GIS-KY', price: 107.5, change: 9.70, pct: 9.92, cat: 'news',
    short: '轉型光通訊，投40–50億元做雷射光源封測；觸控本業仍衰退',
    reason: '轉型光通訊，40–50 億元投入 800G 以上雷射光源封測，Q4 拚小量出貨、2027 年放大；但觸控本業前九月營收仍年減 18.5%。' },
  { code: '4960', name: '誠美材', price: 34.8, change: 3.15, pct: 9.95, cat: 'news',
    short: '布局半導體先進封裝材料與資產活化，但Q3仍虧損，題材成分高',
    reason: '布局半導體先進封裝材料與資產活化，開盤一字鎖漲停；但 Q3 仍每股虧損 0.39 元，題材成分較高。' },
  { code: '3006', name: '晶豪科', price: 275.5, change: 25.00, pct: 9.98, cat: 'exec',
    short: 'Q3 EPS 36.79元、淨利破百億，稱供不應求超3成',
    reason: 'Q3 EPS 36.79 元、淨利首破百億；公司表示「供不應求幅度約超過 3 成」，吃緊恐延續至 2028 年；SK 海力士財報亮眼帶動記憶體族群。' },
  { code: '6415', name: '矽力-KY', price: 525, change: 47.00, pct: 9.83, cat: 'exec',
    short: 'Q3營收72.84億元創高，稱未來半年資料中心需求仍強勁',
    reason: 'Q3 營收 72.84 億元創新高；公司表示未來半年資料中心需求「仍會非常強勁」，明年資料中心占比有機會逾 20%。' },
  { code: '3443', name: '創意', price: 8170, change: 740.00, pct: 9.96, cat: 'infer',
    short: '受惠Anthropic招股書揭露算力承諾，ASIC族群大漲',
    reason: '查不到公司當天新聞，推論受惠 Anthropic 招股書揭露約 8,070 億美元算力承諾、逾半給 Google TPU，ASIC 族群大漲；Aletheia 喊目標價 1.2 萬元。' },
  { code: '2368', name: '金像電', price: 1185, change: 105.00, pct: 9.72, cat: 'infer',
    short: 'PCB族群大漲加低軌衛星題材，大摩點名看好',
    reason: '查不到公司當天新聞，推論為 PCB 族群大漲＋低軌衛星題材，大摩點名看好；背景為 9/29 亞馬遜參與私募約 15.88 億元。' },
  { code: '3260', name: '威剛', price: 363.5, change: 33.00, pct: 9.98, cat: 'infer',
    short: '跟隨SK海力士財報點火的記憶體族群反彈',
    reason: '查不到公司當天新聞，推論為跟隨 SK 海力士財報點火的記憶體族群反彈（前一日重挫近 7%）。' },
  { code: '1815', name: '富喬', price: 144, change: 13.00, pct: 9.92, cat: 'infer',
    short: '高階玻纖布題材，傳Low DK2獲CSP認證，9月營收創高',
    reason: '查不到公司當天新聞，僅有股價新聞；推論為高階玻纖布題材、傳 Low DK2 獲 CSP 認證、9 月營收創新高。' },
  { code: '2455', name: '全新', price: 512, change: 46.00, pct: 9.87, cat: 'infer',
    short: '美股光通訊大漲帶動族群，磷化銦缺料可望漲價',
    reason: '查不到公司當天新聞，推論為美股光通訊大漲帶動族群，磷化銦缺料、可望轉嫁漲價（受惠）。' }
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
