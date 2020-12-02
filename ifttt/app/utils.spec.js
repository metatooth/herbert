const {vpd, rh} = require('./utils');

test('vapor pressure deficit at 22*C and 65% relative humidity', () => {
  expect(vpd(22.0, 0.65)).toBeCloseTo(9.2);
});

test('relative humidity at VPD 9.2 and 22*C', () => {
  expect(rh(9.2, 22.0)).toBeCloseTo(0.65);
});
