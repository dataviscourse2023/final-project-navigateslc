// function plotRadarChart() {
//     console.log(globalApplicationState.radarChartData);

//     var cfg = {
//         w: 300,               // Width of the circle
//         h: 300,               // Height of the circle
//         margin: { top: 20, right: 20, bottom: 20, left: 20 }, // The margins of the SVG
//         levels: 3,            // How many levels or inner circles should there be drawn
//         maxValue: 0,          // What is the value that the biggest circle will represent
//         labelFactor: 1.25,     // How much farther than the radius of the outer circle should the labels be placed
//         wrapWidth: 60,         // The number of pixels after which a label needs to be given a new line
//         opacityArea: 0.35,     // The opacity of the area of the blob
//         dotRadius: 4,          // The size of the colored circles of each blog
//         opacityCircles: 0.1,   // The opacity of the circles of each blob
//         strokeWidth: 2,        // The width of the stroke around each blob
//         roundStrokes: false,   // If true the area and stroke will follow a round path (cardinal-closed)
//         color: d3.scaleOrdinal(d3.schemeCategory10) // Color function
//     };

//     // Put all of the options into a variable called cfg
//     if ('undefined' !== typeof options) {
//         for (var i in options) {
//             if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
//         } // for i
//     } // if

//     // If the supplied maxValue is smaller than the actual one, replace by the max in the data
//     // var maxValue = Math.max(cfg.maxValue, d3.max(data_for_radar_chart, function (i) {
//     //     return d3.max(i.map(function (o) {
//     //         return o.value;
//     //     }))
//     // }));    
//     var maxValue = Math.max(
//         cfg.maxValue,
//         d3.max(Object.values(globalApplicationState.radarChartData), function (value) {
//             return parseFloat(value); // Assuming your values are numeric strings, convert them to numbers
//         })
//     );


//     // var allAxis = (data_for_radar_chart[0].map(function (i, j) { return i.axis })),    // Names of each axis
//     //     total = allAxis.length,                     // The number of different axes
//     //     radius = Math.min(cfg.w / 2, cfg.h / 2),   // Radius of the outermost circle
//     //     Format = d3.format('%'),                   // Percentage formatting
//     //     angleSlice = Math.PI * 2 / total;          // The width in radians of each "slice"

//     var allAxis = Object.keys(globalApplicationState.radarChartData); // Extract feature names from the object keys
//     var total = allAxis.length;                         // The number of different axes
//     var radius = Math.min(cfg.w / 2, cfg.h / 2);        // Radius of the outermost circle
//     var Format = d3.format('%');                        // Percentage formatting
//     var angleSlice = Math.PI * 2 / total;  

//     // console.log(allAxis);

//     // Scale for the radius
//     var rScale = d3.scaleLinear()
//         .range([0, radius])
//         .domain([0, maxValue]);

//     // Create the container SVG and g
//     d3.select('#data').select("radarChartSvg").remove();

//     // Initiate the radar chart SVG
//     var svg = d3.select('#data').append("svg")
//     .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
//     .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
//     .attr("class", "radarChartSvg");

//     // console.log(svg)

//     // Append a g element
//     var g = svg.append("g")
//         .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

//     // The radial line function
//     var radarLine = d3.lineRadial()
//     .curve(d3.curveLinearClosed)
//     .radius(function (d) { return rScale(d.value); })
//     .angle(function (d, i) { return i * angleSlice; });

//     if (cfg.roundStrokes) {
//         radarLine.interpolate("cardinal-closed");
//     }

//     // Create a wrapper for the blobs
//     var blobWrapper = g.selectAll(".radarWrapper")
//         .data(globalApplicationState.radarChartData)
//         .enter().append("g")
//         .attr("class", "radarWrapper");

