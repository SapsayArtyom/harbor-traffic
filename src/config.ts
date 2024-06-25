export interface IConfig {
    harborColor: number,
    unload: {
        shipColor: number,
        path: number,
    },
    load: {
        shipColor: number,
        path: number,
    },
    backPath: number,
    entryPosX: number
}

const config: IConfig = {
    harborColor: 0xc3cd30,
    unload: {
        shipColor: 0xdd1270,
        path: 400,
    },
    load: {
        shipColor: 0x12dda5,
        path: 680,
    },
    backPath: 540,
    entryPosX: 500
};

export default config;