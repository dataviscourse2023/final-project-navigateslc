function plotRadarChart() {
    // console.log(globalApplicationState.radarChartData);

    var cfg = {
        w: null,
        h: null,
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
        levels: 3,
        maxValue: 0,
        labelFactor: 1.25,
        wrapWidth: 60,
        opacityArea: 0.35,
        dotRadius: 8,
        opacityCircles: 0.1,
        strokeWidth: 2,
        roundStrokes: true,
        color: d3.scaleOrdinal(d3.schemeCategory10)
    };
    
    var container = d3.select('#data');

    cfg.w = container.node().getBoundingClientRect().width - cfg.margin.left - cfg.margin.right;
    cfg.h = container.node().getBoundingClientRect().height - cfg.margin.top - cfg.margin.bottom;

    // console.log(cfg.w, cfg.h)

    container.select(".radarChartSvg").remove();

    var containerWidth = container.node().getBoundingClientRect().width;
    var containerHeight = container.node().getBoundingClientRect().height;

    var svgWidthPercentage = 100;
    var svgHeightPercentage = 50;

    var svg = container.append("svg")
    .attr("width", svgWidthPercentage + "%")
    .attr("height", svgHeightPercentage + "%")
    .attr("class", "radarChartSvg")
    .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
    
    var g = svg.append('g')
    .attr("transform", "translate(" + (cfg.w/2) + "," + (cfg.h/2 + cfg.margin.top*2) + ")");


    var maxValue = Math.max(
        cfg.maxValue,
        d3.max(Object.values(globalApplicationState.radarChartData), function (value) {
            return parseFloat(value);
        })
    );

    // console.log(maxValue);

    var allAxis = Object.keys(globalApplicationState.radarChartData);
    var total = allAxis.length;
    var radius = Math.min(cfg.w / 2, cfg.h / 2);
    // var Format = d3.format('%');
    var angleSlice = Math.PI * 2 / total;

    var rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);

	
	//Filter for the outside glow
	var filter = g.append('defs').append('filter').attr('id','glow'),
    feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
    feMerge = filter.append('feMerge'),
    feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
    feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

    //Wrapper for the grid & axes
    var axisGrid = g.append("g").attr("class", "axisWrapper");

    //Draw the background circles
    axisGrid.selectAll(".levels")
    .data(d3.range(1,(cfg.levels+1)).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", function(d, i){return radius/cfg.levels*d;})
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", cfg.opacityCircles)
    .style("filter" , "url(#glow)");

    // Text indicating at what % each level is
    axisGrid.selectAll(".axisLabel")
    .data(d3.range(1,(cfg.levels+1)).reverse())
    .enter().append("text")
    .attr("class", "axisLabel")
    .attr("x", 4)
    .attr("y", function(d){return -d*radius/cfg.levels;})
    .attr("dy", "0.4em")
    .style("font-size", "12px")
    .attr("fill", "#737373")
    .text(function (d, i) { return (d / cfg.levels).toFixed(2)*100 + "%"; });

    //Create the straight lines radiating outward from the center
    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
    //Append the lines
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
        .text(function(d){return d})
        .call(wrap, cfg.wrapWidth);

    var radarLine = d3.lineRadial()
    .radius(function(d) { return rScale(d.value); })
    .angle(function(d, i) { return i * angleSlice; });

    // console.log(radarLine)
        
    if(cfg.roundStrokes) {
        radarLine.curve(d3.curveCardinalClosed);
    }
    
    var data = [
        Object.keys(globalApplicationState.radarChartData).map(function (key) {
          return { label: key, value: parseFloat(globalApplicationState.radarChartData[key]) };
        })
      ];

    //Create a wrapper for the blobs	
    var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper")
        // .transition().duration(1000).ease(d3.easeLinear);
            
    //Append the backgrounds	
    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("fill", function(d,i) { return cfg.color(i); })
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function (d,i){
            //Dim all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", 0.1); 
            //Bring back the hovered over blob
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", 0.6);	
        })
        .on('mouseout', function(){
            //Bring back all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", cfg.opacityArea);
        })
        .transition().duration(1000).ease(d3.easeLinear);
        
    //Create the outlines	
    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function(d,i) { return cfg.color(i); })
        .style("fill", "none")
        .style("filter" , "url(#glow)")
        .transition().duration(1000).ease(d3.easeLinear);
	

    //Append the circles
    blobWrapper.selectAll(".radarCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", function(d,i,j) { return cfg.color(j); })
        .style("fill-opacity", 0.8)
        .transition().duration(1000);

    //Wrapper for the invisible circles on top
    var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");
    
    var tooltip = g.append("text")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("visibility", "hidden");
    
    
    //Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius*1.5)
        .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function(d,i) {
            newX =  parseFloat(d3.select(this).attr('cx')) + 15;
            newY =  parseFloat(d3.select(this).attr('cy')) - 15;

            // console.log(newX, newY)
                    
            tooltip
            .attr('x', newX)
            .attr('y', newY)
            .attr("dy", "0.35em")
            .style("font-size", "20px")
            .text((i.value * 100).toFixed(2) + "%");

            // console.log(i.value)

            tooltip.transition().duration(200)
            .style('opacity', 1)
            .style("visibility", "visible");
        })
        .on("mouseout", function(){
            tooltip.transition().duration(200)
            .style("opacity", 0)
            .style("visibility", "hidden");
        });

    //Wraps SVG text	
    function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.4, // ems
            y = text.attr("y"),
            x = text.attr("x"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
            
        while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
        }
    });
    }

}


