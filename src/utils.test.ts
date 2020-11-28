import * as utils from './utils';

test('vapor pressure saturated at 21.7*C', () => {
    expect(utils.SaturationVaporPressure(21.7)).toBeCloseTo(25.908);
});

test('vapor pressure at 22*C and 65% relative humidity', () => {
    expect(utils.VaporPressureAir(22, 0.65)).toBeCloseTo(17.151);
});

test('vapor pressure deficit at 21*C, 22*C, and 65% relative humidity', () => {
    expect(utils.VaporPressureDeficit(21, 22, 0.65)).toBeCloseTo(7.671);
});

test('relative humidity at 9.2 kPa and 22*C', () => {
  expect(utils.RelativeHumidity(9.2, 22)).toBeCloseTo(0.65);
});
