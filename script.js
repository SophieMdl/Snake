let pause = false;

let snakeSlice;
let tail;
let head;
const audio = {
    eat: new Audio('sounds/eat.wav'),
    hurt: new Audio('sounds/hit.wav')
}

const appleSize = snakeSize = 15;

let userSpeed;
let scoreValue = 0;

const score = document.querySelector('.score span');
const score2 = document.querySelector(".score2");
const select = document.querySelector('.custom-select');
const title = document.querySelector("h1");
const title2 = document.querySelector(".title2");
const infos = document.querySelector(".flex");
const gameArea = document.querySelector('#game');

const game = {
    width: 900,
    height: 600,
}

const snake = {
    elem: document.querySelector('.snake'),
    x: 0,
    y: game.height / 2,
    speed: userSpeed,
    direction: 'right',
    size: snakeSize,
    length: 4,
    body: []
};

const apple = {
    elem: document.querySelector('.apple'),
    x: 0,
    y: 0,
    size: appleSize,
    collision: false
};

const snakeBody = () => {
    for (let i = 0; i < snake.length; i++) { //A CHANGER en foreach / for of
        //création d'un tableau contenant toutes les parties du serpent, avec pour chaque partie sa position x y.
        console.log(snake.y)
        snake.body.push({ x: snakeSize * i, y: snake.y, snakeSlice });
    }
    for (let u = 0; u < snake.length; u++) { //A CHANGER en foreach / for of
        //Pour chaque élément du tableau, une div de la classe snake est ajoutée à la page
        snake.body[u].snakeSlice = document.createElement("div");
        snake.body[u].snakeSlice.setAttribute('class', 'snake');
        gameArea.appendChild(snake.body[u].snakeSlice);
    }
}

const snakeDirection = (e) => {
    //La direction change en fonction de la touche appuyée. Et espace = pause
    if (e.which === 38 && snake.direction != 'down') { snake.direction = 'top'; }
    if (e.which === 40 && snake.direction != 'top') { snake.direction = 'down'; }
    if (e.which === 39 && snake.direction != 'left') { snake.direction = 'right'; }
    if (e.which === 37 && snake.direction != 'right') { snake.direction = 'left'; }
    if (e.which === 32) {
        if (!pause) pause = true;
        else pause = false;
    }
}

const moveSnake = () => {
    //head prend les valeurs de la dernière div placée sur le jeu
    head = snake.body[snake.length - 1];
    //Les coordonnées du serpent sont déterminées par la position de head
    snake.x = head.x;
    snake.y = head.y;
    //Le serpent avance d'une case (taille d'une 'tranche') en fonction de sa direction 
    if (snake.direction === 'top') { snake.y -= snake.size; }
    if (snake.direction === 'down') { snake.y += snake.size; }
    if (snake.direction === 'left') { snake.x -= snake.size; }
    if (snake.direction === 'right') { snake.x += snake.size; }
    //S'il ne rencontre pas de pomme
    if (!apple.collision) {
        //on retire la queue du seprent du tableau et on lui donne les coordonnées de la tête
        tail = snake.body.shift();
        tail.x = snake.x;
        tail.y = snake.y;
    } else {
        //S'il rencontre une pomme, on crée un nouvel élément de tableau et on place une nouvelle div sur le terrain
        tail = { x: snake.x, y: snake.y, snakeSlice };
        tail.snakeSlice = document.createElement("div");
        tail.snakeSlice.setAttribute('class', 'snake');
        gameArea.appendChild(tail.snakeSlice);
        snake.length += 1;
        apple.collision = false;
    }
    //On ajoute la queue avec ses nouvelles coordonnées à la fin du tableau
    snake.body.push(tail);
}

const checkCollisions = () => {
    //Si la tête du serpent rencontre une pomme
    if (((snake.x + snake.size) > apple.x) && //Droit
        (snake.x <= (apple.x + apple.size)) && //Gauche
        ((snake.y + snake.size) >= apple.y) && //Haut
        (snake.y <= (apple.y + apple.size))) { //bas
        audio.eat.play();
        resetApple();
        ++scoreValue;
        apple.collision = true;
    } else if (snake.x < 0 ||
        (snake.x + snake.size) > game.width ||
        snake.y < 0 ||
        (snake.y + snake.size) > game.height) {
        //Si la tête du serpent sort du terrain
        gameOver();
    }
    //Si la tête du serpent touche une partie de son corps
    for (let i = 0; i < snake.length - 2; i++) {
        if ((snake.x === snake.body[i].x) && (snake.y === snake.body[i].y)) {
            gameOver();
        }
    }
}

const resetApple = () => {
    //Position aléatoire de la pomme dans le terrain
    apple.x = Math.floor(Math.random() * (game.width - apple.size));
    apple.y = Math.floor(Math.random() * (game.height - apple.size));
    console.log(apple.size)
    apple.elem.style.top = apple.y + 'px';
    apple.elem.style.left = apple.x + 'px';
}

const menuDisappear = () => {
    infos.style.opacity = 0;
    title2.innerHTML = "";
    document.querySelector('h3').style.visibility = "hidden";
    title.innerHTML = "";
    score2.innerHTML = "";
}

const gameOver = () => {
    audio.hurt.play();
    pause = true;
    title.innerHTML = "GAME OVER";
    score2.innerHTML = "Score : " + scoreValue;
    title2.innerHTML = "Appuyez sur n'importe quelle touche pour recommencer";
    window.addEventListener('keydown', () => {
        window.location.reload();
    });
}

const init = () => {
    //Initialisation du jeu :
    //Disparition du menu, placement de la pomme et création du serpent 
    //Bouce qui dépend de la vitesse définie :
    //1 : 100ms
    //2 : 80ms
    //3 : 60ms
    //4 : 40ms
    //5 : 20ms
    menuDisappear();
    resetApple();
    snakeBody();
    userSpeed = 100 - 20 * (select.value - 1);
    setInterval(loop, userSpeed);
    window.removeEventListener('keydown', init);
    window.addEventListener('keydown', (e) => {
        snakeDirection(e);
    });
}

const render = () => {
    //Changement de position de chaque élément du tableau serpent et calcul du score
    for (let i = 0; i < snake.length; i++) { //changer en foreach
        snake.body[i].snakeSlice.style.top = snake.body[i].y + 'px';
        snake.body[i].snakeSlice.style.left = snake.body[i].x + 'px';
    }
    score.innerHTML = scoreValue;
}

const loop = () => {
    //Si le jeu n'est pas en pause, boucle qui fait bouger le serpent, vérifie les collisions et affiche le rendu à l'écran
    if (!pause) {
        moveSnake();
        checkCollisions();
        render();
    }
}

const addEventListeners = () => {
    window.addEventListener('keydown', init);
}

addEventListeners();