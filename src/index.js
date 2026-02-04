// JSON з країнами
import countries from './countries.json';

// Функція модального вікна
import { renderModal, toggleModal } from './js/modal';

// svg картинка
import noResultsImg from './images/noResults.svg';

// Флаги країн
import "../node_modules/flag-icons/css/flag-icons.min.css";

// Змінні
const countriesInput = document.querySelector('.input-countries');
const countriesDropdown = document.querySelector('.dropdown-countries');
const countriesBlock = document.querySelector('.countries-block');
const countriesSet = document.querySelector('.countries-set');
const footerPages = document.querySelector('#footer-pages');

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
    countryItem.insertAdjacentHTML('afterbegin', `<span class="fi fi-${country.countryCode.toLowerCase()}"></span>`)

    console.log(countryItem)

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
  
  const image = document.createElement('img')
  const text = document.createElement('p')

  image.setAttribute('src', noResultsImg)
  text.insertAdjacentText('afterbegin', "Oops! We couldn't find anything. Try a different search")

  mainSection.append(image)
  mainSection.append(text)
} 
// Запит на API
async function getEvents() {
  const params = new URLSearchParams(window.location.search);
  document.querySelector('#search-input').value = params.get('keyword');
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&${params}`
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
  eventsContainer.insertAdjacentHTML("afterbegin", markup);
}

// Пагінація
function loadPages() {
  const params = new URLSearchParams(window.location.search);
  const activePage = params.has('page') ? Number(params.get('page')) : 0;
  const pages = [0];

  if (activePage === 0) {
    pages.push(
      ...[
        activePage + 1,
        activePage + 2,
        activePage + 3,
        activePage + 4,
        'input',
        50,
      ]
    );
  } else if (activePage >= 47) {
    pages.push(...[46, 47, 48, 49, 'input', 50]);
  } else if (activePage > 1) {
    pages.push(
      ...[
        activePage - 1,
        activePage,
        activePage + 1,
        activePage + 2,
        'input',
        50,
      ]
    );
  } else {
    pages.push(
      ...[
        activePage,
        activePage + 1,
        activePage + 2,
        activePage + 3,
        'input',
        50,
      ]
    );
  }

  pages.forEach(page => {
    if (page === 'input') {
      const markup = `<input name="page" class="footer-page footer-input" placeholder="...">`
      footerPages.insertAdjacentHTML("beforeend", markup);
      return;
    }
    buttonClasses = "footer-page"
    if (page === activePage) buttonClasses = buttonClasses + " active";
    const markup = `<button type="number" name="page" value="${page}" min="1" max="51" class="${buttonClasses}" placeholder="...">${page + 1}</button>`
    footerPages.insertAdjacentHTML("beforeend", markup);
  });

  console.log(pages);
}

// Подія по ID
async function getEventById(id) {
  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const event = await response.json();
    return event;
  } catch (error) {
    console.error(error);
  }
}

// Modal
eventsContainer.addEventListener('click', async e => {
  const card = e.target.closest('.event-item');
  if (!card) return;
  const eventId = card.dataset.id;
  try {
    const event = await getEventById(eventId);
    toggleModal();
    renderModal(event)
  } catch (error) {
    console.error(error);
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
  loadPages();
}

startApp();
