import { Color } from '../../graphics/color.js';
import { Graphics } from '../../graphics/graphics.js';
import { Tileset } from '../../tilemap/tileset.js';
import { BaseComponentProps, Component, Renderable } from '../component.js';

export interface CTilemapProps extends BaseComponentProps {
  grid: number[][];
  tileset: Tileset;
  tint?: Color;
}

export class CTilemap extends Component implements Renderable {
  grid: number[][];

  tileset: Tileset;

  tint = new Color(1, 1, 1, 1);

  constructor(props: CTilemapProps) {
    super(props);

    const { grid, tileset, tint } = props;
    this.grid = grid;
    this.tileset = tileset;

    if (tint) {
      this.tint.copyFrom(tint);
    }
  }

  getTile(x: number, y: number): number {
    if (x < 0 || x >= this.grid[0].length || y < 0 || y >= this.grid.length) {
      console.error(`tile position x: ${x}, y: ${y} is out of bounds`);
      return -1;
    }

    return this.grid[y][x];
  }

  setTile(x: number, y: number, value: number): void {
    if (x < 0 || x >= this.grid[0].length || y < 0 || y >= this.grid.length) {
      console.error(`tile position x: ${x}, y: ${y} is out of bounds`);
      return;
    }

    this.grid[y][x] = value;
  }

  cRender(graphics: Graphics): void {
    graphics.color.copyFrom(this.tint);
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[0].length; x++) {
        const id = this.grid[y][x];
        if (id !== -1) {
          const rect = this.tileset.getRect(id);
          graphics.drawImageSection(
            x * this.tileset.tileWidth,
            y * this.tileset.tileHeight,
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            this.tileset.image
          );
        }
      }
    }
  }
}
