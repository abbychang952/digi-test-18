// ===== IFRS 18 損益表試算工具 =====
let items = [];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const fmt = (n) => {
  const s = Math.abs(n).toLocaleString("zh-TW");
  return n < 0 ? `(${s})` : s;
};

const sumBy = (pred) => items.filter(pred).reduce((t, i) => t + (Number(i.amount) || 0), 0);

function resetItems() {
  items = SAMPLE_ITEMS.map((i) => ({ ...i }));
  render();
}

function renderItems() {
  const list = document.getElementById("items-body");
  list.innerHTML = "";

  const options = Object.entries(CATEGORIES)
    .map(([key, c]) => `<option value="${key}">${c.label}</option>`)
    .join("");

  items.forEach((item, idx) => {
    const row = document.createElement("div");
    row.className = "item-row";
    row.innerHTML = `
      <div class="item-main">
        <input class="item-name" type="text" aria-label="科目名稱">
        <div class="item-hint"></div>
      </div>
      <input class="item-amount" type="number" aria-label="金額">
      <select class="cat-pill" aria-label="IFRS 18 類別">${options}</select>
      <button class="item-del" title="刪除" aria-label="刪除科目">×</button>
    `;

    const name = row.querySelector(".item-name");
    const amount = row.querySelector(".item-amount");
    const select = row.querySelector(".cat-pill");
    name.value = item.name;
    amount.value = item.amount;
    select.value = item.category;
    select.dataset.cat = item.category;
    row.querySelector(".item-hint").textContent = item.hint || "";

    name.addEventListener("input", () => {
      item.name = name.value;
      renderStatement();
    });
    amount.addEventListener("input", () => {
      item.amount = Number(amount.value) || 0;
      renderStatement();
    });
    select.addEventListener("change", () => {
      item.category = select.value;
      select.dataset.cat = item.category;
      renderStatement();
    });
    row.querySelector(".item-del").addEventListener("click", () => {
      items.splice(idx, 1);
      render();
    });

    list.appendChild(row);
  });
}

function renderStatement() {
  const lines = (cat) =>
    items
      .filter((i) => i.category === cat)
      .map((i) => `<tr><td class="indent">${esc(i.name)}</td><td class="num">${fmt(i.amount)}</td></tr>`)
      .join("");

  const header = (cat) =>
    `<tr class="cat-row"><td colspan="2"><span class="cat-bar" style="background:${CATEGORIES[cat].color}"></span>${CATEGORIES[cat].label}類別</td></tr>`;

  const subtotal = (label, value, cls = "") =>
    `<tr class="subtotal ${cls}"><td>${label}</td><td class="num">${fmt(value)}</td></tr>`;

  const operating = sumBy((i) => i.category === "operating");
  const investing = sumBy((i) => i.category === "investing");
  const financing = sumBy((i) => i.category === "financing");
  const tax = sumBy((i) => i.category === "tax");
  const discontinued = sumBy((i) => i.category === "discontinued");

  const pbfit = operating + investing;
  const pbt = pbfit + financing;
  const continuing = pbt + tax;
  const net = continuing + discontinued;

  document.getElementById("statement").innerHTML = `
    <table class="statement">
      ${header("operating")}${lines("operating")}
      ${subtotal("營業損益", operating, "key")}
      ${header("investing")}${lines("investing")}
      ${subtotal("籌資及所得稅前損益", pbfit, "key")}
      ${header("financing")}${lines("financing")}
      ${subtotal("稅前損益", pbt)}
      ${header("tax")}${lines("tax")}
      ${subtotal("繼續營業單位損益", continuing)}
      ${header("discontinued")}${lines("discontinued")}
      ${subtotal("本期淨利", net, "net")}
    </table>
  `;

  // 與現行格式「營業利益」比較
  const oldOperating = sumBy((i) => i.oldSection === "operating");
  const delta = operating - oldOperating;
  const deltaText = delta === 0 ? "0" : `${delta > 0 ? "+" : "−"}${Math.abs(delta).toLocaleString("zh-TW")}`;
  document.getElementById("diff").innerHTML = `
    <div class="kpi"><span>現行格式營業利益</span><strong>${fmt(oldOperating)}</strong></div>
    <div class="kpi kpi-new"><span>IFRS 18 營業損益</span><strong>${fmt(operating)}</strong></div>
    <div class="kpi ${delta === 0 ? "" : "kpi-delta"}"><span>營業損益差異</span><strong>${deltaText}</strong></div>
    <div class="kpi"><span>本期淨利</span><strong>${fmt(net)}</strong><small>不受 IFRS 18 影響</small></div>
  `;
}

function render() {
  renderItems();
  renderStatement();
}

document.getElementById("btn-reset").addEventListener("click", resetItems);
document.getElementById("btn-add").addEventListener("click", () => {
  items.push({ name: "新科目", amount: 0, category: "operating", oldSection: null, hint: "" });
  render();
});

resetItems();
