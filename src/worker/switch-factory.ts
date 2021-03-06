const Wyze = require("wyze-node");

import { Switch } from "./switch";
import { Wyzeplug } from "./wyzeplug";
import { Mockplug } from "./mockplug";

export class SwitchFactory {
  systems: Array<string>;

  constructor(systems: Array<string>) {
    this.systems = systems;
  }

  public async build(configs: any[]): Promise<Array<Switch>> {
    const switches: Array<Switch> = [];

    configs.forEach(config => {
      if (config.type === "wyze") {
        const options = {
          username: config.username,
          password: config.password
        };
        console.log("STEP 1");
        const wyze = new Wyze(options);
        console.log("STEP 2");

        wyze.getDeviceList().then((dlist: Array<WyzeDevice>) => {
          console.log("STEP 3");
          dlist.forEach(device => {
            console.log("STEP 4");
            console.log(device);
            switches.push(
              new Wyzeplug(device, config.username, config.password)
            );
          });
        });
      }
    });

    return Promise.all(switches);
  }
}
