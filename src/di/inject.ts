import { getService } from './services';

/**
 * @inject decorator. Injects a service getter into a field.
 * @param _value
 * @param context
 * @returns The service getter.
 */
export function inject(_value: undefined, context: ClassMemberDecoratorContext) {
  const { kind, name } = context;

  if (kind === 'field') {
    return () => {
      return getService(name as string);
    };
  }

  return;
}

/**
 * @injectKey decorator.
 * @param name The name
 * @returns The service getter.
 */
export function injectWithName(name: string) {
  return (_value: undefined, context: ClassMemberDecoratorContext) => {
    const { kind } = context;

    if (kind === 'field') {
      return () => {
        return getService(name);
      };
    }

    return;
  };
}
