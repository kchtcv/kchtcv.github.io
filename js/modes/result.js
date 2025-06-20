import { setView, showBackButton } from "../router.js";
import { t } from "../i18n.js";
import { renderModeSelect } from "../main.js";

export function showResult(state, user, correct, judge, questions) {
  let marks = user.map((ans, i) => judge(ans, correct[i]));
  let correctCount = marks.filter(x => x).length;
  setView(`
    <h2>${t("result")}</h2>
    <div id="result-summary">
      ${t("score_summary").replace("{c}", correctCount).replace("{n}", user.length)}
    </div>
    <div>
      ${marks.map((ok, i) => `
        <div class="question-block" style="margin-bottom:18px;">
          <div class="latex" style="margin-bottom:4px;">${questions[i]?.latex || ""}</div>
          <div>
            <span>${t("your_answer")}: ${user[i] === "" ? "(null)" : user[i]}</span>
            <span class="result-mark ${ok ? "correct" : "incorrect"}">${ok ? "✓" : "✗"}</span>
            ${!ok ? `<span class="correct-ans">${t("correct_answer")}: ${correct[i]}</span>` : ""}
          </div>
        </div>
      `).join("")}
    </div>
    <button id="back-to-mode">${t("back_to_mode")}</button>
  `);
  document.getElementById("back-to-mode").onclick = () => {
  state.selectedTag = null;
  state.search = "";
  renderModeSelect();
};
  showBackButton(false);
}
