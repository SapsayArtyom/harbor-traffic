import { Container, Graphics } from "pixi.js";
import Harbor from "./Harbor";
import Game from "./Game";
import config from "../config";
import ShipsManager from "./ShipsManager";

export default class HarborsManager extends Container {
    private harbor: Harbor;
    private game: Game;
    private harborCont: Container;
    private entryCont: Container;
    private arrHarbors: Harbor[] = [];
    private entryBusy: boolean;
    private shipsManager: ShipsManager;

    constructor() {
        super();

        this.game = Game.instance();
        this.addHarbors();
        this.addEntry();
        this.pos();
    }

    private addHarbors(): void {
        this.harborCont = new Container();
        this.addChild(this.harborCont);
        for (let i = 0; i < 4; i++) {
            this.harbor = new Harbor(i);
            this.harbor.position.y = (this.harbor.height + 20) * i ;
            this.arrHarbors.push(this.harbor);
            this.harborCont.addChild(this.harbor);
        }
    }

    private addEntry(): void {
        const wallLength = this.game.app.screen.height / 2 - 200;
        this.entryCont = new Container();
        const topWall = new Graphics();
        topWall.rect(0, 0, 20, wallLength);
        topWall.fill(0xcccccc);
        this.entryCont.addChild(topWall);
        
        const bottomWall = new Graphics();
        bottomWall.rect(0, this.game.app.screen.height - wallLength, 20, wallLength);
        bottomWall.fill(0xcccccc);
        this.entryCont.addChild(bottomWall);
        this.addChild(this.entryCont);
    }

    public findHarbor(type: number): Harbor {
        let harbor = null;
        for (let i = 0; i < this.arrHarbors.length; i++) {
            const el = this.arrHarbors[i];
            if (el.getType() === +!type && !el.isBusy && !this.entryBusy) {
                harbor = el;
                harbor.isBusy = !harbor.isBusy;
                break;
            }
        }
        
        return harbor;
    }

    public async processing(id: number): Promise<void> {
        const harbor = this.arrHarbors[id];
        await harbor.processing();
        harbor.isBusy = !harbor.isBusy;
        harbor.update();
    }

    public setBusyEntry(val: boolean): void {
        this.entryBusy = val;
        
        if (!this.entryBusy) {
            this.shipsManager.checkQueueBack();
            this.shipsManager.checkQueue();
        } 
    }

    public getEntryBusy(): boolean {
        return this.entryBusy;
    }
        
    public setShipsManager(): void {
        this.shipsManager = this.game.getManager('shipsManager') as ShipsManager;
    }

    private pos(): void {
        this.harborCont.position.y = (this.game.app.screen.height - this.harborCont.height) / 2;
        this.entryCont.x = config.entryPosX;
    }
}