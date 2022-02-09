import { AirDirectives } from "./air-directives";
import { Clime } from "./clime";
import { HiLo } from "./hi-lo";

test("directive is to heat only", () => {
  const directives = new AirDirectives(new HiLo([25.3, 25.2, 0.65, 0.45]));
  directives.clime = new Clime(25.1, 0.6, 0.55);
  directives.monitor();
  expect(directives.temperature).toBe("heat");
  expect(directives.humidity).toBe("off");
});

test("directive is to humidify only", () => {
  const directives = new AirDirectives(new HiLo([25.3, 25.2, 0.65, 0.55]));
  directives.clime = new Clime(25.3, 0.6, 0.45);
  directives.monitor();
  expect(directives.temperature).toBe("off");
  expect(directives.humidity).toBe("humidify");
});

test("directive is to heat & dehumidify", () => {
  const directives = new AirDirectives(new HiLo([25.3, 25.2, 0.6, 0.55]));
  directives.clime = new Clime(25.1, 0.6, 0.65);
  directives.monitor();
  expect(directives.temperature).toBe("heat");
  expect(directives.humidity).toBe("dehumidify");
});

test("directive is to cool & dehumidify", () => {
  const directives = new AirDirectives(new HiLo([25.3, 25.2, 0.6, 0.55]));
  directives.clime = new Clime(25.5, 0.6, 0.65);
  directives.monitor();
  expect(directives.temperature).toBe("cool");
  expect(directives.humidity).toBe("dehumidify");
});
