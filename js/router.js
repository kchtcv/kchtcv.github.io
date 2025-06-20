export function setView(html) {
  document.getElementById("app").innerHTML = html;
  if (window.renderMathInElement) {
    renderMathInElement(document.getElementById("app"));
  }
}

export function showBackButton(show = true, onClick = null) {
  const btn = document.getElementById("back-button");
  btn.style.display = show ? "" : "none";
  btn.onclick = show && onClick ? onClick : null;
}
