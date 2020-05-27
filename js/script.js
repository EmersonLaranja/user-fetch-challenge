'use strict';
const url =
  'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo';

let allUsersList = null;
let inputName = null;
let searchButton = null;
let hasText = null;

window.addEventListener('load', () => {
  inputName = document.querySelector('#input-user');
  searchButton = document.querySelector('button');

  loadAllUsers(); //loading all users from API
  disableLoadingScreen(); //remove "loading... screen"
  searchButton.addEventListener('click', filterUsers);
  initName();
  focusInput(); //on load the page, the input is focused
});

function disableLoadingScreen() {
  let loading = document.querySelector('h2');
  loading.remove();
  inputName = document.querySelector('#input-user');
  inputName.disabled = false;
}

async function loadAllUsers() {
  let response = await fetch(url); //url assignment
  let responseJson = await response.json(); // changed from binary to JSON

  allUsersList = responseJson.results.map((user) => {
    let {
      picture: { thumbnail },
      name: { first, last },
      dob: { age },
      gender,
    } = user;

    return {
      name: `${first} ${last}`,
      photo: thumbnail,
      age,
      gender,
    };
  });
}

function filterUsers() {
  inputName = document.querySelector('#input-user').value.toLowerCase(); //assignment lowercase input  value

  let filteredList = allUsersList.filter((user) => {
    return user.name.toLowerCase().includes(inputName); //transforming username in lowercase to compare with "inputName"
  });

  if (filteredList.length == 0) {
    clearInput();

    return;
  }

  setNumberOfFoundUsers(filteredList.length);
  setUsersOnSearchList(filteredList);
  setStatistics(filteredList);
}

function setUsersOnSearchList(list) {
  let ul = document.querySelector('#users-list'); //assignment ul element
  ul.innerHTML = ''; //cleaning inner html

  list
    //listing in alphabetical order
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    })

    //creating user infos
    .map((user) => {
      let userDiv = `
    <li>
    <img src="${user.photo}">
    <span>${user.name}, ${user.age} anos</span>
    </li>
    `;
      ul.innerHTML += userDiv;
    });
}

function initName() {
  function onKeyUpNome(event) {
    hasText = !!event.target.value && event.target.value.trim() !== '';

    if (hasText) {
      searchButton.disabled = false;
    } else if (event.key == 'Enter') {
      return;
    } else {
      searchButton.disabled = true;
    }

    if (hasText && event.key == 'Enter') {
      filterUsers();
    }
  }
  inputName.addEventListener('keyup', onKeyUpNome);
}

function focusInput() {
  inputName = document.querySelector('#input-user').focus();
}

function setNumberOfFoundUsers(number) {
  var foundUsers = document.querySelector('#users-display');
  foundUsers.innerHTML = `${number} usuário(s) encontrado(s)`;
}

function setStatistics(list) {
  let statisticList = document.querySelector('#statistics-list');
  let statisticDisplay = document.querySelector('#statistics-display');
  statisticDisplay.innerHTML = 'Estatisticas';

  let statisticItem = `
  <li>Sexo masculino: ${CalculateMenQuantity(list)}</li>
  <li>Sexo feminino: ${CalculateWomenQuantity(list)}</li>
  <li>Soma das idades: ${sumAges(list)}</li>
  <li>Média das idades: ${mediaAges(list)}</li>
  `;
  statisticList.innerHTML = statisticItem;
}

function CalculateMenQuantity(list) {
  return list.filter((user) => user.gender === 'male').length;
}

function CalculateWomenQuantity(list) {
  return list.filter((user) => user.gender === 'female').length;
}

function sumAges(list) {
  let sum = list.reduce((accumulator, current) => {
    return current.age + accumulator;
  }, 0);
  return sum;
}

function mediaAges(list) {
  let sum = sumAges(list);
  if (sum == 0) return sum;
  let usersQuantity = CalculateWomenQuantity(list) + CalculateMenQuantity(list);
  return (sum / usersQuantity).toFixed(2);
}

function clearInput() {
  document.querySelector(
    '#users-display'
  ).innerHTML = `Nenhum usuário encontrado`;

  document.querySelector('#users-list').innerHTML = '';

  document.querySelector(
    '#statistics-display'
  ).innerHTML = `Nada a ser exibido`;
  document.querySelector('#statistics-list').innerHTML = '';
}
