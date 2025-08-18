const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Variáveis do modo 2
const rows = 20;
const cols = 20;
const box = 20;

let snake = [{x: 1*box, y: 1*box}];
let direction = null;

function draw() {
  ctx.fillStyle = "#ddeeff";
  ctx.fillRect(0, 0, cols*box, rows*box);
  ctx.fillStyle = "green";
  for(let part of snake) ctx.fillRect(part.x, part.y, box, box);
}

function update() {
  if(!direction) return;
  // ... lógica do modo 2
  draw();
}

document.addEventListener("keydown", e => {
  if(e.key === "ArrowLeft") direction = "LEFT";
  if(e.key === "ArrowRight") direction = "RIGHT";
});

let game = setInterval(update, 150);
