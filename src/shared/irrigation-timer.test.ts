import { IrrigationTimer } from "./irrigation-timer";

test("Twice per day for 3 1/2 minutes each", () => {
  const timer = new IrrigationTimer(2, 210000);
  expect(timer.isOn(0)).toBe(true);
  expect(timer.isOn(100000)).toBe(true);
  expect(timer.isOn(205000)).toBe(true);
  expect(timer.isOn(210000)).toBe(false);
  expect(timer.isOn(215000)).toBe(false);
  expect(timer.isOn(300000)).toBe(false);

  expect(timer.isOn(43200000)).toBe(true);
  expect(timer.isOn(43300000)).toBe(true);
  expect(timer.isOn(43405000)).toBe(true);
  expect(timer.isOn(43410000)).toBe(false);
  expect(timer.isOn(43415000)).toBe(false);
  expect(timer.isOn(43420000)).toBe(false);
});

test("Five times per day for 420 seconds each", () => {
  const timer = new IrrigationTimer(5, 420000);
  expect(timer.isOn(0)).toBe(true);
  expect(timer.isOn(100000)).toBe(true);
  expect(timer.isOn(415000)).toBe(true);
  expect(timer.isOn(420000)).toBe(false);
  expect(timer.isOn(425000)).toBe(false);
  expect(timer.isOn(500000)).toBe(false);

  expect(timer.isOn(17280000)).toBe(true);
  expect(timer.isOn(17380000)).toBe(true);
  expect(timer.isOn(17695000)).toBe(true);
  expect(timer.isOn(17700000)).toBe(false);
  expect(timer.isOn(17705000)).toBe(false);
  expect(timer.isOn(17780000)).toBe(false);

  expect(timer.isOn(34560000)).toBe(true);
  expect(timer.isOn(34660000)).toBe(true);
  expect(timer.isOn(34975000)).toBe(true);
  expect(timer.isOn(34980000)).toBe(false);
  expect(timer.isOn(34985000)).toBe(false);
  expect(timer.isOn(35060000)).toBe(false);

  expect(timer.isOn(51840000)).toBe(true);
  expect(timer.isOn(51940000)).toBe(true);
  expect(timer.isOn(52255000)).toBe(true);
  expect(timer.isOn(52260000)).toBe(false);
  expect(timer.isOn(52265000)).toBe(false);
  expect(timer.isOn(52340000)).toBe(false);

  expect(timer.isOn(69120000)).toBe(true);
  expect(timer.isOn(69220000)).toBe(true);
  expect(timer.isOn(69535000)).toBe(true);
  expect(timer.isOn(69540000)).toBe(false);
  expect(timer.isOn(69545000)).toBe(false);
  expect(timer.isOn(69620000)).toBe(false);
});
