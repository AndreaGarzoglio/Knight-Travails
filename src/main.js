import { BOARD_SIZE, knightMoves } from "./index.js";
import { KNIGHT_SOURCE } from "./annotated-source.js";
import faviconSvg from "./favicon.svg";

function addIcon(rel, href, attrs = {}) {
  const link = document.createElement("link");
  link.rel = rel;
  link.href = href;
  Object.assign(link, attrs);
  document.head.appendChild(link);
}

addIcon("icon", faviconSvg, { type: "image/svg+xml" });

const board = document.getElementById("board");
const log = document.getElementById("log");
const moveCount = document.getElementById("move-count");
const fromInput = document.getElementById("from-val");
const toInput = document.getElementById("to-val");

// ── Board: an 8x8 grid of clickable squares, transparent so the page's
// dotted background shows through — light squares just add a violet wash
// on top of it. ──
const squares = [];
for (let y = 0; y < BOARD_SIZE; y += 1) {
  for (let x = 0; x < BOARD_SIZE; x += 1) {
    const sq = document.createElement("div");
    sq.className = `square ${(x + y) % 2 === 0 ? "light" : "dark"}`;
    sq.dataset.x = x;
    sq.dataset.y = y;
    sq.addEventListener("click", () => handleSquareClick(x, y));
    board.appendChild(sq);
    squares.push(sq);
  }
}

const knightEl = document.createElement("div");
knightEl.className = "knight-piece hidden";
knightEl.innerHTML = "<span>&#9822;</span>";
board.appendChild(knightEl);

function squareEl(x, y) {
  return squares[y * BOARD_SIZE + x];
}

// Reads the actual rendered square size (driven by the --sq custom
// property, which steps up at wider breakpoints) instead of duplicating
// those breakpoints here.
function squareSize() {
  return squares[0].getBoundingClientRect().width;
}

let knightPos = null;

function placeKnight(x, y) {
  knightPos = [x, y];
  const s = squareSize();
  knightEl.style.left = `${x * s}px`;
  knightEl.style.top = `${y * s}px`;
  knightEl.classList.remove("hidden");
}

// Keeps the knight aligned with its square when the board's size changes
// (a breakpoint crossing, or the mobile drawer resizing the layout).
window.addEventListener("resize", () => {
  if (knightPos) placeKnight(...knightPos);
});

function clearHighlights() {
  squares.forEach((sq) => sq.classList.remove("start", "end", "path"));
}

let selecting = "start"; // "start" | "end"
let start = null;
let end = null;

function setInputs() {
  fromInput.value = start ? start.join(",") : "";
  toInput.value = end ? end.join(",") : "";
}

function handleSquareClick(x, y) {
  if (selecting === "start") {
    clearHighlights();
    start = [x, y];
    end = null;
    setInputs();
    squareEl(x, y).classList.add("start");
    placeKnight(x, y);
    selecting = "end";
    return;
  }

  if (x === start[0] && y === start[1]) return; // same square, ignore
  end = [x, y];
  setInputs();
  run();
}

const MAX_LOG_LINES = 20;
const typingTimers = new WeakMap();

function typeWriter(el, text, { speed = 22, onTick } = {}) {
  clearInterval(typingTimers.get(el));

  const textSpan = document.createElement("span");
  el.replaceChildren(textSpan);

  let i = 0;
  const timer = setInterval(() => {
    textSpan.textContent += text[i];
    i += 1;
    onTick?.();
    if (i >= text.length) clearInterval(timer);
  }, speed);
  typingTimers.set(el, timer);
}

function logLine(text, type = "ok") {
  const line = document.createElement("div");
  line.className = type === "error" ? "log-line error" : "log-line";
  log.prepend(line);

  while (log.children.length > MAX_LOG_LINES) {
    log.removeChild(log.lastElementChild);
  }

  typeWriter(line, text, { onTick: () => (log.scrollLeft = 0) });
  log.scrollLeft = 0;
}

