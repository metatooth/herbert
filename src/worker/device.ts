export class Device {
  device: string;
  manufacturer: string;
  state: string;

  constructor(device: string, manufacturer: string) {
    this.device = device;
    this.manufacturer = manufacturer;
  }
}
