import { Meter } from "./meter";

export class MockMeter extends Meter {
  constructor(id: string) {
    super(id, "mockmeter");
  }
}
