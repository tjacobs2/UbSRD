define([
		'backbone',
		'phylogram',
		'models/structure_collection',
		'text!templates/phylogony.html',
		'text!templates/structure_list.html'
		],
		function(Backbone, d3, StructureCollection, Template, ListTemplate) {

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

	var Phylogony = Backbone.View.extend({

		template: _.template(Template),
		list_template: _.template(ListTemplate),
		initialized: false,

		initialize: function() {
			this.listenTo(this.collection, 'reset', this.update_table);
			_.bindAll(this, 'build_phylogram', 'node_click', 'reset_collection');
		},

		events: {
			// 'click g.node' : 'node_click',
   			'click .structure_row' : 'row_click'
		},

		render: function(){
			this.$el.html( this.template() );
			$.get('/api/phylo', this.build_phylogram);
  		},

  		update_table: function() {
			$('#structure_list').html( this.list_template( { structures: this.collection.models } ));
		    $('html, body').animate({
		        scrollTop: $("#structure_table").offset().top
		    }, 1000);
  		},

  		row_click: function(ev) {
			var struct_id = $(ev.currentTarget).find('td').html();
			document.location.href = '#view/' + struct_id;
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
				success: this.reset_collection
			});
  		},

		reset_collection: function(collection, response) {
			this.collection.reset(collection.models);
		}

	});

	return Phylogony;
});