import { Container, Point } from "pixi.js";
import Game from "./Game";
import Ship from "./Ship";
import config from "../config";
import HarborsManager from "./HarborsManager";
import Harbor from "./Harbor";

export default class ShipsManager extends Container {
    private game: Game;
    private arrShips: Ship[] = [];
    private arrQueue: Ship[] = [];
    private arrQueueBack: Ship[] = [];
    private harborManager: HarborsManager;

    constructor() {
        super();

        this.game = Game.instance();
        this.harborManager = this.game.getManager('harborsManager') as HarborsManager;
        this.addShips();
        this.addTimer();
    }

    protected addTimer(): void {
        setInterval(() => {
            this.addShips();
        }, 8000);
    }

    protected addShips(): void {
        const type = Math.random() < 0.5 ? 0 : 1;
        const ship = new Ship(type);
        this.addChild(ship);
        
        const state = ship.getState();
        ship.position.set(this.game.app.screen.width, config[state].path);
        this.setPosition(ship);
        this.arrShips.push(ship);

        this.updatePosShips();
    }

    protected updatePosShips(): void {
        this.game.app.ticker.add(() => {
            for (let i = 0; i < this.arrShips.length; i++) {
                this.arrShips[i].getTween().update();
            }
        });
    }

    protected setPosition(ship: Ship, ms: number = 3000): void {
        let pos = new Point(config.entryPosX + 50, ship.position.y);
        let oldLenght = 0;
        if(this.arrQueue.length > 0) {
            oldLenght = this.arrQueue.length;
            for (let i = this.arrQueue.length - 1; i >= 0; i--) {
                
                const el = this.arrQueue[i];
                if (el.getType() === ship.getType()) {
                    const x = el.x + el.width;
                    const posX = x > config.entryPosX + 50 ? x : config.entryPosX + 50;
                    pos = new Point(posX, el.y);
                }
                break;
            }
        }
        
        ship.move(pos, ms, (val: Ship) => {
            if (this.arrQueue.length !== oldLenght) this.setPosition(ship, 500);
            else this.setQueue(val);
        });
    }

    protected async startProcessingHarbor(ship: Ship, harbor: Harbor) {
        ship.setIsBusy();
        this.harborManager.setBusyEntry(false);
        await this.harborManager.processing(harbor.getId());
        ship.update();
        this.arrQueueBack.push(ship);
        ship.setIsBusy();
        this.checkQueueBack();
    }

    protected updQueue(type: number): void {
        for (let i = this.arrQueue.length - 1; i >= 0; i--) {
            const el = this.arrQueue[i];
            if (el.getType() === type) {
                el.move(new Point(el.x - el.width, el.y), 500);
            } 
        }
    }

    protected setQueue(ship: Ship): void {
        this.arrQueue.push(ship);

        this.checkQueue();
    }
    
    public checkQueueBack(): void {
        if(this.harborManager.getEntryBusy() || this.arrQueueBack.length === 0) return;

        const ship = this.arrQueueBack[0];
        if(ship.getIsBusy()) return;
        this.wayBack(ship);
        this.arrQueueBack.splice(0, 1);
    }

    public checkQueue(): void {
        if(this.harborManager.getEntryBusy()) return;
        let index = null;
        let type = null;
        for (let i = 0; i < this.arrQueue.length; i++) {
            const el = this.arrQueue[i];
            const harbor = this.findHarbor(el.getType());
            if (harbor) {
                index = i;
                const pos = this.getHarborPos(harbor);
                this.harborManager.setBusyEntry(true);
                el.move(new Point(pos.x, pos.y), 1500, () => {
                    this.startProcessingHarbor(el, harbor);
                });
                type = el.getType();
                break;
            }
        }
        if(index !== null) {
            this.arrQueue.splice(index, index+1);
            this.updQueue(type);
        } 
    }

    protected findHarbor(type: number): Harbor {
        const harbor = this.harborManager.findHarbor(type);
        return harbor;
    }

    protected getHarborPos(harbor: Harbor): Point {
        const globalPos = harbor.getGlobalPosition();
        const posX = globalPos.x + harbor.width;
        const posY = globalPos.y + harbor.height / 2;

        return new Point(posX, posY);
    }

    protected wayBack(ship: Ship): void {
        this.harborManager.setBusyEntry(true);
        ship.move(new Point(config.entryPosX, config.backPath), 1500, () => {
            this.harborManager.setBusyEntry(false);
            ship.move(new Point(this.game.app.screen.width, config.backPath), 3000);
        });
    }
}