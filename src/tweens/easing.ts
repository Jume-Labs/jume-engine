/**
 * Easing function signature.
 */
export type Ease = (time: number, begin: number, change: number, duration: number) => number;

/**
 * All easing functions.
 */
/**
 * Two times PI.
 */
const PI_M2 = Math.PI * 2;

/**
 * Half PI.
 */
const PI_D2 = Math.PI / 2;

/**
 * Linear easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeLinear(time: number, begin: number, change: number, duration: number): number {
  return (change * time) / duration + begin;
}

/**
 * Sine in easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInSine(time: number, begin: number, change: number, duration: number): number {
  return -change * Math.cos((time / duration) * PI_D2) + change + begin;
}

/**
 * Sine out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeOutSine(time: number, begin: number, change: number, duration: number): number {
  return change * Math.sin((time / duration) * PI_D2) + begin;
}

/**
 * Sine in out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInOutSine(time: number, begin: number, change: number, duration: number): number {
  return (-change / 2) * (Math.cos((Math.PI * time) / duration) - 1) + begin;
}

/**
 * Quint in easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInQuint(time: number, begin: number, change: number, duration: number): number {
  return change * (time /= duration) * time * time * time * time + begin;
}

/**
 * Quint out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeOutQuint(time: number, begin: number, change: number, duration: number): number {
  return change * ((time = time / duration - 1) * time * time * time * time + 1) + begin;
}

/**
 * Quint in out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInOutQuint(time: number, begin: number, change: number, duration: number): number {
  if ((time /= duration / 2) < 1) {
    return (change / 2) * time * time * time * time * time + begin;
  }

  return (change / 2) * ((time -= 2) * time * time * time * time + 2) + begin;
}

/**
 * Quart in easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInQuart(time: number, begin: number, change: number, duration: number): number {
  return change * (time /= duration) * time * time * time + begin;
}

/**
 * Quart out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeOutQuart(time: number, begin: number, change: number, duration: number): number {
  return -change * ((time = time / duration - 1) * time * time * time - 1) + begin;
}

/**
 * Quart in out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInOutQuart(time: number, begin: number, change: number, duration: number): number {
  if ((time /= duration / 2) < 1) {
    return (change / 2) * time * time * time * time + begin;
  }

  return (-change / 2) * ((time -= 2) * time * time * time - 2) + begin;
}

/**
 * Quad in easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInQuad(time: number, begin: number, change: number, duration: number): number {
  return change * (time /= duration) * time + begin;
}

/**
 * Quad out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeOutQuad(time: number, begin: number, change: number, duration: number): number {
  return -change * (time /= duration) * (time - 2) + begin;
}

/**
 * Quad in out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInOutQuad(time: number, begin: number, change: number, duration: number): number {
  if ((time /= duration / 2) < 1) {
    return (change / 2) * time * time + begin;
  }

  return (-change / 2) * (--time * (time - 2) - 1) + begin;
}

/**
 * Expo in easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInExpo(time: number, begin: number, change: number, duration: number): number {
  return time === 0 ? begin : change * Math.pow(2, 10 * (time / duration - 1)) + begin;
}

/**
 * Expo out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeOutExpo(time: number, begin: number, change: number, duration: number): number {
  return time === duration ? begin + change : change * (-Math.pow(2, (-10 * time) / duration) + 1) + begin;
}

/**
 * Expo in out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInOutExpo(time: number, begin: number, change: number, duration: number): number {
  if (time === 0) {
    return begin;
  }
  if (time === duration) {
    return begin + change;
  }
  if ((time /= duration / 2) < 1) {
    return (change / 2) * Math.pow(2, 10 * (time - 1)) + begin;
  }

  return (change / 2) * (-Math.pow(2, -10 * --time) + 2) + begin;
}

/**
 * Elastic in easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInElastic(time: number, begin: number, change: number, duration: number): number {
  const p = duration * 0.3;
  const a = change;
  const s = p / 4.0;

  if (time === 0) {
    return begin;
  }
  if ((time /= duration) === 1) {
    return begin + change;
  }

  return -(a * Math.pow(2, 10 * (time -= 1)) * Math.sin(((time * duration - s) * PI_M2) / p)) + begin;
}

/**
 * Elastic out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeOutElastic(time: number, begin: number, change: number, duration: number): number {
  const p = duration * 0.3;
  const a = change;
  const s = p / 4.0;

  if (time === 0) {
    return begin;
  }
  if ((time /= duration) === 1) {
    return begin + change;
  }

  return a * Math.pow(2, -10 * time) * Math.sin(((time * duration - s) * PI_M2) / p) + change + begin;
}

/**
 * Elastic in out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInOutElastic(time: number, begin: number, change: number, duration: number): number {
  const p = duration * (0.3 * 1.5);
  const a = change;
  const s = p / 4.0;

  if (time === 0) {
    return begin;
  }
  if ((time /= duration / 2) === 2) {
    return begin + change;
  }

  if (time < 1) {
    return -0.5 * (a * Math.pow(2, 10 * (time -= 1)) * Math.sin(((time * duration - s) * PI_M2) / p)) + begin;
  }

  return a * Math.pow(2, -10 * (time -= 1)) * Math.sin(((time * duration - s) * PI_M2) / p) * 0.5 + change + begin;
}

/**
 * Circular in easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInCircular(time: number, begin: number, change: number, duration: number): number {
  return -change * (Math.sqrt(1 - (time /= duration) * time) - 1) + begin;
}

/**
 * Circular out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeOutCircular(time: number, begin: number, change: number, duration: number): number {
  return change * Math.sqrt(1 - (time = time / duration - 1) * time) + begin;
}

/**
 * Circular in out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInOutCircular(time: number, begin: number, change: number, duration: number): number {
  if ((time /= duration / 2) < 1) {
    return (-change / 2) * (Math.sqrt(1 - time * time) - 1) + begin;
  }

  return (change / 2) * (Math.sqrt(1 - (time -= 2) * time) + 1) + begin;
}

/**
 * Back in easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInBack(time: number, begin: number, change: number, duration: number): number {
  const s = 1.70158;

  return change * (time /= duration) * time * ((s + 1) * time - s) + begin;
}

/**
 * Back out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeOutBack(time: number, begin: number, change: number, duration: number): number {
  const s = 1.70158;

  return change * ((time = time / duration - 1) * time * ((s + 1) * time + s) + 1) + begin;
}

/**
 * Back in out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInOutBack(time: number, begin: number, change: number, duration: number): number {
  let s = 1.70158;

  if ((time /= duration / 2) < 1) {
    return (change / 2) * (time * time * (((s *= 1.525) + 1) * time - s)) + begin;
  }

  return (change / 2) * ((time -= 2) * time * (((s *= 1.525) + 1) * time + s) + 2) + begin;
}

/**
 * Bounce in easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInBounce(time: number, begin: number, change: number, duration: number): number {
  return change - easeOutBounce(duration - time, 0, change, duration) + begin;
}

/**
 * Bounce out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeOutBounce(time: number, begin: number, change: number, duration: number): number {
  if ((time /= duration) < 1 / 2.75) {
    return change * (7.5625 * time * time) + begin;
  } else if (time < 2 / 2.75) {
    return change * (7.5625 * (time -= 1.5 / 2.75) * time + 0.75) + begin;
  } else if (time < 2.5 / 2.75) {
    return change * (7.5625 * (time -= 2.25 / 2.75) * time + 0.9375) + begin;
  } else {
    return change * (7.5625 * (time -= 2.625 / 2.75) * time + 0.984375) + begin;
  }
}

/**
 * Bounce in out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInOutBounce(time: number, begin: number, change: number, duration: number): number {
  if (time < duration / 2) {
    return easeInBounce(time * 2, 0, change, duration) * 0.5 + begin;
  } else {
    return easeOutBounce(time * 2 - duration, 0, change, duration) * 0.5 + change * 0.5 + begin;
  }
}

/**
 * Cubic in easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInCubic(time: number, begin: number, change: number, duration: number): number {
  return change * (time /= duration) * time * time + begin;
}

/**
 * Cubic out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeOutCubic(time: number, begin: number, change: number, duration: number): number {
  return change * ((time = time / duration - 1) * time * time + 1) + begin;
}

/**
 * Cubic in out easing.
 * @param time The time since the tween started in seconds.
 * @param begin The start value of the property.
 * @param change The amount of change from start to end.
 * @param duration The total duration of the tween in seconds.
 * @returns The updated property value.
 */
export function easeInOutCubic(time: number, begin: number, change: number, duration: number): number {
  if ((time /= duration / 2) < 1) {
    return (change / 2) * time * time * time + begin;
  }

  return (change / 2) * ((time -= 2) * time * time + 2) + begin;
}
