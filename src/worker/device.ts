export class Device {
  device: string;
  manufacturer: string;
  state = "";

  constructor(device: string, manufacturer: string) {
    this.device = device;
    this.manufacturer = manufacturer;
  }
}
