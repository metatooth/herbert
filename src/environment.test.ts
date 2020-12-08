import { Environment } from './environment';

test('target humidity', () => {
    const e0 = new Environment(22.0, 0.6, 0.7, 1);
    expect(e0.vpd).toBeCloseTo(698, 0);

    const e1 = new Environment(21.2, 0.6, 0.765, 1);
    expect(e1.vpd).toBeCloseTo(500, 0);
});

test('humidity is low', () => {
    const environ = new Environment(22, 1, 0.65, 1);
    const systems = environ.check(22, 1, 0.4);
    expect(systems.get('heat')).toBe(false);
    expect(systems.get('cool')).toBe(false);
    expect(systems.get('humidify')).toBe(true);
    expect(systems.get('dehumidify')).toBe(false);
});

test('15.6 C is a hard limit', () => {
    const environ = new Environment(22, 1, 0.48, 1);
    const systems = environ.check(15.5, 1, 0.2);

    expect(environ.vpd).toBeCloseTo(1218, 0);
    expect(systems.get('heat')).toBe(true);
    expect(systems.get('cool')).toBe(false);
    expect(systems.get('humidify')).toBe(true);
    expect(systems.get('dehumidify')).toBe(false);
});

test('heat if below set temp', () => {
    const environ = new Environment(21, 0.6, 0.55, 1);

    const s0 = environ.check(20.1, 0.6, 0.55);
    expect(s0.get('heat')).toBe(true);
    expect(s0.get('cool')).toBe(false);
    expect(s0.get('humidify')).toBe(false);
    expect(s0.get('dehumidify')).toBe(false);

    const s1 = environ.check(20.0, 0.6, 0.55);
    expect(s1.get('heat')).toBe(true);
    expect(s1.get('cool')).toBe(false);
    expect(s1.get('humidify')).toBe(false);
    expect(s1.get('dehumidify')).toBe(false);

    const s2 = environ.check(19.0, 0.6, 0.55);
    expect(s2.get('heat')).toBe(true);
    expect(s2.get('cool')).toBe(false);
    expect(s2.get('humidify')).toBe(false);
    expect(s2.get('dehumidify')).toBe(false);

    const s3 = environ.check(18.0, 0.6, 0.6);
    expect(s3.get('heat')).toBe(true);
    expect(s3.get('cool')).toBe(false);
    expect(s3.get('humidify')).toBe(false);
    expect(s3.get('dehumidify')).toBe(true);

    const s4 = environ.check(20.8, 1, 0.65);
    expect(s4.get('heat')).toBe(true);
    expect(s4.get('cool')).toBe(false);
    expect(s4.get('humidify')).toBe(false);
    expect(s4.get('dehumidify')).toBe(true);

    const s5 = environ.check(20.5, 0.6, 0.55);
    expect(s5.get('heat')).toBe(true);
    expect(s5.get('cool')).toBe(false);
    expect(s5.get('humidify')).toBe(false);
    expect(s5.get('dehumidify')).toBe(false);
});
