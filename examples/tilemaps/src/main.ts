import { Jume } from '@jume-labs/jume-engine';

import { LoadScene } from './scenes/loadScene';

new Jume({
  name: 'Tilemaps example',
  designWidth: 800,
  designHeight: 600,
}).launch(LoadScene);
