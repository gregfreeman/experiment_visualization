var w = 600,
h = 450;
var markerRadius = 4;
var maxDataPointsForDots = 50,
transitionDuration = 1000;

var svg = null,
yAxisGroup = null,
xAxisGroup = null,
dataMarkersGroup = null,
dataLinesGroup = null;

function drawSeriesLine(node, data, xfield, yfield1, x, y) {
	// Draw data series lines
	
	var class_name = 'data-line';
	var dataLines = node.selectAll('.' + class_name)
		.data([data]);
	var line = d3.svg.line()
		// assign the X function to plot our line as we wish
		.x(function (d) {
			return x(xfield(d));
		})
		.y(function (d) {
			return y(d[yfield1]);
		})
		.interpolate("linear");
	
	dataLines.enter().append('path')
	.classed(class_name, true)
	.style('opacity', 0.3)
	.attr("d", line(data));
	
	dataLines
	.attr("d", line(data))
	.style('opacity', 0.3);

	dataLines.transition()
	.attr("d", line)
	.duration(transitionDuration)
	.style('opacity', 1);
	//.attr("transform", function (d) {
	//	return "translate(" + x(xfield(d)) + "," + y(d[yfield1]) + ")";
	//});
	
	dataLines.exit()
	.transition()
	.attr("d", line)
	.duration(transitionDuration)
	.attr("transform", function (d) {
		return "translate(" + x(xfield(d)) + "," + y(0) + ")";
	})
	.style('opacity', 1e-6)
	.remove();


	
}

function drawSeriesMarker(node, data, xfield, yfield1, x, y) {
	// Draw data series markers

	var class_name = 'data-point';
	
	console.log('drawSeriesMarker '+ node + ' with data '+data+' for field '+yfield1);
	
	var markers = node.selectAll('.' + class_name)
		.data(data);
	
	markers
	.enter()
	.append('svg:circle')
	.classed(class_name, true)
	.style('opacity', 1e-6)
	.attr('cx', function (d) {
		return x(xfield(d))
	})
	.attr('cy', function () {
		return y(0)
	})
	.attr('r', function () {
		return (data.length <= maxDataPointsForDots) ? markerRadius : 0
	})
	.transition()
	.duration(transitionDuration)
	.style('opacity', 1)
	.attr('cx', function (d) {
		return x(xfield(d))
	})
	.attr('cy', function (d) {
		return y(d[yfield1])
	});
	
	markers
	.transition()
	.duration(transitionDuration)
	.attr('cx', function (d) {
		return x(xfield(d))
	})
	.attr('cy', function (d) {
		return y(d[yfield1])
	})
	.attr('r', function () {
		return (data.length <= maxDataPointsForDots) ? markerRadius : 0
	})
	.style('opacity', 1);
	
	markers
	.exit()
	.transition()
	.duration(transitionDuration)
  // Leave the cx transition off. Allowing the points to fall where they lie is best.
  //.attr('cx', function(d, i) { return xScale(i) })
	.attr('cy', function () {
		return y(0)
	})
	.style("opacity", 1e-6)
	.remove();

	
}

