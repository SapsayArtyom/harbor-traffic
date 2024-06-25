import { Container, Graphics } from "pixi.js";
import config from "../config";

export default class Harbor extends Container {
    protected view: Graphics;
    protected type = 0;
    protected id: number;
    public isBusy = false;

    constructor(id: number) {
        super();
        this.id = id;
        this.createHarbor();
    }

    protected createHarbor(): void {
        this.view = new Graphics();
        this.view.rect(0, 0, 100, 200);
        this.view.fill({color: config.harborColor, alpha: 0});
        this.view.stroke({width: 15, color: config.harborColor, alignment: 1});
        this.addChild(this.view);
    }

    public async processing(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    public update(): void {
        this.type = +!this.type;
        this.view.clear();
        this.view.rect(0, 0, 100, 200);
        this.view.fill({color: config.harborColor, alpha: this.type});
        this.view.stroke({width: 15, color: config.harborColor, alignment: 1});
    }

    public getType(): number {
        return this.type;
    }
    
    public getId(): number {
        return this.id;
    }
}