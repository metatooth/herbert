import { Environment } from './environment';

test('target humidity', () => {
  const e0 = new Environment(700, 22.0, 21.4);
  expect(e0.humidity).toBeCloseTo(0.699);

  const e1 = new Environment(500, 21.2, 20.6);
  expect(e1.humidity).toBeCloseTo(0.765);

});

test('humidity is low', () => {
  const environ = new Environment(1200, 22, 21);
  const systems = environ.check(22, 0.4, 1);
  expect(systems.get('heat')).toBe(false);
  expect(systems.get('cool')).toBe(false);
  expect(systems.get('humidify')).toBe(true);
  expect(systems.get('dehumidify')).toBe(false);
});

test('temperature is low', () => {
  const environ = new Environment(1200, 22, 21);
  const systems = environ.check(20, 0.48, 1);
  expect(systems.get('heat')).toBe(true);
  expect(systems.get('cool')).toBe(false);
  expect(systems.get('humidify')).toBe(false);
  expect(systems.get('dehumidify')).toBe(false);
});
