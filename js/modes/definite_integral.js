import { setView, showBackButton } from "../router.js";
import { randint, roundTo, approxEqual } from "../util.js";
import { t } from "../i18n.js";
import { renderModeSelect } from "../main.js";  // ★追加

export function run(state) {
  let qs = [];
  for(let i=0; i<state.questions; ++i) {
    let c = randint(1,9);
    let a = randint(-9,9);
    let b = randint(a+1, a+9);
    let answer = roundTo(0.5 * c * (b*b - a*a));
    qs.push({
      c, a, b, answer,
      latex: `\\(\\int_{${a}}^{${b}} ${c}x \\,dx\\)`
    });
  }
  setView(`
    <h2>${t("mode_definite_integral")}</h2>
    <form id="questions-form">
      ${qs.map((q,i)=>`
        <div class="question-block">
          <span class="latex">${q.latex}</span>
          <input class="answer-input" type="number" step="any" data-index="${i}" placeholder="${t("answer")}" />
        </div>
      `).join("")}
      <button type="submit">${t("submit")}</button>
    </form>
  `);

  showBackButton(true, () => {
    // ★ 必ずモード選択画面に戻す
    // 状態を初期化する場合は下記のように
    state.selectedTag = null;
    state.search = "";
    renderModeSelect();
  });

  document.getElementById("questions-form").onsubmit = e => {
    e.preventDefault();
    let user = Array.from(document.querySelectorAll(".answer-input")).map(inp => inp.value);
    let correct = qs.map(q => q.answer);
    import("./result.js").then(m => m.showResult(
      state, user, correct, (a,b)=>approxEqual(a,b), qs
    ));
  };
}
