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
    };
    humidity: number;
    fahrenheit: boolean;
    battery: number;
  };
}

interface WyzeDevice {
  nickname: string;
  mac: string;
  device_params: {
    switch_state: nubmer;
  };
}

interface Wyze {
  turnOff: function;
  turnOn: function;
}
