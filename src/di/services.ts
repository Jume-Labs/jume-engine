/**
 * The container that holds all services.
 */
const CONTAINER: Record<string, any> = {};

/**
 * Get a service from the container.
 * @param name The name of the service.
 * @returns The service.
 */
export function getService(name: string) {
  const service = CONTAINER[name];

  if (!service) {
    throw new Error(`Error: Service "${name}" does not exist.`);
  }

  return service;
}

/**
 * Add a service to the container.
 * @param name The name of the service.
 * @param service The service to add.
 */
export function addService(name: string, service: any) {
  CONTAINER[name] = service;
}

/**
 * Remove a service by name.
 * @param name The service name.
 */
export function removeService(name: string) {
  CONTAINER[name] = undefined;
}

/**
 * Clear all added services.
 */
export function clearService() {
  for (const key in CONTAINER) {
    CONTAINER[key] = undefined;
  }
}
