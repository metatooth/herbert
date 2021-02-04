import { Clime } from "./clime";
import { ClimeControl } from "./clime-control";

export class AirDirectives {
  controller: ClimeControl;
  clime: Clime;
  temperature: string;
  humidity: string;

  constructor(controller: ClimeControl) {
    this.controller = controller;
    this.clime = new Clime(-1, 0.6, -1);
    this.temperature = "15.6";
    this.humidity = "0.40";
  }

  monitor(): void {
    const message = this.controller.control(this.clime);
    this.temperature = message[0];
    this.humidity = message[1];
  }
}
