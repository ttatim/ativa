import { Peer, TypePeer } from '../Peer';
import Room from '../Room';

describe('Test unit class Room', () => {
  it('should return an array of Operator', async () => {
    const room = new Room('1', 'room');
    room.addPeer(new Peer('operator-1', TypePeer.OPERATOR));
    room.addPeer(new Peer('telepresenca-1', TypePeer.TELEPRESENCA));
    room.addPeer(new Peer('telepresenca-2', TypePeer.TELEPRESENCA));
    room.addPeer(new Peer('telepresenca-3', TypePeer.TELEPRESENCA));
    room.addPeer(new Peer('telepresenca-4', TypePeer.TELEPRESENCA));

    const operators = room.getByType(TypePeer.OPERATOR);
    const telepresenca = room.getByType(TypePeer.TELEPRESENCA);

    expect(operators).toEqual([
      {
        id: 'operator-1',
        type: 'operador',
      },
    ]);
    expect(telepresenca).toEqual([
      {
        id: 'telepresenca-1',
        type: 'telepresenca',
      },
      {
        id: 'telepresenca-2',
        type: 'telepresenca',
      },
      {
        id: 'telepresenca-3',
        type: 'telepresenca',
      },
      {
        id: 'telepresenca-4',
        type: 'telepresenca',
      },
    ]);
  });

  it('shoul set peer', async () => {
    const room = new Room('1', 'room');
    room.addPeer(new Peer('operator-1', TypePeer.OPERATOR));
    room.setPeer(new Peer('operator-1', TypePeer.TELEPRESENCA));

    const peer = room.getPeer('operator-1');
    expect(peer).toEqual({
      id: 'operator-1',
      type: 'telepresenca',
    });
  });
});
