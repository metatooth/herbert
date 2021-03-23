import { Meter } from "./meter";

export class MockMeter extends Meter {
  constructor() {
    const id = Math.random()
      .toString(16)
      .substr(2, 12);
    super(id, "mockbot");
  }
}
