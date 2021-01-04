const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class Mockplug {

    public constructor() {
    }

    public async off(): Promise<boolean> {
        return new Promise((resolve) => {
            wait(300);
            resolve(true);
        });
    }

    public async on(): Promise<boolean> {
        return new Promise((resolve) => {
            wait(300);
            resolve(true);
        });
    }

}
