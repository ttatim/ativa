function createPeer(user, socket, stream, room) {
  const rtcConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  let pc = new RTCPeerConnection(rtcConfiguration);

  pc.onicecandidate = function (event) {
    if (!event.candidate) {
      return;
    }
    socket.emit('candidate', {
      room: room,
      id: user.id,
      myId: myId,
      candidate: event.candidate,
    });
  };

  for (const track of stream.getTracks()) {
    pc.addTrack(track, stream);
  }

  pc.ontrack = function (event) {
    if (user.player) {
      return;
    }

    user.player = addVideoStream(event.streams[0], user);
  };

  return pc;
}

function createOffer(user, socket, room) {
  user.pc.createOffer().then(function (offer) {
    user.pc.setLocalDescription(offer).then(function () {
      socket.emit('offer', {
        room: room,
        operador: user.id,
        telepresenca: myId,
        offer: offer,
      });
    });
  });
}

function answerPeer(user, offer, socket, myId, room) {
  user.pc.setRemoteDescription(offer).then(function () {
    user.pc.createAnswer().then(function (answer) {
      user.pc.setLocalDescription(answer).then(function () {
        socket.emit('answer', {
          room: room,
          operator: myId,
          telepresenca: user.id,
          answer: answer,
        });
      });
    });
  });
}
