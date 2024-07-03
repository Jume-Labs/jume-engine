import { InputActionType } from 'src/input/input';
import { KeyCode } from 'src/input/keyCode';

import { Event, EventType } from '../event';

export class ActionEvent extends Event {
  static readonly ACTION = new EventType(ActionEvent, 'jume_input_action_event');

  binding = '';

  actionType: InputActionType = 'none';

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

  static getKeyEvent(
    actionType: InputActionType,
    keyCode: KeyCode,
    code: string,
    key: string,
    text = '',
    pressed = false,
    released = false
  ): ActionEvent {
    const event = this.POOL.length > 0 ? this.POOL.pop()! : new ActionEvent();
    event.reset(actionType);
    event.keyCode = keyCode;
    event.code = code;
    event.key = key;
    event.text = text;
    event.pressed = pressed;
    event.released = released;

    return event;
  }

  static getMouseEvent(
    actionType: InputActionType,
    index = -1,
    x = 0,
    y = 0,
    deltaX = 0,
    deltaY = 0,
    pressed = false,
    released = false
  ): ActionEvent {
    const event = this.POOL.length > 0 ? this.POOL.pop()! : new ActionEvent();
    event.reset(actionType);
    event.index = index;
    event.x = x;
    event.y = y;
    event.deltaX = deltaX;
    event.deltaY = deltaY;
    event.pressed = pressed;
    event.released = released;

    return event;
  }

  static getTouchEvent(
    actionType: InputActionType,
    index: number,
    x: number,
    y: number,
    touchCount: number,
    pressed = false,
    released = false
  ): ActionEvent {
    const event = this.POOL.length > 0 ? this.POOL.pop()! : new ActionEvent();
    event.reset(actionType);
    event.index = index;
    event.x = x;
    event.y = y;
    event.touchCount = touchCount;
    event.pressed = pressed;
    event.released = released;

    return event;
  }

  static getGamepadEvent(actionType: InputActionType, index: number, id = -1, value = 0): ActionEvent {
    const event = this.POOL.length > 0 ? this.POOL.pop()! : new ActionEvent();
    event.reset(actionType);
    event.index = index;
    event.id = id;
    event.value = value;

    return event;
  }

  put(): void {
    super.put();
    if (!ActionEvent.POOL.includes(this)) {
      ActionEvent.POOL.push(this);
    }
  }

  private reset(actionType: InputActionType): void {
    this.actionType = actionType;
    this._name = ActionEvent.ACTION.name;
    this.binding = '';
    this.keyCode = KeyCode.Unknown;
    this.code = '';
    this.key = '';
    this.text = '';
    this.index = -1;
    this.id = -1;
    this.pressed = false;
    this.released = false;
    this.value = -1;
    this.x = 0;
    this.y = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.touchCount = 0;
  }
}
