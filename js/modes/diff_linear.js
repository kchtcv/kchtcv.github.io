import { setView, showBackButton } from "../router.js";
import { randint } from "../util.js";
import { t } from "../i18n.js";
import { renderModeSelect } from "../main.js"; // ← 追加

export function run(state) {
  // 例：y = ax + b の a を当てさせる
  let qs = [];
  for(let i=0; i<state.questions; ++i) {
    let a = randint(-9, 9);
    if(a===0) a=1;
    let b = randint(-10, 10);
    qs.push({
      a, b,
      latex: `\\( y = ${a}x ${b>=0?"+":""} ${b} \\)`
    });
  }
  setView(`
    <h2>${t("mode_diff_linear")}</h2>
    <form id="questions-form">
      ${qs.map((q,i)=>`
        <div class="question-block">
          <span class="latex">\\(y = ${q.a}x ${q.b>=0?"+":""} ${q.b}\\)</span>
          <input class="answer-input" type="number" step="any" data-index="${i}" placeholder="${t("answer")}"/>
        </div>
      `).join("")}
      <button type="submit">${t("submit")}</button>
    </form>
  `);
  showBackButton(true, () => {
    state.selectedTag = null;
    state.search = "";
    renderModeSelect();
  });

  document.getElementById("questions-form").onsubmit = e => {
    e.preventDefault();
    let user = Array.from(document.querySelectorAll(".answer-input")).map(inp => inp.value);
    let correct = qs.map(q => q.a);
    import("./result.js").then(m => m.showResult(state, user, correct, (a,b)=>Number(a)===Number(b), qs));
  };
}
