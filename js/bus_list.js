function bus_route()
{   
    d3.select('#data').selectAll('ul').remove();
    d3.select('#data').select(".radarChartSvg").remove();
    d3.select('#data').select(".donutChartSvg").remove();

    block_layer.clearLayers();
    const busListContainer = d3.select('#data').append('ul').style('list-style-type', 'none');

    // Separate routes into numeric and non-numeric arrays
    const numericRoutes = [];
    const miscRoutes = [];

    for (let i = 0; i < globalApplicationState.busRoutes['features'].length; i++) {
        const route = globalApplicationState.busRoutes['features'][i];
        if (/^\d+$/.test(route['properties']['LineAbbr'])) {
            numericRoutes.push(route);
        } else {
            miscRoutes.push(route);
        }
    }

    // Sort numeric routes and misc routes by LineAbbr
    numericRoutes.sort((a, b) => parseInt(a['properties']['LineAbbr']) - parseInt(b['properties']['LineAbbr']));
    miscRoutes.sort((a, b) => a['properties']['LineName'].localeCompare(b['properties']['LineAbbr']));

    const sortedRoutes = numericRoutes.concat(miscRoutes);

    busListContainer.append('h2').text('Pick a route:');


    for(let i = 0; i< globalApplicationState.busRoutes['features'].length;i++)
    {
      const listItem = busListContainer.append('li').style('margin-bottom', '5px');
      const frequency = parseInt(sortedRoutes[i]['properties']['Frequency']);
      console.log(frequency)
      const busName = listItem.append('span')
          .text("Route " + sortedRoutes[i]['properties']['LineAbbr'] + " : " + sortedRoutes[i]['properties']['LineName'])
          .style('color', frequency <= 15 ? 'green' : 'blue')

      listItem.append('br');

      busName.on('click',function(mouse){
          map.eachLayer(function (layer) {  
              if(layer['feature'] != undefined)
              {
                map.removeLayer(layer)
              }  
          });
          //  geojson = L.geoJson(globalApplicationState.busRoutes['features'][i]).addTo(bus_route_layer);
          geojson = L.geoJson(sortedRoutes[i], {
            style: {
                color: frequency <= 15 ? 'green' : 'blue' // Change line color based on frequency
            }
          }).addTo(bus_route_layer);
          map.setView([sortedRoutes[i]['geometry']['coordinates'][0][0][1],sortedRoutes[i]['geometry']['coordinates'][0][0][0]],10)
      });

    }

    // Add legend
    const legend = d3.select('#data').append('div').attr('id', 'legend').style('position', 'fixed').style('top', '140px').style('right', '10px');
    legend.append('p').text('Legend:');
    legend.append('p').text('Green: 15 minutes frequency').style('color', 'green').style('margin', '5px 0');
    legend.append('p').text('Blue: 30 minutes frequency').style('color', 'blue').style('margin', '5px 0');
}