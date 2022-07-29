

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

    const currentRover = state.get('currentRover');
    root.innerHTML = App(state,currentRover);


    if(currentRover.latest_photos){
        const roverArrows = document.querySelectorAll('.slide-arrow');
        roverArrows.forEach(function(roverArrow) {
            roverArrow.style.display = 'block'
        });
    }
}


// create content
const App = (state,currentRover) => { 

    return `
        <!-- rover tabs -->
        <div class="rover_tabs">
            <p>Choose a Rover to display its beautiful photos</p>
            <ul>${createRoverTabs(state)}</ul>  
        </div>
        <!-- rover infos -->
        <div class="rover_datas">${roverDatas(currentRover)}</div>
        <!-- rover images -->   
        <div class="rover_images_container">  
            <button class="slide-arrow" id="slide-arrow-prev" onclick="changeSlide(event)">
                &#8249;
            </button>
            <button class="slide-arrow" id="slide-arrow-next"  onclick="changeSlide(event)">
                &#8250;
            </button>             
            <div class="rover_images">  
                <ul id="slides">${roverImages(currentRover)}</ul>
            </div>
        </div>
`
}

// listening for load event
window.addEventListener('load', () => {
    render(root, store)
})

// ----- COMPONENTS ----- //

// create list with rovers

const createRoverTabs = (state) => {
    return state.get('rovers').map(rover => `<li id=${rover} onclick="selectedRover(event)">${rover}</li>`).join('');
}

// Get rover datas
const roverDatas = (currentRover) => {
    if(currentRover){ 
        return `
        <p>Rover: <b>${currentRover.latest_photos[0].rover.name}</b></p>
        <p>State: <b>${currentRover.latest_photos[0].rover.status}</b></p>
        <p>Launch date: <b>${currentRover.latest_photos[0].rover.launch_date}</b></p>
        <p>Landing date: <b>${currentRover.latest_photos[0].rover.landing_date}</b></p>
        `
    } else {
        return 'Please select a Rover'
    }
}   
// Get rover images
const roverImages = (currentRover) => {
    if(currentRover){
        return currentRover.latest_photos.map( r => 
            `<li><img src="${r.img_src}" /></li>`
        ).join('')
    } else {
        return ''
    }
}

// Slides

let maxSlides = 0;
let slideScroll = 0;
let currentSlide = 0;

const slideThis = (direction) => {
    const slideWidth = [];
    const slidesContainer = document.getElementById("slides")
    const slideImage = slides.querySelectorAll('li');

    slideImage.forEach(function(slide, i) {
        maxSlides = i;
        slideWidth.push(slide.offsetWidth)
    });
    if(direction == "slide-arrow-next"){
        if(currentSlide<maxSlides){
             currentSlide++;
             slideScroll += slideWidth[currentSlide];
        }
    } else {
        if(currentSlide>0){
            currentSlide--;
            slideScroll -= slideWidth[currentSlide];
        }
    }
    slidesContainer.style.transform = `translate(-${slideScroll}px)`   
    
    console.log("currentSlide: "+currentSlide);
    console.log("slideScroll: "+slideScroll);
    console.log("----"); 
}
// deep space effect

const sky = document.querySelector('.sky');
const planet = document.querySelector('.planet');


const incrPlanetSize = (scrollY, sppedChange)  => {
    return (window.innerHeight + Math.round(scrollY/sppedChange)) / window.innerHeight;
}

document.addEventListener('pointermove', (event) => {
     const scrollY = event.clientY;
     planet.style.transform = `scale(${incrPlanetSize(scrollY, 2)})`
     sky.style.transform = `scale(${incrPlanetSize(scrollY, 5)})`
});


// ----- EVENTS ----- //

// tabs click event
const activeTab = (thisRover) => {
    const roverTabs = document.querySelector('.rover_tabs')
    const tabsId = roverTabs.querySelectorAll('li');
    tabsId.forEach(function(tab) {
        if(tab.id == thisRover) {
            console.log(tab.id);
            document.getElementById(tab.id).classList.add('active');
        }
    });
}

const selectedRover = (event) =>{
    slideScroll = 0;
    currentSlide = 0;
    getRoverData(event.target.id) 
}
const changeSlide = event =>{
    slideThis(event.target.id)
}

// ----- API CALL ----- //

const getRoverData = async (roverName) => {
    const response = await fetch(`http://localhost:3000/rovers/${roverName}`) 
    currentRover = await response.json() 
    const newState = store.set('currentRover', currentRover)
    updateStore(store, newState)
    activeTab(roverName) 
    return currentRover
}

