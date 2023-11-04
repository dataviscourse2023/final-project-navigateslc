// Global variable containing data
const globalApplicationState = {
  selectedLocations: [],
  cityBlocks: null,
  parks: null,
  healthServices: null,
  busRoutes: null,
  trails: null,
  groceryStores: null,
  streetData: null,
  crimeData: null,
  assortedData: null
};

// Button events
const filterButtons = document.querySelectorAll('.filter-button');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.getAttribute('data-action');

    // Filter the data based on the selected action
    if (action === 'block-wise') {
      // Filter the data to show only block-wise views
    } else if (action === 'routes-trails') {
      // Filter the data to show only routes and trails
    } else if (action === 'zoom-into-u-of-u') {
      // Zoom the map into the University of Utah
    } else if (action === 'macroscopic-view') {
      // Filter the data to show only macroscopic views
    }

    // Change the color of the active filter button
    filterButtons.forEach(button => {
      button.classList.remove('active');
    });
    button.classList.add('active');
  });
});


// Loading the map
var map = L.map('map').setView([40.7608,-111.8910], 100);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
   // attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
var marker = L.marker([40.7608,-111.8910]).addTo(map);

function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);


// Loading the data
async function loadData () {
  const cityBlocks = await d3.json('data/City_Blocks.geojson');
  const parks = await d3.csv('data/Map_of_Salt_Lake_City_s_Parks.csv');
  const healthServices = await d3.csv('data/Salt_Lake_County_Public_Health_Services_Directory.csv');
  const busRoutes = await d3.json('data/UTA_Routes_and_Most_Recent_Ridership.geojson');
  const trails = await d3.json('data/Utah_Trails_and_Pathways.geojson');
  const groceryStores = await d3.json('data/Utah_Grocery_And_Food_Stores__UDAF_.geojson')
  const streetData = await d3.json('data/Streets_with_Address_Ranges.geojson')
  const crimeData = await d3.csv('data/CrimeByAreas.csv')
  const assortedData = await d3.csv('data/assorted_data.csv')

  return { cityBlocks, parks, healthServices, busRoutes, trails, groceryStores, streetData, crimeData, assortedData };
  // return {parks, healthServices}
}

loadData().then((loadedData) => {

  // Store the loaded data into the globalApplicationState
  globalApplicationState.cityBlocks = loadedData.cityBlocks;
  console.log('City blocks data successfully loaded', globalApplicationState.cityBlocks)

  globalApplicationState.parks = loadedData.parks;
  console.log('Parks data successfully loaded', globalApplicationState.parks)
  
  globalApplicationState.healthServices = loadedData.healthServices;
  console.log('Health services data successfully loaded', globalApplicationState.healthServices)
  
  globalApplicationState.busRoutes = loadedData.busRoutes;
  console.log('Bus routes data successfully loaded', globalApplicationState.busRoutes)
  
  globalApplicationState.trails = loadedData.trails;
  console.log('Trails and Trailheads data successfully loaded', globalApplicationState.trails)

  globalApplicationState.groceryStores = loadedData.groceryStores;
  console.log('Grocery stores data successfully loaded', globalApplicationState.groceryStores)

  globalApplicationState.streetData = loadedData.streetData;
  console.log('Street data successfully loaded', globalApplicationState.streetData)

  globalApplicationState.crimeData = loadedData.crimeData;
  console.log('Crime data successfully loaded', globalApplicationState.crimeData)

  globalApplicationState.assortedData = loadedData.assortedData;
  console.log('Assorted data successfully loaded', globalApplicationState.assortedData)

})