const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const rows = 20;
const cols = 20;
const box = 20; // tamanho de cada quadrado

// Inicialização da cobra e da comida
let snake = [{ x: 1 * box, y: 1 * box }];
let food = {
  x: Math.floor(Math.random() * (cols - 2) + 1) * box,
  y: Math.floor(Math.random() * (rows - 2) + 1) * box
};

let direction = null;
let score = 0;

// Função para desenhar o tabuleiro, paredes, cobra e comida
function draw() {
  // fundo
  ctx.fillStyle = "#e0ffe0";
  ctx.fillRect(0, 0, cols * box, rows * box);

  // paredes
  ctx.fillStyle = "#000000";
  // horizontais
  ctx.fillRect(0, 0, cols * box, box);
  ctx.fillRect(0, (rows - 1) * box, cols * box, box);
  // verticais
  ctx.fillRect(0, 0, box, rows * box);
  ctx.fillRect((cols - 1) * box, 0, box, rows * box);

  // cobra
  for (let part of snake) {
    ctx.fillStyle = "green";
    ctx.fillRect(part.x, part.y, box, box);
    ctx.strokeStyle = "darkgreen";
    ctx.strokeRect(part.x, part.y, box, box);
  }

  // comida
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);
}

// Função para mover a cobra
function update() {
  if (!direction) return;

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "UP") snakeY -= box;
  if (direction === "DOWN") snakeY += box;

  let newHead = { x: snakeX, y: snakeY };

  // colisão com paredes ou corpo
  if (
    snakeX <= 0 || snakeY <= 0 ||
    snakeX >= (cols - 1) * box || snakeY >= (rows - 1) * box ||
    snake.some(part => part.x === newHead.x && part.y === newHead.y)
  ) {
    clearInterval(game);
    alert("💀 Game Over! Pontuação: " + score);
    return;
  }

  snake.unshift(newHead);

  // comida
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    document.getElementById("score").textContent = "Pontuação: " + score;
    food = {
      x: Math.floor(Math.random() * (cols - 2) + 1) * box,
      y: Math.floor(Math.random() * (rows - 2) + 1) * box
    };
  } else {
    snake.pop();
  }

  draw();
}

// Função para resetar o jogo
function resetGame() {
  snake = [{ x: 1 * box, y: 1 * box }];
  food = {
    x: Math.floor(Math.random() * (cols - 2) + 1) * box,
    y: Math.floor(Math.random() * (rows - 2) + 1) * box
  };
  direction = null;
  score = 0;
  document.getElementById("score").textContent = "Pontuação: " + score;
  clearInterval(game);
  game = setInterval(update, 150);
}

// Controle de teclado
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";

  if (e.key === "r" || e.key === "R") resetGame();
});

// Inicia o jogo
let game = setInterval(update, 150);
draw();