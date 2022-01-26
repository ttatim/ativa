"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SocketIO = __importStar(require("socket.io"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const OperatorRepository_1 = __importDefault(require("@src/repository/OperatorRepository"));
const TelepresencaRepository_1 = __importDefault(require("@src/repository/TelepresencaRepository"));
const ListRoom_1 = __importDefault(require("@src/socket/ListRoom"));
const AttendanceRoomRepository_1 = __importDefault(require("./repository/AttendanceRoomRepository"));
const ListOfAttendanceRoomMemberRepository_1 = __importDefault(require("./repository/ListOfAttendanceRoomMemberRepository"));
const Room_1 = __importDefault(require("./socket/Room"));
const Peer_1 = require("./socket/Peer");
class SocketService {
    constructor(http) {
        this.rooms = new ListRoom_1.default();
        this.init(http);
    }
    init(http) {
        this.io = new SocketIO.Server(http);
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token;
                if (!token) {
                    const err = new Error('not authorized');
                    console.log(err);
                    next(err);
                    return;
                }
                const decoded = await jsonwebtoken_1.default.verify(token, process.env.TOKEN || 'ola');
                next();
            }
            catch (err) {
                console.log(err);
                const error = new Error('not authorized');
                next(error);
            }
        });
        this.io.on('connection', (socket) => {
            socket.on('connect_error', (err) => {
                console.log(err.message);
            });
            socket.on('operador-login', async ({ id, room: idRoom }) => {
                var _a;
                console.log('OPERATOR', id);
                const operator = await OperatorRepository_1.default.getByID(id);
                if (!operator) {
                    socket.emit('error_login', {
                        msg: 'Restricted access',
                        error: 'Unauthorized',
                    });
                    socket.disconnect();
                    return;
                }
                const hasRoom = await ListOfAttendanceRoomMemberRepository_1.default.findOne({
                    id_attendanceRoom: idRoom,
                    id_member_operator: id,
                });
                if (!hasRoom) {
                    socket.disconnect();
                    return;
                }
                const hasAttendanceRoom = await AttendanceRoomRepository_1.default.getByIdWithMember(hasRoom.id_attendanceRoom);
                if (!hasAttendanceRoom) {
                    socket.disconnect();
                    return;
                }
                let room = this.rooms.getRoom(idRoom);
                if (!room) {
                    room = new Room_1.default(hasAttendanceRoom.id, hasAttendanceRoom.name);
                    this.rooms.setRoom(room);
                }
                let peerOperator = room.getPeer(id);
                if (!peerOperator) {
                    peerOperator = new Peer_1.Peer(id, Peer_1.TypePeer.OPERATOR);
                    room.addPeer(peerOperator);
                }
                peerOperator.setSocket(socket);
                room.setPeer(peerOperator);
                const notifyTelepresencaOperatorOn = (_a = this.rooms
                    .getRoom(idRoom)) === null || _a === void 0 ? void 0 : _a.getByType(Peer_1.TypePeer.TELEPRESENCA);
                notifyTelepresencaOperatorOn === null || notifyTelepresencaOperatorOn === void 0 ? void 0 : notifyTelepresencaOperatorOn.forEach((element) => {
                    element.getSocket().emit('operador-on', id);
                });
                peerOperator.getSocket().on('disconnect', () => {
                    var _a, _b;
                    const notifyTelepresencaOperatorOff = (_a = this.rooms
                        .getRoom(idRoom)) === null || _a === void 0 ? void 0 : _a.getByType(Peer_1.TypePeer.TELEPRESENCA);
                    notifyTelepresencaOperatorOff === null || notifyTelepresencaOperatorOff === void 0 ? void 0 : notifyTelepresencaOperatorOff.forEach((element) => {
                        element.getSocket().emit('operador-off', id);
                    });
                    (_b = this.rooms.getRoom(idRoom)) === null || _b === void 0 ? void 0 : _b.removePeer(id);
                });
            });
            socket.on('telepresenca-on', async ({ id, room: idRoom }) => {
                var _a;
                console.log('telepresenca_on', id);
                const telepresenca = await TelepresencaRepository_1.default.getById(id);
                if (!telepresenca) {
                    socket.emit('error_login', {
                        msg: 'Restricted access',
                        error: 'Unauthorized',
                    });
                    socket.disconnect();
                    return;
                }
                const hasRoom = await ListOfAttendanceRoomMemberRepository_1.default.findOne({
                    id_attendanceRoom: idRoom,
                    id_member_telepresenca: id,
                });
                if (!hasRoom) {
                    socket.disconnect();
                    return;
                }
                const hasAttendanceRoom = await AttendanceRoomRepository_1.default.getById(hasRoom.id_attendanceRoom);
                if (!hasAttendanceRoom) {
                    socket.disconnect();
                    return;
                }
                let room = this.rooms.getRoom(idRoom);
                if (!room) {
                    room = new Room_1.default(hasAttendanceRoom.id, hasAttendanceRoom.name);
                    this.rooms.setRoom(room);
                }
                let telepresencaPeer = room.getPeer(id);
                if (!telepresencaPeer) {
                    telepresencaPeer = new Peer_1.Peer(id, Peer_1.TypePeer.TELEPRESENCA);
                    room.addPeer(telepresencaPeer);
                }
                telepresencaPeer.setSocket(socket);
                room.setPeer(telepresencaPeer);
                const notifyOperatorTelepresencaOn = (_a = this.rooms
                    .getRoom(idRoom)) === null || _a === void 0 ? void 0 : _a.getByType(Peer_1.TypePeer.OPERATOR);
                notifyOperatorTelepresencaOn === null || notifyOperatorTelepresencaOn === void 0 ? void 0 : notifyOperatorTelepresencaOn.forEach((element) => {
                    element.getSocket().emit('telepresenca-connect', id);
                    telepresencaPeer === null || telepresencaPeer === void 0 ? void 0 : telepresencaPeer.getSocket().emit('operador-on', element.getId());
                    console.log('Operator notify: ', element.getId());
                });
                telepresencaPeer.getSocket().on('disconnect', () => {
                    var _a, _b;
                    const notifyOperatorTelepresencaOff = (_a = this.rooms
                        .getRoom(idRoom)) === null || _a === void 0 ? void 0 : _a.getByType(Peer_1.TypePeer.OPERATOR);
                    notifyOperatorTelepresencaOff === null || notifyOperatorTelepresencaOff === void 0 ? void 0 : notifyOperatorTelepresencaOff.forEach((element) => {
                        element.getSocket().emit('telepresenca-disconnected', id);
                    });
                    (_b = this.rooms.getRoom(idRoom)) === null || _b === void 0 ? void 0 : _b.removePeer(id);
                });
            });
            socket.on('offer', (data) => {
                var _a;
                const operator = (_a = this.rooms.getRoom(data.room)) === null || _a === void 0 ? void 0 : _a.getPeer(data.operador);
                if (operator)
                    operator.getSocket().emit('offer', data);
            });
            socket.on('answer', (data) => {
                var _a;
                const telepresenca = (_a = this.rooms
                    .getRoom(data.room)) === null || _a === void 0 ? void 0 : _a.getPeer(data.telepresenca);
                if (telepresenca)
                    telepresenca.getSocket().emit('answer', data);
            });
            socket.on('candidate', (data) => {
                var _a;
                const peer = (_a = this.rooms.getRoom(data.room)) === null || _a === void 0 ? void 0 : _a.getPeer(data.id);
                if (peer) {
                    peer.getSocket().emit('candidate', {
                        id: data.myId,
                        myId: data.id,
                        candidate: data.candidate,
                    });
                }
            });
        });
    }
}
exports.default = (http) => {
    return new SocketService(http);
};
//# sourceMappingURL=SocketService.js.map