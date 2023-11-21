function bus_route()
{   
    d3.select('#data').selectAll('ul').remove();
    block_layer.clearLayers();
    const busListContainer = d3.select('#data').append('ul').style('list-style-type', 'none');

    for(let i = 0; i< globalApplicationState.busRoutes['features'].length;i++)
    {
    const listItem = busListContainer.append('li').style('margin-bottom', '5px');
    const busName = listItem.append('span').text(globalApplicationState.busRoutes['features'][i]['properties']['LineName']);
    listItem.append('br');

    busName.on('click',function(mouse){
        map.eachLayer(function (layer) {  
            if(layer['feature'] != undefined)
            {
              map.removeLayer(layer)
            }  
         });
         geojson = L.geoJson(globalApplicationState.busRoutes['features'][i]).addTo(bus_route_layer);
         map.setView([globalApplicationState.busRoutes['features'][i]['geometry']['coordinates'][0][0][1],globalApplicationState.busRoutes['features'][i]['geometry']['coordinates'][0][0][0]],10)
    });
    }
}