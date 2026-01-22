const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json?';
const API_KEY = '9RqLQGT6sSDdxR64riYBmSDsAhCzybzg';

const eventsContainer = document.querySelector('.event-container');

async function getEvents() {
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
      return `<li class="event-item" data-id="${event.id}"><img src="${event.images[3].url}" />
                <p>${event.name}</p><p>${event.dates.start.localDate}</p><p>${event._embedded.venues[0].name}</p></li>`;
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
