    const canvas = document.getElementById('game');
    const game = canvas.getContext('2d');
    const btnUp = document.getElementById('up');
    const btnLeft = document.getElementById('left');
    const btnRight = document.getElementById('right');
    const btnDown = document.getElementById('down');

    let canvasSize;
    let elementsSize;
    let level = 0;

    const playerPos = {
        x: undefined,
        y: undefined,
    };
    const finishPos = {
        x: undefined,
        y: undefined,
    }
    let enemiesPos = [];

    window.addEventListener("load", setCanvasSize);
    window.addEventListener("resize", setCanvasSize);

    function setCanvasSize() {
        if (window.innerHeight > window.innerWidth) {
            canvasSize = window.innerWidth * 0.8;
        } else {
            canvasSize = window.innerHeight * 0.8;
        }

        canvas.setAttribute('width', canvasSize);
        canvas.setAttribute('height', canvasSize);

        elementsSize = canvasSize / 10;

        startGame();
    }

    function startGame() {
        game.font = (elementsSize - 12) + 'px Verdana';
        game.textAlign = 'end';
        game.textBaseline = 'bottom';

        const map = maps[level];

        if (!map) {
            gameWin();
            return;
        }

        const mapRows = map.trim().split('\n');
        const mapRowCols = mapRows.map(row => row.trim().split(''));

        enemiesPos = [];
        game.clearRect(0,0, canvasSize, canvasSize);

        mapRowCols.forEach((row, rowI) => {
            row.forEach((col, colI) => {
                const emoji = emojis[col];
                const posX = elementsSize * (colI + 1);
                const posY = elementsSize * (rowI + 1);
                if(col == "O"){
                    if (!playerPos.x && !playerPos.y) {
                        playerPos.x = posX;
                        playerPos.y = posY;
                    }
                } else if(col == "I"){
                    finishPos.x = posX;
                    finishPos.y = posY;
                } else if (col == 'X') {
                    enemiesPos.push({
                    x: posX,
                    y: posY,
                    });
                }
                game.fillText(emoji, posX, posY);
            });
        });

        movePlayer();
    }

    function movePlayer(){
        const giftColX = playerPos.x.toFixed(2) == finishPos.x.toFixed(2);
        const giftColY = playerPos.y.toFixed(2) == finishPos.y.toFixed(2);
        const giftCol = giftColX && giftColY;

        if (giftCol) {
            levelWin();
        }

        const enemiesCol = enemiesPos.find( enemy => {
            const enemyColX = enemy.x.toFixed(2) == playerPos.x.toFixed(2);
            const enemyColY = enemy.y.toFixed(2) == playerPos.y.toFixed(2);
            return enemyColX && enemyColY;
        });

        if (enemiesCol) {
            console.log('Chocaste');
        }

        game.fillText(emojis['PLAYER'], playerPos.x, playerPos.y);
    }

    function levelWin() {
        console.log('Subiste de nivel');
        level++;
        startGame();
    }

    function gameWin() {
        console.log('¡Terminaste el juego!');
    }


    window.addEventListener('keydown', moveKeysDir);
    btnUp.addEventListener('click', moveUp);
    btnLeft.addEventListener('click', moveLeft);
    btnRight.addEventListener('click', moveRight);
    btnDown.addEventListener('click', moveDown);

    function moveKeysDir(event){
        if (event.code == "KeyW" || event.code == "ArrowUp") {
            moveUp();
        } else if (event.code == "KeyA" || event.code == "ArrowLeft") {
            moveLeft();
        } else if (event.code == "KeyD" || event.code == "ArrowRight") {
            moveRight();
        }   else if (event.code == "KeyS" || event.code == "ArrowDown") {
            moveDown();
        }
    }
    function moveUp(){
        if ((playerPos.y - elementsSize) < elementsSize ) {
        } else {
            playerPos.y -= elementsSize;
            startGame();
        }
    }
    function moveLeft(){
        if ((playerPos.x - elementsSize) < elementsSize ) {
        } else {
            playerPos.x -= elementsSize;
            startGame();
        }
    }
    function moveRight(){
        if ((playerPos.x + elementsSize) > canvasSize ) {
        } else {
            playerPos.x += elementsSize;
            startGame();
        }
    }
    function moveDown(){
        if ((playerPos.y + elementsSize) > canvasSize ) {
        } else {
            playerPos.y += elementsSize;
            startGame();
        }
    }