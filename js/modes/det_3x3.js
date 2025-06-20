import { setView, showBackButton } from "../router.js";
import { randint } from "../util.js";
import { t } from "../i18n.js";
import { renderModeSelect } from "../main.js"; // 追加

function det3(A) {
  // Sarrusの公式
  return A[0][0]*A[1][1]*A[2][2] + A[0][1]*A[1][2]*A[2][0] + A[0][2]*A[1][0]*A[2][1]
      - A[0][2]*A[1][1]*A[2][0] - A[0][1]*A[1][0]*A[2][2] - A[0][0]*A[1][2]*A[2][1];
}

export function run(state) {
  let qs = [];
  for(let i=0; i<state.questions; ++i) {
    let A = Array(3).fill(0).map(()=>Array(3).fill(0).map(()=>randint(-9,9)));
    let answer = det3(A);
    qs.push({
      A,
      answer,
      latex: `\\( \\left| \\begin{matrix}
        ${A.map(row => row.join(' & ')).join(' \\\\ ')}
        \\end{matrix} \\right| = ? \\)`
    });
  }
  setView(`
    <h2>${t("mode_det_3x3")}</h2>
    <form id="questions-form">
      ${qs.map((q,i)=>`
        <div class="question-block">
          <span class="latex">\\(\\left|\\begin{matrix}
            ${q.A.map(row=>row.join('&')).join('\\\\')}
            \\end{matrix}\\right| = ?\\)</span>
          <input class="answer-input" type="number" step="any" data-index="${i}" placeholder="${t("answer")}"/>
        </div>
      `).join("")}
      <button type="submit">${t("submit")}</button>
    </form>
  `);

  // ここを修正
  showBackButton(true, () => {
    state.selectedTag = null;
    state.search = "";
    renderModeSelect();
  });

  document.getElementById("questions-form").onsubmit = e => {
    e.preventDefault();
    let user = Array.from(document.querySelectorAll(".answer-input")).map(inp => inp.value);
    let correct = qs.map(q => q.answer);
    import("./result.js").then(m => m.showResult(state, user, correct, (a,b)=>Number(a)===Number(b), qs));
  };
}
