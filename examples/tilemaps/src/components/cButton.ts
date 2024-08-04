import { BaseComponentProps, Color, Component, Graphics, Renderable, Tileset } from '@jume-labs/jume-engine';

export interface CButtonProps extends BaseComponentProps {
  index: number;
  tileset: Tileset;
}

export class CButton extends Component implements Renderable {
  get width(): number {
    return this.tileset.tileWidth;
  }

  get height(): number {
    return this.tileset.tileHeight;
  }

  readonly index: number;

  readonly tileset: Tileset;

  private tint = new Color(1, 1, 1, 1);

  constructor(props: CButtonProps) {
    super(props);

    ({ index: this.index, tileset: this.tileset } = props);
  }

  cRender(graphics: Graphics): void {
    graphics.color.copyFrom(this.tint);
    const rect = this.tileset.getRect(this.index);
    graphics.drawImageSection(
      -this.width * 0.5,
      -this.height * 0.5,
      rect.x,
      rect.y,
      rect.width,
      rect.height,
      this.tileset.image
    );
  }
}
