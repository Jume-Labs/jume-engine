import { KeyCode } from '../../input/keyCode.js';
import { Event, EventType } from '../event.js';

export type KeyboardEventType = 'up' | 'down' | 'press';

export class KeyboardEvent extends Event {
  static readonly KEY_UP = new EventType(KeyboardEvent, 'jume_key_up_event');

  static readonly KEY_DOWN = new EventType(KeyboardEvent, 'jume_key_down_event');

  static readonly KEY_PRESS = new EventType(KeyboardEvent, 'jume_key_press_event');

  keyCode: KeyCode = KeyCode.Unknown;

  code = '';

  key = '';

  text = '';

  private static readonly POOL: KeyboardEvent[] = [];

  private static readonly TYPE_MAP: Record<KeyboardEventType, EventType<KeyboardEvent>> = {
    down: KeyboardEvent.KEY_DOWN,
    up: KeyboardEvent.KEY_UP,
    press: KeyboardEvent.KEY_PRESS,
  };

  static get(type: KeyboardEventType, keyCode: KeyCode, code: string, key: string, text = ''): KeyboardEvent {
    const event = KeyboardEvent.POOL.length > 0 ? KeyboardEvent.POOL.pop()! : new KeyboardEvent();
    event._name = KeyboardEvent.TYPE_MAP[type].name;
    event.keyCode = keyCode;
    event.code = code;
    event.key = key;
    event.text = text;

    return event;
  }

  override put(): void {
    super.put();
    KeyboardEvent.POOL.push(this);
  }
}
