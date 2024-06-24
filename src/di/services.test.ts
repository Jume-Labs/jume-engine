import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { addService, clearService, getService, removeService } from './services';

describe('di/services', () => {
  beforeAll(() => {
    clearService();
  });

  afterEach(() => {
    clearService();
  });

  it('should get a service', () => {
    const testService = new TestService();
    addService('test', testService);
    const actual = getService('test');

    expect(actual).toBe(testService);
    expect(() => getService('test2')).toThrowError('Error: Service "test2" does not exist.');
  });

  it('Should remove a service', () => {
    const testService = new TestService();
    addService('test', testService);

    expect(getService('test')).not.toBeUndefined();

    removeService('test');

    expect(() => getService('test')).toThrowError('Error: Service "test" does not exist.');
  });
});

class TestService {
  readonly test = 'some test';

  constructor() {}
}
