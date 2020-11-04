const {vpd, rh} = require('./vpd');

test('vpd of 22*C & 65% humidity', () => {
  expect(vpd(22.0, 0.65)).toBeCloseTo(9.2);
});

test('relative humidity at VPD 9.2 and 22*C', () => {
    expect(rh(9.2, 2.0)).toBeCloseTo(0.65);
});
