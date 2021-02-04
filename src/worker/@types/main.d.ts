interface IWoSensorTH {
  id: string;
  address: string;
  rssi: number;
  serviceData: {
    model: string;
    modelName: string;
    temperature: {
      c: number;
      f: number;
    };
    humidity: number;
    fahrenheit: boolean;
    battery: number;
  };
}

interface IDevice {
  id: string;
  nickname: string;
}

interface IDeviceState {
  status: string;
}