function drawFieldSeries(data, xfield, yfields) {
	var topmargin = 40;
	var leftmargin = 40;
	
    var ymax = -1e12;
	var ymin = 1e12;
	yfields.forEach( function (yfieldi) {
 		var ymaxi = d3.max(data, function (d) {
				return d[yfieldi]
			});
		var ymini = d3.min(data, function (d) {
				return d[yfieldi]
			});
		ymax = ymaxi > ymax ? ymaxi : ymax;
		ymin = ymini < ymin ? ymini : ymin;
	});
	
	var yfield1 = yfields[1];
	
	var xmax = d3.max(data, function (d) {
			return xfield(d)
		});
	var xmin = d3.min(data, function (d) {
			return xfield(d)
		});
	
	var x = d3.scale.linear().range([0, w - leftmargin * 2]).domain([xmin, xmax]);
	var y = d3.scale.linear().range([h - topmargin * 2, 0]).domain([ymin, ymax]);
	
	var xAxis = d3.svg.axis().scale(x).tickSize(h - topmargin * 2).tickPadding(10).ticks(7);
	var yAxis = d3.svg.axis().scale(y).orient('left').tickSize(-w + leftmargin * 2).tickPadding(10);
	var t = null;
	
	svg = d3.select('#chart').select('svg').select('g');
	if (svg.empty()) {
		svg = d3.select('#chart')
			.append('svg:svg')
			.attr('width', w)
			.attr('height', h)
			.attr('class', 'viz')
			.append('svg:g')
			.attr('transform', 'translate(' + leftmargin + ',' + topmargin + ')');
	}
	
	t = svg.transition().duration(transitionDuration);
	
	// y ticks and labels
	if (!yAxisGroup) {
		yAxisGroup = svg.append('svg:g')
			.attr('class', 'yTick')
			.call(yAxis);

	} else {
		t.select('.yTick').call(yAxis);
	}
	
	// x ticks and labels
	if (!xAxisGroup) {
		xAxisGroup = svg.append('svg:g')
			.attr('class', 'xTick')
			.call(xAxis);
	} else {
		t.select('.xTick').call(xAxis);
	}
	
	if (!dataLinesGroup) {
		dataLinesGroup = svg.append('svg:g');
	}
	
	datalines = dataLinesGroup.selectAll('g .data-lines')
		.data(yfields);
		
		datalines 
		.enter().append('g')
		.attr("class",
			function (d, i) {
			return 'series' + i;
		})
		.classed('data-lines',true)
		.each(function (d) {
			drawSeriesLine(d3.select(this), data, xfield, d, x, y);
		});

		datalines 
		.attr("class",
			function (d, i) {
			return 'series' + i;
		})
		.classed('data-lines',true)
		.each(function (d) {
			drawSeriesLine(d3.select(this), data, xfield, d, x, y);
		});

	  datalines 	
		.exit().remove();


	if (!dataMarkersGroup) {
		dataMarkersGroup = svg.append('svg:g');
	}
					
	data_series_markers = dataMarkersGroup.selectAll('g .data-markers')
		.data(yfields);
		
	data_series_markers 	
		.enter().append('g')
		.attr("class",
			function (d, i) {
			return 'series' + i;
		})
		.classed('data-markers',true)
		.each(function (d) {
			drawSeriesMarker(d3.select(this), data, xfield, d, x, y);
		});

	data_series_markers 	
		.attr("class",
			function (d, i) {
			return 'series' + i;
		})
		.classed('data-markers',true)
		.each(function (d) {
			drawSeriesMarker(d3.select(this), data, xfield, d, x, y);
		});
	data_series_markers 	
		.exit().remove();
	
}

