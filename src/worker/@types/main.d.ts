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

interface Device {
  id: string;
  type: string;
  nickname: string;
  macaddr: string;
}

interface DeviceState {
  status: string;
}

interface Wyze {
  turnOff: function;
  turnOn;
  function;
}
