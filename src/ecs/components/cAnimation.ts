import { Animation } from '../../graphics/animation.js';
import { Atlas } from '../../graphics/atlas.js';
import { BaseComponentProps, Component, Updatable } from '../component.js';
import { CSprite } from './cSprite.js';

export interface CAnimationProps extends BaseComponentProps {
  animations?: Animation[];
}

export class CAnimation extends Component implements Updatable {
  get isPlaying(): boolean {
    return this._isPlaying;
  }

  get currentFrameName(): string {
    return this._currentFrameName;
  }

  get currentAnim(): string {
    return this.anim ? this.anim.id : '';
  }

  get atlas(): Atlas | undefined {
    return this.anim ? this.anim.atlas : undefined;
  }

  get isFinished(): boolean {
    return this.anim ? this.anim.finished(this.time) : true;
  }

  private anim?: Animation;

  private time = 0;

  private animations: Record<string, Animation> = {};

  private _isPlaying = false;

  private _currentFrameName = '';

  private sprite: CSprite;

  constructor(props: CAnimationProps) {
    super(props);
    this.sprite = this.getComponent(CSprite);

    if (props.animations) {
      for (const anim of props.animations) {
        this.animations[anim.id] = anim;
      }
    }
  }

  cUpdate(dt: number): void {
    if (this._isPlaying && this.anim && !this.isFinished) {
      this.time += dt;
      this._currentFrameName = this.anim.getFrameName(this.time);
      this.sprite.setFrame(this._currentFrameName, this.anim.atlas);
    }
  }

  play(id?: string): void {
    this.time = 0;
    if (id) {
      if (this.animations[id] && this.currentAnim !== id) {
        this.anim = this.animations[id];
      }
    }
    this._isPlaying = true;
  }

  stop(): void {
    this._isPlaying = false;
  }

  resume(): void {
    this._isPlaying = true;
  }

  add(animation: Animation): void {
    this.animations[animation.id] = animation;
  }

  remove(id: string): void {
    delete this.animations[id];
  }

  getById(id: string): Animation | undefined {
    return this.animations[id];
  }
}