//     // Append the backgrounds
//     blobWrapper
//         .append("path")
//         .attr("class", "radarArea")
//         .attr("d", function (d, i) { return radarLine(d); })
//         .style("fill", function (d, i) { return cfg.color(i); })
//         .style("fill-opacity", cfg.opacityArea)
//         .on('mouseover', function (d, i) {
//             // Dim all blobs
//             d3.selectAll(".radarArea")
//                 .transition().duration(200)
//                 .style("fill-opacity", 0.1);
//             // Bring back the hovered over blob
//             d3.select(this)
//                 .transition().duration(200)
//                 .style("fill-opacity", 0.7);
//         })
//         .on('mouseout', function () {
//             // Bring back all blobs
//             d3.selectAll(".radarArea")
//                 .transition().duration(200)
//                 .style("fill-opacity", cfg.opacityArea);
//         });
		
// 	//Create the outlines	
// 	blobWrapper.append("path")
// 		.attr("class", "radarStroke")
// 		.attr("d", function(d,i) { return radarLine(d); })
// 		.style("stroke-width", cfg.strokeWidth + "px")
// 		.style("stroke", function(d,i) { return cfg.color(i); })
// 		.style("fill", "none")
// 		.style("filter" , "url(#glow)");		
	
// 	//Append the circles
// 	blobWrapper.selectAll(".radarCircle")
// 		.data(function(d,i) { return d; })
// 		.enter().append("circle")
// 		.attr("class", "radarCircle")
// 		.attr("r", cfg.dotRadius)
// 		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
// 		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
// 		.style("fill", function(d,i,j) { return cfg.color(j); })
// 		.style("fill-opacity", 0.8);

// 	/////////////////////////////////////////////////////////
// 	//////// Append invisible circles for tooltip ///////////
// 	/////////////////////////////////////////////////////////
	
// 	//Wrapper for the invisible circles on top
// 	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
// 		.data(data)
// 		.enter().append("g")
// 		.attr("class", "radarCircleWrapper");
		
// 	//Append a set of invisible circles on top for the mouseover pop-up
// 	blobCircleWrapper.selectAll(".radarInvisibleCircle")
// 		.data(function(d,i) { return d; })
// 		.enter().append("circle")
// 		.attr("class", "radarInvisibleCircle")
// 		.attr("r", cfg.dotRadius*1.5)
// 		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
// 		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
// 		.style("fill", "none")
// 		.style("pointer-events", "all")
// 		.on("mouseover", function(d,i) {
// 			newX =  parseFloat(d3.select(this).attr('cx')) - 10;
// 			newY =  parseFloat(d3.select(this).attr('cy')) - 10;
					
// 			tooltip
// 				.attr('x', newX)
// 				.attr('y', newY)
// 				.text(Format(d.value))
// 				.transition().duration(200)
// 				.style('opacity', 1);
// 		})
// 		.on("mouseout", function(){
// 			tooltip.transition().duration(200)
// 				.style("opacity", 0);
// 		});
		
// 	//Set up the small tooltip for when you hover over a circle
// 	var tooltip = g.append("text")
// 		.attr("class", "tooltip")
// 		.style("opacity", 0);
	
// 	/////////////////////////////////////////////////////////
// 	/////////////////// Helper Function /////////////////////
// 	/////////////////////////////////////////////////////////

// 	//Taken from http://bl.ocks.org/mbostock/7555321
// 	//Wraps SVG text	
// 	function wrap(text, width) {
// 	  text.each(function() {
// 		var text = d3.select(this),
// 			words = text.text().split(/\s+/).reverse(),
// 			word,
// 			line = [],
// 			lineNumber = 0,
// 			lineHeight = 1.4, // ems
// 			y = text.attr("y"),
// 			x = text.attr("x"),
// 			dy = parseFloat(text.attr("dy")),
// 			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
// 		while (word = words.pop()) {
// 		  line.push(word);
// 		  tspan.text(line.join(" "));
// 		  if (tspan.node().getComputedTextLength() > width) {
// 			line.pop();
// 			tspan.text(line.join(" "));
// 			line = [word];
// 			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
// 		  }
// 		}
// 	  });
// 	}//wrap	
	
// }//RadarChart


