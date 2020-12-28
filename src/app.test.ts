import { App } from './app';

import * as WebSocket from 'ws';
let server: any;

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

test('handles an advertisement', () => {
    const app = App.instance();

    const ad = {
        id: 'aaaaaaaaaaaa',
        address: 'aa:aa:aa:aa:aa:aa',
        rssi: -125,
        serviceData: { 
            model: 'T',
            modelName: 'WoSensorTH',
            temperature: {
                c: 23.9,
                f: 75.0
            },
            fahrenheit: false,
            humidity: 55,
            battery: 100
        } 
    };

    return app.init().then(() => {
        app.handler(ad).then((data: Map<string, boolean>) => {
            expect(data).toStrictEqual(new Map([['heater', false],
                                                ['blower', false],
                                                ['dehumidifier', false],
                                                ['humidifier', false]]));
        });
    });
});

