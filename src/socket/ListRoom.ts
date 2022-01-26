import Room from './Room';

class ListRoom {
  private rooms: Map<string, Room> = new Map();
  public getRoom(k: string): Room | undefined {
    return this.rooms.get(k);
  }

  public setRoom(r: Room): void {
    this.rooms.set(r.getId(), r);
  }
}

export default ListRoom;
