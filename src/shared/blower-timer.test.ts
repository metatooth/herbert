import { BlowerTimer } from "./blower-timer";

test("blower cycles at 45/180", () => {
  const timer = new BlowerTimer(45, 180);
  expect(timer.isOn(0)).toBe(true);
  expect(timer.isOn(10)).toBe(true);
  expect(timer.isOn(20)).toBe(true);
  expect(timer.isOn(40)).toBe(true);
  expect(timer.isOn(50)).toBe(false);

  expect(timer.isOn(178)).toBe(false);
  expect(timer.isOn(179)).toBe(false);
  expect(timer.isOn(180)).toBe(true);
  expect(timer.isOn(181)).toBe(true);

  expect(timer.isOn(358)).toBe(false);
  expect(timer.isOn(359)).toBe(false);
  expect(timer.isOn(360)).toBe(true);
  expect(timer.isOn(361)).toBe(true);

  expect(timer.isOn(403)).toBe(true);
  expect(timer.isOn(404)).toBe(true);
  expect(timer.isOn(405)).toBe(false);
  expect(timer.isOn(406)).toBe(false);
});
