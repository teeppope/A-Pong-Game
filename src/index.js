const css = require('./game.css');
import Game from './Game';

//calling the game class
const game = new Game();

const fps = 30;

function gameLoop() {
	setTimeout(window.requestAnimationFrame(gameLoop), fps);
	game.render();
}

gameLoop();