import { AirDirectives } from "./air-directives";
import { Clime } from "./clime";
import { ClimeControl } from "./clime-control";

test("air directives are off", () => {
  const directives = new AirDirectives(new ClimeControl());
  directives.clime = new Clime(25.1, 0.6, 0.65);
  directives.monitor();
  expect(directives.temperature).toBe("off");
  expect(directives.humidity).toBe("off");
});
