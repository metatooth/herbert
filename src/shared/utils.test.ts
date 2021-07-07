import * as utils from "./utils";

test("celsius2fahrenheit", () => {
  expect(utils.celsius2fahrenheit(0)).toBeCloseTo(32, 0);
  expect(utils.celsius2fahrenheit(100)).toBeCloseTo(212, 0);
});

test("fahrenheit2celsius", () => {
  expect(utils.fahrenheit2celsius(32)).toBeCloseTo(0, 0);
  expect(utils.fahrenheit2celsius(212)).toBeCloseTo(100, 0);
});

test("saturated vapor pressure", () => {
  expect(utils.saturatedVaporPressure(21.7)).toBeCloseTo(2595, 0);
  expect(utils.saturatedVaporPressure(1)).toBeCloseTo(657, 0);
  expect(utils.saturatedVaporPressure(5)).toBeCloseTo(872, 0);
  expect(utils.saturatedVaporPressure(10)).toBeCloseTo(1228, 0);
  expect(utils.saturatedVaporPressure(15)).toBeCloseTo(1705, 0);
  expect(utils.saturatedVaporPressure(20)).toBeCloseTo(2338, 0);
  expect(utils.saturatedVaporPressure(30)).toBeCloseTo(4242, 0);
  expect(utils.saturatedVaporPressure(40)).toBeCloseTo(7374, 0);
});

test("vapor pressure at 22 C and 65% relative humidity", () => {
  expect(utils.vaporPressureAir(22.0, 0.65)).toBeCloseTo(1718, 0);
});

test("vapor pressure deficit", () => {
  expect(utils.vaporPressureDeficit(21.0, 0.6, 0.65)).toBeCloseTo(780, 0);
  expect(utils.vaporPressureDeficit(25.3, 0.6, 0.55)).toBeCloseTo(1338, 0);
  expect(utils.vaporPressureDeficit(23.1, 0.0, 0.55)).toBeCloseTo(1272, 0);
});

test("relative humidity at 1718 pascals and 22 C", () => {
  expect(utils.relativeHumidity(1718, 22)).toBeCloseTo(0.65);
});
