define([
	'backbone',
	'text!templates/structure_browser.html',
	'models/structure_collection',
	'models/interaction_types',
	'models/ubq_types',
	'models/target_types',
	'models/chain_types',
	'views/structure_list',
	'ladda'
], function(
	Backbone,
	Template,
	StructureCollection,
	InteractionTypes,
	UblTypes,
	TargetTypes,
	ChainTypes,
	StructureListView,
	Ladda
){

	var StructureBrowser = Backbone.View.extend({

		template: _.template(Template),

		initialize: function() {
			var structures = new StructureCollection([], {});
			this.list_view = new StructureListView({ collection: structures });

			this.interaction_types = new InteractionTypes([], {});
			this.interaction_types.fetch({async:false});

			this.ubl_types = new UblTypes([], {});
			this.ubl_types.fetch({async:false});
			
			this.target_types = new TargetTypes([], {});
			this.target_types.fetch({async:false});

			this.chain_types = new ChainTypes([], {});
			this.chain_types.fetch({async:false});
			
			_.bindAll(this, 'filter_structures', 'update_table', 'render');
		},

		onClose: function() {
			this.list_view.remove();
			this.list_view.unbind();
		},

  		events: {
   			'click #filter' : 'filter_structures'
  		},

		render: function(){
			console.log(this.ubl_types.models);
			this.$el.html( this.template({
				interaction_types: this.interaction_types.models,
				ubl_types: this.ubl_types.models,
				target_types: this.target_types.models,
				chain_types: this.chain_types.models
			}) );
			this.list_view.$el = this.$('#structure_list');
			this.list_view.render();
  		},

  		filter_structures: function() {
			var button = $('#filter')[0];
  			this.spinner = Ladda.create(button);
  			this.spinner.start();

  			var options = {};
			options.interaction_types = [];
			$('#interaction_types :checked').each(function() {
       			options.interaction_types.push($(this).val());
     		});

			options.ubl_types = [];
			$('#ubl_types :checked').each(function() {
       			options.ubl_types.push($(this).val());
     		});

			options.target_types = [];
			$('#target_types :checked').each(function() {
       			options.target_types.push($(this).val());
     		});
	    	
			options.chain_types = [];
			$('#chain_types :checked').each(function() {
       			options.chain_types.push($(this).val());
     		});

			
			var structures = new StructureCollection([], options);
			structures.fetch({
				success: this.update_table
			});
  		},

  		update_table: function(collection, response) {
			this.list_view.collection.reset(collection.models)
			this.list_view.delegateEvents();
  			this.spinner.stop();
		    $('html, body').animate({
		        scrollTop: $("#structure_list").offset().top
		    }, 1000);
  		}

	});

	return StructureBrowser;
});
