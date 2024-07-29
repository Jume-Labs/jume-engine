import { BitmapFont, CText, CTransform, Entity } from '@jume-labs/jume-engine';

export type ETextProps = {
  layer: number;
  x: number;
  y: number;
  font: BitmapFont;
  text: string;
  anchor: { x: number; y: number };
};

export class EText extends Entity {
  readonly transform: CTransform;

  readonly txt: CText;

  constructor(props: ETextProps) {
    super();

    const { layer, x, y, font, text, anchor } = props;

    this.layer = layer;
    this.transform = this.addComponent(CTransform, { x, y });
    this.txt = this.addComponent(CText, { font, text, anchor });
  }
}
