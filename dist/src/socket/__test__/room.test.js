"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Peer_1 = require("../Peer");
const Room_1 = __importDefault(require("../Room"));
describe('Test unit class Room', () => {
    it('should return an array of Operator', async () => {
        const room = new Room_1.default('1', 'room');
        room.addPeer(new Peer_1.Peer('operator-1', Peer_1.TypePeer.OPERATOR));
        room.addPeer(new Peer_1.Peer('telepresenca-1', Peer_1.TypePeer.TELEPRESENCA));
        room.addPeer(new Peer_1.Peer('telepresenca-2', Peer_1.TypePeer.TELEPRESENCA));
        room.addPeer(new Peer_1.Peer('telepresenca-3', Peer_1.TypePeer.TELEPRESENCA));
        room.addPeer(new Peer_1.Peer('telepresenca-4', Peer_1.TypePeer.TELEPRESENCA));
        const operators = room.getByType(Peer_1.TypePeer.OPERATOR);
        const telepresenca = room.getByType(Peer_1.TypePeer.TELEPRESENCA);
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
        const room = new Room_1.default('1', 'room');
        room.addPeer(new Peer_1.Peer('operator-1', Peer_1.TypePeer.OPERATOR));
        room.setPeer(new Peer_1.Peer('operator-1', Peer_1.TypePeer.TELEPRESENCA));
        const peer = room.getPeer('operator-1');
        expect(peer).toEqual({
            id: 'operator-1',
            type: 'telepresenca',
        });
    });
});
//# sourceMappingURL=room.test.js.map