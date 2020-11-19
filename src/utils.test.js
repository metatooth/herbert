const {vpd, vpsat, vpair, rh} = require('./utils');

<<<<<<< HEAD
test('vapor pressure saturated at 21.7*C', () => {
    expect(vpsat(21.7)).toBeCloseTo(2.595);
});

test('vapor pressure at 22*C and 65% relative humidity', () => {
    expect(vpair(22.0, 65.0)).toBeCloseTo(1.718);
});

test('vapor pressure deficit at 21*C, 22*C, and 65% relative humidity', () => {
  expect(vpd(21.0, 22.0, 65.0)).toBeCloseTo(0.768);
});

test('relative humidity at 9.2 kPa and 22*C', () => {
  expect(rh(9.2, 22.0)).toBeCloseTo(0.65);
});
