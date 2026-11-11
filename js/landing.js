// ===== 倒數計時：先倒數 2027 比較期間，到期後改倒數 2028 台灣首次適用 =====
const MILESTONES = [
  { date: new Date("2027-01-01T00:00:00+08:00"), label: "距離 2027 比較期間開始" },
  { date: new Date("2028-01-01T00:00:00+08:00"), label: "距離台灣首次適用 IFRS 18（預計）" },
];

const flips = {};
document.querySelectorAll(".flip").forEach((el) => (flips[el.dataset.unit] = el));

function setFlip(unit, value) {
  const el = flips[unit];
  if (el.textContent === value) return;
  el.textContent = value;
  el.classList.remove("tick");
  void el.offsetWidth; // 重新觸發動畫
  el.classList.add("tick");
}

function updateCountdown() {
  const now = new Date();
  const idx = MILESTONES.findIndex((m) => m.date > now);
  const label = document.getElementById("cd-label");

  if (idx === -1) {
    label.textContent = "IFRS 18 已正式適用";
    ["d", "h", "m", "s"].forEach((u) => setFlip(u, "00"));
    return;
  }

  label.textContent = MILESTONES[idx].label;
  let diff = Math.floor((MILESTONES[idx].date - now) / 1000);
  const d = Math.floor(diff / 86400); diff %= 86400;
  const h = Math.floor(diff / 3600); diff %= 3600;
  const m = Math.floor(diff / 60);
  const s = diff % 60;

  const pad = (n) => String(n).padStart(2, "0");
  setFlip("d", pad(d));
  setFlip("h", pad(h));
  setFlip("m", pad(m));
  setFlip("s", pad(s));
}

updateCountdown();

// ===== 準備時程：依今天年份（台灣時間）標示已完成／目前階段 =====
function markPhases() {
  const year = Number(new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Asia/Taipei" }).format(new Date()));
  document.querySelectorAll("[data-year]").forEach((li) => {
    const y = Number(li.dataset.year);
    const last = !li.nextElementSibling;
    li.classList.toggle("done", y < year && !last);
    li.classList.toggle("active", y === year || (last && y < year));
  });
}
markPhases();
setInterval(updateCountdown, 1000);

// ===== 情境痛點：角色切換 =====
function renderRole(key) {
  const role = ROLES[key];
  document.getElementById("role-panel").innerHTML = `
    <blockquote class="scene-quote">${role.quote}</blockquote>
    <div class="pain-table">
      <div class="pain-row pain-row-head"><span>情境</span><span>卡關點</span><span>鼎新怎麼解</span></div>
      ${role.rows
        .map(
          (r, i) => `
        <div class="pain-row">
          <div class="pain-scene"><span class="pain-no">${String(i + 1).padStart(2, "0")}</span>${r.scene}</div>
          <p class="pain-text">${r.pain}</p>
          <p class="pain-fix"><strong>${r.fixTitle}</strong>${r.fix}</p>
        </div>`
        )
        .join("")}
    </div>
  `;
}

document.querySelectorAll(".role").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".role").forEach((b) => b.setAttribute("aria-selected", b === btn));
    renderRole(btn.dataset.role);
  });
});
renderRole("executive");

// ===== 文章專區 =====
let activeCategory = "全部";

function renderFilters() {
  document.getElementById("article-filters").innerHTML = ["全部", ...ARTICLE_CATEGORIES]
    .map((c) => `<button class="filter" role="tab" aria-selected="${c === activeCategory}" data-cat="${c}">${c}</button>`)
    .join("");
  document.querySelectorAll(".filter").forEach((btn) =>
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.cat;
      renderFilters();
      renderArticles();
    })
  );
}

function renderArticles() {
  const list = ARTICLES.filter((a) => activeCategory === "全部" || a.category === activeCategory);
  const featuredIdx = activeCategory === "全部" ? list.findIndex((a) => a.featured) : -1;
  const catIndex = (c) => ARTICLE_CATEGORIES.indexOf(c) + 1;

  document.getElementById("articles").innerHTML = list
    .map((a, i) => {
      const todo = a.href === "#" ? `<span class="todo-badge">待補連結</span>` : "";
      return `
      <a class="article ${i === featuredIdx ? "article-featured" : ""}" href="${a.href}">
        <div class="article-cover cover-${catIndex(a.category)}">
          <span class="cover-mark">IFRS 18</span>${todo}
        </div>
        <div class="article-body">
          <span class="article-cat">${a.category}</span>
          <h3>${a.title}</h3>
          <p>${a.summary}</p>
          <span class="article-more">閱讀全文 →</span>
        </div>
      </a>`;
    })
    .join("");
}

renderFilters();
renderArticles();

// ===== 試算預告：從範例資料挑出營業外「搬家」到各類別的代表項目 =====
function renderTeaser() {
  const total = (pred) => SAMPLE_ITEMS.filter(pred).reduce((t, i) => t + i.amount, 0);
  const num = (n) => (n < 0 ? `(${Math.abs(n).toLocaleString("zh-TW")})` : n.toLocaleString("zh-TW"));

  const moves = ["operating", "investing", "financing"]
    .map((cat) =>
      SAMPLE_ITEMS.filter((i) => i.oldSection === "nonOperating" && i.category === cat)
        .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))[0]
    )
    .filter(Boolean);

  document.getElementById("teaser-moves").innerHTML = moves
    .map(
      (i) => `
      <li>
        <span class="move-name">${i.name}<small>${i.hint}</small></span>
        <span class="move-path"><s>營業外</s><i>→</i><b style="background:${CATEGORIES[i.category].color}">${CATEGORIES[i.category].label}</b></span>
        <span class="move-amt">${num(i.amount)}</span>
      </li>`
    )
    .join("");

  const oldOp = total((i) => i.oldSection === "operating");
  const newOp = total((i) => i.category === "operating");
  document.getElementById("teaser-op").innerHTML = `${num(oldOp)}<i>→</i><em>${num(newOp)}</em>`;
  document.getElementById("teaser-net").textContent = num(total(() => true));
}
renderTeaser();

// ===== 完整試算視窗 =====
const simModal = document.getElementById("sim-modal");
let simOpener = null;

function openSim(e) {
  simOpener = e.currentTarget;
  simModal.hidden = false;
  document.body.classList.add("modal-open");
  simModal.scrollTop = 0;
  simModal.querySelector(".sim-close").focus();
}

function closeSim() {
  if (simModal.hidden) return;
  simModal.hidden = true;
  document.body.classList.remove("modal-open");
  if (simOpener) simOpener.focus({ preventScroll: true });
}

document.querySelectorAll("[data-sim-open]").forEach((el) => el.addEventListener("click", openSim));
// 「申請影響評估」也帶 data-sim-close：先關閉視窗，再照常跳到表單
document.querySelectorAll("[data-sim-close]").forEach((el) => el.addEventListener("click", closeSim));
simModal.addEventListener("click", (e) => {
  if (e.target === simModal) closeSim();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSim();
});

// ===== 捲動進場動畫 =====
const reveals = document.querySelectorAll(".reveal");
if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
  reveals.forEach((el) => el.classList.add("in"));
} else {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 }
  );
  reveals.forEach((el) => io.observe(el));
}
