import { AnySocketMessage } from "../shared/types";
import { Meter } from "./meter";

export class MockMeter extends Meter {
  constructor(id: string) {
    super(id, "mockmeter");
  }

  public status(): AnySocketMessage {
    const now = new Date().getTime();
    this.clime.temperature = 23.9 + 5 * Math.sin((2 * 3.14 * now) / 3600000);
    this.clime.humidity = 0.55 + 0.05 * Math.cos((2 * 3.14 * now) / 3600000);
    return super.status();
  }
}
