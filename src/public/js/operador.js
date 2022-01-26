const ListTelepresencas = new Map();
let token = window.localStorage.getItem('TLTK');
let myId;
let myStream;
let socket;
let room;
let genereNewToken;

function initConnection() {
  socket = io('/', { auth: { token } });

  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      myStream = stream;
      const video = document.createElement('video');
      video.srcObject = stream;
      video.controls = true;
      video.muted = true;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
      me.append(video);
    });

  socket.on('conflic', () => {
    const result = confirm(
      'Já existe uma conta logada. Deseja se conectar por aqui?'
    );

    if (result) {
      socket.emit('new-connection', { id: myId, room: room.id });
    } else {
      redirectToLogin();
    }
  });

  socket.on('new-connection', () => {
    window.location.reload();
  });

  socket.on('peer-desconnected', () => {
    redirectToLogin();
  });

  socket.on('newToken', (data) => {
    localStorage.setItem('TLTK', data);
  });

  genereNewToken = setInterval(() => {
    socket.emit('newToken', token);
  }, 40000);

  socket.emit('operador-login', { id: myId, room: room.id });

  socket.on('error_login', (data) => {
    console.log('ERROR LOGIN ', data);
    alert('erro ao tentar se conectar com o servidor');
  });

  socket.on('telepresenca-disconnected', (id) => {
    const telepresenca = ListTelepresencas.get(id);
    if (!telepresenca) {
      return;
    }
    console.log('disconnect', id);
    // apagar os elementos filhos
    telepresenca.container.innerHTML = '';

    // crear novo elementos filhos
    const nameCan = document.createElement('h2');
    nameCan.classList.add('name-can');
    nameCan.innerHTML = `<span>${telepresenca.data.name}</span>`;
    const video = document.createElement('div');
    video.classList.add('video');

    // adicionar elementos filhos
    telepresenca.container.append(nameCan);
    telepresenca.container.append(video);

    // fechar as conecçoes peer
    telepresenca.selfDestroy();
    console.log(telepresenca.player);
  });

  socket.on('offer', (data) => {
    const telepresenca = ListTelepresencas.get(data.telepresenca);
    if (!telepresenca) {
      return;
    }
    navigator.mediaDevices
      .getUserMedia({
        video: {
          height: 480,
          width: 640,
        },
        audio: true,
      })
      .then(function (stream) {
        telepresenca.localStream = stream;
        called(telepresenca, data, stream);
      })
      .catch(function (err) {
        console.log(err);
      });
  });

  socket.on('ERRORS', (msg) => {
    console.log('ERRORS: ', msg);
  });

  socket.on('candidate', (data) => {
    const telepresenca = ListTelepresencas.get(data.id);
    if (!telepresenca) {
      return;
    }
    if (telepresenca.pc) {
      
      telepresenca.pc.addIceCandidate(data.candidate);
    } else {
      telepresenca.candidate.push(data);
    }
  });
}

// carregar as telepresencas cadastradas
async function fetchTelepresenca() {
  try {
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('x-access-token', token);
    const telepresencas = await fetch('../../telepresenca', {
      method: 'GET',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default',
    });
    const response = await telepresencas.json();
    response.forEach((element) => {
      const telepresenca = new Telepresenca(element.id);
      telepresenca.container = createContainerVideo(element);
      telepresenca.data = element;
      containerRemotoStream.append(telepresenca.container);
      ListTelepresencas.set(telepresenca.id, telepresenca);
    });
  } catch (err) {
    console.error(err);
  }
}

(function () {
  token = window.localStorage.getItem('TLTK');
  if (!token) return;

  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('x-access-token', token);
  fetch('../../operator/checkMe', {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
  })
    .then((response) => response.json())
    .then(async (data) => {
      if (data.error) {
        alert(data.msg);
        redirectToLogin();
        return;
      }
      window.localStorage.setItem('TLTK', data.token);

      myId = data.operator.id;
      // fetchTelepresenca();
      fetchRoom();
      // initConnection();
    })
    .catch(async (err) => {
      error = err;
      console.log(error);
    });
})();

function fetchRoom() {
  if (!token) return;

  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('x-access-token', token);
  fetch('../../operator/room', {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
  })
    .then(async (response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        const data = await response.json();
        alert(data.msg);
      }
    })
    .then(async (data) => {
      room = data;
      setNameRoom(room.name);
      await room.members.forEach((element) => {
        if (element.type === 'operator') return;
        const prettyTelepresenca = {
          id: element.id_member,
          name: element.name,
        };
        console.log(element);
        const telepresenca = new Telepresenca(prettyTelepresenca.id);
        telepresenca.container = createContainerVideo(prettyTelepresenca);
        telepresenca.data = prettyTelepresenca;
        containerRemotoStream.append(telepresenca.container);
        ListTelepresencas.set(telepresenca.id, telepresenca);
      });
      initConnection();
    });
}

const redirectToLogin = () => {
  window.localStorage.removeItem('TLTK');
  window.localStorage.removeItem('TLSession');
  window.location.href = `../operator`;
};
