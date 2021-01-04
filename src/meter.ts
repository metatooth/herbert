import * as Switchbot from 'node-switchbot';

import { Mockbot } from './mockbot';

export class Meter {
    id: string;
    bot;
    
    constructor(id: string) {
        this.id = id;

        if (this.id === 'mock') {
            this.bot = new Mockbot();
        } else {
            this.bot = new Switchbot();
        }
    }

    public async startScan(): Promise<boolean> {
        return this.bot.startScan();
    }

    public async wait(ms: number): Promise<boolean> {
        return this.bot.wait(ms);
    }

    public async stopScan(): Promise<boolean> {
        return this.bot.stopScan();
    }
}
