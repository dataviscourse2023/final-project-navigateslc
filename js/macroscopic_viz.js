function rent_macroscopic_view() {
    const rentByAreaData = globalApplicationState.rentByAreaData;
    
    const barWidth = 700;
    const barHeight = 400;
    const margin = { top: 50, right: 30, bottom: 50, left: 80 };
    
    const svg = d3.select('.macroscopic')
    .append('svg')
    .attr('width', barWidth + margin.left + margin.right)
    .attr('height', barHeight + margin.top + margin.bottom + 10)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const xScale = d3.scaleBand()
    .domain(rentByAreaData.map(d => d.Neighborhood))
    .range([0, barWidth])
    .padding(0.1);

    const yScale = d3.scaleLinear()
    .domain([1300, d3.max(rentByAreaData, d => d.AverageRent)])
    .range([barHeight,0]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    svg.append('g')
        .attr('class', 'x-axis')
        .call(xAxis)
        .attr('transform', 'translate(0,' + barHeight +')')
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-20)');

    svg.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);
    
    svg.append('text')
        .attr('class', 'x-axis-title')
        .attr('text-anchor', 'middle')
        .attr('x', barWidth / 2)
        .attr('y', barHeight + margin.top)
        .text('Neighborhood');

    svg.append('text')
        .attr('class', 'bar-chart-title')
        .attr('text-anchor', 'middle')
        .attr('x', barWidth/2)
        .attr('y', 10)
        .text('Average Rent vs Neighborhood in SLC, UT');

    svg.append('text')
        .attr('class', 'y-axis-title')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('x', -barHeight / 2)
        .attr('y', -margin.left+40)
        .text('Average Rent');

    const barToolTip = d3.select('.macroscopic')
        .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden');

    svg.selectAll('.bar')
        .data(rentByAreaData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.Neighborhood))
        .attr('y', d => yScale(d.AverageRent))
        .attr('width', xScale.bandwidth())
        .attr('height', d => barHeight - yScale(d.AverageRent))
        .attr('fill', '#3498db')
        .on('mouseover', function(event, d) {
            d3.select(this).attr('fill', 'orange');
            barToolTip.transition()
                .duration(200)
                .style('visibility', 'visible');
            barToolTip.text('Value: ' + d.AverageRent)
                .style('left', (event.pageX) + 'px')
                .style('top', (event.pageY - 50) + 'px')
                .style('pointer-events', 'none');
        })
        .on('mouseout', function() {
            d3.select(this).attr('fill', '#3498db');
            barToolTip.transition()
                .duration(500)
                .style('visibility', 'hidden');;
        });

    const lineWidth = 600;
    const lineHeight = 350;
    const lineChartSVG = d3.select('.macroscopic').append('svg')
        .attr('width', lineWidth)
        .attr('height', lineHeight)
        .attr('transform', 'translate(10, -100)');
    
    const rentOverTimeData = [
    { date: 'Mar 2020', rent: 1662 },
    { date: 'Jul 2020', rent: 1639 },
    { date: 'Nov 2020', rent: 1616 },
    { date: 'Mar 2021', rent: 1593 },
    { date: 'Jul 2021', rent: 1670 },
    { date: 'Nov 2021', rent: 1747 },
    { date: 'Mar 2022', rent: 1824 },
    { date: 'Jul 2022', rent: 1901 },
    { date: 'Nov 2022', rent: 1978 },
    { date: 'Mar 2023', rent: 2055 },
    { date: 'Jul 2023', rent: 2132 },
    ];

    const parseTime = d3.timeParse('%b %Y');
    rentOverTimeData.forEach(d => d.date = parseTime(d.date));
    
    const lineXScale = d3.scaleTime()
    .domain([d3.min(rentOverTimeData, d => d.date), d3.max(rentOverTimeData, d => d.date)])
    .range([0, lineWidth-margin.top]);
      
    const lineYScale = d3.scaleLinear()
    .domain([d3.min(rentOverTimeData, d => d.rent) - 200, d3.max(rentOverTimeData, d => d.rent)+200])
    .range([lineHeight, 0]);
      
    const lineGenerator = d3.line()
    .x(d => lineXScale(d.date))
    .y(d => lineYScale(d.rent));

    const lineToolTip = d3.select('.macroscopic')
        .append('div')
        .attr('class', 'line-tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden');

    lineChartSVG.append('path')
        .datum(rentOverTimeData)
        .attr('d', lineGenerator)
        .attr('transform', 'translate(35, -20)')
        .attr('stroke', '#3498db')
        .attr('stroke-width', 3)
        .attr('fill', 'none');

    const dateFormatter = d3.timeFormat('%b %Y');

    lineChartSVG.selectAll('.dot')
        .data(rentOverTimeData)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => lineXScale(d.date))
        .attr('cy', d => lineYScale(d.rent))
        .attr('r', 3)
        .attr('fill', '#3498db')
        .attr('transform', 'translate(35, -20)')
        .on('mouseover', function(event, d) {
            d3.select(this).attr('r', 5)
            .attr('fill', 'orange')
            .attr('opacity', 1);
            lineToolTip.transition()
                .duration(200)
                .style('visibility', 'visible');
            lineToolTip.text(dateFormatter(d.date)+' : $' + d.rent)
                .style('left', (event.pageX) + 'px')
                .style('top', (event.pageY - 30) + 'px')
                .style('pointer-events', 'none');
        })
        .on('mouseout', function() {
            d3.select(this).attr('r', 3)
            .attr('fill', '#3498db');
            lineToolTip.transition()
                .duration(500)
                .style('visibility', 'hidden');
        });    
      
    lineChartSVG.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(35,330)')
        .call(d3.axisBottom(lineXScale).tickFormat(d3.timeFormat('%b %Y')))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-10)');
      
    lineChartSVG.append('g')
        .attr('class', 'y-axis')
        .attr('transform', 'translate(35, -20)')
        .call(d3.axisLeft(lineYScale));
      
    lineChartSVG.append('text')
        .attr('class', 'title')
        .attr('x', lineWidth/2 - 150)
        .attr('y', -330)
        .attr('transform', 'translate(50, '+lineHeight+')')
        .text('Average Rent in SLC, UT over time');

}
function macroscopic_view() {
    d3.select('.macroscopic').selectAll('*').remove();

    rent_macroscopic_view();
}