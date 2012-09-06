
function makeArray(x)
{
	if (x instanceof Array) {
		y=x;
	} else {
		y=[x];
	}
	return y;
}

function markerTipsy(data)  {
	$('svg circle').tipsy({ 
        gravity: 'w', 
        delayOut: 2000,
        delayIn: 250,
        html: true, 
        title: function() {
          var d = this.__data__;          
          var str='';
          if(d)
          {
          	d3.keys(d.settings).forEach( function (key,idx) {
          		if(idx>0) {
          			str=str + '<br/>';
          		}         		
          		str = str + key + ': ' + d.settings[key] ;
          	});
        		if( d.hasOwnProperty('links')) {
        			makeArray(d.links).forEach( function (link,idx) {
          		str = str + '<br/> <a href="' +link.file + '" target="data2">' + link.name + '</a>' ;          				
        			});
        		}          
        	}
          return str; 
        }
      });
	
	
}

var data=null,
	paramset=null,
	experimentParameters=null,
	val_field=null,
	dimensions=[],
	has_data=0,
	has_parameters=0;
	
function reloadjoin() {
	has_data=0;
	has_parameters=0;
	d3.json("paramset.json", function(json) {
		paramset = makeArray(json);
		experimentParameters=experimentFilter();
		paramset.forEach( function (param) {
			console.log("add dimension "+ param);
			var newDimension=experimentParameters.dimension(param.field,param.values,function (d) {
				var x=NaN;
				if(-1 == d3.keys(d).indexOf('settings'))
				{
					console.log('data does not have settings' + d);
				}
				else
				{
					if( d.settings == null ) 
					{
						console.log('data settings is null');
					}
					else
					{
						x=d.settings[param.field];
					}
				}
				return x;
				//return d.settings[param.field];
			  });
			dimensions.push(newDimension);
		  });
		  has_parameters=1;
		  refreshFiltered();
		});

	d3.json("results.json", function(json) {
		data = json;

		has_data=1;
		refreshFiltered();	
		});
}


function refreshFiltered() {
	if(has_data && has_parameters)
	{
		dimension_options(paramset,data);
		experimentParameters.data(data);
		var series=experimentParameters.series();
		
		var dependent=function (d) {
			var x=NaN;
			if(-1 == d3.keys(d).indexOf('settings'))
			{
				console.log('data does not have settings' + d);
			}
			else
			{
				if( d.settings == null ) 
				{
					console.log('data settings is null');
				}
				else
				{
					x=d.settings[experimentParameters.dependent()];
				}
			}
			return x;
//			return d.settings[experimentParameters.dependent()];
			};
		
		console.log('series '+ series + ' with length '+	series.length);
				
		drawSeriesObject(series,dependent,val_field,experimentParameters.dependent(),val_field);
		drawSeriesLegend(experimentParameters.series());
		markerTipsy(data);
	}

}

function reload() {
	d3.json("results.json", function(json) {
		  data = json;
		  refresh();
				  
		});
}

reloadjoin();


function dimension_options(parmset,results) {
	var group = d3.select("div#dimension-options");
	
	var pickers=[];
	//var div=d3.selectall("div#dimension-options div")
	var div=group.selectAll("div")
	.data(parmset)
	.enter().append("div")
	.classed("dataform",true);
	
	div.text( function (d) {
		return d.field+":";
	});
	
	div.append("br");
	div.append("select")
		//.attr("size",function (d) {
		//	pickers.push(this);
		//	return d.values.length+3;} )
		.on("click",function (d,i) {
			var idx=i;
			var val=$(this).val();
			dimensions[idx].setfilter(val);
			refreshFiltered();
			})
		.selectAll("option")
		.classed("dataform",true)
		.data( function (d) {
			console.log("add field "+d.field);
			var list=d.values.slice();
			list.push("all");
			list.push("mean");
			list.push("dependent");		
			return list;
			})
		.enter()
		.append("option")
		.text(function (val) {
			 console.log("add value "+val);
			return ""+val;
			});
		
	// initialize pickers
	pickers.forEach( function (d,i) {
		if(i==0) {
			$(d).val("dependent");
			dimensions[i].setfilter("dependent");
		} else {
			var first = dimensions[i].values[0];
			$(d).val(first);
			dimensions[i].setfilter(first);						
			//$(d).val("all");
			//dimensions[i].setfilter("all");			
		}
	});
	
	var values=[];
	d3.keys(results[0]).forEach(function (key) {
		if(key != "settings") {
			values.push(key);
		}
	});
	var value_div=group.select("#value_pick_div");
	if(value_div.empty()) {
		value_div=group.append("div")
			.attr("id","value_pick_div")
			.attr("class","dataform");
		value_div.text("Value:");	
		value_div.append("br");
		var select=value_div.append("select");
		//select.attr("size",values.length)
			select.on("click",function (d,i) {
				var idx=i;
				var val=$(this).val();
				val_field=val;
				refreshFiltered();
				})
			.selectAll("option").data(values)
			.enter().append("option")
			.text(function (val) {
				 console.log("add value "+val);
				return val;
				});
		var first_val=d3.keys(results[0])[0];
		$(select[0]).val(first_val);
		val_field=first_val;
	}
}
