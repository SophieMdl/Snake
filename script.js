var pause = false;
var collisionApple = false;

var snakeSlice;
var tail;
var head;

var appleSize = snakeSize = 15;

var userSpeed;

var gameArea = document.querySelector('#game');

var game = {
    //La taille du terrain étant responsive, la taille est calculée dynamiquement à chaque lancement
    // 8 = prise en compte de la bordure
    width: gameArea.offsetWidth - 8,
    height: gameArea.offsetHeight,
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
        //création d'un tableau contenant toutes les parties du serpent, avec pour chaque partie sa position x y.
        snake.body.push({ x: snakeSize * i, y: snake.y, snakeSlice });
    }
    for (var u = 0; u < snake.length; u++) {
        //Pour chaque élément du tableau, une div de la classe snake est ajoutée à la page
        snake.body[u].snakeSlice = document.createElement("div");
        snake.body[u].snakeSlice.setAttribute('class', 'snake');
        gameArea.appendChild(snake.body[u].snakeSlice);
    }
}

function snakeDirection(e) {
    //La direction change en fonction de la touche appuyée. Et espace = pause
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
    //head prend les valeurs de la dernière div placée sur le jeu
    head = snake.body[snake.length - 1];
    //Les coordonnées du serpent sont déterminées par la position de head
    snake.x = head.x;
    snake.y = head.y;
    //Le serpent avance d'une case (taille d'une 'tranche') en fonction de sa direction 
    if (snake.direction == 'top') { snake.y -= snake.size; }
    if (snake.direction == 'down') { snake.y += snake.size; }
    if (snake.direction == 'left') { snake.x -= snake.size; }
    if (snake.direction == 'right') { snake.x += snake.size; }
    //S'il ne rencontre pas de pomme
    if (!collisionApple) {
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
        collisionApple = false;
    }
    //On ajoute la queue avec ses nouvelles coordonnées à la fin du tableau
    snake.body.push(tail);
}

function checkCollisions() {
    //Si la tête du serpent rencontre une pomme
    if (((snake.x + snake.size) > apple.x) && //Droit
        (snake.x <= (apple.x + apple.size)) && //Gauche
        ((snake.y + snake.size) >= apple.y) && //Haut
        (snake.y <= (apple.y + apple.size))) { //bas
        resetApple();
        collisionApple = true;
    } else if (snake.x <= 8 ||
        (snake.x + snake.size) >= game.width ||
        snake.y <= 8 ||
        (snake.y + snake.size) >= game.height) {
        //Si la tête du serpent sort du terrain
        pause = true;
    }

}

function resetApple() {
    //Position aléatoire de la pomme dans le terrain
    apple.x = Math.floor(Math.random() * game.width);
    apple.y = Math.floor(Math.random() * game.height);
    apple.elem.style.top = apple.y + 'px';
    apple.elem.style.left = apple.x + 'px';
}

function init() {
    //Initialisation du jeu :
    //Placement de la pomme et création du serpent
    //Mise en place d'une boucle toutes les 50 ms (dépendra de la vitesse de départ)
    //Mise en place d'un écouteur de clavier
    resetApple();
    snakeBody();
    setInterval(loop, 50);
    window.addEventListener('keydown', function(e) {
        snakeDirection(e);
    });
}

function render() {
    //Changement de position de chaque élément du tableau serpent et calcul du score
    for (var i = 0; i < snake.length; i++) {
        snake.body[i].snakeSlice.style.top = snake.body[i].y + 'px';
        snake.body[i].snakeSlice.style.left = snake.body[i].x + 'px';
    }
}

function loop() {
    //Si le jeu n'est pas en pause, boucle qui fait bouger le serpent, vérifie les collisions et affiche le rendu à l'écran
    if (!pause) {
        moveSnake();
        checkCollisions();
        render();
    }
}

init();