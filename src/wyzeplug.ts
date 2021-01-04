export class Wyzeplug {
    device: any;
    wyze: any;

    constructor(device: any) {
        this.device = device;
    }

    public async off(): Promise<boolean> {
        console.log('OFF', this.device.nickname);
        const result = await this.wyze.turnOff(this.device);
        return new Promise((resolve) => {
            if (result.code !== '1') {
                console.log('ERROR', JSON.stringify(result));
                resolve(false);
            } else {
                resolve(true);
            }
        });
    }

    public async on(): Promise<boolean> {
        console.log('ON', this.device.nickname);
        const result = await this.wyze.turnOn(this.device);
        return new Promise((resolve) => {
            if (result.code !== '1') {
                console.log('ERROR', JSON.stringify(result));
                resolve(false);
            } else {
                resolve(true);
            }
        });
    }
}

