function macroscopic_view() {
    d3.select('#data').selectAll('ul').remove();
    bus_route_layer.clearLayers();
    block_layer.clearLayers();
    trail_route_layer.clearLayers();
    d3.select('.macroscopic').selectAll('*').remove();

    
    const rentByAreaData = globalApplicationState.rentByAreaData;
    
    const width = 600;
    const height = 500;
    const margin = { top: 50, right: 30, bottom: 50, left: 80 };
    
    const svg = d3.select('.macroscopic')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const xScale = d3.scaleBand()
    .domain(rentByAreaData.map(d => d.Neighborhood))
    .range([0, width])
    .padding(0.1);

    const yScale = d3.scaleLinear()
    .domain([1200, d3.max(rentByAreaData, d => d.AverageRent)])
    .range([height,0]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    svg.append('g')
        .attr('class', 'x-axis')
        .call(xAxis)
        .attr('transform', 'translate(0,' + height +')')
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-65)');

    svg.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);

    svg.selectAll('.bar')
    .data(rentByAreaData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.Neighborhood))
    .attr('y', d => yScale(d.AverageRent))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - yScale(d.AverageRent))
    .attr('fill', '#3498db');

}