function plotRadarChart(options) {
    console.log(globalApplicationState.radarChartData);

    var cfg = {
        w: 760,
        h: 360,
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
        levels: 3,
        maxValue: 0,
        labelFactor: 1.25,
        wrapWidth: 60,
        opacityArea: 0.35,
        dotRadius: 4,
        opacityCircles: 0.1,
        strokeWidth: 2,
        roundStrokes: false,
        color: d3.scaleOrdinal(d3.schemeCategory10)
    };

    // Put all of the options into a variable called cfg
    if ('undefined' !== typeof options) {
        for (var i in options) {
            if ('undefined' !== typeof options[i]) {
                cfg[i] = options[i];
            }
        }
    }

    var maxValue = Math.max(
        cfg.maxValue,
        d3.max(Object.values(globalApplicationState.radarChartData), function (value) {
            return parseFloat(value);
        })
    );

    var allAxis = Object.keys(globalApplicationState.radarChartData);
    var total = allAxis.length;
    var radius = Math.min(cfg.w / 2, cfg.h / 2);
    var Format = d3.format('%');
    var angleSlice = Math.PI * 2 / total;

    var rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);


    var container = d3.select('#data');

    container.select(".radarChartSvg").remove();

    // Append the new SVG
    // var svg = container.append("svg")
    // .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
    // .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
    // .attr("class", "radarChartSvg");

    // var g = svg.append("g")
    // .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

    var containerWidth = container.node().getBoundingClientRect().width;
    var containerHeight = container.node().getBoundingClientRect().height;

    var svgWidthPercentage = 100; // Adjust as needed
    var svgHeightPercentage = 50; // Adjust as needed

    var svg = container.append("svg")
    .attr("width", svgWidthPercentage + "%")  // Set width as a percentage
    .attr("height", svgHeightPercentage + "%")  // Set height as a percentage
    .attr("class", "radarChartSvg")
    .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`);  // Maintain aspect ratio

    var g = svg.append("g")
    .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

    console.log("Translation values:", (cfg.w / 2 + cfg.margin.left), ",", (cfg.h / 2 + cfg.margin.top));


    var radarLine = d3.lineRadial()
        .curve(d3.curveLinearClosed)
        .radius(function (d) { return rScale(d.value); })
        .angle(function (d, i) { return i * angleSlice; });

    if (cfg.roundStrokes) {
        radarLine.curve(d3.curveCardinalClosed);
    }

    var data_array = [allAxis.map(function (axis) {
        return { axis: axis, value: parseFloat(globalApplicationState.radarChartData[axis]) };
    })];

    var blobWrapper = g.selectAll(".radarWrapper")
        .data([data_array])
        .enter().append("g")
        .attr("class", "radarWrapper");

    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function (d, i) { return radarLine(data); })
        .style("fill", function (d, i) { return cfg.color(i); })
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function (d, i) {
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", 0.1);
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", 0.7);
        })
        .on('mouseout', function () {
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", cfg.opacityArea);
        });

    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function (d, i) { return radarLine(data); })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function (d, i) { return cfg.color(i); })
        .style("fill", "none")
        .style("filter", "url(#glow)");

    blobWrapper.selectAll(".radarCircle")
        .data(data)
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
        .style("fill", function (d, i, j) { return cfg.color(j); })
        .style("fill-opacity", 0.8);

    var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");

    blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(data)
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius * 1.5)
        .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function (d, i) {
            newX = parseFloat(d3.select(this).attr('cx')) - 10;
            newY = parseFloat(d3.select(this).attr('cy')) - 10;

            tooltip
                .attr('x', newX)
                .attr('y', newY)
                .text(Format(d.value))
                .transition().duration(200)
                .style('opacity', 1);
        })
        .on("mouseout", function () {
            tooltip.transition().duration(200)
                .style("opacity", 0);
        });

    var tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);

    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4,
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
    weight: 2,
    opacity: 0.5,
    color: 'black',
    fillOpacity: getOpacity(find_values(feature['properties']['final_key']))
};
}
}

function click_block_group(feature, layer) {
  //bind click
  layer.on('click', function (e) {
    console.log(find_values(feature['properties']['final_key']))
  globalApplicationState.selectedBlockGroup = feature['properties']['final_key']
  block_layer.clearLayers();
  block_group_layer();

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