const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const rows = 20;
const cols = 20;
const box = 20;

let snake = [{ x: 1 * box, y: 1 * box }];
let food = spawnFood();

let direction = null;
let score = 0;
let level = 1;
let exp = 0;
let expToNext = 3;
let maxLevel = 10;

// 🎨 Atualiza fundo e cor do texto - CORREÇÃO: Apenas a área do jogo muda de cor
function updateBackground() {
  let shade = Math.max(0, 255 - score * 20);
  document.querySelector(".game-container").style.backgroundColor = `rgb(${shade}, ${shade}, ${shade})`;
  
  // texto alterna entre preto e branco conforme fundo
  let textColor = shade < 128 ? "white" : "black";
  document.getElementById("score").style.color = textColor;
  document.getElementById("level").style.color = textColor;
}

// 🍏 Gera comida em posição livre e diferente da cobra - CORREÇÃO: Lógica melhorada
function spawnFood() {
  let validPosition = false;
  let newFood;
  let attempts = 0;
  const maxAttempts = 100; // Prevenir loop infinito

  while (!validPosition && attempts < maxAttempts) {
    attempts++;
    newFood = {
      x: Math.floor(Math.random() * (cols - 2) + 1) * box,
      y: Math.floor(Math.random() * (rows - 2) + 1) * box
    };

    // Verifica se a posição não está ocupada pela cobra
    validPosition = true;
    for (let part of snake) {
      if (part.x === newFood.x && part.y === newFood.y) {
        validPosition = false;
        break;
      }
    }
    
    // Verifica também se não está nas paredes
    if (newFood.x <= 0 || newFood.y <= 0 || 
        newFood.x >= (cols-1)*box || newFood.y >= (rows-1)*box) {
      validPosition = false;
    }
  }

  // Se não encontrou posição válida, usa fallback
  if (!validPosition) {
    // Procura uma posição válida de forma sistemática
    for (let y = 1; y < rows-1; y++) {
      for (let x = 1; x < cols-1; x++) {
        let candidate = {x: x * box, y: y * box};
        let positionFree = true;
        
        for (let part of snake) {
          if (part.x === candidate.x && part.y === candidate.y) {
            positionFree = false;
            break;
          }
        }
        
        if (positionFree) {
          return candidate;
        }
      }
    }
  }

  return newFood;
}

// 🖼️ Desenha cenário
function draw() {
  // Limpa apenas a área jogável, não as paredes
  ctx.clearRect(box, box, (cols-2)*box, (rows-2)*box);

  // paredes
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, cols * box, box);
  ctx.fillRect(0, (rows - 1) * box, cols * box, box);
  ctx.fillRect(0, 0, box, rows * box);
  ctx.fillRect((cols - 1) * box, 0, box, rows * box);

  // comida
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // cobra
  for (let part of snake) {
    ctx.fillStyle = "green";
    ctx.fillRect(part.x, part.y, box, box);
    ctx.strokeStyle = "darkgreen";
    ctx.strokeRect(part.x, part.y, box, box);
  }
}

// 🔄 Atualização por tick
function update() {
  if (!direction) return;

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "UP") snakeY -= box;
  if (direction === "DOWN") snakeY += box;

  let newHead = { x: snakeX, y: snakeY };

  // 🚫 colisão
  if (
    snakeX < box || snakeY < box ||
    snakeX >= (cols - 1) * box || snakeY >= (rows - 1) * box ||
    snake.some(part => part.x === newHead.x && part.y === newHead.y)
  ) {
    clearInterval(game);
    alert("💀 Game Over! Pontuação: " + score);
    return;
  }

  snake.unshift(newHead);

  // 🍏 comeu comida
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    exp++;
    document.getElementById("score").textContent = "Pontuação: " + score;
    updateBackground();

    if (exp >= expToNext) {
      exp = 0;
      level++;
      expToNext = Math.floor(expToNext * 1.5); // Aumenta a exp necessária
      document.getElementById("level").textContent = "Nível: " + level;
      document.getElementById("exp-bar").style.width = "0%";

      if (level >= maxLevel) {
        clearInterval(game);
        alert("🎉 Vitória! Você chegou ao nível máximo!");
        return;
      }
    } else {
      let percent = (exp / expToNext) * 100;
      document.getElementById("exp-bar").style.width = percent + "%";
    }

    food = spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

// 🔁 Resetar
function resetGame() {
  document.querySelector(".game-container").style.backgroundColor = "white";
  document.getElementById("score").style.color = "black";
  document.getElementById("level").style.color = "black";

  snake = [{ x: 1 * box, y: 1 * box }];
  food = spawnFood();
  direction = null;
  score = 0;
  level = 1;
  exp = 0;
  expToNext = 3;

  document.getElementById("score").textContent = "Pontuação: " + score;
  document.getElementById("level").textContent = "Nível: " + level;
  document.getElementById("exp-bar").style.width = "0%";

  clearInterval(game);
  game = setInterval(update, 150);
  draw();
}

// 🎮 Controles
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key.toLowerCase() === "r") resetGame();
});

// ▶️ Início
let game = setInterval(update, 150);
draw();
updateBackground();
