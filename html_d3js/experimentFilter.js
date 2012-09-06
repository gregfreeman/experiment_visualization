function experimentFilter() {
	var parameters = {
		add : add,
		data : data,
		dimension : dimension,
		filter : filter,
		series : series,
		dependent : dependent
	};
	
	var data = [], // the records
	dimensions = [];
	
	// Adds the specified new records to this crossfilter.
	function add(newData) {
		data.push(newData)
		return parameters;
	}
	
	function data(newData) {
		data = newData;
		return parameters;
	}
	
	// Adds a new dimension with the specified value accessor function.
	function dimension(field, values, selector) {
		
		selector || function (d) {
			return d[field];
		}
		
		var dimension = {
			field : field,
			values : values,
			selector : selector,
			setfilter : setfilter,
			getfilter : getfilter,
			apply_filter : apply_filter,
			apply_group : apply_group
		},
		pick = [];
		
		dimensions.push(dimension);
		
		function setfilter(d) {
			console.log("setting pick for dimension " + dimension + " to " + d);
			pick = d;
		}
		
		function getfilter() {
			return pick;
		}
		
		function apply_filter(filtered) {
			console.log("filtering	dimension " + dimension);
			
			if (pick != "all" && pick != "mean" && pick != "dependent") {
				filtered = filtered.filter(function (d) {
						return selector(d) == pick;
					});
			}
			return filtered;
		}
		
		function apply_group(nestor) {
			console.log("grouping dimension " + this);
			var k = 0;
			if (pick != "mean" && pick != "dependent") {
				nestor.key(this.selector);
				k = 1;
			}
			return k;
		}
		
		return dimension;
	};
	
	// Filters this dimension using the specified range, value, or null.
	// If the range is null, this is equivalent to filterAll.
	// If the range is an array, this is equivalent to filterRange.
	// Otherwise, this is equivalent to filterExact.
	function filter() {
		filtered = data;
		dimensions.forEach(function (d) {
			console.log("filtering	dimension " + d);
			filtered = d.apply_filter(filtered);
		});
		var nestor = d3.nest(),
		k = 0;
		dimensions.forEach(function (d) {
			k = k + d.apply_group(nestor);
		});
		
		var grouped = nestor.entries(filtered);
		return {
			groups : grouped,
			levels : k
		};
	}
	
	function apply_mean(a) {
		console.log('applying aggregator');
		
		// group by dependent variable
		var dep_nest = d3.nest();
		dep_nest.key(function (d) {
			return d.settings[dependent()];
		});
		dep_nest.sortKeys(function (x, y) {
			return parseFloat(x) - parseFloat(y);
		});
		var dep_groups = dep_nest.entries(a);
		
		var a2 = dep_groups.map(function (x) {
				var y = {
					settings : {}
					
				};
				y.settings[dependent()] = x.key;
				// iterate through keys for first object
				d3.keys(x.values[0]).forEach(function (key) {
					console.log(key + ": " + x.values[0][key] + ";");
					// if first value is numeric compute mean for array
					if (isNumeric(x.values[0][key])) {
						var sum = d3.sum(x.values, function (d) {
								return d[key];
							});
						y[key] = sum / a.length;
					}
				});
				return y;
			});
		return a2;
	}
	
	function series() {
		filtered = data;
		groups = [];
		means = [];
		dimensions.forEach(function (d) {
			console.log("filtering	dimension " + d);
			filtered = d.apply_filter(filtered);
		});
		var nestor = d3.nest(),
		k = 0;
		dimensions.forEach(function (d) {
			isgroup = d.apply_group(nestor);
			k = k + isgroup;
			if (isgroup) {
				groups.push(d);
			}
			if (d.getfilter() == "mean") {
				means.push(d);
			}
		});
		
		if (means.length > 0) {
			nestor.rollup(apply_mean);
		} else {
			nestor.rollup(null);
		}
		
		var grouped = nestor.entries(filtered);
		if (k > 0) {
			series = flatten(grouped, groups, [], k);
		} else {
			series = [{
					data : grouped,
					keys : []
				}
			];
		}
		
		return series;
	}
	
	function dependent() {
		xfield = [];
		dimensions.forEach(function (d) {
			if (d.getfilter() == "dependent") {
				xfield = d.field;
			}
		});
		
		return xfield;
	}
	
	return parameters;
}

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function flatten(grouped, groups, keys, left) {
	var items = [];
	var field = groups[0].field;
	
	//  console.log("flatten field  "+field+ " left "+ left );
	
	grouped.forEach(function (d, idx) {
		//		console.log("flatten field  "+field+ " with value "+ d.key+" left "+ left );
		
		keys2 = keys.slice();
		keys2.push({
			name : field,
			value : d.key
		});
		if (left > 1) {
			f = flatten(d.values, groups.slice(1, left + 1), keys2, left - 1)
				items = items.concat(f);
		} else {
			items.push({
				keys : keys2,
				data : d.values
			});
		}
		
	});
	
	return items;
}