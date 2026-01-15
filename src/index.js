const SERVER_URL = "https://app.ticketmaster.com/discovery/v2/events.json?"
const SERVER_API = "apikey=9RqLQGT6sSDdxR64riYBmSDsAhCzybzg"

async function getEvents() {
    try {
        const response = await fetch(SERVER_URL + SERVER_API)
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error)
    }
}

async function startApp() {
    const events = await getEvents()
    console.log(events)
}

startApp()