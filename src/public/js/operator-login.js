const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const log = document.getElementById('log');
const listErrors = document.getElementById('errors');

const msgErrors = (params) =>
  ({
    email: 'Login não pode ser vázio',
    password: 'Senha não pode ser vázio',
    'Unauthorized access': 'Login ou senha inválido',
  }[params] || 'Campos invalidos');

const showMessageErro = (msg) => {
  const liMsg = document.createElement('li');
  liMsg.innerText = msgErrors(msg);
  listErrors.append(liMsg);
};

function cleanListErros(show) {
  listErrors.style.display = show ? 'block' : 'node';
  listErrors.innerHTML = ``;
}

function logSubmit(event) {
  event.preventDefault();
  cleanListErros(false);
  if (!email.value || !password.value) {
    log.textContent = `Todos os campos são necessários`;
    return;
  }

  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  fetch('../operator/signin', {
    method: 'POST',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const { error, errors } = data;
      if (error) {
        cleanListErros(true);
        showMessageErro(data.msg);
        password.value = '';
        return;
      }
      if (errors) {
        cleanListErros(true);
        errors.forEach((element) => {
          showMessageErro(element.param);
        });
        return;
      }

      window.localStorage.setItem('TLTK', data.token);
      window.localStorage.setItem('TLSession', data.operator.id);
      window.location.href = `./operator/screen`;
    })
    .catch((err) => {
      console.log(err);
    });
}

form.addEventListener('submit', logSubmit);