function showError(msg, invalidIds = []) {
  logLine(msg, "error");
  invalidIds.forEach((id) =>
    document.getElementById(id).classList.add("invalid"),
  );
}

// ── Animates the knight hopping through the path, one square at a time,
// then reports the move count once it lands. ──
function animatePath(path) {
  path.forEach(([x, y], i) => {
    setTimeout(() => {
      placeKnight(x, y);
      squareEl(x, y).classList.add("path");
      if (i === path.length - 1) {
        squareEl(x, y).classList.remove("path");
        squareEl(x, y).classList.add("end");
        selecting = "start";
        const moves = path.length - 1;
        const summary = `${moves} move${moves === 1 ? "" : "s"}`;
        logLine(`knightMoves([${start}], [${end}]) -> ${summary}`);
        moveCount.textContent = summary;
      }
    }, i * 320);
  });
}

function run() {
  if (!start || !end) return showError("run: pick a start and end square.");
  const path = knightMoves(start, end);
  animatePath(path);
}

document.getElementById("btn-run").addEventListener("click", () => {
  const parse = (raw) => {
    const parts = raw.split(",").map((v) => Number(v.trim()));
    if (
      parts.length !== 2 ||
      parts.some((v) => !Number.isInteger(v) || v < 0 || v >= BOARD_SIZE)
    )
      return null;
    return parts;
  };

  const from = parse(fromInput.value);
  const to = parse(toInput.value);
  if (!from)
    return showError("from: enter coordinates as x,y (0-7).", ["from-val"]);
  if (!to) return showError("to: enter coordinates as x,y (0-7).", ["to-val"]);
  if (from[0] === to[0] && from[1] === to[1])
    return showError("from and to must be different squares.", [
      "from-val",
      "to-val",
    ]);

  clearHighlights();
  start = from;
  end = to;
  squareEl(...start).classList.add("start");
  placeKnight(...start);
  run();
});

document.getElementById("btn-random").addEventListener("click", () => {
  const randSquare = () => [
    Math.floor(Math.random() * BOARD_SIZE),
    Math.floor(Math.random() * BOARD_SIZE),
  ];
  let from = randSquare();
  let to = randSquare();
  while (to[0] === from[0] && to[1] === from[1]) to = randSquare();

  clearHighlights();
  start = from;
  end = to;
  setInputs();
  squareEl(...start).classList.add("start");
  placeKnight(...start);
  run();
});

document.getElementById("btn-reset").addEventListener("click", () => {
  clearHighlights();
  knightEl.classList.add("hidden");
  knightPos = null;
  start = null;
  end = null;
  selecting = "start";
  moveCount.textContent = "";
  setInputs();
});

// ── "How it works" modal ──
const howModal = document.getElementById("how-modal");
const howModalCode = document.getElementById("how-modal-code");

function renderCode(code) {
  howModalCode.replaceChildren();
  code.split("\n").forEach((line) => {
    const lineEl = document.createElement("div");
    lineEl.className = line.trim().startsWith("//")
      ? "code-line comment"
      : "code-line";
    lineEl.textContent = line.length ? line : " ";
    howModalCode.appendChild(lineEl);
  });
}

document.getElementById("btn-how").addEventListener("click", () => {
  renderCode(KNIGHT_SOURCE);
  howModal.showModal();
});
document
  .getElementById("how-modal-close")
  .addEventListener("click", () => howModal.close());
howModal.addEventListener("click", (e) => {
  if (e.target === howModal) howModal.close();
});

document.querySelectorAll(".cmd-row input").forEach((input) => {
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    document.getElementById("btn-run").click();
  });
  input.addEventListener("input", () => input.classList.remove("invalid"));
});

// ── Mobile drawer: the side panel opens on tap instead of splitting the
// screen with the board. Harmless on desktop, where CSS keeps it open. ──
const sidePanel = document.getElementById("side-panel");
document.getElementById("btn-drawer").addEventListener("click", () => {
  sidePanel.classList.toggle("open");
});
