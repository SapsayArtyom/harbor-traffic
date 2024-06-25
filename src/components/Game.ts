import { Application, Container } from "pixi.js";
import ShipsManager from "./ShipsManager";
import HarborsManager from "./HarborsManager";

export default class Game extends Container {
    protected static _instance: Game;

    public app: Application;

    private shipsManager: ShipsManager;
    private harborsManager: HarborsManager;

    constructor(app: Application) {
        super();

        this.app = app;
    }
    
    public static instance(app?: Application): Game {
        if (!Game._instance) {
            Game._instance = new Game(app);
        }
        return Game._instance;
    }
            
    public startGame(): void {
        this.addHarborsManager();
        this.addShipsManager();
    }

    protected addShipsManager(): void {
        this.shipsManager = new ShipsManager();
        this.addChild(this.shipsManager);
        this.harborsManager.setShipsManager();
    }
    
    protected addHarborsManager(): void {
        this.harborsManager = new HarborsManager();
        this.addChild(this.harborsManager);
    }

    public getManager(type: 'harborsManager' | 'shipsManager'): HarborsManager | ShipsManager   {
        return this[type];
    }
}