define(['backbone', 'd3', 'text!templates/examples.html'], function(Backbone, d3, Template) {

	var Examples = Backbone.View.extend({

		template: _.template(Template),

		initialize: function() {
		},

		render: function(){
			var el = this.$el
			el.html( this.template() );

			//Make a call to the DB here
			$.getJSON( "/ubsrd/api/example1", function( data ) {
				console.log(data);
			    var margin = {top: 20, right: 20, bottom: 70, left: 40},
			    	width = 600 - margin.left - margin.right,
			    	height = 300 - margin.top - margin.bottom;

			    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

			    //Inverse y scale
			    var y = d3.scale.linear().range([height, 0]);

			    var xAxis = d3.svg.axis()
				    .scale(x)
				    .orient("bottom");

				var yAxis = d3.svg.axis()
				    .scale(y)
				    .orient("left")
				    .ticks(10);

				var svg = d3.select("#example1_plot").append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				  .append("g")
				    .attr("transform", 
				          "translate(" + margin.left + "," + margin.top + ")");

				x.domain(data.map(function(d) { return d.inter_type; }));
  				y.domain([0, d3.max(data, function(d) { return d.count; })]);

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
			      .text("Count");

			  	svg.selectAll("bar")
			      .data(data)
			    .enter().append("rect")
			      .style("fill", "steelblue")
			      .attr("x", function(d) { return x(d.inter_type); })
			      .attr("width", x.rangeBand())
			      .attr("y", function(d) { return y(d.count); })
			      .attr("height", function(d) { return height - y(d.count); });
			});

  		}

	});

	return Examples;
});
