define([
	'backbone',
	'text!templates/structure_browser.html',
	'models/structure_collection',
	'models/interaction_types',
	'views/structure_list'
], function(
	Backbone,
	Template,
	StructureCollection,
	InteractionTypes,
	StructureListView
){

	var StructureBrowser = Backbone.View.extend({

		template: _.template(Template),

		initialize: function() {
			console.log("Structure browser init");
			_.bindAll(this, 'filter_structures', 'update_table');

			this.interaction_types = new InteractionTypes([], {});
			//var self = this;
			this.interaction_types.fetch({
				success: this.render
			});
			console.log(this.interaction_types.models);

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
			this.$el.html( this.template({
				interaction_types: this.interaction_types.models
			}) );
			this.list_view.$el = this.$('#structure_list');
			this.list_view.render();
  		},

  		filter_structures: function() {
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
			//$('#structure_list').html( this.list_view.el );
		    $('html, body').animate({
		        scrollTop: $("#structure_list").offset().top
		    }, 1000);
  		}

	});

	return StructureBrowser;
});
