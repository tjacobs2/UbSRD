define([
	'backbone',
	'd3.phylogram',
	'text!templates/phylogeny.html',
	'models/structure_collection',
	'views/structure_list'
], function(
	Backbone,
	d3,
	Template,
	StructureCollection,
	StructureListView
){

	var findLeaves = function(children) {
		console.log(children);
		var leaves = [];
		$.each(children, function(index, child) {
		  if(child.children) {
		    leaves.push.apply(leaves, findLeaves(child.children));
		  }
		  else {
		  	console.log(child);
		    leaves.push(child.name);
		  }
		});
		return leaves;
	};

	var phylogeny = Backbone.View.extend({

		template: _.template(Template),

		initialize: function() {
			_.bindAll(this, 'build_phylogram', 'node_click', 'update_table');
			var structures = new StructureCollection([], {});
			this.list_view = new StructureListView({ collection: structures });
		},

		onClose: function() {
			this.list_view.remove();
			this.list_view.unbind();
		},

		// events: {
		// 	// 'click g.node' : 'node_click',
  //  			'click .structure_row' : 'row_click'
		// },

		render: function(){
			this.$el.html( this.template() );
			$.get('/ubsrd/api/phylo', this.build_phylogram);
			this.list_view.$el = this.$('#structure_list');
			this.list_view.render();
  		},

  		build_phylogram: function(tree_data) {
			var phylogram = d3.phylogram.build('#phylogram', tree_data, {
		       skipLabels: false,
		       //width: 1000,
		       height: 1200
			});
			//Don't use backbones click event because it doesn't have the children
			//info we need for getting PDB names. This is supplied by the D3 layout
			//and not present just in the DOM
			phylogram.vis.selectAll('g.node').on('click', this.node_click);
  		},

  		node_click: function(n) {
  			var options = {};
		    options.pdb_codes = findLeaves(n.children);
  			console.log(options.pdb_codes);
	    	var new_structures = new StructureCollection([], options);
			new_structures.fetch({
				success: this.update_table
			});
  		},

  		update_table: function(collection, response) {
			this.list_view.collection.reset(collection.models)
			this.list_view.delegateEvents();
		    $('html, body').animate({
		        scrollTop: $("#structure_list").offset().top
		    }, 1000);
  		}

	});

	return phylogeny;
});
