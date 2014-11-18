define(['backbone', 'models/structure_collection', 'text!templates/phylogony.html', 'text!templates/structure_list.html'], function(Backbone, StructureCollection, Template, ListTemplate) {

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
		list_template: _.template(ListTemplate),
		initialized: false,

		initialize: function() {
			this.listenTo(this.collection, 'reset', this.render);
			_.bindAll(this, 'build_phylogram', 'node_click', 'reset_collection');
		},

		render: function(){

			var phylogram = {}
			if(!this.initialized) {
				this.$el.html( this.template() );
				$.get('/api/phylo', this.build_phylogram);
			}
			$('#structure_list').html( this.list_template( { structures: this.collection.models } ));
			this.initialized = true;
  		},

  		build_phylogram: function(tree_data) {
			var phylogram = d3.phylogram.build('#phylogram', tree_data, {
		       skipLabels: false,
		       //width: 1000,
		       height: 1200
			});
			phylogram.vis.selectAll('g.node').on('click', this.node_click);
  		},

  		node_click: function(n) {
  			console.log(this);
  			var options = {};
		    options.pdb_codes = findLeaves(n.children);
  			console.log(options.pdb_codes);
	    	var new_structures = new StructureCollection([], options);
			new_structures.fetch({
				success: this.reset_collection
			});
		    $('html, body').animate({
		        scrollTop: $("#structure_table").offset().top
		    }, 1000);
  		},

		reset_collection: function(collection, response) {
			this.collection.reset(collection.models);
		}

	});

	return Phylogony;
});