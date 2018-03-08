var monthName = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
// dimensions of page
var pageMargin=80;
var w=window.innerWidth-pageMargin;


// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 50, left: 50},
    width = w - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var tooltip = d3.select("body").append("div").attr("class", "toolTip");

var tip = d3.tip()
.attr('class', 'd3-tip')
.offset([-10, 0])
.html(function(d) {
  return "<strong>Frequency:</strong> <span style='color:red'>" + d.close + "</span>";
})

// parse the date / time
var parseTime = d3.timeParse("%Y-%m-%d");


// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);


// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin

var svg = d3.select("body")

//  .attr("margin-left",`${pageMargin/2}px`)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate("  + margin.left + "," + margin.top + ")");

// Get the data
d3.json( "data.json", function(error, data) {
  if (error) throw error;
  // format the data
  data=data.data.map(data=> {
    var d={};
      d.date = parseTime(data[0]);
      d.close= +data[1];
      return d;
  });
  console.log(x);

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.close; })]);

  // make Bars....
  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.date); })
      .attr("y", function(d) { return y(d.close); })
      .attr("width", width/data.length-0.1)
      .attr("height", function(d) { return height - y(d.close); })
      .on("mousemove", function(d){
        tooltip
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 70 + "px")
          .style("display", "inline-block")
          .html(`<strong>\$${d.close} Billion</strong><br>${monthName[d.date.getMonth()]}<br>${d.date.getFullYear()}`);
    })
    .on("mouseout", function(d){ tooltip.style("display", "none");});



  // Add the title //Add the SVG Text Element to the svgContainer
svg.append("text")
    .text("US Gross Domestic Product")
    .attr("class","title")
    .attr("text-anchor","middle")
    .attr("x",width/2)
    .attr("y","10")
  // Add the y label...
    svg.append("text")
    .text("Gross Domestic Product, USA")
    .attr("x", -0.6*height)
    .attr("textLength",.6*height)
    .attr("y", margin.right)
    //.attr("width", "height")
    .attr("transform","rotate(-90)")
  // Add the X Axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
              .ticks(data.length/2)
              .tickFormat(d3.timeFormat("%Y")))
      .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

  // Add the Y Axis
  svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));
  // Add an additional Y label
});