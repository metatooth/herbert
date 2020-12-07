import { App } from './app';

test('handles an advertisement', () => {
    const app = new App;

    const ad = { 
        id: 'aaaaaaaaaaaa', 
        serviceData: { 
            model: 'T',
            temperature: {
                c: 23.9
            },
            humidity: 55
        } 
    };

    return app.init().then(() => {
        app.handler(ad).then((data: any) => {
            expect(data).toStrictEqual(
                { 'heater': 'off', 'dehumidifier': 'off', 'humidifier': 'off' }
            );
        }).catch((err: any) => {
            console.log(`ERR ${err}`);
        });
    });
});
