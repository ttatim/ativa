import ListRoom from '../ListRoom';
import { Peer, TypePeer } from '../Peer';
import Room from '../Room';

describe('List Room test unit', () => {
  it('should create a new room', async () => {
    const room = new Room('room-1', 'room');
    room.addPeer(new Peer('operator-1', TypePeer.OPERATOR));
    room.addPeer(new Peer('telepresenca-1', TypePeer.TELEPRESENCA));

    const listRoom = new ListRoom();
    listRoom.setRoom(room);

    expect(listRoom).toEqual({
      rooms: {
        room: {
          id: 'room',
          name: 'room',
          peers: {
            'operator-1': {
              id: 'operator-1',
              type: 'operador',
            },
            'telepresenca-1': {
              id: 'telepresenca-1',
              type: 'telepresenca',
            },
          },
        },
      },
    });
  });

  it('should add new room', async () => {
    const room = new Room('room-1', 'room');
    room.addPeer(new Peer('operator-1', TypePeer.OPERATOR));
    room.addPeer(new Peer('telepresenca-1', TypePeer.TELEPRESENCA));

    const listRoom = new ListRoom();
    listRoom.setRoom(room);

    const room2 = new Room('room-2', 'room');
    room2.addPeer(new Peer('operator-2', TypePeer.OPERATOR));
    room2.addPeer(new Peer('telepresenca-2', TypePeer.TELEPRESENCA));

    listRoom.setRoom(room2);

    // expect(listRoom).toEqual({});
  });

  it('should set peer', async () => {
    const room = new Room('room-1', 'room');
    room.addPeer(new Peer('operator-1', TypePeer.OPERATOR));
    room.addPeer(new Peer('telepresenca-1', TypePeer.TELEPRESENCA));

    const listRoom = new ListRoom();
    listRoom.setRoom(room);
    listRoom
      .getRoom('room-1')
      ?.setPeer(new Peer('operator-1', TypePeer.TELEPRESENCA));

    // expect(listRoom).toBe({});
  });

  it('should add new Peer', () => {
    const room = new Room('room-1', 'room');
    room.addPeer(new Peer('operator-1', TypePeer.OPERATOR));
    room.addPeer(new Peer('telepresenca-1', TypePeer.TELEPRESENCA));

    const listRoom = new ListRoom();
    listRoom.setRoom(room);
    listRoom
      .getRoom('room-1')
      ?.addPeer(new Peer('operator-2', TypePeer.TELEPRESENCA));

    // expect(listRoom).toBe({});
  });

  it('should add new Peer by reference', () => {
    const room = new Room('room-1', 'room');
    room.addPeer(new Peer('operator-1', TypePeer.OPERATOR));
    room.addPeer(new Peer('telepresenca-1', TypePeer.TELEPRESENCA));

    const listRoom = new ListRoom();
    listRoom.setRoom(room);
    const setRoom = listRoom.getRoom('room-1');
    setRoom?.addPeer(new Peer('operator-2', TypePeer.OPERATOR));

    // expect(listRoom).toBe({});
  });
  it('should add new Peer after add list', () => {
    let room = new Room('room-1', 'room');
    room.addPeer(new Peer('operator-1', TypePeer.OPERATOR));
    room.addPeer(new Peer('telepresenca-1', TypePeer.TELEPRESENCA));

    const listRoom = new ListRoom();
    listRoom.setRoom(room);
    room.addPeer(new Peer('operator-2', TypePeer.OPERATOR));

    room = new Room('room-2', 'room');
    // expect(listRoom).toBe({});
  });
});
