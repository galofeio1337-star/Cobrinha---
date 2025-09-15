const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const rows = 20;
const cols = 20;
const box = 20;

let snake = [{ x: 1 * box, y: 1 * box }];
let food = {
  x: Math.floor(Math.random() * (cols - 2) + 1) * box,
  y: Math.floor(Math.random() * (rows - 2) + 1) * box
};

let direction = null;
let score = 0;
let fallingBlocks = [];
let avisos = []; // colunas onde os blocos vão cair

// Poder azul e cooldown
let powerUpActive = false;
let cooldown = false;
let cooldownTime = 5; // segundos
let cooldownRemaining = 0;

// Atualizar label do cooldown
function updateCooldownLabel() {
  const cdLabel = document.getElementById("cooldown");
  const cdBar = document.getElementById("cooldown-bar");

  if (!cooldown) {
    cdLabel.textContent = "Cooldown: pronto";
    cdBar.style.width = "100%";
  } else {
    cdLabel.textContent = "Cooldown: " + cooldownRemaining + "s";
    let percent = (cooldownRemaining / cooldownTime) * 100;
    cdBar.style.width = percent + "%";
  }
}

// Função para desenhar tudo
function draw() {
  ctx.fillStyle = "#e0ffe0";
  ctx.fillRect(0, 0, cols * box, rows * box);

  // paredes
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, cols * box, box);
  ctx.fillRect(0, (rows - 1) * box, cols * box, box);
  ctx.fillRect(0, 0, box, rows * box);
  ctx.fillRect((cols - 1) * box, 0, box, rows * box);

  // comida
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // avisos
  drawAvisos();

  // blocos caindo
  drawBlocks();

  // cobra
  for (let part of snake) {
    ctx.fillStyle = powerUpActive ? "blue" : "green";
    ctx.fillRect(part.x, part.y, box, box);
    ctx.strokeStyle = powerUpActive ? "darkblue" : "darkgreen";
    ctx.strokeRect(part.x, part.y, box, box);
  }
}

// Função para desenhar os blocos
function drawBlocks() {
  ctx.fillStyle = "orange";
  for (let block of fallingBlocks) {
    ctx.fillRect(block.x, block.y, block.width, block.height);
    ctx.strokeStyle = "darkorange";
    ctx.strokeRect(block.x, block.y, block.width, block.height);
  }
}

// Função para desenhar avisos
function drawAvisos() {
  ctx.fillStyle = "rgba(255,0,0,0.3)"; // vermelho transparente
  for (let aviso of avisos) {
    ctx.fillRect(aviso.x, box, aviso.width, (rows - 2) * box);
  }
}

// Função para atualizar os blocos
function updateBlocks() {
  for (let i = 0; i < fallingBlocks.length; i++) {
    fallingBlocks[i].y += box;

    // colisão com cobra
    if (snake.some(part => part.x === fallingBlocks[i].x && part.y === fallingBlocks[i].y)) {
      if (powerUpActive) {
        // destrói o bloco em vez de morrer
        fallingBlocks.splice(i, 1);
        i--;
        continue;
      } else {
        clearInterval(game);
        alert("💀 Game Over! Colidiu com um bloco!");
        return;
      }
    }

    // remove blocos que saíram da tela
    if (fallingBlocks[i].y >= (rows - 1) * box) {
      fallingBlocks.splice(i, 1);
      i--;
    }
  }
}

// Criar aviso → depois bloco
function createWarningAndBlock() {
  const x = Math.floor(Math.random() * (cols - 2) + 1) * box;
  const avisoObj = { x: x, width: box };

  // mostra aviso
  avisos.push(avisoObj);

  // tempo de aviso (1s antes do bloco cair)
  setTimeout(() => {
    // remove aviso
    avisos = avisos.filter(a => a !== avisoObj);

    // cria bloco depois que o aviso some
    const block = {
      x: x,
      y: box,
      width: box,
      height: box
    };
    fallingBlocks.push(block);
  }, 1000);
}

// Ativar poder azul com cooldown
function activatePowerUp() {
  if (powerUpActive || cooldown) return; // já ativo ou em recarga

  powerUpActive = true;
  cooldown = true;
  cooldownRemaining = cooldownTime;
  updateCooldownLabel();

  // dura 1 segundo
  setTimeout(() => {
    powerUpActive = false;
  }, 1000);

  // iniciar contagem do cooldown
  let cdInterval = setInterval(() => {
    cooldownRemaining--;
    updateCooldownLabel();
    if (cooldownRemaining <= 0) {
      cooldown = false;
      updateCooldownLabel();
      clearInterval(cdInterval);
    }
  }, 1000);
}

// Função principal de atualização
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

  // comer comida
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

  // atualiza blocos e desenha tudo
  updateBlocks();
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
  fallingBlocks = [];
  avisos = [];
  powerUpActive = false;
  cooldown = false;
  cooldownRemaining = 0;
  document.getElementById("score").textContent = "Pontuação: " + score;
  updateCooldownLabel();
  clearInterval(game);
  game = setInterval(update, 150);
}

// Controle de teclado
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key.toLowerCase() === "r") resetGame();
  if (e.key === " ") activatePowerUp(); // espaço ativa o poder
});

// inicia avisos/blocos a cada 2 segundos
setInterval(createWarningAndBlock, 2000);

// inicia o jogo
let game = setInterval(update, 150);
draw();
