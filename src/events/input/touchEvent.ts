import { Event, EventType } from '../event.js';

type TouchEventType = 'start' | 'move' | 'end';

export class TouchEvent extends Event {
  static readonly TOUCH_START = new EventType(TouchEvent, 'jume_touch_start_event');

  static readonly TOUCH_END = new EventType(TouchEvent, 'jume_touch_end_event');

  static readonly TOUCH_MOVE = new EventType(TouchEvent, 'jume_touch_move_event');

  id = 0;

  x = 0;

  y = 0;

  touchCount = 0;

  private static readonly POOL: TouchEvent[] = [];

  private static readonly TYPE_MAP: Record<TouchEventType, EventType<TouchEvent>> = {
    start: TouchEvent.TOUCH_START,
    move: TouchEvent.TOUCH_MOVE,
    end: TouchEvent.TOUCH_END,
  };

  static get(type: TouchEventType, id: number, x: number, y: number, touchCount: number): TouchEvent {
    const event = TouchEvent.POOL.length > 0 ? TouchEvent.POOL.pop()! : new TouchEvent();
    event._name = TouchEvent.TYPE_MAP[type].name;
    event.id = id;
    event.x = x;
    event.y = y;
    event.touchCount = touchCount;

    return event;
  }

  override put(): void {
    super.put();
    TouchEvent.POOL.push(this);
  }
}
