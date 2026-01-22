import countries from './countries.json'

const countriesInput = document.querySelector('.input-countries')
const countriesDropdown = document.querySelector('.dropdown-countries')
const countriesBlock = document.querySelector('.countries-block')

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json?';
const API_KEY = '9RqLQGT6sSDdxR64riYBmSDsAhCzybzg';

const eventsContainer = document.querySelector('.event-container');

function toggleCountriesBlock() {
  countriesBlock.classList.toggle('is-open')
  if (!countriesBlock.classList.contains('is-open')) return;
  countries.forEach(country => {
    const countryItem = document.createElement('div');
    countryItem.textContent = country.name;
    countryItem.classList.add('country-item')

    countryItem.addEventListener('click', () => {
      countriesInput.value = country.name
      
    })
  })
}

countriesDropdown.addEventListener('click', toggleCountriesBlock)

async function getEvents() { 
  let params = new URLSearchParams()
  console.log(params)
  try {
    const response = await fetch(`${BASE_URL}apikey=${API_KEY}&size=20`);
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
