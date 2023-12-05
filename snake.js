const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

let direction = 1;
let perdiste = false;
let insectosComidos = 0;

let snake = [
    { x: 2, y: 1 },
    { x: 1, y: 1 },
    { x: 0, y: 1 }
];

let comida = { x: 0, y: 0 };
let obstaculos = [];

function drawSnake() {
    const coloresSerpiente = ['green', 'blue', 'yellow', 'orange', 'red'];

    snake.forEach((segment, index) => {
        const colorAleatorio = coloresSerpiente[Math.floor(Math.random() * coloresSerpiente.length)];
        ctx.fillStyle = colorAleatorio;

        // Dibuja cada segmento de la serpiente como un círculo
        ctx.beginPath();
        ctx.arc((segment.x * gridSize) + gridSize / 2, (segment.y * gridSize) + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

function drawComida() {
    ctx.fillStyle = 'white';
    ctx.fillRect(comida.x * gridSize, comida.y * gridSize, gridSize, gridSize);
}

function drawObstaculos() {
    ctx.fillStyle = 'gray'; // Color de los obstáculos por defecto

    obstaculos.forEach(obstaculo => {
        // Dibujar una forma que se asemeje a una casa
        ctx.fillStyle = 'brown'; // Color de la puerta

        ctx.beginPath();
        ctx.moveTo(obstaculo.x * gridSize, obstaculo.y * gridSize);
        ctx.lineTo(obstaculo.x * gridSize + gridSize / 2, obstaculo.y * gridSize - gridSize / 2);
        ctx.lineTo((obstaculo.x + 1) * gridSize, obstaculo.y * gridSize);
        ctx.lineTo((obstaculo.x + 1) * gridSize, (obstaculo.y + 1) * gridSize);
        ctx.lineTo(obstaculo.x * gridSize, (obstaculo.y + 1) * gridSize);
        ctx.closePath();
        ctx.fill();

        // Dibujar la ventana
        ctx.fillStyle = 'white'; // Color de la ventana
        ctx.fillRect(obstaculo.x * gridSize + gridSize / 3, obstaculo.y * gridSize + gridSize / 4, gridSize / 3, gridSize / 3);

    });
   
   
}

function generarObstaculos() {
    obstaculos = [];
    for (let i = 0; i < 10; i++) {
        let obstaculoX = Math.floor(Math.random() * gridWidth);
        let obstaculoY = Math.floor(Math.random() * gridHeight);
        obstaculos.push({ x: obstaculoX, y: obstaculoY });
    }
}

function generarComida() {
    comida.x = Math.floor(Math.random() * gridWidth);
    comida.y = Math.floor(Math.random() * gridHeight);
}

function actualizar() {
    if (perdiste) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('¡Perdiste!', canvas.width / 2 - 80, canvas.height / 2);
        crearBotonReinicio();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawComida();
    drawObstaculos(); // Dibujar los obstáculos
    moverSerpiente();
    if (snake[0].x === comida.x && snake[0].y === comida.y) {
        snake.push({});
        generarComida();
        insectosComidos++;
        actualizarMensajeInsectos();
    }
    checkLimites();
}

function moverSerpiente() {
    const cabeza = { ...snake[0] };
    snake.unshift(cabeza);
    if (direction === 1) cabeza.x++;
    if (direction === 2) cabeza.y--;
    if (direction === 3) cabeza.x--;
    if (direction === 4) cabeza.y++;
    snake.pop();
}

function checkObstaculos() {
    const cabeza = snake[0];
    return obstaculos.some(obstaculo => obstaculo.x === cabeza.x && obstaculo.y === cabeza.y);
}

function checkLimites() {
    const cabeza = snake[0];
    if (cabeza.x < 0 || cabeza.x >= gridWidth || cabeza.y < 0 || cabeza.y >= gridHeight || checkObstaculos()) {
        perdiste = true;
    }
}

document.addEventListener('keydown', function (e) {
    switch (e.key) {
        case 'ArrowUp':
            direction = 2;
            break;
        case 'ArrowRight':
            direction = 1;
            break;
        case 'ArrowLeft':
            direction = 3;
            break;
        case 'ArrowDown':
            direction = 4;
            break;
    }
});

function crearBotonReinicio() {
    if (!document.getElementById('restartButton')) {
        const restartButton = document.createElement('button');
        restartButton.id = 'restartButton';
        restartButton.innerText = 'Volver a Empezar';
        restartButton.addEventListener('click', () => {
            perdiste = false;
            snake = [
                { x: 2, y: 1 },
                { x: 1, y: 1 },
                { x: 0, y: 1 }
            ];
            direction = 1;
            generarComida();
            insectosComidos = 0;
            actualizarMensajeInsectos();
            restartButton.remove();
        });
        restartButton.style.position = 'absolute';
        restartButton.style.top = '50%';
        restartButton.style.left = '50%';
        restartButton.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(restartButton);
    }
}

function actualizarMensajeInsectos() {
    const mensajeInsectos = document.querySelector('h2 span');
    mensajeInsectos.textContent = insectosComidos;
}

function comenzarJuego() {
    generarObstaculos();
    generarComida();
    actualizarMensajeInsectos();
    setInterval(actualizar, 100);
}

// Crear mensaje inicial "Eating Animals"
const mensajeInicio = document.createElement('div');
mensajeInicio.innerText = 'Eating Animals';
mensajeInicio.style.color = 'white';
mensajeInicio.style.fontSize = '30px';
mensajeInicio.style.position = 'absolute';
mensajeInicio.style.top = '50%';
mensajeInicio.style.left = '50%';
mensajeInicio.style.transform = 'translate(-50%, -50%)';
document.body.appendChild(mensajeInicio);

// Botón para iniciar el juego
const startButton = document.createElement('button');
startButton.id = 'startButton';
startButton.innerText = 'Iniciar Juego';
startButton.addEventListener('click', () => {
    comenzarJuego();
    startButton.remove();
    mensajeInicio.remove();
});
startButton.style.position = 'absolute';
startButton.style.top = '60%';
startButton.style.left = '50%';
startButton.style.transform = 'translate(-50%, -50%)';
document.body.appendChild(startButton);