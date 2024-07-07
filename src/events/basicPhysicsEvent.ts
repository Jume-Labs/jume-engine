import { CBasicBody } from 'src/ecs/components/cBasicBody';

import { Event, EventType } from './event';

export class BasicPhysicsEvent extends Event {
  static readonly TRIGGER_START = new EventType(BasicPhysicsEvent, 'jume_basic_trigger_start');

  static readonly TRIGGER_STAY = new EventType(BasicPhysicsEvent, 'jume_basic_trigger_stay');

  static readonly TRIGGER_END = new EventType(BasicPhysicsEvent, 'jume_basic_trigger_end');

  static readonly COLLISION_START = new EventType(BasicPhysicsEvent, 'jume_basic_collision_start');
  static readonly COLLISION_STAY = new EventType(BasicPhysicsEvent, 'jume_basic_collision_stay');
  static readonly COLLISION_END = new EventType(BasicPhysicsEvent, 'jume_basic_collision_end');

  body1!: CBasicBody;

  body2!: CBasicBody;

  private static readonly POOL: BasicPhysicsEvent[] = [];

  static get(type: EventType<BasicPhysicsEvent>, body1: CBasicBody, body2: CBasicBody): BasicPhysicsEvent {
    const event = BasicPhysicsEvent.POOL.length > 0 ? BasicPhysicsEvent.POOL.pop()! : new BasicPhysicsEvent();
    event._name = type.name;
    event.body1 = body1;
    event.body2 = body2;

    return event;
  }

  override put(): void {
    super.put();
  }
}
