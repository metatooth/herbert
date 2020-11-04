const vpd = require('./vpd');

test('vpd of 22*C & 65% humidity', () => {
  expect(vpd(22.0, 0.65)).toBeCloseTo(9.2);
});
