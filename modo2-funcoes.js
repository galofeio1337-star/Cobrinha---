<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Snake Mode 2</title>
  <style>
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
    }
    canvas {
      border: 2px solid black;
      margin-top: 20px;
    }
    #score {
      font-size: 20px;
      margin-top: 10px;
    }
    button {
      margin-top: 10px;
      padding: 5px 10px;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <h2>MENU---</h2>
  <a href="main.html">Modo Normal</a>
  <h1>🐍 Snake - Modo 2</h1>
  <canvas id="game" width="400" height="400"></canvas>
  <h1>Pontuação: <span id="score">0</span></h1>  

  <!-- script do modo 2 -->
  <script src="modo2-funcoes.js"></script>
</body>
</html>
