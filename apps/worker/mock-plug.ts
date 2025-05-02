import { Switch } from "./switch";

export class MockPlug extends Switch {
  constructor(id: string) {
    super(id, "mockplug");
  }
}
