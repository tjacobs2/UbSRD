define(['backbone', 'text!templates/browse.html'], function(Backbone, Template) {

	var Browse = Backbone.View.extend({

		template: _.template(Template),

		initialize: function() {
		},

		render: function(){
			this.$el.html( this.template() );
  		}

	});

	return Browse;
});