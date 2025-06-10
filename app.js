const { useState } = React;

function App() {
  const [screen, setScreen] = useState("title");
  const [matrixA, setMatrixA] = useState([[1, 2], [3, 4]]);
  const [matrixB, setMatrixB] = useState([[5, 6], [7, 8]]);
  const [resultLatex, setResultLatex] = useState("");

  function handleMatrixChange(setMatrix, i, j, value) {
    const newMatrix = [...setMatrix];
    newMatrix[i][j] = Number(value);
    setMatrix(newMatrix);
  }

  function multiplyMatrices() {
    const a = matrixA, b = matrixB;
    const rowsA = a.length, colsA = a[0].length;
    const rowsB = b.length, colsB = b[0].length;

    if (colsA !== rowsB) {
      alert("Matrix dimensions do not match for multiplication.");
      return;
    }

    const result = Array.from({ length: rowsA }, () =>
      Array(colsB).fill(0)
    );

    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsB; j++) {
        for (let k = 0; k < colsA; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }

    // Convert to LaTeX
    const latex = `\\begin{bmatrix}${result.map(row => row.join(" & ")).join(" \\\\ ")}\\end{bmatrix}`;
    setResultLatex(latex);

    // Re-render LaTeX
    window.renderMathInElement(document.body);
  }

  function renderMatrix(matrix, setter) {
    return (
      <div style={{ display: "inline-block", margin: "10px" }}>
        {matrix.map((row, i) => (
          <div key={i} style={{ display: "flex" }}>
            {row.map((val, j) => (
              <input
                key={j}
                type="number"
                value={val}
                onChange={(e) =>
                  handleMatrixChange(setter, i, j, e.target.value)
                }
                style={{ width: "40px", margin: "2px" }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {screen === "title" && (
        <div className="screen active">
          <h1>Matrix Trainer</h1>
          <button className="start-button" onClick={() => setScreen("mode")}>
            Start
          </button>
        </div>
      )}

      {screen === "mode" && (
        <div className="screen active">
          <h2>Choose Practice Mode</h2>
          <button className="mode-button" onClick={() => setScreen("multiply")}>
            Matrix Multiplication
          </button>
        </div>
      )}

      {screen === "multiply" && (
        <div className="screen active">
          <h2>Matrix Multiplication</h2>
          <div style={{ display: "flex", alignItems: "center" }}>
            {renderMatrix(matrixA, setMatrixA)}
            <span style={{ fontSize: "24px", margin: "0 10px" }}>×</span>
            {renderMatrix(matrixB, setMatrixB)}
          </div>
          <button className="start-button" onClick={multiplyMatrices}>
            Multiply
          </button>
          <div style={{ marginTop: "20px", fontSize: "24px" }}>
            <div id="result" className="katex-latex">
              {resultLatex && <span>{`$$${resultLatex}$$`}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById("root"));
