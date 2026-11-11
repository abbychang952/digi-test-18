# IFRS 18 主題策展頁

鼎新 ERP × Agent Space 的 IFRS 18 主題策展頁，含互動式損益表試算工具。需求與架構請見 `BRIEF.md`。

## 開啟方式

用 VS Code Live Server 開啟 `index.html` 即可，不需要安裝任何套件。

## 檔案結構

```
IFRS 18 web/
├── index.html       # 策展頁（試算區只放精簡預告，完整試算在全螢幕視窗）
├── simulator.html   # 獨立試算頁，供文章、Email、社群直接連結
├── css/style.css    # 樣式
├── js/data.js       # IFRS 18 類別定義與範例科目資料
├── js/content.js    # 角色痛點文案（ROLES）、文章清單（ARTICLES）
├── js/app.js        # 試算工具邏輯（兩個頁面共用）
└── js/landing.js    # 倒數計時、角色切換、文章篩選、試算預告與視窗
```

## 修改範例資料

範例科目在 `js/data.js` 的 `SAMPLE_ITEMS` 裡，每筆資料包含：

- `name`：科目名稱
- `amount`：金額（費損用負數）
- `category`：IFRS 18 類別（operating / investing / financing / tax / discontinued）
- `oldSection`：現行格式所在區塊，用來比較新舊營業利益
- `hint`：分類理由
