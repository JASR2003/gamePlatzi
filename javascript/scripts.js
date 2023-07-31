document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game');
    const game = canvas.getContext('2d');

    let canvasSize;
    let elementsSize;

    window.addEventListener("load", setCanvasSize());
    window.addEventListener("resize", setCanvasSize());

    function setCanvasSize() {
        if (window.innerHeight > window.innerWidth) {
            canvasSize = window.innerWidth * 0.7;
        } else {
            canvasSize = window.innerHeight * 0.7;
        }

        canvas.setAttribute('width', canvasSize);
        canvas.setAttribute('height', canvasSize);

        elementsSize = (canvasSize / 10) - 1;

        startGame();
    }

    function startGame() {
    game.font = elementsSize + "px Verdana" ;
    game.textAlign = "";

    for(let w = 0; w < 10; w++){
        for (let h = 1; h <= 10; h++) {
            game.fillText(emojis['X'], elementsSize * w, elementsSize * h);
        }
    }

    }
});
