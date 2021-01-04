import { Mockplug } from './mockplug';
import { Wyzeplug } from './wyzeplug';

export class Plug {
    bot: any;
    
    constructor(options: any) {

        if (options.id === 'mock') {
            this.bot = new Mockplug();
        } else {
            this.bot = new Wyzeplug(options);
        }
    }

    public async off(): Promise<boolean> {
        return this.bot.off();
    }

    public async on(): Promise<boolean> {
        return this.bot.on();
    }
}
