import { Clime } from './clime';
import { ClimeControl } from './clime-control';

export class AirDirectives {
  controller: ClimeControl;
  clime: Clime;
  temperature: string;
  humidity: string;
  
  constructor(controller: ClimeControl) {
      this.controller = controller;
  }

  monitor() {
      const message = this.controller.control(this.clime);
      this.temperature = message[0];
      this.humidity = message[1];
  }
  
}

