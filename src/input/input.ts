import { Audio } from '../audio/audio.js';
import { inject } from '../di/inject.js';
import { Events } from '../events/events.js';
import { ActionEvent } from '../events/input/actionEvent.js';
import { GamepadEvent as JumeGamepadEvent } from '../events/input/gamepadEvent.js';
import { KeyboardEvent as JumeKeyboardEvent } from '../events/input/keyboardEvent.js';
import { MouseEvent as JumeMouseEvent } from '../events/input/mouseEvent.js';
import { TouchEvent as JumeTouchEvent } from '../events/input/touchEvent.js';
import { getKeyCodeFromString, KeyCode } from './keyCode.js';

export type InputActionType =
  | 'none'
  | 'keyboard key'
  | 'keyboard text'
  | 'mouse button'
  | 'mouse move'
  | 'mouse enter'
  | 'mouse leave'
  | 'mouse wheel'
  | 'touch'
  | 'touch move'
  | 'gamepad connected'
  | 'gamepad disconnected'
  | 'gamepad axis'
  | 'gamepad button';

export type GamepadState = {
  axes: Record<number, number>;
  buttons: Record<number, number>;
};

type InputActionBinding = {
  binding: string;

  keyboard: {
    keys: KeyCode[];
    text: boolean;
  };

  mouse: {
    mouseButton: number[];
    mouseMove: boolean;
    mouseWheel: boolean;
    mouseEnter: boolean;
    mouseLeave: boolean;
  };

  touch: {
    touch: boolean;
    touchMove: boolean;
  };

  gamepad: {
    connected: boolean;
    disconnected: boolean;
    gamepadAxis: number[];
    gamepadButton: number[];
  };
};

function createActionBinding(name: string): InputActionBinding {
  return {
    binding: name,
    keyboard: {
      keys: [],
      text: false,
    },
    mouse: {
      mouseButton: [],
      mouseMove: false,
      mouseWheel: false,
      mouseEnter: false,
      mouseLeave: false,
    },
    touch: {
      touch: false,
      touchMove: false,
    },
    gamepad: {
      connected: false,
      disconnected: false,
      gamepadAxis: [],
      gamepadButton: [],
    },
  };
}

export class Input {
  @inject
  private audio!: Audio;

  @inject
  private events!: Events;

  private readonly bindings: Record<string, InputActionBinding> = {};

  private readonly gamepadStates: Record<number, GamepadState> = {};

  private readonly canvas: HTMLCanvasElement;

