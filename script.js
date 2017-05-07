var gameWidth = 1200,
    gameHeight = 600;

var userSpeed = 5;
var snakeSlice;
var pause = false;
var head;
var appleSize = snakeSize = 15;

var gameArea = document.querySelector('#game');
var tail;

var collisionApple = false;

var game = {
    width: gameArea.offsetWidth,
    height: gameArea.offsetHeight,
    x: gameArea.offsetLeft,
    y: gameArea.offsetTop
}

var snake = {
    elem: document.querySelector('.snake'),
    x: game.width / 2,
    y: game.height / 2,
    speed: userSpeed,
    direction: 'right',
    size: snakeSize,
    length: 4,
    body: []
};

var apple = {
    elem: document.querySelector('.apple'),
    x: 0,
    y: 0,
    size: appleSize
};

var score = {
    elem: document.querySelector('.score'),
    value: 0
};

function snakeBody() {
    for (var i = 0; i < snake.length; i++) {
        snake.body.push({ x: snakeSize * i, y: snake.y, snakeSlice });
    }
    for (var u = 0; u < snake.length; u++) {
        snake.body[u].snakeSlice = document.createElement("div");
        snake.body[u].snakeSlice.setAttribute('class', 'snake');
        gameArea.appendChild(snake.body[u].snakeSlice);
    }
}

function snakeDirection(e) {
    if (e.which === 38) { snake.direction = 'top'; }
    if (e.which === 40) { snake.direction = 'down'; }
    if (e.which === 39) { snake.direction = 'right'; }
    if (e.which === 37) { snake.direction = 'left'; }
    if (e.which === 32) {
        if (!pause) pause = true;
        else pause = false;
    }
}

function moveSnake() {
    head = snake.body[snake.length - 1];
    console.log(snake.body)
    snake.x = head.x;
    snake.y = head.y;
    if (snake.direction == 'top') { snake.y -= snake.size; }
    if (snake.direction == 'down') { snake.y += snake.size; }
    if (snake.direction == 'left') { snake.x -= snake.size; }
    if (snake.direction == 'right') { snake.x += snake.size; }
    if (!collisionApple) {
        tail = snake.body.shift();
        tail.x = snake.x;
        tail.y = snake.y;
    } else {
        tail = { x: snake.x, y: snake.y, snakeSlice };
        tail.snakeSlice = document.createElement("div");
        tail.snakeSlice.setAttribute('class', 'snake');
        gameArea.appendChild(tail.snakeSlice);
        snake.length += 1;
        collisionApple = false;
    }
    snake.body.push(tail);
}

function checkCollisions() {
    if (((snake.x + snake.size) > apple.x) && //Droit
        (snake.x <= (apple.x + apple.size)) && //Gauche
        ((snake.y + snake.size) >= apple.y) && //Haut
        (snake.y <= (apple.y + apple.size))) { //bas
        resetApple();
        collisionApple = true;
    }
    if (snake.x < 0 || (snake.x + snake.size) > game.width || snake.y < 0 || (snake.y + snake.size) > game.height) {
        pause = true;
    }
}

function resetApple() {
    //Position aléatoire selon une grille correspondant à la taille du serpent
    apple.x = Math.floor(Math.random() * ((game.width - apple.size) / 5)) * 5;
    apple.y = Math.floor(Math.random() * ((game.height - apple.size) / 5)) * 5;
    apple.elem.style.top = apple.y + 'px';
    apple.elem.style.left = apple.x + 'px';
}

function init() {
    resetApple();
    setInterval(loop, 50);
    snakeBody();
    window.addEventListener('keydown', function(e) {
        snakeDirection(e);
    });
}

function render() {
    for (var i = 0; i < snake.length; i++) {
        snake.body[i].snakeSlice.style.top = snake.body[i].y + 'px';
        snake.body[i].snakeSlice.style.left = snake.body[i].x + 'px';
    }
}

function loop() {
    if (pause) {
        moveSnake();
        checkCollisions();
        render();
    }
}

init();