import { Clime } from "./clime";

test("has a temperature and relative humidity", async () => {
  const clime = new Clime(23.9, 0.6, 0.55);

  expect(clime.temperature).toBeCloseTo(23.9, 1);
  expect(clime.humidity).toBeCloseTo(0.55, 2);
});

test("calcuates the saturation vapor pressure", async () => {
  const clime = new Clime(23.9, 0.6, 0.55);

  expect(clime.svp()).toBeCloseTo(2965, 0);
});

test("calcuates the vapor pressure deficit", async () => {
  const clime = new Clime(23.9, 0.6, 0.55);

  expect(clime.vpd()).toBeCloseTo(1229, 0);
});
