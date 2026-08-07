const patterns = [
  {
    id: "left-triangle",
    name: "1. Left Triangle",
    desc: "Stars increase left to right, one more per row.",
    concept: "Single/nested loop logic with string concatenation `*`.",
    invertLabel: "Invert (decreasing)",
    build(N, invert){
      return {
        rows: N, cols: N,
        cell: (r, c) => ({ filled: invert ? c <= (N - 1 - r) : c <= r })
      };
    }
  },
  {
    id: "right-triangle",
    name: "2. Right Triangle",
    desc: "Right-aligned triangle built with leading-space padding.",
    concept: "Leading space padding `.repeat(N - i)` + star concatenation.",
    invertLabel: "Invert (shrinking)",
    build(N, invert){
      return {
        rows: N, cols: N,
        cell: (r, c) => ({ filled: invert ? c >= r : c >= (N - 1 - r) })
      };
    }
  },
  {
    id: "hollow-square",
    name: "3. Hollow Square",
    desc: "Only the border cells of an N by N square are filled.",
    concept: "Boundary check `(i === 0 || i === N-1 || j === 0 || j === N-1)`.",
    build(N){
      return {
        rows: N, cols: N,
        cell: (r, c) => ({ filled: r === 0 || r === N - 1 || c === 0 || c === N - 1 })
      };
    }
  },
  {
    id: "pyramid",
    name: "4. Pyramid",
    desc: "Centered triangle, each row has an odd number of stars.",
    concept: "Centered spaces `(N - i - 1)` + odd star formula `(2 * i + 1)`.",
    build(N){
      const cols = 2 * N - 1;
      return {
        rows: N, cols,
        cell: (r, c) => ({ filled: c >= (N - 1 - r) && c <= (N - 1 + r) })
      };
    }
  },
  {
    id: "diamond",
    name: "5. Diamond",
    desc: "Full diamond in a square bounding box, widest at the middle row.",
    concept: "Mirrored single-loop index math `Math.abs(N - 1 - i)`.",
    invertLabel: "Arrowhead variant",
    build(N, invert){
      const mid = Math.floor((N - 1) / 2);
      const cols = N;
      if (!invert){
        return {
          rows: N, cols,
          cell: (r, c) => {
            const count = N - 2 * Math.abs(r - mid);
            const start = Math.floor((N - count) / 2);
            return { filled: count > 0 && c >= start && c <= start + count - 1 };
          }
        };
      }
      const max = Math.ceil(N / 2);
      return {
        rows: N, cols,
        cell: (r, c) => {
          const count = max - Math.abs(r - mid);
          return { filled: count > 0 && c < count };
        }
      };
    }
  },
  {
    id: "hollow-diamond",
    name: "6. Hollow Diamond",
    desc: "Outline of a full diamond — only the two slanted edges per row.",
    concept: "Edge-only star check `(j === N - i - 1 || j === N + i - 1)`.",
    build(N){
      const rows = 2 * N - 1;
      const cols = 2 * N - 1;
      return {
        rows, cols,
        cell: (r, c) => {
          const i = r < N ? r : (rows - 1 - r);
          const left = N - 1 - i, right = N - 1 + i;
          return { filled: c === left || c === right };
        }
      };
    }
  },
  {
    id: "butterfly",
    name: "7. Butterfly",
    desc: "Two triangles meeting in the middle like open wings.",
    concept: "Mirrored left stars, middle spaces, and right stars.",
    build(N){
      const cols = 2 * N;
      const rows = 2 * N - 1;
      return {
        rows, cols,
        cell: (r, c) => {
          const i = r < N ? r : (rows - 1 - r);
          return { filled: c <= i || c >= cols - 1 - i };
        }
      };
    }
  },
  {
    id: "hourglass",
    name: "8. Hourglass",
    desc: "Wide top and bottom pinching to a single point in the middle.",
    concept: "Top inverted pyramid transitioning into bottom upright pyramid.",
    build(N){
      const cols = 2 * N - 1;
      const rows = 2 * N - 1;
      return {
        rows, cols,
        cell: (r, c) => {
          const j = r < N ? (N - 1 - r) : (r - (N - 1));
          return { filled: c >= (N - 1 - j) && c <= (N - 1 + j) };
        }
      };
    }
  },
  {
    id: "parallelogram",
    name: "9. Slanted Parallelogram",
    desc: "A solid block of width N that shifts left by one cell each row.",
    concept: "Slanted rows with leading space offsets per iteration.",
    build(N){
      const cols = 2 * N - 1;
      return {
        rows: N, cols,
        cell: (r, c) => {
          const start = N - 1 - r;
          return { filled: c >= start && c <= start + N - 1 };
        }
      };
    }
  },
  {
    id: "x-pattern",
    name: "10. X Pattern",
    desc: "The two diagonals of an N by N grid crossing at the center.",
    concept: "Cross diagonals `(i === j || i + j === N - 1)`.",
    build(N){
      return {
        rows: N, cols: N,
        cell: (r, c) => ({ filled: r === c || r + c === N - 1 })
      };
    }
  },
  {
    id: "binary-triangle",
    name: "11. Binary Triangle",
    desc: "Triangle of alternating 0s and 1s based on position parity.",
    concept: "Alternating parity check `(i + j) % 2 === 0` for 1/0.",
    build(N){
      return {
        rows: N, cols: N,
        cell: (r, c) => {
          if (c > r) return { filled: false };
          const isOne = (r + c) % 2 === 0;
          return { filled: true, label: isOne ? "1" : "0" };
        }
      };
    }
  },
  {
    id: "concentric-squares",
    name: "12. Concentric Squares",
    desc: "Nested square rings, numbered by distance from the border.",
    concept: "Spiral distance formula `Math.min(i, j, N-1-i, N-1-j)`.",
    build(N){
      const maxRing = Math.ceil(N / 2);
      return {
        rows: N, cols: N,
        cell: (r, c) => {
          const d = Math.min(r, c, N - 1 - r, N - 1 - c);
          const value = maxRing - d;
          const tone = Math.max(1, Math.min(5, value));
          return { filled: true, label: String(value), tone };
        }
      };
    }
  },
  {
    id: "pascals-triangle",
    name: "13. Pascal's Triangle",
    desc: "Each number is the sum of the two above it (binomial coefficients).",
    concept: "Combinations formula `C(n, k) = C(n, k-1) * (n - k + 1) / k`.",
    build(N){
      const cols = 2 * N - 1;
      const rowsData = [];
      for (let n = 0; n < N; n++){
        const row = [1];
        for (let k = 1; k <= n; k++){
          row.push(Math.round(row[k - 1] * (n - k + 1) / k));
        }
        rowsData.push(row);
      }
      return {
        rows: N, cols,
        cell: (r, c) => {
          const row = rowsData[r];
          const start = N - 1 - r;
          if ((c - start) % 2 !== 0 || c < start || c > start + 2 * r) return { filled: false };
          const k = (c - start) / 2;
          const value = row[k];
          const tone = value >= 10 ? 5 : value >= 5 ? 4 : value >= 2 ? 3 : 2;
          return { filled: true, label: String(value), tone };
        }
      };
    }
  },
  {
    id: "hollow-parallelogram",
    name: "14. Hollow Parallelogram",
    desc: "Parallelogram outline: solid top/bottom edges, slanted sides between.",
    concept: "Boundary + diagonal condition evaluation with minimal loops.",
    build(N){
      const cols = 2 * N - 1;
      return {
        rows: N, cols,
        cell: (r, c) => {
          const start = N - 1 - r;
          const end = start + N - 1;
          if (r === 0 || r === N - 1) return { filled: c >= start && c <= end };
          return { filled: c === start || c === end };
        }
      };
    }
  },
  {
    id: "plus",
    name: "15. Plus / Cross",
    desc: "A single filled row and column crossing at the center.",
    concept: "Center axis check `(i === mid || j === mid)`.",
    build(N){
      const mid = Math.floor((N - 1) / 2);
      return {
        rows: N, cols: N,
        cell: (r, c) => ({ filled: r === mid || c === mid })
      };
    }
  }
];
const patternSelect = document.getElementById("patternSelect");
const sizeRange = document.getElementById("sizeRange");
const sizeValue = document.getElementById("sizeValue");
const charInput = document.getElementById("charInput");
const patternTitle = document.getElementById("patternTitle");
const patternDesc = document.getElementById("patternDesc");
const grid = document.getElementById("grid");
const textOutput = document.getElementById("textOutput");
const invertGroup = document.getElementById("invertGroup");
const invertCheck = document.getElementById("invertCheck");
const invertLabel = document.getElementById("invertLabel");
patterns.forEach(p => {
  const opt = document.createElement("option");
  opt.value = p.id;
  opt.textContent = p.name;
  patternSelect.appendChild(opt);
});
function currentPattern(){
  return patterns.find(p => p.id === patternSelect.value) || patterns[0];
}
function render(){
  const N = parseInt(sizeRange.value, 10);
  sizeValue.textContent = N;
  const pattern = currentPattern();
  if (pattern.invertLabel){
    invertGroup.hidden = false;
    invertLabel.textContent = pattern.invertLabel;
  } else {
    invertGroup.hidden = true;
    invertCheck.checked = false;
  }
  const { rows, cols, cell } = pattern.build(N, invertCheck.checked);
  const symbol = (charInput.value || "*").slice(0, 1);
  patternTitle.textContent = pattern.name.replace(/^\d+\.\s*/, "");
  patternDesc.textContent = pattern.desc + " — " + pattern.concept;
  const maxStage = 480;
  const cellSize = Math.max(14, Math.min(30, Math.floor(maxStage / cols)));
  const fontSize = Math.max(9, Math.min(13, cellSize - 8));
  grid.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  grid.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
  grid.innerHTML = "";
  const lines = [];
  for (let r = 0; r < rows; r++){
    let line = "";
    for (let c = 0; c < cols; c++){
      const info = cell(r, c);
      const div = document.createElement("div");
      div.className = "cell" + (info.filled ? " filled" : "");
      if (info.filled && info.tone) div.classList.add("tone-" + info.tone);
      if (info.filled){
        div.style.fontSize = fontSize + "px";
        div.textContent = info.label || "";
        line += info.label || symbol;
      } else {
        line += " ";
      }
      grid.appendChild(div);
    }
    lines.push(pattern.id === "binary-triangle" || pattern.id === "concentric-squares" || pattern.id === "pascals-triangle"
      ? line.replace(/(\S)(?=\S)/g, "$1 ").trimEnd()
      : line);
  }
  textOutput.textContent = lines.join("\n");
}
patternSelect.addEventListener("change", render);
sizeRange.addEventListener("input", render);
charInput.addEventListener("input", render);
invertCheck.addEventListener("change", render);
patternSelect.value = "pyramid";
render();
