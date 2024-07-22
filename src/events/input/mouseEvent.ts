import { Event, EventType } from '../event.js';

type MouseEventType = 'down' | 'up' | 'move' | 'wheel' | 'enter' | 'leave';

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

  private static readonly POOL: MouseEvent[] = [];

  private static readonly TYPE_MAP: Record<MouseEventType, EventType<MouseEvent>> = {
    down: MouseEvent.MOUSE_DOWN,
    up: MouseEvent.MOUSE_UP,
    move: MouseEvent.MOUSE_MOVE,
    wheel: MouseEvent.MOUSE_WHEEL,
    enter: MouseEvent.MOUSE_ENTER,
    leave: MouseEvent.MOUSE_LEAVE,
  };

  static get(type: MouseEventType, button = -1, x = 0, y = 0, deltaX = 0, deltaY = 0): MouseEvent {
    const event = MouseEvent.POOL.length > 0 ? MouseEvent.POOL.pop()! : new MouseEvent();
    event._name = MouseEvent.TYPE_MAP[type].name;
    event.button = button;
    event.x = x;
    event.y = y;
    event.deltaX = deltaX;
    event.deltaY = deltaY;

    return event;
  }

  override put(): void {
    super.put();
    MouseEvent.POOL.push(this);
  }
}
