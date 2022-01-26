import * as SocketIO from 'socket.io';

export enum TypePeer {
  OPERATOR = 'operador',
  TELEPRESENCA = 'telepresenca',
}
export class Peer {
  private id: string;
  private socket!: SocketIO.Socket;
  private type: TypePeer;
  private canditate: [] any;
  constructor(id: string, type: TypePeer) {
    this.id = id;
    this.type = type;
  }

  public getByType(t: string): Peer | undefined {
    if (t !== this.type) {
      return undefined;
    }
    return this;
  }

  public setSocket(socket: SocketIO.Socket): void {
    this.socket = socket;
  }

  public getSocket(): SocketIO.Socket {
    return this.socket;
  }

  public getId(): string {
    return this.id;
  }

  public canditate():[] any {
    return this.
  }
}
