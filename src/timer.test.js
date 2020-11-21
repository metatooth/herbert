const Timer = require('./timer');

test('12/12 starting at 6am', () => {
  const timer = new Timer(6, 12);
  expect(timer.isOn(0)).toBe(false);
  expect(timer.isOn(2)).toBe(false);
  expect(timer.isOn(4)).toBe(false);
  expect(timer.isOn(6)).toBe(true);
  expect(timer.isOn(8)).toBe(true);
  expect(timer.isOn(10)).toBe(true);
  expect(timer.isOn(12)).toBe(true);
  expect(timer.isOn(14)).toBe(true);
  expect(timer.isOn(16)).toBe(true);
  expect(timer.isOn(18)).toBe(false);
  expect(timer.isOn(20)).toBe(false);
  expect(timer.isOn(22)).toBe(false);
});


test('12/12 starting at 8am', () => {
  const timer = new Timer(8, 12);
  expect(timer.isOn(0)).toBe(false);
  expect(timer.isOn(2)).toBe(false);
  expect(timer.isOn(4)).toBe(false);
  expect(timer.isOn(6)).toBe(false);
  expect(timer.isOn(8)).toBe(true);
  expect(timer.isOn(10)).toBe(true);
  expect(timer.isOn(12)).toBe(true);
  expect(timer.isOn(14)).toBe(true);
  expect(timer.isOn(16)).toBe(true);
  expect(timer.isOn(18)).toBe(true);
  expect(timer.isOn(20)).toBe(false);
  expect(timer.isOn(22)).toBe(false);
});

