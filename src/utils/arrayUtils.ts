export function removeByValue<T>(array: T[], value: T): boolean {
  const index = array.indexOf(value);
  if (index === -1) {
    return false;
  }

  array.splice(index, 1);

  return true;
}
