import {
  BaseSystemProps,
  Camera,
  CTilemap,
  CTransform,
  Entity,
  EventListener,
  EventManager,
  inject,
  MouseEvent,
  Rectangle,
  System,
  Vec2,
} from '@jume-labs/jume-engine';

import { CButton } from '../components/cButton';
import { CCursor } from '../components/cCursor';
import { CSelector } from '../components/cSelector';

const MIN_X = 20;
const MIN_Y = 20;

const GRID_WIDTH = 38;
const GRID_HEIGHT = 26;

const TILE_SIZE = 20;

export interface SLevelEditProps extends BaseSystemProps {
  camera: Camera;
}

export class SLevelEdit extends System {
  private cursorEntities: Entity[] = [];

  private tilemapEntities: Entity[] = [];

  private buttonEntities: Entity[] = [];

  private selectorEntities: Entity[] = [];

  private mouseDownListener: EventListener;
  private mouseMoveListener: EventListener;
  private mouseUpListener: EventListener;

  private camera: Camera;

  private tempPos = new Vec2();

  private tempBounds = new Rectangle();

  private leftButtonDown = false;

  private rightButtonDown = false;

  private tileIndex = 0;

  @inject
  private eventManager!: EventManager;

  constructor(props: SLevelEditProps) {
    super(props);
    this.camera = props.camera;

    this.registerList({ entities: this.cursorEntities, components: [CCursor, CTransform] });
    this.registerList({ entities: this.tilemapEntities, components: [CTilemap] });
    this.registerList({ entities: this.buttonEntities, components: [CButton] });
    this.registerList({ entities: this.selectorEntities, components: [CSelector, CTransform] });

    this.mouseDownListener = this.eventManager.add(MouseEvent.MOUSE_DOWN, this.mouseDown);
    this.mouseMoveListener = this.eventManager.add(MouseEvent.MOUSE_MOVE, this.mouseMove);
    this.mouseUpListener = this.eventManager.add(MouseEvent.MOUSE_UP, this.mouseUp);
  }

  override destroy(): void {
    this.eventManager.remove(this.mouseDownListener);
    this.eventManager.remove(this.mouseMoveListener);
    this.eventManager.remove(this.mouseUpListener);
  }

  private mouseDown = (event: MouseEvent): void => {
    if (this.tilemapEntities.length === 0) {
      return;
    }

    this.camera.screenToWorld(event.x, event.y, this.tempPos);
    this.worldToGrid(this.tempPos.x, this.tempPos.y, this.tempPos);

    // Tile a tile in the level.
    if (this.inBounds(this.tempPos.x, this.tempPos.y)) {
      let index = this.tileIndex;
      if (event.button === 0) {
        this.leftButtonDown = true;
      } else if (event.button === 2) {
        this.rightButtonDown = true;
        index = -1;
      }
      this.tilemapEntities[0].getComponent(CTilemap).setTile(this.tempPos.x, this.tempPos.y, index);
    } else {
      // Check if one of the bottom buttons was clicked.
      for (const entity of this.buttonEntities) {
        const transform = entity.getComponent(CTransform);
        const button = entity.getComponent(CButton);

        this.tempBounds.set(
          transform.position.x - button.width * 0.5,
          transform.position.y - button.height * 0.5,
          button.width,
          button.height
        );

        this.camera.screenToWorld(event.x, event.y, this.tempPos);
        if (this.tempBounds.hasPoint(this.tempPos.x, this.tempPos.y)) {
          this.tileIndex = button.index;
          this.selectorEntities[0].getComponent(CTransform).position.copyFrom(transform.position);
        }
      }
    }
  };

  private mouseMove = (event: MouseEvent): void => {
    if (this.cursorEntities.length === 0) {
      return;
    }

    this.camera.screenToWorld(event.x, event.y, this.tempPos);
    this.worldToGrid(this.tempPos.x, this.tempPos.y, this.tempPos);

    if (this.inBounds(this.tempPos.x, this.tempPos.y)) {
      // Set a tile in the level.
      if (this.leftButtonDown) {
        this.tilemapEntities[0].getComponent(CTilemap).setTile(this.tempPos.x, this.tempPos.y, this.tileIndex);
      } else if (this.rightButtonDown) {
        this.tilemapEntities[0].getComponent(CTilemap).setTile(this.tempPos.x, this.tempPos.y, -1);
      }

      this.gridToWorld(this.tempPos.x, this.tempPos.y, this.tempPos);

      // Update the cursor.
      const entity = this.cursorEntities[0];
      entity.active = true;
      entity.getComponent(CTransform).position.copyFrom(this.tempPos);
    } else {
      this.cursorEntities[0].active = false;
    }
  };

  private mouseUp = (event: MouseEvent): void => {
    if (event.button === 0) {
      this.leftButtonDown = false;
    } else if (event.button === 2) {
      this.rightButtonDown = false;
    }
  };

  private worldToGrid(x: number, y: number, out: Vec2): void {
    out.set(Math.floor((x - MIN_X) / TILE_SIZE), Math.floor((y - MIN_Y) / TILE_SIZE));
  }

  private gridToWorld(x: number, y: number, out: Vec2): void {
    out.set(MIN_X + x * TILE_SIZE + TILE_SIZE * 0.5, MIN_Y + y * TILE_SIZE + TILE_SIZE * 0.5);
  }

  private inBounds(x: number, y: number): boolean {
    return x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT;
  }
}
