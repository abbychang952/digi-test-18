// IFRS 18 類別定義
const CATEGORIES = {
  operating:     { label: "營業",     color: "#0b5cad" },
  investing:     { label: "投資",     color: "#0e9384" },
  financing:     { label: "籌資",     color: "#c27a0e" },
  tax:           { label: "所得稅",   color: "#6d4fc2" },
  discontinued:  { label: "停業單位", color: "#64748b" },
};

// 範例公司：一般企業（非金融業）
// oldSection: 現行台灣財報格式中所在的區塊（operating = 營業利益以上；nonOperating = 營業外收入及支出）
const SAMPLE_ITEMS = [
  { name: "營業收入",                         amount: 10000, category: "operating",    oldSection: "operating",    hint: "主要營業活動" },
  { name: "營業成本",                         amount: -6000, category: "operating",    oldSection: "operating",    hint: "主要營業活動" },
  { name: "推銷費用",                         amount: -800,  category: "operating",    oldSection: "operating",    hint: "主要營業活動" },
  { name: "管理費用",                         amount: -700,  category: "operating",    oldSection: "operating",    hint: "主要營業活動" },
  { name: "研究發展費用",                     amount: -500,  category: "operating",    oldSection: "operating",    hint: "主要營業活動" },
  { name: "其他收益及費損淨額",               amount: 50,    category: "operating",    oldSection: "operating",    hint: "例如處分不動產、廠房及設備損益" },
  { name: "利息收入（銀行存款）",             amount: 120,   category: "investing",    oldSection: "nonOperating", hint: "現金及約當現金產生之收益" },
  { name: "股利收入",                         amount: 80,    category: "investing",    oldSection: "nonOperating", hint: "個別且很大程度獨立產生報酬之資產" },
  { name: "採用權益法認列之關聯企業損益份額", amount: 200,   category: "investing",    oldSection: "nonOperating", hint: "權益法投資一律列投資類別" },
  { name: "透過損益按公允價值衡量之金融資產利益", amount: 60, category: "investing",   oldSection: "nonOperating", hint: "個別且很大程度獨立產生報酬之資產" },
  { name: "外幣兌換利益（應收帳款）",         amount: 40,    category: "operating",    oldSection: "nonOperating", hint: "依產生項目分類：應收帳款屬營業" },
  { name: "銀行借款利息費用",                 amount: -150,  category: "financing",    oldSection: "nonOperating", hint: "僅涉及籌集資金之負債" },
  { name: "租賃負債利息費用",                 amount: -30,   category: "financing",    oldSection: "nonOperating", hint: "其他負債之利息費用" },
  { name: "淨確定福利負債利息",               amount: -10,   category: "financing",    oldSection: "nonOperating", hint: "其他負債之利息費用" },
  { name: "所得稅費用",                       amount: -472,  category: "tax",          oldSection: "tax",          hint: "所得稅類別" },
  { name: "停業單位損益",                     amount: -88,   category: "discontinued", oldSection: "discontinued", hint: "停業單位類別" },
];
