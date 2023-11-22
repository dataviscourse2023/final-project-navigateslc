var southWest = L.latLng(40, -111),
  northEast = L.latLng(41, -112),
  bounds = L.latLngBounds(southWest, northEast);

  var default_block_group = {
    "color": "black",
    "weight": 2,
    "opacity": 0.5
  };

 
  var highlight_block_group = {
    opacity: 1,
    weight: 5
  };


function render_map()
{

  // Loading the map
  map = L.map('map').setView([40.7608,-111.8910], 10);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    minZoom: 12,
   // attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  block_layer = L.layerGroup().addTo(map);
  bus_route_layer = L.layerGroup().addTo(map);
  trail_route_layer = L.layerGroup().addTo(map);
}

function block_group_layer()
{
  bus_route_layer.clearLayers();
  d3.select('#data').selectAll('*').remove()
  function click_block_group(feature, layer) {
    //bind click
    layer.on('click', function (e) {
      map.eachLayer(function (layer) {
        if (layer['feature'] != undefined) {
          if (layer['feature']['properties']['final_key'] == globalApplicationState.selectedBlockGroup) {
            layer.setStyle(default_block_group);
          }
        }
      });

      globalApplicationState.selectedBlockGroup = feature['properties']['final_key'];
      layer.bringToFront();
      layer.setStyle(highlight_block_group);

      // Add the code for the block wise visualizations here.

      // Filter assorted_data based on selectedBlockGroup
      var filteredAssortedData = globalApplicationState.assortedData.filter(function (data) {
        return data['final_key'] == globalApplicationState.selectedBlockGroup;
      });
      // console.log(filteredAssortedData[0]);

      var filteredRentData = globalApplicationState.rentData.filter(function (data) {
        return data['final_key'] == globalApplicationState.selectedBlockGroup;
      });
      // console.log(filteredRentData[0]);

      var maxMedianGrossRent = d3.max(globalApplicationState.rentData, function (d) {
        return parseFloat(d.MedianGrossRent);
      });

      var maxPopulationDensity = d3.max(globalApplicationState.assortedData, function (d) {
        return parseFloat(d['Population Density (Per Sq. Mile)']);
      });

      var maxMedianHouseholdIncome = d3.max(globalApplicationState.assortedData, function (d) {
        return parseFloat(d['Median Household Income (In 2021 Inflation Adjusted Dollars)']);
      });

      // console.log(globalApplicationState.rentData);

      // console.log(maxMedianGrossRent);


      var data_for_radar_chart = {MedianHouseholdIncome: (filteredAssortedData[0]['Median Household Income (In 2021 Inflation Adjusted Dollars)']/maxMedianHouseholdIncome).toFixed(2), 
                                  PopulationDensity: (filteredAssortedData[0]['Population Density (Per Sq. Mile)']/maxPopulationDensity).toFixed(2), 
                                  MedianRent: (filteredRentData[0].MedianGrossRent/maxMedianGrossRent).toFixed(2), 
                                  GenderRatio: Math.min((filteredAssortedData[0]['Total Population: Male']/filteredAssortedData[0]['Total Population: Female']).toFixed(2), (filteredAssortedData[0]['Total Population: Female']/filteredAssortedData[0]['Total Population: Male']).toFixed(2)), 
                                  YouthPopulation: ((parseFloat(filteredAssortedData[0]['Total Population: 15 to 17 Years']) + parseFloat(filteredAssortedData[0]['Total Population: 18 to 24 Years'])) / parseFloat(filteredAssortedData[0]['Total Population'])).toFixed(2)}
      
      
      // console.log(data_for_radar_chart);

      var data_for_donut_chart = {RenterOccupied: filteredAssortedData[0]['Occupied Housing Units: Renter Occupied'],
                                  OwnerOccupied: filteredAssortedData[0]['Occupied Housing Units: Owner Occupied']}
      
      // console.log(data_for_donut_chart);

      globalApplicationState.radarChartData = data_for_radar_chart;
      globalApplicationState.donutChartData = data_for_donut_chart; 

      plotRadarChart();
      plotDonutChart();

    });

}

// console.log(globalApplicationState)
geojson = L.geoJson(globalApplicationState.BlockGroups,{style: default_block_group, onEachFeature: click_block_group}).addTo(block_layer);


}