import { Container, Graphics, Point } from "pixi.js";
import config from "../config";
import { Tween } from "@tweenjs/tween.js";
import Game from "./Game";

type states = 'load' | 'unload';

export const shipState: Record<number, states> = {
    0: 'load',
    1: 'unload'
};

export default class Ship extends Container {
    protected view: Graphics;
    protected type: number;
    protected game: Game;
    protected tween: Tween<Container>;
    protected isBusy = false;

    constructor(type: number) {
        super();
        this.type = type;
        this.createShip();
        this.pivot._y = this.height / 2;
    }

    protected createShip(): void {
        this.view = new Graphics();
        this.view.roundRect(0, 0, 150, 70, 20);
        this.view.fill({color: config[`${shipState[this.type]}`].shipColor, alpha: this.type});
        this.view.stroke({width: 15, color: config[`${shipState[this.type]}`].shipColor, alignment: 1});
        this.addChild(this.view);
    }
    
    public update(): void {
        this.view.clear();
        this.view.roundRect(0, 0, 150, 70, 20);
        this.view.fill({color: config[`${shipState[this.type]}`].shipColor, alpha: +!this.type});
        this.view.stroke({width: 15, color: config[`${shipState[this.type]}`].shipColor, alignment: 1});
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public move(pos: Point, duration: number = 2000, callback?: (val?: any) => void): void {
        this.tween = new Tween(this).to({x: pos.x, y: pos.y}, duration)
            .onComplete(() => {
                if(callback) callback(this);
            })
            .start();
    }

    public getState(): states {
        return shipState[this.type];
    }

    public getTween(): Tween<Container> {
        return this.tween;
    }
    
    public getType(): number {
        return this.type;
    }
    
    public setIsBusy(): void {
        this.isBusy = !this.isBusy;
    }

    public getIsBusy(): boolean {
        return this.isBusy;
    }
}