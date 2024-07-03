import { Event, EventType } from '../event';

export class MouseEvent extends Event {
  static readonly MOUSE_DOWN = new EventType(MouseEvent, 'jume_mouse_down_event');

  static readonly MOUSE_UP = new EventType(MouseEvent, 'jume_mouse_up_event');

  static readonly MOUSE_MOVE = new EventType(MouseEvent, 'jume_mouse_move_event');

  static readonly MOUSE_WHEEL = new EventType(MouseEvent, 'jume_mouse_wheel_event');

  static readonly MOUSE_ENTER = new EventType(MouseEvent, 'jume_mouse_enter_event');

  static readonly MOUSE_LEAVE = new EventType(MouseEvent, 'jume_mouse_leave_event');

  button = -1;

  x = 0;

  y = 0;

  deltaX = 0;

  deltaY = 0;

  private static POOL: MouseEvent[] = [];

  static get(type: EventType<MouseEvent>, button = -1, x = 0, y = 0, deltaX = 0, deltaY = 0): MouseEvent {
    const event = this.POOL.length > 0 ? this.POOL.pop()! : new MouseEvent();
    event._name = type.name;
    event.button = button;
    event.x = x;
    event.y = y;
    event.deltaX = deltaX;
    event.deltaY = deltaY;

    return event;
  }

  put(): void {
    super.put();
    MouseEvent.POOL.push(this);
  }
}
