import { removeByValue } from '../utils/arrayUtils.js';
import { Event, EventType } from './event.js';

export class EventListener {
  active = true;

  constructor(
    readonly eventType: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly callback: (event: any) => void,
    readonly canCancel: boolean,
    readonly priority: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly filter?: (event: any) => boolean
  ) {}
}

export class EventManager {
  private readonly listeners: Record<string, EventListener[]>;

  constructor() {
    this.listeners = {};
  }

  on<T extends Event>(
    type: EventType<T>,
    callback: (event: T) => void,
    canCancel = true,
    priority = 0,
    filter?: (event: T) => boolean
  ): EventListener {
    const listener = new EventListener(type.name, callback, canCancel, priority, filter);

    if (!this.listeners[type.name]) {
      this.listeners[type.name] = [listener];
    } else {
      this.listeners[type.name].push(listener);
    }

    this.listeners[type.name].sort((a, b) => {
      if (a.priority < b.priority) {
        return 1;
      } else if (a.priority > b.priority) {
        return -1;
      }
      return 0;
    });

    return listener;
  }

  off(listener: EventListener): void {
    const list = this.listeners[listener.eventType];
    if (list) {
      removeByValue(list, listener);
    }
  }

  has<T extends Event>(type: EventType<T>, listener?: EventListener): boolean {
    if (listener) {
      const list = this.listeners[type.name];
      if (list) {
        return list.includes(listener);
      }

      return false;
    } else {
      return this.listeners[type.name] !== undefined;
    }
  }

  send(event: Event): void {
    const list = this.listeners[event.name];
    if (list) {
      this.processEvent(event, list);
    }
    event.put();
  }

  private processEvent(event: Event, listeners: EventListener[]): void {
    for (const listener of listeners) {
      if (listener.active) {
        if (!listener.filter || listener.filter(event)) {
          listener.callback(event);
        }
      }

      if (event.canceled) {
        if (listener.canCancel) {
          break;
        } else {
          event.canceled = false;
        }
      }
    }
  }
}
