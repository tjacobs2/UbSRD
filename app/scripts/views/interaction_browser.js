//define(['backbone', 'models/structure_collection', 'text!templates/structure_browser.html', 'text!templates/structure_list.html'], function(Backbone, StructureCollection, Template, ListTemplate) {
define([
		'backbone',
		'text!templates/interaction_browser.html',
		'models/residue_interactions',
		'views/interaction_list'
	],
	function(
		Backbone,
		Template,
		ResidueInteractions,
		InteractionListView
	){

	var InteractionsBrowserView = Backbone.View.extend({

		template: _.template(Template),

		initialize: function() {
			var interactions = new ResidueInteractions([], {});
			this.list_view = new InteractionListView({ collection: interactions });
			_.bindAll(this, 'filter_interactions', 'update_table');
		},

		onClose: function() {
			this.list_view.remove();
			this.list_view.unbind();
		},

  		events: {
   			'click #filter' : 'filter_interactions',
  		},

		render: function(){
			this.$el.html( this.template() );
  		},

  		filter_interactions: function() {
  			var options = {};
			options.ubq_nums = [];
			options.ubq_nums.push($('#ubq_resnums').val());
	    	var new_interactions = new ResidueInteractions([], options);
			new_interactions.fetch({
				success: this.update_table
			});
  		},

		update_table: function(collection, response) {
			this.list_view.collection.reset(collection.models)
			$('#structure_list').html( this.list_view.el );
		    $('html, body').animate({
		        scrollTop: $("#structure_list").offset().top
		    }, 1000);
		}

	});

	return InteractionsBrowserView;
});