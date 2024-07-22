import { Event, EventType } from '../event.js';

type GamepadEventType = 'connected' | 'disconnected' | 'axis' | 'button';

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

  private static readonly TYPE_MAP: Record<GamepadEventType, EventType<GamepadEvent>> = {
    connected: GamepadEvent.GAMEPAD_CONNECTED,
    disconnected: GamepadEvent.GAMEPAD_DISCONNECTED,
    axis: GamepadEvent.GAMEPAD_AXIS,
    button: GamepadEvent.GAMEPAD_BUTTON,
  };

  static get(type: GamepadEventType, id: number, axis = -1, button = -1, value = 0): GamepadEvent {
    const event = GamepadEvent.POOL.length > 0 ? GamepadEvent.POOL.pop()! : new GamepadEvent();
    event._name = GamepadEvent.TYPE_MAP[type].name;
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
