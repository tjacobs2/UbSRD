define([
	'backbone',
	'text!templates/interaction_list.html'
	],
	function(
		Backbone,
		Template
	) {

	var InteractionListView = Backbone.View.extend({

		template: _.template(Template),

		initialize: function() {
			this.listenTo(this.collection, 'reset', this.render);
		},

  		events: {
   			'click .structure_row' : 'select_structure'
  		},

		render: function(){
			this.$el.html( this.template( { structures: this.collection.models } ) );
  		},

  		select_structure: function(ev){
			var struct_id = $(ev.currentTarget).find('td').html();
			document.location.href = '#view/' + struct_id;
  		}

	});

	return InteractionListView;
});