let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => { 
    let { rovers, apod } = state

    return `
        <header>
            <!-- nav tabs -->
            <ul>${createRoverTabs(store)}</ul>
        </header>
        <main>
            <section>
                <!-- rover infos -->
                <!-- rover images -->
            </section>
        </main>
        <footer>
            <!-- Didier did that infos -->
        </footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ----- COMPONENTS ----- //

// create rover tabs --> <li> with rover name

const createRoverTabs = (state) => {
    const map1 = state.rovers.map(rover => '<li id='+rover+' onclick="getRoverData(event)">'+rover+'</li>').join('');
    return map1
}
// manage tab state

// get rover images

// add images to content

// ----- EVENTS ----- //

// tabs click event
const getRoverData = event =>{
    console.log(event.target.id);
}


// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}



// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
    console.log(data);
    return data
}

const getRoverImages = async (roverName, state) => {
    let { currentRover } = state
   const response = await fetch(`http://localhost:3000/rovers/${roverName}`) // get data or Response from the promise returned by fetch()
    currentRover = await response.json() 

    // set data from the server to Immutable 'currenRover'
    const newState = store.set('currentRover', currentRover);
    // updates the old state with the new information
    updateStore(store, newState)
    return currentRover
}
