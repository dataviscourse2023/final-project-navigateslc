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
}

function block_group_layer()
{
  bus_route_layer.clearLayers();
  d3.select('#data').selectAll('*').remove()
  function click_block_group(feature, layer) {
    //bind click
    layer.on('click', function (e) {
      map.eachLayer(function (layer) {
       if(layer['feature'] != undefined)
       {
        //console.log(layer['feature']['properties']['final_key'])
        if(layer['feature']['properties']['final_key'] == globalApplicationState.selectedBlockGroup )
        {
          layer.setStyle(default_block_group);
        }
       }
    });

    globalApplicationState.selectedBlockGroup = feature['properties']['final_key']
    layer.bringToFront();
    layer.setStyle(highlight_block_group);

    // Add the code for the block wise circle visualization here or call the responsible function here. 

    });

}

console.log(globalApplicationState)
geojson = L.geoJson(globalApplicationState.BlockGroups,{style: default_block_group, onEachFeature: click_block_group}).addTo(block_layer);


}


