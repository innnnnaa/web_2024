const canvas = document.getElementById('dino');
const ctx = canvas.getContext('2d');
const dinoWidth = 40;
const dinoHeight = 40;
let dinoX = 50;
let dinoY = canvas.height - dinoHeight;
let jump = false;
let score = 0;
let obstacleX = canvas.width;
const obstacleWidth = 20;
const obstacleHeight = 40;
let obstacleSpeed = 3;
let gameOver = false;
let bestScores = localStorage.getItem('dinoBestScores') ? JSON.parse(localStorage.getItem('dinoBestScores')) : [];
let lowestScores = localStorage.getItem('dinoLowestScores') ? JSON.parse(localStorage.getItem('dinoLowestScores')) : [];
const gameOverMessage = document.getElementById('gameOverMessage');
let gameStarted = false;

function drawDino() {
    ctx.fillStyle = 'green';
    ctx.fillRect(dinoX, dinoY, dinoWidth, dinoHeight);
}

function drawObstacle() {
    ctx.fillStyle = 'red';
    ctx.fillRect(obstacleX, canvas.height - obstacleHeight, obstacleWidth, obstacleHeight);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function draw() {
    if (gameOver) return;

    clearCanvas();
    drawDino();
    drawObstacle();
    drawScore();

    moveDino();
    moveObstacle();

    checkCollision();

    requestAnimationFrame(draw);
}

function moveDino() {
    if (jump) {
        dinoY -= 3;
        if (dinoY <= canvas.height - dinoHeight - 120) {
            jump = false;
        }
    } else {
        if (dinoY < canvas.height - dinoHeight) {
            dinoY += 3;
        }
    }
    score++;
}

function moveObstacle() {
    obstacleX -= obstacleSpeed;
    if (obstacleX + obstacleWidth < 0) {
        obstacleX = canvas.width;
    }
}

function checkCollision() {
    if (dinoX < obstacleX + obstacleWidth &&
        dinoX + dinoWidth > obstacleX &&
        dinoY < canvas.height &&
        dinoY + dinoHeight > canvas.height - obstacleHeight) {
        gameOver = true;
        updateScores();
        updateTable();
        gameOverMessage.style.display = 'block';
        gameStarted = false;
    }
}

function startGame() {
    if (gameStarted) {
        return;
    }
    gameStarted = true;
    score = 0;
    dinoY = canvas.height - dinoHeight;
    obstacleX = canvas.width;
    gameOver = false;
    obstacleSpeed = 2;
    gameOverMessage.style.display = 'none';
    draw();
}

function handleKeyPress(event) {
    if (event.code === 'Space' && dinoY === canvas.height - dinoHeight) {
        jump = true;
    }
}

document.addEventListener('keydown', handleKeyPress);

function updateScores() {
    bestScores.push(score);
    bestScores.sort((a, b) => b - a);
    bestScores = bestScores.slice(0, 3);
    lowestScores.push(score);
    lowestScores.sort((a, b) => a - b);
    lowestScores = lowestScores.slice(0, 3);
    localStorage.setItem('dinoBestScores', JSON.stringify(bestScores));
    localStorage.setItem('dinoLowestScores', JSON.stringify(lowestScores));
}

function updateTable() {
    const highScoresTable = document.getElementById('highScores');
    const lowScoresTable = document.getElementById('lowScores');

    highScoresTable.innerHTML = '';
    lowScoresTable.innerHTML = '';

    for (let i = 0; i < bestScores.length; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${i + 1}</td>
          <td>${bestScores[i]}</td>
        `;
        highScoresTable.appendChild(row);
    }

    for (let i = 0; i < lowestScores.length; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${i + 1}</td>
          <td>${lowestScores[i]}</td>
        `;
        lowScoresTable.appendChild(row);
    }
}

document.getElementById('startButton').addEventListener('click', startGame);

function increaseSpeed() {
    if (score % 1000 === 0 && score !== 0) {
        obstacleSpeed += 0.5;
    }
}

setInterval(increaseSpeed, 100);
updateTable()