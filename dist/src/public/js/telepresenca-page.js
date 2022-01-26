const videoGrid = document.getElementById('video-grid');
const logout = document.getElementById('logout');

logout.addEventListener('dblclick', _logout);

function _logout() {
  window.localStorage.removeItem('TLTTK');
  window.localStorage.removeItem('TLTSession');
  window.location.href = `../telepresenca`;
}

function addVideoStream(stream) {
  const video = document.createElement('video');
  video.srcObject = stream;
  video.playsinline = true;
  video.autoplay = true;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.innerHTML = ``;
  videoGrid.append(video);
  return video;
}
