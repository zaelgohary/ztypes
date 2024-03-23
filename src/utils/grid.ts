import {GridClient, NetworkEnv} from '@threefold/grid_client';
import * as config from '../config.json';

const grid = new GridClient({
  mnemonic: config.mnemonic,
  network: config.network as NetworkEnv,
});

export {grid};