function drawSeriesObject(data, xfield, yfield,xlabel,ylabel) {
	var topmargin = 40;
	var leftmargin = 80;
	
	var ymax = -1e12
	var ymin = 1e12;
	
	var ploth=h-2*topmargin;
	var plotw=w-2*leftmargin;
		
	data.forEach( function (series) {
 		var ymaxi = d3.max(series.data, function (d) {
				return d[yfield]
			});
		var ymini = d3.min(series.data, function (d) {
				return d[yfield]
			});
		ymax = ymaxi > ymax ? ymaxi : ymax;
		ymin = ymini < ymin ? ymini : ymin;
	});


	var xmax = -1e12
	var xmin = 1e12;
		
	data.forEach( function (series) {
 		var xmaxi = d3.max(series.data, function (d) {
				return xfield(d)
			});
		var xmini = d3.min(series.data, function (d) {
				return xfield(d)
			});
		xmax = xmaxi > xmax ? xmaxi : xmax;
		xmin = xmini < xmin ? xmini : xmin;
	});
	if(ymin==ymax) {
		ymin=ymin-1;
		ymax=ymax+1;
	}

			
	var x = d3.scale.linear().range([0, plotw]).domain([xmin, xmax]).nice();
	var y = d3.scale.linear().range([ploth , 0]).domain([ymin, ymax]).nice();
	
	var xAxis = d3.svg.axis().scale(x).tickSize(ploth).tickPadding(10).ticks(7);
	var yAxis = d3.svg.axis().scale(y).orient('left').tickSize(-plotw).tickPadding(10);
	var t = null;
	
	svg = d3.select('#chart').select('svg').select('g');
	if (svg.empty()) {
		svg = d3.select('#chart')
			.append('svg:svg')
			.attr('width', w)
			.attr('height', h)
			.attr('class', 'viz')
			.append('svg:g')
			.attr('transform', 'translate(' + leftmargin + ',' + topmargin + ')');
	}
	
	t = svg.transition().duration(transitionDuration);
	
	// y ticks and labels
	if (!yAxisGroup) {
		yAxisGroup = svg.append('svg:g')
			.attr('class', 'yTick')
			.call(yAxis);
		


	} else {
		t.select('.yTick').call(yAxis);
	}
	var center=[0, ploth/2];
	var label=svg.selectAll(".yaxisLabel").data([ylabel]);  
	label.enter().append("text");
	label.classed("yaxisLabel",true)
	  .attr("x",center[0])
	  .attr("y",center[1])
	  .attr("dy", "-5em")
	  .attr("transform","rotate(-90 " + center[0] + " " + center[1] + ")")
	  .attr("text-anchor", "middle")
	  .text(ylabel);
	
	// x ticks and labels
	if (!xAxisGroup) {
		xAxisGroup = svg.append('svg:g')
			.attr('class', 'xTick')
			.call(xAxis);

	} else {
		t.select('.xTick').call(xAxis);
	}
	var center=[plotw/2, ploth];
	label=svg.selectAll(".xaxisLabel").data([xlabel]);
	label.enter().append("text");
	label
	  .classed("xaxisLabel",true)
	  .attr("x",center[0])
	  .attr("y",center[1])
	  .attr("dy", "3em")
	  .attr("text-anchor", "middle")
	  .text(xlabel);

	if (!dataLinesGroup) {
		dataLinesGroup = svg.append('svg:g');
	}
	
	datalines = dataLinesGroup.selectAll('g .data-lines')
		.data(data);
		
		datalines 
		.enter().append('g')
		.attr("class",
			function (d, i) {
			return 'series' + i;
		})
		.classed('data-lines',true)
		.each(function (series) {
			drawSeriesLine(d3.select(this), series.data, xfield, yfield, x, y);
		});

		datalines 
		.attr("class",
			function (d, i) {
			return 'series' + i;
		})
		.classed('data-lines',true)
		.each(function (series) {
			drawSeriesLine(d3.select(this), series.data, xfield, yfield, x, y);
		});

	  datalines 	
		.exit().remove();


	if (!dataMarkersGroup) {
		dataMarkersGroup = svg.append('svg:g');
	}
					
	data_series_markers = dataMarkersGroup.selectAll('g .data-markers')
		.data(data);
		
	data_series_markers 	
		.enter().append('g')
		.attr("class",
			function (d, i) {
			return 'series' + i;
		})
		.classed('data-markers',true)
		.each(function (series) {
			drawSeriesMarker(d3.select(this), series.data, xfield, yfield, x, y);
		});

	data_series_markers 	
		.attr("class",
			function (d, i) {
			return 'series' + i;
		})
		.classed('data-markers',true)
		.each(function (series) {
			drawSeriesMarker(d3.select(this), series.data, xfield, yfield, x, y);
		});
	data_series_markers 	
		.exit().remove();
	
}

