import { Clime } from "./clime";
import { Plug } from "./plug";

enum AirSystemStatus {
  Off = 0,
  On = 1
}

export class AirSystem {
  status: AirSystemStatus;
  plug: Plug;

  constructor(plug: Plug) {
    this.plug = plug;
  }
}

export class Blower extends AirSystem {
  intake: Clime;
  main: Clime;

  constructur(plug: Plug, intake: Clime, main: Clime): void {
    this.intake = intake;
    this.main = main;
  }

  public canCool(): boolean {
    return this.intake.temperature < this.main.temperature;
  }

  public canHeat(): boolean {
    return this.intake.temperature > this.main.temperature;
  }

  public canDehumidify(): boolean {
    return this.intake.humidity < this.main.humidity;
  }

  public canHumidify(): boolean {
    return this.intake.humidity > this.main.humidity;
  }
}

export class Dehumidifier extends AirSystem {}

export class Heater extends AirSystem {}

export class Humidifier extends AirSystem {}