  private isFirstAction = true;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.addListeners();
  }

  addBinding(name: string): InputActionBinding {
    const binding = createActionBinding(name);
    this.bindings[name] = binding;

    return binding;
  }

  removeBinding(name: string): void {
    delete this.bindings[name];
  }

  update(): void {
    const gamepads = navigator.getGamepads();
    for (const gamepad of gamepads) {
      if (!gamepad) {
        continue;
      }

      const state = this.gamepadStates[gamepad.index];
      if (!state) {
        continue;
      }

      for (let i = 0; i < gamepad.axes.length; i++) {
        const axis = gamepad.axes[i];
        if ((state.axes[i] && state.axes[i] !== axis) || !state.axes[i]) {
          state.axes[i] = axis;

          const action = ActionEvent.getGamepadEvent('gamepad axis', gamepad.index, i, axis);
          this.sendAction(action);

          const ev = JumeGamepadEvent.get('axis', gamepad.index, i, undefined, axis);
          this.events.send(ev);
        }
      }

      for (let i = 0; i < gamepad.buttons.length; i++) {
        const button = gamepad.buttons[i].value;
        if ((state.buttons[i] && state.buttons[i] !== button) || !state.buttons[i]) {
          state.buttons[i] = button;

          const action = ActionEvent.getGamepadEvent('gamepad button', gamepad.index, i, button);
          this.sendAction(action);

          const ev = JumeGamepadEvent.get('button', gamepad.index, i, button);
          this.events.send(ev);
        }
      }
    }
  }

  destroy(): void {
    this.removeListeners();
  }

  private sendAction(action: ActionEvent): void {
    if (this.isFirstAction && action.pressed) {
      this.isFirstAction = false;
      this.audio.context.resume().catch((reason) => {
        console.log('Unable to resume the audio');
        console.log(reason);
      });
    }

    for (const key in this.bindings) {
      const binding = this.bindings[key];
      action.binding = key;

      switch (action.actionType) {
        case 'keyboard key':
          if (action.keyCode !== KeyCode.Unknown && binding.keyboard.keys.includes(action.keyCode)) {
            this.events.send(action);
          }
          break;

        case 'keyboard text':
          if (binding.keyboard.text) {
            this.events.send(action);
          }
          break;

        case 'mouse button':
          if (action.id !== -1 && binding.mouse.mouseButton.includes(action.id)) {
            this.events.send(action);
          }
          break;

        case 'mouse move':
          if (binding.mouse.mouseMove) {
            this.events.send(action);
          }
          break;

        case 'mouse wheel':
          if (binding.mouse.mouseWheel) {
            this.events.send(action);
          }
          break;

        case 'mouse enter':
          if (binding.mouse.mouseEnter) {
            this.events.send(action);
          }
          break;

        case 'mouse leave':
          if (binding.mouse.mouseLeave) {
            this.events.send(action);
          }
          break;

        case 'touch':
          if (binding.touch.touch) {
            this.events.send(action);
          }
          break;

        case 'touch move':
          if (binding.touch.touchMove) {
            this.events.send(action);
          }
          break;

        case 'gamepad connected':
          if (binding.gamepad.connected) {
            this.events.send(action);
          }
          break;

        case 'gamepad disconnected':
          if (binding.gamepad.disconnected) {
            this.events.send(action);
          }
          break;

        case 'gamepad axis':
          if (action.id !== -1 && binding.gamepad.gamepadAxis.includes(action.id)) {
            this.events.send(action);
          }
          break;

        case 'gamepad button':
          if (action.id !== -1 && binding.gamepad.gamepadButton.includes(action.id)) {
            this.events.send(action);
          }
          break;
      }
    }

    action.put();
  }

  private addListeners(): void {
    this.canvas.addEventListener('keydown', this.onKeyDown);
    this.canvas.addEventListener('keyup', this.onKeyUp);
    this.canvas.addEventListener('keypress', this.onKeyPress);

    this.canvas.addEventListener('mousedown', this.onMouseDown);
    this.canvas.addEventListener('mouseup', this.onMouseUp);
    this.canvas.addEventListener('mousemove', this.onMouseMove);
    this.canvas.addEventListener('wheel', this.onMouseWheel);
    this.canvas.addEventListener('mouseenter', this.onMouseEnter);
    this.canvas.addEventListener('mouseleave', this.onMouseLeave);
    this.canvas.addEventListener('contextmenu', this.onMouseContext);

    this.canvas.addEventListener('touchstart', this.onTouchDown);
    this.canvas.addEventListener('touchend', this.onTouchUp);
    this.canvas.addEventListener('touchmove', this.onTouchMove);
    this.canvas.addEventListener('touchcancel', this.onTouchCancel);

    window.addEventListener('gamepadconnected', this.onGamepadConnected);
    window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected);
  }

  private removeListeners(): void {
    this.canvas.removeEventListener('keydown', this.onKeyDown);
    this.canvas.removeEventListener('keyup', this.onKeyUp);
    this.canvas.removeEventListener('keypress', this.onKeyPress);

    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    this.canvas.removeEventListener('mouseup', this.onMouseUp);
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('wheel', this.onMouseWheel);
    this.canvas.removeEventListener('mouseenter', this.onMouseEnter);
    this.canvas.removeEventListener('mouseleave', this.onMouseLeave);
    this.canvas.removeEventListener('contextmenu', this.onMouseContext);

    this.canvas.removeEventListener('touchstart', this.onTouchDown);
    this.canvas.removeEventListener('touchend', this.onTouchUp);
    this.canvas.removeEventListener('touchmove', this.onTouchMove);
    this.canvas.removeEventListener('touchcancel', this.onTouchCancel);

    window.removeEventListener('gamepadconnected', this.onGamepadConnected);
    window.removeEventListener('gamepaddisconnected', this.onGamepadDisconnected);
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    const keyCode = getKeyCodeFromString(event.code);
    const action = ActionEvent.getKeyEvent('keyboard key', keyCode, event.code, event.key, '', true);
    this.sendAction(action);

    const ev = JumeKeyboardEvent.get('down', keyCode, event.code, event.key);
    this.events.send(ev);
  };

  private onKeyUp = (event: KeyboardEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    const keyCode = getKeyCodeFromString(event.code);
    const action = ActionEvent.getKeyEvent('keyboard key', keyCode, event.code, event.key, '', false, false);
    this.sendAction(action);

    const ev = JumeKeyboardEvent.get('up', keyCode, event.code, event.key);
    this.events.send(ev);
  };

  private onKeyPress = (event: KeyboardEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    const keyCode = getKeyCodeFromString(event.code);
    const action = ActionEvent.getKeyEvent('keyboard text', keyCode, event.code, event.key, event.key);
    this.sendAction(action);

    const ev = JumeKeyboardEvent.get('press', keyCode, event.code, event.key, event.key);
    this.events.send(ev);
  };

  private onMouseDown = (event: MouseEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.x - rect.left;
    const y = event.y - rect.top;

    const action = ActionEvent.getMouseEvent('mouse button', event.button, x, y, undefined, undefined, true);
    this.sendAction(action);

    const ev = JumeMouseEvent.get('down', event.button, x, y);
    this.events.send(ev);
  };

  private onMouseUp = (event: MouseEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.x - rect.left;
    const y = event.y - rect.top;

    const action = ActionEvent.getMouseEvent(
      'mouse button',
      event.button,
      x,
      y,
      undefined,
      undefined,
      undefined,
      false
    );
    this.sendAction(action);

    const ev = JumeMouseEvent.get('up', event.button, x, y);
    this.events.send(ev);
  };

  private onMouseMove = (event: MouseEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.x - rect.left;
    const y = event.y - rect.top;

    const action = ActionEvent.getMouseEvent('mouse move', undefined, x, y, event.movementX, event.movementY);
    this.sendAction(action);

    const ev = JumeMouseEvent.get('move', undefined, x, y, event.movementX, event.movementY);
    this.events.send(ev);
  };

  private onMouseWheel = (event: WheelEvent): void => {
    const action = ActionEvent.getMouseEvent(
      'mouse wheel',
      undefined,
      undefined,
      undefined,
      event.deltaX,
      event.deltaY
    );
    this.sendAction(action);

    const ev = JumeMouseEvent.get('wheel', undefined, undefined, undefined, event.deltaX, event.deltaY);
    this.events.send(ev);
  };

  private onMouseEnter = (): void => {
    const action = ActionEvent.getMouseEvent('mouse enter');
    this.sendAction(action);

    const ev = JumeMouseEvent.get('enter');
    this.events.send(ev);
  };

  private onMouseLeave = (): void => {
    const action = ActionEvent.getMouseEvent('mouse leave');
    this.sendAction(action);

    const ev = JumeMouseEvent.get('leave');
    this.events.send(ev);
  };

  private onMouseContext = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopImmediatePropagation();
  };

  private onTouchDown = (event: TouchEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    let evX = -1;
    let evY = -1;
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches.item(i);
      if (touch) {
        if (evX === -1) {
          evX = touch.clientX;
          evY = touch.clientY;
        }

        const action = ActionEvent.getTouchEvent(
          'touch',
          touch.identifier,
          touch.clientX,
          touch.clientY,
          event.touches.length,
          true
        );
        this.sendAction(action);

        const ev = JumeTouchEvent.get('start', touch.identifier, touch.clientX, touch.clientY, event.touches.length);
        this.events.send(ev);
      }
    }

    const action = ActionEvent.getMouseEvent('mouse button', 0, evX, evY, undefined, undefined, true);
    this.sendAction(action);

    const ev = JumeMouseEvent.get('down', 0, evX, evY);
    this.events.send(ev);
  };

  private onTouchUp = (event: TouchEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    let evX = -1;
    let evY = -1;
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches.item(i);
      if (touch) {
        if (evX === -1) {
          evX = touch.clientX;
          evY = touch.clientY;
        }

        const action = ActionEvent.getTouchEvent(
          'touch',
          touch.identifier,
          touch.clientX,
          touch.clientY,
          event.touches.length,
          undefined,
          true
        );
        this.sendAction(action);

        const ev = JumeTouchEvent.get('end', touch.identifier, touch.clientX, touch.clientY, event.touches.length);
        this.events.send(ev);
      }
    }

    const action = ActionEvent.getMouseEvent('mouse button', 0, evX, evY, undefined, undefined, undefined, true);
    this.sendAction(action);

    const ev = JumeMouseEvent.get('up', 0, evX, evY);
    this.events.send(ev);
  };

  private onTouchMove = (event: TouchEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    let evX = -1;
    let evY = -1;
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches.item(i);
      if (touch) {
        if (evX === -1) {
          evX = touch.clientX;
          evY = touch.clientY;
        }

        const action = ActionEvent.getTouchEvent(
          'touch move',
          touch.identifier,
          touch.clientX,
          touch.clientY,
          event.touches.length
        );
        this.sendAction(action);

        const ev = JumeTouchEvent.get('move', touch.identifier, touch.clientX, touch.clientY, event.touches.length);
        this.events.send(ev);
      }
    }

    const action = ActionEvent.getMouseEvent('mouse move', 0, evX, evY, undefined, undefined);
    this.sendAction(action);

    const ev = JumeMouseEvent.get('move', undefined, evX, evY);
    this.events.send(ev);
  };

  private onTouchCancel = (event: TouchEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    let evX = -1;
    let evY = -1;
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches.item(i);
      if (touch) {
        if (evX === -1) {
          evX = touch.clientX;
          evY = touch.clientY;
        }

        const action = ActionEvent.getTouchEvent(
          'touch',
          touch.identifier,
          touch.clientX,
          touch.clientY,
          event.touches.length,
          undefined,
          true
        );
        this.sendAction(action);

        const ev = JumeTouchEvent.get('end', touch.identifier, touch.clientX, touch.clientY, event.touches.length);
        this.events.send(ev);
      }
    }

    const action = ActionEvent.getMouseEvent('mouse button', 0, evX, evY, undefined, undefined, undefined, true);
    this.sendAction(action);

    const ev = JumeMouseEvent.get('up', 0, evX, evY);
    this.events.send(ev);
  };

  private onGamepadConnected = (event: GamepadEvent): void => {
    this.gamepadStates[event.gamepad.index] = {
      buttons: {},
      axes: {},
    };

    const action = ActionEvent.getGamepadEvent('gamepad connected', event.gamepad.index);
    this.sendAction(action);

    const ev = JumeGamepadEvent.get('connected', event.gamepad.index);
    this.events.send(ev);
  };

  private onGamepadDisconnected = (event: GamepadEvent): void => {
    delete this.gamepadStates[event.gamepad.index];

    const action = ActionEvent.getGamepadEvent('gamepad disconnected', event.gamepad.index);
    this.sendAction(action);

    const ev = JumeGamepadEvent.get('disconnected', event.gamepad.index);
    this.events.send(ev);
  };
}
