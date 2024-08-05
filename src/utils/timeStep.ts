export class TimeStep {
  timeScale = 1;

  get dt(): number {
    return this._dt;
  }

  get totalElapsed(): number {
    return this._totalElapsed;
  }

  get unscaledDt(): number {
    return this._unscaledDt;
  }

  get fps(): number {
    return this._fps;
  }

  private _dt = 0;

  private _totalElapsed = 0;

  private _unscaledDt = 0;

  private _fps = 0;

  private readonly deltas: number[];

  constructor() {
    this.deltas = [];
  }

  update(dt: number): void {
    this._unscaledDt = dt;
    this._totalElapsed += dt;
    this._dt = dt * this.timeScale;

    if (this.deltas.length > 600) {
      this.deltas.shift();
    }
    this.deltas.push(dt);

    const average = this.deltas.reduce((a, b) => a + b) / this.deltas.length;
    this._fps = Math.round(1 / average);
  }
}
