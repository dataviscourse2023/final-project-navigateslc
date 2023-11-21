function trail_route() {
    d3.select('#data').selectAll('ul').remove();
    bus_route_layer.clearLayers();
    block_layer.clearLayers();
    trail_route_layer.clearLayers();

    const trailListContainer = d3.select('#data').append('ul').style('list-style-type', 'none');

    for (let i = 0; i < globalApplicationState.trails['features'].length; i++) {
        if (globalApplicationState.trails['features'][i]['properties']['PrimaryName'] !== null) {
            const listItem = trailListContainer.append('li').style('margin-bottom', '5px');
            const trailName = listItem.append('span').text(globalApplicationState.trails['features'][i]['properties']['PrimaryName']);
            listItem.append('br');

            trailName.on('click', function (mouse) {
                map.eachLayer(function (layer) {
                    if (layer['feature'] !== undefined) {
                        map.removeLayer(layer);
                    }
                });

                geojson = L.geoJson(globalApplicationState.trails['features'][i]).addTo(trail_route_layer);
                map.setView([globalApplicationState.trails['features'][i]['geometry']['coordinates'][0][0][1], globalApplicationState.trails['features'][i]['geometry']['coordinates'][0][0][0]], 15);
            });
        }
    }
}
