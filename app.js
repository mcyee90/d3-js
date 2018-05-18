let svgWidth = 1000;
let svgHeight = 700;

let margins = {
  top: 60,
  right: 10,
  bottom: 80,
  left: 80
};

let chartWidth = svgWidth - margins.left - margins.right;
let chartHeight = svgHeight - margins.top - margins.bottom;

let svg = d3.select('body')
  .append('svg')
  .attr('height', svgHeight)
  .attr('width', svgWidth);

let chart = svg.append('g')
  .attr('transform', `translate(${margins.left}, ${margins.top})`);

d3.csv("data/data.csv", function (error, data) {
  if (error) return console.warn(error);
  data.forEach(function (data) {
    data.state = data.state;
    data.state_abbr = data.state_abbr;
    data.highest_education = +data.highest_education;
    data.income_avg = +data.income_avg;
  });

  let xLinearScale = d3.scaleLinear()
    .domain([-.1+d3.min(data, d => d.highest_education), .1+d3.max(data, d => d.highest_education)])
    .range([0, chartWidth]);

  let yLinearScale = d3.scaleLinear()
    .domain([-5000+d3.min(data, d => d.income_avg), 5000+d3.max(data, d => d.income_avg)])
    .range([chartHeight, 0]);


  let bottomAxis = d3.axisBottom(xLinearScale);
  let leftAxis = d3.axisLeft(yLinearScale);

  chart.append('g')
    .attr('transform', `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  chart.append('g')
    .call(leftAxis);

  let graph = chart.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .classed('graph', true);
    
  let points = chart.selectAll('.graph')
    .append('circle')
    .attr('cx', d => xLinearScale(d.highest_education))
    .attr('cy', d => yLinearScale(d.income_avg))
    .attr('r', '15')
    .attr('fill', '#00FFFF')
    .attr('stroke', 'black')
    .attr('opacity', '.6')
    .classed('points', true);

  let texts = chart.selectAll('.graph')
    .append('text')
    .attr('x', d => xLinearScale(d.highest_education - 0.02))
    .attr('y', d => yLinearScale(d.income_avg - 500))
    .attr('fill', '#A9A9A9')
    .attr('font-size', '14px')
    .text(function(data) { return data.state_abbr; });

  let toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([-15, -0])
    .html(function (d) {
      return (`${d.state}<br>Highest Eduction:${d.highest_education}<br>Avg Income:${d.income_avg}`);
    });
  
  chart.call(toolTip);

  points.on('click', function (data) {
    toolTip.show(data);})
  .on("mouseout", function (data, index) {
    toolTip.hide(data);
  });

  texts.on('click', function (data) {
    toolTip.show(data);})
  .on("mouseout", function (data, index) {
    toolTip.hide(data);
  });

  chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margins.left + 20)
    .attr("x", -60 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Average Earnings");

  chart.append("text")
    .attr("transform", `translate(${chartWidth/2}, ${chartHeight + margins.top})`)
    .attr("class", "axisText")
    .attr("text-anchor", "middle") 
    .text("Highest Level of Education");

  chart.append("text")
    .attr("x", (chartWidth / 2))             
    .attr("y", 0 - (margins.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "24px") 
    .style("text-decoration", "underline")  
    .text("Highest Level of Education vs. Average Earnings by State");
});