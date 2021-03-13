import * as utils from "./utils";

test("celsius2fahrenheit", () => {
  expect(utils.celsius2fahrenheit(0)).toBeClose(32, 0);
  expect(utils.celsius2fahrenheit(100)).toBeClose(212, 0);
});

test("fahrenheit2celsius", () => {
  expect(utils.fahrenheit2celsius(32)).toBeClose(0, 0);
  expect(utils.fahrenheit2celsius(212)).toBeClose(100, 0);
});

test("saturated vapor pressure", () => {
  expect(utils.SaturatedVaporPressure(21.7)).toBeCloseTo(2595, 0);
  expect(utils.SaturatedVaporPressure(1)).toBeCloseTo(657, 0);
  expect(utils.SaturatedVaporPressure(5)).toBeCloseTo(872, 0);
  expect(utils.SaturatedVaporPressure(10)).toBeCloseTo(1228, 0);
  expect(utils.SaturatedVaporPressure(15)).toBeCloseTo(1705, 0);
  expect(utils.SaturatedVaporPressure(20)).toBeCloseTo(2338, 0);
  expect(utils.SaturatedVaporPressure(30)).toBeCloseTo(4242, 0);
  expect(utils.SaturatedVaporPressure(40)).toBeCloseTo(7374, 0);
});

test("vapor pressure at 22 C and 65% relative humidity", () => {
  expect(utils.VaporPressureAir(22.0, 0.65)).toBeCloseTo(1718, 0);
});

test("vapor pressure deficit", () => {
  expect(utils.VaporPressureDeficit(21.0, 0.6, 0.65)).toBeCloseTo(780, 0);
  expect(utils.VaporPressureDeficit(25.3, 0.6, 0.55)).toBeCloseTo(1338, 0);
  expect(utils.VaporPressureDeficit(23.1, 0.0, 0.55)).toBeCloseTo(1272, 0);
});

test("relative humidity at 1718 pascals and 22 C", () => {
  expect(utils.RelativeHumidity(1718, 22)).toBeCloseTo(0.65);
});
