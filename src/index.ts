import {Application, Container} from 'pixi.js';
import './index.css';
import Game from './components/Game';
new class Main {

    protected app: Application;
    protected mainContainer: Container;
    protected game: Game;

    constructor() {
        this.initGame();
    }

    async initGame() {
        this.app = new Application();
        await this.app.init({
            width: 1920,
            height: 1080,
            backgroundColor: 0x0070e7
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).__PIXI_APP__ = this.app;

        document.body.appendChild(this.app.canvas);
        this.mainContainer = new Container();
        this.app.stage.addChild(this.mainContainer);

        this.game = Game.instance(this.app);
        this.game.startGame();
        this.mainContainer.addChild(this.game);
    }
};
