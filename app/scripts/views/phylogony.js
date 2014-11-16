define(['backbone', 'text!templates/phylogony.html'], function(Backbone, Template) {

	var findLeaves = function(children) {
		var leaves = [];
		$.each(children, function(index, child) {
		  if(child.children) {
		    leaves.push.apply(leaves, findLeaves(child.children));
		  }
		  else {
		    leaves.push(child.name);
		  }
		});
		return leaves;
	};

	var Phylogony = Backbone.View.extend({

		template: _.template(Template),

		initialize: function() {
		},

		render: function(){
			this.$el.html( this.template() );
			$.get('/api/phylo', function(tree_data) {
			var phylogram = d3.phylogram.build('#phylogram', tree_data, {
			       skipLabels: false,
			       //width: 1000,
			       height: 1200
			});
			console.log(phylogram);
			phylogram.vis.selectAll('g.node')
			  .on('click', function(n) { 
			    leaves = findLeaves(n.children);
			    document.location.href = '#browse/phylogony/' + leaves.join(',');
			  })
			});
  		}

	});

	return Phylogony;
});