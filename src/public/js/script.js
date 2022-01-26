const hour = document.getElementsByClassName('hour')[0];
const min = document.getElementsByClassName('min')[0];
const sec = document.getElementsByClassName('sec')[0];
const data = document.getElementsByClassName('data')[0];
const mouth = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];
let today;

setInterval(() => {
  const date = new Date();
  hour.innerText =
    date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  min.innerText =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  sec.innerText =
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

  if (today !== date.getDate()) {
    data.innerHTML = `<span class="data-strong">${date.getDate()} ${
      mouth[date.getMonth()]
    }</span><span class="data-medium">de</span>
    <span class="data-strong">${date.getFullYear()}</span>`;
    today = date.getDate();
  }
}, 1000);
