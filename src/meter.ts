import * as Switchbot from 'node-switchbot';

import { Mockbot } from './mockbot';

export class Meter {
    id: string;
    bot: any;
    
    constructor(id: string) {
	console.log('mockbot ctor', id);
	this.id = id;

	if (this.id === 'mock') {
	    this.bot = new Mockbot();
	} else {
	    this.bot = new Switchbot();
	}
    }

    public async startScan() {
	return this.bot.startScan();
    }

    public async wait(ms: number) {
	return this.bot.wait(ms);
    }

    public async stopScan() {
	return this.bot.stopScan();
    }
}
