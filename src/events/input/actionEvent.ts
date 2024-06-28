import { KeyCode } from 'src/input/keyCode';

import { Event, EventType } from '../event';

export class ActionEvent extends Event {
  static readonly ACTION = new EventType(ActionEvent, 'jume_input_action_event');

  binding = '';

  keyCode = KeyCode.Unknown;
  code = '';
  key = '';
  text = '';

  index = -1;
  id = -1;

  pressed = false;
  released = false;

  value = 0;

  x = 0;
  y = 0;
  deltaX = 0;
  deltaY = 0;
  touchCount = 0;

  private static POOL: ActionEvent[] = [];

  static get(
    type: EventType<ActionEvent>,
    binding = '',
    keyCode = KeyCode.Unknown,
    code = '',
    key = '',
    text = '',
    index = -1,
    id = -1,
    pressed = false,
    released = false,
    value = 0,
    x = 0,
    y = 0,
    deltaX = 0,
    deltaY = 0,
    touchCount = 0
  ): ActionEvent {
    const event = this.POOL.length > 0 ? this.POOL.pop()! : new ActionEvent();
    event._name = type.name;
    event.binding = binding;
    event.keyCode = keyCode;
    event.code = code;
    event.key = key;
    event.text = text;
    event.index = index;
    event.id = id;
    event.pressed = pressed;
    event.released = released;
    event.value = value;
    event.x = x;
    event.y = y;
    event.deltaX = deltaX;
    event.deltaY = deltaY;
    event.touchCount = touchCount;

    return event;
  }

  put(): void {
    super.put();
    ActionEvent.POOL.push(this);
  }
}
