import { Switch } from "./switch";

export class MockPlug extends Switch {
  constructor() {
    const id = Math.random()
      .toString(16)
      .substr(2, 12);
    super(id, "mockplug");
  }
}
