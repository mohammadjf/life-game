"use strict";

const cellSize = 10;
let cols, rows;
let board, nextBoard;
let ctx;
let intervalId = null;

// =============================
// Initialize
// =============================
function init() {
  const canvas = document.getElementById("board");
  ctx = canvas.getContext("2d");

  resizeCanvas();
  createBoards();
  randomizeBoard();
  drawBoard();

  setupInputHandlers();

  // ⭐ Start immediately
  intervalId = setInterval(gameLoop, 100);
}

function resizeCanvas() {
  const canvas = document.getElementById("board");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  cols = Math.floor(canvas.width / cellSize);
  rows = Math.floor(canvas.height / cellSize);
}

function createBoards() {
  board = new Array(rows).fill().map(() => new Array(cols).fill(0));
  nextBoard = new Array(rows).fill().map(() => new Array(cols).fill(0));
}

function randomizeBoard() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      board[y][x] = Math.random() > 0.92 ? 1 : 0;
    }
  }
}

// =============================
// Game of Life logic
// =============================
function countNeighbors(x, y) {
  let sum = 0;

  for (let yy = -1; yy <= 1; yy++) {
    for (let xx = -1; xx <= 1; xx++) {
      if (xx === 0 && yy === 0) continue;

      const nx = x + xx;
      const ny = y + yy;

      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
        sum += board[ny][nx];
      }
    }
  }
  return sum;
}

function step() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const neighbors = countNeighbors(x, y);

      if (board[y][x] === 1) {
        nextBoard[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0;
      } else {
        nextBoard[y][x] = neighbors === 3 ? 1 : 0;
      }
    }
  }

  // Swap references
  [board, nextBoard] = [nextBoard, board];
}

// =============================
// Rendering
// =============================
function drawBoard() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = "#0f0";
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (board[y][x] === 1) {
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}

// =============================
// Loop
// =============================
function gameLoop() {
  step();
  drawBoard();
}

// =============================
// Drawing (Mouse + Touch)
// =============================
function setupInputHandlers() {
  let drawing = false;

  const drawAt = (clientX, clientY) => {
    const rect = ctx.canvas.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / cellSize);
    const y = Math.floor((clientY - rect.top) / cellSize);

    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      // board[y][x] = 1;
      board[y - 1][x] = 1;
      board[y + 1][x] = 1;
      board[y][x - 1] = 1;
      board[y][x + 1] = 1;

      drawBoard();
    }
  };

  // Mouse
  ctx.canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    drawAt(e.clientX, e.clientY);
  });
  window.addEventListener("mouseup", () => (drawing = false));
  ctx.canvas.addEventListener("mousemove", (e) => {
    if (drawing) drawAt(e.clientX, e.clientY);
  });

  // Touch
  ctx.canvas.addEventListener(
    "touchstart",
    (e) => {
      drawing = true;
      e.preventDefault();
      const t = e.touches[0];
      drawAt(t.clientX, t.clientY);
    },
    { passive: false }
  );

  ctx.canvas.addEventListener(
    "touchmove",
    (e) => {
      if (!drawing) return;
      e.preventDefault();
      const t = e.touches[0];
      drawAt(t.clientX, t.clientY);
    },
    { passive: false }
  );

  ctx.canvas.addEventListener("touchend", () => (drawing = false));
}

// =============================
// Resize behavior
// =============================
window.addEventListener("resize", () => {
  clearInterval(intervalId);
  resizeCanvas();
  createBoards();
  randomizeBoard();
  drawBoard();
  intervalId = setInterval(gameLoop, 100);
});

document.addEventListener("DOMContentLoaded", init);
