
var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Parse the date / time
var	parseDate = d3.time.format("%Y-%m").parse;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%Y-%m"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var	valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.val); })
    .interpolate("cardinal");

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("public/data.tsv", function(error, data) {
    console.log(data);
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.val = +d.val;
    });

    x.domain(data.map(function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.val; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("mm (mm2)");

    var bar = svg.selectAll("bar")
        .data(data)
        .enter();
    bar.append("rect")
        .style("fill", "steelblue")
        .attr("x", function(d) { return x(d.date); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.val); })
        .attr("height", function(d) { return height - y(d.val); })
        .on('mouseover', function (d) {
            d3.select(this)
                .style('fill', 'grey');
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .style('fill', 'steelblue');
        });
    bar.append("text")
        .attr('x', function(d){
            return x(d.date)+12;
        })
        .attr('y', function (d) {
            return y(d.val)+10;
        })
        .attr('dy', ".35em")
        .text(function (d) {
            return d.val;
        })
        .style({"fill": "white","font": "10px sans-serif","text-anchor": "center"});
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data))
        .style({"stroke":"red", "stroke-width":"1.5px", "fill":"none"});

});
