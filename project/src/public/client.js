let store = Immutable.Map({
    user: Immutable.Map({ name: 'Student' }),
    apod: '',
    rovers: Immutable.List(['curiosity', 'opportunity', 'spirit']),
    currentRover: ''
})

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
                <div class="rover_datas">${roverDatas(state)}</div>
                <!-- rover images -->                
                <div class="rover_images">${roverImages(state)}</div>

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

// create list with rovers

const createRoverTabs = (state) => {
    const map1 = state.get('rovers').map(rover => '<li id='+rover+' onclick="selectedRover(event)">'+rover+'</li>').join('');
    return map1
}
// manage tab state


// Get rover datas
const roverDatas = (state) => {
    const currentRover = state.get('currentRover');
    if(currentRover){
        return `
        <p>Rover: ${currentRover.latest_photos[0].rover.name}</p>
        <p>State: ${currentRover.latest_photos[0].rover.status}</p>
        <p>Launch date: ${currentRover.latest_photos[0].rover.launch_date}</p>
        <p>Landing date: ${currentRover.latest_photos[0].rover.landing_date}</p>
        `
    }
}
// Get rover images
const roverImages = (state) => {
    const currentRover = state.get('currentRover');
    if(currentRover){
        return currentRover.latest_photos.map( r => 
            `<img src="${r.img_src}" />`
        ).join('')
    }
}

// ----- EVENTS ----- //

// tabs click event
const selectedRover = event =>{
    getRoverData(event.target.id,store)
}

// ------------------------------------------------------  API CALL

const getRoverData = async (roverName, state) => {
    let { currentRover } = state
   const response = await fetch(`http://localhost:3000/rovers/${roverName}`) // get data or Response from the promise returned by fetch()
    currentRover = await response.json() 
    const newState = store.set('currentRover', currentRover)
    updateStore(store, newState)
    return currentRover
}
