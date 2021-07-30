import { IrrigationTimer } from "./irrigation-timer";

test("Twice per day for 3 1/2 minutes each", () => {
  const timer = new IrrigationTimer(2, 210000, 10, 10, 0);
  expect(timer.isOn(0, 1)).toBe(true);
  expect(timer.isOn(100000, 1)).toBe(true);
  expect(timer.isOn(205000, 1)).toBe(true);
  expect(timer.isOn(210000, 1)).toBe(false);
  expect(timer.isOn(215000, 1)).toBe(false);
  expect(timer.isOn(300000, 1)).toBe(false);

  expect(timer.isOn(43200000, 1)).toBe(true);
  expect(timer.isOn(43300000, 1)).toBe(true);
  expect(timer.isOn(43405000, 1)).toBe(true);
  expect(timer.isOn(43410000, 1)).toBe(false);
  expect(timer.isOn(43415000, 1)).toBe(false);
  expect(timer.isOn(43420000, 1)).toBe(false);
});

test("Five times per day for 420 seconds each", () => {
  const timer = new IrrigationTimer(5, 420000, 10, 10, 0);
  expect(timer.isOn(0, 1)).toBe(true);
  expect(timer.isOn(100000, 1)).toBe(true);
  expect(timer.isOn(415000, 1)).toBe(true);
  expect(timer.isOn(420000, 1)).toBe(false);
  expect(timer.isOn(425000, 1)).toBe(false);
  expect(timer.isOn(500000, 1)).toBe(false);

  expect(timer.isOn(17280000, 1)).toBe(true);
  expect(timer.isOn(17380000, 1)).toBe(true);
  expect(timer.isOn(17695000, 1)).toBe(true);
  expect(timer.isOn(17700000, 1)).toBe(false);
  expect(timer.isOn(17705000, 1)).toBe(false);
  expect(timer.isOn(17780000, 1)).toBe(false);

  expect(timer.isOn(34560000, 1)).toBe(true);
  expect(timer.isOn(34660000, 1)).toBe(true);
  expect(timer.isOn(34975000, 1)).toBe(true);
  expect(timer.isOn(34980000, 1)).toBe(false);
  expect(timer.isOn(34985000, 1)).toBe(false);
  expect(timer.isOn(35060000, 1)).toBe(false);

  expect(timer.isOn(51840000, 1)).toBe(true);
  expect(timer.isOn(51940000, 1)).toBe(true);
  expect(timer.isOn(52255000, 1)).toBe(true);
  expect(timer.isOn(52260000, 1)).toBe(false);
  expect(timer.isOn(52265000, 1)).toBe(false);
  expect(timer.isOn(52340000, 1)).toBe(false);

  expect(timer.isOn(69120000, 1)).toBe(true);
  expect(timer.isOn(69220000, 1)).toBe(true);
  expect(timer.isOn(69535000, 1)).toBe(true);
  expect(timer.isOn(69540000, 1)).toBe(false);
  expect(timer.isOn(69545000, 1)).toBe(false);
  expect(timer.isOn(69620000, 1)).toBe(false);
});

test("Twice per day for 3 1/2 minutes each in two tranches", () => {
  const timer = new IrrigationTimer(2, 210000, 10, 5, 0);
  expect(timer.isOn(0, 1)).toBe(true);
  expect(timer.isOn(100000, 1)).toBe(true);
  expect(timer.isOn(205000, 1)).toBe(true);
  expect(timer.isOn(210000, 1)).toBe(false);
  expect(timer.isOn(215000, 1)).toBe(false);
  expect(timer.isOn(300000, 1)).toBe(false);

  expect(timer.isOn(43200000, 1)).toBe(true);
  expect(timer.isOn(43300000, 1)).toBe(true);
  expect(timer.isOn(43405000, 1)).toBe(true);
  expect(timer.isOn(43410000, 1)).toBe(false);
  expect(timer.isOn(43415000, 1)).toBe(false);
  expect(timer.isOn(43420000, 1)).toBe(false);

  expect(timer.isOn(0, 6)).toBe(false);
  expect(timer.isOn(100000, 6)).toBe(false);
  expect(timer.isOn(205000, 6)).toBe(false);
  expect(timer.isOn(210000, 6)).toBe(true);
  expect(timer.isOn(215000, 6)).toBe(true);
  expect(timer.isOn(420000, 6)).toBe(false);

  expect(timer.isOn(43200000, 6)).toBe(false);
  expect(timer.isOn(43300000, 6)).toBe(false);
  expect(timer.isOn(43405000, 6)).toBe(false);
  expect(timer.isOn(43410000, 6)).toBe(true);
  expect(timer.isOn(43415000, 6)).toBe(true);
  expect(timer.isOn(43420000, 6)).toBe(true);
  expect(timer.isOn(43620000, 6)).toBe(false);
});

test("Once per day for 1 minute, start at 12 hours UTC", () => {
  const timer = new IrrigationTimer(1, 60000, 1, 1, 12);
  expect(timer.isOn(0, 1)).toBe(false);
  expect(timer.isOn(43200000, 1)).toBe(true);
  expect(timer.isOn(43220000, 1)).toBe(true);
  expect(timer.isOn(43240000, 1)).toBe(true);
  expect(timer.isOn(43260000, 1)).toBe(false);
});
