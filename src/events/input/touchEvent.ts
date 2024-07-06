import { Event, EventType } from '../event';

export class TouchEvent extends Event {
  static readonly TOUCH_START = new EventType(TouchEvent, 'jume_touch_start_event');

  static readonly TOUCH_END = new EventType(TouchEvent, 'jume_touch_end_event');

  static readonly TOUCH_MOVE = new EventType(TouchEvent, 'jume_touch_move_event');

  id = 0;

  x = 0;

  y = 0;

  touchCount = 0;

  static readonly POOL: TouchEvent[] = [];

  static get(type: EventType<TouchEvent>, id: number, x: number, y: number, touchCount: number): TouchEvent {
    const event = TouchEvent.POOL.length > 0 ? TouchEvent.POOL.pop()! : new TouchEvent();
    event._name = type.name;
    event.id = id;
    event.x = x;
    event.y = y;
    event.touchCount = touchCount;

    return event;
  }

  put(): void {
    super.put();
    TouchEvent.POOL.push(this);
  }
}
