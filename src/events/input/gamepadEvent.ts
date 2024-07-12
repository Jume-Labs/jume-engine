import { Event, EventType } from '../event.js';

export class GamepadEvent extends Event {
  static readonly GAMEPAD_CONNECTED = new EventType(GamepadEvent, 'jume_gamepad_connected_event');

  static readonly GAMEPAD_DISCONNECTED = new EventType(GamepadEvent, 'jume_gamepad_disconnected_event');

  static readonly GAMEPAD_AXIS = new EventType(GamepadEvent, 'jume_gamepad_axis_event');

  static readonly GAMEPAD_BUTTON = new EventType(GamepadEvent, 'jume_gamepad_button_event');

  id = -1;

  axis = -1;

  button = -1;

  value = 0;

  private static readonly POOL: GamepadEvent[] = [];

  static get(type: EventType<GamepadEvent>, id: number, axis = -1, button = -1, value = 0): GamepadEvent {
    const event = GamepadEvent.POOL.length > 0 ? GamepadEvent.POOL.pop()! : new GamepadEvent();
    event._name = type.name;
    event.id = id;
    event.axis = axis;
    event.button = button;
    event.value = value;

    return event;
  }

  override put(): void {
    super.put();
    GamepadEvent.POOL.push(this);
  }
}
