import { setView, showBackButton } from "../router.js";
import { randint } from "../util.js";
import { t } from "../i18n.js";
import { renderModeSelect } from "../main.js"; // ← 追加

function matmul(A,B) {
  let C = [];
  for(let i=0; i<3; ++i) {
    C[i] = [];
    for(let j=0; j<3; ++j) {
      C[i][j] = 0;
      for(let k=0; k<3; ++k) C[i][j] += A[i][k]*B[k][j];
    }
  }
  return C;
}

export function run(state) {
  let qs = [];
  for(let i=0; i<state.questions; ++i) {
    let A = Array(3).fill(0).map(()=>Array(3).fill(0).map(()=>randint(-9,9)));
    let B = Array(3).fill(0).map(()=>Array(3).fill(0).map(()=>randint(-9,9)));
    let C = matmul(A,B);
    let idx = [randint(0,2), randint(0,2)];
    let answer = C[idx[0]][idx[1]];
    qs.push({
      A, B, C, idx, answer,
      latex: `\\( A = \\begin{bmatrix}
        ${A.map(row => row.join(' & ')).join(' \\\\ ')}
        \\end{bmatrix}, \\, B = \\begin{bmatrix}
        ${B.map(row => row.join(' & ')).join(' \\\\ ')}
        \\end{bmatrix}, \\, (AB)_{${idx[0]+1}${idx[1]+1}} = ? \\)`
    });
  }
  setView(`
    <h2>${t("mode_matmul_3x3")}</h2>
    <form id="questions-form">
      ${qs.map((q,i)=>`
        <div class="question-block">
        <div>
          <span class="latex">\\(A = \\begin{bmatrix}
            ${q.A.map(row=>row.join('&')).join('\\\\')}
            \\end{bmatrix}, \\, B = \\begin{bmatrix}
            ${q.B.map(row=>row.join('&')).join('\\\\')}
            \\end{bmatrix}, \\, (AB)_{${q.idx[0]+1}${q.idx[1]+1}} = ? \\)</span>
          </div>  
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
    let correct = qs.map(q => q.answer);
    import("./result.js").then(m => m.showResult(state, user, correct, (a,b)=>Number(a)===Number(b), qs));
  };
}
