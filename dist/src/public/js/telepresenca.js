const token = window.localStorage.getItem('TLTTK');
const myId = window.localStorage.getItem('TLTSession');
const socket = io('/', { auth: { token } });
let operator;
let myStream;
let room;

function initStream() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      myStream = stream;
      socket.emit('telepresenca-on', { id: myId, room });
    });

  // socket.on('operador-on', (id) => {
  //   operator = new User(id);
  //   console.log(operator);
  //   operator.pc = createPeer(operator, socket, myStream);
  //   createOffer(operator, socket);
  // });

  // socket.on('error_login', (data) => {
  //   console.log('ERROR LOGIN ', data);
  // });

  // socket.on('operador-off', (id) => {
  //   if (operator?.id) {
  //     operator.selfDestroy();
  //     operator = null;
  //   }
  // });

  // socket.on('answer', (data) => {
  //   console.log('answer');
  //   if (operator.id == data.operator) {
  //     operator.pc.setRemoteDescription(data.answer);
  //   }
  // });

  // socket.on('candidate', (data) => {
  //   console.log(data);
  //   if (operator.id === data.id) {
  //     operator.pc.addIceCandidate(data.candidate);
  //   }
  // });
}
// navigator.mediaDevices
//   .getUserMedia({
//     video: true,
//     audio: true,
//   })
//   .then((stream) => {
//     myStream = stream;
//     socket.emit('telepresenca-on', myId);
//   });

socket.on('operador-on', (id) => {
  operator = new User(id);
  console.log(operator);
  operator.pc = createPeer(operator, socket, myStream, room);
  createOffer(operator, socket, room);
});

socket.on('error_login', (data) => {
  console.log('ERROR LOGIN ', data);
});

socket.on('operador-off', (id) => {
  if (operator?.id) {
    operator.selfDestroy();
    operator = null;
  }
});

socket.on('answer', (data) => {
  console.log('answer');
  if (operator.id == data.operator) {
    operator.pc.setRemoteDescription(data.answer);
  }
});

socket.on('candidate', (data) => {
  console.log(data);
  if (operator.id === data.id) {
    operator.pc.addIceCandidate(data.candidate);
  }
});

(function () {
  const token = window.localStorage.getItem('TLTTK');
  if (!token) {
    window.location.href = `../telepresenca`;
    return;
  }

  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('x-access-token', token);
  fetch('../../telepresenca/checkMe', {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        window.localStorage.removeItem('TLTTK');
        window.localStorage.removeItem('TLTSession');
        alert(data.msg);
        window.location.href = `../telepresenca`;
        return;
      }
      window.localStorage.setItem('TLTTK', data.token);
      window.localStorage.setItem('TLTSession', data.data.id);
      fecthRoom();
    })
    .catch(async (err) => {
      error = err;
      console.log(error);
    });
})();

function fecthRoom() {
  if (!token) return;

  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('x-access-token', token);
  fetch('../../telepresenca/room', {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
  })
    .then(async (response) => {
      if (response.status === 200) return response.json();
      const data = await response.json();
      alert(data.msg);
    })
    .then((data) => {
      room = data.id_attendanceRoom;
      // init stream
      initStream();
      console.log(data);
    })
    .catch(async (err) => {
      error = err;
      console.log(error);
    });
}
