define([
	'backbone',
	'text!templates/structure_browser.html',
	'models/structure_collection',
	'models/interaction_types',
	'models/ubq_types',
	'views/structure_list',
	'ladda'
], function(
	Backbone,
	Template,
	StructureCollection,
	InteractionTypes,
	UblTypes,
	StructureListView,
	Ladda
){

	var StructureBrowser = Backbone.View.extend({

		template: _.template(Template),

		initialize: function() {
			console.log("Structure browser init");
			_.bindAll(this, 'filter_structures', 'update_table', 'render');

			this.interaction_types = new InteractionTypes([], {});
			this.interaction_types.fetch({
				success: this.render
			});

			this.ubl_types = new UblTypes([], {});
			this.ubl_types.fetch({
				success: this.render
			});

			var structures = new StructureCollection([], {});
			this.list_view = new StructureListView({ collection: structures });
		},

		onClose: function() {
			this.list_view.remove();
			this.list_view.unbind();
		},

  		events: {
   			'click #filter' : 'filter_structures',
  		},

		render: function(){
			console.log(this.ubl_types.models);
			this.$el.html( this.template({
				interaction_types: this.interaction_types.models,
				ubl_types: this.ubl_types.models
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
