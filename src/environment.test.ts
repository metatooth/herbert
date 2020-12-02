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

test('heat if below set temp', () => {
    const environ = new Environment(900, 21, 20);
    console.log(environ);
    const s0 = environ.check(20.1, 0.45, 0.6);
    console.log(s0);
    expect(s0.get('heat')).toBe(true);
    expect(s0.get('cool')).toBe(false);
    expect(s0.get('humidify')).toBe(true);
    expect(s0.get('dehumidify')).toBe(false);
    const s1 = environ.check(20.0, 0.45, 0.6);
    console.log(s1);
    expect(s1.get('heat')).toBe(true);
    expect(s1.get('cool')).toBe(false);
    expect(s1.get('humidify')).toBe(true);
    expect(s1.get('dehumidify')).toBe(false);
    const s2 = environ.check(19.0, 0.45, 0.6);
    console.log(s2);
    expect(s2.get('heat')).toBe(true);
    expect(s2.get('cool')).toBe(false);
    expect(s2.get('humidify')).toBe(true);
    expect(s2.get('dehumidify')).toBe(false);
    const s3 = environ.check(18.0, 0.60, 0.6);
    console.log(s3);
    expect(s3.get('heat')).toBe(true);
    expect(s3.get('cool')).toBe(false);
    expect(s3.get('humidify')).toBe(false);
    expect(s3.get('dehumidify')).toBe(true);

  const s4 = environ.check(20.8, 0.35, 1.0);
    console.log(s4);
  expect(s4.get('heat')).toBe(true);
  expect(s4.get('cool')).toBe(false);
  expect(s4.get('humidify')).toBe(true);
  expect(s4.get('dehumidify')).toBe(false);

});
