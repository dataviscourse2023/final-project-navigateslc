function bus_route()// Need to make the bus routes in a list, for some reason that is not done. Else the bus route visualization is done. 
{
    block_layer.clearLayers();
    bus_list = d3.select('#data').append('g')
    for(let i = 0; i< globalApplicationState.busRoutes['features'].length;i++)
    {
    bus_name = bus_list.append('text').attr('x',0).attr('y',20+(i*20)).text(globalApplicationState.busRoutes['features'][i]['properties']['LineName'])
    bus_name.on('click',function(mouse){
        console.log("check")
        map.eachLayer(function (layer) {  
            if(layer['feature'] != undefined)
            {
              map.removeLayer(layer)
            }  
         });
         geojson = L.geoJson(globalApplicationState.busRoutes['features'][i]).addTo(bus_route_layer);
         map.setView([globalApplicationState.busRoutes['features'][i]['geometry']['coordinates'][0][0][1],globalApplicationState.busRoutes['features'][i]['geometry']['coordinates'][0][0][0]],10)
         console.log(globalApplicationState.busRoutes['features'][i]['geometry']['coordinates'][0][0])
    })
    }
}

//Literally need to coopy the above function for trails.

//I shall complete the landmarks rendering soon. And even the heat map in the macroscopic view.