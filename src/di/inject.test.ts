import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { inject, injectWithName } from './inject';
import { addService, clearService } from './services';

describe('di/inject', () => {
  beforeAll(() => {
    addService('testService', new TestService());
  });

  afterAll(() => {
    clearService();
  });

  it('should inject a service into a field', () => {
    const testClass = new TestClass();

    expect(testClass.testService.testValue).toBe('this is a test');
  });

  it('should inject a service with a name', () => {
    const testClass = new TestClass();

    expect(testClass.testService.testValue).toBe('this is a test');
  });
});

class TestService {
  testValue: string;

  constructor() {
    this.testValue = 'this is a test';
  }
}

class TestClass {
  @inject
  testService!: TestService;

  @injectWithName('testService')
  test!: TestService;

  constructor() {}
}
