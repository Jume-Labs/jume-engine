import { Event, EventType } from '../event';

export class ApplicationEvent extends Event {
  static readonly BACKGROUND = new EventType(ApplicationEvent, 'jume_background_event');

  static readonly FOREGROUND = new EventType(ApplicationEvent, 'jume_foreground_event');

  static readonly RESIZE = new EventType(ApplicationEvent, 'jume_resize_event');

  width = 0;

  height = 0;

  private static readonly POOL: ApplicationEvent[] = [];

  static get(type: EventType<ApplicationEvent>, width = 0, height = 0): ApplicationEvent {
    const event = ApplicationEvent.POOL.length > 0 ? ApplicationEvent.POOL.pop()! : new ApplicationEvent();
    event._name = type.name;
    event.width = width;
    event.height = height;

    return event;
  }

  put(): void {
    super.put();
    ApplicationEvent.POOL.push(this);
  }
}
