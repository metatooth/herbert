import { App } from './app';
import { Clime } from './clime';
import { Mockbot } from './mockbot';

import * as WebSocket from 'ws';
let server: WebSocket.Server;

beforeEach(() => {
    server = new WebSocket.Server({
        port: 8080
    });
});

afterEach(() => {
    server.close();
});


test('does run', () => {
    const app = App.instance();
    app.run().then((data: boolean) => {
        expect(data).toBe(true);
    });
});

test('checks to see if climate has changed, set system map if so', () => {
    const app = App.instance();

    app.clime = new Clime(-1, 0.6, -1);
    app.mainMeter = new Mockbot();
    app.mainMeter.clime = app.clime;
    
    return app.init().then(() => {
        app.check().then((data: Map<string, boolean>) => {
            expect(data).toStrictEqual(new Map([['heater', false],
                                                ['blower', false],
                                                ['dehumidifier', false],
                                                ['humidifier', false]]));
        });
    });
});

