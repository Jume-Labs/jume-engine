export class EventType<T extends Event> {
  constructor(
    readonly type: new () => T,
    readonly name: string
  ) {}
}
export class Event {
  canceled = false;

  get name(): string {
    return this._name;
  }

  protected _name = '';

  put(): void {
    this.canceled = false;
  }
}
