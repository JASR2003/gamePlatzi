    const canvas = document.getElementById('game');
    const game = canvas.getContext('2d');
    const btnUp = document.getElementById('up');
    const btnLeft = document.getElementById('left');
    const btnRight = document.getElementById('right');
    const btnDown = document.getElementById('down');
    const spanLives = document.getElementById('lives');
    const spanTime = document.getElementById('time');
    const spanRecord = document.getElementById('record');
    const pResult = document.getElementById('result');
    const btnRefrescar = document.getElementById('btnRefrescar');
    const btnBorrarRecord = document.getElementById('btnBorrarRecord');
    const btnsMove = document.getElementById('btns-move');
    const timeFinalP = document.getElementById('timeFinalP');
    const timeFinalS = document.getElementById('timeFinal');
    const timeAndLive = document.getElementById('timeAndLive');

    function refrescarPagina() {
        location.reload();
    }
    function borrarRecord() {
        localStorage.removeItem('record_time');
        alert("Record borrado, reinicia para volver a jugar");
    }

    let canvasSize;
    let elementsSize;
    let level = 0;
    let lives = 3;
    let timeStart;
    let timePlayer;
    let timeInterval;

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
            canvasSize = window.innerWidth * 0.7;
        } else {
            canvasSize = window.innerHeight * 0.7;
        }

        canvasSize = Number(canvasSize.toFixed(0));

        canvas.setAttribute('width', canvasSize);
        canvas.setAttribute('height', canvasSize);

        elementsSize = canvasSize / 10;

        playerPos.x = undefined;
        playerPos.y = undefined;
        startGame();
    }

    function startGame() {
        game.font = (elementsSize - 12) + 'px Verdana';
        game.textAlign = 'end';
        game.textBaseline = 'bottom';

        const map = maps[level];

        if (!map) {
            gameWinAndRecordTime();
            return;
        }

        if (!timeStart) {
            timeStart = Date.now();
            timeInterval = setInterval(showTime, 100);
            showRecord();
        }

        const mapRows = map.trim().split('\n');
        const mapRowCols = mapRows.map(row => row.trim().split(''));

        showLives();

        enemiesPos = [];
        game.clearRect(0, 0, canvasSize, canvasSize);

        mapRowCols.forEach((row, rowI) => {
            row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);
            if (col == "O") {
                if (!playerPos.x && !playerPos.y) {
                    playerPos.x = posX;
                    playerPos.y = posY;
                }
            } else if (col == "I") {
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
        const giftColX = playerPos.x.toFixed(0) == finishPos.x.toFixed(0);
        const giftColY = playerPos.y.toFixed(0) == finishPos.y.toFixed(0);
        const giftCol = giftColX && giftColY;

        if (giftCol) {
            levelWin();
        }

        const enemiesCol = enemiesPos.find( enemy => {
            const enemyColX = enemy.x.toFixed(0) == playerPos.x.toFixed(0);
            const enemyColY = enemy.y.toFixed(0) == playerPos.y.toFixed(0);
            return enemyColX && enemyColY;
        });

        if (enemiesCol) {
            levelFail();
        }

        game.fillText(emojis['PLAYER'], playerPos.x, playerPos.y);
    }

    function levelWin() {
        console.log('Subiste de nivel');
        level++;
        startGame();
    }

    function levelFail() {
    console.log('Chocaste');
    lives--;

    console.log(lives);

    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }

    playerPos.x = undefined;
    playerPos.y = undefined;
    startGame();
    }

    function gameWinAndRecordTime() {
        clearInterval(timeInterval);
        clearInterval(timeStart);
        clearInterval(timePlayer);
        console.log('¡Terminaste el juego!');
        btnRefrescar.style.display = "block";
        btnBorrarRecord.style.display = "block";
        btnsMove.style.display = "none";
        canvas.style.display = "none";
        timeAndLive.style.display = "none";
        const recordTime = localStorage.getItem('record_time');
        const playerTime = Date.now() - timeStart;
        const time = playerTime;
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        const milliseconds = time % 1000;
        timeFinalS.innerHTML = `${minutes}:${seconds}.${milliseconds}`;

        if (recordTime) {
            if (recordTime >= playerTime) {
                localStorage.setItem('record_time', playerTime);
                pResult.innerHTML = "record superado";
            } else {
                pResult.innerHTML = "record no superado";
            }
        } else {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = "primera vez? intenta superar tu marca";
        };

    }

    function showLives() {
        spanLives.innerHTML = emojis["HEART"].repeat(lives)
    }

    function showTime() {
        const time = Date.now() - timeStart;
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        const milliseconds = time % 1000;
        spanTime.innerHTML = `${minutes}:${seconds}.${milliseconds}`;
    }

    function showRecord() {
    const record_time = localStorage.getItem('record_time');
    if (record_time) {
        const minutes = Math.floor(record_time / 60000);
        const seconds = Math.floor((record_time % 60000) / 1000);
        const milliseconds = record_time % 1000;
        spanRecord.innerHTML = `${minutes}:${seconds}.${milliseconds}`;
    } else {
        spanRecord.innerHTML = 'Sin registro aún.';
    }
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