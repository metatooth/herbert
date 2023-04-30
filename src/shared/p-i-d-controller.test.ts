import { PIDController } from "./p-i-d-controller";

test("test constructor", () => {
  const cntrlr = new PIDController(28.9, 1, 1, 1, 1);
  expect(cntrlr).toBe(cntrlr);
  expect(cntrlr.setpoint).toBe(28.9);
  expect(cntrlr.a0).toBe(3);
  expect(cntrlr.a1).toBe(-3);
  expect(cntrlr.a2).toBe(1);
  expect(cntrlr.error0).toBe(0);
  expect(cntrlr.error1).toBe(0);
  expect(cntrlr.error2).toBe(0);
  expect(cntrlr.out).toBe(0);
});

test("test constant error", () => {
  const cntrlr = new PIDController(28.9, 1, 1, 1, 1);

  expect(cntrlr.output(29)).toBeCloseTo(-0.3);
  expect(cntrlr.output(29)).toBeCloseTo(-0.6);
  expect(cntrlr.output(29)).toBeCloseTo(-0.9);
});

test("test better and better", () => {
  const cntrlr = new PIDController(28.9, 1, 1, 0, 1);

  expect(cntrlr.output(29.1)).toBeCloseTo(-0.4);
  expect(cntrlr.output(29.0)).toBeCloseTo(-0.6);
  expect(cntrlr.output(28.9)).toBeCloseTo(-0.6);
  expect(cntrlr.output(28.9)).toBeCloseTo(-0.6);
  expect(cntrlr.output(28.9)).toBeCloseTo(-0.6);
  expect(cntrlr.output(28.9)).toBeCloseTo(-0.6);
  expect(cntrlr.output(28.9)).toBeCloseTo(-0.6);
  expect(cntrlr.output(28.9)).toBeCloseTo(-0.6);
  expect(cntrlr.output(28.9)).toBeCloseTo(-0.6);
  expect(cntrlr.output(28.9)).toBeCloseTo(-0.6);
  expect(cntrlr.output(28.9)).toBeCloseTo(-0.6);
  expect(cntrlr.output(28.9)).toBeCloseTo(-0.6);
  expect(cntrlr.output(28.9)).toBeCloseTo(-0.6);
  expect(cntrlr.output(28.9)).toBeCloseTo(-0.6);
  expect(cntrlr.output(28.9)).toBeCloseTo(-0.6);
});