var synchronizedMouseOver = function() {
  var series = d3.select(this);
//  var indexValue = series.attr("index_value");
//
//  var barSelector = "." + "bars-" + chartID + "-bar-" + indexValue;
//  var selectedBar = d3.selectAll(barSelector);
//  selectedBar.style("fill", "Maroon");
//
//  var bulletSelector = "." + "bars-" + chartID + "-legendBullet-" + indexValue;
//  var selectedLegendBullet = d3.selectAll(bulletSelector);
//  selectedLegendBullet.style("fill", "Maroon");
//
//  var textSelector = "." + "bars-" + chartID + "-legendText-" + indexValue;
//  var selectedLegendText = d3.selectAll(textSelector);
//  selectedLegendText.style("fill", "Maroon");
};

var synchronizedMouseOut = function() {
  var series = d3.select(this);
//  var indexValue = series.attr("index_value");
// 
//  var barSelector = "." + "bars-" + chartID + "-bar-" + indexValue;
//  var selectedBar = d3.selectAll(barSelector);
//  var colorValue = selectedBar.attr("color_value");
//  selectedBar.style("fill", colorValue);
// 
//  var bulletSelector = "." + "bars-" + chartID + "-legendBullet-" + indexValue;
//  var selectedLegendBullet = d3.selectAll(bulletSelector);
//  var colorValue = selectedLegendBullet.attr("color_value");
//  selectedLegendBullet.style("fill", colorValue);
// 
//  var textSelector = "." + "bars-" + chartID + "-legendText-" + indexValue;
//  var selectedLegendText = d3.selectAll(textSelector);
//  selectedLegendText.style("fill", "Blue");
};

var legend=null;
function drawSeriesLegend(data) {
	var legendw = 250,
	legendh = '100%';

	var margin = 10,
		lineh = 20,
		legendOffset = 0;
        var legendBulletOffset = 30;
        var legendTextOffset = 20;	
	
	legend = d3.select('#legend').select('svg').select('g');
	if (legend.empty()) {
		legend = d3.select('#legend')
			.append('svg:svg')
			.attr('width', legendw)
			.attr('height', legendh)
			.attr('class', 'legend')
			.append('svg:g')
			.attr('transform', 'translate(' + margin + ',' + margin + ')');
	}
	//legend = d3.select('#legend').select('svg').select('g');

	
  // Create legend entries
	var legend_series=legend.selectAll("g")
		.data(data);

	var new_legend_series=legend_series.enter().append("g")
	.attr("class",
		function (d, i) {
		return 'series' + i;
	})
	.classed('legend-entry',true);
		
	new_legend_series.append("svg:circle") // Append circle elements
	  .attr("cx", legendBulletOffset)
	  .attr("cy", function(d, i) { return legendOffset + (i+0.5)*lineh; } )
	  .classed('data-point',true)
	  .attr("index_value", function(d, i) { return "index-" + i; })
	  .attr("r", markerRadius)
	  .on('mouseover', synchronizedMouseOver)
	  .on("mouseout", synchronizedMouseOut);
	
	new_legend_series.append("text")
	  .attr("text-anchor", "center")
	  .attr("x", legendBulletOffset + legendTextOffset)
	  .attr("y", function(d, i) { return legendOffset + (i+0.5)*lineh; } )
	  .attr("dx", 0)
	  .attr("dy", "5px") // Controls padding to place text above
	  .text(function(d) { 
		var txt="";
		d.keys.forEach(function (d) {
			txt=txt+ " "+d.name+":"+d.value+";"; 
			});
		return txt;})
	  .on('mouseover', synchronizedMouseOver)
	  .on("mouseout", synchronizedMouseOut);
	
	legend_series.exit().remove();
	
	legend_series.select("text")
	  .attr("x", legendBulletOffset + legendTextOffset)
	  .attr("y", function(d, i) { return legendOffset + (i+0.5)*lineh; } )
	  .attr("dx", 0)
	  .attr("dy", "5px") // Controls padding to place text above
	  .text(function(d) { 
		var txt="";
		d.keys.forEach(function (d) {
			txt=txt+ " "+d.name+":"+d.value+";"; 
			});
		return txt;})
	  .on('mouseover', synchronizedMouseOver)
	  .on("mouseout", synchronizedMouseOut);


}