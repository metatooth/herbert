import { Clime } from "./clime";
import { Switch } from "./switch";

enum AirSystemStatus {
  Off = 0,
  On = 1
}

export class AirSystem {
  status: AirSystemStatus;
  switcher: Switch;

  constructor(switcher: Switch) {
    this.switcher = switcher;
  }
}

export class Blower extends AirSystem {
  intake: Clime;
  main: Clime;

  constructor(switcher: Switch, intake: Clime, main: Clime) {
    super(switcher);
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
