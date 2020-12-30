const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class Mockbot {
    onadvertisement: Function;
    
    public async startScan() {

    }

    public async wait(ms: number) {
	console.log('milliseconds %d', ms);
	wait(ms/2);

	const now = new Date().getTime();
	const temp = 23.9 + Math.sin(2*3.14*now/360);
	const humidity = 55 + 2*Math.cos(2*3.14*now/360);

	const ad = {
            id: 'mock',
            address: 'mock',
            rssi: -125,
            serviceData: { 
		model: 'T',
		modelName: 'WoSensorTH',
		temperature: {
                    c: temp,
                    f: ((temp*9/5)+32)
		},
		fahrenheit: false,
		humidity: humidity,
		battery: 100
            }
	};

	console.log(this);
	console.log(this.onadvertisement);
	console.log(ad);
	
	return this.onadvertisement(ad);
    }

    public async stopScan() {

    }
}
