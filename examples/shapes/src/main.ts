import { Jume } from '@jume-labs/jume-engine';

import { ShapesScene } from './scenes/shapesScene';

new Jume({
  name: 'Shapes Example',
  designWidth: 800,
  designHeight: 600,
}).launch(ShapesScene);
