import { format } from '../utils/format';

class Peer {
  subnet!: string;
  wireguard_public_key!: string;
  allowed_ips!: string[];
  endpoint!: string;

  challenge(): string {
    return format([
      this.wireguard_public_key,
      this.endpoint,
      this.subnet,
      this.allowed_ips.toString(),
    ]);
  }
}

class Mycelium {
  hex_key!: string;
  peers?: string[];
}
class Znet {
  subnet!: string;
  ip_range!: string;
  wireguard_private_key?: string;
  wireguard_listen_port?: number;
  peers!: Peer[];
  mycelium?: Mycelium;

  challenge(): string {
    return format([
      this.ip_range,
      this.subnet,
      this.wireguard_private_key || '',
      this.wireguard_listen_port?.toString() || '',
      this.peers.map(p => p.challenge()).toString(),
      this.mycelium?.hex_key || '',
      this.mycelium?.peers?.toString() || '',
    ]);
  }
}

export { Znet };
