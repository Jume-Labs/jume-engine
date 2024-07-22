import { Event, EventType } from './event.js';

type ApplicationEventType = 'background' | 'foreground' | 'resize';

export class ApplicationEvent extends Event {
  static readonly BACKGROUND = new EventType(ApplicationEvent, 'jume_background_event');

  static readonly FOREGROUND = new EventType(ApplicationEvent, 'jume_foreground_event');

  static readonly RESIZE = new EventType(ApplicationEvent, 'jume_resize_event');

  width = 0;

  height = 0;

  private static readonly POOL: ApplicationEvent[] = [];

  private static readonly TYPE_MAP: Record<ApplicationEventType, EventType<ApplicationEvent>> = {
    background: ApplicationEvent.BACKGROUND,
    foreground: ApplicationEvent.FOREGROUND,
    resize: ApplicationEvent.RESIZE,
  };

  static get(type: ApplicationEventType, width = 0, height = 0): ApplicationEvent {
    const event = ApplicationEvent.POOL.length > 0 ? ApplicationEvent.POOL.pop()! : new ApplicationEvent();
    event._name = ApplicationEvent.TYPE_MAP[type].name;
    event.width = width;
    event.height = height;

    return event;
  }

  override put(): void {
    super.put();
    ApplicationEvent.POOL.push(this);
  }
}
