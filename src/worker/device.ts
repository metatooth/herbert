export class Device {
  device: string;
  manufacturer: string;
  state: number;

  constructor(device: string, manufacturer: string) {
    this.device = device;
    this.manufacturer = manufacturer;
  }
}