function plotDonutChart() {

    var cfg = {
        w: null,
        h: null,
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
        color: d3.scaleOrdinal(d3.schemeCategory10)
    };
    
    var container = d3.select('#data');

    cfg.w = container.node().getBoundingClientRect().width - cfg.margin.left - cfg.margin.right;
    cfg.h = container.node().getBoundingClientRect().height - cfg.margin.top - cfg.margin.bottom;

    container.select(".donutChartSvg").remove();

    var containerWidth = container.node().getBoundingClientRect().width;
    var containerHeight = container.node().getBoundingClientRect().height;

    var svgWidthPercentage = 100;
    var svgHeightPercentage = 50;

    var svg = container.append("svg")
    .attr("width", svgWidthPercentage + "%")
    .attr("height", svgHeightPercentage + "%")
    .attr("class", "donutChartSvg")
    .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
    
    var g = svg.append('g')
    // .attr("transform", "translate(" + (cfg.w/2 - cfg.margin.left*10) + "," + (cfg.h/2) + ")");
    .attr("transform", "translate(" + (cfg.w/2) + "," + (cfg.h/2 + cfg.margin.top*2) + ")");

    //Filter for the outside glow
	var filter = g.append('defs').append('filter').attr('id','glow'),
    feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
    feMerge = filter.append('feMerge'),
    feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
    feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

    const donutData = [
        { label: "Owner Occupied", value: parseInt(globalApplicationState.donutChartData.OwnerOccupied) },
        { label: "Renter Occupied", value: parseInt(globalApplicationState.donutChartData.RenterOccupied) }
    ];

    // console.log(donutData)

    const color = cfg.color;

    // Create a pie chart function
    const pie = d3.pie().value(d => d.value);

    // Create an arc function
    const arc = d3.arc()
        .outerRadius(Math.min(cfg.w, cfg.h) / 2 - 10)
        .innerRadius(150);

    // Create arcs for each data entry
    const arcs = g.selectAll(".arc")
        .data(pie(donutData))
        .enter()
        .append("g")
        .attr("class", "arc");
    
    // Append path elements for each arc
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i))
        .attr("fill-opacity", 0.1) // Set fill opacity
        .attr("stroke", (d, i) => color(i)) // Set stroke color
        .attr("stroke-opacity", 1) // Set stroke opacity
        .attr("stroke-width", 2) // Set stroke width
        .style("filter" , "url(#glow)")
        .on("mouseover", function (event, d) {
            d3.select(this)
                .transition().duration(200)
                .attr("fill-opacity", 0.3); // Increase opacity on hover

        })
        .on("mouseout", function () {
            d3.select(this)
                .transition().duration(200)
                .attr("fill-opacity", 0.1); // Restore original opacity


        });

        // Add labels to each arc
        arcs.filter(d => d.data.value !== 0)
        .append("text")
        .attr("transform", d => "translate(" + arc.centroid(d) + ")")
        .attr("dy", "-0.5em") // Adjust the vertical position
        .style("text-anchor", "middle")
        .text(d => d.data.label)
        .append("tspan")
        .attr("x", 0)
        .attr("dy", "1.2em") // Adjust the vertical position for the value
        .style("font-weight", "bold")
        .text(d => `${d.data.value} units`);

}

var southWest = L.latLng(40, -111),
  northEast = L.latLng(41, -112),
  bounds = L.latLngBounds(southWest, northEast);

var field = ""


function find_values(final_key)
{
  if (field == 'Households')
  {
    for(let i = 0; i< globalApplicationState.assortedData.length; i++)
    {
        if (globalApplicationState.assortedData[i]['final_key'] == final_key)
        {
            if (isNaN(parseFloat(globalApplicationState.assortedData[i]['Households:']))==0)
            {
              return parseFloat(globalApplicationState.assortedData[i]['Households:'])
            }
        }
    }
  }
  if (field == 'Total Population')
  {
    for(let i = 0; i< globalApplicationState.assortedData.length; i++)
    {
        if (globalApplicationState.assortedData[i]['final_key'] == final_key)
        {
            if(isNaN(parseFloat(globalApplicationState.assortedData[i]['Total Population:']))==0)
            {
             return parseFloat(globalApplicationState.assortedData[i]['Total Population:'])
            }
        }
    }
  }
  if (field == 'Median Gross Rent')
  {
    for(let i = 0; i< globalApplicationState.rentData.length; i++)
    {
        if (globalApplicationState.rentData[i]['final_key'] == final_key)
        {
            if(isNaN(parseFloat(globalApplicationState.rentData[i]['MedianGrossRent']))==0)
            {
            return parseFloat(globalApplicationState.rentData[i]['MedianGrossRent'])
            }
        }
    }

  }

  if (field == "")
  {
    return 0;
  }

  return 0;
}


