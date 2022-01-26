import { Peer, TypePeer } from './Peer';

class Room {
  private id: string;
  private name: string;
  private peers: Map<string, Peer>;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.peers = new Map<string, Peer>();
  }

  public getId(): string {
    return this.id;
  }

  public addPeer(p: Peer): void {
    this.peers.set(p.getId(), p);
  }

  public getPeer(k: string): Peer | undefined {
    return this.peers.get(k);
  }

  public setPeer(p: Peer): void {
    if (!this.peers.get(p.getId())) return;
    this.peers.set(p.getId(), p);
  }

  public getByType(t: string): Peer[] {
    let peers: Peer[] = [];

    this.peers.forEach((element) => {
      const peer = element.getByType(t);
      if (peer) {
        peers.push(peer);
      }
    });

    return peers;
  }

  public removePeer(k: string): boolean {
    const peer = this.peers.get(k);
    if (!peer) {
      return false;
    }
    this.peers.delete(k);
    return true;
  }

  public getName(): string {
    return this.name;
  }
}

export default Room;
