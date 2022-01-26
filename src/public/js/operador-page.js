const me = document.getElementById('me');
const containerRemotoStream = document.getElementById('containerRemotoStream');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
const nameRoom = document.getElementById('name-room');
myVideo.muted = true;
myVideo.controls = true;
let coisa;

function called(telepresenca, data, stream) {
  const template = new DOMParser().parseFromString(
    `<button class="btn-call">
      <img width="30px"
        height="30px"
        src="../../img/plug.svg"
        alt=""
        srcset=""
        />
      <span>Conectar</span>
    </button>`,
    'text/html'
  );

  const button = template.body.children[0];
  button.addEventListener('click', function () {
    telepresenca.pc = createPeer(telepresenca, socket, stream, room.id);
    answerPeer(telepresenca, data.offer, socket, myId, room.id);

    telepresenca.candidate.forEach((element) => {
      telepresenca.pc.addIceCandidate(element.candidate);
    });
    telepresenca.candidate = [];
    this.remove();
  });

  telepresenca.container.append(button);
}

function addVideoStream(stream, telepresenca) {
  const template = new DOMParser().parseFromString(
    `<div>
      <h2 class="name-can">
        <span>${telepresenca.data.name}</span>
      </h2>
      <div class="video">
        <video class="video-show" autoplay></video>
      </div>
      <div class="container-button">
        <div class="btn-video" data-btn-type="play" >
          <img class="icon" src="../../img/pause.svg" >
        </div>
        <div class="btn-video" data-btn-type="microphone" >
          <img class="icon" src="../../img/turn-microphone-off-button.svg">
        </div>
        <div class="btn-video" data-btn-type="volume" >
          <img class="icon" src="../../img/volume-level.svg">
        </div>
        <input type="range" min="0" max="1" value="0.5" step="0.1" class="range">
      </div>
    </div>`,
    'text/html'
  );

  const container = template.body.children[0];
  // abre a camera com o microfone sempre desativado

  telepresenca.localStream.getAudioTracks()[0].enabled = false;

  // set elemento video do stream remoto
  const video = container.getElementsByTagName('video')[0];
  video.srcObject = stream;
  video.addEventListener('dblclick', () => {
    if (document.fullscreen) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  });

  const btnPlay = container.querySelector('[data-btn-type="play"]');
  btnPlay.addEventListener('click', function () {
    if (video.paused) {
      video.play();
      this.children[0].setAttribute('src', '../../img/pause.svg');
    } else {
      video.pause();
      this.children[0].setAttribute('src', '../../img/play.svg');
    }
  });

  const btnMicro = container.querySelector('[data-btn-type="microphone"]');
  btnMicro.addEventListener('click', function () {
    telepresenca.localStream.getAudioTracks()[0].enabled = !telepresenca.localStream.getAudioTracks()[0]
      .enabled;
    this.children[0].setAttribute(
      'src',
      `${
        telepresenca.localStream.getAudioTracks()[0].enabled
          ? '../../img/record-voice-microphone-button.svg'
          : '../../img/turn-microphone-off-button.svg'
      }`
    );
  });

  const btnVolume = container.querySelector('[data-btn-type="volume"]');
  btnVolume.addEventListener('click', function () {
    video.muted = !video.muted;
    this.children[0].setAttribute(
      'src',
      `${video.muted ? '../../img/mute.svg' : '../../img/volume-level.svg'}`
    );
  });

  const rangeVolume = container.getElementsByTagName('input')[0];
  rangeVolume.addEventListener('change', function () {
    video.volume = this.value;
  });

  telepresenca.container.innerHTML = ``;
  telepresenca.container.append(container);

  return video;
}

// função de criar elementos
function createContainerVideo(data) {
  const container = document.createElement('div');
  container.setAttribute('data-video-id', data.id);
  container.classList.add('container-video');

  const nameCan = document.createElement('h2');
  nameCan.classList.add('name-can');
  nameCan.innerHTML = `<span>${data.name}</span>`;
  const video = document.createElement('div');
  video.classList.add('video');

  container.append(nameCan);
  container.append(video);

  return container;
}

function setNameRoom(name) {
  nameRoom.innerText = name;
}
