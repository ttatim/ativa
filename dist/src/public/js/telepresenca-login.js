const form = document.getElementById('form');
const login = document.getElementById('login');
const password = document.getElementById('password');
const listErrors = document.getElementById('errors');

const msgErrors = (params) =>
  ({
    login: 'Login não pode ser vázio',
    password: 'Senha não pode ser vázio',
    'Login or password invalid': 'Login ou senha inválido',
  }[params] || 'Campos invalidos');

const showMessageErro = (msg) => {
  const liMsg = document.createElement('li');
  liMsg.innerText = msgErrors(msg);
  listErrors.append(liMsg);
};

function logSubmit(event) {
  event.preventDefault();
  if (!login.value || !password.value) {
    log.textContent = `Todos os campos são necessários`;
    return;
  }

  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  fetch('../../telepresenca/signin', {
    method: 'POST',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify({
      login: login.value,
      password: password.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const { error, errors } = data;
      if (error) {
        listErrors.style.display = 'block';
        listErrors.innerHTML = ``;
        showMessageErro(data.msg);
        password.value = '';
        return;
      }
      if (errors) {
        listErrors.style.display = 'block';
        listErrors.innerHTML = ``;
        errors.forEach((element) => {
          showMessageErro(element.param);
        });
        return;
      }

      window.localStorage.setItem('TLTTK', data.token);
      window.localStorage.setItem('TLTSession', data.data.id);
      window.location.href = `./telepresenca/screen?s=${data.data.id}`;
    })
    .catch((err) => {
      console.log(err);
    });
}

function checkMe() {
  const token = window.localStorage.getItem('TLTTK');
  if (!token) return;

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
        return;
      }
      window.localStorage.setItem('TLTTK', data.token);
      window.localStorage.setItem('TLTSession', data.data.id);
      window.location.href = `./telepresenca/screen?s=${data.data.id}`;
    })
    .catch(async (err) => {
      console.log(err);
    });
}

checkMe();
form.addEventListener('submit', logSubmit);
