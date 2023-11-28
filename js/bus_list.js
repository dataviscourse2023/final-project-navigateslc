bus_list_type = "ALL"
function bus_route()
{   
    d3.select('#data').selectAll('ul').remove();
    d3.select('#data').select(".radarChartSvg").remove();
    d3.select('#data').select(".donutChartSvg").remove();
    block_layer.clearLayers();
    bus_route_layer.clearLayers();
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
      //console.log(frequency)
      const busName = listItem.append('span')
          .text("Route " + sortedRoutes[i]['properties']['LineAbbr'] + " : " + sortedRoutes[i]['properties']['LineName'])
          .style('color', frequency <= 15 ? 'green' : 'blue')
          .on('mouseover',function(mouse)
          {
            busName.style('background-color','rgb(211,211,211)');
          })
          .on('mouseleave',function(mouse)
          {
            busName.style('background-color','');
          })

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
    legend.append('p').text('Blue: 30 / 60 minutes frequency').style('color', 'blue').style('margin', '5px 0');
}

function bus_style(feature) {
    if (feature['properties']['final_key'] == globalApplicationState.selectedBlockGroup)
    {
    return {
        weight: 5,
        opacity: 1,
        color: 'black',
        fillOpacity: getOpacity(find_values(feature['properties']['final_key']))
    };
  }
  else {
    return {
      weight: 1,
      opacity: 0.5,
      color: 'black',
      fillOpacity: getOpacity(find_values(feature['properties']['final_key']))
  };
  }
  }
  
  function bus_click_block_group(feature, layer) {
    //bind click
    layer.on('click', function (e) {
    globalApplicationState.selectedBlockGroup = feature['properties']['final_key']
    block_layer.clearLayers();
    bus_block_group_layer();

    temp_routes = []
    for(let j = 0; j<globalApplicationState.BlockGroups['features'].length;j++)
    {
        if(globalApplicationState.BlockGroups['features'][j]['properties']['final_key'] == globalApplicationState.selectedBlockGroup)
        {
            var poly = turf.polygon([globalApplicationState.BlockGroups['features'][j]['geometry']['coordinates'][0][0]])
        }

    }

    for(let i = 0; i< globalApplicationState.busRoutes['features'].length; i++)
   {
    var line = turf.multiLineString(globalApplicationState.busRoutes['features'][i]['geometry']['coordinates']);
    var intersection = turf.lineIntersect(line, poly);
    if(intersection['features'].length != 0)
    {
      //console.log(globalApplicationState.busRoutes['features'][i])
      temp_routes.push(globalApplicationState.busRoutes['features'][i])
    }
    
  }
  //console.log(temp_routes)
  d3.select("#data").selectAll("ul").remove();

  const busListContainer = d3.select('#data').append('ul').style('list-style-type', 'none');

  // Separate routes into numeric and non-numeric arrays
  const numericRoutes = [];
  const miscRoutes = [];

  for (let i = 0; i < temp_routes.length; i++) {
      const route = temp_routes[i];
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


  for(let i = 0; i< temp_routes.length;i++)
  {
    const listItem = busListContainer.append('li').style('margin-bottom', '5px');
    const frequency = parseInt(sortedRoutes[i]['properties']['Frequency']);
    //console.log(frequency)
    const busName = listItem.append('span')
        .text("Route " + sortedRoutes[i]['properties']['LineAbbr'] + " : " + sortedRoutes[i]['properties']['LineName'])
        .style('color', frequency <= 15 ? 'green' : 'blue')
        .on('mouseover',function(mouse)
        {
          busName.style('background-color','rgb(211,211,211)');
        })
        .on('mouseleave',function(mouse)
        {
          busName.style('background-color','');
        })

    listItem.append('br');

    busName.on('click',function(mouse){
        busName.style('background-color','rgb(211,211,211)');
        map.eachLayer(function (layer) {  
            if(layer['feature'] != undefined)
            {
              
              if(layer['feature']['geometry']['type'] == 'MultiLineString')
              {
                map.removeLayer(layer)
              }
            }  
        });
        geojson = L.geoJson(sortedRoutes[i], {
          style: {
              color: frequency <= 15 ? 'green' : 'blue' // Change line color based on frequency
          }
        }).addTo(bus_route_layer);
        map.setView([sortedRoutes[i]['geometry']['coordinates'][0][0][1],sortedRoutes[i]['geometry']['coordinates'][0][0][0]],10)
    });

  }

  // Add legend
  // const legend = d3.select('#data').append('div').attr('id', 'legend').style('position', 'fixed').style('top', '140px').style('right', '10px');
  // legend.append('p').text('Legend:');
  // legend.append('p').text('Green: 15 minutes frequency').style('color', 'green').style('margin', '5px 0');
  // legend.append('p').text('Blue: 30 minutes frequency').style('color', 'blue').style('margin', '5px 0');

  
  });

  layer.on('mouseover', function (e) {

    layer.setStyle({
      fillColor: 'white',
      weight: 5,
      opacity: 1,
      color: 'black',
      fillOpacity: 0

    })
});

  layer.on('mouseout',function(e){

    if(layer['feature']['properties']['final_key'] == globalApplicationState.selectedBlockGroup)
    {

    layer.setStyle({
      fillColor: 'white',
      weight: 5,
      opacity: 1,
      color: 'black',
      fillOpacity: 0
      //console.log(layer['feature']['properties']['final_key'])
   })
    }

    else{
      layer.setStyle({
        fillColor: 'white',
        weight: 1,
        opacity: 0.5,
        color: 'black',
        fillOpacity: 0
        //console.log(layer['feature']['properties']['final_key'])
     })
    }
  });
  
  }
  
  function bus_block_group_layer()
  {
    block_layer.clearLayers();
    bus_route_layer.clearLayers();
    d3.select("#data").selectAll("ul").remove();
    geojson = L.geoJson(globalApplicationState.BlockGroups,{style: bus_style, onEachFeature: bus_click_block_group}).addTo(block_layer);
  }
  
  function bus_toggle()
  {
    var bus_options = ["ALL","Block-Wise"];
    //console.log("CHECK")
    var select = d3.select('#data')
    .append('select')
        .attr('class','toggle')
      .on('change',onchange)
  
    var options = select
    .selectAll('option')
      .data(bus_options).enter()
      .append('option')
          .text(function (d) { return d; });
  
      function onchange() {
        selectValue = d3.select('select').property('value')
        bus_list_type = selectValue
        if(bus_list_type == "ALL")
        {
            bus_route()
        }
        if(bus_list_type == "Block-Wise")
        {
           bus_block_group_layer()
           //.log("CHECK")
        }
      };
  }
  
  