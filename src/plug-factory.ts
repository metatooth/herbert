import * as Wyze from 'wyze-node';

import { Plug } from './plug';

export class PlugFactory {
    plugs: Map<string, Array<Plug>>;

    constructor(systems: Map<string, boolean>) {
        this.plugs = new Map();

        systems.forEach((value: boolean, key: string) => {
            this.plugs.set(key, []);
        });
    }

    public async build(configs: any[]): Promise<boolean> {
        return new Promise((resolve) => {
            configs.forEach((config) => {
                if (config.type === 'wyze') {
                    const options = {
                        username: config.username || process.env.USERNAME,
                        password: config.password || process.env.PASSWORD,
                    };
                    
                    const wyze = new Wyze(options);

                    wyze.getDeviceList().then((dlist: Array<Device>) => {
                        dlist.forEach((device: Device) => {
                            const nick: string = device.nickname;
                            this.plugs.forEach((v: Array<Plug>, k: string) => {
                                const re =
                                    new RegExp(`^${config.prefix} ${k}`, 'i');
                                if (nick.match(re)) {
                                    const plug = new Plug(device);
                                    plug.bot.wyze = wyze;
                                    v.push(plug);
                                }
                            });
                        });

                        resolve(true);
                    });
                }
            });

            resolve(false);
        });
    }
}
