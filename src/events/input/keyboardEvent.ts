import { KeyCode } from 'src/input/keyCode';

import { Event, EventType } from '../event';

export class KeyboardEvent extends Event {
  static readonly KEY_UP = new EventType(KeyboardEvent, 'jume_key_up_event');

  static readonly KEY_DOWN = new EventType(KeyboardEvent, 'jume_key_down_event');

  static readonly KEY_PRESS = new EventType(KeyboardEvent, 'jume_key_press_event');

  keyCode: KeyCode = KeyCode.Unknown;

  code = '';

  key = '';

  text = '';

  private static readonly POOL: KeyboardEvent[] = [];

  static get(type: EventType<KeyboardEvent>, keyCode: KeyCode, code: string, key: string, text = ''): KeyboardEvent {
    const event = this.POOL.length > 0 ? this.POOL.pop()! : new KeyboardEvent();
    event._name = type.name;
    event.keyCode = keyCode;
    event.code = code;
    event.key = key;
    event.text = text;

    return event;
  }

  put(): void {
    super.put();
    KeyboardEvent.POOL.push(this);
  }
}
