
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


