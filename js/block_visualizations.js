function plotRadarChart(data_for_radar_chart){
    let features = ["A", "B", "C", "D", "E", "F"];

    // Adjust the center position
    let centerX = 350 / 2 + 50;
    let centerY = 350 / 2 + 50;

    let radarChartSvg = d3.select("#data").append("svg")
        .attr("width", 350)
        .attr("height", 350);

    let radialScale = d3.scaleLinear()
        .domain([0, 10])
        .range([0, 250]);
    let ticks = [2, 4, 6, 8, 10];

    radarChartSvg.selectAll("circle")
        .data(ticks)
        .enter().append("circle")
        .attr("cx", 350 / 2)
        .attr("cy", 350 / 2)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("r", d => radialScale(d));

    radarChartSvg.selectAll(".ticklabel")
        .data(ticks)
        .enter().append("text")
        .attr("class", "ticklabel")
        .attr("x", 350 / 2 + 5)
        .attr("y", d => 350 / 2 - radialScale(d))
        .text(d => d.toString());

    function angleToCoordinate(angle, value) {
        let x = Math.cos(angle) * radialScale(value);
        let y = Math.sin(angle) * radialScale(value);
        return { "x": 350 / 2 + x, "y": 350 / 2 - y };
    }

    let featureData = features.map((f, i) => {
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        return {
            "name": f,
            "angle": angle,
            "line_coord": angleToCoordinate(angle, 10),
            "label_coord": angleToCoordinate(angle, 10.5)
        };
    });

    // draw axis line
    radarChartSvg.selectAll("line")
        .data(featureData)
        .enter().append("line")
        .attr("x1", 350 / 2)
        .attr("y1", 350 / 2)
        .attr("x2", d => d.line_coord.x)
        .attr("y2", d => d.line_coord.y)
        .attr("stroke", "black");

    // draw axis label
    radarChartSvg.selectAll(".axislabel")
        .data(featureData)
        .enter().append("text")
        .attr("class", "axislabel")
        .attr("x", d => d.label_coord.x)
        .attr("y", d => d.label_coord.y)
        .text(d => d.name);

    let line = d3.line()
        .x(d => d.x)
        .y(d => d.y);
    let colors = ["darkorange", "gray", "navy"];

    function getPathCoordinates(data_point) {
        let coordinates = [];
        for (var i = 0; i < features.length; i++) {
            let ft_name = features[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
        }
        return coordinates;
    }

    // draw the path element
    radarChartSvg.selectAll("path")
        .data([data_for_radar_chart]) // Use the actual data
        .enter().append("path")
        .datum(d => getPathCoordinates(d))
        .attr("d", line)
        .attr("stroke-width", 3)
        .attr("stroke", (_, i) => colors[i])
        .attr("fill", (_, i) => colors[i])
        .attr("stroke-opacity", 1)
        .attr("opacity", 0.5);

    console.log("plotting radar chart");
    console.log(data_for_radar_chart);

    // console.log("plotting radar chart");
    // console.log(data_for_radar_chart)

}

function plotDonutChart(data_for_donut_chart){
    // console.log("plotting donut chart");
    // console.log(data_for_donut_chart);
}