import { AnySocketMessage } from "../shared/types";
import { Meter } from "./meter";

export class MockMeter extends Meter {
  constructor(id: string) {
    super(id, "mockmeter");
  }

  public status(): AnySocketMessage {
    return super.status();
  }
}
