//define(['backbone', 'models/structure_collection', 'text!templates/structure_browser.html', 'text!templates/structure_list.html'], function(Backbone, StructureCollection, Template, ListTemplate) {
define([
		'backbone',
		'text!templates/interaction_browser.html',
		'models/interactions',
		'views/interaction_list',
		'ladda'
	],
	function(
		Backbone,
		Template,
		ResidueInteractions,
		InteractionListView,
		Ladda
	){

	var InteractionsBrowserView = Backbone.View.extend({

		template: _.template(Template),

		initialize: function() {
			var interactions = new ResidueInteractions([], {});
			this.list_view = new InteractionListView({ collection: interactions });
			_.bindAll(this, 'filter_interactions', 'update_table', 'render');
		},

		onClose: function() {
			this.list_view.remove();
			this.list_view.unbind();
		},

  		events: {
   			'click #filter' : 'filter_interactions'
  		},

		render: function(){
			this.$el.html( this.template() );
			this.list_view.$el = this.$('#structure_list');
			this.list_view.render();
  		},

  		filter_interactions: function() {
			var button = $('#filter')[0];
  			this.spinner = Ladda.create(button);
  			this.spinner.start();

  			var options = {};
			options.ubq_nums = this.parse_residue_numbers($('#ubq_resnums').val());
			options.ubl_type = $('input[name=ubl_type]:checked').val()
			console.log(options.ubq_nums);
	    	console.log(options.ubl_type);
			var new_interactions = new ResidueInteractions([], options);
			new_interactions.fetch({
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
		},


		parse_residue_numbers: function(values) {
			var ubq_nums = [];
			var tokens = values.split(',');
			_.each(tokens, function(token) {
				token = token.trim();
				if(token.indexOf('-') == -1) {
					ubq_nums.push(token);
				}
				else {
					var first = token.split('-')[0];
					var last = token.split('-')[1];
					console.log(first);
					console.log(last);
					for (i = first; i <= last; ++i) {
						ubq_nums.push(i);
					}
				}
			});
			return ubq_nums;
		}

	});

	return InteractionsBrowserView;
});
