define(['backbone', 'text!templates/interactions.html'], function(Backbone, Template) {

	var Interactions = Backbone.View.extend({

		template: _.template(Template),

		initialize: function() {
		},

		render: function(){
			this.$el.html( this.template( { structures: this.collection } ) );
  		}

	});

	return Interactions;
});