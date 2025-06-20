// main.js
import { t, loadLang } from "./i18n.js";
import { MODES, TAGS } from "./modes.js";
import { setView, showBackButton } from "./router.js";

export let state = {
  lang: "en",
  selectedTag: null,
  search: "",
  mode: null,
  questions: 10 // デフォルト
};

export function renderHome() {
  setView(`
    <h1>${t("title")}</h1>
    <div id="language-selector">
      <label><input type="radio" name="lang" value="en" ${state.lang==="en"?"checked":""}> English</label>
      <label><input type="radio" name="lang" value="ja" ${state.lang==="ja"?"checked":""}> 日本語</label>
      <label><input type="radio" name="lang" value="zh_tw" ${state.lang==="zh_tw"?"checked":""}> 中文（繁體）</label>
      <label><input type="radio" name="lang" value="zh_cn" ${state.lang==="zh_cn"?"checked":""}> 中文（简体）</label>
      <label><input type="radio" name="lang" value="kr" ${state.lang==="kr"?"checked":""}> 한국어</label>
    </div>
    <button id="start-btn">${t("start")}</button>
  `);
  document.getElementsByName("lang").forEach(radio => {
    radio.onclick = async e => {
      state.lang = e.target.value;
      await loadLang(state.lang);
      renderHome();
    };
  });
  document.getElementById("start-btn").onclick = renderModeSelect;
  showBackButton(false);
}

export function renderModeSelect() {
  setView(`
    <h2>${t("select_mode")}</h2>
    <input type="text" id="mode-search" placeholder="${t("search")}" value="${state.search || ""}">
    <div id="tag-filter">
      ${TAGS.map(tag => `
        <button class="tag-btn${state.selectedTag===tag.id?" selected":""}" data-tag="${tag.id}">
          ${t(tag.labelKey)}
        </button>
      `).join('')}
    </div>
    <ul id="mode-list"></ul>
  `);

  // ---- inputイベントによる再描画をやめ、フィルタのみ実行する ----
  const searchInput = document.getElementById("mode-search");
  searchInput.oninput = function() {
    state.search = this.value;
    renderModeList(); // 部分描画でOK
  };

  // タグボタン
  document.querySelectorAll(".tag-btn").forEach(btn => {
    btn.onclick = () => {
      state.selectedTag = btn.dataset.tag === state.selectedTag ? null : btn.dataset.tag;
      renderModeList();
    };
  });

  // ---- mode-list部分だけを再描画する関数を分離 ----
  function renderModeList() {
    let modes = MODES
      .filter(m => (!state.selectedTag || m.tag===state.selectedTag))
      .filter(m => !state.search || t(m.nameKey).toLowerCase().includes(state.search.toLowerCase()));
    document.getElementById("mode-list").innerHTML =
      modes.map(mode => `
        <li class="mode-item">
          <span>${t(mode.nameKey)}</span>
          <span>
            <select class="mode-questions-select" data-id="${mode.id}">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <button class="mode-select-btn" data-id="${mode.id}">${t("select")}</button>
          </span>
        </li>
      `).join("");

    // イベントハンドラ再付与
    document.querySelectorAll(".mode-questions-select").forEach(sel => {
      sel.onchange = (e) => {
        if(sel.dataset.id === state.mode) state.questions = Number(sel.value);
      };
    });
    document.querySelectorAll(".mode-select-btn").forEach(btn => {
      btn.onclick = (e) => {
        state.mode = btn.dataset.id;
        let selectEl = document.querySelector(`.mode-questions-select[data-id="${state.mode}"]`);
        state.questions = Number(selectEl.value);
        import(`./modes/${state.mode}.js`).then(module => {
          module.run(state);
        });
      };
    });
  }

  renderModeList();

  showBackButton(true, () => {
    state.selectedTag = null; state.search = ""; renderHome();
  });
}

// ---- 初期化 ----
(async () => {
  await loadLang(state.lang);
  renderHome();
})();
