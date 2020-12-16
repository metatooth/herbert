import { AirDirectives } from './air-directives';
import { ClimeControl } from './clime-control';

test('default is off', () => {
    const directive = new AirDirectives(new ClimeControl());
    directive.monitor();
    expect(directive.temperature).toBe('off');
    expect(directive.humidity).toBe('off');
});
