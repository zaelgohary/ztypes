import {challenge} from '../utils/challenge';

class ComputeCapacity {
  cpu!: number;
  memory!: number;

  challenge(): string {
    return challenge([this.cpu.toString(), this.memory.toString()]);
  }
}
class ZNetworkInterface {
  network!: string;
  ip!: string;
}
class MyceliumIP {
  network!: string;
  hex_seed!: string;
}

class ZmachineNetwork {
  public_ip!: string;
  interfaces!: ZNetworkInterface[];
  planetary!: boolean;
  mycelium?: MyceliumIP;

  challenge(): string {
    return challenge([
      this.public_ip,
      this.planetary.toString(),
      this.interfaces
        .map(obj => Object.values(obj))
        .flat()
        .join(''),
      this.mycelium?.network || '',
      this.mycelium?.hex_seed || '',
    ]);
  }
}
class Mount {
  name!: string;
  mountpoint!: string;

  challenge(): string {
    return challenge([this.name, this.mountpoint]);
  }
}
class Zmachine {
  flist!: string;
  network!: ZmachineNetwork;
  size!: number;
  compute_capacity!: ComputeCapacity;
  mounts!: Mount[];
  entrypoint!: string;
  env?: Record<string, unknown>;
  corex?: boolean;
  gpu?: string[];

  challenge(): string {
    return challenge([
      this.flist,
      this.network.challenge(),
      this.size?.toString(),
      this.compute_capacity.challenge(),
      this.mounts.map(m => m.challenge()).join(','),
      this.entrypoint,
      this.env
        ? Object.entries(this.env)
            .map(([key, value]) => `${key}=${value}`)
            .join('')
        : '',
      this.gpu?.toString() || '',
    ]);
  }
}

export {Zmachine, ZmachineNetwork, Mount, ComputeCapacity};
