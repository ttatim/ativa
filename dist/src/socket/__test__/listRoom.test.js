"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ListRoom_1 = __importDefault(require("../ListRoom"));
const Peer_1 = require("../Peer");
const Room_1 = __importDefault(require("../Room"));
describe('List Room test unit', () => {
    it('should create a new room', async () => {
        const room = new Room_1.default('room-1', 'room');
        room.addPeer(new Peer_1.Peer('operator-1', Peer_1.TypePeer.OPERATOR));
        room.addPeer(new Peer_1.Peer('telepresenca-1', Peer_1.TypePeer.TELEPRESENCA));
        const listRoom = new ListRoom_1.default();
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
        const room = new Room_1.default('room-1', 'room');
        room.addPeer(new Peer_1.Peer('operator-1', Peer_1.TypePeer.OPERATOR));
        room.addPeer(new Peer_1.Peer('telepresenca-1', Peer_1.TypePeer.TELEPRESENCA));
        const listRoom = new ListRoom_1.default();
        listRoom.setRoom(room);
        const room2 = new Room_1.default('room-2', 'room');
        room2.addPeer(new Peer_1.Peer('operator-2', Peer_1.TypePeer.OPERATOR));
        room2.addPeer(new Peer_1.Peer('telepresenca-2', Peer_1.TypePeer.TELEPRESENCA));
        listRoom.setRoom(room2);
    });
    it('should set peer', async () => {
        var _a;
        const room = new Room_1.default('room-1', 'room');
        room.addPeer(new Peer_1.Peer('operator-1', Peer_1.TypePeer.OPERATOR));
        room.addPeer(new Peer_1.Peer('telepresenca-1', Peer_1.TypePeer.TELEPRESENCA));
        const listRoom = new ListRoom_1.default();
        listRoom.setRoom(room);
        (_a = listRoom
            .getRoom('room-1')) === null || _a === void 0 ? void 0 : _a.setPeer(new Peer_1.Peer('operator-1', Peer_1.TypePeer.TELEPRESENCA));
    });
    it('should add new Peer', () => {
        var _a;
        const room = new Room_1.default('room-1', 'room');
        room.addPeer(new Peer_1.Peer('operator-1', Peer_1.TypePeer.OPERATOR));
        room.addPeer(new Peer_1.Peer('telepresenca-1', Peer_1.TypePeer.TELEPRESENCA));
        const listRoom = new ListRoom_1.default();
        listRoom.setRoom(room);
        (_a = listRoom
            .getRoom('room-1')) === null || _a === void 0 ? void 0 : _a.addPeer(new Peer_1.Peer('operator-2', Peer_1.TypePeer.TELEPRESENCA));
    });
    it('should add new Peer by reference', () => {
        const room = new Room_1.default('room-1', 'room');
        room.addPeer(new Peer_1.Peer('operator-1', Peer_1.TypePeer.OPERATOR));
        room.addPeer(new Peer_1.Peer('telepresenca-1', Peer_1.TypePeer.TELEPRESENCA));
        const listRoom = new ListRoom_1.default();
        listRoom.setRoom(room);
        const setRoom = listRoom.getRoom('room-1');
        setRoom === null || setRoom === void 0 ? void 0 : setRoom.addPeer(new Peer_1.Peer('operator-2', Peer_1.TypePeer.OPERATOR));
    });
    it('should add new Peer after add list', () => {
        let room = new Room_1.default('room-1', 'room');
        room.addPeer(new Peer_1.Peer('operator-1', Peer_1.TypePeer.OPERATOR));
        room.addPeer(new Peer_1.Peer('telepresenca-1', Peer_1.TypePeer.TELEPRESENCA));
        const listRoom = new ListRoom_1.default();
        listRoom.setRoom(room);
        room.addPeer(new Peer_1.Peer('operator-2', Peer_1.TypePeer.OPERATOR));
        room = new Room_1.default('room-2', 'room');
    });
});
//# sourceMappingURL=listRoom.test.js.map