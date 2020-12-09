interface WoSensorTH {
    id: string;
    address: string;
    rssi: number;
    serviceData: {
        model: string;
        modelName: string;
        temperature: {
            c: number;
            f: number;
        }
        humidity: number;
        farenheit: number;
        battery: number;
    }
}

interface Device {
    nickname: string;
}