function getColor(d) {
  
  if(field == 'Households')
  {
    var data = []
    for(let i = 0; i< globalApplicationState.assortedData.length;i++)
    {
        data.push(parseFloat(globalApplicationState.assortedData[i]['Households:']))
    }
    myColor = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d; }))
    .range(["white", "red"])

    return myColor(d)
  }
  if(field == 'Total Population')
  {
    var data = []
    for(let i = 0; i< globalApplicationState.assortedData.length;i++)
    {
        data.push(parseFloat(globalApplicationState.assortedData[i]['Total Population:']))
    }
    myColor = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d; }))
    .range(["white", "red"])

    return myColor(d)
  }
  if(field == 'Median Gross Rent')
  {
    var data = []
    for(let i = 0; i< globalApplicationState.rentData.length;i++)
    {
        data.push(parseFloat(globalApplicationState.rentData[i]['MedianGrossRent']))
    }
    myColor = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d; }))
    .range(["white", "red"])

    return myColor(d)
  }

  if(field == "")
  {
    return "white"
  }

    return "white"
}

function getOpacity(d) {
  
    if(field == 'Households')
    {
      var data = []
      for(let i = 0; i< globalApplicationState.assortedData.length;i++)
      {
          data.push(parseFloat(globalApplicationState.assortedData[i]['Households:']))
      }
      myColor = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d; }))
      .range([0,0.7])
  
      return myColor(d)
    }
    if(field == 'Total Population')
    {
      var data = []
      for(let i = 0; i< globalApplicationState.assortedData.length;i++)
      {
          data.push(parseFloat(globalApplicationState.assortedData[i]['Total Population:']))
      }
      myColor = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d; }))
      .range([0,0.7])
  
      return myColor(d)
    }
    if(field == 'Median Gross Rent')
    {
      var data = []
      for(let i = 0; i< globalApplicationState.rentData.length;i++)
      {
          data.push(parseFloat(globalApplicationState.rentData[i]['MedianGrossRent']))
      }
      myColor = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d; }))
      .range([0,0.7])
  
      return myColor(d)
    }

    if(field == "")
    {
        return 0;
    }

    return 0;
  }
  

function style(feature) {
  if (feature['properties']['final_key'] == globalApplicationState.selectedBlockGroup)
  {
  return {
      fillColor: getColor(find_values(feature['properties']['final_key'])),
      weight: 5,
      opacity: 1,
      color: 'black',
      fillOpacity: getOpacity(find_values(feature['properties']['final_key']))
  };
}
else {
  return {
    fillColor: getColor(find_values(feature['properties']['final_key'])),
    weight: 1,
    opacity: 0.5,
    color: 'black',
    fillOpacity: getOpacity(find_values(feature['properties']['final_key']))
};
}
}

function click_block_group(feature, layer) {
  //bind click
  layer.on('click', function (e) {
  globalApplicationState.selectedBlockGroup = feature['properties']['final_key']
  block_layer.clearLayers();
  block_group_layer();

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
  
  
//   console.log(data_for_radar_chart);

  var data_for_donut_chart = {RenterOccupied: filteredAssortedData[0]['Occupied Housing Units: Renter Occupied'],
                              OwnerOccupied: filteredAssortedData[0]['Occupied Housing Units: Owner Occupied']}
  
//   console.log(data_for_donut_chart);

  globalApplicationState.radarChartData = data_for_radar_chart;
  globalApplicationState.donutChartData = data_for_donut_chart; 

  plotRadarChart();
  plotDonutChart();

  });

  layer.on('mouseover', function (e) {

    if(field != "")
    {
      layer.bindPopup(field + ":" + find_values(feature['properties']['final_key'].toString())).openPopup();
    }


});

}

function block_group_layer()
{
  block_layer.clearLayers();
  geojson = L.geoJson(globalApplicationState.BlockGroups,{style: style, onEachFeature: click_block_group}).addTo(block_layer);
}

function heatmap_toggle()
{
  var heatmap_options = ["","Households", "Total Population","Median Gross Rent"];

  var select = d3.select('#data')
  .append('select')
  	.attr('class','select')
    .on('change',onchange)

  var options = select
  .selectAll('option')
	.data(heatmap_options).enter()
	.append('option')
		.text(function (d) { return d; });

    function onchange() {
      selectValue = d3.select('select').property('value')
      field = selectValue
      block_group_layer()
    };
}