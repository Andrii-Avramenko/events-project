import countries from './countries.json';

const countriesInput = document.querySelector('.input-countries');
const countriesDropdown = document.querySelector('.dropdown-countries');
const countriesBlock = document.querySelector('.countries-block');
const countriesSet = document.querySelector('.countries-set');

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';
const API_KEY = '9RqLQGT6sSDdxR64riYBmSDsAhCzybzg';

const eventsContainer = document.querySelector('.event-container');

function toggleCountriesBlock(toggle) {
  if (toggle) {
    countriesSet.classList.toggle('is-open');
  } else {
    countriesSet.classList.add('is-open');
  }
  if (!countriesSet.classList.contains('is-open')) return;
  countriesBlock.innerHTML = '';
  userInput = countriesInput.value;
  countries.forEach(country => {
    if (!country.name.toLowerCase().includes(userInput.toLowerCase())) {
      return;
    }
    const countryItem = document.createElement('div');
    countryItem.textContent = country.name;
    countryItem.classList.add('country-item');

    countryItem.addEventListener('click', () => {
      countriesInput.value = country.name;

      const url = new URL(window.location.href);
      url.searchParams.set('countryCode', country.countryCode);
      window.location.replace(url.toString());
      countriesSet.classList.remove('is-open');
    });
    countriesBlock.appendChild(countryItem);
  });
}

countriesInput.addEventListener('input', () => toggleCountriesBlock(false));
countriesDropdown.addEventListener('click', () => toggleCountriesBlock(true));

async function getEvents() {
  const params = new URLSearchParams(window.location.search);
  // const allowedParams = {
  //   keyword: params.get('keyword'),
  //   page: params.get('page'),
  // }
  // let requestParams = '';

  // Object.entries(allowedParams).forEach(([key, value]) => {
  //   if (!!key && !!value) {
  //     requestParams = requestParams + `&${key}=${value}`
  //   }
  // });
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

function renderEvents(events) {
  const markup = events
    .map(event => {
      return `<li class="event-item" data-id="${event.id}"><img src="${event.images[3].url}" class="event-image"/>
                <p class="event-title">${event.name}</p><p class="event-date">${event.dates.start.localDate}</p><p class="event-location">${event._embedded.venues[0].name}</p></li>`;
    })
    .join('');
  eventsContainer.innerHTML = markup;
}

async function startApp() {
  const events = await getEvents();
  console.log(events);
  renderEvents(events._embedded.events);
}

startApp();
