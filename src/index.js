// JSON з країнами
import countries from './countries.json';

// Функція модального вікна
import { toggleModal } from './js/modal';

// svg картинка
import noResultsImg from './images/noResults.svg';

// Змінні
const countriesInput = document.querySelector('.input-countries');
const countriesDropdown = document.querySelector('.dropdown-countries');
const countriesBlock = document.querySelector('.countries-block');
const countriesSet = document.querySelector('.countries-set');

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';
const API_KEY = '9RqLQGT6sSDdxR64riYBmSDsAhCzybzg';

const mainSection = document.querySelector('.main');
const eventsContainer = document.querySelector('.event-container');

// Вибір країни
function handleCountrySelect(e) {
  countriesInput.value = e.target.dataset.name;

  const url = new URL(window.location.href);
  url.searchParams.set('countryCode', e.target.dataset.countrycode);
  window.location.replace(url.toString());

  countriesSet.classList.remove('is-open');
}

function toggleCountriesBlock(toggle) {
  if (toggle) {
    countriesSet.classList.toggle('is-open');
  } else {
    countriesSet.classList.add('is-open');
  }
  if (!countriesSet.classList.contains('is-open')) return;

  countriesBlock.innerHTML = '';
  let userInput = countriesInput.value;

  countries.forEach(country => {
    if (!country.name.toLowerCase().includes(userInput.toLowerCase())) {
      return;
    }
    const countryItem = document.createElement('div');

    countryItem.textContent = country.name;
    countryItem.setAttribute('data-name', country.name);
    countryItem.setAttribute('data-countrycode', country.countryCode);
    countryItem.classList.add('country-item');

    countriesBlock.appendChild(countryItem);
  });

  if (!countriesBlock.hasAttribute('listener')) {
    countriesBlock.setAttribute('listener', '');
    countriesBlock.addEventListener('click', e => {
      handleCountrySelect(e);
    });
  }
}

countriesInput.addEventListener('input', () => toggleCountriesBlock(false));
countriesDropdown.addEventListener('click', () => toggleCountriesBlock(true));

// Обробник помилок з API
function noResultsHandler() {
  mainSection.classList.add('no-results');

  const image = document.createElement('img');
  image.setAttribute('src', noResultsImg);
  image.setAttribute('width', '200');

  const message = document.createElement('p');
  message.textContent =
    'Oops! We couldn’t find anything. Try a different search ';

  mainSection.querySelector('.container').append(image);
  mainSection.querySelector('.container').append(message);
}
// Запит на API
async function getEvents() {
  const params = new URLSearchParams(window.location.search);
  document.querySelector('#search-input').value = params.get('keyword')
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&size=20&${params}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Рендер результату пошуку
function renderEvents(events) {
  const markup = events
    .map(event => {
      return `<li class="event-item" data-id="${event.id}"><img src="${event.images[3].url}" class="event-image"/>
                <p class="event-title">${event.name}</p><p class="event-date">${event.dates.start.localDate}</p><p class="event-location">${event._embedded.venues[0].name}</p></li>`;
    })
    .join('');
  eventsContainer.innerHTML = markup;
}

// 
async function getEventById(id) {
  try {
    const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${API_KEY}`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const event = await response.json();
    return event;
  } catch(error) {
    console.error(error);
  }
}

// Modal
eventsContainer.addEventListener('click', async e => {
  const card = e.target.closest('.event-item');
  if (!card) return;
  const eventId = card.dataset.id;
  try {
    const event = await getEventById(eventId)
    toggleModal()
  } 
  catch(error) {
    console.error(error)
  }
  
  
});

// Запуск веб-сайту
async function startApp() {
  const events = await getEvents();
  if (!events._embedded) {
    noResultsHandler();
    return;
  }
  renderEvents(events._embedded.events);
}

startApp();
