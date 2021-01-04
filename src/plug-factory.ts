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
            console.log('build', configs);

            configs.forEach((config) => {
                console.log('config', config);

                if (config.type === 'wyze') {
                    const options = {
                        username: config.username || process.env.USERNAME,
                        password: config.password || process.env.PASSWORD,
                    };
                    
                    console.log('options', options);

                    const wyze = new Wyze(options);

                    console.log('wyze', wyze);

                    wyze.getDeviceList().then((dlist: Array<Device>) => {
                        console.log('dlist', dlist);
                        dlist.forEach((device: Device) => {
                            console.log('device', device);
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
        });
    }
}
