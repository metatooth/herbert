import { IrrigationTimer } from "./irrigation-timer";

test("Twice per day for 3 1/2 minutes each", () => {
  const timer = new IrrigationTimer(2, 210);
  expect(timer.isOn(0)).toBe(true);
  expect(timer.isOn(100)).toBe(true);
  expect(timer.isOn(205)).toBe(true);
  expect(timer.isOn(210)).toBe(false);
  expect(timer.isOn(215)).toBe(false);
  expect(timer.isOn(300)).toBe(false);

  expect(timer.isOn(43200)).toBe(true);
  expect(timer.isOn(43300)).toBe(true);
  expect(timer.isOn(43405)).toBe(true);
  expect(timer.isOn(43410)).toBe(false);
  expect(timer.isOn(43415)).toBe(false);
  expect(timer.isOn(43420)).toBe(false);
});

test("Five times per day for 420 seconds each", () => {
  const timer = new IrrigationTimer(5, 420);
  expect(timer.isOn(0)).toBe(true);
  expect(timer.isOn(100)).toBe(true);
  expect(timer.isOn(415)).toBe(true);
  expect(timer.isOn(420)).toBe(false);
  expect(timer.isOn(425)).toBe(false);
  expect(timer.isOn(500)).toBe(false);

  expect(timer.isOn(17280)).toBe(true);
  expect(timer.isOn(17380)).toBe(true);
  expect(timer.isOn(17695)).toBe(true);
  expect(timer.isOn(17700)).toBe(false);
  expect(timer.isOn(17705)).toBe(false);
  expect(timer.isOn(17780)).toBe(false);

  expect(timer.isOn(34560)).toBe(true);
  expect(timer.isOn(34660)).toBe(true);
  expect(timer.isOn(34975)).toBe(true);
  expect(timer.isOn(34980)).toBe(false);
  expect(timer.isOn(34985)).toBe(false);
  expect(timer.isOn(35060)).toBe(false);

  expect(timer.isOn(51840)).toBe(true);
  expect(timer.isOn(51940)).toBe(true);
  expect(timer.isOn(52255)).toBe(true);
  expect(timer.isOn(52260)).toBe(false);
  expect(timer.isOn(52265)).toBe(false);
  expect(timer.isOn(52340)).toBe(false);

  expect(timer.isOn(69120)).toBe(true);
  expect(timer.isOn(69220)).toBe(true);
  expect(timer.isOn(69535)).toBe(true);
  expect(timer.isOn(69540)).toBe(false);
  expect(timer.isOn(69545)).toBe(false);
  expect(timer.isOn(69620)).toBe(false);

});
