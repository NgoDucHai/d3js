var t = -1;
var n = 40;
var v = 0;
var data = d3.range(n).map(next);

function next () {
    return {
        time: ++t,
        value: v = Math.floor(Math.random()*20)
    };
}

var margin = {top: 10, right: 10, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([0, n - 1])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, 20])
    .range([height, 0]);

var line = d3.svg.line()
    .x(function(d, i) { console.log(d.time); return x(d.time); })
    .y(function(d, i) { return y(d.value); })
    .interpolate("cardinal");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var graph = g.append("svg")
    .attr("width", width)
    .attr("height", height + margin.top + margin.bottom);

var xAxis = d3.svg.axis().scale(x).orient("bottom");
var axis = graph.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

g.append("g")
    .attr("class", "y axis")
    .call(d3.svg.axis().scale(y).orient("left"));

var path = graph.append("g")
    .append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", line);

tick();

function tick()
{
    data.push(next());

    x.domain([t - n, t]);

    path
        .attr("d", line)
        .attr("transform", null)
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("transform", "translate(" + t - 1 + ")")
        .style({"stroke":"red", "stroke-width":"1.5px", "fill":"none"})
        .each("end", tick);

    axis
        .transition()
        .duration(2000)
        .ease("linear")
        .call(d3.svg.axis().scale(x).orient("bottom"));

    data.shift();
}
	 