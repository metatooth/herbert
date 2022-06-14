import { AirDirectives } from "./air-directives";
import { Clime } from "./clime";
import { ConstantVpd } from "./constant-vpd";

test("directives are off", () => {
  const directives = new AirDirectives(new ConstantVpd([1516, 1]));
  directives.clime = new Clime(25.5, 0.6, 0.5);
  directives.monitor();
  expect(directives.temperature).toBe("off");
  expect(directives.humidity).toBe("off");
});

test("directive is to heat & dehumidify", () => {
  const directives = new AirDirectives(new ConstantVpd([1300, 1]));
  directives.clime = new Clime(25.1, 0.6, 0.65);
  directives.monitor();
  expect(directives.temperature).toBe("heat");
  expect(directives.humidity).toBe("dehumidify");
});

test("directive is to cool & humidify", () => {
  const directives = new AirDirectives(new ConstantVpd([1300, 1]));
  directives.clime = new Clime(25.5, 0.6, 0.5);
  directives.monitor();
  expect(directives.temperature).toBe("cool");
  expect(directives.humidity).toBe("humidify");
});

test("heat to raise VPD", () => {
  const directives = new AirDirectives(new ConstantVpd([1000, 1]));
  directives.clime = new Clime(19, -1.67, 0.82);
  directives.monitor();
  expect(directives.temperature).toBe("heat");
  expect(directives.humidity).toBe("dehumidify");
});
