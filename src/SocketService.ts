import * as http from 'http';
import * as SocketIO from 'socket.io';
import jwt from 'jsonwebtoken';
import OperatorRepository from '@src/repository/OperatorRepository';
import TelepresencaRepository from '@src/repository/TelepresencaRepository';
import ListRoom from '@src/socket/ListRoom';
import AttendanceRoomRepository from './repository/AttendanceRoomRepository';
import ListOfAttendanceRoomMemberRepository from './repository/ListOfAttendanceRoomMemberRepository';
import ListOfAttendanceRoom from '@src/models/ListOfAttendanceRoomMember';
import Room from './socket/Room';
import { Peer, TypePeer } from './socket/Peer';

class SocketService {
  private io!: SocketIO.Server;
  private rooms = new ListRoom();

  constructor(http: http.Server) {
    this.init(http);
  }

  get getRooms() {
    return this.rooms;
  }

  private init(http: http.Server): void {
    this.io = new SocketIO.Server(http);
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          const err = new Error('not authorized');
          // err.data = { content: 'Please retry later' }; // additional details
          console.log(err);
          next(err);
          return;
        }
        const decoded = await jwt.verify(token, process.env.TOKEN || 'ola');

        next();
      } catch (err) {
        console.log('err');
        const error = new Error('not authorized');
        // error.data = { content: 'Please retry later' }; // additional details
        next(error);
        socket.disconnect();
      }
    });

    this.io.on('connection', (socket) => {
      // console.log(this.rooms);
      socket.on('connect_error', (err) => {
        console.log(err.message); // prints the message associated with the error
      });

      socket.on('operador-login', async ({ id, room: idRoom }) => {
        console.log('OPERATOR', id);

        socket.on('new-connection', (data) => {
          console.log('dis', data);
          let room = this.rooms.getRoom(idRoom);
          const operatorRemove = room?.getPeer(data.id);
          operatorRemove?.getSocket().emit('peer-desconnected');
          operatorRemove?.getSocket().disconnect();
          room?.removePeer(data.id);
          socket.emit('new-connection');
        });

        socket.on('newToken', async () => {
          const token = await jwt.sign({ id: id }, process.env.TOKEN || 'ola', {
            expiresIn: '1h',
          });
          socket.emit('newToken', token);
        });

        // verifica se é um operador
        const operator = await OperatorRepository.getByID(id);
        if (!operator) {
          socket.emit('error_login', {
            msg: 'Restricted access',
            error: 'Unauthorized',
          });
          socket.disconnect();
          return;
        }

        // verifica se é um member de alguma sala
        const hasRoom = await ListOfAttendanceRoomMemberRepository.findOne({
          id_attendanceRoom: idRoom,
          id_member_operator: id,
        } as ListOfAttendanceRoom);

        if (!hasRoom) {
          socket.disconnect();
          return;
        }

        // verifica se a sala existe
        const hasAttendanceRoom = await AttendanceRoomRepository.getByIdWithMember(
          hasRoom.id_attendanceRoom
        );
        if (!hasAttendanceRoom) {
          socket.disconnect();
          return;
        }

        // verifica se a sala já não foi criada
        let room = this.rooms.getRoom(idRoom);
        if (!room) {
          room = new Room(hasAttendanceRoom.id, hasAttendanceRoom.name);
          this.rooms.setRoom(room);
        }

        // verifica se o operador já foi criado na sala
        let peerOperator = room.getPeer(id);
        // console.log('peerOperator', id, peerOperator);
        if (!peerOperator) {
          peerOperator = new Peer(id, TypePeer.OPERATOR);
          room.addPeer(peerOperator);
        } else {
          socket.emit('conflic');
          return;
        }

        // set o socket do operador
        peerOperator.setSocket(socket);

        // salva as novas informações do peer
        room.setPeer(peerOperator);

        // avisar todas as telepresenca da sala que o operador está on
        const notifyTelepresencaOperatorOn = this.rooms
          .getRoom(idRoom)
          ?.getByType(TypePeer.TELEPRESENCA);

        notifyTelepresencaOperatorOn?.forEach((element) => {
          element.getSocket().emit('operador-on', id);
        });

        // set event disconnect
        peerOperator.getSocket().on('disconnect', () => {
          const notifyTelepresencaOperatorOff = this.rooms
            .getRoom(idRoom)
            ?.getByType(TypePeer.TELEPRESENCA);

          notifyTelepresencaOperatorOff?.forEach((element) => {
            element.getSocket().emit('operador-off', id);
          });

          // remove peer from list
          this.rooms.getRoom(idRoom)?.removePeer(id);
        });
      });

      socket.on('telepresenca-on', async ({ id, room: idRoom }) => {
        console.log('telepresenca_on', id);

        const telepresenca = await TelepresencaRepository.getById(id);
        if (!telepresenca) {
          socket.emit('error_login', {
            msg: 'Restricted access',
            error: 'Unauthorized',
          });
          socket.disconnect();
          return;
        }

        // verifica se a telepresenca faz parte de alguma sala
        const hasRoom = await ListOfAttendanceRoomMemberRepository.findOne({
          id_attendanceRoom: idRoom,
          id_member_telepresenca: id,
        } as ListOfAttendanceRoom);

        if (!hasRoom) {
          socket.disconnect();
          return;
          // TODO
        }

        // verifica se a sala de atendimento existe
        const hasAttendanceRoom = await AttendanceRoomRepository.getById(
          hasRoom.id_attendanceRoom
        );
        if (!hasAttendanceRoom) {
          socket.disconnect();
          return;
          //TODO
        }

        // verifica se a sala já foi criada
        let room = this.rooms.getRoom(idRoom);
        if (!room) {
          room = new Room(hasAttendanceRoom.id, hasAttendanceRoom.name);
          this.rooms.setRoom(room);
        }

        // verifica se o telepresenca já foi criada
        let telepresencaPeer = room.getPeer(id);
        if (!telepresencaPeer) {
          telepresencaPeer = new Peer(id, TypePeer.TELEPRESENCA);
          room.addPeer(telepresencaPeer);
        }

        // set o socket
        telepresencaPeer.setSocket(socket);

        // salva novas informações do peer
        room.setPeer(telepresencaPeer);

        const notifyOperatorTelepresencaOn = this.rooms
          .getRoom(idRoom)
          ?.getByType(TypePeer.OPERATOR);

        notifyOperatorTelepresencaOn?.forEach((element) => {
          element.getSocket().emit('telepresenca-connect', id);
          telepresencaPeer?.getSocket().emit('operador-on', element.getId());
          console.log('Operator notify: ', element.getId());
        });

        // event disconnect
        telepresencaPeer.getSocket().on('disconnect', () => {
          const notifyOperatorTelepresencaOff = this.rooms
            .getRoom(idRoom)
            ?.getByType(TypePeer.OPERATOR);
          notifyOperatorTelepresencaOff?.forEach((element) => {
            element.getSocket().emit('telepresenca-disconnected', id);
          });

          this.rooms.getRoom(idRoom)?.removePeer(id);
        });
      });

      socket.on('offer', (data) => {
        const operator = this.rooms.getRoom(data.room)?.getPeer(data.operador);
        if (operator) operator.getSocket().emit('offer', data);
      });

      socket.on('answer', (data) => {
        const telepresenca = this.rooms
          .getRoom(data.room)
          ?.getPeer(data.telepresenca);
        if (telepresenca) telepresenca.getSocket().emit('answer', data);
      });

      socket.on('candidate', (data) => {
        const peer = this.rooms.getRoom(data.room)?.getPeer(data.id);
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

export default (http: http.Server) => {
  return new SocketService(http);
};
