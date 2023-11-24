// Loading the data
async function loadData () {
  const cityBlocks = await d3.json('data/City_Blocks.geojson');
  const BlockGroups = await d3.json('data/new_block_groups.geojson');
  const parks = await d3.csv('data/Map_of_Salt_Lake_City_s_Parks.csv');
  const healthServices = await d3.csv('data/Salt_Lake_County_Public_Health_Services_Directory.csv');
  const busRoutes = await d3.json('data/UTA_Routes_and_Most_Recent_Ridership.geojson');
  const trails = await d3.json('data/Utah_Trails_and_Pathways.geojson');
  const groceryStores = await d3.json('data/Utah_Grocery_And_Food_Stores__UDAF_.geojson')
  const streetData = await d3.json('data/Streets_with_Address_Ranges.geojson')
  const crimeData = await d3.csv('data/CrimeByAreas.csv')
  const assortedData = await d3.csv('data/new_assorted_data.csv')
  const rentData = await d3.csv('data/new_rent_data.csv')

  return { cityBlocks, BlockGroups, parks, healthServices, busRoutes, trails, groceryStores, streetData, crimeData, assortedData, rentData };
  // return {parks, healthServices}
}


// Global variable containing data
const globalApplicationState = {
  cityBlocks: null,
  BlockGroups: null,
  parks: null,
  healthServices: null,
  busRoutes: null,
  trails: null,
  groceryStores: null,
  streetData: null,
  crimeData: null,
  assortedData: null,
  rentData: null,
  selectedBlockGroup: '',
  selectedbusRoute: '',
  radarChartData: null,
  donutChartData: null
};

var map;
var block_layer;
var bus_route_layer;
var trail_route_layer;

loadData().then((loadedData) => {

  // Store the loaded data into the globalApplicationState
  globalApplicationState.cityBlocks = loadedData.cityBlocks;
  //console.log('City blocks data successfully loaded', globalApplicationState.cityBlocks)

  globalApplicationState.BlockGroups = loadedData.BlockGroups;
  //console.log('Block Group data successfully loaded', globalApplicationState.BlockGroups)

  globalApplicationState.parks = loadedData.parks;
  //console.log('Parks data successfully loaded', globalApplicationState.parks)
  
  globalApplicationState.healthServices = loadedData.healthServices;
  //console.log('Health services data successfully loaded', globalApplicationState.healthServices)
  
  globalApplicationState.busRoutes = loadedData.busRoutes;
  //console.log('Bus routes data successfully loaded', globalApplicationState.busRoutes)
  
  globalApplicationState.trails = loadedData.trails;
  //console.log('Trails and Trailheads data successfully loaded', globalApplicationState.trails)

  globalApplicationState.groceryStores = loadedData.groceryStores;
  //console.log('Grocery stores data successfully loaded', globalApplicationState.groceryStores)

  globalApplicationState.streetData = loadedData.streetData;
  //console.log('Street data successfully loaded', globalApplicationState.streetData)

  globalApplicationState.crimeData = loadedData.crimeData;
  //console.log('Crime data successfully loaded', globalApplicationState.crimeData)

  globalApplicationState.assortedData = loadedData.assortedData;
  //console.log('Assorted data successfully loaded', globalApplicationState.assortedData)

  globalApplicationState.rentData = loadedData.rentData;


  render_map()

  // Button events
  let isBlockWiseClicked = false;
  let isTrailsClicked = false;
  let isRoutesClicked = false;
  let isUofUClicked = false;
  let isMacroscopicClicked = false;
  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const action = button.getAttribute('data-action');

      // Filter the data based on the selected action
      if (action === 'block-wise' && !isBlockWiseClicked) {
      // Filter the data to show only block-wise views
        map.setView([40.7608,-111.8910], 10);
        field = ""
        globalApplicationState.selectedBlockGroup =  ""
        block_layer.clearLayers();
        bus_route_layer.clearLayers();
        trail_route_layer.clearLayers();
        d3.select('#data').selectAll('*').remove();
        block_group_layer();
        heatmap_toggle();
        isBlockWiseClicked = true;
      } else {
        isBlockWiseClicked = false;
        block_layer.clearLayers()
      }  
      if (action === 'bus-routes' && !isRoutesClicked) {
        // Filter the data to show only bus routes
        block_layer.clearLayers();
        bus_route_layer.clearLayers();
        trail_route_layer.clearLayers();
        d3.select('#data').selectAll('*').remove();
        bus_route();
        isRoutesClicked = true;
      } else {
        bus_route_layer.clearLayers();
        isRoutesClicked = false;
      }  
      if (action === 'trails' && !isTrailsClicked) {
        // Filter the data to show only trails
        block_layer.clearLayers();
        bus_route_layer.clearLayers();
        trail_route_layer.clearLayers();
        d3.select('#data').selectAll('*').remove();
        trail_route();
        isTrailsClicked = true;
      } else {
        trail_route_layer.clearLayers();
        isTrailsClicked = false;
      }
      if (action === 'zoom-into-u-of-u' && isUofUClicked) {
        // Zoom the map into the University of Utah
        isUofUClicked = true;
      } else {
        isUofUClicked = false;
      } 
      if (action === 'macroscopic-view' && !isMacroscopicClicked) {
        // Filter the data to show only macroscopic views
        isMacroscopicClicked = true;
      } else {
        isMacroscopicClicked = false;
      }
      // console.log(isBlockWiseClicked);
      // console.log(isTrailsClicked);

      // Change the color of the active filter button
      filterButtons.forEach(button => {
        button.classList.remove('active');
      });
      button.classList.add('active');
    });
  });



})