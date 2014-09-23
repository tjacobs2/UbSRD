define(['backbone', 'd3', 'text!templates/examples.html'], function(Backbone, d3, Template) {

	var Examples = Backbone.View.extend({

		template: _.template(Template),

		initialize: function() {
		},

		render: function(){
			var el = this.$el
			el.html( this.template() );

			//Make a call to the DB here
			$.getJSON( "api/structures", function( structures ) {
				//Render d3 here
				var width = 500;
				var height = 500;

				var formatCount = d3.format(",.0f");

				//Create the histogram data (30 instances of x, dx, and y)
				var histogram_data = d3.layout.histogram()
					.bins(30)
					.value( function(structure) {
						return structure.total_residue;
					})
					(structures);

				var x = d3.scale.linear()
					.domain([0, d3.max(histogram_data, function(d) { return d.x + d.dx; })])
					.range([0, width]);

				var y = d3.scale.linear()
					.domain([0, d3.max(histogram_data, function(d) { return d.y; })])
					.range([height, 0]);

				//Create a group for each histogram bin
				var svg = d3.select("#main").append("svg")
				    .attr("width", width+40)
				    .attr("height", height+40)
				  .append("g")

				var bar = svg.selectAll(".bar")
				    .data(histogram_data)
				  .enter().append("g")
				    .attr("class", "bar")
			    	.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

				bar.append("rect")
				    .attr("class", "bar")
				    .attr("width", function(d){ return x(d.dx)-1; })
				    .attr("height", function(d){ return height - y(d.y) })
				    //.attr("transform", function(d){ return "translate(" + x(d.x) + ",0)" })
				    //.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

				bar.append("text")
				    .attr("dy", ".75em")
				    .attr("y", 6)
				    .attr("x", x(histogram_data[0].dx) / 2)
				    .attr("text-anchor", "middle")
				    .text(function(d) { console.log(d.y); return formatCount(d.y); });

				var xAxis = d3.svg.axis()
				    .scale(x)
				    .orient("bottom");

				svg.append("g")
				    .attr("class", "x axis")
				    .attr("transform", "translate(0," + height + ")")
				    .call(xAxis);

			});

  		}

	});

	return Examples;
});